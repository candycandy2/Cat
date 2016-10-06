
/*global variable, function*/
var appKey = "appyellowpage";
var pageList = ["viewDataInput", "viewQueryResult", "viewDetailInfo", "viewPhonebook"];

var employeeData = {};
var employeeSelectedIndex;
var phonebookData = {};
var myEmpID = "1609009";
var prevPageID;

window.initialSuccess = function(data) {
    //data return from [qplayApi/public/index.php/v101/qplay/login]
    if (data !== null) {
        processStorageData("setLocalStorage", data);
    }

    var companyData = new QueryCompanyData();

    $("a[name=goPrevPage]").on("click", function(){
        $.mobile.changePage('#' + prevPageID);
        prevPageID = null;
    });
}
//console.log($.mobile.pageContainer.pagecontainer("getActivePage"));

