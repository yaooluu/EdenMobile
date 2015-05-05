//  Copyright (c) 2014 Thomas Baker
//  
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//  
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//  
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

(function ($, window, document, undefined) {
    "use strict";

    var forms = {
        "vehicle-form": {
            form_path: "/vehicle/vehicle/create.s3json?options=true&references=true",
            form_record: "$_vehicle_vehicle"
        },
        "gis-location-form": {
            form_path: "/gis/location/create.s3json?options=true&references=true",
            form_record: "$_gis_location"
        }
    };


    var formList = {
        "vehicle": {
            form_path: "/vehicle/vehicle.s3json",
            form_record: "$_vehicle_vehicle",
            page: "page-vehicle"
        }
    };

    var tableRequirements = [
        {
            name: "vehicleTable",
            //tableSpec: vehicleTable,
            req: ["vehicle-form", "gis-location-form"],
            page: "page-vehicle"
        },
        {
            name: "editVehicleForm",
            //tableSpec: vehicleTable,
            req: ["vehicle-form", "gis-location-form"],
            page: "page-edit-vehicle"
        }];

    // The master application controller
    function controller() {
        //console.log("settings controller");
        this._pages = {};
        this._formURL = "/vehicle/vehicle/create.s3json?options=true&references=true";
    };

    controller.prototype.init = function (options) {
        console.log("vehicleController init");

        // Register models for this controller
        for (var formName in forms) {
            app.controller.setControllerByModel(formName, this);
        }
        for (var dataName in formList) {
            app.controller.setControllerByModel(dataName, this);
        }

        // Load the saved data or initialize data
        for (var key in forms) {
            var rawData = app.storage.read(key);
            if (rawData) {
                var data = JSON.parse(rawData);
                this.parseForm(key, data);
            }
        }

        // update all data from server if connected
        this.updateAll();
    };

    controller.prototype.updatePath = function (name) {
        //console.log("settings controller onLoad");
        var path = app.controller.getHostURL();

        var formSpec = forms[name] || formList[name];
        if (formSpec) {
            path += formSpec["form_path"];
        } else {
            alert("nope");
            path = "";
        }


        return path;
    };

    controller.prototype.updateResponse = function (name, data, rawData) {
        //console.log("settings controller updateResponse");
        var formSpec = forms[name];

        // Save form
        if (name.indexOf("-form") >= 0) {
            //this.setFormData(name,data);
            this.parseForm(name, data);
            localStorage.setItem(name, rawData);
        } else {
            this.updateList(name, data);
        }

    };

    controller.prototype.submitPath = function (type) {
        var path = "/vehicle/vehicle.s3json";

        return path;
    };

    controller.prototype.submitResponse = function (status, model, rawData) {

        var type = model.type();
        var response = JSON.parse(rawData);

        if (response["status"] === "success") {

            app.controller.updateData("vehicle");

            // If on new page then close
            var currentPage = app.view.getVisiblePage();
            if (currentPage === app.view.getPage("page-edit-vehicle")) {
                app.view.changePage("page-back");
            }

            // Update list
            if (response.created) {
                model.set("vehicle_id", response.created[0].toString());
            }
            var pageCases = app.view.getPage("page-vehicle");
            if (pageCases) {
                pageCases.setItem(model);
            }

            // Store it locally so it can be use until refresh
            this.storeOffline(model);

        } else {

            if (response.hasOwnProperty("serverResponse") && (response["serverResponse"] === 0)) {
                // The app is offline store the data locally
                //this.storeOffline(model, rawData);
                var currentPage = app.view.getVisiblePage();
                if (currentPage === app.view.getPage("page-new-case")) {
                    app.view.changePage("page-back");
                }
                var page = app.view.getPage("page-cases");
                if (page) {
                    page.setCase(model);
                }

            } else {
                // Parse for error message
                console.log("diseaseController error");
                var message = response["message"];
                var page = app.view.getVisiblePage();
                if (page.clearErrorText) {
                    page.clearErrorText();
                }

                for (var i in response["tree"]) {
                    var record = response["tree"][i];
                    if (Array.isArray(record)) {
                        for (var j = 0; j < record.length; j++) {
                            var recordItem = record[j];

                            // Check to see if there is a message in the error field
                            if (recordItem["@error"]) {
                                message = recordItem["@error"];
                                if (page.addErrorText) {
                                    page.addErrorText(message, {
                                        "status": "alarm"
                                    });
                                }
                            }

                            // Check to see if the sub records have an error message
                            for (var k in recordItem) {
                                var item = recordItem[k];
                                if (item["@error"]) {
                                    message = item["@error"];
                                    if (page.addErrorText) {
                                        page.addErrorText(message, {
                                            "status": "alarm"
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
    };

    //-------------------------------------------------------------------------

    controller.prototype.updateList = function (name, data) {
        console.log("vehicleController: updateList " + name);
        //var page = app.view.getPage("page-cases");
        //var caseStruct = app.controller.getData("case");
        //var serverCases = caseStruct["$_disease_case"];
        var formItem = formList[name];
        var pageName = formItem["page"];
        var page = app.view.getPage(pageName);
        var modelList = app.controller.getRecordCollection("mVehicle");


        // Initialize list server state to detect deleted items
        for (var key in modelList) {
            var model = modelList[key];
            model._serverState = 0;
        }


        // Loop through all data records
        var recordList = data[formItem["form_record"]];
        for (var i = 0; i < recordList.length; i++) {
            var recordItem = recordList[i];
            var uuid = recordItem["@uuid"];
            var timestamp = Date.parse(recordItem["@modified_on"]);
            var model = modelList[uuid];

            if (!model) {
                var modelObj = app.controller.getModel("mVehicle");
                model = new modelObj();
                model.timestamp(1); // force the new data condition to be true
            }
            model._serverState = 1;

            if (model.timestamp() < timestamp) {
                // Get data from case to put in the model
                var formOptions = {};

                // TODO get the model data
                formOptions["rawData"] = recordItem;
                formOptions["uuid"] = uuid;
                for (var key in recordItem) {
                    var item = recordItem[key];
                    if (key.indexOf("$k_") >= 0) {
                        var subkey = key.slice(3);
                        formOptions[subkey] = item["@uuid"];
                    } else if (key.indexOf("@") >= 0) {
                        // Do nothing, this is meta-data
                        continue;
                    } else if (item instanceof Array) {
                        formOptions[key] = item;
                    } else if (typeof item === 'object') {
                        formOptions[key] = item["@value"];
                    } else {
                        formOptions[key] = item;
                    }
                }

                // Put the data into the model
                model.set(formOptions);
                modelList[uuid] = model;
                model.timestamp(timestamp);
                var path = model.getKey();
                app.storage.write(path, JSON.stringify(model));
                page.setItem(model);
            }
        }

    };

    controller.prototype.storeOffline = function (model, rawText) {
        //var page = app.view.getPage("page-cases");
        var path = model.getKey();
        if (!rawText) {
            rawText = JSON.stringify(model.toJSON());
        }
        app.storage.write(path, rawText);
    };


    controller.prototype.loadForm = function (event) {
        console.log("loadForm");
    };

    controller.prototype.parseRecord = function (record) {
        var references = {};

        return references;
    };

    controller.prototype.parseForm = function (name, obj) {
        console.log("vehicleController: parseForm " + name);
        //return;
        // Create a new model if one doesn't already exist
        var formRecordName = forms[name]["form_record"];
        var formRecord = obj[formRecordName][0]["field"];
        var model = app.controller.getForm(name);
        if (!model) {
            var form = app.controller.getModel("formType");
            model = new form({
                "name": name,
                "form": formRecord,
                "obj": obj
            });
            app.controller.addForm(model);
        }

        // Update pages
        for (var i = 0; i < tableRequirements.length; i++) {
            var req = tableRequirements[i];
            var pageName = req["page"];
            var page = app.view.getPage(pageName);
            if (page) {
                page.updateForm(obj);
            }
        }
    };


    controller.prototype.onFormSubmit = function (page, model) {
        page.getData(model);

        // save and submit
        this.storeOffline(model);
        var modelList = app.controller.getRecordCollection("mVehicle");
        modelList[model.timestamp()] = model;

        if (app.controller.online()) {
            app.controller.submitData(model);
        } else {
            app.view.changePage("page-back");
            var page = app.view.getPage("page-cases");
            if (page) {
                page.setCase(model);
            }
        }

    };

    controller.prototype.onUpdateSubmit = function (page) {};

    controller.prototype.updateAll = function () {

        app.controller.updateData(Object.keys(forms));
        app.controller.updateData(Object.keys(formList));
    };

    controller.prototype.newItem = function () {
        var form = app.controller.getForm("vehicle-form");
        var page = app.view.getPage("page-edit-vehicle");
        var pageTable = page._table;
        //var model = new mCaseData(form.get("form"));
        var modelObj = app.controller.getModel("mVehicle");
        var model = new modelObj();
        model.initData(form, page._table);
        //model.timestamp(Date.now());
        form.set("current", model);
        page.showForm(form, model);
    };

    controller.prototype.editItem = function (model) {
        var form = app.controller.getForm("vehicle-form");
        var page = app.view.getPage("page-edit-vehicle");
        form.set("current", model);
        page.showForm(form, model);
        app.view.changePage("page-edit-vehicle");

    };

    app.pluginManager.addObject(controller);

})(jQuery, window, document);