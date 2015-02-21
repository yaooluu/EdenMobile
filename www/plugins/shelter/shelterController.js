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

    var shelterTable = [
        {
            name: "name",
            data_path: "$_cr_shelter/field",
            form: "shelter-form",
            table_priority: "all"
        },
        {
            name: "status",
            data_path: "$_cr_shelter/field",
            form: "shelter-form"
        },
        {
            name: "shelter_type_id",
            data_path: "$_cr_shelter/field",
            form: "shelter-form"
        },
        {
            name: "population",
            data_path: "$_cr_shelter/field",
            form: "shelter-form"
        },
        {
            name: "L0",
            data_path: "$_gis_location/field",
            form: "gis-location-form",
            common_name: "Country"
        },
        {
            name: "addr_street",
            data_path: "$_gis_location/field",
            form: "gis-location-form"
        }];

    var tableRequirements = [
        {
            name: "shelterTable",
            tableSpec: shelterTable,
            req: ["shelter-form", "gis-location-form"]
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
        //app.controller.setControllerByModel("shelter", this);
        for (var formName in forms) {
            app.controller.setControllerByModel(formName, this);
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

        var formSpec = forms[name];
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
        var formRecord  = obj[formRecordName][0]["field"];
        var model = app.controller.getForm(name);
        if (!model) {
            var form = app.controller.getModel("formType");
            model = new form({
                "name": name,
                "form":formRecord,
                "obj": obj
            });
            app.controller.addForm(model);
        }

        // Parse the data
        /*
        var data = model.get("data") || {};
        for (var i = 0; i < shelterTable.length; i++) {
            var columnItem = shelterTable[i];
            var columnName = columnItem["name"];
            var columnPath = columnItem["data_path"];
            var pathList = columnPath.split("/");

            if (!obj[pathList[0]]) {
                continue;
            }
            var field = obj[pathList[0]][0];
            for (var j = 1; j < pathList.length; j++) {
                field = field[pathList[j]][0];
                if (!field) {
                    break;
                }
            }

            // Save the data
            var record = field[columnName];
            data[columnName] = "";
        }
        */
        //var model = null;
        //return model;
    };


    controller.prototype.onFormSubmit = function (page) {

    };

    controller.prototype.onUpdateSubmit = function (page) {

    };

    controller.prototype.updateAll = function () {

        app.controller.updateData(Object.keys(forms));
    };

    controller.prototype.newItem = function () {


    };

    controller.prototype.editItem = function (model) {

    };

    app.pluginManager.addObject(controller);

})(jQuery, window, document);