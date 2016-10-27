
/*global variable*/

var appKey = "appqplay";
//var appKey = "qplay";
var pageList = ["viewInitial1-1", "viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e"; // QPlay app secret key

var appcategorylist;
var applist;
var appmultilang;
var loginjustdone;
var messagecontent;
var selectAppIndex = 9999;
var messageRowId = 9999;

window.initialSuccess = function(data) {
    if (data !== undefined) {

        loginData['callQLogin'] = false;
        processStorageData("setLocalStorage", data);

        $.mobile.changePage('#viewMain2-1');
    } else {
        setTimeout(function(){
            checkAppVersion();
            loadingMask("show");
        }, 2000);
    }
}