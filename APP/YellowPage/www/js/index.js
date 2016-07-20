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
        items:4,
        loop:false,
        margin:10
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
                items:1
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

 $('#main_query_page').keypress(function(event){
    if (event.keyCode == 13) // keyCode of 'Enter' key is 13
    {
        //alert('You pressed a "enter" key in somewhere');
        location.href = "#query_result_page";
        window.callQueryEmployeeData();
    }
 });

$(function() {
    $("#callAjax").click(function() {
        callQueryEmployeeData();
    });
    
    window.callQueryEmployeeData = function()
    {
      var jsCompany = document.getElementById("Company").value;
      var jsCName = document.getElementById("CName").value;
      var jsEName = document.getElementById("EName").value;
      var jsDepartment = document.getElementById("Department").value;
      var jsExtNum = document.getElementById("ExtNum").value;
      //var jsurl = "http://mproject_api.benq.com/v101/yellowpage/QueryEmployeeData?lang=en-us&Company=" + jsCompany + "&Name_CH=" + jsCName + "&Name_EN=" + jsEName + "&Department=" + jsDepartment + "&Ext_No=" + jsExtNum;

      $('#employee-data').empty();
      $('#employee-data').append('<div class="ui-grid-c">');
      $('#employee-data').append('<li data-role="list-divider" class="ui-block-a grid-style-a">Company</li>');
      $('#employee-data').append('<li data-role="list-divider" class="ui-block-b grid-style-b">E.Name</li>');
      $('#employee-data').append('<li data-role="list-divider" class="ui-block-c grid-style-c">C.Name</li>');
      $('#employee-data').append('<li data-role="list-divider" class="ui-block-d grid-style-d">Detail</li>');
      
      $.ajax({
        //type: "GET",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        //url: jsurl,
        //headers: {
        //  'Content-Type': 'json',
        //  'App-Key':'yellowpage',
        //  'Signature-Time':'1458900578',
        //  'Signature':'WsnMjPaCnVTJmUk0tIkeT9bEIng='
        //},
        url: "http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryEmployeeData",
        data: '{"strXml":"<LayoutHeader><Company>' + jsCompany + '</Company><Name_CH>' + jsCName + '</Name_CH><Name_EN>' + jsEName + '</Name_EN><DeptCode>' + jsDepartment + '</DeptCode><Ext_No>' + jsExtNum + '</Ext_No></LayoutHeader>"}',
        dataType: "json",
        cache: false,
        success: onSuccess
      });
    };
    
    $("#resultLog").ajaxError(function(event, request, settings, exception) {
      $("#resultLog").html("Error Calling: " + settings.url + "<br />HTTP Code: " + request.status);
    });

    function onSuccess(data)
    {
      var rawdata = data['d'];
      var jsonobj = jQuery.parseJSON(rawdata);

      var resultcode = jsonobj['ResultCode'];
      
      if (resultcode == 1 || resultcode == 1906) {
        var dataContent = jsonobj['Content'];
        for (var i=0; i<dataContent.length; i++){
          $('#employee-data').append('<div class="ui-grid-c grid_style">');
          var company = dataContent[i].Company;
          $('#employee-data').append('<li class="ui-block-a grid-style-data-a">' + company + '</li>');
          var ename = dataContent[i].Name_EN;
          $('#employee-data').append('<li class="ui-block-b grid-style-data-b">' + ename + '</li>');
          var cname = dataContent[i].Name_CH;
          $('#employee-data').append('<li class="ui-block-c grid-style-data-c">' + cname + '</li>');
          var extnum = dataContent[i].Ext_No;
          $('#employee-data').append('<li class="ui-block-d grid-style-data-d"><a href="#" style="min-height:0em;min-width:0em;"><img src="img/detail.png"></a></li>');
        }
        $('#employee-data').listview('refresh'); 
      }
    };
    
    $("#cleanquery").click(function() {
      $('#CName').val("");
      $('#EName').val("");
      $('#Department').val("");
      $('#ExtNum').val("");
    });
    
    $("#employee-data").listview({
      autodividers: true,
      autodividersSelector: function ( li ) {
      var out = li.attr('time');
      return out;
      }
    });
    
    $('#employee-data').listview('refresh');
    
    $("#testdetail").click(function() {
      $('#detail-data').empty();
      
      $('#detail-data').append('<div class="ui-grid-b grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">公司</li>');
      var company = "Qisda"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b-1">' + company + '</li>');
      $('#detail-data').append('<li class="ui-block-d grid-style-detail-c"><a href="#" style="min-height:2em;min-width:0em;"><img src="img/star.png"></a></li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">英文姓名</li>');
      var ename = "Ming.Wang"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + ename + '</li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">中文姓名</li>');
      var cname = "王小明"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + cname + '</li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">工號</li>');
      var enumber = "1601001"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + enumber + '</li>');
      
      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">事業區</li>');
      var barea = "QTT"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + barea + '</li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">部門</li>');
      var department = "AI31"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + department + '</li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">部門名稱</li>');
      var departmentname = "資訊技術服務 資訊技術服務三處 資訊技術服務一部"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + departmentname + '</li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">分機</li>');
      var extnum = "8800-1234"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + extnum + '</li>');

      $('#detail-data').append('<div class="ui-grid-a grid_style">');
      $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">Email</li>');
      var email = "Ming.Wang@Qisda.com"
      $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + email + '</li>');
    });
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        app.addCompanySelect();
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
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    // add compony option in dropbox
    addCompanySelect: function()
    {
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryCompanyData",
          dataType: "json",
          cache: false,
          success: app.onSuccess
      });
    },    
    onSuccess: function(data)
    {
      var rawdata = data['d'];
      var jsonobj = jQuery.parseJSON(rawdata);
      var companySelect = document.getElementById('Company');
      
      var resultcode = jsonobj['ResultCode'];
      
      if (resultcode == 1 || resultcode == 1906) {
        var dataContent = jsonobj['Content'];
        for (var i=2; i<dataContent.length; i++){ // ignore 0 and 1, 0: "All Company", 1: ""
          var companyname = dataContent[i].CompanyName;
          companySelect.options[companySelect.options.length] = new Option(companyname, companyname);
        }
      }
    },
};

app.initialize();
