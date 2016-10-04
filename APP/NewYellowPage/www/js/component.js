// component JS
//
// variable, function, page event for All APP
//
// appSecretKey => set in QPlayAPI.js under specific APP
//

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
        
        //[device] data ready to get on this step.

        //check data(token, token_value, ...) on web-storage
        /*
        if (data ok) {
            initialSuccess(); //set in APP's index.js
        } else {
            call APP QPlay to check data
        }
        */
        
        //scheme not work now, so use QLogin to get token
        
        var args = [];
        args[0] = "initialSuccess"; //set in APP's index.js
        args[1] = device.uuid;

        window.plugins.qlogin.openCertificationPage(null, null, args);
        

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

    for (var i=0; i<pageList.length; i++) {
        var pageID = pageList[i];

        (function(pageID){
            $.get("View/" + pageID + ".html", function(data) {
                $.mobile.pageContainer.append(data);
                $("#" + pageID).page().enhanceWithin();
            }, "html"); 
        }(pageID));
    }

});


$(document).one("pagecreate", "#"+pageList[0], function(){
    $(":mobile-pagecontainer").pagecontainer("change", $("#"+pageList[0]));
});

/********************************** function *************************************/

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
        $("body").addClass("ui-loading");
        $.mobile.loading("show", {
            html: '<div class="loader"><img src="img/ajax-loader.gif"><div style="color:#FFF;">Loading....</div></div>'
        });
    } else {
        $("body").removeClass("ui-loading");
        $.mobile.loading("hide");
        $(".ui-loader").remove();
    }
}