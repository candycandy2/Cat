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

    //20160920 Darren - start
    $('#phonebookEdit').on('click', function() {
       if ($('#phonebookEditBtn').is(':hidden'))
       {
            $('.edit-checkbox').show();
            $('#my_phonebook_list .ui-checkbox').show();
            $('#phonebookEditBtn').show();
            $('#my_phonebook_list .edit-checkbox').css('height','20px');

            $('#phonebook_page :checkbox').prop('checked', false);
            $('#phonebook_page #unselectAll').hide();
       }
       else
       {
            $('.edit-checkbox').hide();
            $('#my_phonebook_list .ui-checkbox').hide();
            $('#phonebookEditBtn').hide();
       }
       
    });
    //Darren - end
 });

$('#phonebook_page').on('pagebeforeshow', function(){
    $('.edit-checkbox').hide();
    $('.ui-checkbox').hide();
    $('#phonebookEditBtn').hide();
});

$('#phonebook_page #selectAll').on('click', function(){
    $('#phonebook_page :checkbox').prop('checked', true);
    $(this).hide();
    $('#phonebook_page #unselectAll').show();
});

$('#phonebook_page #unselectAll').on('click', function(){
    $('#phonebook_page :checkbox').prop('checked', false);
    $(this).hide();
    $('#phonebook_page #selectAll').show();
});

$('#phonebook_page #my_phonebook_list').on('click', function(){
    var checkboxTotalCount = $('#phonebook_page :checkbox').length;
    var checkboxCheckedCount = $('#phonebook_page :checkbox:checked').length;
    
    if (checkboxTotalCount === checkboxCheckedCount)
    {
        $('#phonebook_page #unselectAll').show();
        $('#phonebook_page #selectAll').hide();
    }
    else
    {
        $('#phonebook_page #unselectAll').hide();
        $('#phonebook_page #selectAll').show();
    }
});


