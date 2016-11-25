
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

    loadingMask("show");

    var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function(){
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });

}
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));

