
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";

var employeeData = {};
var employeeSelectedIndex;
var phonebookData = {};
var prevPageID;
var doClearInputData = false;

window.initialSuccess = function() {

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