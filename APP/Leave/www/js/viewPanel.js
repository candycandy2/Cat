
var panel = htmlContent
        +'<div data-role="panel" id="mypanel" data-display="overlay">'
        +   '<div class="ios-fix-overlap-div"></div>'
        +   '<div class="panel-content" id="mypanelviewPersonalLeave">'
        //+       '<span class="panel-text">個人假勤</span>'
        +       '<span class="panel-text">' + langStr["str_001"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewLeaveSubmit">'
        //+       '<span class="panel-text">請假申請</span>'
        +       '<span class="panel-text">' + langStr["str_002"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewLeaveQuery">'
        //+       '<span class="panel-text">請假單查詢 / 銷假</span>'
        +       '<span class="panel-text">' + langStr["str_003"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewBackLeaveQuery">'
        //+       '<span class="panel-text">銷假單查詢</span>'
        +       '<span class="panel-text">' + langStr["str_005"] + '</span>'
        +   '</div>'
        +   '<div class="panel-content" id="mypanelviewHolidayCalendar">'
        //+       '<span class="panel-text">2017 行事曆</span>'
        +       '<span class="panel-text">' + langStr["str_006"] + '</span>'
        +   '</div>'
        +'</div>'
        +'<div class="page-mask" style="display: none;"></div>';



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
        $(".page-mask").show();
    });

    $(document).on("swipeleft", function(event) {
        if($(".ui-page-active").jqmData("panel") === "open") {
            $("#mypanel").panel("close");
            $(".page-mask").hide();
        }
    });

    $(document).on("panelbeforeclose", "#mypanel", function() {
        $(".page-mask").hide();
    });
});
