
/*global variable*/

var appKey = "appqplay";
var pageList = ["viewInitial1-1", "viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";

var employeeData = {};

window.initialSuccess = function(data) {
    if (data !== undefined) {
        processStorageData("setLocalStorage", data);
        $.mobile.changePage('#viewMain2-1');
    } else {
        setTimeout(function(){
            checkAppVersion();
            loadingMask("show");
        }, 2000);
    }
}