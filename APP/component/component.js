// component JS
//
// variable, function, page event for All APP
//
// appSecretKey => set in QPlayAPI.js under specific APP
//

var serverURL = "https://qplay.benq.com"; // Production API Server
var appApiPath = "qplayApi";
var qplayAppKey = "appqplay";
var download_url = "";

if (window.localStorage.getItem("appKey") !== null) {
    appKey = window.localStorage.getItem("appKey");
    serverURL = window.localStorage.getItem("serverURL");
    qplayAppKey = window.localStorage.getItem("qplayAppKey");
}

var qplaySecretKey = "swexuc453refebraXecujeruBraqAc4e";
var appEnvironment = "";
var browserLanguage;
var langStr = {};
var logFileName;

var loginData = {
    versionName: "",
    versionCode: "",
    deviceType: "",
    pushToken: "",
    token: "",
    token_valid: "",
    uuid: "",
    checksum: "",
    domain: "",
    emp_no: "",
    loginid: "",
    messagecontent: null,
    msgDateFrom: null, //timestamp, latest time of update message from server
    doLoginDataCallBack: false,
    openMessage: false
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
var reStartAPP = false;
var appInitialFinish = false;
var messageRowId;
var closeInfoMsgInit = false; // let closeInfoMsg click event init once

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
        setTimeout(function() {
            readConfig();
        }, 2000);

        //for touch overflow content Enabled
        $.mobile.touchOverflowEnabled = true;

        if (device.platform === "iOS") {
            $.mobile.hashListeningEnabled = false;
        }

        //Log -
        //get now year + month
        var now = new Date();
        logFileName = now.yyyymm("");
        //console.log(cordova.file);
        //LogFile.checkOldFile();
    },
    onGetRegistradionID: function(data) {
        if (data.length !== 0) {

            loginData["deviceType"] = device.platform;
            loginData["pushToken"] = data;
            window.localStorage.setItem("deviceType", device.platform);
            window.localStorage.setItem("pushToken", data);
            stopCheck();

            var checkAppVer = new checkAppVersion();
        } else {
            console.log("GetRegistradionID--------null");
            checkTimerCount++;

            //Show viewGetQPush
            $("#viewGetQPush").addClass("ui-page ui-page-theme-a ui-page-active");
            $("#viewInitial").removeClass("ui-page ui-page-theme-a ui-page-active");

            // set need to qpush's layout when landscape
            if (window.orientation === 90 || window.orientation === -90)
                $('.main-GetQPush').css('top', (screen.height - $('.main-GetQPush').height()) / 4);

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
                    if (window.localStorage.getItem("uuid") !== null) {
                        loginData["uuid"] = window.localStorage.getItem("uuid");
                        loginData["token"] = window.localStorage.getItem("token");
                        loginData["pushToken"] = window.localStorage.getItem("pushToken");

                        var messageList = new QueryMessageList();
                        callGetMessageList = true;
                    }
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

                $("#openNewMessage").one("click", function() {
                    $('#iOSGetNewMessage').popup('close');
                    $('#iOSGetNewMessage').hide();

                    openNewMessage();
                });

                $("#cancelNewMessage").one("click", function() {
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
$(document).one("pagebeforecreate", function() {

    $(':mobile-pagecontainer').html("");

    //According to the data [pageList] which set in index.js ,
    //add Page JS into index.html
    $.map(pageList, function(value, key) {
        (function(pageID) {
            /*
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "js/" + pageID + ".js";
            $("head").append(s);
            */

            var script = document.createElement("script");
            // onload fires even when script fails loads with an error.
            //script.onload = onload;
            // onerror fires for malformed URLs.
            //script.onerror = onerror;
            script.type = "text/javascript";
            script.src = "js/" + pageID + ".js";
            document.head.appendChild(script);
        }(value));
    });

    //According to the data [pageList] which set in index.js ,
    //add View template into index.html
    $.map(pageList, function(value, key) {
        (function(pageID) {
            $.get("View/" + pageID + ".html", function(data) {
                $.mobile.pageContainer.append(data);
                $("#" + pageID).page().enhanceWithin();
            }, "html");
        }(value));
    });

    //Browser default language, according to the mobile device language setting
    //navigator.language: en-US / zh-CN / zh-TW
    //note:
    //1. All english country(ex: en-ln, en-ph, en-nz ...), use "en-us"
    //2. If Browser default language not exist in /string , use APP default language "zh-tw"
    browserLanguage = navigator.language.toLowerCase();
    var languageShortName = browserLanguage.substr(0, 2);

    if (languageShortName === "en") {
        browserLanguage = "en-us";
    }

    $.getJSON("string/" + browserLanguage + ".json", function(data) {
            //language string exist
            getLanguageString();
        })
        .fail(function() {
            //language string does not exist
            browserLanguage = "zh-tw";
            getLanguageString();
        });

    //For APP scrolling in [Android ver:5], set CSS
    $(document).on("pageshow", function() {
        if (device.platform === "Android") {
            $(".ui-mobile .ui-page-active").css("overflow-x", "hidden");
            $(".ui-header-fixed").css("position", "fixed");

            var version = device.version.substr(0, 1);
            if (version === "6") {
                $(".ui-footer-fixed").css("position", "fixed");
            }
        } else if (device.platform === "iOS") {
            $('.page-header').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display', 'block');
            $('.ui-page:not(#viewInitial)').addClass('ui-page-ios');
        }

        adjustPageMarginTop();

        // tab title, open version, uuid window
        $(".ui-title").on("taphold", function() {
            //Set for iOS, control text select
            document.documentElement.style.webkitTouchCallout = "none";
            document.documentElement.style.webkitUserSelect = "none";

            infoMessage();
        });

        // close ifo msg init
        if (!closeInfoMsgInit) {
            $(document).on('click', '#infoMsg #closeInfoMsg', function() {
                $('#infoMsg').popup('close');
                $('#infoMsg').hide();
            });
            closeInfoMsgInit = true;
        }
    });

    //For Message Content, click link to open APP by Scheme
    $(document).on("click", "a", function(event) {
        if ($(this).prop("href") != null) {
            var id = $(this).prop("id");
            var href = $(this).prop("href");
            var hrefStart = href.substr(0, 3);

            if (hrefStart === "app") {
                if (id !== "schemeLink") {
                    event.preventDefault();
                    openAPP(href);
                }
            }
        }
    });

    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
            /*do somrthing when device is in portraint mode*/
            if (device.platform === "iOS") {
                adjustPageMarginTop();
            }
        }
    }, false);

});

/********************************** QPlay APP function *************************************/

//review by alan
//Check if Token Valid is less than 1 hour || expired || invalid || not exist
function checkTokenValid(resultCode, tokenValid, successCallback, data) {

    successCallback = successCallback || null;
    tokenValid = tokenValid || null;
    data = data || null;

    resultCode = resultCode.toString();

    if (resultCode === "000907") {
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

        //Other APP
        //errorCodeArray set in APP's index.js
        if (!typeof errorCodeArray === "undefined") {
            if (errorCodeArray.indexOf(resultCode) !== -1) {
                openAPIError("error");
            }
        } else {

            var doSuccessCallback = false;

            //[checkAppVersion] & [logout] won't return token_valid, just do successCallback
            if (tokenValid == null) {
                doSuccessCallback = true;
            } else {
                //Other Result code from API, show [Please contact ITS]
                var resultCodeStart = resultCode.substr(0, 3);

                if (resultCodeStart === "999") {
                    openAPIError("error");
                } else {
                    //Each [Success] case
                    var clientTimestamp = new Date().getTime();
                    clientTimestamp = clientTimestamp.toString().substr(0, 10);

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
                }
            }

            if (doSuccessCallback) {
                if (typeof successCallback === "function") {
                    successCallback(data);
                }
            }
        }
    }
}

function readConfig() {

    loginData["versionName"] = AppVersion.version;
    loginData["versionCode"] = AppVersion.build;

    //set in Local Storage
    if (window.localStorage.getItem("appKey") === null) {
        //according to the versionName, change the appKey
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            appEnvironment = "test";
            appKey = appKeyOriginal + "test";
            serverURL = "https://qplaytest.benq.com"; // Staging API Server
            qplayAppKey = qplayAppKey + "test";
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            appEnvironment = "dev";
            appKey = appKeyOriginal + "dev";
            serverURL = "https://qplaydev.benq.com"; // Development API Server
            qplayAppKey = qplayAppKey + "dev";
        } else {
            appEnvironment = "";
            appKey = appKeyOriginal + "";
            serverURL = "https://qplay.benq.com"; // Production API Server
            qplayAppKey = qplayAppKey + "";
        }

        window.localStorage.setItem("appKey", appKey);
        window.localStorage.setItem("serverURL", serverURL);
        window.localStorage.setItem("qplayAppKey", qplayAppKey);
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

    } else {
        var doCheckAppVer = false;

        //Check if the APP is finished update, running the latest code.
        if (window.localStorage.getItem("versionCode") === null) {
            //No, this is the first time to open this APP.
            window.localStorage.setItem("versionCode", loginData["versionCode"]);

            var versionCode = parseInt(loginData["versionCode"], 10);
            //For old APP Version
            //
            //RRS
            if (appKey.indexOf("rrs") !== -1) {
                if (appEnvironment.length === 0) {
                    //Production
                    if (versionCode > 23 && versionCode <= 234) {
                        getServerData();
                    }
                } else if (appEnvironment === "test") {
                    //Staging
                    if (versionCode > 226 && versionCode <= 234) {
                        getServerData();
                    }
                }
            }
            //Yellowpage
            if (appKey.indexOf("yellowpage") !== -1) {
                if (appEnvironment.length === 0) {
                    //Production
                    if (versionCode > 226 && versionCode <= 234) {
                        getServerData();
                    }
                } else if (appEnvironment === "test") {
                    //Staging
                    if (versionCode > 226 && versionCode <= 234) {
                        getServerData();
                    }
                }
            }

            doCheckAppVer = true;
        } else {
            var oldVersionCode = parseInt(window.localStorage.getItem("versionCode"), 10);
            var nowVersionCode = parseInt(loginData["versionCode"], 10);

            if (nowVersionCode > oldVersionCode) {
                //Yes, APP is just finished update.
                getServerData();
                window.localStorage.setItem("versionCode", loginData["versionCode"]);
            } else {
                //No, APP does not have update.
                doCheckAppVer = true;
            }
        }

        if (doCheckAppVer) {
            var checkAppVer = new checkAppVersion();
        }
    }
}

