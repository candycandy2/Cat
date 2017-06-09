
/*global variable, function*/
var pageList = ["viewMain","viewTalk"];
var appKeyOriginal = "appcm";
var appKey = "appcm";
var appSecretKey = "afa13d886116cc148780397ea9767dbe";

window.initialSuccess = function() {

    //loadingMask("show");

    $.mobile.changePage('#viewMain');
    var APIRequest = new APIRequest();
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewMain") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewMain');
        } else {
            navigator.app.exitApp();
        }
    }
}
