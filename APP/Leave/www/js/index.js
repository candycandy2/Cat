var myEmpNo, leaveID, QTYholidayData, BQCholidayData, QCSholidayData;
var queryCalendarData, getDefaultSettingQueryData, queryLeftDaysData, queryEmployeeData, countLeaveHoursQueryData, sendLeaveApplicationData;
var QueryEmployeeLeaveApplyFormQueryData, LeaveApplyFormDetailQueryData, RecallLeaveApplyFormQueryData,
DeleteLeaveApplyFormQueryData, SendLeaveCancelFormDataQueryData;
var QueryEmployeeLeaveCancelFormQueryData, LeaveCancelFormDetailQueryData, RecallLeaveCancelFormQueryData, DeleteLeaveCancelFormQueryData;
var lastPageID = "viewPersonalLeave";
var initialAppName = "Leave";
var appKeyOriginal = "appleave";
var appKey = "appleave";
var pageList = ["viewPanel", "viewPersonalLeave", "viewLeaveSubmit", "viewLeaveQuery", "viewBackLeaveQuery", "viewHolidayCalendar"];
var appSecretKey = "86883911af025422b626131ff932a4b5";
var visitedPageList = ["viewPersonalLeave"];
var htmlContent = "";

var time = new Date(Date.now());
var lastDateOfMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
var currentYear = time.getFullYear();
var currentMonth = ((time.getMonth() + 1) < 10) ? "0"+(time.getMonth() + 1) : (time.getMonth() + 1);
var currentDate = (time.getDate() < 10) ? "0"+time.getDate() : time.getDate();
var currentDay = time.getDay();
var prslvsCalendar = {};
var holidayCalendar = {};
var myCalendarData = {};
var myHolidayData = [];
var applyDay = currentYear+"-"+currentMonth+"-"+currentDate;
var dayTable = {
    "1" : "(一)",
    "2" : "(二)",
    "3" : "(三)",
    "4" : "(四)",
    "5" : "(五)"
};

