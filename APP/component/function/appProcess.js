
/************************************************************************************************/
/********************************** APP Process JS function *************************************/
/************************************************************************************************/
var closeDisconnectNetworkInit = false,     // let closeDisconnectNetwork click event init once
    isDisConnect = false;                   // check if disconnect

function getLanguageString() {
    $.getJSON("string/" + browserLanguage + ".json", function(data) {
        for (var i=0; i<data.length; i++) {
            langStr[data[i].term] = data[i].definition.trim();
        }

        $.getJSON("string/common_" + browserLanguage + ".json", function(data) {
            for (var i=0; i<data.length; i++) {
                langStr[data[i].term] = data[i].definition.trim();
            }

            addConponentView();
        });
    });
}

function addConponentView() {
    //add component view template into index.html
    $.get("View/APP.html", function(data) {
        $.mobile.pageContainer.append(data);

        //Set viewInitial become the index page
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

        //After all template load finished, processing language string
        $(".langStr").each(function(index, element){
            var id = $(element).data("id");

            $(".langStr[data-id='" + id + "']").each(function(index, element){
                if (langStr[id] !== undefined) {
                    $(this).html(langStr[id]);
                }
            });
        });
    }, "html");
}

//Check Mobile Device Network Status
function checkNetwork(data) {

    data =  data || null;
    //A. If the device's Network is disconnected, show dialog only once, before the network is connect again.
    //B. If the device's Network is disconnected again, do step 1. again.

    //Only Android can get this info, iOS can not!!
    //connect.type:
    //1. wifi
    //2. cellular > 3G / 4G
    //3. none
    var showMsg = false;
    var logMsg = "";

    if (!navigator.onLine) {
        //----Network disconnected
        loadingMask("hide");

        if (!initialNetworkDisconnected) {
            showMsg = true;
            initialNetworkDisconnected = true;
        }

        if (!showNetworkDisconnected) {
            showMsg = true;
            showNetworkDisconnected = true;
        }

        isDisConnect = true;

        logMsg = "Network disconnected";
    } else {
        //----Network connected
        //Maybe these following situation happened.
        if (data !== null) {
            //1. status = 200, request succeed, but timeout 3000
            if (data.status !== 200) {
                showMsg = true;
                showNetworkDisconnected = true;
                logMsg = "Network status=200, timeout";
            }
            //2. status = timeout (Network status display ["canceled"])
            if (data.statusText === "timeout") {
                showMsg = true;
                showNetworkDisconnected = true;
                reStartAPP = true;
                logMsg = "Network status=canceled, timeout";
            }
        }
        // reload page when network is back and the page is initial one
        else{
            if (isDisConnect && $('#viewInitial').css('display') === 'block'){
                location.reload();
            }
            isDisConnect = false;
        }
    }

    if (showMsg) {
        $('#disconnectNetwork').popup();
        $('#disconnectNetwork').show();
        $('#disconnectNetwork').popup('open');

        // closeDisconnectNetwork click event should init only once
        if (!closeDisconnectNetworkInit){
            $("#closeDisconnectNetwork").on("click", function(){
                $('#disconnectNetwork').popup('close');
                $('#disconnectNetwork').hide();

                showNetworkDisconnected = false;
                setTimeout(function(){
                    checkNetwork();
                }, 500);

                if (reStartAPP) {
                    reStartAPP = false;
                    location.reload();
                }
            });
            closeDisconnectNetworkInit = true;
        }
    }

    if (logMsg.length > 0) {
        var dataArr = [
            "Network Error",
            "",
            logMsg
        ];
        LogFile.createAndWriteFile(dataArr);
    }
}

