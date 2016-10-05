
/*global variable, function*/

var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];

var loginData = {
    token:          "",
    token_valid:    "",
    uuid:           ""
};

var employeeData = {};
var employeeSelectedIndex;
var phonebookData = {};
var myEmpID = "1609009";
var prevPageID;

window.initialSuccess = function(data) {
    
    //data return from [qplayApi/public/index.php/v101/qplay/login]
    loginData.token =       data.token;
    loginData.token_valid = data.token_valid;
    loginData.uuid =        data.uuid;
    
    var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function(){
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });
}
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));

