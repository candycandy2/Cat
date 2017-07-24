var myEmpNo, leaveID, QTYholidayData, BQCholidayData, QCSholidayData;
var queryCalendarData, getDefaultSettingQueryData, queryLeftDaysData, queryEmployeeData, countLeaveHoursQueryData, sendLeaveApplicationData;
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
var lastDateOfMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
var currentYear = time.getFullYear();
var currentMonth = ((time.getMonth() + 1) < 10) ? "0"+(time.getMonth() + 1) : (time.getMonth() + 1);
var currentDate = (time.getDate() < 10) ? "0"+time.getDate() : time.getDate();
var currentDay = time.getDay();
var prslvsCalendar = {};
var holidayCalendar = {};
var myCalendarData = {};
var dayTable = {
    "1" : "(一)",
    "2" : "(二)",
    "3" : "(三)",
    "4" : "(四)",
    "5" : "(五)"
};

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    queryCalendarData = "<LayoutHeader><Year>"
                      + currentYear
                      + "</Year><Month>"
                      + currentMonth
                      + "</Month><EmpNo>"
                      + myEmpNo
                      + "</EmpNo></LayoutHeader>";
    getDefaultSettingQueryData = "<EmpNo>"+ myEmpNo +"</EmpNo>";
    QueryCalendarData();
    if (leaveTypeData["option"].length == 0) {
        GetDefaultSetting();
    }
    dateInit();
    $.mobile.changePage("#viewPersonalLeave");
    loadingMask("show");
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
    var activePageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    if (activePageID === "viewPersonalLeave") {
        if (checkPopupShown()){
            var popupID = $(".ui-popup-active")[0].children[0].id;
            $('#' + popupID).popup('close');
        } else if ($(".ui-page-active").jqmData("panel") === "open"){
            $("#mypanel").panel( "close");
        } else if ($("#viewPersonalLeaveTab :radio:checked").val() == "viewPersonalLeave-tab-2") {
            $("input[id=viewPersonalLeave-tab-1]").trigger('click');
            $("label[for=viewPersonalLeave-tab-1]").addClass('ui-btn-active');
            $("label[for=viewPersonalLeave-tab-2]").removeClass('ui-btn-active');
        } else if ($("#viewPersonalLeaveTab :radio:checked").val() == "viewPersonalLeave-tab-1") {
            navigator.app.exitApp();
        }
    } else if (activePageID === "viewHolidayCalendar") {
        if (checkPopupShown()) {
            var popupID = $(".ui-popup-active")[0].children[0].id;
            $('#' + popupID).popup('close');
        } else if ($(".ui-page-active").jqmData("panel") === "open"){
            $("#mypanel").panel( "close");
        } else {
            changePageByPanel(lastPageID);
        }
    }
}

$(document).ready(function() {
    $.getJSON("string/QTY-holiday.json", function(data) {
        QTYholidayData = data;
    });
    $.getJSON("string/BQC-holiday.json", function(data) {
        BQCholidayData = data;
    });
    $.getJSON("string/QCS-holiday.json", function(data) {
        QCSholidayData = data;
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

function dateInit() {
    var month = currentMonth;
    var date = currentDate;
    var day = currentDay;
    for(var i=1; i<=2; i++) {
        if(day > 0 && day < 6) {
            $("label[for=leaveDate-tab" + i + "]").text(month + "/" + date + " " + dayTable[day]);
            $("#leaveDate-tab" + i).val(currentYear + "/" + month + "/" + date);
            day++;
            if(day == 6) {
                day = 1;
                if((Number(date) + 3) <= lastDateOfMonth) {
                    date = ((Number(date) + 3) < 10) ? "0"+(Number(date) + 3) : (Number(date) + 3);    
                }else if((Number(date) + 3) > lastDateOfMonth) {
                    month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                    date = ((Number(date) + 3 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 3 - lastDateOfMonth) : (Number(date) + 3 - lastDateOfMonth);    
                }
            }else if((Number(date) + 1) <= lastDateOfMonth) {
                date = ((Number(date) + 1) < 10) ? "0"+(Number(date) + 1) : (Number(date) + 1);
            }else if((Number(date) + 1) > lastDateOfMonth) {
                month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                date = ((Number(date) + 1 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 1 - lastDateOfMonth) : (Number(date) + 1 - lastDateOfMonth);
            }
        }else if(day == 6) {
            day = 1;
            i = 0;
            if((Number(date) + 2) <= lastDateOfMonth) {
                date = ((Number(date) + 2) < 10) ? "0"+(Number(date) + 2) : (Number(date) + 2);    
            }else if((Number(date) + 2) > lastDateOfMonth) {
                month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                date = ((Number(date) + 2 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 2 - lastDateOfMonth) : (Number(date) + 2 - lastDateOfMonth);    
            }
        }else if(day == 0) {
            day = 1;
            i = 0;
            if((Number(date) + 1) <= lastDateOfMonth) {
                date = ((Number(date) + 1) < 10) ? "0"+(Number(date) + 1) : (Number(date) + 1);    
            }else if((Number(date) + 1) > lastDateOfMonth) {
                month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                date = ((Number(date) + 1 - lastDateOfMonth) < 10) ? "0"+(Number(date) + 1 - lastDateOfMonth) : (Number(date) + 1 - lastDateOfMonth);    
            }
        }
    }
}