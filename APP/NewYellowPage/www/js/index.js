
/*global variable*/

var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];

var loginData = {
    token:          "",
    token_valid:    "",
    uuid:           ""
};

var employeeData = {};

window.initialSuccess = function(data) {
    
    //data return from [qplayApi/public/index.php/v101/qplay/login]
    loginData.token =       data.token;
    loginData.token_valid = data.token_valid;
    loginData.uuid =        data.uuid;
    
    var companyData = new QueryCompanyData();
}
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));
