
var formMap = new Object();

var baseURL = "http://localhost:8000/eden";
var urlMap = {
    shelter : "/cr/shelter/",
    hospital : "/hms/hospital/",
    vehicle : "/vehicle/vehicle/"
};

var languages = ["ar", "bs", "de", "el", "en-gb", "es", "fr", "it", "ja", "km", "mn"
                , "mn", "ne", "prs", "ps", "pt-br", "pt", "ru", "sv", "tet", "tl"
                , "tr", "ur", "vi", "zh-cn", "zh-tw"];

var language = "en-gb";

function formGenerator() {
    console.log("begin formGenerator");

    this.init();
};

formGenerator.prototype.init = function () {
    console.log("init formGenerator");

    initLangList();
    initTypeList();
    //fetchForms();
};

//haven't used, because can't resolve passing "formType" parameter to callback function "fetchForm"
//since it will overwrite the value of "formType"
function fetchForms() {
    console.log("in fetchForms")

    $("#selectAttr").empty();
    $("#selectType").empty();
    $("#selectType").append("<option>-</option>");

    for(var formType in urlMap) {
        fetchForm(formType);
    }
};

function fetchForm(formType) {
    var url = baseURL + urlMap[formType] + "create.s3json?_language=" + language;
    $.getJSON(
        url,
        { items: formType },
        function(data) {          
            parseJson(data, formType);
        }
    ); 
}

function parseJson(data, type) {
    $.each(data, function(key, val) {   //e.g. "$_hms_hospital" : [{...}]

        //console.log("Fields from Server for: "+key);
        //console.log(val[0]["field"]);

        formMap[type] = [];
        for(var i in val[0]["field"]) {
            var f = val[0]["field"][i];     //current object in field
            if(f["@writable"] != null && f["@writable"] == "True" ) {
                
                var attr = new Object();
                attr.name = f["@name"];
                attr.control = f["@type"];
                attr.form_path = key + "/field";    //e.g. $_hms_hospital/field
                attr.form = type + "-form";
                attr.label = f["@label"];         //label is language-specific

                //console.log("+++++++++++++++++++++++++++++++++++++++++++++++ Adding attr:");
                //console.log(attr);

                formMap[type].push(attr); 
            }
        }
    })

    console.log("Form generated: ");
    console.log(formMap[type]);

    refreshAttrList(type);
}

//init language select list, default is en-gb
function initLangList() {
    $("#selectLang").append("<option>-</option>");
    for(var i in languages) {
        var lang = languages[i];
        $("#selectLang").append("<option value='"+lang+"'>"+lang+"</option>");
    }

    $("#selectLang").val("en-gb");
}

//init form type select list, 
function initTypeList() {
    $("#selectType").append("<option>-</option>");
    for(var type in urlMap) {
        $("#selectType").append("<option value='"+type+"'>"+type+"</option>");
    }
}

//change language, reload forms from server
function selectLangChanged() {
    this.language = $("#selectLang option:selected").val();

    //fetchForms();

    console.log("Language changed to "+this.language);
}

//fill attributes select list
function selectTypeChanged() {
    console.log("in selectTypeChanged()");

    var type = $("#selectType  option:selected").val();

    fetchForm(type);
}

function refreshAttrList(type) {
    $("#selectAttr").empty();

    for(var i in formMap[type]) {
        var name = formMap[type][i].name;
        var label = formMap[type][i].label;
        $("#selectAttr").append("<option value='"+name+"'>"+label+"</option>");
    }
}

function generateForm() {
    console.log("in generateForm()");

    var jsonText = "[\n";
    var type = $("#selectType option:selected").val();

    $('#selectAttr option:selected').each(function(){
        var val = $(this).val();

        for(var i in formMap[type]) {
            var attr = formMap[type][i];
            if(attr.name == val) {
                jsonText += "\t{\n"
                jsonText += "\t\tname: \"" + attr.name + "\",\n";
                jsonText += "\t\tcontrol: \"" + attr.control + "\",\n";
                jsonText += "\t\tform_path: \"" + attr.form_path + "\",\n";
                jsonText += "\t\tform: \"" + attr.form + "\",\n";
                jsonText += "\t\tlabel: \"" + attr.label + "\"\n";
                jsonText += "\t},\n";
            }
        }
    });

    jsonText = jsonText.substring(0,jsonText.length-2);
    jsonText += "\n]\n";

    //$("#finalForm").text(JSON.stringify(formMap[type]));
    $("#finalForm").text(jsonText);
}

//var formGen = new formGenerator();


