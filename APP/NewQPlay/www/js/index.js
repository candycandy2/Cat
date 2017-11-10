/*global variable*/
var appKeyOriginal = "appqplay";
var appKey = "appqplay";
var pageList = ["viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1"];
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";

//viewMain2
var appcategorylist;
var applist;
var appmultilang;
var appVersionRecord = {};
checkAPPVersionRecord("initial");

//viewAppDetail2-2
var checkAPPKey;
var checkAPPKeyInstalled = false;

//viewNewsEvents
var messagecontent;
var selectAppIndex = 0;
var messageArrIndex = null;
var messageRowId = null;
var msgDateFromType = ""; //[month => 1 month] or [skip => skip all data]
var callGetMessageList = false;
var messagePageShow = false;
var delMsgActive = false;

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

            //If simulator, don't do sendPushToken
            if (!device.isVirtual) {
                var doPushToken = new sendPushToken();
            }

            //If User first time to use QPlay, never get message data from server,
            //don't call QueryMessageList() in background.
            if (loginData["msgDateFrom"] !== null) {
                var messageList = new QueryMessageList("auto");
                callGetMessageList = true;
            }

            //review by alan
            if (window.localStorage.getItem("openMessage") !== true) {
                $.mobile.changePage('#viewMain2-1', {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: false,
                    reloadPage: true
                });
                $.mobile.changePage('#viewMain2-1');
            } else {
                //If onOpenNotification, but not login.
                //Atfer login, do onOpenNotification again.
                openNewMessage();//refectory
            }

        }
    }

    appInitialFinish = true;
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

        //if (doInitialSuccess) {
        doInitialSuccess = false;
        hideInitialPage();
        //}
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

function addZero(number) {
    if (number < 10) {
        number = "0" + number;
    }
    return number;
}

//review by alan
function openNewMessage() {
    messageRowId = window.localStorage.getItem("messageRowId");

    //Before open Message Detail Data, update Message List
    if (window.localStorage.getItem("msgDateFrom") === null) {
        $.mobile.changePage('#viewNewsEvents2-3');
    } else {
        var messageList = new QueryMessageList();
        callGetMessageList = true;
    }
}

//Cehck APP version record
function checkAPPVersionRecord(action) {
    if (action === "initial") {

        if (window.localStorage.getItem("appVersionRecord") !== null) {
            var tempData = window.localStorage.getItem("appVersionRecord");
            appVersionRecord = JSON.parse(tempData);
        }

    } else if (action === "updateFromAPI") {

        window.localStorage.setItem("appVersionRecord", JSON.stringify(appVersionRecord));

    } else if (action === "updateFromScheme") {

        var tempData = window.localStorage.getItem("appVersionRecord");
        appVersionRecord = JSON.parse(tempData);

        //For old APP Version
        if (appVersionRecord["com.qplay." + queryData["callbackApp"]] !== undefined) {
            if (queryData["versionCode"] !== undefined) {
                appVersionRecord["com.qplay." + queryData["callbackApp"]]["installed_version"] = queryData["versionCode"];
            } else {
                appVersionRecord["com.qplay." + queryData["callbackApp"]]["installed_version"] = "1";
            }
        }

        window.localStorage.setItem("appVersionRecord", JSON.stringify(appVersionRecord));

    }
}

//Check if APP is installed
function checkAPPInstalled(callback, page) {

    callback = callback || null;

    var scheme;

    if (device.platform === 'iOS') {
        scheme = checkAPPKey + '://';
    } else if (device.platform === 'Android') {
        scheme = 'com.qplay.' + checkAPPKey;
    }

    window.testAPPInstalledCount = 0;

    window.testAPPInstalled = setInterval(function() {
        appAvailability.check(
            scheme, //URI Scheme or Package Name
            function() { //Success callback

                if (page === "appDetail") {
                    var latest_version = appVersionRecord["com.qplay." + checkAPPKey]["latest_version"];
                    var installed_version = appVersionRecord["com.qplay." + checkAPPKey]["installed_version"];

                    if (latest_version === installed_version) {
                        loginData['updateApp'] = false;
                    } else {
                        loginData['updateApp'] = true;
                    }

                    callback(true);
                } else if (page === "appList") {
                    callback(true);
                }

                checkAPPKeyInstalled = true;
                stopTestAPPInstalled();
            },
            function() { //Error callback

                if (page === "appDetail") {
                    callback(false);
                } else if (page === "appList") {
                    callback(false);
                }

                checkAPPKeyInstalled = false;
                stopTestAPPInstalled();
            }
        );

        testAPPInstalledCount++;

        if (testAPPInstalledCount === 3) {
            stopTestAPPInstalled();
            location.reload();
        }
    }, 1000);

    window.stopTestAPPInstalled = function() {
        if (window.testAPPInstalled != null) {
            clearInterval(window.testAPPInstalled);
        }
    };
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


//Change event type
$(document).on("click", ".event-type", function() {
    $("#eventTypeSelect").panel("open");
});

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

    } else if (activePageID === "viewMain2-1" || activePageID === "viewAppDetail2-2") {

        $.mobile.changePage('#viewMain2-1');

    } else if (activePageID === "viewNewsEvents2-3") {

        if (delMsgActive) {
            editModeChange();
        } else {
            $.mobile.changePage('#viewMain2-1');
        }

    } else if (activePageID === "viewWebNews2-3-1") {

        goBack("goList");

    } else if (activePageID === "viewNotSignedIn") {

        navigator.app.exitApp();

    } else {

        navigator.app.exitApp();

    }
}