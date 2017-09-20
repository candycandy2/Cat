
var closeInfoMsgInit = false; // let closeInfoMsg click event init once

/********************************** Corodva APP initial *************************************/
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        $.mobile.changePage('#viewMain');
    },
    onOpenNotification: function(data) {

    },
    onBackgoundNotification: function(data) {

    },
    onReceiveNotification: function(data) {

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


    //For APP scrolling in [Android ver:5], set CSS
    //For font-family, set diff in iOS/Android
    $(document).on("pageshow", function() {
        if (device.platform === "Android") {
            $(".ui-mobile .ui-page-active").css("overflow-x", "hidden");
            $(".ui-header-fixed").css("position", "fixed");

            var version = device.version.substr(0, 1);
            if (version === "6") {
                $(".ui-footer-fixed").css("position", "fixed");
            }
            $("body, input, select, textarea, button, .ui-btn").css("font-family", "Microsoft JhengHei");
        } else if (device.platform === "iOS") {
            $('.page-header').addClass('ios-fix-overlap');
            $('.ios-fix-overlap-div').css('display', 'block');
            $('.ui-page:not(#viewInitial)').addClass('ui-page-ios');
            $("body, input, select, textarea, button, .ui-btn").css("font-family", "Heiti TC");
        }

        adjustPageMarginTop();
        //call initialSuccess
        initialSuccess();
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

    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
             /*do somrthing when device is in portraint mode*/
            if (device.platform === "iOS") {
                adjustPageMarginTop();
            }
        }
    }, false);

});
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

        $("#APPLoginLink").on("click", function() {
            getServerData();
        });
        //If is other APP, set APP name in initial page
        if (appKey !== qplayAppKey) {
            $("#initialAppName").html(initialAppName);

            //set Other APP initial page dispaly
            $("#initialOther").removeClass("hide");
            $("#initialQPlay").remove();
            //when initialOther Page stay over 10 secs, show QPlay Login Link
            setTimeout(function(){
                $("#initialAppLoginTimeout").removeClass("hide");
            }, 10000);
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
/*******************************************************************************************/
/********************************** Date Ttme function *************************************/
/*******************************************************************************************/

//covert date or time format
Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.yyyymmdd = function(symbol) {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return yyyy + symbol + (mm[1] ? mm : '0' + mm[0]) + symbol + (dd[1] ? dd : '0' + dd[0]);
};

Date.prototype.yyyymm = function(symbol) {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    return yyyy + symbol + (mm[1] ? mm : '0' + mm[0]);
};

Date.prototype.mmdd = function(symbol) {
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return (mm[1] ? mm : '0' + mm[0]) + symbol + (dd[1] ? dd : '0' + dd[0]);
};

Date.prototype.hhmm = function() {
    var hh = this.getHours().toString();
    var mm = this.getMinutes().toString();
    return (hh[1] ? hh : '0' + hh[0]) + ':' + (mm[1] ? mm : '0' + mm[0]);
};

Date.prototype.TimeZoneConvert = function() {
    //[this & return] format=> "2017-01-20 09:23:28"
    var timeZoneOffset = new Date().getTimezoneOffset();
    var timeZoneFixHour = timeZoneOffset / -60;
    var timeZoneFixSecond = timeZoneFixHour * 60 * 60;

    var dateStrTimestamp = this / 1000;
    var fixedDateStrTimestamp = dateStrTimestamp + timeZoneFixSecond;
    var fixedDateStr = new Date(fixedDateStrTimestamp * 1000);

    return fixedDateStr.getFullYear() + "-" + padLeft(parseInt(fixedDateStr.getMonth() + 1, 10), 2) + "-" + padLeft(fixedDateStr.getUTCDate(), 2) + " " +
    padLeft(fixedDateStr.getHours(), 2) + ":" + padLeft(fixedDateStr.getMinutes(), 2) + ":" + padLeft(fixedDateStr.getSeconds(), 2);
};

Date.prototype.TimeStamp = function() {
    return parseInt(this / 1000, 10);
};

function addThirtyMins(time) {
    var timeStr = new Date(new Date().toDateString() + ' ' + time)
    timeStr.setMinutes(timeStr.getMinutes() + 30);
    var result = timeStr.hhmm();
    return result;
}

function checkDataExpired(time, num, pram) {
    //num can't use string, use int
    var today = new Date();
    var lastTime = new Date(time);
    switch (pram) {
        case 'dd':
            lastTime.setDate(lastTime.getDate() + num);
            break;
        case 'hh':
            lastTime.setHours(lastTime.getHours() + num);
            break;
        case 'mm':
            lastTime.setMinutes(lastTime.getMinutes() + num);
            break;
        case 'ss':
            lastTime.setSeconds(lastTime.getSeconds() + num);
            break;
        case 'MM':
            lastTime.setMonth(lastTime.getMonth() + num);
            break;
        case 'yy':
            lastTime.setYear(lastTime.getYear() + num);
            break;
        default:
            break;
    }

    if (today > lastTime) {
        return true; //Expired
    } else {
        return false;
    }
}

function dateFormatYMD (date) {
    //"2017-01-20 09:23:28" is Invalid Date Format in iOS,
    //need to change into "2017/01/20 09:23:28"
    return date.replace(/-/g,'/');
}

/****************************************************************************************/
/********************************** String function *************************************/
/****************************************************************************************/

//string function
function replaceStr(content, originItem, replaceItem) {
    $.each(originItem, function(index, value) {
        content = content.replaceAll(value.toString(), replaceItem[index].toString())
    });
    return content;
}

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

// convert yyyymmdd to [yyyy, mm, dd]
function cutStringToArray(string, array) {
    var strMatch = '';
    $.each(array, function(index, value) {
        strMatch += '(\\d{' + value + '})'; //like '/(\d{4})(\d{2})(\d{2})/'
    });
    var reg = new RegExp(strMatch);
    var result = string.match(reg);
    return result;
}

function padLeft(str, length) {
    str = str.toString();

    if (str.length >= length)
        return str;
    else
        return padLeft("0" + str, length);
}

//API - XML data need to do [ PHP htmlspecialchars() ]
function htmlspecialchars(text) {
    if (typeof text === "string") {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    } else {
        return text;
    }
}