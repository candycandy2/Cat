// component JS
//
// variable, function, page event for All APP
//
// appSecretKey => set in QPlayAPI.js under specific APP
//

var serverURL = "https://qplay.benq.com"; // Production API Server
var appApiPath = "qplayApi";
var qplayAppKey = "appqplay";
var qplaySecretKey = "swexuc453refebraXecujeruBraqAc4e";

var loginData = {
    versionName:         "",
    versionCode:         "",
    deviceType:          "",
    pushToken:           "",
    token:               "",
    token_valid:         "",
    uuid:                "",
    checksum:            "",
    domain:              "",
    emp_no:              "",
    loginid:             "",
    messagecontent:      null,
    msgDateFrom:         null,  //timestamp, latest time of update message from server
    doLoginDataCallBack: false,
    openMessage:         false
};
var queryData = {};
var getDataFromServer = false;
var popupID;
var callHandleOpenURL = false;
var doInitialSuccess = false;
var checkTimerCount = 0;
var doHideInitialPage = false;
var initialNetworkDisconnected = false;
var showNetworkDisconnected = false;
var appInitialFinish = false;
var messageRowId;

/********************************** Corodva APP initial *************************************/
var app = {
    // Application Constructor
    initialize: function() {

        //For test, to clear localStorageData
        /*
        if (window.localStorage.length === 0) {
            this.bindEvents();
        } else {
            window.localStorage.clear();
            this.bindEvents();
        }
        */

        //For release
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        //Add Event to Check Network Status
        if (device.platform === "iOS") {
            window.addEventListener("offline", function(e) {
                checkNetwork();
            });

            window.addEventListener("online", function(e) {
                checkNetwork();
            });
        } else {
            var connection = navigator.connection;
            connection.addEventListener('typechange', checkNetwork);
        }

        //When open APP, need to check Network at first step
        checkNetwork();

        //Set openMessage at first time
        if (window.localStorage.getItem("openMessage") === null) {
            //check data exit in Local Storage
            window.localStorage.setItem("openMessage", false);
        }

        //[Android] Handle the back button, set in index.js
        document.addEventListener("backbutton", onBackKeyDown, false);

        //[device] data ready to get on this step.
        readConfig();

        //for touch overflow content Enabled
        $.mobile.touchOverflowEnabled = true;

        if (device.platform === "iOS") {
            $.mobile.hashListeningEnabled = false;
        }
    },
    onGetRegistradionID: function (data) {
        if (data.length !== 0) {

            loginData["deviceType"] = device.platform;
            loginData["pushToken"] = data;
            window.localStorage.setItem("pushToken", data);
            stopCheck();

            var checkAppVer = new checkAppVersion();
        } else {
            console.log("GetRegistradionID--------null");
            checkTimerCount++;

            //Show viewGetQPush
            $("#viewGetQPush").addClass("ui-page ui-page-theme-a ui-page-active");
            $("#viewInitial").removeClass("ui-page ui-page-theme-a ui-page-active");

            if (checkTimerCount >= 30) {
                $("#viewGetQPush").removeClass("ui-page ui-page-theme-a ui-page-active");
                $("#viewMaintain").addClass("ui-page ui-page-theme-a ui-page-active");
            }
        }
    },
    onOpenNotification: function(data) {
        //Plugin-QPush > 添加後台打開通知后需要執行的內容，data.alert為消息內容
        var doOpenMessage = false;
        //If APP not open, check message after checkAppVersion()
        getMessageID(data);

        if (window.localStorage.getItem("openMessage") === "false") {

            doOpenMessage = true;

            //remember to open Message Detail Data
            loginData["openMessage"] = true;
            window.localStorage.setItem("openMessage", true);
            window.localStorage.setItem("messageRowId", messageRowId);

        } else if (window.localStorage.getItem("openMessage") === "true") {
            //After onBackgoundNotification/onReceiveNotification, then do onOpenNotification
            doOpenMessage = true;
        }

        if (doOpenMessage) {
            //Check if not login
            if (window.localStorage.getItem("loginid") !== null) {
                //Before open Message Detail Data, update Message List
                if (window.localStorage.getItem("msgDateFrom") === null) {

                    $.mobile.changePage('#viewNewsEvents2-3');
                } else {
                    var messageList = new QueryMessageList();
                    callGetMessageList = true;
                }
            }
        }
    },
    onBackgoundNotification: function(data) {
        //Plugin-QPush > 添加後台收到通知后需要執行的內容
        if (window.localStorage.getItem("openMessage") === "false") {
            getMessageID(data);

            if (window.localStorage.getItem("loginid") === null) {
                //remember to open Message Detail Data
                loginData["openMessage"] = true;
                window.localStorage.setItem("openMessage", true);
                window.localStorage.setItem("messageRowId", messageRowId);
            }
        }
    },
    onReceiveNotification: function(data) {
        //Plugin-QPush > 添加前台收到通知后需要執行的內容
        if (window.localStorage.getItem("openMessage") === "false") {
            getMessageID(data);

            if (window.localStorage.getItem("loginid") === null) {
                //remember to open Message Detail Data

                loginData["openMessage"] = true;
                window.localStorage.setItem("openMessage", true);
                window.localStorage.setItem("messageRowId", messageRowId);
            }

            //While open APP in iOS, when get new message, iOS will not show message dialog in status bar,
            //need to do it by Javscript
            if (device.platform === "iOS") {
                loginData["openMessage"] = true;
                window.localStorage.setItem("openMessage", true);
                window.localStorage.setItem("messageRowId", messageRowId);

                $("#newMessageTitle").html(data.aps["alert"]);
                $('#iOSGetNewMessage').popup();
                $('#iOSGetNewMessage').show();
                $('#iOSGetNewMessage').popup('open');

                $("#openNewMessage").on("click", function(){
                    $('#iOSGetNewMessage').popup('close');
                    $('#iOSGetNewMessage').hide();

                    openNewMessage();
                });

                $("#cancelNewMessage").on("click", function(){
                    $('#iOSGetNewMessage').popup('close');
                    $('#iOSGetNewMessage').hide();

                    loginData["openMessage"] = false;
                    window.localStorage.setItem("openMessage", false);
                });
            }
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();

/********************************** jQuery Mobile Event *************************************/
$(document).one("pagebeforecreate", function(){

    $(':mobile-pagecontainer').html("");

    //According to the data [pageList] which set in index.js ,
    //add View template into index.html
    $.map(pageList, function(value, key) {
        (function(pageID){
            $.get("View/" + pageID + ".html", function(data) {
                $.mobile.pageContainer.append(data);
                $("#" + pageID).page().enhanceWithin();
            }, "html");
        }(value));
    });

    //add component view template into index.html
    $.get("View/component.html", function(data) {

        $.mobile.pageContainer.append(data);

        //Set viewInitial become the inde page
        $("#viewInitial").addClass("ui-page ui-page-theme-a ui-page-active");

        //If is other APP, set APP name in initial page
        if (appKey !== qplayAppKey) {
            $("#initialAppName").html(initialAppName);
        }

        //viewNotSignedIn, Login Again
        $("#LoginAgain").on("click", function() {
            //$("#viewNotSignedIn").removeClass("ui-page ui-page-theme-a ui-page-active");
            var checkAppVer = new checkAppVersion();
        });
    }, "html");

    //For APP scrolling in [Android ver:5], set CSS
    $(document).on("pageshow", function() {
        if (device.platform === "Android") {
            var version = device.version.substr(0, 1);
            if (version === "5") {
                $(".ui-mobile .ui-page-active").css("overflow-x", "hidden");
            }
        }
    });
});

/********************************** QPlay APP function *************************************/

//Check if Token Valid is less than 1 hour || expired || invalid || not exist
function checkTokenValid(resultCode, tokenValid, successCallback, data) {

    successCallback =  successCallback || successCallback;
    tokenValid = tokenValid || tokenValid;
    data =  data || data;

    //Success Result Code
    //even though some result code != 1, but it still means the result is success,
    //need to check the token_valid
    var codeArray = [
        //All APP
        "1",
        //QPlay
        "000910", "000913", "000915", "000910", "000919",
        //Yellowpage
        "001901", "001902", "001903", "001904", "001905", "001906",
        //RRS
        "002901", "002902", "002903", "002904", "002905", "002906", "002907"
    ];

    resultCode = resultCode.toString();

    if (codeArray.indexOf(resultCode) !== -1) {
        var doSuccessCallback = false;
        var clientTimestamp = new Date().getTime();
        clientTimestamp = clientTimestamp.toString().substr(0, 10);

        if (!isNaN(tokenValid)) {
            if (parseInt(tokenValid - clientTimestamp, 10) < 60 * 60) {
                //Only QPlay can do re-new Token, other APP must open QPlay to do this work.
                if (appKey === qplayAppKey) {
                    reNewToken();
                } else {
                    getServerData();
                }
            } else {
                if (doInitialSuccess) {
                    doInitialSuccess = false;
                    hideInitialPage();
                } else {
                    doSuccessCallback = true;
                }
            }
        } else {
            //[checkAppVersion] & [logout] won't return token_valid, just do successCallback
            doSuccessCallback = true;
        }

        if (doSuccessCallback) {
            if (typeof successCallback === "function") {
                successCallback(data);
            }
        }

    } else if (resultCode === "000907") {
        //token expired
        getServerData();
    } else if (resultCode === "000908") {
        //token invalid
        getServerData();
    } else if (resultCode === "000911") {
        //uuid not exist
        getServerData();
    } else if (resultCode === "000914") {
        //User Account Suspended
        openAPIError("suspended");
    } else {
        //Other API Result code, show [Please contact ITS]
        var resultCodeStart = resultCode.substr(0, 3);

        if (resultCodeStart === "999") {
            openAPIError("error");
        }
    }
}

function readConfig() {

    loginData["versionName"] = AppVersion.version;
    loginData["versionCode"] = AppVersion.build;

    //according to the versionName, change the appKey
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        appKey = appKeyOriginal + "test";
        serverURL = "https://qplaytest.benq.com"; // Staging API Server
        qplayAppKey = qplayAppKey + "test";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        appKey = appKeyOriginal + "dev";
        serverURL = "https://qplaydev.benq.com"; // Development API Server
        qplayAppKey = qplayAppKey + "dev";
    }else {
        appKey = appKeyOriginal + "";
        serverURL = "https://qplay.benq.com"; // Production API Server
        qplayAppKey = qplayAppKey + "";
    }

    //Plugin-QPush
    if (appKey === qplayAppKey) {
        //後台打开通知
        document.addEventListener('qpush.openNotification', app.onOpenNotification, false);
        //後台收到通知
        document.addEventListener('qpush.backgoundNotification', app.onBackgoundNotification, false);
        //前台收到通知
        document.addEventListener('qpush.receiveNotification', app.onReceiveNotification, false);
    }

    //QPlay need to get PushToken in the first step, else cannot do any continue steps.
    if (appKey === qplayAppKey) {

        //Every Time after Device Ready, need to do QPush init()
        //If simulator, can't get push token
        if (!device.isVirtual) {
            //初始化JPush
            window.plugins.QPushPlugin.init();
        }

        //If pushToken exist in Local Storage, don't need to get new one.
        if (window.localStorage.getItem("pushToken") === null) {

            //If simulator, can't get push token
            if (device.isVirtual) {
                app.onGetRegistradionID(device.uuid);
            } else {
                window.checkTimer = setInterval(function() {
                    window.plugins.QPushPlugin.getRegistrationID(app.onGetRegistradionID);
                }, 1000);

                window.stopCheck = function() {
                    if (window.checkTimer != null) {
                        clearInterval(window.checkTimer);
                    }
                };
            }

        } else {
            loginData["deviceType"] = device.platform;
            loginData["pushToken"] = window.localStorage.getItem("pushToken");

            var checkAppVer = new checkAppVersion();
        }

        //set initial page dispaly
        $("#initialQPlay").removeClass("hide");
        $("#initialOther").remove();
    } else {
        var checkAppVer = new checkAppVersion();

        //set initial page dispaly
        $("#initialOther").removeClass("hide");
        $("#initialQPlay").remove();
    }
}

//API Check APP Version
function checkAppVersion() {
    var self = this;
    var queryStr = "&package_name=com.qplay." + appKey + "&device_type=" + device.platform + "&version_code=" + loginData["versionCode"];

    loadingMask("show");

    this.successCallback = function(data) {

        var resultcode = data['result_code'];

        if (resultcode == 1 || resultcode == 000915) {

            // need to update app
            window.checkVerTimer = setInterval(function() {
                $.mobile.changePage('#viewUpdateAppVersion');

                if ($('#viewUpdateAppVersion').hasClass("ui-page-active")) {
                    $("#viewInitial").removeClass("ui-page ui-page-theme-a ui-page-active");
                    $('#viewUpdateAppVersion').removeClass("hide");
                    $("#mainUpdateAppVersion").show();

                    stopcheckVerTimer();
                }
            }, 1000);

            window.stopcheckVerTimer = function() {
                clearInterval(checkVerTimer);

                loadingMask("hide");
            };

            $("#UpdateAPP").on("click", function(){
                if (appKey === qplayAppKey) {
                    $("body").append('<a id="updateLink" href="#" onclick="window.open(\'' + serverURL + '/InstallQPlay/\', \'_system\');"></a>');
                    document.getElementById("updateLink").click();
                    $("#updateLink").remove();
                } else {
                    //Open QPlay > APP detail page
                    openAPP(qplayAppKey + "://action=openAppDetailPage&openAppName=" + appKey);
                }
            });

        } else if (resultcode == 000913) {

            // app is up to date
            $("#viewGetQPush").removeClass("ui-page ui-page-theme-a ui-page-active");
            var whiteList = new setWhiteList();

        } else if (resultcode == 000915) {

            // app package name does not exist
            $("#viewGetQPush").removeClass("ui-page ui-page-theme-a ui-page-active");
            var whiteList = new setWhiteList();

        }

    }

    this.failCallback = function(data) {};

    var __construct = function() {
        callQPlayAPI("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr);
    }();
}

//Plugin-QSecurity 
function setWhiteList() {

    var self = this;
    loadingMask("hide");

    this.successCallback = function() {
        var doCheckStorageData = false;

        if (appKey !== qplayAppKey) {
            if (window.localStorage.getItem("openScheme") === "true") {
                if (callHandleOpenURL) {
                    return;
                } else {
                    doCheckStorageData = true;
                }
            } else {
                doCheckStorageData = true;
            }
        } else {
            doCheckStorageData = true;
        }

        if (doCheckStorageData) {
            checkStorageData();
        }

        if (device.platform === "Android") {
            $('.ui-btn span').addClass('android-fix-btn-text-middle');
        }

        if (device.platform === "iOS") {
            $('.page-header, .page-main').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display','block');
        }

        $(".ui-title").on("taphold", function(){

            //Set for iOS, control text select
            document.documentElement.style.webkitTouchCallout = "none";
            document.documentElement.style.webkitUserSelect = "none";

            infoMessage();
        });
    };

    this.failCallback = function() {};

    var __construct = function() {
        if (device.platform !== "iOS") {
            if (appKey === qplayAppKey) {
                var securityList = {
                    level: 2,
                    Navigations: [
                        "https://qplaytest.benq.com/*",
                        "https://qplaydev.benq.com/*",
                        "https://qplay.benq.com/*",
                        "itms-services://*"
                    ],
                    /*Intents: [
                        "itms-services:*",
                        "http:*",
                        "https:*",
                        "appyellowpage:*",
                        "tel:*",
                        "sms:*",
                        "mailto:*",
                        "geo:*"
                    ],*/
                    Intents: [
                        "https:*"
                    ],
                    Requests: [
                        "https://qplaytest.benq.com/*",
                        "https://qplaydev.benq.com/*",
                        "https://qplay.benq.com/*"
                    ]
                };
            } else {
                var securityList = {
                    level: 2,
                    Navigations: [
                        "https://qplaytest.benq.com/*",
                        "https://qplaydev.benq.com/*",
                        "https://qplay.benq.com/*",
                        "itms-services://*"
                    ],
                    /*Intents: [
                        "itms-services:*",
                        "http:*",
                        "https:*",
                        qplayAppKey + ":*",
                        "tel:*",
                        "sms:*",
                        "mailto:*",
                        "geo:*"
                    ],*/
                    Intents: [],
                    Requests: [
                        "https://qplaytest.benq.com/*",
                        "https://qplaydev.benq.com/*",
                        "https://qplay.benq.com/*"
                    ]
                };
            }

            //Sometimes window.plugins.qsecurity.setWhiteList() won't work correctly,
            //both self.successCallback & self.failCallback won't be call.
            //So, we need to call self.successCallback() directly.
            if (loginData['doLoginDataCallBack'] === true || loginData['openAppDetailPage'] === true) {
                self.successCallback();
            } else {
                window.plugins.qsecurity.setWhiteList(securityList, self.successCallback, self.failCallback);
            }
        } else {
            self.successCallback();
        }
    }();
}

//check data(token, token_value, ...) on web-storage
function checkStorageData() {
    if (window.localStorage.length === 0) {
        getDataFromServer = true;
    } else {
        //1. check loginData exist in localStorage
        var loginDataExist = processStorageData("checkLocalStorage");

        if (loginDataExist) {
            //2. if token exist, check token valid from server
            processStorageData("checkSecurityList");
        } else {
            //3. if token not exist, call QLogin / QPlay
            getDataFromServer = true;
        }
    }

    if (getDataFromServer) {
        getServerData();
    }
}

function processStorageData(action, data) {
    data = data || null;

    if (action === "checkLocalStorage") {
        var checkLoginDataExist = true;

        $.map(loginData, function(value, key) {
            if (key === "token" || key === "token_valid") {
                if (window.localStorage.getItem(key) === null) {
                    checkLoginDataExist = false;
                }
            }
        });

        return checkLoginDataExist;
    } else if (action === "checkSecurityList") {
        $.map(loginData, function(value, key) {
            if (window.localStorage.getItem(key) !== null) {
                loginData[key] = window.localStorage.getItem(key);
            }
        });

        var securityList = new getSecurityList();
    } else if (action === "setLocalStorage") {
        $.map(data, function(value, key) {
            window.localStorage.setItem(key, value);
        });

        $.map(loginData, function(value, key) {
            if (window.localStorage.getItem(key) !== null) {
                loginData[key] = window.localStorage.getItem(key);
            }
        });

        if (appKey === qplayAppKey) {
            if (loginData['doLoginDataCallBack'] === true) {
                getLoginDataCallBack();
            } else {
                var securityList = new getSecurityList();
            }
        }
    }

}

//QPlay => open QLogin
//Other APP => open QPlay to get Token or do QLogin
function getServerData() {

    if (appKey === qplayAppKey) {
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        //args[1] = device.uuid;    //return by cordova-plugin-device
        args[1] = window.localStorage.getItem("pushToken");   //return by plugin QPush

        window.plugins.qlogin.openCertificationPage(null, null, args);
    } else {
        if (window.localStorage.getItem("openScheme") !== "true") {
            openAPP(qplayAppKey + "://callbackApp=" + appKey + "&action=getLoginData");
        }

        window.localStorage.setItem("openScheme", true);
    }

}

//Plugin-QSecurity
//Get security of this APP, and is the First API to check token_valid
function getSecurityList() {

    var self = this;
    var queryStr = "&app_key=" + appKey;

    this.successCallback = function(data) {
        doInitialSuccess = true;
        checkTokenValid(data['result_code'], data['token_valid'], null, null);
    };

    this.failCallback = function(data) {};

    var __construct = function() {
        callQPlayAPI("GET", "getSecurityList", self.successCallback, self.failCallback, null, queryStr);
    }();

}

function createAPPSchemeURL() {
    return "://callbackApp=" + appKey + "&action=retrunLoginData&token=" + loginData['token'] +
           "&token_valid=" + loginData['token_valid'] + "&uuid=" + loginData['uuid'] + "&checksum=" + loginData['checksum'] +
           "&domain=" + loginData['domain'] + "&emp_no=" + loginData['emp_no'] + "&loginid=" + loginData['loginid'];
}

//Return Login Data from QPlay
function getLoginDataCallBack() {
    var callBackURL = queryData["callbackApp"] + createAPPSchemeURL();
    openAPP(callBackURL);

    loginData['doLoginDataCallBack'] = false;

    $.mobile.changePage('#viewMain2-1');
}

//For Scheme, in iOS/Android, when open APP by Scheme, this function will be called
function handleOpenURL(url) {

    if (url !== "null") {

        callHandleOpenURL = true;

        //parse URL parameter
        var tempURL = url.split("//");
        var queryString = tempURL[1];
        var tempQueryData = queryString.split("&");
        queryData = {};

        $.map(tempQueryData, function(value, key) {
            var tempData = value.split("=");
            queryData[tempData[0]] = tempData[1];
        });

        if (appKey === qplayAppKey && queryData["action"] === "getLoginData") {

            loginData['doLoginDataCallBack'] = true;

        } else if (appKey === qplayAppKey && queryData["action"] === "openAppDetailPage") {

            loginData['openAppDetailPage'] = true;
            loginData['updateApp'] = true;
            openAppName = queryData["openAppName"];


        } else if (queryData["action"] === "retrunLoginData") {

            window.localStorage.setItem("openScheme", false);

            $.map(queryData, function(value, key) {
                if (key !== "callbackApp" && key !== "action") {
                    window.localStorage.setItem(key, value);
                    loginData[key] = value;
                }
            });

            hideInitialPage();
        }

        //Because Scheme work different process between [APP is in action or background] / [APP is not open],
        //[APP is in action or background] need to following step.
        if (loginData['doLoginDataCallBack'] === true) {
            $.mobile.changePage('#viewInitial');
            if (appInitialFinish === true) {
                var checkAppVer = new checkAppVersion();
            }
        }

        if (loginData['openAppDetailPage'] === true) {
            if (appInitialFinish === true) {
                var checkAppVer = new checkAppVersion();
            }
        }

    } else {
        if (appKey !== qplayAppKey) {
            checkStorageData();
        }
    }

}
