/*global variable, function*/
var pageList = ["viewMain"];
var initialAppName = "CMTwo";
var appKeyOriginal = "appcmtwo";
var appKey = "appcmtwo";
var appSecretKey = "a8af829aef9dbb69bcaf740a78c45299";

window.initialSuccess = function() {
    $.mobile.changePage('#viewMain');
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
