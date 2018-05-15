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
    '<div class="panel-content" id="mypanelviewAgentLeave">'
    //+       '<span class="panel-text">代理請假</span>'
    +
    '<span class="panel-text">' + langStr["str_182"] + '</span>' +
    '</div>' +
    '<div class="panel-content" id="mypanelEndAgentLeave">'
    //+       '<span class="panel-text">結束代理</span>'
    +
    '<span class="panel-text">' + langStr["str_183"] + '</span>' +
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
        changePageByPanel("viewHolidayCalendar");
    });

    $("#mypanel #mypanelviewPersonalLeaveCalendar").on("click", function() {
        changePageByPanel("viewPersonalLeaveCalendar");
    });

    $("#mypanel #mypanelviewAgentLeave").on("click", function() {
        changePageByPanel("viewAgentLeave");
    });

    $("#mypanel #mypanelEndAgentLeave").on("click", function() {
        myEmpNo = originalEmpNo;
        localStorage.removeItem("leaveDefaultSetting");
        if(localStorage.getItem("leaveDefaultSetting") == null) {
            getDefaultSettingQueryData = "<LayoutHeader><EmpNo>"
                                       + myEmpNo
                                       + "</EmpNo><LastModified></LastModified></LayoutHeader>";
        } 
        GetDefaultSetting();
        //选择日期为“请选择”
        $("#startText").text(pleaseSelectStr);
        $("#endText").text(pleaseSelectStr);

        //data scroll menu
        dateInit();
        viewPersonalLeaveShow = false;
        //changepage
        changePageByPanel("viewPersonalLeave");
        //agent
        if(localStorage.getItem("agent") !== null) {
            //viewPersonalLeave
            $("#agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
            tplJS.reSizeDropdownList("agent-popup", "typeB");
            //viewLeaveSubmit
            $("#leave-agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
            tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
        }else {
            $("#agent").text(pleaseSelectStr);
            $("#leaveAgent").text(pleaseSelectStr);                   
        }
        loadingMask("show");
        // Show #mypanelviewAgentLeave 
        // Hide #mypanelEndAgentLeave
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