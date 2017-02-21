
/*global variable, function*/
var initialAppName = "Yellow Page";
var appKeyOriginal = "appyellowpage";
var appKey = "appyellowpage";
var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];
var appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";

var employeeData = {};
var employeeSelectedIndex;
var phonebookData = {};
var prevPageID;
var doClearInputData = false;

var tmpPopupData = "", tmpPageID = "";

window.initialSuccess = function() {
//alert("initialSuccess");
    loadingMask("show");

    $.mobile.changePage('#viewDataInput');
    var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function(){
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });

    // close number popup window for yellowpage
    $('#numPopupCloseBtn').on('click', function(){
        $('#numSelectPopupWindow').popup('close');
    });
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewDataInput") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewDataInput');
        } else {
            navigator.app.exitApp();
        }

    } else if (activePageID === "viewQueryResult") {

        doClearInputData = false;
        $.mobile.changePage('#viewDataInput');

    } else if (activePageID === "viewDetailInfo") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            $.mobile.changePage('#' + prevPageID);
        }

    } else if (activePageID === "viewPhonebook") {

        //If User is doing edit phonebook, cancel edit mode.
        if ($("#phonebookEditBtn").css("display") === "block") {
            cancelEditMode();
        } else if (checkPopupShown()) {
            if (popupID === "phonebookDelectAlert" || popupID === "phonebookDelectConfirm") {
                $('#' + popupID).popup('close');
                $("#phonebookEditBtn").show();
            }
        } else {
            $.mobile.changePage('#viewDataInput');
        }

    }
}


// popup window, if the employee has multiple num
$(document).on('click', '.chooseNumPop', function(){
    var tempMvpn = $(this).data('mvpnnum'), tempExt = $(this).data('extnum'), extTotalNum = 0;

    if (tempExt != tmpPopupData || $(this).closest('.ui-page').attr('id') != tmpPageID){
        $('#numSelectPopupWindow').find('ul').html('');
        // has mutiple ext num
        if ($(this).hasClass('extNumMore')){
            extTotalNum = tempExt.match(/;/igm).length + 1;
            for (var i = 0; i < extTotalNum; i++){
                appendNum($(this).data('extnum' + (i+1)));
            }
        }

        // has mvpn num
        if ($(this).hasClass('mvpnNum')){
            appendNum(tempMvpn);
        }
        tmpPopupData = tempExt;
        tmpPageID = $(this).closest('.ui-page').attr('id');
    }

    $('#numSelectPopupWindow').popup();
    $('#numSelectPopupWindow').show();
    $('#numSelectPopupWindow').popup('open');
});

function appendNum(num){
    $('#numSelectPopupWindow').find('ul').append('<li><img src="img/phone.png" style="width:4vw; height:auto;"><span>' + 
            "<a href='tel:" + num + "' style='text-decoration: none; font-weight: normal;'>" + num + "</a>"
         + '</span></li>');
}