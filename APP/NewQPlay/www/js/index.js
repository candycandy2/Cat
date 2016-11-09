
/*global variable*/
var appKeyOriginal = "appqplay";
var appKey = "";
var pageList = ["viewInitial1-1", "viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e"; // QPlay app secret key

var appcategorylist;
var applist;
var appmultilang;
var loginjustdone;
var messagecontent;
var selectAppIndex = 9999;
var messageRowId = 9999;
var msgDateFromType;
var callBackURL;

window.initialSuccess = function(data) {
    if (data !== undefined) {

        loginData['callQLogin'] = false;
        processStorageData("setLocalStorage", data);

        if (loginData['doLoginDataCallBack'] === false) {
            $.mobile.changePage('#viewMain2-1');
        }
    } else {
        if (loginData['doLoginDataCallBack'] === false) {
            setTimeout(function(){
                var checkAppVer = new checkAppVersion();
                loadingMask("show");
            }, 2000);
        }
    }

    //For test
    //var unregisterTest = new unregister();
}

function getMessageList() {
    var messageList = new QueryMessageList();
}

function unregister() {

    var self = this;
    var queryStr = "&target_uuid=" + loginData.uuid;

    this.successCallback = function(data) {
        console.log(data);
    };

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("POST", "unregister", self.successCallback, self.failCallback, null, queryStr);
    }();
}