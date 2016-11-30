/*global variable, function*/
var appKeyOriginal = "appyellowpage";
var appKey = "";
var pageList = ["viewReserve", "viewMyReserve", "viewSettingList", "viewNewSetting"];
var appSecretKey = "c103dd9568f8493187e02d4680e1bf2f";

// var myReserveData = {};
// var employeeSelectedIndex;
// var phonebookData = {};
var prevPageID;

window.initialSuccess = function() {

    // loadingMask("show");

    // var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function() {
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });

}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewReserve") {

        // if (checkPopupShown()) {
        //     $.mobile.changePage('#viewDataInput');
        // } else {
        //     navigator.app.exitApp();
        // }

    } else if (activePageID === "viewMyReserve") {

        // $.mobile.changePage('#viewDataInput');

    } else if (activePageID === "viewSettingList") {

        // if (checkPopupShown()) {
        //     $('#' + popupID).popup('close');
        // } else {
        //     $.mobile.changePage('#' + prevPageID);
        // }

    } else if (activePageID === "viewNewSetting") {

        // if (checkPopupShown()) {
        //     $('#' + popupID).popup('close');
        // } else {
        //     //If User is doing edit phonebook, cancel edit mode.
        //     if ($("#phonebookEditBtn").css("display") === "block") {
        //         cancelEditMode();
        //     } else {
        //         $.mobile.changePage('#viewDataInput');
        //     }
        // }

    }
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

Date.prototype.mmdd = function(symbol) {
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return (mm[1] ? mm : '0' + mm[0]) + symbol + (dd[1] ? dd : '0' + dd[0]);
};
