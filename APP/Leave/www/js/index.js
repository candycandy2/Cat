var currentYear;
var personalLeaveDateExist = true;
var lastPageID = "viewPersonalLeave";
var initialAppName = "Leave";
var appKeyOriginal = "appleave";
var appKey = "appleave";
var pageList = ["viewPersonalLeave", "viewLeaveSubmit", "viewLeaveQuery", "viewBackLeaveQuery", "viewCalendar"];
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
        +   '<div class="panel-content" id="mypanelviewCalendar">'
        +       '<span class="panel-text" style="line-height:7.5VH;">2017 行事曆</span>'
        +   '</div>'
        +'</div>';

var time = new Date(Date.now());
var monTable = {
    '1' : "一月.",
    '2' : "二月.",
    '3' : "三月.",
    '4' : "四月.",
    '5' : "五月.",
    '6' : "六月.",
    '7' : "七月.",
    '8' : "八月.",
    '9' : "九月.",
    '10' : "十月.",
    '11' : "十一月.",
    '12' : "十二月.",
};

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

    $("#mypanel #mypanelviewCalendar").on("click", function() {
        changePageByPanel("viewCalendar");
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