//API Check APP Version
function checkAppVersion() {
    var self = this;
    var queryStr = "&package_name=com.qplay." + appKey + "&device_type=" + device.platform + "&version_code=" + loginData["versionCode"];

    loadingMask("show");

    this.successCallback = function(data) {

        var resultcode = data['result_code'];

        if (resultcode == 1) {

            download_url = data['content']['download_url'];
            // need to update app
            window.checkVerTimer = setInterval(function() {
                $.mobile.changePage('#viewUpdateAppVersion');

                if ($('#viewUpdateAppVersion').hasClass("ui-page-active")) {
                    $("#viewInitial").removeClass("ui-page ui-page-theme-a ui-page-active");
                    $('#viewUpdateAppVersion').removeClass("hide");
                    $("#mainUpdateAppVersion").show();

                    // set update app version's layout when landscape
                    if (window.orientation === 90 || window.orientation === -90)
                        $('.main-updateAppVersion').css('top', (screen.height - $('.main-updateAppVersion').height()) / 4);
                    stopcheckVerTimer();
                }
            }, 1000);

            window.stopcheckVerTimer = function() {
                clearInterval(checkVerTimer);

                loadingMask("hide");
            };

            $("#UpdateAPP").on("click", function() {
                if (appKey === qplayAppKey) {
                    $("body").append('<a id="updateLink" href="#" onclick="window.open(\'' + serverURL + '/InstallQPlay/\', \'_system\');"></a>');
                    document.getElementById("updateLink").click();
                    $("#updateLink").remove();
                } else {
                    //Download link without QPlay
                    window.open(download_url, '_system');

                    //Open QPlay > APP detail page
                    //openAPP(qplayAppKey + "://callbackApp=" + appKey + "&action=openAppDetailPage&versionCode=" + loginData["versionCode"]);
                }
            });

        } else if (resultcode == 000913) {

            // app is up to date
            $("#viewGetQPush").removeClass("ui-page ui-page-theme-a ui-page-active");
            var whiteList = new setWhiteList();

        } else if (resultcode == 999015) {

            // app apk/ipa file does not upload to QPlay.
            // This status only for Developer to skip check the version of New Create APP.
            $("#viewGetQPush").removeClass("ui-page ui-page-theme-a ui-page-active");
            var whiteList = new setWhiteList();

        } else if (resultcode == 999012) {
            // app has been removed in QPlay.
        }

    }

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr);
    }();
}

