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
        
        // tab title, open version, uuid window
        $(".ui-title").on("taphold", function() {
            //Set for iOS, control text select
            document.documentElement.style.webkitTouchCallout = "none";
            document.documentElement.style.webkitUserSelect = "none";
			
            infoMessage();
        });
        
        
    });


    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
            /*do somrthing when device is in portraint mode*/
           
        }
    }, false);
    
    
});



/************************************ function *******************************************/
//Taphold APP Header to show Version/AD/UUID
function infoMessage() {
    $("#infoLoginid").html("Allen.Z.Yuan");
    $("#infoUUID").html("da1sd54asdas1d5a3s");
    $("#infoVersionName").html("1.0.0.408[Development]");
    $('#infoMsg').popup();
    $('#infoMsg').show();
    $('#infoMsg').popup('open');

    setTimeout(function() {
        //Set for iOS, control text select
        document.documentElement.style.webkitTouchCallout = "default";
        document.documentElement.style.webkitUserSelect = "auto";
    }, 1000);
}