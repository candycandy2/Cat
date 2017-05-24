/*global variable, function*/
var initialAppName = "Leave";
var appKeyOriginal = "appleave";
var appKey = "appleave";
var pageList = ["personalLeave"];
var appSecretKey = "86883911af025422b626131ff932a4b5";
var prevPageID;

window.initialSuccess = function() {
    //loadingMask("show");
    $.mobile.changePage("#personalLeave");
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
/*    if (activePageID === "viewExample") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewExample');
        } else {
            navigator.app.exitApp();
        }

    } else if (activePageID === "viewDetailInfo") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            $.mobile.changePage('#' + prevPageID);
        }
    }*/
}