//Plugin-QSecurity 
function setWhiteList() {

    var self = this;
    loadingMask("hide");

    this.successCallback = function() {
        var doCheckStorageData = false;

        if (appKey !== qplayAppKey) {
            if (callHandleOpenURL) {
                return;
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
            $('.page-header').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display', 'block');
        }
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
        args[1] = window.localStorage.getItem("pushToken"); //return by plugin QPush

        window.plugins.qlogin.openCertificationPage(null, null, args);
    } else {
        openAPP(qplayAppKey + "://callbackApp=" + appKey + "&action=getLoginData&versionCode=" + loginData["versionCode"]);
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
        QPlayAPI("GET", "getSecurityList", self.successCallback, self.failCallback, null, queryStr);
    }();

}

//review by alan
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

    $.mobile.changePage('#viewMain2-1', {
        reloadPage: true
    });
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

            //APP version record
            checkAPPVersionRecord("updateFromScheme");

        } else if (appKey === qplayAppKey && queryData["action"] === "openAppDetailPage") {

            loginData['openAppDetailPage'] = true;
            loginData['updateApp'] = true;

            //For old APP Version
            if (queryData["callbackApp"] === undefined) {
                openAppName = queryData["openAppName"];
                queryData["callbackApp"] = queryData["openAppName"];
            } else {
                openAppName = queryData["callbackApp"];
            }

            //APP version record
            checkAPPVersionRecord("updateFromScheme");

        } else if (queryData["action"] === "retrunLoginData") {

            $.map(queryData, function(value, key) {
                if (key !== "callbackApp" && key !== "action") {
                    window.localStorage.setItem(key, value);
                    loginData[key] = value;
                }
            });

            //review by alan
            //force to check APP version
            //hideInitialPage();
        } else {
            //For Other APP, which was be opened by dynamic action,
            //the specific funciton [handleOpenByScheme] need to set in APP/www/js/index.js
            if (handleOpenByScheme !== null) {
                if (typeof handleOpenByScheme === "function") {
                    callHandleOpenURL = false;
                    handleOpenByScheme(queryData);
                }
            }
        }

        //Because Scheme work different process between [APP is in action or background] / [APP is not open],
        //[APP is in action or background] need to following step.
        if (loginData['doLoginDataCallBack'] === true) {
            $("#viewInitial").addClass("ui-page ui-page-theme-a ui-page-active");
            $("#viewMain2-1").removeClass("ui-page ui-page-theme-a ui-page-active");

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
