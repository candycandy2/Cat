var myEmpNo, leaveID, QTYholidayData, BQCholidayData, QCSholidayData, originalEmpNo;
var queryCalendarData, getDefaultSettingQueryData, queryLeftDaysData, queryEmployeeData, countLeaveHoursQueryData, sendLeaveApplicationData,
    queryEmployeeLeaveInfoQueryData;
var queryDatumDatesQueryData, countLeaveHoursByEndQueryData, sendApplyLeaveQueryData;
var queryEmployeeLeaveApplyFormQueryData, leaveApplyFormDetailQueryData, recallLeaveApplyFormQueryData, deleteLeaveApplyFormQueryData,
    sendLeaveCancelFormDataQueryData, queryEmployeeDetailQueryData;
var queryEmployeeLeaveCancelFormQueryData, leaveCancelFormDetailQueryData, recallLeaveCancelFormQueryData, deleteLeaveCancelFormQueryData,
    backLeaveFormLeaveDetailQueryData;
var lastPageID = "viewPersonalLeave";
var initialAppName = "Leave";
var appKeyOriginal = "appleave";
var appKey = "appleave";
var pageList = ["viewPanel", "viewPersonalLeave", "viewLeaveQuery", "viewBackLeaveQuery", "viewHolidayCalendar", "viewPersonalLeaveCalendar", "viewAgentLeave"];
var appSecretKey = "86883911af025422b626131ff932a4b5";
var visitedPageList = ["viewPersonalLeave"];
var htmlContent = "";
var signedStr; //"已簽核";
var withdrawedStr; //"已撤回";
var rejectedStr; //"已拒絕";
var notSignStr; //"未簽核";
var editLeaveForm = false;
var viewPersonalLeaveShow = false;

var time = new Date(Date.now());
var lastDateOfMonth = new Date(time.getFullYear(), time.getMonth() + 1, 0).getDate();
var currentYear = time.getFullYear();
var currentMonth = ((time.getMonth() + 1) < 10) ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
var currentDate = (time.getDate() < 10) ? "0" + time.getDate() : time.getDate();
var currentDay = time.getDay();
var prslvsCalendar = {};
var holidayCalendar = {};
var myCalendarData = {};
var myHolidayData = [];
var applyDay = currentYear + "/" + currentMonth + "/" + currentDate;
var dayTable = {
    "1": "(一)",
    "2": "(二)",
    "3": "(三)",
    "4": "(四)",
    "5": "(五)"
};


