/*global variable, function*/
var initialAppName = "Leave";
var appKeyOriginal = "appleave";
var appKey = "appleave";
var pageList = ["viewPersonalLeave", "viewCalendar"];
var appSecretKey = "86883911af025422b626131ff932a4b5";
var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div class="panel-content" id="mypanelPersonalLeave">'
        +       '<span class="panel-text" style="line-height:7.5VH;">個人假勤</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelLeaveSubmit">'
        +       '<span class="panel-text" style="line-height:7.5VH;">請假申請</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelLeaveQuery">'
        +       '<span class="panel-text" style="line-height:7.5VH;">請假單查詢 / 銷假</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelBackLeaveQuery">'
        +       '<span class="panel-text" style="line-height:7.5VH;">銷假單查詢</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelCalendar">'
        +       '<span class="panel-text" style="line-height:7.5VH;">2017 行事曆</span>'
        +   '</div>'
        +'</div>';

window.initialSuccess = function() {
    //loadingMask("show");
    $.mobile.changePage("#personalLeave");
}

$(document).one("pagebeforeshow", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelPersonalLeave").css("background", "#503f81");
    $("#mypanel #mypanelPersonalLeave").css("color", "#fff");

    // $("#mypanel #mypanelviewHitRate").on("click", function() {
    //     changePageByPanel("viewHitRate");
    // });

    // $("#mypanel #mypanelviewMonthlyHitRate").on("click", function() {
    //     changePageByPanel("viewMonthlyHitRate");
    // });

    // $("#mypanel #mypanelviewYTDHitRate").on("click", function() {
    //     changePageByPanel("viewYTDHitRate");
    // });

    $(".menu-btn").on("click", function() {
        $("#mypanel").panel("open");
    });

    $("#personalLeave").on("swiperight", function(event) {
        if($(".ui-page-active").jqmData("panel") !== "open") {
            $("#mypanel").panel( "open");
        }
    });
});

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
/*    if (activePageID === "viewExample") {
        if (checkPopupShown()) {
            $.mobile.changePage('#viewExample');
        } else {
            navigator.app.exitApp();
        }
    } else if (activePageID === "viewDetailInfo") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            $.mobile.changePage('#' + prevPageID);
        }
    }*/
}