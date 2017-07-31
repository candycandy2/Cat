/************************************************************************************************/
/********************************** APP Process JS function *************************************/
/************************************************************************************************/
var closeDisconnectNetworkInit = false, // let closeDisconnectNetwork click event init once
    isDisConnect = false; // check if disconnect


function getLanguageString() {
    $.getJSON("string/" + browserLanguage + ".json", function(data) {
        for (var i = 0; i < data.length; i++) {
            langStr[data[i].term] = data[i].definition.trim();
        }

        $.getJSON("string/common_" + browserLanguage + ".json", function(data) {
            for (var i = 0; i < data.length; i++) {
                langStr[data[i].term] = data[i].definition.trim();
            }

            addComponentView();
        });
    });
}

function addComponentView() {
    //add component view template into index.html
    $.get("View/APP.html", function(data) {
        $.mobile.pageContainer.append(data);

        //Set viewInitial become the index page
        $("#viewInitial").page().enhanceWithin();
        $("#viewInitial").addClass("ui-page ui-page-theme-a ui-page-active");

        //set initial page's layout when landscape
        $('#initialOther').css('top', (screen.height - $('#initialOther').height()) / 2);

        //If is other APP, set APP name in initial page
        if (appKey !== qplayAppKey) {
            $("#initialAppName").html(initialAppName);

            //set Other APP initial page dispaly
            $("#initialOther").removeClass("hide");
            $("#initialQPlay").remove();
        } else {
            //set QPlay initial page dispaly
            $("#initialQPlay").removeClass("hide");
            $("#initialOther").remove();
        }

        //viewNotSignedIn, Login Again
        $("#LoginAgain").on("click", function() {
            //$("#viewNotSignedIn").removeClass("ui-page ui-page-theme-a ui-page-active");
            var checkAppVer = new checkAppVersion();
        });

        //UI Popup : Event Add Confirm
        var disconnectNetworkData = {
            id: "disconnectNetwork",
            content: $("template#tplDisconnectNetwork").html()
        };

        tplJS.Popup(null, null, "append", disconnectNetworkData);

        //After all template load finished, processing language string
        $(".langStr").each(function(index, element) {
            var id = $(element).data("id");

            $(".langStr[data-id='" + id + "']").each(function(index, element) {
                if (langStr[id] !== undefined) {
                    $(this).html(langStr[id]);
                }
            });
        });

        overridejQueryFunction();
    }, "html");
}

//Check Mobile Device Network Status
function checkNetwork(data) {

    data = data || null;
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
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
            activePageID = activePage[0].id,
            activatePageIndex = activePage.index('.ui-page');
        //----Network connected
        // on initial page, should reload app
        if (activePageID === 'viewInitial' || activatePageIndex === -1) {
            reStartAPP = true;
        } else {
            // do nothing
        }
    }

    if (showMsg) {
        openNetworkDisconnectWindow('noNetwork');
    }

    if (logMsg.length > 0) {
        var dataArr = [
            "Network Error",
            "",
            logMsg
        ];
        //LogFile.createAndWriteFile(dataArr);
    }
}

function openNetworkDisconnectWindow(status) {
    // closeDisconnectNetwork click event should init only once
    if (!closeDisconnectNetworkInit) {
        $(document).on('click', '#disconnectNetwork #closeInfoMsg', function() {
            $('#disconnectNetwork').popup('close');

            // network disconnect
            if (status === 'noNetwork') {
                setTimeout(function() {
                    checkNetwork();
                }, 500);
            }
            // API return fail: timeout or error
            else if (status === 'timeout' || status === 'error') {
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
                    activePageID = activePage[0].id,
                    activatePageIndex = activePage.index('.ui-page');

                // on initial page, should reload app
                if (activePageID === 'viewInitial' || activatePageIndex === -1) {
                    reStartAPP = true;
                }
                // on page 1
                else if (activatePageIndex === 0) {
                    // no page can return, do nothing
                }
                // on other page, back to last page
                else {
                    onBackKeyDown();
                }
                loadingMask("hide");
            }
            // API retun fail that we never seen before
            else {
                alert('網路連線失敗，' + status);
                reStartAPP = true;
            }

            showNetworkDisconnected = false;
            if (reStartAPP) {
                reStartAPP = false;
                location.reload();
            }
        });
        closeDisconnectNetworkInit = true;
    }

    $('#disconnectNetwork').popup();
    $('#disconnectNetwork').show();
    $('#disconnectNetwork').popup('open');
}

