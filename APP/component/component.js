// component JS
//
// variable, function, page event for All APP
//
// appSecretKey => set in QPlayAPI.js under specific APP
//

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey;
var loginData = {
    token:           "",
    token_valid:     "",
    uuid:            "",
    callCheckAPPVer: false,
    callQLogin:      false

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
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        //For QSecurity
        setWhiteList();

        if (appKey !== "qplay") {
            if (window.localStorage.getItem("openScheme") === "true") {
                if (device.platform !== "iOS") {
                    window.plugins.qlogin.openAppCheckScheme(null, null);
                    window.localStorage.setItem("openScheme", false);
                }
                return;
            }
        }

        //[device] data ready to get on this step.

        //check data(token, token_value, ...) on web-storage
        checkStorageData();
        
        if (device.platform === "iOS") {
            $('.page-header, .page-main').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display','block');
        } else {
            $('.ui-btn span').addClass('android-fix-btn-text-middle');

            if (appKey === "qplay") {
                window.plugins.qlogin.openAppCheckScheme(null, null);
            }
        }

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
    if (device.platform !== "iOS") {
        if (appKey === "qplay") {
            var securityList = {
                level: 2,
                Navigations: [
                    "https://qplay.benq.com/*",
                    "itms-services://*"
                ],
                Intents: [
                    "itms-services:*",
                    "http:*",
                    "https:*",
                    "appyellowpage:*",
                    "tel:*",
                    "sms:*",
                    "mailto:*",
                    "geo:*"
                ],
                Requests: [
                    serverURL + "/*"
                ]
            };
        } else {
            var securityList = {
                level: 2,
                Navigations: [
                    "https://qplay.benq.com/*",
                    "itms-services://*"
                ],
                Intents: [
                    "itms-services:*",
                    "http:*",
                    "https:*",
                    "appqplay:*",
                    "tel:*",
                    "sms:*",
                    "mailto:*",
                    "geo:*"
                ],
                Requests: [
                    serverURL + "/*"
                ]
            };
        }

        window.plugins.qsecurity.setWhiteList(securityList, null, null);
    }
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
        if (appKey !== "qplay") {
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
            loginData[key] = window.localStorage.getItem(key);
        });

        getSecurityList();
    } else if (action === "setLocalStorage") {
        $.map(data, function(value, key) {
            window.localStorage.setItem(key, value);
            loginData[key] = value;
        });
    }

}

function getServerData() {

    if (appKey === "qplay") {
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        args[1] = device.uuid;

        window.plugins.qlogin.openCertificationPage(null, null, args);
    } else {
        //open QPlay
        window.localStorage.setItem("openScheme", true);
        openAPP("appqplay://callbackApp=appyellowpage&action=getLoginData");
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
                'App-Key': 'qplay',
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
                      "&token_valid=" + loginData['token_valid'] + "&uuid=" + loginData['uuid'];
    openAPP(callBackURL);

    loginData['doLoginDataCallBack'] = false;
}

function handleOpenURL(url) {

    var waitCheckAPPVerInterval = setInterval(function(){ waitCheckAPPVer() }, 1000);

    function waitCheckAPPVer() {
        if (url !== "null") {

            if (appKey === "qplay" && (loginData['callCheckAPPVer'] === true || loginData['callQLogin'] === true)) {
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
            if (appKey !== "qplay") {
                checkStorageData();
                clearInterval(waitCheckAPPVerInterval);
            }
        }
    }

}
