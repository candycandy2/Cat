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

 $(document).on('pagebeforeshow', '#detail_info_page', function(){
    //alert('employee : ' + employeedata.index + ' ' + employeedata.company[employeedata.index]+ ' ' + employeedata.ename[employeedata.index]+ ' ' + employeedata.cname[employeedata.index]);
    
    if ((employeedata.total == 9999) ||(employeedata.index >= employeedata.total))
      return;

    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryEmployeeDataDetail",
      data: '{"strXml":"<LayoutHeader><Company>' + employeedata.company[employeedata.index] + '</Company><Name_EN>' + employeedata.ename[employeedata.index] + '</Name_EN></LayoutHeader>"}',
      dataType: "json",
      cache: false,
      success: onDetailSuccess,
      error: onDetailFail,
    });

    function onDetailSuccess(data)
    {
      var rawdata = data['d'];
      var jsonobj = jQuery.parseJSON(rawdata);
      var companySelect = document.getElementById('Company');
      
      var resultcode = jsonobj['ResultCode'];
      
      if (resultcode == 1) {
        var dataContent = jsonobj['Content'];
        var company = dataContent[0].Company;
        var ename = dataContent[0].Name_EN;
        var cname = dataContent[0].Name_CH;
        employeedata.addemployeeid = dataContent[0].EmployeeID;
        var sidecode = dataContent[0].SiteCode;
        var dcode = dataContent[0].DeptCode;
        var dept = dataContent[0].Dept;
        var extno = dataContent[0].Ext_No;
        var email = dataContent[0].EMail;
        
        $('#detail-data').empty();

        $('#detail-data').append('<div class="ui-grid-b grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">公司</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b-1">' + company + '</li>');
        $('#detail-data').append('<li class="ui-block-c grid-style-detail-c"><a style="min-height:2em;min-width:0em;" value="' + employeedata.index.toString() + '" id="add-phonebook' + employeedata.index.toString() + '"><img src="img/star.png"></a></li>');
        $('#detail-data').append('</div>');
        
        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">英文姓名</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + ename + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">中文姓名</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + cname + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">工號</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + employeedata.addemployeeid + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">事業區</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + sidecode + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">部門</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + dcode + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">部門名稱</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + dept + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">分機</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + extno + '</li>');
        $('#detail-data').append('</div>');

        $('#detail-data').append('<div class="ui-grid-a grid_style">');
        $('#detail-data').append('<li class="ui-block-a grid-style-detail-a">Email</li>');
        $('#detail-data').append('<li class="ui-block-b grid-style-detail-b">' + email + '</li>');
        $('#detail-data').append('</div>');
      }
      
      $('a[id^="add-phonebook"]').click(function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var myemployeeid = "0208042"; // fix me !!!!!
        
        $("#ask_add_phone_book").popup( "open" ); // fix me !!!!! need to check yes or no
        
        $.ajax({
          type: "POST",
          contentType: "application/json; charset=utf-8",
          url: "http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/AddMyPhoneBook",
          data: '{"strXml":"<LayoutHeader><User_EmpID>' + myemployeeid + '</User_EmpID><Add_EmpID>' + employeedata.addemployeeid + '</Add_EmpID><Add_Company>' + employeedata.company[employeedata.index] +'</Add_Company></LayoutHeader>"}',
          dataType: "json",
          cache: false,
          success: onAddMyPhoneBookSuccess,
          error: onAddMyPhoneBookFail,
        });
      });
    }
    
    function onDetailFail(data)
    {
      var reault = data;
    }
    
    function onAddMyPhoneBookSuccess(data)
    {
      var rawdata = data['d'];
      var jsonobj = jQuery.parseJSON(rawdata);

      var resultcode = jsonobj['ResultCode'];
      
      if (resultcode == 001902)
      {
        //alert('add success');
      }
      else
      {
        //alert('add fail');
      }
    }
    
    function onAddMyPhoneBookFail(data)
    {
      
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

 $('#main_query_page').keypress(function(event){
    if (event.keyCode == 13) // keyCode of 'Enter' key is 13
    {
      getEmployeeData();
    }
 });

$(function() {
    $("#callAjax").click(function() {
      getEmployeeData();
    });
    
    window.getEmployeeData = function()
    {
      var jsCName = document.getElementById("CName").value;
      var jsEName = document.getElementById("EName").value;
      var jsDepartment = document.getElementById("Department").value;
      var jsExtNum = document.getElementById("ExtNum").value;

      if ((jsCName == "") && (jsEName == "") && (jsDepartment == "") && (jsExtNum == "")) {
        $("#no_query_condition").popup( "open" );
        return;
      }
      
      callQueryEmployeeData();
      $.mobile.changePage('#query_result_page', { transition: "flip"} );
    };
    
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
      $('#employee-data').append('</div>');
      
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
        employeedata.total = dataContent.length;
        for (var i=0; i<dataContent.length; i++){
          $('#employee-data').append('<div class="ui-grid-c">');
          var company = dataContent[i].Company;
          employeedata.company[i] = company;
          $('#employee-data').append('<li class="ui-block-a grid-style-data-a">' + company + '</li>');
          var ename = dataContent[i].Name_EN;
          employeedata.ename[i] = ename;
          $('#employee-data').append('<li class="ui-block-b grid-style-data-b">' + ename + '</li>');
          var cname = dataContent[i].Name_CH;
          employeedata.cname[i] = cname;
          $('#employee-data').append('<li class="ui-block-c grid-style-data-c">' + cname + '</li>');
          var extnum = dataContent[i].Ext_No;
          $('#employee-data').append('<li class="ui-block-d grid-style-data-d"><a value="' + i.toString() + '" id="detailindex' + i.toString() + '" style="min-height:0em;min-width:0em;"><img src="img/detail.png"></a></li>');
          $('#employee-data').append('</div>');
        }
        //  $('#employee-data').listview('refresh');
        
        $('a[id^="detailindex"]').click(function(e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          //Do important stuff....
          employeedata.index = this.getAttribute('value');
          //alert("detailindexaaa" + i.toString());
          $.mobile.changePage('#detail_info_page', { transition: "flip"} );
        });
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
    
  //  $('#employee-data').listview('refresh');
    
    $("#myphonebook").click(function() {
      $('#my_phonebook_list').empty();
      
      $('#my_phonebook_list').append('<div class="ui-grid-c">');
      $('#my_phonebook_list').append('<li data-role="list-divider" class="ui-block-a grid-style-a">Company</li>');
      $('#my_phonebook_list').append('<li data-role="list-divider" class="ui-block-b grid-style-b">E.Name</li>');
      $('#my_phonebook_list').append('<li data-role="list-divider" class="ui-block-c grid-style-c">C.Name</li>');
      $('#my_phonebook_list').append('<li data-role="list-divider" class="ui-block-d grid-style-d">Detail</li>');
      $('#my_phonebook_list').append('</div>');
      
      var myemployeeid = "0208042"; // fix me !!!!!
      
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/QueryMyPhoneBook",
        data: '{"strXml":"<LayoutHeader><User_EmpID>' + myemployeeid + '</User_EmpID></LayoutHeader>"}',
        dataType: "json",
        cache: false,
        success: onQueryMyPhoneBookSuccess,
        error: onQueryMyPhoneBookFail,
      });
    });
    
    function onQueryMyPhoneBookSuccess(data)
    {
      var rawdata = data['d'];
      var jsonobj = jQuery.parseJSON(rawdata);
      var companySelect = document.getElementById('Company');
      
      var resultcode = jsonobj['ResultCode'];
      
      if (resultcode == 1) {
        var dataContent = jsonobj['Content'];
        myphonebook.total = dataContent.length;
        for (var i=0; i<dataContent.length; i++){
          $('#my_phonebook_list').append('<div class="ui-grid-c">');
          var company = dataContent[i].Company;
          myphonebook.company[i] = company;
          $('#my_phonebook_list').append('<li class="ui-block-a grid-style-data-a">' + company + '</li>');
          var ename = dataContent[i].Name_EN;
          myphonebook.ename[i] = ename;
          $('#my_phonebook_list').append('<li class="ui-block-b grid-style-data-b">' + ename + '</li>');
          var cname = dataContent[i].Name_CH;
          myphonebook.cname[i] = cname;
          $('#my_phonebook_list').append('<li class="ui-block-c grid-style-data-c">' + cname + '</li>');
          var extnum = dataContent[i].Ext_No;
          myphonebook.extnum[i] = extnum;
          $('#my_phonebook_list').append('<li class="ui-block-d grid-style-data-d"><a href="#" style="min-height:0em;min-width:0em;"><img src="img/detail.png"></a></li>');
          $('#my_phonebook_list').append('</div>');
        }
      }
    }
    
    function onQueryMyPhoneBookFail(data)
    {
      
    }
    
    function refreshEditMyPhonebookList()
    {
      $('#edit_my_phonebook_list').empty();
      
      $('#edit_my_phonebook_list').append('<div class="ui-grid-c">');
      $('#edit_my_phonebook_list').append('<li data-role="list-divider" class="ui-block-a grid-style-editphone-a">Edit</li>');
      $('#edit_my_phonebook_list').append('<li data-role="list-divider" class="ui-block-b grid-style-editphone-b">Company</li>');
      $('#edit_my_phonebook_list').append('<li data-role="list-divider" class="ui-block-c grid-style-editphone-c">E.Name</li>');
      $('#edit_my_phonebook_list').append('<li data-role="list-divider" class="ui-block-d grid-style-editphone-d">C.Name</li>');
      $('#edit_my_phonebook_list').append('</div>');
     
      for (var i=0; i<myphonebook.total; i++){
        $('#edit_my_phonebook_list').append('<div class="ui-grid-c">');
        //$('#edit_my_phonebook_list').append('<li class="ui-block-a grid-style-editphone-data-a"><input type="checkbox" name="checkbox'+ i.toString() +'" id="checkbox' + i.toString() +'" class="custom" value="' + i.toString() + '"></input></li>');
        $('#edit_my_phonebook_list').append('<li class="ui-block-a grid-style-editphone-data-a"><input type="checkbox" name="checkbox[]" id="checkbox' + i.toString() +'" class="custom" value="' + i.toString() + '"></input></li>');
        $('#edit_my_phonebook_list').append('<li class="ui-block-b grid-style-editphone-data-b">' + myphonebook.company[i] + '</li>');
        $('#edit_my_phonebook_list').append('<li class="ui-block-c grid-style-editphone-data-c">' + myphonebook.ename[i] + '</li>');
        $('#edit_my_phonebook_list').append('<li class="ui-block-d grid-style-editphone-data-d">' + myphonebook.cname[i] + '</li>');
        //myphonebook.extnum[i];
        $('#edit_my_phonebook_list').append('</div>');
      }
    }
    
    $("#edit-button").click(function() {
        refreshEditMyPhonebookList();        
    });
    
    $("#select-all").click(function() {
      for (var i=0; i<myphonebook.total; i++){
        document.getElementById('checkbox'+i).checked = true; 
      }
    });
    
    $("#delete-phonebook").click(function() {
      var finalTotal = 0;
      var finalCompany = new Array();
      var finalEname = new Array();
      var finalCname = new Array();
      var finalExtnum = new Array();
      
      $("#ask_delete_phone_book").popup( "open" ) // fix me !!!!! need to check yes or no
      
      for (var i=0; i<myphonebook.total; i++) {
        if (document.getElementById('checkbox'+i).checked == true)
        {
          
          
        }
        else
        {
          finalCompany[finalTotal] = myphonebook.company[i];
          finalEname[finalTotal] = myphonebook.ename[i];
          finalCname[finalTotal] = myphonebook.cname[i];
          finalExtnum[finalTotal] = myphonebook.extnum[i];
          finalTotal++;
        }
      }
      
      myphonebook.total = finalTotal;
      for (var i=0; i<finalTotal; i++) {
        myphonebook.company[i] = finalCompany[i];
        myphonebook.ename[i] = finalEname[i];
        myphonebook.cname[i] = finalCname[i];
        myphonebook.extnum[i] = finalExtnum[i];
      }
      
      refreshEditMyPhonebookList();
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
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

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

// Store object
var employeedata = {
  total: 9999,
  index: 9999,
  name : 'hello',
  company: [], // array
  ename: [],
  cname: [],
  addemployeeid : '9999999',
};

var myphonebook = {
  total: 9999,
  company: [],
  ename: [],
  cname: [],
  extnum: [],
};