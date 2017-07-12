/*********************************** global variable *****************************************/
var closeInfoMsgInit = false;


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
        //Beginning of viewMain
        $.mobile.changePage('#viewMain');
        
        //[Android] Handle the back button, set in index.js
        document.addEventListener("backbutton", onBackKeyDown, false);
        
        //for touch overflow content Enabled
        $.mobile.touchOverflowEnabled = true;

        if (device.platform === "iOS") {
            $.mobile.hashListeningEnabled = false;
        }
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



/************************************ function *******************************************/
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

