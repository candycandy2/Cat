
/*global variable, function*/
var initialAppName = "Account Rate";
var appKeyOriginal = "appaccountingrate";
var appKey = "appaccountingrate";
var pageList = ["viewAccount"];
var appSecretKey = "35ee8716067626e225d38b9a97ee49f8";

var prevPageID;

window.initialSuccess = function() {
    $.mobile.changePage('#viewAccount');
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewAccount") {

        if (checkPopupShown()) {
           // $.mobile.changePage('#viewExample3');
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