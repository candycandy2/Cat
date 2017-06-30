var currentYear, prslvsCalendar, holidayCalendar, holidayData, holidayList;
var personalLeaveDateExist = true;
var lastPageID = "viewPersonalLeave";
var initialAppName = "Leave";
var appKeyOriginal = "appleave";
var appKey = "appleave";
var pageList = ["viewPersonalLeave", "viewLeaveSubmit", "viewLeaveQuery", "viewBackLeaveQuery", "viewHolidayCalendar"];
var appSecretKey = "86883911af025422b626131ff932a4b5";
var htmlContent = "";
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay" style="background-color:#cecece; box-shadow:0 0 0;">'
        +   '<div class="panel-content" id="mypanelviewPersonalLeave">'
        +       '<span class="panel-text" style="line-height:7.5VH;">個人假勤</span>'
        +   '</div>'
        // +   '<div class="panel-content" id="mypanelviewLeaveSubmit">'
        // +       '<span class="panel-text" style="line-height:7.5VH;">請假申請</span>'
        // +   '</div>'
        // +   '<div class="panel-content" id="mypanelviewLeaveQuery">'
        // +       '<span class="panel-text" style="line-height:7.5VH;">請假單查詢 / 銷假</span>'
        // +   '</div>'
        // +   '<div class="panel-content" id="mypanelviewBackLeaveQuery">'
        // +       '<span class="panel-text" style="line-height:7.5VH;">銷假單查詢</span>'
        // +   '</div>'
        +   '<div class="panel-content" id="mypanelviewHolidayCalendar">'
        +       '<span class="panel-text" style="line-height:7.5VH;">2017 行事曆</span>'
        +   '</div>'
        +'</div>';
var time = new Date(Date.now());

window.initialSuccess = function() {
    loadingMask("show");
    currentYear = time.getFullYear();
    $.mobile.changePage("#viewPersonalLeave");
}

$(document).one("pagebeforeshow", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewPersonalLeave").css("background", "#503f81");
    $("#mypanel #mypanelviewPersonalLeave").css("color", "#fff");

    $("#mypanel #mypanelviewPersonalLeave").on("click", function() {
        changePageByPanel("viewPersonalLeave");
    });

    $("#mypanel #mypanelviewLeaveSubmit").on("click", function() {
        changePageByPanel("viewLeaveSubmit");
    });

    $("#mypanel #mypanelviewLeaveQuery").on("click", function() {
        changePageByPanel("viewLeaveQuery");
    });

    $("#mypanel #mypanelviewBackLeaveQuery").on("click", function() {
        changePageByPanel("viewBackLeaveQuery");
    });

    $("#mypanel #mypanelviewHolidayCalendar").on("click", function() {
        changePageByPanel("viewHolidayCalendar");
    });

    $(".menu-btn").on("click", function() {
        $("#mypanel").panel("open");
    });

    $(document).on("swiperight", function(event) {
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
$(document).ready(function() {
    $.getJSON("string/holiday.json", function(data) {
        holidayData = data;
    });
});

function changePageByPanel(pageId) {
    if($.mobile.activePage[0].id !== pageId) {
        loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
    }
    $("#mypanel").panel("close");
}