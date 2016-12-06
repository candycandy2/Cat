
/*global variable*/
var appKeyOriginal = "appqplay";
var appKey = "";
var pageList = ["viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];
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
var callGetMessageList = false;

window.initialSuccess = function(data) {
    if (data !== undefined) {

        getDataFromServer = false;
        processStorageData("setLocalStorage", data);

        if (loginData['doLoginDataCallBack'] === false) {
            if (window.localStorage.getItem("openMessage") === "true") {
                messageRowId = window.localStorage.getItem("messageRowId");
                $.mobile.changePage("#viewWebNews2-3-1");
            } else {
                $.mobile.changePage('#viewMain2-1', {
                    reloadPage: true
                });
                $.mobile.changePage('#viewMain2-1');
            }
        }
    } else {

        if (loginData['doLoginDataCallBack'] === true) {
            getLoginDataCallBack();
        } else {

            var doPushToken = new sendPushToken();
            getMessageList();

            if (window.localStorage.getItem("openMessage") === "true") {
                $.mobile.changePage("#viewWebNews2-3-1");
            } else {
                $.mobile.changePage('#viewMain2-1');
            }

        }
    }

    //For test
    //var unregisterTest = new unregister();
}

//Plugin-QPush, Now only QPLay need to set push-toekn
function sendPushToken() {
    var self = this;
    var queryStr = "&app_key=" + qplayAppKey + "&device_type=" + loginData.deviceType;

    this.successCallback = function() {};

    this.failCallback = function() {};

    var __construct = function() {
        if (loginData.token !== null && loginData.token.length !== 0) {
            QPlayAPI("POST", "sendPushToken", self.successCallback, self.failCallback, null, queryStr);
        }
    }();
}

//re-new Token Valid
function reNewToken() {
    var self = this;

    this.successCallback = function(data) {
        var resultcode = data['result_code'];
        var newToken = data['content'].token;
        var newTokenValid = data['token_valid'];

        if (resultcode == 1) {
            loginData["token"] = newToken;
            loginData["token_valid"] = newTokenValid;

            window.localStorage.setItem("token", newToken);
            window.localStorage.setItem("token_valid", newTokenValid);
        } else {
            //other case
        }

        if (doInitialSuccess) {
            doInitialSuccess = false;
            hideInitialPage();
        }
    };

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("POST", "renewToken", self.successCallback, self.failCallback, null, null);
    }();
}

function getMessageList() {
    var messageList = new QueryMessageList();
}

//un-register [User with Mobile Device UUID]
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

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewMain2-1") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            navigator.app.exitApp();
        }

    } else if (activePageID === "viewMain2-1" || activePageID === "viewAppDetail2-2" || activePageID === "viewNewsEvents2-3") {

        $.mobile.changePage('#viewMain2-1');

    } else if (activePageID === "viewWebNews2-3-1") {

        $.mobile.changePage('#viewNewsEvents2-3');

    }
}