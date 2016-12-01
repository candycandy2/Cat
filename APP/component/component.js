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
    msgDateFrom:         null,
    doLoginDataCallBack: false,
    callCheckAPPVer:     false,
    callQLogin:          false,
    openMessage:         false
};
var queryData = {};
var getDataFromServer = false;
var popupID;
var callHandleOpenURL = false;
var doInitialSuccess = false;

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

        //[Android]Handle the back button, set in index.js
        document.addEventListener("backbutton", onBackKeyDown, false);

        //[device] data ready to get on this step.
        readConfig();

        //for touch overflow content Enabled
        $.mobile.touchOverflowEnabled = true;
    },
    onGetRegistradionID: function (data){
        try {
            loginData["deviceType"] = device.platform;
            loginData["pushToken"] = data;
        } catch(exception) {
            console.log(exception);
        }
    },
    onOpenNotification: function(data) {
    //Plugin-QPush > 添加後台打開通知后需要執行的內容，data.alert為消息內容

        //If APP not open, check message after checkAppVersion()
        messageRowId = data.extras["Parameter"];

        if (loginData["openMessage"] === false) {

            loginData["openMessage"] = true;
            window.localStorage.setItem("openMessage", true);
            window.localStorage.setItem("messageRowId", messageRowId);

            $.mobile.changePage("#viewWebNews2-3-1");
        } else {
            $.mobile.changePage("#viewWebNews2-3-1");
        }
    },
    onBackgoundNotification: function(data) {
    //Plugin-QPush > 添加後台收到通知后需要執行的內容
    },
    onReceiveNotification: function(data) {
    //Plugin-QPush > 添加前台收到通知后需要執行的內容
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();

//According to the data [pageList] which set in index.js ,
//add View template into index.html
$(document).one("pagebeforecreate", function(){

    $(':mobile-pagecontainer').html("");

    $.map(pageList, function(value, key) {
        (function(pageID){
            $.get("View/" + pageID + ".html", function(data) {
                $.mobile.pageContainer.append(data);
                $("#" + pageID).page().enhanceWithin();
            }, "html");
        }(value));
    });

});

//According to the data [pageList] which set in index.js ,
//select the first data become the index page.
$(document).one("pagecreate", "#"+pageList[0], function(){
    $(":mobile-pagecontainer").pagecontainer("change", $("#"+pageList[0]));
});

/********************************** function *************************************/

//[Android]Popup > Check if popup is shown, then if User click [back] button, just hide the popup.
function checkPopupShown() {
    if ($(".ui-popup-active").length > 0) {
        popupID = $(".ui-popup-active")[0].children[0].id;
        return true;
    } else {
        popupID = "";
        return false;
    }
}

//Plugin-QSecurity 
function setWhiteList() {

    var self = this;

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
                        "https://qplaytest.benq.com/*"
                    ]
                };
            } else {
                var securityList = {
                    level: 2,
                    Navigations: [
                        "https://qplaytest.benq.com/*",
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
                        "https://qplaytest.benq.com/*"
                    ]
                };
            }

            window.plugins.qsecurity.setWhiteList(securityList, self.successCallback, self.failCallback);
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
        if (appKey !== qplayAppKey) {
            getServerData();
        } else {
            loginData['callCheckAPPVer'] = true;
            loginData['callQLogin'] = true;
            initialSuccess();
        }
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
            loginData[key] = value;
        });

        if (appKey === qplayAppKey) {
            if (loginData['doLoginDataCallBack'] === true) {
                getLoginDataCallBack();
            }
            getMessageList();

            var doPushToken = new sendPushToken();
        }
    }

}

//QPlay => open QLogin
//Other APP => open QPlay to get Token or do QLogin
function getServerData() {

    if (appKey === qplayAppKey) {
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        args[1] = device.uuid;

        window.plugins.qlogin.openCertificationPage(null, null, args);
    } else {
        window.localStorage.setItem("openScheme", true);
        openAPP(qplayAppKey + "://callbackApp=" + appKey + "&action=getLoginData");
        navigator.app.exitApp();
    }

}

function openAPP(URL) {
    $("body").append('<a id="schemeLink" href="' + URL + '"></a>');
    document.getElementById("schemeLink").click();
    $("#schemeLink").remove();
}

//Plugin-QSecurity > Now just for check [token] valid
function getSecurityList() {

    var self = this;

    this.successCallback = function(data) {
        doInitialSuccess = true;
        checkTokenValid(data['result_code'], data['token_valid'], null, null);
    };

    this.failCallback = function(data) {};

    var __construct = function() {

        var signatureTime = Math.round(new Date().getTime()/1000);
        var hash = CryptoJS.HmacSHA256(signatureTime.toString(), qplaySecretKey);
        var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);

        $.ajax({
            type: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': qplayAppKey,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: serverURL + "/qplayApi/public/index.php/v101/qplay/getSecurityList?lang=en-us&uuid=" + loginData.uuid + "&app_key=" + appKey,
            dataType: "json",
            cache: false,
            success: self.successCallback,
            fail: self.failCallback
        });

    }();

}