//Taphold APP Header to show Version/AD/UUID
function infoMessage() {
    $("#infoLoginid").html(loginData["loginid"]);
    $("#infoUUID").html(loginData["uuid"]);
    $("#infoVersionName").html(loginData["versionName"]);
    $('#infoMsg').popup();
    $('#infoMsg').show();
    $('#infoMsg').popup('open');

    setTimeout(function() {
        //Set for iOS, control text select
        document.documentElement.style.webkitTouchCallout = "default";
        document.documentElement.style.webkitUserSelect = "auto";
    }, 1000);

    $("#closeInfoMsg").on("click", function(){
        $('#infoMsg').popup('close');
        $('#infoMsg').hide();
    });
}

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

//Hide APP initial page
function hideInitialPage() {
//alert("hideInitialPage");
    $("#viewInitial").removeClass("ui-page ui-page-theme-a ui-page-active");
    initialSuccess();
}

//Use Scheme to Open APP
function openAPP(URL) {
    $("body").append('<a id="schemeLink" href="' + URL + '"></a>');
    document.getElementById("schemeLink").click();
    $("#schemeLink").remove();
}

//If API is error, open Dialog
function openAPIError(type) {
    if (type === "error") {
        $("#APIError_1").show();
        $("#APIError_2").hide();
    } else {
        $("#APIError_1").hide();
        $("#APIError_2").show();
    }

    $('#APIError').popup();
    $('#APIError').show();
    $('#APIError').popup('open');

    $("#closeAPIError").on("click", function(){
        $('#APIError').popup('close');
        $('#APIError').hide();
    });
}

//Create Signature according to appSecretKey
function getSignature(action, signatureTime) {
  if (action === "getTime") {
    return Math.round(new Date().getTime()/1000);
  } else {
    var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
    return CryptoJS.enc.Base64.stringify(hash);
  }
}

//Loading Mask
function loadingMask(action) {
    if (action === "show") {
        if ($(".loader").length === 0) {
            $('<div class="loader"><img src="img/component/ajax-loader.gif"><div style="color:#FFF;">&nbsp;</div></div>').appendTo("body");
        } else {
            $(".loader").show();
        }
    } else if (action === "hide") {
        $(".loader").hide();
    }
}

//When receive a Message, get message_id by different path in iOS/Android
function getMessageID(data) {
    if (device.platform === "iOS") {
        messageRowId = data.Parameter;
    } else {
        messageRowId = data.extras["Parameter"];
    }
}

//create popup message
function popupMsg(attr, title, content, btn1, btnIsDisplay, btn2, titleImg) {
    $('#viewPopupMsg').attr('for', attr);
    $('#viewPopupMsg #titleText').text(title);
    $('#viewPopupMsg #msgContent').html(content);
    $('#viewPopupMsg #titleImg').attr('src', '');
    $('#viewPopupMsg #titleImg').addClass('hide');
    $('#viewPopupMsg #cancel').text(btn1);
    $('#viewPopupMsg #confirm').text(btn2);

    if(titleImg != ''){
        $('#viewPopupMsg #titleImg').attr('src', 'img/' + titleImg);
        $('#viewPopupMsg #titleImg').removeClass('hide');
    }

    $('#viewPopupMsg').removeClass();
    $('#viewPopupMsg button').removeClass();
    if (btnIsDisplay == true) {
        $('#viewPopupMsg #cancel').removeClass('hide');
        $('#viewPopupMsg #confirm').css('width', '50%');
        $('#viewPopupMsg #confirm').css('position', 'absolute');
    } else {
        $('#viewPopupMsg #cancel').addClass('hide');
        $('#viewPopupMsg #confirm').css('width', '100%');
        $('#viewPopupMsg #confirm').css('position', 'initial');
    }
    $('#viewPopupMsg #cancel').attr('onClick', 'popupCancelClose()');

    $('#viewPopupMsg').popup(); //initialize the popup
    $('#viewPopupMsg').show();
    $('#viewPopupMsg').popup('open');
}

function popupCancelClose() {
    $('body').on('click', '#viewPopupMsg #cancel', function() {
        $('#viewPopupMsg').popup('close');
    });
}