window.initialSuccess = function() {
    //暂时工号：myEmpNo = 0003023
    myEmpNo = localStorage["emp_no"];
    queryCalendarData = "<LayoutHeader><Year>"
                      + currentYear
                      + "</Year><Month>"
                      + currentMonth
                      + "</Month><EmpNo>"
                      + myEmpNo
                      + "</EmpNo></LayoutHeader>";
    getDefaultSettingQueryData = "<LayoutHeader><EmpNo>" + myEmpNo + "</EmpNo><LastModified></LastModified></LayoutHeader>";
    QueryEmployeeLeaveApplyFormQueryData = "<LayoutHeader><EmpNo>" + myEmpNo + "</EmpNo></LayoutHeader>";
    QueryEmployeeLeaveCancelFormQueryData = "<LayoutHeader><EmpNo>" + myEmpNo + "</EmpNo></LayoutHeader>";
    QueryCalendarData();
    if (leaveTypeData["option"].length == 0) {
        GetDefaultSetting();
    }
    dateInit();
    $.mobile.changePage("#viewPersonalLeave");
    if(localStorage.getItem("agent") !== null) {
        //viewPersonalLeave
        $("#agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
        tplJS.reSizeDropdownList("agent-popup", "typeB");
        //viewLeaveSubmit
        $("#leave-agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
        tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
    }
    loadingMask("show");
}

//[Android]Handle the back button
function onBackKeyDown() {
    //var activePageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    var activePageID = visitedPageList[visitedPageList.length-1];
    var prePageID = visitedPageList[visitedPageList.length-2];

    if(checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");
    } else if($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel("close");
    } else if ($("#leaveReason").is(":focus")){
        $("#leaveReason").blur();
    } else if ($("#withdrawReason").is(":focus")){
        $("#withdrawReason").blur();
    } else if ($("#dispelReason").is(":focus")){
        $("#dispelReason").blur();
    } else if ($("#signTowithdrawReason").is(":focus")){
        $("#signTowithdrawReason").blur();
    } else if ($("#backMain").css("display") == "inline") {
        $("#backMain").click();
    } else if ($("#backEffectPreview").css("display") == "inline") {
        $("#backEffectPreview").click();
    } else if ($("#backSignPreview").css("display") == "inline") {
        $("#backSignPreview").click();
    } else if ($("#backDetailList").css("display") == "inline") {
        $("#backDetailList").click();
    } else if ($("#backToList").css("display") == "inline") {
        $("#backToList").click();
    } else if ($("#backToSign").css("display") == "inline") {
        $("#backToSign").click();
    } else if(visitedPageList.length == 1) {
        navigator.app.exitApp();
    } else {
        visitedPageList.pop();
        changePageByPanel(prePageID);    
    }

    // if(visitedPageList.length == 1) {
    //     if (checkPopupShown()){
    //         var popupID = $(".ui-popup-active")[0].children[0].id;
    //         $('#' + popupID).popup("close");
    //     } else if ($(".ui-page-active").jqmData("panel") === "open"){
    //         $("#mypanel").panel("close");
    //     } else if ($("#viewPersonalLeaveTab :radio:checked").val() == "viewPersonalLeave-tab-1") {
    //         $("input[id=viewPersonalLeave-tab-2]").trigger('click');
    //         $("label[for=viewPersonalLeave-tab-2]").addClass('ui-btn-active');
    //         $("label[for=viewPersonalLeave-tab-1]").removeClass('ui-btn-active');
    //     } else if ($("#viewPersonalLeaveTab :radio:checked").val() == "viewPersonalLeave-tab-2") {
    //         navigator.app.exitApp();
    //     }
    // } else {
    //     var activePageID = visitedPageList[visitedPageList.length-1];
    //     var prePageID = visitedPageList[visitedPageList.length-2];

    //     if (activePageID === "viewPersonalLeave") {
    //         if (checkPopupShown()){
    //             var popupID = $(".ui-popup-active")[0].children[0].id;
    //             $('#' + popupID).popup("close");
    //         } else if ($(".ui-page-active").jqmData("panel") === "open"){
    //             $("#mypanel").panel("close");
    //         } else if ($("#viewPersonalLeaveTab :radio:checked").val() == "viewPersonalLeave-tab-1") {
    //             $("input[id=viewPersonalLeave-tab-2]").trigger('click');
    //             $("label[for=viewPersonalLeave-tab-2]").addClass('ui-btn-active');
    //             $("label[for=viewPersonalLeave-tab-1]").removeClass('ui-btn-active');
    //         } else {
    //             visitedPageList.pop();
    //             changePageByPanel(prePageID);     
    //         }
    //     } else if (activePageID === "viewLeaveSubmit") {
    //         if (checkPopupShown()) {
    //             var popupID = $(".ui-popup-active")[0].children[0].id;
    //             $('#' + popupID).popup("close");
    //         } else if ($(".ui-page-active").jqmData("panel") === "open"){
    //             $("#mypanel").panel("close");
    //         } else if ($("#leaveReason").is(":focus")){
    //             $("#leaveReason").blur();
    //         } else if ($("#backMain").css("display") == "inline") {
    //             $("#backMain").click();
    //         } else {
    //             visitedPageList.pop();
    //             changePageByPanel(prePageID);   
    //         }
    //     } else if (activePageID === "viewLeaveQuery") {
    //         if (checkPopupShown()) {
    //             var popupID = $(".ui-popup-active")[0].children[0].id;
    //             $('#' + popupID).popup("close");
    //         } else if ($(".ui-page-active").jqmData("panel") === "open"){
    //             $("#mypanel").panel( "close");
    //         } else if ($("#withdrawReason").is(":focus")){
    //             $("#withdrawReason").blur();
    //         } else if ($("#dispelReason").is(":focus")){
    //             $("#dispelReason").blur();
    //         } else if ($("#backEffectPreview").css("display") == "inline") {
    //             $("#backEffectPreview").click();
    //         } else if ($("#backSignPreview").css("display") == "inline") {
    //             $("#backSignPreview").click();
    //         } else if ($("#backDetailList").css("display") == "inline") {
    //             $("#backDetailList").click();
    //         } else {
    //             visitedPageList.pop();
    //             changePageByPanel(prePageID);    
    //         }
    //     } else if (activePageID === "viewBackLeaveQuery") {
    //         if (checkPopupShown()) {
    //             var popupID = $(".ui-popup-active")[0].children[0].id;
    //             $('#' + popupID).popup("close");
    //         } else if ($(".ui-page-active").jqmData("panel") === "open"){
    //             $("#mypanel").panel("close");
    //         } else if ($("#signTowithdrawReason").is(":focus")){
    //             $("#signTowithdrawReason").blur();
    //         } else if ($("#backToList").css("display") == "inline") {
    //             $("#backToList").click();
    //         } else if ($("#backToSign").css("display") == "inline") {
    //             $("#backToSign").click();
    //         } else {
    //             visitedPageList.pop();
    //             changePageByPanel(prePageID);        
    //         }
    //     } else if (activePageID === "viewHolidayCalendar") {
    //         if (checkPopupShown()) {
    //             var popupID = $(".ui-popup-active")[0].children[0].id;
    //             $('#' + popupID).popup("close");
    //         } else if ($(".ui-page-active").jqmData("panel") === "open"){
    //             $("#mypanel").panel("close");
    //         } else if ($("#viewHolidayCalendarTab :radio:checked").val() == "viewHolidayCalendar-tab-3") {
    //             $("input[id=viewHolidayCalendar-tab-2]").trigger('click');
    //             $("label[for=viewHolidayCalendar-tab-2]").addClass('ui-btn-active');
    //             $("label[for=viewHolidayCalendar-tab-3]").removeClass('ui-btn-active');
    //             $("label[for=viewHolidayCalendar-tab-1]").removeClass('ui-btn-active');
    //         } else if ($("#viewHolidayCalendarTab :radio:checked").val() == "viewHolidayCalendar-tab-2") {
    //             $("input[id=viewHolidayCalendar-tab-1]").trigger('click');
    //             $("label[for=viewHolidayCalendar-tab-1]").addClass('ui-btn-active');
    //             $("label[for=viewHolidayCalendar-tab-2]").removeClass('ui-btn-active');
    //             $("label[for=viewHolidayCalendar-tab-3]").removeClass('ui-btn-active');
    //         } else {
    //             visitedPageList.pop();
    //             changePageByPanel(prePageID);    
    //         }
    //     }
    // }
  
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
        //切换菜单才添加，back键不添加
        if(pageId !== visitedPageList[visitedPageList.length-1]) {
            visitedPageList.push(pageId);
        }
    }
    $("#mypanel").panel("close"); 
}

function dateInit() {
    var month = currentMonth;
    var date = currentDate;
    var day = currentDay;
    for(var i=1; i<=14; i++) {
        if(day > 0 && day < 6) {

            $("#leaveDate").append('<a href="#" class="ui-link">' + month + "/" + date + " " + dayTable[day] + '</a>');
            $("#leaveDate a:last-child").data("value", currentYear + "/" + month + "/" + date);

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

    //$("#leaveDate a:eq(0)").addClass("hover");
    //modify by Allen
    $("#leaveDate a:eq(0)").click();
}


