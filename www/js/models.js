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


    var userInfo = Backbone.Model.extend({
        defaults: {
            url: "",
            username: "",
            password: ""
        },

        initialize: function (options) {
            this.bind("change", function () {
                this.sync("update")
            });

        },

        getKey: function () {
            return "user-info";
        },

        sync: function (method, model, options) {
            model = this;
            options || (options = {});
            app.localSync(method, model, options);
        }
    });


    var formType = Backbone.Model.extend({
        defaults: {
            url: "",
            name: "",
            loaded: false,
            form: null,
            data: null
        },
        initialize: function () {
            //console.log("new formType name:" + this.get("name"));
        }
    });

    // create the form list item
    var mFormData = Backbone.Model.extend({

        // The construture has the superclass initialization
        // the subclasses implement initialize
        constructor: function (options) {
            console.log("mFormData constructor");

            // superclass member initialization

            this._name = "";
            this._timestamp = Date.now();
            this._needsUpdate = false;
            this._formId = "";
            this._serverState = 0; // 0 = not on server, 1 = server valid
            this._type = "";


            // Call the original constructor
            Backbone.View.apply(this, arguments);
        },

        initialize: function (options) {
            console.log("mFormData initialize");
        },

        submit: function () {
            console.log("sending model " + this.get("_name"));
            this.needsUpdate(true);

            // Check to see if it is a create or update
            if (this.get("uuid")) {
                this.sync('update', this, {
                    local: false
                });
            } else {
                this.sync('create', this, {
                    local: false
                });
            }
        },

        getKey: function () {
            var value = 0;
            if (this.get("uuid")) {
                value = this.get("uuid");
            } else {
                value = "timestamp:" + this.timestamp();
            }
            var prefix = "data-";
            if (this.type()) {
                prefix += this.type() + "-";
            }
            return prefix + value;
        },

        name: function (_name) {
            if (_name) {
                this.set("_name", _name);
            }
            return this.get("_name");
        },

        type: function (_type) {
            return this._type;
        },

        timestamp: function (_timestamp) {
            if (_timestamp) {
                this._timestamp = _timestamp;
            }
            return this._timestamp;
        },

        needsUpdate: function (needsUpdate) {
            if (needsUpdate != undefined) {
                this._needsUpdate = needsUpdate;
            }
            return this._needsUpdate;
        },

        sendData: function () {
            console.log("mFormData::sendData not implemented, should be overridden");
        }


    });

    app.controller.addModel({
        "userInfo": userInfo,
        "formType": formType,
        "mFormData": mFormData
    });


})(jQuery, window, document);