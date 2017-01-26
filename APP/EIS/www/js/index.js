
/*global variable, function*/
var initialAppName = "EIS";
var appKeyOriginal = "appeis";
var appKey = "appeis";
var pageList = ["viewHitRate", "viewMonthlyHitRate", "viewYTDHitRate"];
var appSecretKey = "af8973de05c940f98a2c5e20b2ba649b";

var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="push" data-theme="a" style="background-color:#cecece">'
        +   '<div id="panel-header">'
        +       '<p class="panel-text" style="line-height:7VH;">Sales Analysis</p>'
        +   '</div>'
        +   '<div>'   
        +       '<p class="panel-text" style="font-size: 3.5VW;">Hit Rate</p>'
        +   '</div>'
        +   '<div>'
        +        '<p class="panel-text" style="font-size: 3.5VW;">Monthly Hit Rate Trend</p>'
        +   '</div>'
        +   '<div>'
        +        '<p class="panel-text" style="font-size: 3.5VW;">YTD Hit Rate Trend</p>'
        +   '</div>'
        +'</div>';

window.initialSuccess = function() {

    // loadingMask("show");

    $.mobile.changePage('#viewHitRate');
    // var companyData = new QueryCompanyData();

    // $("a[name=goPrevPage]").on("click", function(){
    //     $.mobile.changePage('#' + prevPageID);
    //     prevPageID = null;
    // });

}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    // if (activePageID === "viewDataInput") {

    //     if (checkPopupShown()) {
    //         $.mobile.changePage('#viewDataInput');
    //     } else {
    //         navigator.app.exitApp();
    //     }

    // } else if (activePageID === "viewQueryResult") {

    //     doClearInputData = false;
    //     $.mobile.changePage('#viewDataInput');

    // } else if (activePageID === "viewDetailInfo") {

    //     if (checkPopupShown()) {
    //         $('#' + popupID).popup('close');
    //     } else {
    //         $.mobile.changePage('#' + prevPageID);
    //     }

    // } else if (activePageID === "viewPhonebook") {

    //     //If User is doing edit phonebook, cancel edit mode.
    //     if ($("#phonebookEditBtn").css("display") === "block") {
    //         cancelEditMode();
    //     } else if (checkPopupShown()) {
    //         if (popupID === "phonebookDelectAlert" || popupID === "phonebookDelectConfirm") {
    //             $('#' + popupID).popup('close');
    //             $("#phonebookEditBtn").show();
    //         }
    //     } else {
    //         $.mobile.changePage('#viewDataInput');
    //     }

    // }
}