//Check if Token Valid is less than 1 hour || expired || invalid || not exist
function checkTokenValid(resultCode, tokenValid, successCallback, data) {

    successCallback =  successCallback || successCallback;
    tokenValid = tokenValid || tokenValid;
    data =  data || data;

    //Success Result Code
    //Yellowpage: 001901, 001902, 001903, 001904, 001905, 001906

    resultCode = resultCode.toString();

    if (resultCode === "1" || resultCode === "001901" || resultCode === "001902" || resultCode === "001903" 
        || resultCode === "001904" || resultCode === "001905" || resultCode === "001906") {

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
                    initialSuccess();
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
        getServerData();
    }
}

//re-new Token Valid
function reNewToken() {
    var self = this;

    this.successCallback = function(data) {
        var resultSuccess = false;
        var resultcode = data['result_code'];
        var newTokenValid = data['token_valid'];

        if (resultcode == 1) {
            loginData["token"] = data['content'].token;
            loginData["token_valid"] = newTokenValid;

            window.localStorage.setItem("token", data['content'].token);
            window.localStorage.setItem("token_valid", newTokenValid);
        } else {
            //other case
        }

        if (doInitialSuccess) {
            doInitialSuccess = false;
            initialSuccess();
        }
    };

    this.failCallback = function(data) {};

    var __construct = function() {

        var signatureTime = Math.round(new Date().getTime()/1000);
        var hash = CryptoJS.HmacSHA256(signatureTime.toString(), qplaySecretKey);
        var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);

        $.ajax({
            type: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': qplayAppKey,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: serverURL + "/qplayApi/public/index.php/v101/qplay/renewToken?lang=en-us&uuid=" + loginData.uuid,
            dataType: "json",
            cache: false,
            success: self.successCallback,
            fail: self.failCallback
        });

    }();
}

//Plugin-QPush
function sendPushToken(data) {
    var self = this;
    var queryStr = "&app_key=" + qplayAppKey + "&device_type=" + loginData.deviceType;

    this.successCallback = function(data) {

    };

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("POST", "sendPushToken", self.successCallback, self.failCallback, null, queryStr);
    }();
}

function getSignature(action, signatureTime) {
  if (action === "getTime") {
    return Math.round(new Date().getTime()/1000);
  } else {
    var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
    return CryptoJS.enc.Base64.stringify(hash);
  }
}

function loadingMask(action) {
    if (action === "show") {
        if ($(".loader").length === 0) {
            $('<div class="loader"><img src="img/ajax-loader.gif"><div style="color:#FFF;">Loading....</div></div>').appendTo("body");
        } else {
            $(".loader").show();
        }
    } else if (action === "hide") {
        $(".loader").hide();
    }
}

function readConfig() {
    /*
    if (device.platform === "iOS") {
        var configPath = "../config.xml";
    } else {
        var configPath = "../../android_res/xml/config.xml";
    }

    if (device.platform === "iOS") {
        $.ajax({
            url: configPath,
            dataType: 'html',
            success: function(html) {
                var config = $(html);
                loginData["version"] = config[2].getAttribute("version");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log(textStatus, errorThrown);
            }
        });
    }
    */
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
        qplayAppKey = qplayAppKey + "test";
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

    //Plugin-QSecurity
    setTimeout(function() {
        var whiteList = new setWhiteList();
    }, 1000);

    //Plugin-QPush
    if (appKey === qplayAppKey) {
        //初始化JPush
        window.plugins.QPushPlugin.init();
        window.plugins.QPushPlugin.getRegistrationID(app.onGetRegistradionID);
    }
}

//Taphold APP Header to show Version/AD/UUID
function infoMessage() {
    loadingMask("show");

    var msg = '<div id="infoMsg" style="width:80%; height:30%; position:absolute; background-color:#000; color:#FFF; top:30%; left:10%; z-index:10000;">' +
                '<p style="padding:0 5%">' + loginData["loginid"] + '</p>' +
                '<p style="padding:0 5%">' + loginData["uuid"] + '</p>' +
                '<p style="padding:0 5%">' + loginData["versionName"] + '</p>' +
                '<p style="text-align:center;" id="closeInfoMsg">[ X ]</p>' +
              '</div>';

    $.mobile.pageContainer.append(msg);

    $("#closeInfoMsg").on("click", function(){
        $("#infoMsg").remove();
        loadingMask("hide");
    });
}

//Return Login Data from QPlay
function getLoginDataCallBack() {
    var callBackURL = queryData["callbackApp"] + "://callbackApp=" + appKey + "&action=retrunLoginData&token=" + loginData['token'] +
                      "&token_valid=" + loginData['token_valid'] + "&uuid=" + loginData['uuid'] + "&checksum=" + loginData['checksum'] +
                      "&domain=" + loginData['domain'] + "&emp_no=" + loginData['emp_no'] + "&loginid=" + loginData['loginid'];
    openAPP(callBackURL);

    loginData['doLoginDataCallBack'] = false;
    navigator.app.exitApp();
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

            if (device.platform === "iOS") {
                $.mobile.changePage('#viewInitial1-1');
                var whiteList = new setWhiteList();
            }

        } else if (queryData["action"] === "retrunLoginData") {

            window.localStorage.setItem("openScheme", false);

            $.map(queryData, function(value, key) {
                if (key !== "callbackApp" && key !== "action") {
                    window.localStorage.setItem(key, value);
                    loginData[key] = value;
                }
            });

            initialSuccess();
        }

    } else {
        if (appKey !== qplayAppKey) {
            checkStorageData();
        }
    }

}
