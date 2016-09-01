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

    $('#appdetaillist').owlCarousel({
        stagePadding: 0,
        loop:false,
        nav:false,
        responsive:{
            0:{
                items:1
            },
            100:{
                items:2
            },
            200:{
                items:3
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

$(document).on("pageshow","#initpage1-1",function(){
  //alert("pageshow event fired - initpage 1-1 is now shown");
  setTimeout(function(){
    //do check app version
    checkAppVersionFunction();
  }, 3000);
});

var serverURL = "http://aic0-s12.qgroup.corp.com:8084";
 
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
        //app.changeLevel(1);
        
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
                serverURL + "/*"
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
        if((rs==1) && (loginjustdone==0)) {
          //alert("Level: " + rs + " check login: need implement");
          var args = [];
          args[0] = "LoginSuccess";//登录成功后调用的js function name
          args[1] = device.uuid;//uuid
          window.plugins.qlogin.openCertificationPage(null, null, args);
          loginjustdone = 1;
        }else{
            //alert("Level: " + rs);
            loginjustdone = 0;
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
      var args = [];
      args[0] = "LoginSuccess";//登录成功后调用的js function name
      args[1] = device.uuid;//uuid
      window.plugins.qlogin.openCertificationPage(null, null, args); // for testing
    });
    
    $("#checkAppVersion").click(function() {
      //checkAppVersionFunction();
      window.plugins.qlogin.getLoginData(getLoginDataSuccessCallback,getLoginDataErrorCallback);
    });
    
    window.checkAppVersionFunction = function()
    {
      var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL +"/qplayApi/public/index.php/v101/qplay/checkAppVersion?lang=en-us&package_name=benq.qplay&device_type=android&version_code=1",
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
    };
    
    function onCheckAppVersionSuccess(data)
    {
      //var rawdata = data['d'];
      //var jsonobj = jQuery.parseJSON(data);
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
    
      if (resultcode == 1)
      {
          //alert("need to update");
          alert(jsonobj['message']);
          
          // do update process
          // .....
          
          callisRegister(); // for testing
      }
      else if (resultcode == 000913)
      {
          //alert("up to date");
          alert(jsonobj['message']);
          
          callisRegister();
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
      
      alert("uuid: " + rsDataFromServer.uuid);
    };
    
    function getLoginDataErrorCallback()
    {
      
    };
    
    window.LoginSuccess = function(data)
    {
      rsDataFromServer.token_valid = data['token_valid'];
      rsDataFromServer.token = data['token'];
      rsDataFromServer.uuid = data['uuid'];
      rsDataFromServer.redirect = data['redirect-uri'];
      //alert("uuid: " + rsDataFromServer.uuid);
      
      // need to check token_valid
      callGetAppList();
    };
    
    function callGetAppList()
    {
      var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/getAppList?lang=en-us&uuid=" + rsDataFromServer.uuid,
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
    };
      
    function ongetAppListSuccess(data)
    {
      $.mobile.changePage('#mainpage 2-1', { transition: "flip"} );
      
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
      
      if (resultcode == 1) {
        //alert(jsonobj['message']);
        var responsecontent = jsonobj['content'];
        
        appcategorylist = responsecontent.app_category_list;
        applist = responsecontent.app_list;
        appmultilang = responsecontent.multi_lang;
        
        $('#appcontent').html(""); // empty html content
        
        for (var categoryindex=0; categoryindex<appcategorylist.length; categoryindex++) {
          var catetoryname = appcategorylist[categoryindex].app_category;
          $('#appcontent').append('<h4>' + catetoryname + '</h4>');
          $('#appcontent').append('<div class="owl-carousel owl-theme"' + 'id=qplayapplist' + categoryindex.toString() + '>');
          
          // for testing
          $('#appcontent').append('<div class="owl-item"><a href="#appdetail2-2"><h4><img src="img/ypicon.png"></h4></div>');
          
          for (var appindex=0; appindex<applist.length; appindex++) {
            var appcategory = applist[appindex].app_category;
            if (appcategory == catetoryname){
              var appurl = applist[appindex].url;
              var appurlicon = applist[appindex].icon_url;
              var packagename = applist[appindex].package_name;
              
              if (packagename == "benq.qplay") {
                  app.changeLevel(applist[appindex].security_level);
              }
              else {
                  $('#appcontent').append('<div class="owl-item"><a href="#appdetail2-2"><h4><img src=' + applist[appindex].icon_url + '></h4></div>');
              }
            } // if
          } // for appindex
          $('#appcontent').append('</div>');
        } // for categoryindex
      }
      else {
        alert(jsonobj['message']);
      }
    };
    
    function ongetAppListFail(data)
    {
      alert("ongetAppListFail");
    };
    
    function callisRegister()
    {
      var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/isRegister?lang=en-us&uuid=" + device.uuid,
        headers: {
          'Content-Type': 'application/json',
          'app-key': 'qplay',
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
        },
        cache: false,
        success: onisRegisterSuccess,
        error: onisRegisterFail,
      });          
    };
    
    function onisRegisterSuccess(data)
    {
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
      
      if (resultcode == 1)
      {
          alert(jsonobj['message']);
          var responsecontent = jsonobj['content'];
          if (responsecontent.is_register) {
              //alert("is_register");
              var args = [];
              args[0] = "LoginSuccess";
              args[1] = device.uuid;//uuid
              window.plugins.qlogin.openCertificationPage(null, null, args);
              loginjustdone = 1;
          }
          else {
              //alert("!is_register");
              var args = [];
              args[0] = "LoginSuccess";
              args[1] = device.uuid;//uuid
              window.plugins.qlogin.openCertificationPage(null, null, args);
              loginjustdone = 1;
          }
      }
    };
    
    function onisRegisterFail(data)
    {
      alert("onisRegisterFail");
    };
    
});

// rsDataFromServer = "{"token_valid" : "1470820532", "uuid" : "44654456", "redirect-uri" : "http%3A%2F%2Fwww.moses.com%2Ftest%
var rsDataFromServer = {
  token: 'nullstring',
  token_valid: 'nullstring',
  uuid: 'nullstring',
  redirect: 'nullstring',
};

var appcategorylist;
var applist;
var appmultilang;
var loginjustdone;