function errorHandler(data) {
    console.log('readyState: ' + data.readyState + ' status: ' + data.status + ' statusText: ' + data.statusText);
    //1. status = timeout (Network status display ["canceled"])
    if (data.statusText === "timeout") {
        showNetworkDisconnected = true;
        logMsg = "Network status=canceled, timeout";
        openNetworkDisconnectWindow('timeout');
    }
    //2. status = error (Network status display ["failed"]) as we know, the error will appear when network is disconnect
    else if (data.statusText === 'error') {
        showNetworkDisconnected = true;
        logMsg = "Network status=failed, error";
        openNetworkDisconnectWindow('error');
    }
    // 3. status that we never seen before
    else {
        showNetworkDisconnected = true;
        logMsg = data.statusText;
        openNetworkDisconnectWindow(data.statusText);
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
    $("#viewInitial").removeClass("ui-page ui-page-theme-a ui-page-active");
    initialSuccess();
    waterMark();
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

    $("#closeAPIError").on("click", function() {
        $('#APIError').popup('close');
        $('#APIError').hide();
    });
}

//Create Signature according to appSecretKey
function getSignature(action, signatureTime) {
    if (action === "getTime") {
        return Math.round(new Date().getTime() / 1000);
    } else {
        var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
        return CryptoJS.enc.Base64.stringify(hash);
    }
}

//Loading Mask
function loadingMask(action) {
    if (action === "show") {
        var scrollHeight = $(window).scrollTop();

        if ($(".loader").length === 0) {
            $('<div class="loader" style="top:' + scrollHeight + 'px;"><img src="img/component/ajax-loader.gif"><div style="color:#FFF;">&nbsp;</div></div>').appendTo("body");
        } else {
            $(".loader").show();
            $(".loader").css("top", scrollHeight + "px");
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

    if (titleImg != '') {
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

function adjustPageMarginTop() {
    //For some APP Page, if page's header has second level [button / title],
    //auto resize the margin-top of page-main.
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID.length !== 0) {

        var pageHeaderHeight = $("#" + activePageID + " .page-header").height();
        var headerStyleHeight = $("#" + activePageID + " .header-style").height();
        var mainMarginTop = parseInt(headerStyleHeight - pageHeaderHeight, 10);

        if (mainMarginTop < 0) {
            mainMarginTop = 0;
        }

        if (device.platform === "iOS") {
            mainMarginTop = mainMarginTop + 20;
        }

        $(".page-main").css({
            "margin-top": mainMarginTop + "px"
        });
    }
}

function footerFixed() {
    $(".ui-footer").removeClass("ui-fixed-hidden");
    $(".ui-header").removeClass("ui-fixed-hidden");
}

function waterMark() {
    $.mobile.pageContainer.prepend('<span class="watermark"></span>');

    var IDLength = loginData["loginid"].length;
    //font-size: 2.93vw
    var stringSingleWidth = parseInt(document.documentElement.clientWidth * 2.93 / 100, 10);
    var stringHeight = parseInt(stringSingleWidth * 1.4, 10);
    var stringAllWidth = parseInt(stringSingleWidth, 10) * IDLength;
    //width = stringAllWidth * 0.6
    var width = parseInt(stringAllWidth * 0.6, 10);

    var SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='" + stringHeight + "px' width='" + width + "px'>" +
        "<text x='0' y='" + stringSingleWidth + "' fill='black' font-size='" + stringSingleWidth + "'>" + loginData["loginid"] + "</text></svg>";

    $(".watermark").css('background-image', 'url("' + SVG + '")');
}