
/*global variable*/

var pageList = ["viewInitial1-1", "viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";

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
}
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));
