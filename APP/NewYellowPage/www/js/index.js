
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

window.initialSuccess = function() {
//alert("initialSuccess");
    loadingMask("show");

    $.mobile.changePage('#viewDataInput');
    var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function(){
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
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