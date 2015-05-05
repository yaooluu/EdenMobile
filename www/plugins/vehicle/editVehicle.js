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
"use strict";


;
(function ($, window, document, undefined) {

    var editVehicleForm = [
    {
        name: "number",
        control: "string",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Asset Number"
    },
    {
        name: "item_id",
        control: "reference supply_item",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Vehicle Type"
    },
    {
        name: "organisation_id",
        control: "reference org_organisation",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Organisation"
    },
    {
        name: "site_id",
        control: "reference org_site",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Facility"
    },
    {
        name: "sn",
        control: "string",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "License Plate"
    },
    {
        name: "supply_org_id",
        control: "reference org_organisation",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Supplier/Donor"
    },
    {
        name: "purchase_date",
        control: "date",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Purchase Date"
    },
    {
        name: "purchase_price",
        control: "double",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Purchase Price"
    },
    {
        name: "purchase_currency",
        control: "string",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Currency"
    },
    {
        name: "comments",
        control: "text",
        form_path: "$_asset_asset/field",
        form: "vehicle-form",
        label: "Comments"
    }
    ];
/*
    var editVehicleForm = [
        {
            name: "doc_id",
            control: "integer",
        },
        {
            name: "number",
            control: "string",
            form_path: "$_vehicle_vehicle/field",
            form: "vehicle-form",
            label: "",
            required: true
        },
        {
            name: "type",
            control: "integer"
        },
        {
            name: "item_id",
            control: "select",
            form_path: "$_vehicle_vehicle/field",
            form: "vehicle-form",
            label: ""
        },
        {
            name: "kit",
            control: "boolean"
        },
        {
            name: "organisation_id",
            control: "select",
            form_path: "$_vehicle_vehicle/field",
            form: "vehicle-form",
            label: ""
        },
        {
            name: "site_id",
            form_path: "$_vehicle_vehicle/field",
            form: "vehicle-form",
            label: "",
            control: "select"
        },
        {
            name: "sn",
            form_path: "$_vehicle_vehicle/field",
            form: "vehicle-form",
            label: "",            
            control: "string"
        },
        {
            name: "supply_org_id",
            control: "select"
        },
        {
            name: "purchase_date",
            control: "string"
        },
        {
            name: "purchase_price",
            control: "double"
        },
        {
            name: "purchase_currency",
            control: "string"
        },
        {
            name: "L0",
            control: "select",
            form_path: "$_gis_location/field",
            data_path: "$_gis_location/field",
            reference: "$k_location_id",
            form: "gis-location-form",
            common_name: "Country",
            label: ""
        },
        {
            name: "addr_street",
            control: "string",
            form_path: "$_gis_location/field",
            data_path: "$_gis_location/field",
            reference: "$k_location_id",
            form: "gis-location-form",
            label: ""
        },
        {
            name: "addr_postcode",
            control: "string",
            form_path: "$_gis_location/field",
            data_path: "$_gis_location/field",
            reference: "$k_location_id",
            form: "gis-location-form",
            label: ""
        },        
        {
            name: "location_id",
            control: "gis_button"
        },
        {
            name: "assigned_to_id",
            control: "select"
        },
        {
            name: "cond",
            control: "integer"
        },
        {
            name: "comments",
            control: "string",
            form_path: "$_vehicle_vehicle/field",
            form: "vehicle-form",
            label: ""
        },
        {
            name: "deleted_rb",
            control: "integer"
        }
        ];*/

    var pageView = app.view.getPage("pageView");
    var editVehiclesPage = pageView.extend({ //pageView.extend({
        tagName: "div",
        className: "se-page",
        name: "",
        model: null,
        template: _.template(
            "<div class='fixed'>" +
            "<div class='row'>" +
            "<nav class='top-bar' data-topbar=' '>" +
            "<ul class='title-area'>" +
            "<li class='name'>" +
            "<h1><a >New Vehicle</a></h1>" +
            "</li>" +
            "</li>" +
            "</ul>" +
            "</nav>" +
            "</div>" +
            "</div>" +
            "<div id='content'></div>"
        ),
        content_template: null,
        _table: editVehicleForm,
        events: {
            "click #link-button": "navigate",
            "click #cancel": "onCancel",
            "click #save": "onSave"
        },
        initialize: function (options) {
            console.log("initialize editVehicles page");
            var content = options["content"];
            if (content) {
                this.setContent(content);
            }
            var name = options["name"];
            if (name) {
                this.name = name;
            }

            // Add the controls
            this.controlList = [];
            for (var i = 0; i < editVehicleForm.length; i++) {
                var tableItem = editVehicleForm[i];
                var controlName = tableItem.name;
                var controlType = tableItem.control;
                var required = tableItem.required && (tableItem.required === true);
               var control = app.view.getControl(controlType);
                if (control) {
                    console.log("control found " + controlType);
                    var item = new control({
                        name: controlName,
                        common_name: tableItem.common_name,
                        required: required
                    });
                    this.controlList[i] = item;

                }
            }
        },
        setContent: function (content) {
            if (content) {
                this.content_template = _.template(content);
            }
        },
        render: function () {
            this.$el.html(this.template({}));
            this.$el.attr({
                "id": this.name
            });
            if (this.content_template) {
                this.$el.find("#content").append(this.content_template({}));
            }

            // Add controls
            var container = this.$el.find("#form-controls");
            for (var i = 0; i < this.controlList.length; i++) {
                var control = this.controlList[i];
                if (control) {
                container.append(control.render());
                }
            }

            return this.$el;
        },

        updateItem: function (obj) {
            console.log("editVehicle updateItem");
        },

        updateForm: function (obj) {
            for (var i = 0; i < editVehicleForm.length; i++) {
                var record = obj;
                var label = "";
                var value = "";
                var columnItem = editVehicleForm[i];
                var columnName = columnItem["name"];
                var path = columnItem["form_path"];
                if (!path) { continue; }
                var pathList = path.split("/");
                for (var j = 0; j < pathList.length; j++) {
                    var pathItem = pathList[j];

                    if (!record[pathItem]) {
                        record = null;
                        break;
                    }
                    if (pathItem.indexOf("$_") >= 0) {
                        record = record[pathItem][0];
                    } else {
                        record = record[pathItem];
                    }
                }
                if (!record) {
                    continue;
                }
                
                // update the control
                var control = this.controlList[i];
                if (!control) { continue; }
                if (Array.isArray(record)) {
                    for (var j = 0; j < record.length; j++) {
                        var recordItem = record[j];
                        if (recordItem["@name"] === control._name) {
                                control.setControl(recordItem);
                                break;
                        }
                    }
                } else {
                    control.setForm(record);
                }
            }
        },

        showForm: function (form, model) {
            console.log("editVehicle showForm");
            this.model = model;
            var tableData = model.getData(editVehicleForm);
            for (var i = 0; i < editVehicleForm.length; i++) {
                var value = "";
                var columnItem = editVehicleForm[i];
                var columnName = columnItem["name"];
                 var item = tableData[columnName];
                if (item) {
                    var control = this.controlList[i];
                    if (control) {
                        control.setData(item);
                    }
                }
                else {
                    console.log("\titem not found " + columnName);
                }
            }
        },

        getData: function (model) {
            console.log("editVehicle getData");
            var formData = {};
            for (var i = 0; i < editVehicleForm.length; i++) {
                var value = "";
                var columnItem = editVehicleForm[i];
                var columnName = columnItem["name"];
                var item = model.get(columnName);
                if (item !== undefined) {
                    var control = this.controlList[i];
                    if (control) {
                        var value = control.getData(item);
                        formData[columnName] = value;
                        //model.set(columnName,value);
                        console.log("\t" + columnName + ": " + value);
                    }
                }
            }
            model.set(formData);
        },

        onCancel: function (event) {
            console.log("onCancel ");
            this.$el.find("legend").scrollTop(0);
            app.view.changePage("page-back");
        },

        onSave: function (event) {
            console.log("onSave ");
            var controller = app.controller.getControllerByModel("vehicle");
            controller.onFormSubmit(this,this.model);
            //app.view.changePage("page-back");
        },

        findErrorText: function () {
            return this.$el.find("#error-message");
        },

        clearErrorText: function () {
            var element = this.findErrorText();
            element.html("");
            element.removeClass("active");
        },

        addErrorText: function (message, options) {
            var element = this.findErrorText();
            element.html(element.html() + message);
            element.addClass("active");
            element.addClass("alarm");
        }




    });

    app.pluginManager.addObject(editVehiclesPage);

})(jQuery, window, document);