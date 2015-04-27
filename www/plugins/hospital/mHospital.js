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

    var mFormData = app.controller.getModel("mFormData");
    var mHospital = mFormData.extend({
        initialize: function (options) {
            //mFormData.prototype.initialize.call(this, arguments);

            this._type = "hospital";
        },

        sendData: function () {
            var record = {};
            var changed = this.changed;
            for (var key in changed) {
                var value = changed[key];
                record[key] = value;
            }
            
            // If the model came from the server then it has a uuid
            if (this.get("uuid")) {
                record["@uuid"] = this.get("uuid");
            } else {
                var dateString = (new Date(this.timestamp())).toISOString();
                record["@created_on"] = dateString;
            }

            var obj = {
                $_cr_hospital: [record]
            };
            return JSON.stringify(obj);
        }
    });

    
    app.controller.addModel({"mHospital": mHospital});

})(jQuery, window, document);
