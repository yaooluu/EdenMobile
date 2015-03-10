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
        "shelter-form": {
            form_path: "/cr/shelter/create.s3json?options=true&references=true",
            form_record: "$_cr_shelter"
        },
        "gis-location-form": {
            form_path: "/gis/location/create.s3json?options=true&references=true",
            form_record: "$_gis_location"
        }
    };


    var formList = {
        "shelter": {
            form_path: "/cr/shelter.s3json",
            form_record: "$_cr_shelter",
            page: "page-shelter"
        }
    };

    var tableRequirements = [
        {
            name: "shelterTable",
            //tableSpec: shelterTable,
            req: ["shelter-form", "gis-location-form"],
            page: "page-shelter"
        },
    {
            name: "editShelterForm",
            //tableSpec: shelterTable,
            req: ["shelter-form", "gis-location-form"],
            page: "page-edit-shelter"
        }];

    // The master application controller
    function controller() {
        //console.log("settings controller");
        this._pages = {};
        this._formURL = "/cr/shelter/create.s3json?options=true&references=true";
    };

    controller.prototype.init = function (options) {
        console.log("shelterController init");

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
        var path = "";

        return path;
    };

    controller.prototype.submitResponse = function (status, model, rawData) {

    };

    //-------------------------------------------------------------------------

    controller.prototype.updateList = function (name, data) {
        console.log("shelterController: updateList " + name);
        //var page = app.view.getPage("page-cases");
        //var caseStruct = app.controller.getData("case");
        //var serverCases = caseStruct["$_disease_case"];
        var formItem = formList[name];
        var pageName = formItem["page"];
        var page = app.view.getPage(pageName);
        var modelList = app.controller.getRecordCollection("mShelter");


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
                var modelObj = app.controller.getModel("mShelter");
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
        var page = app.view.getPage("page-cases");
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
        console.log("shelterController: parseForm " + name);
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


    controller.prototype.onFormSubmit = function (page) {

    };

    controller.prototype.onUpdateSubmit = function (page) {

    };

    controller.prototype.updateAll = function () {

        app.controller.updateData(Object.keys(forms));
        app.controller.updateData(Object.keys(formList));
    };

    controller.prototype.newItem = function () {
        var form = app.controller.getForm("shelter-form");
        //var model = new mCaseData(form.get("form"));
        var modelObj = app.controller.getModel("mShelter");
        var model = new modelObj(form.get("form"));
        //model.timestamp(Date.now());
        form.set("current", model);
        var page = app.view.getPage("page-edit-shelter");
        page.showForm(form, model);
    };

    controller.prototype.editItem = function (model) {
        var form = app.controller.getForm("shelter-form");
        var page = app.view.getPage("page-edit-shelter");
        form.set("current", model);
        page.showForm(form, model);
        app.view.changePage("page-edit-shelter");

    };

    app.pluginManager.addObject(controller);

})(jQuery, window, document);