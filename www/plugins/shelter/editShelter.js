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


    var editShelterForm = [
        {
            name: "name",
            control: "string"
        },
        {
            name: "organisation_id",
            control: "select"
        },
        {
            name: "shelter_type_id",
            control: "select"
        },
        {
            name: "shelter_service_id",
            control: "select"
        },
        {
            name: "L0",
            control: "select"
        },
        {
            name: "addr_street",
            control: "string"
        },
        {
            name: "postcode",
            control: "string"
        },
        {
            name: "location",
            control: "gis_button"
        },
        {
            name: "phone",
            control: "string"
        },
        {
            name: "email",
            control: "string"
        },
        {
            name: "person_id",
            control: "select"
        },
        {
            name: "population",
            control: "string"
        },
        {
            name: "capacity_day",
            control: "string"
        },
        {
            name: "evacuees_day",
            control: "string"
        },
        {
            name: "capacity_night",
            control: "string"
        },
         {
            name: "status",
            control: "select"
        },
       {
            name: "comments",
            control: "string"
        },
        {
            name: "obsolete",
            control: "checkbox"
        },
        {
            name: "footer",
            control: "text"
        }
        /*
        {
            name: "name",
            form_path: "$_cr_shelter/field",
            form: "shelter-form",
            table_priority: "all",
            label: ""
        },
        {
            name: "status",
            form_path: "$_cr_shelter/field",
            form: "shelter-form",
            table_priority: "all",
            label: ""
        },
        {
            name: "shelter_type_id",
            form_path: "$_cr_shelter/field",
            form: "shelter-form",
            table_priority: "medium",
            label: ""
        },
        {
            name: "population",
            form_path: "$_cr_shelter/field",
            form: "shelter-form",
            table_priority: "medium",
            label: ""
        },
        {
            name: "addr_street",
            form_path: "$_gis_location/field",
            data_path: "$_gis_location/field",
            reference: "$k_location_id",
            form: "gis-location-form",
            table_priority: "medium",
            label: ""
        },
        {
            name: "L0",
            form_path: "$_gis_location/field",
            data_path: "$_gis_location/field",
            reference: "$k_location_id",
            form: "gis-location-form",
            common_name: "Country",
            table_priority: "large",
            label: ""
        }
        */];

    var pageView = app.view.getPage("pageView");
    var editSheltersPage = pageView.extend({ //pageView.extend({
        tagName: "div",
        className: "se-page",
        name: "",
        template: _.template(
            "<div class='fixed'>" +
            "<div class='row'>" +
            "<nav class='top-bar' data-topbar=' '>" +
            "<ul class='title-area'>" +
            "<li class='name'>" +
            "<h1><a >New Shelter</a></h1>" +
            "</li>" +
            "</li>" +
            "</ul>" +
            "</nav>" +
            "</div>" +
            "</div>" +
            "<div id='content'></div>"
        ),
        content_template: null,
        events: {
            "click #link-button": "navigate",
            "click #cancel": "onCancel",
            "click #save": "onSave"
        },
        initialize: function (options) {
            console.log("initialize editShelters page");
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
            for (var i = 0; i < editShelterForm.length; i++) {
                var tableItem = editShelterForm[i];
                var controlName = tableItem.name;
                var controlType = tableItem.control;
                var control = app.view.getControl(controlType);
                if (control) {
                    console.log("control found " + controlType); 
                    var item = new control({name: controlName});
                    this.controlList.push(item);
                    
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
            var container  = this.$el.find("#form-controls");
            for (var i = 0; i < this.controlList.length; i++) {
                container.append(this.controlList[i].render());
            }

            return this.$el;
        },
        
        updateItem: function(obj) {
            console.log("editShelter updateItem");
        },
        
        showForm: function(form, model) {
            console.log("editShelter showForm");
        },
        
        getData: function(model) {
            console.log("editShelter getData");
        },

        onCancel: function (event) {
            console.log("onCancel ");
            this.$el.find("legend").scrollTop(0);
            app.view.changePage("page-back");
        },

        onSave: function (event) {
            console.log("onSave ");
            var controller = app.controller.getControllerByModel("shelter");
            controller.onFormSubmit(this);
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

    app.pluginManager.addObject(editSheltersPage);

})(jQuery, window, document);