
/*global variable, function*/
var appKeyOriginal = "appcalendar";
var appKey = "";
var pageList = ["viewDataInput", "viewQueryResult"];
var appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";

var employeeData = {};
var employeeSelectedIndex;
var phonebookData = {};
var prevPageID;

window.initialSuccess = function() {

    loadingMask("show");

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

        $.mobile.changePage('#viewDataInput');

    }
}