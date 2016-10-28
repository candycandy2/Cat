// component JS
//
// variable, function, page event for All APP
//
// appSecretKey => set in QPlayAPI.js under specific APP
//

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey;
var loginData = {
    deviceType:          "",
    pushToken:           "",
    token:               "",
    token_valid:         "",
    uuid:                "",
    checksum:            "",
    domain:              "",
    emp_no:              "",
    messagecontent:      null,
    msgDateFrom:         null,
    doLoginDataCallBack: false,
    callCheckAPPVer:     false,
    callQLogin:          false,
    openMessage:         false
};
var queryData = {};
var getDataFromServer = false;

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

        if (appKey === "appqplay") {
            //QPUSH////////////////////////////////////////////////////////////////////////////////
            //後台打开通知
            document.addEventListener('qpush.openNotification', this.onOpenNotification, false);
            //後台收到通知
            document.addEventListener('qpush.backgoundNotification', this.onBackgoundNotification, false);
            //前台收到通知
            document.addEventListener('qpush.receiveNotification', this.onReceiveNotification, false);
        }
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        //[device] data ready to get on this step.

        //For QSecurity
        var whiteList = new setWhiteList();

        if (appKey === "appqplay" && device.platform === "Android") {
            //初始化JPush
            window.plugins.QPushPlugin.init();
            window.plugins.QPushPlugin.getRegistrationID(app.onGetRegistradionID);
        }
    },
    onGetRegistradionID: function (data){
        try {
            loginData["deviceType"] = device.platform;
            loginData["pushToken"] = data;

            var doPushToken = new sendPushToken();
        } catch(exception) {
            console.log(exception);
        }
    },
    onOpenNotification: function(data) {
    //添加後台打開通知后需要執行的內容，data.alert為消息內容

        //If APP not open, check message after checkAppVersion()
        messageRowId = data.extras["Parameter"];

        if (loginData["openMessage"] === false) {
            loginData["openMessage"] = true;
        } else {
            $.mobile.changePage("#viewWebNews2-3-1");
        }

    },
    onBackgoundNotification: function(data) {
    //添加後台收到通知后需要執行的內容
    },
    onReceiveNotification: function(data) {
    //添加前台收到通知后需要執行的內容
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

app.initialize();

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


$(document).one("pagecreate", "#"+pageList[0], function(){
    $(":mobile-pagecontainer").pagecontainer("change", $("#"+pageList[0]));
});

/********************************** function *************************************/
function setWhiteList() {

    var self = this;

    this.successCallback = function() {

        if (appKey !== "appqplay") {
            if (window.localStorage.getItem("openScheme") === "true") {
                if (device.platform !== "iOS") {
                    window.plugins.qlogin.openAppCheckScheme(null, null);
                    return;
                }
                window.localStorage.setItem("openScheme", false);
            }
        }

        if (device.platform === "Android") {
            $('.ui-btn span').addClass('android-fix-btn-text-middle');

            if (appKey === "appqplay") {
                window.plugins.qlogin.openAppCheckScheme(null, null);
            }
        }

        //check data(token, token_value, ...) on web-storage
        checkStorageData();

        if (device.platform === "iOS") {
            $('.page-header, .page-main').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display','block');
        }

    };

    this.failCallback = function() {};

    var __construct = function() {
        if (device.platform !== "iOS") {
            if (appKey === "appqplay") {
                var securityList = {
                    level: 2,
                    Navigations: [
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
                        "https://qplay.benq.com/*"
                    ]
                };
            } else {
                var securityList = {
                    level: 2,
                    Navigations: [
                        "https://qplay.benq.com/*",
                        "itms-services://*"
                    ],
                    /*Intents: [
                        "itms-services:*",
                        "http:*",
                        "https:*",
                        "appqplay:*",
                        "tel:*",
                        "sms:*",
                        "mailto:*",
                        "geo:*"
                    ],*/
                    Intents: [],
                    Requests: [
                        "https://qplay.benq.com/*"
                    ]
                };
            }

            window.plugins.qsecurity.setWhiteList(securityList, self.successCallback, self.failCallback);
        } else {
            self.successCallback();
        }
    }();
}

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
        if (appKey !== "appqplay") {
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

        getSecurityList();
    } else if (action === "setLocalStorage") {
        $.map(data, function(value, key) {
            window.localStorage.setItem(key, value);
            loginData[key] = value;
        });

        if (appKey === "appqplay") {
            getMessageList();
        }
    }

}