window.initialSuccess = function() {  
    originalEmpNo = localStorage["emp_no"];
    //暂时工号：myEmpNo = 0003023
    myEmpNo = localStorage["emp_no"];

    //默认设置GetDefaultSetting (GetUserAuthority回傳data['ResultCode'] === "1" 不執行else)
    /*if (localStorage.getItem("leaveDefaultSetting") == null) {
        getDefaultSettingQueryData = "<LayoutHeader><EmpNo>" +
            myEmpNo +
            "</EmpNo><LastModified></LastModified></LayoutHeader>";
    } else {
        var lastModified = JSON.parse(localStorage.getItem("leaveDefaultSetting"))["LastModified"];
        getDefaultSettingQueryData = "<LayoutHeader><EmpNo>" +
            myEmpNo +
            "</EmpNo><LastModified>" +
            lastModified +
            "</LastModified></LayoutHeader>";
    }
    GetDefaultSetting();
    //选择日期为“请选择”
    $("#startText").text(pleaseSelectStr);
    $("#endText").text(pleaseSelectStr); */
    //data scroll menu
    //dateInit(); 
    restartAgentLeave();
    //changepage
    $.mobile.changePage("#viewPersonalLeave");

    //agent
    if (localStorage.getItem("agent") !== null) {
        //viewPersonalLeave
        $("#agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
        tplJS.reSizeDropdownList("agent-popup", "typeB");
        //viewLeaveSubmit
        $("#leave-agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
        tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
    }

    //datetime-local max value (hard code)
    $("#startDate").attr("max", "2018-12-31T23:59");
    $("#endDate").attr("max", "2018-12-31T23:59");
    $("#leaveReason").attr("placeholder", langStr["str_090"]);
    $("#withdrawReason").attr("placeholder", langStr["str_090"]);
    $("#dispelReason").attr("placeholder", langStr["str_090"]);
    $("#signTowithdrawReason").attr("placeholder", langStr["str_090"]);

    signedStr = langStr["str_133"]; //"已簽核";
    withdrawedStr = langStr["str_136"]; //"已撤回";
    rejectedStr = langStr["str_135"]; //"已拒絕";
    notSignStr = langStr["str_134"]; //"未簽核";

    loadingMask("show");
}

function restartAgentLeave() {
    localStorage.removeItem("leaveDefaultSetting");
   //alert("1.initialSuccess Func:"+localStorage.getItem("leaveDefaultSetting"));
    //默认设置GetDefaultSetting
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
}

//[Android]Handle the back button
function onBackKeyDown() {
    //var activePageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    var activePageID = visitedPageList[visitedPageList.length - 1];
    var prePageID = visitedPageList[visitedPageList.length - 2];

    if (checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");
    } else if ($(".ui-page-active").jqmData("panel") === "open") {
        $("#mypanel").panel("close");
    } else if ($("#leaveReason").is(":focus")) {
        $("#leaveReason").blur();
    } else if ($("#withdrawReason").is(":focus")) {
        $("#withdrawReason").blur();
    } else if ($("#dispelReason").is(":focus")) {
        $("#dispelReason").blur();
    } else if ($("#signTowithdrawReason").is(":focus")) {
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
    } else if (visitedPageList.length == 1) {
        navigator.app.exitApp();
    } else {
        visitedPageList.pop();
        changePageByPanel(prePageID);
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
    if ($.mobile.activePage[0].id !== pageId) {
        loadingMask("show");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#f6f6f6");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#0f0f0f");
        lastPageID = $.mobile.activePage[0].id;
        $.mobile.changePage("#" + pageId);
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("background", "#503f81");
        $("#mypanel" + " #mypanel" + $.mobile.activePage[0].id).css("color", "#fff");
        //切换菜单才添加，back返回时不添加
        if (pageId !== visitedPageList[visitedPageList.length - 1]) {
            visitedPageList.push(pageId);
        }
    }
    $("#mypanel").panel("close");
}

function dateInit() {
    var year = currentYear;
    var month = currentMonth;
    var date = currentDate;
    var day = currentDay;
    for (var i = 1; i <= 14; i++) {
        if (day > 0 && day < 6) {
            $("#leaveDate").append('<a href="#" class="ui-link">' + month + "/" + date + " " + dayTable[day] + '</a>');
            $("#leaveDate a:last-child").data("value", year + "/" + month + "/" + date);

            day++;
            if (day == 6) {
                day = 1;
                if ((Number(date) + 3) <= lastDateOfMonth) {
                    date = ((Number(date) + 3) < 10) ? "0" + (Number(date) + 3) : (Number(date) + 3);
                } else if ((Number(date) + 3) > lastDateOfMonth) {
                    //month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                    if ((Number(month) + 1) < 10) {
                        month = "0" + (Number(month) + 1);
                    } else if ((Number(month) + 1) < 12) {
                        month = (Number(month) + 1) + "";
                    } else {
                        month = "01";
                        year = (Number(year) + 1) + "";
                    }
                    date = ((Number(date) + 3 - lastDateOfMonth) < 10) ? "0" + (Number(date) + 3 - lastDateOfMonth) : (Number(date) + 3 - lastDateOfMonth);
                }
            } else if ((Number(date) + 1) <= lastDateOfMonth) {
                date = ((Number(date) + 1) < 10) ? "0" + (Number(date) + 1) : (Number(date) + 1);
            } else if ((Number(date) + 1) > lastDateOfMonth) {
                //month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                if ((Number(month) + 1) < 10) {
                    month = "0" + (Number(month) + 1);
                } else if ((Number(month) + 1) < 12) {
                    month = (Number(month) + 1) + "";
                } else {
                    month = "01";
                    year = (Number(year) + 1) + "";
                }
                date = ((Number(date) + 1 - lastDateOfMonth) < 10) ? "0" + (Number(date) + 1 - lastDateOfMonth) : (Number(date) + 1 - lastDateOfMonth);
            }
        } else if (day == 6) {
            day = 1;
            i = 0;
            if ((Number(date) + 2) <= lastDateOfMonth) {
                date = ((Number(date) + 2) < 10) ? "0" + (Number(date) + 2) : (Number(date) + 2);
            } else if ((Number(date) + 2) > lastDateOfMonth) {
                //month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                if ((Number(month) + 1) < 10) {
                    month = "0" + (Number(month) + 1);
                } else if ((Number(month) + 1) < 12) {
                    month = (Number(month) + 1) + "";
                } else {
                    month = "01";
                    year = (Number(year) + 1) + "";
                }
                date = ((Number(date) + 2 - lastDateOfMonth) < 10) ? "0" + (Number(date) + 2 - lastDateOfMonth) : (Number(date) + 2 - lastDateOfMonth);
            }
        } else if (day == 0) {
            day = 1;
            i = 0;
            if ((Number(date) + 1) <= lastDateOfMonth) {
                date = ((Number(date) + 1) < 10) ? "0" + (Number(date) + 1) : (Number(date) + 1);
            } else if ((Number(date) + 1) > lastDateOfMonth) {
                //month = ((Number(month) + 1) < 10) ? "0"+(Number(month) + 1) : Number(month) + 1;
                if ((Number(month) + 1) < 10) {
                    month = "0" + (Number(month) + 1);
                } else if ((Number(month) + 1) < 12) {
                    month = (Number(month) + 1) + "";
                } else {
                    month = "01";
                    year = (Number(year) + 1) + "";
                }
                date = ((Number(date) + 1 - lastDateOfMonth) < 10) ? "0" + (Number(date) + 1 - lastDateOfMonth) : (Number(date) + 1 - lastDateOfMonth);
            }
        }
    }

    //$("#leaveDate a:eq(0)").addClass("hover");
    //modify by Allen
    $("#leaveDate a:eq(0)").click();
}

