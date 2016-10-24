
/*global variable, function*/
var appKey = "appyellowpage";
//var appKey = "yellowpage";
var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];

var employeeData = {};
var employeeSelectedIndex;
var phonebookData = {};
var myEmpID = "1609009";
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

