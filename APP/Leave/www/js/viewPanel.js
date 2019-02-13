var panel = htmlContent +
    '<div data-role="panel" id="mypanel" data-display="overlay">' +
    '<div class="ios-fix-overlap-div"></div>' +
    '<div class="panel-content" id="mypanelviewPersonalLeave">'
    //+       '<span class="panel-text">請假申請</span>'
    +
    '<span class="panel-text">' + langStr["str_002"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewPersonalLeaveCalendar">'
    //+       '<span class="panel-text">個人假勤</span>'
    +
    '<span class="panel-text">' + langStr["str_001"] + '</span>' +
    '</div>'
    /*+   '<div class="panel-content" id="mypanelviewLeaveSubmit">'
    //+       '<span class="panel-text">請假申請</span>'
    +       '<span class="panel-text">' + langStr["str_002"] + '</span>'
    +   '</div>'*/
    +
    '<div class="panel-content" id="mypanelviewLeaveQuery">'
    //+       '<span class="panel-text">請假單查詢 / 銷假</span>'
    +
    '<span class="panel-text">' + langStr["str_003"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewBackLeaveQuery">'
    //+       '<span class="panel-text">銷假單查詢</span>'
    +
    '<span class="panel-text">' + langStr["str_005"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewHolidayCalendar">'
    //+       '<span class="panel-text">2017 行事曆</span>'
    +
    '<span class="panel-text">' + langStr["str_006"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewLeaveAgent">'
    //+       '<span class="panel-text">代理請假</span>'
    +
    '<span class="panel-text">' + langStr["str_182"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewLeaveClockin">'
    //+       '<span class="panel-text">補刷卡申請</span>'
    +
    '<span class="panel-text">' + langStr["str_189"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewOvertimeSubmit">'
    //+       '<span class="panel-text">加班申請</span>'
    +
    '<span class="panel-text">' + langStr["str_199"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelviewOvertimeQuery">'
    //+       '<span class="panel-text">加班查詢/時數登入</span>'
    +
    '<span class="panel-text">' + langStr["str_207"] + '</span>' +
    '</div>' +
    '</div>' +
    '<div class="page-mask" style="display: none;"></div>';

$(document).one("pagebeforeshow", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
    $("#mypanel #mypanelviewPersonalLeave").css("background", "#503f81");
    $("#mypanel #mypanelviewPersonalLeave").css("color", "#fff");

    if (device.platform === "iOS") {
        $("#mypanelviewPersonalLeave").css("margin-top", "20px");
        $(".page-mask").css("top", "20px");
    }

    $("#mypanel #mypanelviewPersonalLeave").on("click", function() {
        changePageByPanel("viewPersonalLeave");
    });

    $("#mypanel #mypanelviewLeaveSubmit").on("click", function() {
        editLeaveForm = false;
        changePageByPanel("viewLeaveSubmit");
    });

    $("#mypanel #mypanelviewLeaveQuery").on("click", function() {
        changePageByPanel("viewLeaveQuery");
    });

    $("#mypanel #mypanelviewBackLeaveQuery").on("click", function() {
        changePageByPanel("viewBackLeaveQuery");
    });

    $("#mypanel #mypanelviewHolidayCalendar").on("click", function() {
        //changePageByPanel("viewHolidayCalendar");
        checkWidgetPage('viewHolidayCalendar', visitedPageList);
    });

    $("#mypanel #mypanelviewPersonalLeaveCalendar").on("click", function() {
        changePageByPanel("viewPersonalLeaveCalendar");
    });

    $("#mypanel #mypanelviewLeaveAgent").on("click", function() {
        //changePageByPanel("viewAgentLeave");
        checkWidgetPage('viewLeaveAgent', visitedPageList);
    });

    $("#mypanel #mypanelviewLeaveClockin").on("click", function() {
        //changePageByPanel("viewClockin");
        checkWidgetPage('viewLeaveClockin', visitedPageList);
    });

    $("#mypanel #mypanelviewOvertimeSubmit").on("click", function() {
        //changePageByPanel("viewOvertimeSubmit");
        checkWidgetPage('viewOvertimeSubmit', visitedPageList);
    });

    $("#mypanel #mypanelviewOvertimeQuery").on("click", function() {
        //changePageByPanel("viewOvertimeQuery");
        checkWidgetPage('viewOvertimeQuery', visitedPageList);
    });

    $(".menu-btn .leaveMenu").on("click", function() {
        $("#mypanel").panel("open");
        $(".page-mask").show();
    });

    $(document).on("swipeleft", function(event) {
        if ($(".ui-page-active").jqmData("panel") === "open") {
            $("#mypanel").panel("close");
            $(".page-mask").hide();
        }
    });

    $(document).on("panelbeforeclose", "#mypanel", function() {
        $(".page-mask").hide();
    });
});