//格式化日期字符串：“年-月-日” —— “年/月/日”，用于日期控件值的转换
function dateFormat(dataStr) {
    var str = dataStr.split("-");

    var newArr = [];
    for (var i in str) {
        newArr.push(str[i]);
    }
    return newArr.join("/");
}

//日期格式化：“日/月/年” —— “年/月/日”，用于有效基准日列表的日期格式转换
function formatDate(str) {
    var arr = str.split("/");
    var newArr = [];
    newArr.push(arr[2]);
    newArr.push(arr[1]);
    newArr.push(arr[0]);
    return newArr.join("/");
}

//请假單列表到詳情（请假单和销假单共用）
function leaveListToDetail(btn1, btn2, btn3, state) {
    $("#viewLeaveQuery .leaveMenu").hide();
    $(".leave-query-main").hide();
    $("#backDetailList").show();
    $(".leave-query-detail-sign").show();
    if (state == null) {
        $("#" + btn1).hide();
    } else {
        $("#" + btn1).show();
    }
    $("#" + btn2).hide();
    $("#" + btn3).hide();
}

//获取签核流程（请假单和销假单共用）
function getSignFlow(arr, serial, empname, yn, date, remark) {
    for (var i = 0; i < serial.length; i++) {
        var signObj = {};
        signObj["serial"] = $(serial[i]).html();
        signObj["empname"] = $(empname[i]).html();
        signObj["yn"] = $(yn[i]).html();
        signObj["date"] = $(date[i]).html();
        signObj["remark"] = $(remark[i]).html();

        //根据签核状态判断使用什么图标
        //状态为“Y”是approved(已签核)
        if ($(yn[i]).html() == "Y") {
            signObj["icon"] = "success.png";
            signObj["statusName"] = signedStr;

            //状态为"N"是rejected(已拒绝)
        } else if ($(yn[i]).html() == "N") {
            signObj["icon"] = "reject.png";
            signObj["statusName"] = rejectedStr;

            //状态为""且日期为""，则是(未签核)
        } else if ($(yn[i]).html() == "" && $(date[i]).html() == "") {
            signObj["icon"] = "blank.png";
            signObj["statusName"] = notSignStr;

            //状态为""但日期不为""，则是(已撤销)
        } else if ($(yn[i]).html() == "" && $(date[i]).html() !== "") {
            signObj["icon"] = "withdraw.png";
            signObj["statusName"] = withdrawedStr;

            //其他任何狀態都不需要顯示，icon爲空，name爲空
        } else {
            signObj["icon"] = "blank.png";
            signObj["statusName"] = "";
        }

        arr.push(signObj);
    }
}

