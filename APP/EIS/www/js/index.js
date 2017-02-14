/*global variable, function*/
var initialAppName = "EIS";
var appKeyOriginal = "appeis";
var appKey = "appeis";
var pageList = ["viewHitRate", "viewMonthlyHitRate", "viewYTDHitRate"];
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

$(document).one("pagebeforeshow", function() {

    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();

    $("#mypanel #panel-header-content").on("click", function(){
        if($.mobile.activePage[0].id !== "viewHitRate") {
            loadingMask("show");
            $.mobile.changePage("#viewHitRate");
        }
        $("#mypanel").panel("close");
    });

    $("#mypanel #panel-sub-header").on("click", function(){
        if($.mobile.activePage[0].id !== "viewMonthlyHitRate") {
            loadingMask("show");
            $.mobile.changePage("#viewMonthlyHitRate");
        }
        $("#mypanel").panel("close");
    });

    $("#mypanel #panel-sub-header-content").on("click", function(){
        if($.mobile.activePage[0].id !== "viewYTDHitRate") {
            loadingMask("show");
            $.mobile.changePage("#viewYTDHitRate");
        }
        $("#mypanel").panel("close");
    });

    $(".menu-btn").on("click", function(){
        $("#mypanel").panel("open");
    });

    $("#viewHitRate").on( "swiperight", function(event){
        if($(".ui-page-active").jqmData("panel") !== "open"){
            $("#mypanel").panel( "open");
        }
    });
});

window.initialSuccess = function() {

    loadingMask("show");

    $.mobile.changePage('#viewHitRate');
    // var companyData = new QueryCompanyData();

    // $("a[name=goPrevPage]").on("click", function(){
    //     $.mobile.changePage('#' + prevPageID);
    //     prevPageID = null;
    // });
    a();
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