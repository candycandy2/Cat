
/*global variable, function*/
var initialAppName = "EIS";
var appKeyOriginal = "appeis";
var appKey = "appeis";
var pageList = ["viewMoHitRate_0","viewHitRate_1","viewQueryResult2","viewHitRate", "viewMonthlyHitRate", "viewYTDHitRate",];
var appSecretKey = "af8973de05c940f98a2c5e20b2ba649b";

var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div id="panel-header">'
        +       '<span class="panel-text" style="line-height:7.5VH;">Sales Analysis</span>'
        +   '</div>'
        +   '<div class="panel-content" id="panel-header-content">'
        +       '<span class="panel-text" style="line-height:7.5VH;">Hit Rate</span>'
        +   '</div>'
        +   '<div id="panel-sub-header">'
        +       '<span class="panel-text" style="line-height:7.5VH;">Monthly Hit Rate Trend</span>'
        +   '</div>'
        +   '<div class="panel-content" id="panel-sub-header-content">'
        +       '<span class="panel-text" style="line-height:7.5VH;">YTD Hit Rate Trend</span>'
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