//签核流程动态添加（请假单和销假单共用）
function setLeaveFlowToPopup(arr, dom) {
    var flow = "";
    for (var i in arr) {
        flow += '<li class="sign-list">' +
            '<div class="sign-icon">' +
            '<img src="img/' + arr[i]["icon"] + '">' +
            '</div>' +
            '<div class="sign-name">' +
            '<div class="font-style3">' +
            '<span>' + arr[i]["empname"] + '</span>' +
            '</div>' +
            '<div class="font-style10">' +
            '<span>' + arr[i]["date"] + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="sign-state font-style3">' +
            '<span>' + arr[i]["statusName"] + '</span>' +
            '</div>' +
            '</li>';
    }

    $(dom).empty().append(flow);
}

function resizePopup(popupID) {
    var popup = $("#" + popupID);
    var popupHeight = popup.height();
    var popupHeaderHeight = $("#" + popupID + " .header").height();
    var popupFooterHeight = popup.find("div[data-role='main'] .footer").height();

    //ui-content paddint-top/padding-bottom:3.07vw
    // var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 3.07 * 2 / 100, 10);

    //Ul margin-top:2.17vw
    // var ulMarginTop = parseInt(document.documentElement.clientWidth * 2.17 / 100, 10);
    // var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop, 10);
    var popupMainHeight = "200";
    popup.find("div[data-role='main'] .main").height(popupMainHeight);

    $('#' + popupID + '-screen.in').animate({
        'overflow-y': 'hidden',
        'touch-action': 'none',
        'height': $(window).height()
    }, 0, function() {
        var top = $('#' + popupID + '-screen.in').offset().top;
        if (top < 0) {
            $('.ui-popup-screen.in').css({
                'top': Math.abs(top) + "px"
            });
        }
    });

    var viewHeight = $(window).height();
    var popupHeight = popup.outerHeight();
    var top = (viewHeight - popupHeight) / 2;
    popup.parent().css("top", top + "px");
}

function startMainPage() {
    $("#tab-1").hide();
    $("#tab-2").show();
    $("label[for=viewPersonalLeave-tab-1]").removeClass('ui-btn-active');
    $("label[for=viewPersonalLeave-tab-2]").addClass('ui-btn-active');
    if (!viewPersonalLeaveShow) {
        //个人剩余假别资讯
        queryEmployeeLeaveInfoQueryData = "<LayoutHeader><EmpNo>" + myEmpNo + "</EmpNo></LayoutHeader>";
        QueryEmployeeLeaveInfo();

        //请假单查询——获取假单列表
        queryEmployeeLeaveApplyFormQueryData = "<LayoutHeader><EmpNo>" + myEmpNo + "</EmpNo></LayoutHeader>";
        QueryEmployeeLeaveApplyForm();

        //销假单查询——获取销假单列表
        queryEmployeeLeaveCancelFormQueryData = "<LayoutHeader><EmpNo>" + myEmpNo + "</EmpNo></LayoutHeader>";
        QueryEmployeeLeaveCancelForm();

        viewPersonalLeaveShow = true;
    }
    //如果是从“假单详情（已撤回）”编辑功能跳转过来的，且该代理人不在职，popup提示重新选择代理人
    if (editLeaveForm && employeeName == "") {
        popupMsgInit('.agentNotData');
    }
    $('#applyDay').text(applyDay);
    $('#previewApplyDay').text(applyDay);
    loadingMask("hide");
}

$(document).on("click", ".agentEnd span", function(e) {
    loadingMask("show");
    myEmpNo = originalEmpNo;
    restartAgentLeave();
    //agent
    if(localStorage.getItem("agent") !== null) {
        //viewPersonalLeave
        $("#agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
        tplJS.reSizeDropdownList("agent-popup", "typeB");
        //viewLeaveSubmit
        $("#leave-agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
        tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
    }else {
        var options = '<option hidden>' + pleaseSelectStr + '</option>';
        $("#agent-popup").find("option").remove().end().append(options);
        tplJS.reSizeDropdownList("agent-popup", "typeB");
        $("#leave-agent-popup").find("option").remove().end().append(options);
        tplJS.reSizeDropdownList("leave-agent-popup", "typeB");                 
    }
    //隱藏代理OOO
    $(".agentName > span:nth-of-type(2)").text("");
    $(".beingAgent").empty().hide();
    $(".page-main").css("padding-top", "3.99vw");
    //API: GetUserAuthority 判斷有無代理權限
    $("#mypanelviewAgentLeave").show();
    //changepage 
    startMainPage();
});              
