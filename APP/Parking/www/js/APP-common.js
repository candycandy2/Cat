
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

/****************************************************************************************/
/********************************** Template JS *****************************************/
/****************************************************************************************/

// Override jQuery Funciton
// Every time when call jQuery (append, prepend, hmtl) funciton,
// do tplJS.setMultiLanguage()

function overridejQueryFunction() {

    function checkValToSetLang(value) {
        if (typeof value != 'undefined') {
            tplJS.setMultiLanguage(value);
        }
    };

    var originalAppend = $.fn.append;
    $.fn.append = function(value) {
        checkValToSetLang(value);
        return originalAppend.call(this, value);
    };

    var originalPrepend = $.fn.prepend;
    $.fn.prepend = function(value) {
        checkValToSetLang(value);
        return originalPrepend.call(this, value);
    };

    var originalAppenTo = $.fn.appendTo;
    $.fn.appendTo = function(value) {
        checkValToSetLang(value);
        return originalAppenTo.call(this, value);
    };

    var originalPrependTo = $.fn.prependTo;
    $.fn.prependTo = function(value) {
        checkValToSetLang(value);
        return originalPrependTo.call(this, value);
    };
    /*
    var originalHTML = $.fn.html;
    $.fn.html = function(value) {
        if (typeof value != 'undefined') {
            checkValToSetLang(value);
            return originalHTML(value);
        } else {
            return $(this)[0].innerHTML;
        }
    };
    */
}


// Render Action:
//1. append
//2. prepend
//3. html

