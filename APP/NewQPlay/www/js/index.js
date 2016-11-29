
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
var callGetMessageList = false;

window.initialSuccess = function(data) {
    if (data !== undefined) {

        loginData['callQLogin'] = false;
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
        setTimeout(function(){
            var checkAppVer = new checkAppVersion();
            loadingMask("show");
        }, 2000);

        var doPushToken = new sendPushToken();
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