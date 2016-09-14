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

        if (device.platform === "iOS")
        {
          $('div[data-role="header"]').addClass('ios-fix-overlap');
        }
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
                serverURL + "/*",
                "itms-services://*"
            ],
            Intents: [
                "itms-services:*",
                "http:*",
                "https:*",
                "tel:*",
                "sms:*",
                "mailto:*",
                "geo:*"
            ],
            Requests: [
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
          doLoginFunction();
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
      doLoginFunction();
    });
    
    $("#checkAppVersion").click(function() {
      //checkAppVersionFunction();
      window.plugins.qlogin.getLoginData(getLoginDataSuccessCallback,getLoginDataErrorCallback);
    });
    
    $("#InstallApp").click(function() {
      for (var appindex=0; appindex<applist.length; appindex++) {
          var appurl = applist[appindex].url;
          var appurlicon = applist[appindex].icon_url;
          var packagename = applist[appindex].package_name;
          
          if (packagename == "benq.yellowpage") {
              //window.location = appurl;
              window.open(appurl, '_self', false);
          }
      } // for appindex
    });
    
    $("#logout").click(function() {
      doLogoutFunction();
      doLoginFunction();
    });
    
    window.doLoginFunction = function()
    {
      var args = [];
      args[0] = "LoginSuccess";//登录成功后调用的js function name
      //args[1] = device.uuid;//uuid
      
      // for testing
      if (device.platform == "Android")
          args[1] = "A1234567890A1234567890";
      else if (device.platform == "iOS")
          args[1] = "12455";
      else
          alert("device.platform error !!!");

      window.plugins.qlogin.openCertificationPage(null, null, args); // for testing
      loginjustdone = 1;
    }
    
    window.doLogoutFunction = function()
    {
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL +"/qplayApi/public/index.php/v101/qplay/logout?lang=en-us&uuid=" + device.uuid + "&domain=" + rsDataFromServer.domain + "&loginid=" + rsDataFromServer.empno,
        headers: {
          'Content-Type': 'application/json',
          'app-key': appkey,
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
        },
        cache: false,
        success: onLogoutSuccess,
        error: onLogoutFail,
      });
    }
    
    function onLogoutSuccess(data)
    {
      //var rawdata = data['d'];
      //var jsonobj = jQuery.parseJSON(data);
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
    
      if (resultcode == 1)
      {
      }
      else
      {
          //alert(jsonobj['message']);
      }
    };
    
    function onLogoutFail(data)
    {
      var result = data;  
      
      alert("onLogoutFail");
    };
    
    window.checkAppVersionFunction = function()
    {
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL +"/qplayApi/public/index.php/v101/qplay/checkAppVersion?lang=en-us&package_name=benq.qplay&device_type=android&version_code=1",
        headers: {
          'Content-Type': 'application/json',
          'app-key': appkey,
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
          //alert(jsonobj['message']);
          
          // do update process
          // .....
          
          // for testing
          doLoginFunction();
      }
      else if (resultcode == 000913)
      {
          //alert("up to date");
          alert(jsonobj['message']);
          
          doLoginFunction();
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
      rsDataFromServer.empno = data['emp_no'];
      rsDataFromServer.domain = data['domain'];
      
      // need to check token_valid
      
      callGetAppList();
    };
    
    function callGetAppList()
    {
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/getAppList?lang=en-us&uuid=" + rsDataFromServer.uuid,
        
        headers: {
          'Content-Type': 'application/json',
          'app-key': appkey,
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
        var carouselItem;
        
        for (var categoryindex=0; categoryindex<appcategorylist.length; categoryindex++) {
          var catetoryname = appcategorylist[categoryindex].app_category;
          $('#appcontent').append('<h4>' + catetoryname + '</h4>');
          $('#appcontent').append('<div class="owl-carousel owl-theme"' + 'id=qplayapplist' + categoryindex.toString() + '>');
          var owl = $("#qplayapplist"+ categoryindex.toString()), i = 0, textholder, booleanValue = false;
          //init carousel
          owl.owlCarousel();
          
          for (var appindex=0; appindex<applist.length; appindex++) {
            var appcategory = applist[appindex].app_category;
            if (appcategory == catetoryname){
              var appurl = applist[appindex].url;
              var appurlicon = applist[appindex].icon_url;
              var packagename = applist[appindex].package_name;
              
              carouselItem = '<div class="owl-item"><a href="#appdetail2-2"><img src="' + applist[appindex].icon_url + '" style="width:50px;height:50px;"></a><p style="font-size:0.8em;margin-top:0px;">' + packagename.substr(5) + '</p></div>';
              
              $('#appcontent').append(carouselItem);
              
              if (packagename == "benq.qplay") {
                  app.changeLevel(applist[appindex].security_level);
              }
            } // if (appcategory == catetoryname)
          } // for appindex
          
          $('#appcontent').append('</div>');
        } // for categoryindex
      } // if (resultcode == 1)
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
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/isRegister?lang=en-us&uuid=" + device.uuid,
        headers: {
          'Content-Type': 'application/json',
          'app-key': appkey,
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
              doLoginFunction();
          }
          else {
              //alert("!is_register");
              doLoginFunction();
          }
      }
    };
    
    function onisRegisterFail(data)
    {
      alert("onisRegisterFail");
    };
    
    $("#newseventspage").click(function() {
        callgetMessageList();
    });
    
    function callgetMessageList()
    {
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        
        // fix me !!! this is for testing
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/getMessageList?lang=en-us&uuid=" + rsDataFromServer.uuid + "&date_from=1451577600&date_to=1470499200&count_from=1&count_to=200",
        
        headers: {
          'Content-Type': 'application/json',
          'app-key': appkey,
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
          'token': rsDataFromServer.token,
        },
        cache: false,
        success: ongetMessageListSuccess,
        error: ongetMessageListFail,
      });          
    };
    
    function ongetMessageListSuccess(data)
    {
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
      
      if (resultcode == 1)
      {
          //alert(jsonobj['message']);
          messagecontent = jsonobj['content'];
          var newsListItems = "";
          var eventListItems = "";
          
          for (var messageindex=0; messageindex<messagecontent.message_count; messageindex++)
          {
              var message = messagecontent.message_list[messageindex];
              if (message.message_type == "news") // 1:news  2:event
              {
                  var title = message.message_title;
                  var txt = message.message_txt;
                  var rowid = message.message_send_row_id;
                  var time = message.create_time;
                  
                  newsListItems += "<li><a value=" + messageindex.toString() + " id=\"messageindex" + messageindex.toString() + "\"><h2 style=\"white-space:pre-wrap;\">" + title + "</h2><p>" + time + "</p></a></li>";
              }
              else if (message.message_type == "event")
              {
                  var title = message.message_title;
                  var txt = message.message_text;
                  var rowid = message.message_send_row_id;
                  var time = message.create_time;
                  
                  eventListItems += "<li><a href='" + "#webnewspage2-3-1'><h2 style=" + "white-space:pre-wrap;" + ">" + title + '</h2><p>' + time + "</p></a></li>";
              }
          }
          $("#newslistview").html(newsListItems);
          $("#newslistview").listview('refresh');
          $("#eventlistview").html(eventListItems);
          $("#eventlistview").listview('refresh');
          
          $('a[id^="messageindex"]').click(function(e) {
              e.stopImmediatePropagation();
              e.preventDefault();
              
              var i = this.getAttribute('value');
              var rowid = messagecontent.message_list[i].message_send_row_id;
              callgetMessageDetail(rowid)
          });
      }
    };
    
    function ongetMessageListFail(data)
    {
      alert("ongetMessageListFail");
    };
    
    function callgetMessageDetail(rowid)
    {
      var signatureTime = Math.round(new Date().getTime()/1000);
      var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
      var signatureInBase64 = CryptoJS.enc.Base64.stringify(hash);
      
      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: serverURL + "/qplayApi/public/index.php/v101/qplay/getMessageDetail?lang=en-us&uuid=" + rsDataFromServer.uuid +"&message_send_row_id=" + rowid,
        headers: {
          'Content-Type': 'application/json',
          'app-key': appkey,
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
          'token': rsDataFromServer.token,
        },
        cache: false,
        success: ongetMessageDetailSuccess,
        error: ongetMessageDetailFail,
      });          
    };
    
    function ongetMessageDetailSuccess(data)
    {
      var jsonobj = data;
      var resultcode = jsonobj['result_code'];
      
      if (resultcode == 1)
      {
          //alert(jsonobj['message']);
          var responsecontent = jsonobj['content'];
          
          if (responsecontent.message_type == "news") // 1:news  2:event
          {
              var title = responsecontent.message_title;
              var messagetext = responsecontent.message_text;
              var messagehtml = responsecontent.message_html;
              var rowid = responsecontent.message_send_row_id;
              var time = responsecontent.create_time;
              var author = responsecontent.create_user;
              
              var element = document.getElementById("newsDetailCreateTime");
              element.textContent = time.substr(0, 10);
              
              element = document.getElementById("newsDetailTitle");
              element.textContent = title;
              
              element = document.getElementById("newsAuthor");
              element.textContent = author;

              element = document.getElementById("newsContent");
              element.textContent = messagetext;
              
              $.mobile.changePage('#webnewspage2-3-1', { transition: "flip"} );
          }
          else if (responsecontent.message_type == "event")
          {
              var title = responsecontent.message_title;
              var messagetext = responsecontent.message_text;
              var messagehtml = responsecontent.message_html;
              var rowid = responsecontent.message_send_row_id;
              
          }
      }
    };
    
    function ongetMessageDetailFail(data)
    {
      alert("ongetMessageDetailFail");
    };
    
});

// rsDataFromServer = "{"token_valid" : "1470820532", "uuid" : "44654456", "redirect-uri" : "http%3A%2F%2Fwww.moses.com%2Ftest%
var rsDataFromServer = {
  token: 'nullstring',
  token_valid: 'nullstring',
  uuid: 'nullstring',
  redirect: 'nullstring',
  empno: 'nullstring',
  domain: 'nullstring',
};

var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";
var appkey = "qplay"; // appkey
//var serverURL = "http://aic0-s12.qgroup.corp.com:8084"; // QCS API Server
//var serverURL = "http://10.82.246.95"; // QTT 內部 API Server
var serverURL = "http://qplay.benq.com"; // QTT 外部 API Server

var appcategorylist;
var applist;
var appmultilang;
var loginjustdone;
var messagecontent;