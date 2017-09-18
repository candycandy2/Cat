
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