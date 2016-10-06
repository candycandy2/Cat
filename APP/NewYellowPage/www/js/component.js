// component JS
//
// variable, function, page event for All APP
//
// appSecretKey => set in QPlayAPI.js under specific APP
//

var loginData = {
    token:          "",
    token_valid:    "",
    uuid:           ""
};
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

        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        //[device] data ready to get on this step.

        //check data(token, token_value, ...) on web-storage
        if (window.localStorage.length === 0) {
            getDataFromServer = true;
        } else {
            var loginDataExist = processStorageData("check");
            
            if (loginDataExist) {
                processStorageData("setLoginData");
                initialSuccess();
            } else {
                getDataFromServer = true;
            }
        }
        
        if (getDataFromServer) {
            if (appKey !== "appqplay") {
                getServerData();
            } else {
                initialSuccess();
            }
        }
        
        if (device.platform === "iOS") {
            $('.page-header, .page-main').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display','block');
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
function processStorageData(action, data = null) {

    if (action === "check") {
        var checkLoginDataExist = true;

        $.map(loginData, function(value, key) {
            if (key === "token" || key === "token_valid") {
                if (window.localStorage.getItem(key) === null) {
                    checkLoginDataExist = false;
                }
            }
        });

        return checkLoginDataExist;
    } else if (action === "setLoginData") {
        $.map(loginData, function(value, key) {
            loginData[key] = window.localStorage.getItem(key);
        });
    } else if (action === "setLocalStorage") {
        $.map(data, function(value, key) {
            window.localStorage.setItem(key, value);
            loginData[key] = value;
        });
    }

}

function getServerData() {
    if (appKey === "appqplay") {
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        args[1] = device.uuid;

        window.plugins.qlogin.openCertificationPage(null, null, args);
    } else {
        //scheme not work now, so use QLogin to get token
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        args[1] = device.uuid;

        window.plugins.qlogin.openCertificationPage(null, null, args);
    }
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