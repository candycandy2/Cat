
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
        $.mobile.changePage('#viewOverview');
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
        //adjustPageMarginTop();
    });


    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        if (window.orientation === 180 || window.orientation === 0) {
            /*do somrthing when device is in portraint mode*/
        }
    }, false);
});

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