$('#phoneDelete').on('click', function(){
    var checkboxCheckedCount = $('#phonebook_page :checkbox:checked').length;

    if (checkboxCheckedCount === 0)
    {
        $('#phonebookDelectAlert').popup('open');
    }
    else
    {
        $('#phonebookDelectConfirm').popup('open');
    }

    $("#phonebookEditBtn").hide();
});

 $(document).on('pagebeforeshow', '#detail_info_page', function(){
    
    if ((employeedata.total == 9999) || (employeedata.index >= employeedata.total)) 
    {
      return;
    }

    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);

    $.ajax({
      type: "POST",
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'App-Key': 'yellowpage',
        'Signature-Time': signatureTime,
        'Signature': signatureInBase64,
        'token': rsDataFromServer.token
      },
      url: serverURL + "/qplayApi/public/index.php/v101/yellowpage/QueryEmployeeDataDetail?lang=en-us&uuid=" + rsDataFromServer.uuid,
      data: '<LayoutHeader><Company>' + employeedata.company[employeedata.index] + '</Company><Name_EN>' + employeedata.ename[employeedata.index] + '</Name_EN></LayoutHeader>',
      dataType: "json",
      cache: false,
      success: onDetailSuccess,
      error: onDetailFail,
    });

    function onDetailSuccess(data)
    {
      var companySelect = document.getElementById('Company');
      
      var resultcode = data['ResultCode'];
      
      if (resultcode == 1) {
        var dataContent = data['Content'];
        var company = dataContent[0].Company;
        var ename = dataContent[0].Name_EN;
        var cname = dataContent[0].Name_CH;
        employeedata.addemployeeid = dataContent[0].EmployeeID;
        var sidecode = dataContent[0].SiteCode;
        var dcode = dataContent[0].DeptCode;
        var dept = dataContent[0].Dept;
        var extno = dataContent[0].Ext_No;
        var email = dataContent[0].EMail;
        
        $("#detail-data #companyName").html(company);
        $("#detail-data #eName").html(ename);
        $("#detail-data #cName").html(cname);
        $("#detail-data #employeeID").html(employeedata.addemployeeid);
        $("#detail-data #sideCode").html(sidecode);
        $("#detail-data #dept").html(dept);
        $("#detail-data #deptCode").html(dcode);
        $("#detail-data #extNo").html(extno);
        $("#detail-data #eMail").html(email);

        /*
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
        */

      }
      
      $('#addPhonebook').on('click', function(e) {
        
        var myemployeeid = "0208042"; // fix me !!!!!
        
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
        $.mobile.changePage('#phonebook_page');
      }
      else
      {
        
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
    };
    
    window.callQueryEmployeeData = function()
    {
      var jsCompany = document.getElementById("Company").value;
      var jsCName = document.getElementById("CName").value;
      var jsEName = document.getElementById("EName").value;
      var jsDepartment = document.getElementById("Department").value;
      var jsExtNum = document.getElementById("ExtNum").value;
      var signatureTime = getSignature("getTime");
      var signatureInBase64 = getSignature("getInBase64", signatureTime);
      
      $.ajax({
        type: "POST",
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'App-Key': 'yellowpage',
          'Signature-Time': signatureTime,
          'Signature': signatureInBase64,
          'token': rsDataFromServer.token
        },
        url: serverURL + "/qplayApi/public/index.php/v101/yellowpage/QueryEmployeeData?lang=en-us&uuid=" + rsDataFromServer.uuid,
        data: '<LayoutHeader><Company>' + jsCompany + '</Company><Name_CH>' + jsCName + '</Name_CH><Name_EN>' + jsEName + '</Name_EN><DeptCode>' + jsDepartment + '</DeptCode><Ext_No>' + jsExtNum + '</Ext_No></LayoutHeader>',
        dataType: "json",
        cache: false,
        success: onQueryEmployeeDataSuccess
      });
    };
    
    $("#resultLog").ajaxError(function(event, request, settings, exception) {
      $("#resultLog").html("Error Calling: " + settings.url + "<br />HTTP Code: " + request.status);
    });

    function onQueryEmployeeDataSuccess(data)
    {
      var resultcode = data['ResultCode'];

      if (resultcode == 1 || resultcode == 1906) {
        
        var dataContent = data['Content'];
        employeedata.total = dataContent.length;
        
        var htmlContent = "";

        for (var i=0; i<dataContent.length; i++){
          
          var company = dataContent[i].Company;
          employeedata.company[i] = company;

          var ename = dataContent[i].Name_EN;
          employeedata.ename[i] = ename;

          var cname = dataContent[i].Name_CH;
          employeedata.cname[i] = cname;

          var extnum = dataContent[i].Ext_No;

          htmlContent += htmlContent 
            + '<li>'
            +   '<div class="company">'
            +       '<p>' + company + '</p>'
            +   '</div>'
            +   '<div class="e-name">'
            +       '<p><a href="#detail_info_page" value="' + i.toString() + '" id="detailindex' + i.toString() + '">' + ename + '</a></p>'
            +       '<p><a rel="external" href="tel:+' + extnum + '" style="color:red;">' + extnum + '</a></p>'
            +   '</div>'
            +   '<div class="c-name">'
            +       '<p><a href="#detail_info_page" value="' + i.toString() + '" id="detailindex' + i.toString() + '">' + cname + '</a></p>'
            +   '</div>'
            + '</li>';

        }
        
        $("#employee-data").prepend($(htmlContent));

        $('a[id^="detailindex"]').click(function(e) {
          e.stopImmediatePropagation();
          e.preventDefault();
          
          employeedata.index = this.getAttribute('value');
          $.mobile.changePage('#detail_info_page');
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
    
    
    $("#myphonebook").click(function() {
      
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
        var htmlContent = "";

        for (var i=0; i<dataContent.length; i++){
          
          var company = dataContent[i].Company;
          myphonebook.company[i] = company; 

          var ename = dataContent[i].Name_EN;
          myphonebook.ename[i] = ename;

          var cname = dataContent[i].Name_CH;
          myphonebook.cname[i] = cname;

          var extnum = dataContent[i].Ext_No;
          myphonebook.extnum[i] = extnum;

          var employeeid = dataContent[i].EmployeeID;
          myphonebook.employeeid[i] = employeeid;

          var content = htmlContent
            + '<li>'
            +   '<div class="company">'
            +       '<p class="edit-checkbox">'
            +           '<input type="checkbox" class="custom" data-mini="true" name="checkbox' + i + '" id="checkbox' + i + '">'
            +       '</p>'
            +       '<p>' + company + '</p>'
            +   '</div>'
            +   '<div class="e-name">'
            +       '<p><a href="#detail_info_page" id="detailindex" >' + ename + '</a></p>'
            +       '<p><a rel="external" href="tel:+012345678" style="color:red;">9999-9999</a></p>'
            +   '</div>'
            +   '<div class="c-name">'
            +       '<p><a href="#detail_info_page" id="detailindex" >' + cname + '</a></p>'
            +   '</div>'
            + '</li>';

          htmlContent = content;
        }
        
        $("#my_phonebook_list").html(htmlContent).enhanceWithin();
        $('#my_phonebook_list').listview('refresh');
      }
    };
    
    function onQueryMyPhoneBookFail(data)
    {
      
    };
    
    //20160920 Darren
    /*
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
    };
    */

    //20160920 Darren
    /*
    $("#edit-button").click(function() {
        refreshEditMyPhonebookList();        
    });
    
    $("#select-all").click(function() {
      for (var i=0; i<myphonebook.total; i++){
        document.getElementById('checkbox'+i).checked = true; 
      }
    });
    */

    $("#phonebookDelectConfirm #cancel").on('click', function(){
        $("#phonebookEditBtn").show();
        $("#phonebookDelectConfirm").popup('close');
    });

    $("#phonebookDelectConfirm #confirm").on('click', function(){
      var finalTotal = 0;
      var finalCompany = new Array();
      var finalEname = new Array();
      var finalCname = new Array();
      var finalExtnum = new Array();
      var finalEmployeeid = new Array();
      
      
      var doDeleteCount = 0;
      var checkboxCheckedCount = $('#phonebook_page :checkbox:checked').length;
      var doRefresh = false;
       
      for (var i=0; i<myphonebook.total; i++) {
        if (document.getElementById('checkbox'+i).checked == true)
        {
          doDeleteCount++;

          if (checkboxCheckedCount === doDeleteCount)
          {
            doRefresh = true;
          }  

          deletePhoneBook(i, doRefresh);

        }
        else
        { 
          finalCompany[finalTotal] = myphonebook.company[i];
          finalEname[finalTotal] = myphonebook.ename[i];
          finalCname[finalTotal] = myphonebook.cname[i];
          finalExtnum[finalTotal] = myphonebook.extnum[i];
          finalEmployeeid[finalTotal] = myphonebook.employeeid[i];
          finalTotal++;
        }
      }
      
      myphonebook.total = finalTotal;
      for (var i=0; i<finalTotal; i++) {
        myphonebook.company[i] = finalCompany[i];
        myphonebook.ename[i] = finalEname[i];
        myphonebook.cname[i] = finalCname[i];
        myphonebook.extnum[i] = finalExtnum[i];
        myphonebook.employeeid[i] = finalEmployeeid[i];
      }
      
    });

    function deletePhoneBook(index, doRefresh)
    {
      var myemployeeid = "0208042"; // fix me !!!!!
      
      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: "http://www.qisda.com.tw/YellowPage/YellowpageForQplayAPI.asmx/DeleteMyPhoneBook",
        data: '{"strXml":"<LayoutHeader><User_EmpID>' + myemployeeid + '</User_EmpID><Delete_EmpID>' + myphonebook.employeeid[index] + '</Delete_EmpID><Delete_Company>' + myphonebook.company[index] + '</Delete_Company></LayoutHeader>"}',
        dataType: "json",
        cache: false,
        success: function(data){
            onDeleteMyPhoneBookSuccess(data, doRefresh);
        },
        error: onDeleteMyPhoneBookFail,
      });
    };
    
    function onDeleteMyPhoneBookSuccess(data, doRefresh)
    {
        if (doRefresh) {
            refreshMyPhonebookList();
        }
    };
    
    function onDeleteMyPhoneBookFail(data)
    {
      
    };

    function refreshMyPhonebookList()
    {
      
      $('#my_phonebook_list').empty();
      
      var htmlContent = "";

      for (var i=0; i<myphonebook.total; i++){
        var content = htmlContent
            + '<li>'
            +   '<div class="company">'
            +       '<p class="edit-checkbox hide">'
            +           '<input type="checkbox" name="checkbox-mini" class="custom" data-mini="true" id="checkbox' + i + '">'
            +       '</p>'
            +       '<p>' + myphonebook.company[i] + '</p>'
            +   '</div>'
            +   '<div class="e-name">'
            +       '<p><a href="#detail_info_page" id="detailindex" >' + myphonebook.ename[i] + '</a></p>'
            +       '<p><a rel="external" href="tel:+012345678" style="color:red;">9999-9999</a></p>'
            +   '</div>'
            +   '<div class="c-name">'
            +       '<p><a href="#detail_info_page" id="detailindex" >' + myphonebook.cname[i] + '</a></p>'
            +   '</div>'
            + '</li>';

        htmlContent = content;    
      }

      $("#my_phonebook_list").html(htmlContent).enhanceWithin();
      $('#my_phonebook_list').listview('refresh');

      $("#phonebookDelectConfirm").popup('close');
    };
    
    window.getSignature = function(action, signatureTime)
    {
      if (action === "getTime")
      {
        return Math.round(new Date().getTime()/1000);
      }
      else
      {
        var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
        return CryptoJS.enc.Base64.stringify(hash);
      }
    }
});

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        //20160907 Darren - start
        app.addCompanySelect();
        var args = [];
        args[0] = "LoginSuccess";
        args[1] = device.uuid;

        //window.plugins.qlogin.openCertificationPage(null, null, args);
        //Darren - end
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

        if (device.platform === "iOS")
        {
          $('.page-header, .page-main').addClass('ios-fix-overlap');
          $('.ios-fix-overlap-div').css('display','block');
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
    // add compony option in dropbox
    addCompanySelect: function()
    {
        var signatureTime = getSignature("getTime");
        var signatureInBase64 = getSignature("getInBase64", signatureTime);

        $.ajax({
          type: "POST",
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'App-Key': 'yellowpage',
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'token': rsDataFromServer.token
          },
          url: serverURL + "/qplayApi/public/index.php/v101/yellowpage/QueryCompanyData?lang=en-us&uuid=" + rsDataFromServer.uuid,
          dataType: "json",
          cache: false,
          success: app.onSuccess
      });
    },
    onSuccess: function(data)
    {
      var companySelect = document.getElementById('Company');
      var resultcode = data['ResultCode'];
      
      if (resultcode == 1 || resultcode == 1906) {
        var dataContent = data['Content'];
        for (var i=2; i<dataContent.length; i++){ // ignore 0 and 1, 0: "All Company", 1: ""
          var companyname = dataContent[i].CompanyName;
          companySelect.options[companySelect.options.length] = new Option(companyname, companyname);
        }
      }
    },
};

setTimeout(function(){
    //do check app version
    app.initialize();
}, 3000);

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
  employeeid: [],
};

var serverURL = "https://qplay.benq.com"; // QTT Outside API Server
var appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";

/*
var rsDataFromServer = {
  token: 'nullstring',
  token_valid: 'nullstring',
  uuid: 'nullstring',
  redirect: 'nullstring',
};
*/

var rsDataFromServer = {
  token: '57e4f88564b8a',
  token_valid: 'nullstring',
  uuid: 'b58ef4d9ea42943b',
  redirect: 'nullstring',
};

window.LoginSuccess = function(data)
{
  rsDataFromServer.token_valid = data['token_valid'];
  rsDataFromServer.token = data['token'];
  rsDataFromServer.uuid = data['uuid'];
  rsDataFromServer.redirect = data['redirect-uri'];
  
  app.addCompanySelect();
};
