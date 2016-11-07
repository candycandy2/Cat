
/*global variable, function*/
var appKey = "appyellowpage";
var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];

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
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));

