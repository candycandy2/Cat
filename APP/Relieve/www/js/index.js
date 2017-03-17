
/*global variable, function*/
var initialAppName = "Relieve";
var appKeyOriginal = "apprelieve";
var appKey = "apprelieve";
var pageList = ["viewExample"];
var appSecretKey = "00a87a05c855809a0600388425c55f0b";

var prevPageID;

window.initialSuccess = function() {

    //loadingMask("show");

    $.mobile.changePage('#viewExample');
    var APIRequest = new APIRequest();

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