/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 $(document).ready(function () {
    var owl = $('#applist1');

    $('#applist1').owlCarousel({
        stagePadding: 50,
        loop:false,
        margin:10,
        nav:false,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    });

    $('#applist2').owlCarousel({
        stagePadding: 50,
        loop:false,
        margin:10,
        nav:false,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    });

    $('#applist3').owlCarousel({
        stagePadding: 50,
        loop:false,
        margin:10,
        nav:false,
        responsive:{
            0:{
                items:3
            },
            600:{
                items:3
            },
            1000:{
                items:5
            }
        }
    });

    $( "#dialog" ).dialog({ autoOpen: false });

    function callback(event) {

        $( "#dialog" ).dialog( "open" );

        // Provided by the core
        var element   = event.target;         // DOM element, in this example .owl-carousel
        var name      = event.type;           // Name of the event, in this example dragged
        var namespace = event.namespace;      // Namespace of the event, in this example owl.carousel
        var items     = event.item.count;     // Number of items
        var item      = event.item.index;     // Position of the current item
        // Provided by the navigation plugin
        var pages     = event.page.count;     // Number of pages
        var page      = event.page.index;     // Position of the current page
        var size      = event.page.size;      // Number of items per page

        jQuery("#TicketTC")
          .on("dialogopen", function (event, ui) {
            setupCheckBox('chk-img');
          })
          .html('<div class="support-msg"></div>')
          .dialog({
            modal: true,
            width: 200,
            height: 'auto',
            autoOpen: true,
            buttons: {
              CONTINUE: function () {
                jQuery(this).dialog("close");
                return true;
              },
              CANCEL: function () {
                jQuery(this).dialog("close");
                return false;
              }
            }
          });
    }

    owl.on('mousewheel', '.owl-stage', function (e) {
        if (e.deltaY>0) {
            owl.trigger('next.owl');
        } else {
            owl.trigger('prev.owl');
        }
        e.preventDefault();
    });

    var parentElement = document.getElementById("testBattery");
    if (Modernizr.batteryapi) {
      // supported
      parentElement.setAttribute('style', 'display:block;');
      parentElement.textContent = 'supported battery';//background-color:#333333;
    } else {
      // not-supported
      //parentElement.setAttribute('style', 'display:block;background-color:#FF3333;');
      //parentElement.textContent = 'not-supported battery';
    }
    parentElement = document.getElementById("testApplicationCache");
    if (Modernizr.applicationcache) {
      // supported
      //parentElement.setAttribute('style', 'display:block;');
      //parentElement.textContent = 'supported applicationcache';
    } else {
      // not-supported
      parentElement.setAttribute('style', 'display:block;background-color:#FF3333;');
      parentElement.textContent = 'not-supported applicationcache';
    }
 });

 $( document ).on( "click", ".show-page-loading-msg", function() {
     var $this = $( this ),
         theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
         msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
         textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
         textonly = !!$this.jqmData( "textonly" );
         html = $this.jqmData( "html" ) || "";
     $.mobile.loading( "show", {
             text: msgText,
             textVisible: textVisible,
             theme: theme,
             textonly: textonly,
             html: html
     });
 })
 .on( "click", ".hide-page-loading-msg", function() {
     $.mobile.loading( "hide" );
 });

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        //StatusBar.show();
        if (cordova.platformId == 'android') {
            //StatusBar.backgroundColorByName("purple");
            //StatusBar.hide();
        }

        app.setSecurity();
        app.changeLevel(1);
        document.addEventListener("resume", app.resumeCheckLevel);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    //setSecurity
    setSecurity: function(){
        var securityList = {
            level: 2,
            Navigations: [
                "*://*.baidu.com/*",
                "*://*.qq.com/*"
            ],
            Intents: [
                "tel:*",
                "sms:*",
                "mailto:*",
                "geo:*"
            ],
            Requests: [
                "*://*.baidu.com/*",
                "http://aic0-s12.qgroup.corp.com:8084/*"
            ]
        };
        window.plugins.qsecurity.setWhiteList(securityList,app.success,app.error);
    },
    changeLevel: function(level){
        window.plugins.qsecurity.changeLevel(level,app.success,app.error);
    },
    resumeCheckLevel: function(){
        window.plugins.qsecurity.resumeCheckLevel(app.securityLevel,app.error);
    },
    securityLevel: function(rs){
        if(rs==1){
            //alert("Level: " + rs + "check login: need implement");
        }else{
            alert("Level: " + rs);
        }
    },
    success: function(){
        //alert("success!");
    },
    error: function(){
        alert("error!");
    }
};

app.initialize();

$(function() {
    $("#doLogin").click(function() {
      //window.plugins.qlogin.openCertificationPage(null, null);
      window.plugins.qlogin.openCertificationPage(loginSuccess, loginFail);
    });
    
    function loginSuccess() {
      var success;
    };
    
    function loginFail() {
      var fail;
    };
    
    $("#checkAppVersion").click(function() {
      var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://aic0-s12.qgroup.corp.com:8084/qplayApi/public/index.php/v101/qplay/checkAppVersion?lang=en-us&package_name=benq.qplay&device_type=android&version_code=1",
        headers: {
          'Content-Type': 'application/json',
          'app-key': 'qplay',
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
        },
        cache: false,
        success: onCheckAppVersionSuccess,
        error: onCheckAppVersionFail,
      });
      
      window.plugins.qlogin.getLoginData(getLoginDataSuccessCallback,getLoginDataErrorCallback);
    });
    
    function onCheckAppVersionSuccess(data)
    {
      //var rawdata = data['d'];
      //var jsonobj = jQuery.parseJSON(data);
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
    
      if (resultcode == 1)
      {
          alert(jsonobj['message']);
      }
      else if (resultcode == 000913)
      {
          //alert("up to date");
          alert(jsonobj['message']);
      }
    };
    
    function onCheckAppVersionFail(data)
    {
      var result = data;  
      
      alert("onCheckAppVersionFail");
    };
    
    function getLoginDataSuccessCallback(rsData)
    {
      var jsonobj = jQuery.parseJSON(rsData);
      rsDataFromServer.token_valid = jsonobj['token_valid'];
      rsDataFromServer.token = jsonobj['token'];
      rsDataFromServer.uuid = jsonobj['uuid'];
      rsDataFromServer.redirect = jsonobj['redirect-uri'];
    };
    
    function getLoginDataErrorCallback()
    {
        
    };
    
    $("#mainpage2-1").click(function() {
      var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "http://aic0-s12.qgroup.corp.com:8084/qplayApi/public/index.php/v101/qplay/getAppList?lang=en-us&uuid=" + rsDataFromServer.uuid,
        headers: {
          'Content-Type': 'application/json',
          'app-key': 'qplay',
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
          'token': rsDataFromServer.token,
        },
        cache: false,
        success: ongetAppListSuccess,
        error: ongetAppListFail,
      });

      function ongetAppListSuccess(data)
      {
        var jsonobj = data;
        var resultcode = jsonobj['result_code'];
    
        if (resultcode == 1) {
          alert("extract app list and display to ui");
        }
        else {
          alert("get app list return error code");
        }
      };
      
      function ongetAppListFail(data)
      {
        alert("ongetAppListFail");
      };

    });
});

// rsDataFromServer = "{"token_valid" : "1470820532", "uuid" : "44654456", "redirect-uri" : "http%3A%2F%2Fwww.moses.com%2Ftest%
var rsDataFromServer = {
  token: 'nullstring',
  token_valid: 'nullstring',
  uuid: 'nullstring',
  redirect: 'nullstring',
};