function getServerData() {

    if (appKey === "appqplay") {
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        args[1] = device.uuid;

        window.plugins.qlogin.openCertificationPage(null, null, args);
    } else {
        //open QPlay
        window.localStorage.setItem("openScheme", true);
        openAPP("appqplay://callbackApp=" + appKey + "&action=getLoginData");
    }

}

function openAPP(URL) {
    $("body").append('<a id="schemeLink" href="' + URL + '"></a>');
    document.getElementById("schemeLink").click();
    $("#schemeLink").remove();
}

//Now just for check [token]
function getSecurityList() {

    var self = this;

    this.successCallback = function(data) {
        if (data['result_code'] === 1) {
            initialSuccess();
        } else if (data['result_code'] === "000907") {
            //token expired
            getServerData();
        } else if (data['result_code'] === "000908") {
            //token invalid
            getServerData();
        } else {
            //fail
        }
    };

    this.failCallback = function(data) {};

    var __construct = function() {

        appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
        var signatureTime = getSignature("getTime");
        var signatureInBase64 = getSignature("getInBase64", signatureTime);

        $.ajax({
            type: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: serverURL + "/qplayApiTest/public/index.php/v101/qplay/getSecurityList?lang=en-us&uuid=" + loginData.uuid + "&app_key=" + appKey,
            dataType: "json",
            cache: false,
            success: self.successCallback,
            fail: self.failCallback
        });

    }();

}

function sendPushToken(data) {
    var self = this;
    var queryStr = "&app_key=appqplay&device_type=" + loginData.deviceType;

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
    } else {
        $(".loader").hide();
    }
}

function getLoginDataCallBack() {
    var callBackURL = queryData["callbackApp"] + "://callbackApp=appqplay&action=retrunLoginData&token=" + loginData['token'] +
                      "&token_valid=" + loginData['token_valid'] + "&uuid=" + loginData['uuid'] + "&checksum=" + loginData['checksum'] + 
                      "&domain=" + loginData['domain'] + "&emp_no=" + loginData['emp_no'];
    openAPP(callBackURL);

    getMessageList();
    loginData['doLoginDataCallBack'] = false;

    $.mobile.changePage('#viewMain2-1');
}

function handleOpenURL(url) {

    var waitCheckAPPVerInterval = setInterval(function(){ waitCheckAPPVer() }, 1000);

    function waitCheckAPPVer() {
        if (url !== "null") {

            if (appKey === "appqplay") {
                loginData['doLoginDataCallBack'] = true;
            }

            if (appKey === "appqplay" && (loginData['callCheckAPPVer'] === true || loginData['callQLogin'] === true)) {
                return;
            } else {
                clearInterval(waitCheckAPPVerInterval);
            }

            var tempURL = url.split("//");
            var queryString = tempURL[1];
            var tempQueryData = queryString.split("&");
            queryData = {};

            $.map(tempQueryData, function(value, key) {
                var tempData = value.split("=");
                queryData[tempData[0]] = tempData[1];
            });

            if (queryData["action"] === "getLoginData") {

                getLoginDataCallBack();

            } else if (queryData["action"] === "retrunLoginData") {

                if (device.platform === "iOS") {
                    window.localStorage.setItem("openScheme", false);
                }

                $.map(queryData, function(value, key) {
                    if (key !== "callbackApp" && key !== "action") {
                        window.localStorage.setItem(key, value);
                        loginData[key] = value;
                    }
                });

                initialSuccess();

            }
        } else {
            if (appKey !== "appqplay") {
                checkStorageData();
                clearInterval(waitCheckAPPVerInterval);
            }
        }
    }

}