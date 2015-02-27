//  Copyright (c) 2014-2015 Thomas Baker
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

    // Page superclass


    var pageView = Backbone.View.extend({

        commonEvents: {
            "click #link-button": "navigate"
        },

        constructor: function (options) {
            console.log("pageView constructor");
            
            // Resolve events between super and sub class
            this.events = _.extend({},this.commonEvents,this.events);

            // Create and initialize state
            this._content_template = null;
            this._itemList = [];
            //this.index = -1;
            this.back = true;
            //this.position = 1;
            this.name = options["name"];
            if (options["back"] === false) {
                this.back = false;
            }

            var contentTemplate = options["content"];
            if (contentTemplate) {
                this.content(contentTemplate);
            }

            // Call the original constructor
            Backbone.View.apply(this, arguments);
        },

        initialize: function (options) {
            console.log("initialize pageView");


        },

        content: function (contentTemplate) {
            if (contentTemplate) {
                this._content_template = _.template(contentTemplate);
            }
            return this._content_template;
        },

        navigate: function (event) {
            var target = event.currentTarget;
            var path = $(target).attr("link");
            this.trigger("navigate", path);
        },

        render: function () {
            this.$el.attr({
                "id": name
            });
            this.$el.html("pageView render not implemented");
            return this;
        },

        setEvents: function () {
            this.delegateEvents();
        },

        findErrorText: function () {
            return this.$el.find("#error-message");
        },

        clearErrorText: function () {
            var element = this.findErrorText();
            if (element) {
                element.html("");
                element.removeClass("active");
            }
        },

        addErrorText: function (message, options) {
            var element = this.findErrorText();
            if (element) {
                element.html(element.html() + message);
                element.addClass("active");
            }
        },
        
        updateForm: function(obj) {
            // This function should be implemented by a child view
            // It is called when a form record is loaded
            console.log("pageView.updateForm not implemented");
        },
        
        updateData: function(obj) {
            // This function should be implemented by a child view
            // It is called when a data from the server is recieved
            console.log("pageView.updateData not implemented");
        }
    });


    // This is used for the main page

    var mainPage = pageView.extend({

        initialize: function (options) {
            //pageView.prototype.initialize.call(this, options);

            console.log("initialize mainPage ");
            // search the dom to see if the page is already there
            var element = $("#" + this.name);
            if (element) {
                this.setElement(element.get());
            }

        },

        render: function () {
            //var str = this.template({index:this.index,name:this.model.get("name")});
            //var name = this.model.get("name");
            this.$el.attr({
                "id": name
            });
            this.$el.html(this.template({}));
            return this;
        },

    });

    var confirmDialog = Backbone.View.extend({
        //tagName: "fieldset",
        //template: _.template("<%= label %><input id='input' type='text' name='<%= reference %>'>"),
        defaults: {
            headerText: "",
            messageText: ""
        },
        events: {
            "click #ok": "onLogin"
        },

        initialize: function (options) {
            //console.log("new newFormListItem ");
            //this.reference = "";
            //this.label = "";
            var element = document.getElementById('confirm-dialog');
            this.setElement(element);
            //this.$el.hide();


        },

        render: function () {
            return this.$el;
        },

        setText: function (header, message) {
            this.$('#header h3').html(header);
            this.$('#content h3').html(message);
        },

        show: function () {
            //this.render(); //.show();
            //this.$el.popup("open").popup({transition:"none"});
            $("#confirm-dialog").popup("open").popup({
                transition: "none"
            });
        },

        onOK: function (evt) {
            this.$el.popup("close"); //hide();
        }
    });



    var loginDialog = Backbone.View.extend({
        //tagName: "fieldset",
        //template: _.template("<%= label %><input id='input' type='text' name='<%= reference %>'>"),
        defaults: {
            headerText: "",
            messageText: ""
        },
        events: {
            "click #login": "onLogin"
        },

        initialize: function (options) {
            //console.log("new newFormListItem ");
            //this.reference = "";
            //this.label = "";
            var element = document.getElementById('login-dialog');
            this.setElement(element);
            //this.$el.hide();


        },

        render: function () {
            this.setText();
            return this.$el;
        },

        setText: function (header, message) {
            //this.$('#header h3').html(header);
            // this.$('#content h3').html(message);
            var url = app.state.settings.serverInfo.get("url");
            var username = app.state.settings.serverInfo.get("username");
            var password = app.state.settings.serverInfo.get("password");
            this.$el.find("#url").val(url);
            this.$el.find("#username").val(username);
            this.$el.find("#password").val(password);

        },

        getText: function (header, message) {
            //this.$('#header h3').html(header);
            // this.$('#content h3').html(message);
            var url = this.$el.find("#url").val();
            var username = this.$el.find("#username").val();
            var password = this.$el.find("#password").val();
            app.state.settings.serverInfo.set("url", url);
            app.state.settings.serverInfo.set("username", username);
            app.state.settings.serverInfo.set("password", password);

        },

        show: function () {
            //this.render(); //.show();
            //this.$el.popup("open").popup({transition:"none"});
            //$("#confirm-dialog").popup("open").popup({transition:"none"});
            this.setText();
            this.$el.addClass("visible");
        },

        hide: function () {
            //this.render(); //.show();
            //this.$el.popup("open").popup({transition:"none"});
            //$("#confirm-dialog").popup("open").popup({transition:"none"});
            //this.setText();
            this.$el.removeClass("visible");
        },

        onLogin: function (evt) {
            //this.$el.popup("close"); //hide();
            var params = {
                "url": this.$el.find("#url").val(),
                "username": this.$el.find("#username").val(),
                "password": this.$el.find("#password").val()
            };
            //this.hide();
            app.controller.login(params);
        },
        onError: function (message) {
            console.log("login dialog error " + message);
        }
    });

    app.view.addPage("pageView", pageView);
    app.view.addPage("mainPage", mainPage);
    app.view.addPage("confirmDialog", confirmDialog);
    app.view.addPage("loginDialog", loginDialog);


})(jQuery, window, document);