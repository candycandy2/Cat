
/*global variable*/
var appKeyOriginal = "appqplay";
var appKey = "appqplay";
var pageList = ["viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e"; // QPlay app secret key

var appcategorylist;
var applist;
var appmultilang;
var loginjustdone;
var messagecontent;
var selectAppIndex = 0;
var messageArrIndex = null;
var messageRowId = null;
var msgDateFromType = ""; //[month => 1 month] or [skip => skip all data]
var callBackURL;
var callGetMessageList = false;
var messagePageShow = false;

window.initialSuccess = function(data) {
    if (data !== undefined) {

        getDataFromServer = false;
        processStorageData("setLocalStorage", data);

        if (loginData['doLoginDataCallBack'] === false) {
            $.mobile.changePage('#viewMain2-1', {
                reloadPage: true
            });
            $.mobile.changePage('#viewMain2-1');
        }
    } else {

        if (loginData['doLoginDataCallBack'] === true) {
            getLoginDataCallBack();
        } else {

            var doPushToken = new sendPushToken();

            //If User first time to use QPlay, never get message data from server,
            //don't call QueryMessageList() in background.
            if (loginData["msgDateFrom"] !== null) {
                var messageList = new QueryMessageList();
                callGetMessageList = true;
            }

            if (window.localStorage.getItem("openMessage") !== "true") {
                $.mobile.changePage('#viewMain2-1');
            } else {
                //If onOpenNotification, but not login.
                //Atfer login, do onOpenNotification again.
                messageRowId = window.localStorage.getItem("messageRowId");

                //Before open Message Detail Data, update Message List
                if (window.localStorage.getItem("msgDateFrom") === null) {
                    $.mobile.changePage('#viewNewsEvents2-3');
                } else {
                    var messageList = new QueryMessageList();
                    callGetMessageList = true;
                }
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

function getTimestamp() {
    var clientTimestamp = new Date().getTime();
    return clientTimestamp = clientTimestamp.toString().substr(0, 10);
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

    } else if (activePageID === "viewNotSignedIn") {

        navigator.app.exitApp();

    }
}