var tplJS = {
    tplRender: function(pageID, contentID, renderAction, HTMLContent) {
        if (pageID == null) {
            if (renderAction === "append") {
                $("body").append(HTMLContent);
            } else if (renderAction === "prepend") {
                $("body").prepend(HTMLContent);
            } else if (renderAction === "html") {
                $("body").html(HTMLContent);
            }
        } else {
            if (renderAction === "append") {
                $("#" + pageID + " #" + contentID).append(HTMLContent);
            } else if (renderAction === "prepend") {
                $("#" + pageID + " #" + contentID).prepend(HTMLContent);
            } else if (renderAction === "html") {
                $("#" + pageID + " #" + contentID).html(HTMLContent);
            }
        }

        this.setMultiLanguage(HTMLContent);
    },
    setDOMAttr: function(dom, data) {
        $.each(data, function(key, value){
            if (key === "class") {
                dom.addClass(value);
            } else {
                dom.prop(key, value);
            }
        });
    },
    setMultiLanguage: function(dom) {
        if ($(dom).find(".langStr").length > 0) {
            $(dom).find(".langStr").each(function(index, element){
                var id = $(element).data("id");
                $(element).html(langStr[id]);
            });
        }
    },
    getRealContentHeight: function() {
        var header = $.mobile.activePage.find("div[data-role='header']:visible");
        var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
        //var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
        var content = $.mobile.activePage.find("div[data-role='main']:visible:visible");
        var viewport_height = $(window).height();

        var content_height = viewport_height - header.outerHeight();

        if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
            //content_height -= (content.outerHeight() - content.height());
        }

        return content_height;
    },
    preventPageScroll: function() {
        //Prevent Background Page to be scroll, when Option Popup is shown,
        //Change the [height / overflow-y] of Background Page,
        //And then, when Option Popup is close, recovery the [height / overflow-y] of Background Page.
        /*
        var adjustHeight = this.getRealContentHeight();
        var adjustPaddingBottom = 0;

        if (device.platform === "iOS") {
            adjustPaddingBottom = 20;
        }

        $.mobile.activePage.outerHeight(adjustHeight);

        $.mobile.activePage.css({
            "height": adjustHeight,
            "min-height": adjustHeight,
            "padding-bottom": adjustPaddingBottom + "px",
            "overflow-y": "hidden"
        });

        if (checkPopupShown()) {
            var header = $.mobile.activePage.find("div[data-role='header']:visible");
            var popupScreenHeight = adjustHeight + header.outerHeight();

            if (device.platform === "iOS") {
                popupScreenHeight += 20;
            }

            $(".ui-popup-screen.in").height(popupScreenHeight);
        }
        */
        tplJS.originalScrollTop = $("body").scrollTop();
        tplJS.originalUIPageHeight = $(".ui-page-active.ui-page").height();
        tplJS.originalUIPageScrollHeight = $("body").prop("scrollHeight");
        tplJS.originalUIPageMinHeight = parseInt($(".ui-page-active.ui-page").css("min-height"), 10);
        tplJS.originalPageMainHeight = $(".ui-page-active .page-main").height();
        tplJS.originalUITabsHeight = $(".ui-page-active .ui-tabs").height();
        var windowHeight = $(window).height();
        var headerHeight = $(".ui-page-active .ui-header").height();
        var footerHeight = $(".ui-page-active .ui-footer").height();
        var tempHeight = windowHeight - headerHeight - footerHeight;

        if (tplJS.originalPageMainHeight < tempHeight) {
            tplJS.originalPageMainHeight = tempHeight;
        }
        if (tplJS.originalUITabsHeight < tempHeight) {
            tplJS.originalUITabsHeight = tempHeight;
        }
        tplJS.originalUIPageScrollHeight = tplJS.originalUIPageScrollHeight - headerHeight - footerHeight;

        $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
            'height': tempHeight,
            'overflow-y': 'hidden',
            'touch-action': 'none'
        });

        $('.ui-page-active.ui-page').css({
            'min-height': tempHeight
        });

        $('body').css('overflow', 'hidden').on('touchmove', function(e) {
            var preventScroll = true;
            var offsetParent = e.target.offsetParent;

            if ($(offsetParent).hasClass("ui-datebox-container")) {
                preventScroll = false;
            } else if ($(e.target).closest(".ui-popup").length > 0) {
                var headerLength = $(e.target).closest(".header").length;
                var footerLength = $(e.target).closest(".footer").length;
                var listview = $(offsetParent).find("ul[data-role=listview]");

                if ($(listview).prop("scrollHeight") > parseInt($(listview).height() + 6, 10)) {
                    preventScroll = false;
                }
                if (footerLength > 0) {
                    preventScroll = true;
                }
                if (headerLength > 0) {
                    preventScroll = true;
                }
            }

            if (preventScroll) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    },
    recoveryPageScroll: function() {
        //Padding
        /*
        var paddingTop = parseInt($.mobile.activePage.css("padding-top"), 10);
        var paddingBottom = parseInt($.mobile.activePage.css("padding-bottom"), 10);

        var header = $.mobile.activePage.find("div[data-role='header']:visible");
        var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
        var originalHeight = $.mobile.activePage.outerHeight() - paddingTop - paddingBottom + header.outerHeight() + footer.outerHeight();

        $.mobile.activePage.outerHeight($.mobile.activePage.outerHeight());

        $.mobile.activePage.css({
            "height": originalHeight,
            "padding-bottom": 0,
            "overflow-y": "auto"
        });
        */
        $('body').css('overflow', 'auto').off('touchmove');
        $('.ui-page-active.ui-page').css({
            'height': tplJS.originalUIPageScrollHeight,
            'min-height': tplJS.originalUIPageMinHeight
        });
        $('.ui-page-active .page-main').css({
            'height': tplJS.originalPageMainHeight
        });
        $('.ui-page-active .ui-tabs').css({
            'height': tplJS.originalUITabsHeight
        });
        $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
            'overflow-y': 'auto',
            'touch-action': 'auto'
        });
        $('html, body').animate({
            scrollTop: tplJS.originalScrollTop
        }, 0);
    },
    Tab: function(pageID, contentID, renderAction, data) {
        var tabHTML = $("template#tplTab").html();
        var tab = $(tabHTML);

        //Navbar
        this.Navbar(null, null, null, data.navbar, tab);

        //Tab Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(tab, data.attr);
        }

        //Tab content
        var tabContentHTML = tab.find("template#tplTabContent").html();

        for (var i=0; i<data.content.length; i++) {
            var tabContent = $(tabContentHTML);
            tabContent.prop("id", data.content[i].id);

            //Set Attr
            this.setDOMAttr(tabContent, data.content[i].attr);
            tab.append(tabContent);
        }

        //Initial Tab
        tab.tabs();

        //Render Template
        this.tplRender(pageID, contentID, renderAction, tab);
    },
    Navbar: function(pageID, contentID, renderAction, data, dom) {
        //Navbar can be created:
        //1. append inside [ Tab ]
        //2. just display button group
        pageID = pageID || null;
        contentID = contentID || null;
        renderAction = renderAction || null;
        dom = dom || null;

        var navbarHTML = $("template#tplNavbar").html();
        var navbar = $(navbarHTML);

        //Navbar Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(navbar, data.attr);
        }

        //Nvrbar button
        var navbarButtonHTML = navbar.find("template#tplNavbarButton").html();
        navbar.find("ul").empty();

        for (var i=0; i<data.button.length; i++) {
            var navbarButton = $(navbarButtonHTML);
            var className;

            if (i === 0) {
                //First Button
                className = "ui-btn-active tpl-navbar-button-left";
            } else if (i === parseInt(data.button.length - 1, 10)) {
                //Last Button
                className = "tpl-navbar-button-right";
            }

            if (data.button[i].href !== undefined && data.button[i].href.length > 0) {
                navbarButton.find("a").prop("href", "#" + data.button[i].href);
            }

            navbarButton.find("a").addClass(className);
            navbarButton.find("a").html(data.button[i].text);

            //Set Attr
            if (data.button[i].attr !== undefined) {
                this.setDOMAttr(navbarButton.find("a"), data.button[i].attr);
            }

            navbar.find("ul").append(navbarButton);
        }

        //Initial Navbar
        navbar.navbar();

        if (dom !== null) {
            //Append to DOM
            dom.append(navbar);
        } else {
            //Render Template
            this.tplRender(pageID, contentID, renderAction, navbar);
        }
    },
    DropdownList: function(pageID, contentID, renderAction, type, data) {
        var dropdownListHTML = $("template#tplDropdownList").html();
        var dropdownList = $(dropdownListHTML);

        //DropdownList ID
        dropdownList.prop("id", data.id);

        //DropdownList Default Selected Option Value
        var defaultValue = "";
        if (data.defaultValue !== undefined) {
            defaultValue = data.defaultValue;
            $("#" + data.id).data("multiVal", defaultValue);
        }

        //DropdownList AutoResize
        var autoResize = true;
        if (data.autoResize !== undefined) {
            autoResize = data.autoResize;
        }

        //DropdownList Multiple Select
        var multiSelect = false;
        if (data.multiSelect !== undefined) {
            multiSelect = data.multiSelect;
            dropdownList.data("multiple", multiSelect);
        }

        
        var changeDefaultText = false;
        if (data.changeDefaultText !== undefined) {
            changeDefaultText = data.changeDefaultText;
        }

        //DropdownList Background IMG
        if (type === "typeB") {
            dropdownList.addClass("tpl-dropdown-list-icon-add");
        }

        //DropdownList Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(dropdownList, data.attr);
        }

        //DropdownList Option
        var dropdownListOptionHTML = dropdownList.find("template#tplDropdownListOption").html();

        if (type === "typeA") {
            for (var i=0; i<data.option.length; i++) {
                var dropdownListOption = $(dropdownListOptionHTML);

                dropdownListOption.prop("value", data.option[i].value);
                dropdownListOption.prop("text", data.option[i].text);

                if (defaultValue == data.option[i].value) {
                    dropdownListOption.prop("selected", "selected");
                }

                dropdownList.append(dropdownListOption);
            }
        } else if (type === "typeB") {
            var dropdownListOption = $(dropdownListOptionHTML);
            dropdownListOption.prop("text", data.defaultText);
            dropdownList.append(dropdownListOption);
        }

        //Render Template
        this.tplRender(pageID, contentID, renderAction, dropdownList);

        //Option in Popup
        var popupHTML = $("template#tplPopup").html();
        var popup = $(popupHTML);
        var popupID = data.id + "-option";
        var dropdownListUlID = data.id + "-option-list";

        popup.find("div[data-role='main']").html("");
        popup.prop("id", popupID);

        var dropdownListOptionHTML = $("template#tplPopupContentDropdownListOption").html();
        var dropdownList = $(dropdownListOptionHTML);

        //Header: typeA / typeB
        var dropdownListHeader = dropdownList.siblings(".header." + type);
        if (type === "typeB") {
            dropdownListHeader.find(".title").html(data.title);
        }

        var dropdownListUl = dropdownList.siblings(".main");

        dropdownListUl.prop("id", dropdownListUlID);

        var dropdownListLiHTML = dropdownList.find("template#tplPopupContentDropdownListLi").html();
        var dropdownListHrHTML = dropdownList.find("template#tplPopupContentDropdownListHr").html();

        for (var i=0; i<data.option.length; i++) {
            var dropdownListLi = $(dropdownListLiHTML);
            dropdownListLi.data("value", data.option[i].value);
            dropdownListLi.html(data.option[i].text);
            dropdownListUl.append(dropdownListLi);

            if (defaultValue == data.option[i].value) {
                dropdownListLi.addClass("tpl-dropdown-list-selected");
            }

            if (i !== parseInt(data.option.length - 1, 10)) {
                var dropdownListHr = $(dropdownListHrHTML);
                dropdownListHr.addClass("ui-hr-option");
                dropdownListUl.append(dropdownListHr);
            }
        }

        popup.find("div[data-role='main']").append(dropdownListHeader);
        popup.find("div[data-role='main']").append(dropdownListUl);

        //Render Template
        this.tplRender(pageID, contentID, renderAction, popup);

        //When Popup open, Auto Resize height of Popup main,
        //and change height of page, prevent User to scroll the page behind Popup.
        $(document).one("popupafteropen", "#" + popupID, function() {
            var popup = $(this);
            var popupHeight = popup.height();
            var popupHeaderHeight = $("#" + popupID + " .header").height();
            var popupFooterHeight = popup.find("div[data-role='main'] .footer").height();

            //ui-content paddint-top/padding-bottom:3.07vw
            var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 3.07 * 2 / 100, 10);

            //Ul margin-top:2.17vw
            var ulMarginTop = parseInt(document.documentElement.clientWidth * 2.17 / 100, 10);

            var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop, 10);
            $(this).find("div[data-role='main'] .main").height(popupMainHeight);
            $(this).find("div[data-role='main'] .main ul").height(popupMainHeight);

            $('.ui-popup-screen.in').animate({
                'overflow-y': 'hidden',
                'touch-action': 'none',
                'height': $(window).height()
            }, 0, function() {
                var top = $(".ui-popup-screen.in").offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            var viewHeight = $(window).height();
            var popupHeight = $(this).outerHeight();
            var top = (viewHeight - popupHeight) / 2;
            $(this).parent().css("top", top + "px");
        });

        $(document).off("popupbeforeposition", "#" + popupID);
        $(document).on("popupbeforeposition", "#" + popupID, function() {
            tplJS.preventPageScroll();
        });

        //Initialize Popup
        $('#' + popupID).popup();

        $(document).on("click", "#" + data.id, function() {
            //Scroll Page to top
            /*
            $("#" + pageID).animate({
                "scrollTop": 0
            }, 0, function() {
                $('#' + popupID).popup('open');
                tplJS.preventPageScroll();
            });
            */
            $('#' + popupID).popup('open');
        });

        (function(dropdownListID){
            $(document).on("click", "#" + popupID + " .close", function() {
                if (type === "typeA") {
                    if (multiSelect) {
                        $("#" + dropdownListID).trigger("change");
                    }
                }

                $('#' + popupID).popup('close');

                if (type === "typeA") {
                    if (autoResize) {
                        tplJS.reSizeDropdownList(dropdownListID, type);
                    }
                }
                tplJS.recoveryPageScroll();
            });
        }(data.id));

        //Click Li to change the value of Dropdown List
        (function(dropdownListID){
            $(document).on("click", "#" + popupID + " ul li", function() {
                if (!multiSelect) {
                    $("#" + popupID + " ul li").removeClass("tpl-dropdown-list-selected");
                    $(this).addClass("tpl-dropdown-list-selected");
                } else {
                    $(this).toggleClass("tpl-dropdown-list-selected");
                }

                if (type === "typeA") {
                    if (!multiSelect) {
                        $("#" + dropdownListID).val($(this).data("value"));
                        if (autoResize) {
                            tplJS.reSizeDropdownList(dropdownListID, type);
                        }
                    } else {
                        //Drowdown List set Multiple Value
                        var multiVal = $("#" + dropdownListID).data("multiVal");
                        if (multiVal !== undefined && multiVal.length > 0) {
                            var dataString = "";
                            var selectAll = false;
                            var dataArray = multiVal.split("|");
                            var optionValue = $(this).data("value");
                            var index = dataArray.indexOf(optionValue);
                            var indexAll = dataArray.indexOf("all");

                            if (optionValue === "all") {
                                if (indexAll === -1) {
                                    selectAll = true;
                                } else {
                                    dataArray.splice(indexAll, 1);
                                }
                            } else {
                                if (index > -1) {
                                    dataArray.splice(index, 1);
                                } else {
                                    dataArray.push($(this).data("value"));

                                    if (indexAll > -1) {
                                        dataArray.splice(indexAll, 1);
                                    }
                                }
                            }

                            if (selectAll) {
                                $("#" + dropdownListID).data("multiVal", "all");
                                $("#" + popupID + " ul li").removeClass("tpl-dropdown-list-selected");
                                $("#" + popupID + " ul li:eq(0)").addClass("tpl-dropdown-list-selected");
                            } else {
                                $("#" + popupID + " ul li:eq(0)").removeClass("tpl-dropdown-list-selected");

                                if (dataArray.length > 0) {
                                    dataString = dataArray.join("|");
                                }
                                $("#" + dropdownListID).data("multiVal", dataString);
                            }

                        } else {
                            $("#" + dropdownListID).data("multiVal", $(this).data("value"));
                        }
                    }
                } else if (type === "typeB") {
                    //Find drowdown list, set selected option value
                    var defaultText;
                    if(!changeDefaultText) {
                        $("#" + dropdownListID + " option").each(function(index, el) {
                            if (index === 0) {
                                defaultText = $(el).text();
                            }
                        });
                    }else {
                        $("#" + dropdownListUlID + " li").each(function(index, value) {
                            if($(value).hasClass("tpl-dropdown-list-selected")){
                                if($(value).find('div:nth-child(2)').text() === "") {
                                    defaultText = $(value).text();
                                }else {
                                    defaultText = $(value).find('div:nth-child(2)').text();
                                }
                            }
                        });
                    }

                    var newOption = '<option value="' + $(this).data("value") + '" hidden selected>' + defaultText + '</option>';
                    $("#" + dropdownListID).find("option").remove().end().append(newOption);
                    tplJS.reSizeDropdownList(dropdownListID, type);
                }

                if (!multiSelect) {
                    //Trigger drowdown list 'change' event
                    $("#" + dropdownListID).trigger("change");

                    //Close Popup
                    $('#' + popupID).popup('close');

                    tplJS.recoveryPageScroll();
                }
            });
        }(data.id));

        //Auto Resize DropdownList Width
        this.reSizeDropdownList = function(ID, type, setWidth) {
            type = type || null;
            var tempWidth;
            //Background Image Width
            var imgWidth;

            if (type === "typeA") {
                tempWidth = 3.54;
                imgWidth = 8;
            } else if (type === "typeB") {
                tempWidth = 4.04;
                imgWidth = 5;
            }

            if (type !== null) {
                $("span[data-id='tmp_option_width']").html($('#' + ID + ' option:selected').text());
                var pxWidth = $("span[data-id='tmp_option_width']").outerWidth();
                //px conver to vw
                var vwWidth = (100 / document.documentElement.clientWidth) * pxWidth + tempWidth + imgWidth;
                $("#" + ID).css('width', vwWidth + 'vw');
            } else {
                $("#" + ID).css('width', setWidth + 'vw');
            }
        };

        this.reSizeDropdownList(data.id, type);

    },
    Popup: function(pageID, contentID, renderAction, data) {
        var showMain = false;
        var popupHTML = $("template#tplPopup").html();
        var popup = $(popupHTML);
        var HRHTML = $("template#tplPopupContentHr").html();
        
        //Popup ID
        popup.prop("id", data.id);
        popup.addClass("msg");

        //Popup Content
        var contentHTML = data.content;
        var content = $(contentHTML);

        //Header
        var headerHTML = content.siblings(".header");
        if (headerHTML.length !== 0) {
            var header = headerHTML.clone();

            popup.find("div.header").append(header);
        }

        //Main
        var mainHTML = content.siblings(".main");
        if (mainHTML.length !== 0) {
            showMain = true;

            //HR Top
            var HRTop = $(HRHTML);
            HRTop.addClass("ui-hr-top");
            popup.find("div.header:first").after(HRTop);

            var main = mainHTML.clone();

            popup.find("div.main").append(main);
        }

        //HR Bottom
        var HRBottom = $(HRHTML);
        HRBottom.addClass("ui-hr-bottom");
        popup.find("div.main:first").after(HRBottom);

        //Footer
        var footerHTML = content.siblings(".footer");
        if (footerHTML.length !== 0) {
            var footer = footerHTML.clone();

            popup.find("div.footer").append(footer);
        }

        //Render Template
        this.tplRender(pageID, contentID, renderAction, popup);

        //Initialize Popup
        $('#' + data.id).popup();

        $(document).one("popupafteropen", "#" + data.id, function() {
            var popupHeight = popup.height();
            var popupHeaderHeight = popup.find("div[data-role='main'] .header").height();
            var popupFooter = popup.find("div[data-role='main'] .footer")[0];
            var popupFooterHeight = popupFooter.offsetHeight;

            //ui-content paddint-top:5.07vw
            var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            //Ul margin-top:5.07vw
            var ulMarginTop = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            //Ul margin-bottom:5.07vw
            var ulMarginBottom = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            //Resize Height of Main
            if (showMain) {
                var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop - ulMarginBottom, 10);
                $(this).find("div[data-role='main'] .main").height(popupMainHeight);
                $(this).find("div[data-role='main'] .main ul").height(popupMainHeight);
            } else {
                $(this).find("div[data-role='main'].ui-content").css("padding-top", "0");
                $(this).find("div[data-role='main'] .main").height(0);
                var popupHeaderHeight = parseInt(popupHeight - popupFooterHeight, 10);
                $(this).find("div[data-role='main'] > .header").height(popupHeaderHeight);
                $(this).find("div[data-role='main'] .header .header").addClass("all-center");
            }
        });

        $(document).on("popupafteropen", "#" + data.id, function() {
            $('.ui-popup-screen.in').animate({
                'overflow-y': 'hidden',
                'touch-action': 'none',
                'height': $(window).height()
            }, 0, function() {
                var top = $(".ui-popup-screen.in").offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            var viewHeight = $(window).height();
            var popupHeight = $(this).outerHeight();
            var top = (viewHeight - popupHeight) / 2;
            $(this).parent().css("top", top + "px");
        });

        $(document).off("popupbeforeposition", "#" + data.id);
        $(document).on("popupbeforeposition", "#" + data.id, function() {
            //Scroll Page to top
            /*
            $.mobile.activePage.animate({
                "scrollTop": 0
            }, 0, function() {
                tplJS.preventPageScroll();
            });
            */
            tplJS.preventPageScroll();
        });

        $(document).on("popupafterclose", "#" + data.id, function() {
            tplJS.recoveryPageScroll();
        });
    }
};


function popupMsgInit(popupClass){
    $(popupClass).popup(); //initialize the popup
    $(popupClass).show();
    $(popupClass).popup('open');
    popupMsgCloseInit(popupClass);
}

function popupMsgCloseInit(popupClass){
    $('body').one('click', popupClass  + ' .btn-cancel', function() {
        $(popupClass).popup('close');
    });
}