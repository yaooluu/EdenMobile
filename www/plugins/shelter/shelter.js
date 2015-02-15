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


;
(function ($, window, document, undefined) {

    var shelterItemElement = Backbone.View.extend({ //pageView.extend({
        tagName: "tr",
        //className: "accordian",
        name: "",
        template: _.template("<td class='actions se-column-all'>" +
            "<input id='edit' class='edit-button' value='Edit' type='button'>" +
            "<input id='monitor' class='edit-button' value='Monitor' type='button'>" +
            "</td>" +
            "<td class='se-column-all'><%= case_number %></td> " +
            "<td class='se-column-all'><%= name %></td>" +
            "<td class='se-column-medium'><%= disease %></td>" +
            "<td class='se-column-medium'><%= location %></td>" +
            "<td class='se-column-medium'><%= illness_status %></td>" +
            "<td class='se-column-large'><%= symptom_debut %></td>" +
            "<td class='se-column-large'><%= diagnosis_status %></td>" +
            "<td class='se-column-large'><%= diagnosis_date %></td>" +
            "<td class='se-column-medium'><%= monitoring_level %></td>"

        ),
        events: {
            //"click #link-button": "navigate",

            "click input#edit": "onEdit"

        },
        initialize: function (options) {
            // Set up model change event
            var model = this.model;
            model.on("change", this.update.bind(this));

        },
        render: function () {
 
            // records loaded from the server have more data than locally stored
            if (this.model.get("uuid")) {
                var itemData = this.model.get("rawData");
                var templateData = {
                    "name": this.model.get("name"),
                    "item_number": this.model.get("item_number"),
                    "disease": this.model.get("disease"),
                    "location": "-",
                    "symptom_debut": this.model.get("symptom_debut") || "" //,
                };
                var fieldList = ["illness_status", "diagnosis_status", "diagnosis_date", "monitoring_level"];
                for (var i = 0; i < fieldList.length; i++) {
                    var fieldName = fieldList[i];
                    if (itemData[fieldName]) {
                        templateData[fieldName] = itemData[fieldName]["$"];
                    } else {
                        templateData[fieldName] = "";
                    }
                }
            } else {
                // This is for records that were created while offline
                var templateData = {
                    "name": this.model.get("person_id-string"),
                    "item_number": this.model.get("item_number"),
                    "disease": this.model.get("disease_id-string"),
                    "location": "-",
                    "symptom_debut": this.model.get("symptom_debut") || "" //,
                };
                var fieldList = ["illness_status", "diagnosis_status", "diagnosis_date", "monitoring_level"];
                for (var i = 0; i < fieldList.length; i++) {
                    var fieldName = fieldList[i];
                    templateData[fieldName] = this.model.get(fieldName + "-string") || "";
                }
            }
            this.$el.html(this.template(templateData));

            return this;
        },

        update: function (evt) {
            console.log("updating item list item ");
            this.render();
        },

        onEdit: function () {
            console.log("itemsItemElement onEdit");
            var controller = app.controller.getControllerByModel("item");
            controller.editItem(this.model);
        },

    });

    var sheltersPage = Backbone.View.extend({ //pageView.extend({
        tagName: "div",
        className: "se-page",
        name: "",
        template: _.template(
            "<div class='fixed'>" +
            "<div class='row'>" +
            "<nav class='top-bar' data-topbar=' '>" +
            "<ul class='title-area'>" +
            "<li class='name'>" +
            "<h1><a id='link-button' link='page-back'>< Back</a></h1>" +
            "</li>" +
            "</li>" +
            "</ul>" +
            //"</section>" +
            "</nav>" +
            "</div>" +
            "</div>" +
            "<div id='content'></div>"

        ),
        content_template: null,
        events: {
            "click #link-button": "navigate",
            "click #new-item": "onNewItem",
            "click #refresh-item-list": "onRefreshList"
        },
        initialize: function (options) {
            console.log("initialize shelters page");
             var content = options["content"];
            if (content) {
                this.setContent(content);
            }
            var name = options["name"];
            if (name) {
                this.name = name;
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
            return this;
        },

        setItem: function (model) {
            // first check to see if the item element already exists
            var itemElement = null;
            for (var i = 0; i < this.itemList.length; i++) {
                if (this.itemList[i].model === model) {
                    itemElement = this.itemList[i];
                    break;
                }
            }
            if (!itemElement) {
                itemElement = new itemsItemElement({
                    model: model
                });
                this.itemList.push(itemElement);
                var tableBody = this.$el.find("tbody");
                tableBody.append(itemElement.$el);
                itemElement.render();
            }
        },

        removeItem: function (model) {
            // first check to see if the item element already exists
            var itemElement = null;
            for (var i = 0; i < this.itemList.length; i++) {
                if (this.itemList[i].model === model) {
                    itemElement = this.itemList[i];
                    itemElement.remove();
                    this.itemList.splice(i, 1);
                    break;
                }
            }
        },

        onEditItem: function (event) {
            console.log("edit");
        },

        expandItem: function (event) {
            console.log("expand");
            // TODO: first make sure that you didn't push a button

        },

        onNewItem: function (event) {
            console.log("onNewItem ");
            var controller = app.controller.getControllerByModel("shelter");
            controller.newItem();
            this.trigger("navigate", "page-new-item");
        },

        onRefreshList: function (event) {
            console.log("onRefreshList ");
            app.controller.updateData("item");
        }
    });

    app.pluginManager.addObject(sheltersPage);

})(jQuery, window, document);