
/*global variable, function*/
var appKeyOriginal = "appcalendar";
var appKey = "appcalendar";
var pageList = ["viewDataInput", "viewQueryResult"];
var appSecretKey = "b995b55664772ba4784628c0993e3074";

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