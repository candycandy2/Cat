
/*global variable, function*/
var initialAppName = "ExampleAPP";
var appKeyOriginal = "appexample";
var appKey = "appexample";
var pageList = ["viewExample"];
var appSecretKey = "appexample123456789";

var prevPageID;

window.initialSuccess = function() {

    //loadingMask("show");
    //$.mobile.changePage('#viewExample');
    //var APIRequest = new APIRequest();

    $.mobile.changePage('#viewMain');
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewExample") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewExample');
        } else {
            navigator.app.exitApp();
        }

    }/* else if (activePageID === "viewDetailInfo") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            $.mobile.changePage('#' + prevPageID);
        }

    }*/
}