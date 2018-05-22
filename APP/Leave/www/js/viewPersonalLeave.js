var leaveid = "", leaveType = "", agentid = "";
var beginDate = "", endDate = "", beginTime = "", endTime = "";
var viewPersonalLeaveBeforeshow = false;
var viewPersonalLeaveShow = false;
var leaveTimetab = "leaveTime-tab1";
var leaveTypeSelected = false;
var timoutQueryEmployeeData = null;
var calendarData = false;
var quickLeaveList = [];
var allLeaveList = [];
var allLeaveCategroyStr = langStr["str_122"]; //所有類別

var leaveTypeData = {
    id: "leaveType-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var agentData = {
    id: "agent-popup",
    option: [],
    title: '<input type="search" id="searchBar" />',
    //defaultText: langStr["str_069"],
    defaultText: (localStorage.getItem("agent") == null) ? langStr["str_069"] : JSON.parse(localStorage.getItem("agent"))[0],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var categroyData = {
    id: "categroy-popup",
    option: [],
    title: "",
    //defaultText: langStr["str_069"],
    defaultText: (localStorage.getItem("agent") == null) ? langStr["str_069"] : JSON.parse(localStorage.getItem("agent"))[0],
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var pleaseSelectStr = langStr["str_069"]; //請選擇
var selectBasedayStr = langStr["str_127"]; //選擇時間
var otherBasedayStr = langStr["str_141"]; //選擇其他基準日
var viewLeaveSubmitInit = false;
var timeoutQueryEmployee = null;
var timeoutChangeBegindate = null;
var timeoutChangeEnddate = null;
var selectCategory = ""; //选择的类别，可能为“所有类别”
var leaveCategory = ""; //对应假别的类别，肯定没有“所有类别”
var leaveObj = {};
var leaveDetail = {};
var leaveSelected = false;
var agentName = "";
var startLeaveDate, endLeaveDate, startLeaveDay, endLeaveDay, startLeaveTime, endLeaveTime;
var basedayList = false;
var baseday = "";
var needBaseday = false;
var leaveReason = "";
var countApplyDays = "0",
    countApplyHours = "0";

var leaveData = {
    id: "leave-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveAgentData = {
    id: "leave-agent-popup",
    option: [],
    title: '<input type="search" id="searchAgent" />',
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

//檢查是否符合預覽送簽標準
function checkLeaveBeforePreview() {
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間和结束时间 3.需要基准日的是否已选择 4.代理人必须选择
    if (leaveReason !== "" &&
        $("#leave-agent-popup option").text() !== pleaseSelectStr &&
        $('#startText').text() !== pleaseSelectStr &&
        $('#endText').text() !== pleaseSelectStr &&
        $("#leave-popup option").text() !== pleaseSelectStr) {
        //判斷基準日是否選擇
        if (needBaseday == true) {
            if ($("#chooseBaseday").text() == selectBasedayStr) {
                $('#previewBtn').removeClass('leavePreview-active-btn');
            } else {
                $('#previewBtn').addClass('leavePreview-active-btn');
            }
        } else {
            $('#previewBtn').addClass('leavePreview-active-btn');
        }

    } else {
        $('#previewBtn').removeClass('leavePreview-active-btn');
    }
}

//根据类别获取假别
function getLeaveByCategory() {
    var leaveList = [];
    leaveData["option"] = [];
    $("#leaveGenre").empty();
    $("#leave-popup-option-popup").remove();

    //类别分“所有类别”和所选３０类别
    if (selectCategory === allLeaveCategroyStr) {
        for (var i in allLeaveList) {
            var obj = {};
            obj["leaveid"] = allLeaveList[i]["leaveid"];
            obj["name"] = allLeaveList[i]["name"];
            leaveList.push(obj);
        }
    } else {
        for (var i in allLeaveList) {
            if (selectCategory === allLeaveList[i]["category"]) {
                var obj = {};
                obj["leaveid"] = allLeaveList[i]["leaveid"];
                obj["name"] = allLeaveList[i]["name"];
                leaveList.push(obj);
            }
        }
    }

    for (var i in leaveList) {
        leaveData["option"][i] = {};
        leaveData["option"][i]["value"] = leaveList[i]["leaveid"];
        leaveData["option"][i]["text"] = leaveList[i]["name"];
    }

    tplJS.DropdownList("viewPersonalLeave", "leaveGenre", "prepend", "typeB", leaveData);

    //假別一旦更改，除了類別的其他選項都需要恢復初始狀態
    $('#leaveIntroduce').empty().hide();
    $('#baseDate').hide();
    $('#uploadAttachment').hide();
    $('#divEmpty').hide();
    //更換假別對基準日有直接影響
    $("#chooseBaseday").text(selectBasedayStr);
    $("#oldBaseday").val("");
    $("#newBaseday").val("");

    leaveid = "";
    leaveType = "";
    baseday = "";
    basedayList = false;
}

$("#viewPersonalLeave").pagecontainer({
    create: function(event, ui) {


        /********************************** function *************************************/
        //快速请假页面——获取部分假别
        function getQuickLeaveList() {
            //初始化
            leaveTypeData["option"] = [];
            $("#leaveType-popup").remove();
            $("#leaveType-popup-option-placeholder").remove();
            $("#leaveType-popup-option-popup").remove();

            for (var i = 0; i < quickLeaveList.length; i++) {
                leaveTypeData["option"][i] = {};
                leaveTypeData["option"][i]["value"] = quickLeaveList[i]["leaveid"];
                leaveTypeData["option"][i]["text"] = quickLeaveList[i]["name"];
            }

            //生成快速请假dropdownlist
            tplJS.DropdownList("viewPersonalLeave", "leaveType", "prepend", "typeB", leaveTypeData);

            //清空dropdownlist后面的span
            $("#leaveType > span:nth-of-type(1)").text("");
            leaveid = "";
        }

        //请假申请页面——获取所有类别
        function getAllCategroyList() {
            //初始化
            var categroyLeave = [];
            categroyData["option"] = [];
            $("#leaveCategroy").empty();
            $("#categroy-popup-option-popup").remove();

            //循環所有類別，並去重、去空
            for (var i in allLeaveList) {
                if (categroyLeave.indexOf(allLeaveList[i]["category"]) === -1 && allLeaveList[i]["category"] !== "") {
                    categroyLeave.push(allLeaveList[i]["category"]);
                }
            }

            //添加 “所有類別” 到列表第一位
            categroyLeave.unshift(allLeaveCategroyStr);

            //循环所有类别到popup
            for (var i in categroyLeave) {
                categroyData["option"][i] = {};
                categroyData["option"][i]["value"] = categroyLeave[i];
                categroyData["option"][i]["text"] = categroyLeave[i];
            }

            //生成所有类别dropdownlist
            tplJS.DropdownList("viewPersonalLeave", "leaveCategroy", "prepend", "typeB", categroyData);

            //默認選中popup “所有類別”
            $.each($("#categroy-popup-option-list li"), function(i, item) {
                if ($(item).text() === allLeaveCategroyStr) {
                    $(item).trigger("click");
                    return false;
                }
            });
        }

        //快速请假页——选择假别查看剩余天数
        function checkLeftDaysByQuickLeave(leftdays) {
            //$("#leaveType > span:nth-of-type(1)").text("* 尚有 " + leftdays + " 天");
            $("#leaveType > span:nth-of-type(1)").text("* " + langStr["str_070"] + " " + leftdays + " " + langStr["str_071"]);
            $("input[id=leaveTime-tab1]").prop("disabled", false);
            $("input[id=leaveTime-tab1]").parent().removeClass("ui-state-disabled");

            if (leftdays < 0) {
                $("#leaveType > span:nth-of-type(1)").text("");
            } else if (leftdays >= 0 && leftdays < 0.5) {
                //var msgContent = leaveType + "只剩下 " + leftdays + " 天";
                var msgContent = leaveType + langStr["str_072"] + " " + leftdays + " " + langStr["str_071"];
                $('.leftDaysNotEnough').find('.main-paragraph').html(msgContent);
                popupMsgInit('.leftDaysNotEnough');

                $("#leaveType > span:nth-of-type(1)").text("");
                //$("#leaveType-popup option").text("請選擇");
                $("#leaveType-popup option").text(langStr["str_069"]);
                tplJS.reSizeDropdownList("leaveType-popup", "typeB");
                leaveid = "";
                leaveType = "";
                $("#leaveConfirm").addClass("btn-disable");
                $("#leaveConfirm").removeClass("btn-enable");

            } else if (leftdays >= 0.5 && leftdays < 1) {
                $("input[id=leaveTime-tab1]").prop("disabled", true);
                $("input[id=leaveTime-tab1]").parent().addClass("ui-state-disabled");
                if (leaveTimetab == "leaveTime-tab1") {
                    $("input[id=leaveTime-tab2]").trigger('click');
                    $("label[for=leaveTime-tab1]").removeClass('ui-btn-active');
                    $("label[for=leaveTime-tab2]").addClass('ui-btn-active');
                    $("label[for=leaveTime-tab3]").removeClass('ui-btn-active');
                }
            }

            if (leaveid != "" && agentid != "") {
                $("#leaveConfirm").removeClass("btn-disable");
                $("#leaveConfirm").addClass("btn-enable");
            }
            leaveTypeSelected = false;
        }

        //当无基准日假别时，呼叫API，对假别剩余天数进行判断
        function checkLeftDaysNoBasedate(leftdays) {
            //如果假别天数等于0或者小于最小请假单位(天)
            if (leftdays == 0 || (leftdays > 0 && leftdays < leaveDetail["unit"])) {
                popupMsgInit('.leaveNotEnough');
                getLeaveByCategory();
            } else {
                //desc
                if (leaveDetail["desc"] !== "") {
                    var divIntroduce = "<span>*" + leaveDetail["desc"] + "</span>";
                    $('#leaveIntroduce').empty().append(divIntroduce).show();
                } else {
                    $('#leaveIntroduce').empty().hide();
                }

                //attachment
                if (leaveDetail["attach"] === "Y") {
                    $('#uploadAttachment').show();
                } else {
                    $('#uploadAttachment').hide();
                }

                $('#baseDate').hide();
                $('#divEmpty').hide();
                needBaseday = false;
            }

        }

        //送签成功恢复初始状态
        function clearLeaveDataAfterSend() {
            //假别恢复初始状态
            getQuickLeaveList();

            //请假日期
            $("#leaveDate a:eq(0)").click();

            //请假时段
            $("#leaveTime-tab1").click();
        }

        //获取默认设置，包括所有假别、注意事项等
        window.GetDefaultSetting = function() {

            this.successCallback = function(data) {
                console.log(data);

                //如果ResultCode=1且Content>0，说明数据有更新，重新获取数据并存到local
                if (data['ResultCode'] === "1") {
                    //4.如果呼叫成功，必返回LastModified
                    var lastModifiedData = data['Content'][0]["LastModified"];
                    var defaultSetting = localStorage.getItem("leaveDefaultSetting");

                    //如果local为null，或者获取的修改时间大于本地local时间，则需要重新获取数据
                    if (defaultSetting == null || lastModifiedData > JSON.parse(defaultSetting)["LastModified"]) {
                        //1.快速请假页面——部分假别
                        var callbackData = data['Content'][0]["quickleavelist"];
                        var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                        var leaveTypeArry = $("name", htmlDom);
                        var leaveIDArry = $("leaveid", htmlDom);

                        quickLeaveList = [];
                        for (var i = 0; i < leaveTypeArry.length; i++) {
                            var obj = {};
                            obj["name"] = $(leaveTypeArry[i]).html();
                            obj["leaveid"] = $(leaveIDArry[i]).html();
                            quickLeaveList.push(obj);
                        }

                        //获取快速请假，部分假别
                        getQuickLeaveList();

                        //2.请假申请页面——所有假别
                        var allLeaveData = data['Content'][0]["Leavelist"];
                        var allLeaveDom = new DOMParser().parseFromString(allLeaveData, "text/html");
                        var leaveidArr = $("leaveid", allLeaveDom);
                        var categoryArr = $("category", allLeaveDom);
                        var nameArr = $("name", allLeaveDom);
                        var descArr = $("desc", allLeaveDom);
                        var unitArr = $("unit", allLeaveDom);
                        var basedateArr = $("basedate", allLeaveDom);
                        var attachArr = $("attach", allLeaveDom);

                        allLeaveList = [];
                        for (var i = 0; i < leaveidArr.length; i++) {
                            var leaveObject = {};
                            leaveObject["leaveid"] = $(leaveidArr[i]).html();
                            leaveObject["category"] = $(categoryArr[i]).html();
                            leaveObject["name"] = $(nameArr[i]).html();
                            leaveObject["desc"] = $(descArr[i]).html();
                            leaveObject["basedate"] = $(basedateArr[i]).html();
                            leaveObject["attach"] = $(attachArr[i]).html();
                            //统一请假最小单位(天),先转小写，再匹配子串
                            if ($(unitArr[i]).html().toLowerCase().indexOf("day") > 0) {
                                leaveObject["unit"] = parseFloat($(unitArr[i]).html().toLowerCase().replace("day", ""));
                            } else if ($(unitArr[i]).html().toLowerCase().indexOf("hour") > 0) {
                                leaveObject["unit"] = parseFloat($(unitArr[i]).html().toLowerCase().replace("hour", "")) / 8;
                            }
                            allLeaveList.push(leaveObject);
                        }

                        //获取请假申请，所有类别
                        getAllCategroyList();

                        //3.注意事項列表
                        var noticeData = data['Content'][0]["Noticelist"];
                        $("#infoContent-3").empty().append(noticeData);

                        //localStorage.setItem
                        var leaveDefault = {
                            "quickleavelist": quickLeaveList,
                            "Leavelist": allLeaveList,
                            "Noticelist": noticeData,
                            "LastModified": lastModifiedData
                        };

                        localStorage.setItem("leaveDefaultSetting", JSON.stringify(leaveDefault));
                    } else {
                        //如果ResultCode=1且Content=0，说明数据无更新，获取local数据即可
                        var leaveDefault = JSON.parse(localStorage.getItem("leaveDefaultSetting"));

                        //1.获取快速请假，部分假别
                        quickLeaveList = leaveDefault["quickleavelist"];
                        getQuickLeaveList();

                        //2.获取请假申请，所有类别
                        allLeaveList = leaveDefault["Leavelist"];
                        getAllCategroyList();

                        //3.注意事項列表
                        var noticeData = leaveDefault["Noticelist"];
                        $("#infoContent-3").empty().append(noticeData);
                    }

                }

            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPIEx("POST", true, "GetDefaultSetting", self.successCallback, self.failCallback, getDefaultSettingQueryData, "");
            }();

        };

        //根据leaveid查询假别剩余时数
        window.QueryLeftDaysData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var leftDays = $("leftdays", htmlDom);
                    var quickLeaveLeft = parseFloat($(leftDays).html());

                    //var visitedPage = visitedPageList[visitedPageList.length - 1];
                    var tab1Status = document.getElementById("tab-1").style.display;
                    var tab2Status = document.getElementById("tab-2").style.display;

                    if (tab2Status !== "none") {
                        //after custom API
                        checkLeftDaysByQuickLeave(quickLeaveLeft);
                    } else if (tab1Status == !"none") {
                        //after custom API
                        checkLeftDaysNoBasedate(quickLeaveLeft);
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPIEx("POST", true, "QueryLeftDaysData", self.successCallback, self.failCallback, queryLeftDaysData, "");
            }();
        };

        //查询员工信息（代理人查询）
        window.QueryEmployeeData = function(callback) {
            callback = callback || null;

            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") {
                    var agentList = "";
                    var tab1Status = document.getElementById("tab-1").style.display;
                    var tab2Status = document.getElementById("tab-2").style.display;
                    //如果未找到代理人，popup提示，找到代理人则生成list供用户选择
                    if (data['Content'][0] == undefined) {
                        //agentNotExist = true;
                        if (tab2Status !== "none") {
                            $("#agent-popup-option").popup("close");
                            popupMsgInit('.agentNotExist');
                        }else if (tab1Status !== "none") {
                            $("#leave-agent-popup-option").popup("close");
                            popupMsgInit('.agentDetailNotExist');
                        }
                    } else {
                        var callbackData = data['Content'][0]["result"];
                        var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                        var DepArry = $("Department", htmlDom);
                        var nameArry = $("name", htmlDom);
                        var agentIDArry = $("Empno", htmlDom);
                        for (var i = 0; i < DepArry.length; i++) {
                            if ($(agentIDArry[i]).html() !== myEmpNo) {
                                agentList += '<li class="tpl-option-msg-list" value="' + $(agentIDArry[i]).html() + '">' +
                                    '<div style="width: 25VW;"><span>' +
                                    $(DepArry[i]).html() +
                                    '</span></div>' +
                                    '<div><span>' +
                                    $(nameArry[i]).html() +
                                    '</span></div>' +
                                    '</li>';
                            }
                        }
                        
                        if (agentList != "") {
                            //var visitedPage = visitedPageList[visitedPageList.length - 1];
                            if (tab2Status !== "none") {
                                //viewPersonalLeave
                                $("#agent-popup-option-list").empty().append(agentList);
                                resizePopup("agent-popup-option");

                                $("#agent-popup-option-list").show();
                                $("#queryLoader").hide();
                            } else if (tab1Status !== "none") {
                                //viewLeaveSubmit
                                $("#leave-agent-popup-option-list").empty().append(agentList);
                                resizePopup("leave-agent-popup-option");

                                $("#leave-agent-popup-option-list").show();
                                $("#loaderQuery").hide();
                            }
                            if (callback === "CountLeaveHours") {
                                //呼叫API
                                CountLeaveHours();
                            }
                        } else {
                            if (tab2Status !== "none") {
                                $("#agent-popup-option").popup("close");
                                popupMsgInit('.agentNotExist');
                            }else if (tab1Status !== "none") {
                                $("#leave-agent-popup-option").popup("close");
                                popupMsgInit('.agentDetailNotExist');
                            }
                        }
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryEmployeeData", self.successCallback, self.failCallback, queryEmployeeData, "");
            }();
        };

        //计算请假时数
        window.CountLeaveHours = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var quickSuccess = $("success", htmlDom);

                    //如果请假时数计算成功则直接可以申请快速请假
                    if ($(quickSuccess).html() != undefined) {
                        var applyDays = $("ApplyDays", htmlDom);
                        var applyHours = $("ApplyHours", htmlDom);

                        sendLeaveApplicationData = "<LayoutHeader><empno>" +
                            myEmpNo +
                            "</empno><delegate>" +
                            agentid +
                            "</delegate><leaveid>" +
                            leaveid +
                            "</leaveid><begindate>" +
                            beginDate +
                            "</begindate><begintime>" +
                            beginTime +
                            "</begintime><enddate>" +
                            endDate +
                            "</enddate><endtime>" +
                            endTime +
                            "</endtime><datumdate></datumdate><applydays>" +
                            $(applyDays).html() +
                            "</applydays><applyhours>" +
                            $(applyHours).html() +
                            "</applyhours><reason>" +
                            leaveType +
                            "</reason><isattached>" +
                            "</isattached><attachment>" +
                            "</attachment><formid>" +
                            "</formid></LayoutHeader>";

                        //console.log(sendLeaveApplicationData);
                        //呼叫API
                        SendLeaveApplicationData();
                    } else {
                        loadingMask("hide");
                        var quickError = $("error", htmlDom);
                        var msgContent = $(quickError).html();
                        $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.applyLeaveFail');
                    }                    
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "CountLeaveHours", self.successCallback, self.failCallback, countLeaveHoursQueryData, "");
            }();
        };

        //假单送签
        window.SendLeaveApplicationData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDom);
                    if ($(success).html() != undefined) {
                        //请假成功清除内容，不包括代理人
                        clearLeaveDataAfterSend();
                        //如果送签成功，重新获取请假单列表，并跳转到“请假单查询”页，并记录代理人到local端
                        $("#leaveConfirm").addClass("btn-disable");
                        $("#leaveConfirm").removeClass("btn-enable");
                        QueryEmployeeLeaveApplyForm();
                        changePageByPanel("viewLeaveQuery");
                        $(".toast-style").fadeIn(100).delay(2000).fadeOut(100);
                        //非代理狀態時的請假送簽，才會紀錄代理人
                        if (myEmpNo === originalEmpNo) {
                            //如果快读请假申请成功，代理人信息存到local端，姓名在前，工号在后
                            localStorage.setItem("agent", JSON.stringify([$("#agent-popup option").text(), agentid]));
                            //如果快速请假送签成功，请假申请页面的代理人也要修改成当前成功的代理人
                            var options = '<option hidden>' + JSON.parse(localStorage.getItem("agent"))[0] + '</option>';
                            $("#leave-agent-popup").find("option").remove().end().append(options);
                            tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                        }
                    } else {
                        var error = $("error", htmlDom);
                        var msgContent = $(error).html();
                        $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.applyLeaveFail');
                    }

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "SendLeaveApplicationData", self.successCallback, self.failCallback, sendLeaveApplicationData, "");
            }();
        };

        //个人剩余假别资讯<LayoutHeader><EmpNo>0003023</EmpNo></LayoutHeader>
        window.QueryEmployeeLeaveInfo = function(leaveid) {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var nameArr = $("name", htmlDom);
                    var valueArr = $("value", htmlDom);

                    var leaveInfoHtml = '';
                    for (var i = 0; i < nameArr.length; i++) {
                        leaveInfoHtml += '<li>' +
                            '<div><span>' +
                            $(nameArr[i]).html() +
                            '</span></div><div><span>' +
                            $(valueArr[i]).html() +
                            '</span><span> 天</span></div></li>';
                    }

                    $("#infoContent-1 ul").empty().append(leaveInfoHtml);
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryEmployeeLeaveInfo", self.successCallback, self.failCallback, queryEmployeeLeaveInfoQueryData, "");
            }();
        };

        //当有基准日时，不需要对假别剩余天数进行判断
        function selectLeaveNeedBasedate() {
            //desc
            if (leaveDetail["desc"] !== "") {
                var divIntroduce = "<span>*" + leaveDetail["desc"] + "</span>";
                $('#leaveIntroduce').empty().append(divIntroduce).show();
            } else {
                $('#leaveIntroduce').empty().hide();
            }

            //attachment
            if (leaveDetail["attach"] === "Y") {
                $('#uploadAttachment').show();
            } else {
                $('#uploadAttachment').hide();
            }

            $('#baseDate').show();
            $('#divEmpty').show();
            needBaseday = true;

            $("#leaveDays").text("0");
            $("#leaveHours").text("0");
        }

        //查询某假别正在使用的有效基准日——<LayoutHeader><EmpNo>0409132</EmpNo><leaveid>3010</leaveid></LayoutHeader>
        window.QueryDatumDates = function() {

            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var dateArr = $("date", htmlDom);

                    //length大于0则有有效基准日列表，获取即可
                    if (dateArr.length == 0) {
                        basedayList = false;
                    } else {
                        var basedayHtml = "";
                        for (var i = 0; i < dateArr.length; i++) {
                            basedayHtml += '<div class="tpl-option-msg-list">' + formatDate($.trim($(dateArr[i]).html())) + '</div>';
                        }
                        $(".old-baseday-list").empty().append(basedayHtml);
                        $(".old-baseday-list").append('<div class="tpl-option-msg-list">' + otherBasedayStr + '</div>');

                        basedayList = true;
                    }

                    selectLeaveNeedBasedate();
                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryDatumDates", self.successCallback, self.failCallback, queryDatumDatesQueryData, "");
            }();
        };

        //選擇結束時間計算請假數
        window.CountLeaveHoursByEnd = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var leaveSuccess = $("success", htmlDom);
                    var leaveError = $("error", htmlDom);
                    var applyDays = $("ApplyDays", htmlDom);
                    var applyHours = $("ApplyHours", htmlDom);
                    countApplyDays = $(applyDays).html();
                    countApplyHours = $(applyHours).html();

                    if ($(leaveSuccess).html() != undefined) {
                        //success无提示，改变请假数即可
                        $("#leaveDays").text(countApplyDays);
                        $("#leaveHours").text(countApplyHours);
                    } else {
                        //error提示
                        var errorMsg = $(leaveError).html();
                        $('.leftDaysByLeave').find('.header-text').html(errorMsg);
                        popupMsgInit('.leftDaysByLeave');
                        //enddate
                        $("#endText").text(pleaseSelectStr);
                        $("#endDate").val("");
                        $("#leaveDays").text("0");
                        $("#leaveHours").text("0");
                    }

                    //檢查是否可以預覽送簽
                    checkLeaveBeforePreview();

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "CountLeaveHours", self.successCallback, self.failCallback, countLeaveHoursByEndQueryData, "");
            }();
        };

        //请假申请送签
        window.SendApplyLeaveData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDom);
                    if ($(success).html() != undefined) {
                        //如果送签成功，重新获取请假单列表，并跳转到“请假单查询”页，并记录代理人到local端
                        $("#backMain").click();
                        QueryEmployeeLeaveApplyForm();
                        changePageByPanel("viewLeaveQuery");
                        $("#sendLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                        //送签成功，清空申请表单
                        $("#emptyLeaveForm").trigger("click");
                        //非代理狀態時的請假送簽，才會紀錄代理人
                        if (myEmpNo === originalEmpNo) {
                            //如果快速请假申请成功，代理人信息存到local端，姓名在前，工号在后
                            localStorage.setItem("agent", JSON.stringify([$("#leave-agent-popup option").text(), agentid]));
                            //如果请假申请成功，快速请假也要带入当前代理人
                            var options = '<option hidden>' + JSON.parse(localStorage.getItem("agent"))[0] + '</option>';
                            $("#agent-popup").find("option").remove().end().append(options);
                            tplJS.reSizeDropdownList("agent-popup", "typeB");
                        }
                    } else {
                        loadingMask("hide");
                        var error = $("error", htmlDom);
                        var errorMsg = $(error).html();
                        $('.leftDaysByLeave').find('.header-text').html(errorMsg);
                        popupMsgInit('.leftDaysByLeave');
                    }

                }
            };

            this.failCallback = function(data) {
                loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "SendLeaveApplicationData", self.successCallback, self.failCallback, sendApplyLeaveQueryData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewPersonalLeave").one("pagebeforeshow", function(event, ui) {
            $("#tab-1").hide();
            $("#tab-2").show();
            $(".beingAgent").hide();
            if (lastPageID === "viewPersonalLeave") {
                //viewPersonalLeave
                tplJS.DropdownList("viewPersonalLeave", "agent", "prepend", "typeB", agentData);
                //viewLeaveSubmit
                tplJS.DropdownList("viewPersonalLeave", "leaveAgent", "prepend", "typeB", leaveAgentData);
            }
            $("label[for=viewPersonalLeave-tab-1]").removeClass('ui-btn-active');
            $("label[for=viewPersonalLeave-tab-2]").addClass('ui-btn-active');

            if (!viewPersonalLeaveBeforeshow) {
                viewPersonalLeaveBeforeshow = true;
                //第一次進入首頁檢查是否有代理人信息，有則檢查代理人是否在職
                if (localStorage.getItem("agent") !== null) {
                    queryEmployeeDetailQueryData = '<LayoutHeader><EmpNo>' +
                        myEmpNo +
                        '</EmpNo><qEmpno>' +
                        JSON.parse(localStorage.getItem("agent"))[1] +
                        '</qEmpno><qName></qName></LayoutHeader>';
                    //根据id获取代理人信息
                    QueryEmployeeDetail();
                    //如果值为空，则未找到代理人对象，代理人已离职
                    if (employeeName == "") {
                        //1.清除local
                        localStorage.removeItem("agent");
                        //2.恢复“请选择”
                        var options = '<option hidden>' + pleaseSelectStr + '</option>';
                        $("#agent-popup").find("option").remove().end().append(options);
                        tplJS.reSizeDropdownList("agent-popup", "typeB");
                        $("#leave-agent-popup").find("option").remove().end().append(options);
                        tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                        //3.popup提示
                        popupMsgInit('.agentNotExist');
                        //4.赋值
                        agentid = "";
                        agentName = "";
                    } else {
                        agentid = JSON.parse(localStorage.getItem("agent"))[1];
                        agentName = JSON.parse(localStorage.getItem("agent"))[0];
                    }

                }

                leaveid = "";
                beginTime = "08:00";
                endTime = "17:00";
            }

        });

        $("#viewPersonalLeave").on("pageshow", function(event, ui) {
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
        });

        /********************************** dom event *************************************/
        $(".page-tabs #viewPersonalLeave-tab-1").on("click", function() {
            $("#tab-1").show();
            $("#tab-2").hide();
        });

        $(".page-tabs #viewPersonalLeave-tab-2").on("click", function() {
            $("#tab-1").hide();
            $("#tab-2").show();
        });

        $("#leaveTime-tab1").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            //$("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab2]").text(langStr["str_074"]);
            //$("label[for=leaveTime-tab3]").text("下午");
            $("label[for=leaveTime-tab3]").text(langStr["str_075"]);
            leaveTimetab = "leaveTime-tab1";
        });

        $("#leaveTime-tab2").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            $("label[for=leaveTime-tab2]").text("08:00-12:00");
            //$("label[for=leaveTime-tab3]").text("下午");
            $("label[for=leaveTime-tab3]").text(langStr["str_075"]);
            leaveTimetab = "leaveTime-tab2";
        });

        $("#leaveTime-tab3").on("click", function() {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            //$("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab2]").text(langStr["str_074"]);
            $("label[for=leaveTime-tab3]").text("13:00-17:00");
            leaveTimetab = "leaveTime-tab3";
        });

        $("#leaveConfirm").on("click", function() {
            if ($("#leaveConfirm").hasClass("btn-enable")) {
                loadingMask("show");
                countLeaveHoursQueryData = "<LayoutHeader><EmpNo>" +
                    myEmpNo +
                    "</EmpNo><leaveid>" +
                    leaveid +
                    "</leaveid><begindate>" +
                    beginDate +
                    "</begindate><begintime>" +
                    beginTime +
                    "</begintime><enddate>" +
                    endDate +
                    "</enddate><endtime>" +
                    endTime +
                    "</endtime><datumdate></datumdate></LayoutHeader>";

                if (localStorage.getItem("agent") !== null) {
                    //非代理狀態，才檢查紀錄的代理人是否存在
                    if (myEmpNo === originalEmpNo) {
                        queryEmployeeData = "<LayoutHeader><EmpNo>" +
                            myEmpNo +
                            "</EmpNo><qEmpno>" +
                            JSON.parse(localStorage.getItem("agent"))[1] +
                            "</qEmpno><qName>" +
                            JSON.parse(localStorage.getItem("agent"))[0] +
                            "</qName></LayoutHeader>";
                        //呼叫API
                        QueryEmployeeData("CountLeaveHours");
                    } else {
                        CountLeaveHours();
                    }
                } else {
                    //呼叫API
                    CountLeaveHours();
                }

            }
        });

        $(document).on("keyup", "#searchBar", function(e) {
            if ($("#searchBar").val().length == 0) {
                $("#queryLoader").hide();
                $("#agent-popup-option-list").hide();
                return;
            }
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchBar").val().match(/^[A-Za-z\.]*/);
            if (searchData[0] != "") {
                searchName = searchData[0];
            } else {
                searchEmpNo = $("#searchBar").val();
            }
            queryEmployeeData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><qEmpno>" +
                searchEmpNo +
                "</qEmpno><qName>" +
                searchName +
                "</qName></LayoutHeader>";

            if (timoutQueryEmployeeData != null) {
                clearTimeout(timoutQueryEmployeeData);
                timoutQueryEmployeeData = null;
            }
            timoutQueryEmployeeData = setTimeout(function() {
                //呼叫API
                QueryEmployeeData();

                $("#queryLoader").show();
                $("#agent-popup-option-list").hide();
            }, 2000);
            if (e.which == 13) {
                $("#searchBar").blur();
            }
        });

        $(document).on("change", "#leaveType-popup", function() {
            leaveid = $(this).val();
            leaveType = $.trim($(this).text());
            leaveTypeSelected = true;
        });

        $(document).on("popupafterclose", "#leaveType-popup-option", function() {
            if (leaveTypeSelected) {
                for (var i = 0; i < quickLeaveList.length; i++) {
                    if (leaveid === quickLeaveList[i]["leaveid"]) {
                        queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                            myEmpNo +
                            "</EmpNo><leaveid>" +
                            quickLeaveList[i]["leaveid"] +
                            "</leaveid></LayoutHeader>";
                        //呼叫API
                        QueryLeftDaysData();

                    }
                }
            }
        });

        $(document).on("click", "#agent-popup-option ul li", function(e) {
            agentid = $(this).attr("value");
        });

        $(document).on("popupafterclose", "#agent-popup-option", function() {
            if (leaveid != "" && agentid != "") {
                $("#leaveConfirm").removeClass("btn-disable");
                $("#leaveConfirm").addClass("btn-enable");
            }
        });

        $(document).on("popupafteropen", "#agent-popup-option", function() {
            $("#searchBar").val("");
            $("#agent-popup-option-list").empty();

            if ($("#queryLoader").length <= 0) {
                $("#agent-popup-option-popup .ui-content").append('<img id="queryLoader" src="img/query-loader.gif" width="15" height="15" style="margin-left:45%; display:none;">');
            } else {
                $("#queryLoader").hide();
            }
        });

        function splitTime(time) {
            var regExp = /^(.*?)-(.*?)$/;
            return time.match(regExp);
        }

        $(document).on("change", "input[name=radio-choice-h-2]", function() {
            if ($(".tooltip").length > 0) {
                $(".tooltip").remove();
            }
        });

        //Leave Date scroll click
        $(document).on("click", "#leaveDate a", function() {
            $("#leaveDate a").removeClass("hover");
            $(this).addClass("hover");

            beginDate = endDate = $(this).data("value");
        });

        //選擇類別——select change
        $(document).on("change", "#categroy-popup", function() {
            //selectCategory = $.trim($(this).text()); 
            selectCategory = $(this).val();
            getLeaveByCategory();
            checkLeaveBeforePreview();
        });

        //获取所选的假别信息——select change
        $(document).on("change", "#leave-popup", function() {
            leaveid = $(this).val();
            leaveType = $.trim($(this).text());
            leaveSelected = true;
            baseday = "";
            console.log("leaveid:" + leaveid);
        });

        //點擊假別彈框關閉以後判斷是否可以預覽送簽
        $(document).on("popupafterclose", "#leave-popup-option", function() {
            if (leaveSelected) {
                for (var i in allLeaveList) {
                    if (leaveid == allLeaveList[i]["leaveid"]) {
                        //選擇假別後，獲取假別對象
                        leaveDetail = allLeaveList[i];
                        leaveCategory = allLeaveList[i]["category"];

                        //不需要基准日回传剩余天数，需要基准日回传有效基准日列表
                        if (leaveDetail["basedate"] == "N") {
                            queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //console.log(queryLeftDaysData);
                            //呼叫API
                            QueryLeftDaysData();

                        } else if (leaveDetail["basedate"] == "Y") {
                            queryDatumDatesQueryData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //呼叫API
                            QueryDatumDates();

                        }

                        return false;
                    }
                }
            }
            checkLeaveBeforePreview();
        });

        $(document).on("click", "#leave-popup-option-list li", function() {
            var self = $.trim($(this).text());
            if (editLeaveForm == true) {
                for (var i in allLeaveList) {
                    if (self == allLeaveList[i]["name"]) {
                        //選擇假別後，獲取假別對象
                        leaveDetail = allLeaveList[i];
                        leaveCategory = allLeaveList[i]["category"];
                        leaveid = allLeaveList[i]["leaveid"];

                        //不需要基准日回传剩余天数，需要基准日回传有效基准日列表
                        if (leaveDetail["basedate"] == "N") {
                            queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //console.log(queryLeftDaysData);
                            //呼叫API
                            QueryLeftDaysData();

                        } else if (leaveDetail["basedate"] == "Y") {
                            queryDatumDatesQueryData = "<LayoutHeader><EmpNo>" +
                                myEmpNo +
                                "</EmpNo><leaveid>" +
                                leaveid +
                                "</leaveid></LayoutHeader>";
                            //呼叫API
                            QueryDatumDates();

                        }

                        return false;
                    }
                }
            }
            checkLeaveBeforePreview();
        });

        //搜索代理人
        $(document).on("keyup", "#searchAgent", function(e) {
            if ($("#searchAgent").val().length == 0) {
                $("#loaderQuery").hide();
                $("#leave-agent-popup-option-list").hide();
                return;
            }
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchAgent").val().match(/^[A-Za-z\.]*/);
            if (searchData[0] != "") {
                searchName = searchData[0];
            } else {
                searchEmpNo = $("#searchAgent").val();
            }
            queryEmployeeData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><qEmpno>" +
                searchEmpNo +
                "</qEmpno><qName>" +
                searchName +
                "</qName></LayoutHeader>";
            //console.log(queryEmployeeData);
            if (timeoutQueryEmployee != null) {
                clearTimeout(timeoutQueryEmployee);
                timeoutQueryEmployee = null;
            }
            timeoutQueryEmployee = setTimeout(function() {
                QueryEmployeeData();

                $("#loaderQuery").show();
                $("#leave-agent-popup-option-list").hide();
            }, 2000);
            if (e.which == 13) {
                $("#searchAgent").blur();
            }
        });

        //點擊獲取代理人的姓名（去除代理人部門代碼）
        $(document).on("click", "#leave-agent-popup-option ul li", function(e) {
            agentid = $(this).attr("value");
            agentName = $(this).children("div").eq(1).children("span").text();
        });

        //popup打开以后生成代理人列表
        $(document).on("popupafteropen", "#leave-agent-popup-option", function() {
            $("#searchAgent").val("");
            $("#leave-agent-popup-option-list").empty();

            if ($("#loaderQuery").length <= 0) {
                $("#leave-agent-popup-option-popup .ui-content").append('<img id="loaderQuery" src="img/query-loader.gif" width="15" height="15" style="margin-left:45%; display:none;">');
            } else {
                $("#loaderQuery").hide();
            }
        });

        //代理人选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#leave-agent-popup-option", function() {
            checkLeaveBeforePreview();
        });

        $('#newBaseDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            yearEnd: '2018'
        });

        //選擇基準日，根據是否有有效基準日操作——click
        $("#selectBaseday").on("click", function() {
            if (basedayList) {
                popupMsgInit('.basedayList');
            } else {
                //datetime-local
                $('#newBaseDate').datetimepicker('show');
            }
        });
        //新基準日選擇——datetime change
        $("#newBaseDate").on("change", function() {
            baseday = ($(this).val()).substring(0, 10);
            if (baseday === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            } else {
                $("#chooseBaseday").text(baseday);
            }

            //只要换基准日，结束时间都恢复“请选择”
            $('#endText').text(pleaseSelectStr);
            $("#endDate").val("");

            checkLeaveBeforePreview();
        });

        $('#oldBaseDate').datetimepicker({
            timepicker: false,
            yearStart: '2016',
            yearEnd: '2018'
        });

        //選擇有效基準日列表——click basedaylist
        $(document).on("click", ".basedayList .old-baseday-list div", function() {
            var self = $(this).text();

            //去除所有已选择样式，并给this添加已选择样式
            $(".basedayList .old-baseday-list div").removeClass("tpl-dropdown-list-selected");
            $(this).addClass("tpl-dropdown-list-selected");

            //关闭popup
            $(".basedayList").popup("close");

            //如果點擊 “選擇其他基準日” ，則彈出datetime
            if (self === otherBasedayStr) {
                baseday = "";
                $('#oldBaseDate').datetimepicker('show');
            } else {
                baseday = self;
                $("#chooseBaseday").text(self);
            }

            //只要换基准日，结束时间都恢复“请选择”
            $('#endText').text(pleaseSelectStr);
            $("#endDate").val("");

            checkLeaveBeforePreview();
        });

        //無有效基準日選擇——datetime change
        $("#oldBaseDate").on("change", function() {
            baseday = ($(this).val()).substring(0, 10);

            if (baseday === "") {
                $("#chooseBaseday").text(selectBasedayStr);
            } else {
                $("#chooseBaseday").text(baseday);
            }

            //只要换基准日，结束时间都恢复“请选择”
            $('#endText').text(pleaseSelectStr);
            $("#endDate").val("");

            checkLeaveBeforePreview();
        });

        //關閉有效基準日列表——popup close
        $("#closeBasedayList").on("click", function() {
            $(".basedayList").popup("close");
        });

        $('#starDateTime').datetimepicker({
            step: 30,
            yearStart: '2016',
            yearEnd: '2018',
            onSelectTime: function(current_time, $input) {
                $("#starDateTime").blur();
            }
        });

        //點擊開始日期
        $("#btnStartday").on("click", function() {
            //選擇開始日期之前判斷假別是否選擇
            if (leaveid === "") {
                popupMsgInit('.categroyFirst');
            } else {
                //再判斷是否需要基準日
                if (needBaseday) {
                    //再判斷基準日是否已经选择
                    if ($("#chooseBaseday").text() !== selectBasedayStr) {
                        //$("#startDate").trigger("focus");
                        $('#starDateTime').datetimepicker('show');
                    } else {
                        popupMsgInit('.basedayFirst');
                    }
                } else {
                    $('#starDateTime').datetimepicker('show');
                }
            }
        });

        $("#starDateTime").on("blur", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            startLeaveDate = "";
            startLeaveDay = 0;
            startLeaveTime = 0;

            //開始時間是否爲空
            if (self !== "") {
                //android上日期格式:yyyy-MM-dd T hh:mm，ios上日期格式：yyyy-MM-dd T hh:mm:ss
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if (minute < 30) {
                    startLeaveDate = self.substring(0, 14) + "00";
                } else {
                    startLeaveDate = self.substring(0, 14) + "30";
                }

                //分别获取日期和时间，需要与结束时间进行比较，原则上开始时间必须小于结束时间
                startLeaveDay = parseInt(self.split(" ")[0].replace(/\//g, ""));
                startLeaveTime = parseInt(self.split(" ")[1].replace(/:/g, ""));

                $('#startText').text(startLeaveDate);

            } else {
                $('#startText').text(pleaseSelectStr);
                $("#starDateTime").val("");

            }
            //如果开始时间改变，结束时间无论如何也要清空
            $("#endText").text(pleaseSelectStr);
            $("#endDate").val("");

            //请假数恢复00
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });

        $("#startDate").on("change", function() {
            $("#startDate").blur();
        });

        $("#startDate").on("blur", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            startLeaveDate = "";
            startLeaveDay = 0;
            startLeaveTime = 0;

            //開始時間是否爲空
            if (self !== "") {
                //android上日期格式:yyyy-MM-dd T hh:mm，ios上日期格式：yyyy-MM-dd T hh:mm:ss
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if (minute < 30) {
                    startLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "00";
                } else {
                    startLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "30";
                }

                //分别获取日期和时间，需要与结束时间进行比较，原则上开始时间必须小于结束时间
                startLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                startLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                $('#startText').text(startLeaveDate);

            } else {
                $('#startText').text(pleaseSelectStr);
                $("#startDate").val("");
            }
            //如果开始时间改变，结束时间无论如何也要清空
            $("#endText").text(pleaseSelectStr);
            $("#endDate").val("");

            //请假数恢复00
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });

        $('#endDateTime').datetimepicker({
            step: 30,
            yearStart: '2016',
            yearEnd: '2018',
            onSelectTime: function(current_time, $input) {
                $("#endDateTime").blur();
            }
        });

        //點擊結束日期——datetime
        $("#btnEndday").on("click", function() {
            //点击“结束时间”只需要判断“开始时间”是否选择
            if ($("#startText").text() == pleaseSelectStr) {
                popupMsgInit('.startdayFirst');
            } else {
                $('#endDateTime').datetimepicker('show');
            }

        });

        $("#endDateTime").on("blur", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            endLeaveDate = "";
            endLeaveDay = 0;
            endLeaveTime = 0;

            //結束時間是否爲空
            if (self !== "") {
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if (minute < 30) {
                    endLeaveDate = self.substring(0, 14) + "00";
                } else {
                    endLeaveDate = self.substring(0, 14) + "30";
                }

                //分别获取日期和时间，需要与开始时间进行比较，原则上开始时间必须小于结束时间
                endLeaveDay = parseInt(self.split(" ")[0].replace(/\//g, ""));
                endLeaveTime = parseInt(self.split(" ")[1].replace(/:/g, ""));

                //結束時間必須大於開始時間
                if (startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(pleaseSelectStr);
                    $("#endDate").val("");
                    //请假数恢复0，0
                    $("#leaveDays").text("0");
                    $("#leaveHours").text("0");
                } else {
                    //loadingMask("show");
                    $('#endText').text(endLeaveDate);

                    countLeaveHoursByEndQueryData = "<LayoutHeader><EmpNo>" +
                        myEmpNo +
                        "</EmpNo><leaveid>" +
                        leaveid +
                        "</leaveid><begindate>" +
                        startLeaveDate.split(" ")[0] +
                        "</begindate><begintime>" +
                        startLeaveDate.split(" ")[1] +
                        "</begintime><enddate>" +
                        endLeaveDate.split(" ")[0] +
                        "</enddate><endtime>" +
                        endLeaveDate.split(" ")[1] +
                        "</endtime><datumdate>" +
                        ((needBaseday == true) ? baseday : '') +
                        "</datumdate></LayoutHeader>";
                    //console.log(countLeaveHoursByEndQueryData);
                    CountLeaveHoursByEnd();

                }
            } else {
                $('#endText').text(pleaseSelectStr);
                $("#endDate").val("");
                //请假数恢复00
                $("#leaveDays").text("0");
                $("#leaveHours").text("0");
            }

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });

        $("#endDate").on("change", function() {
            $("#endDate").blur();
        });

        $("#endDate").on("blur", function() {
            var self = $(this).val();
            var minute = parseInt(self.substring(14, 16));

            endLeaveDate = "";
            endLeaveDay = 0;
            endLeaveTime = 0;

            //結束時間是否爲空
            if (self !== "") {
                //分钟数小于30设为“00”,如果大于等于30设为“30”
                if (minute < 30) {
                    endLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "00";
                } else {
                    endLeaveDate = self.replace("T", " ").substring(0, 14).replace(/-/g, "/") + "30";
                }

                //分别获取日期和时间，需要与开始时间进行比较，原则上开始时间必须小于结束时间
                endLeaveDay = parseInt(self.split("T")[0].replace(/-/g, ""));
                endLeaveTime = parseInt(self.split("T")[1].replace(/:/g, ""));

                //結束時間必須大於開始時間
                if (startLeaveDay > endLeaveDay || (startLeaveDay == endLeaveDay && startLeaveTime > endLeaveTime)) {
                    //提示錯誤信息
                    popupMsgInit('.dateTimeError');
                    $('#endText').text(pleaseSelectStr);
                    $("#endDate").val("");
                    //请假数恢复0，0
                    $("#leaveDays").text("0");
                    $("#leaveHours").text("0");
                } else {
                    //loadingMask("show");
                    $('#endText').text(endLeaveDate);

                    countLeaveHoursByEndQueryData = "<LayoutHeader><EmpNo>" +
                        myEmpNo +
                        "</EmpNo><leaveid>" +
                        leaveid +
                        "</leaveid><begindate>" +
                        startLeaveDate.split(" ")[0] +
                        "</begindate><begintime>" +
                        startLeaveDate.split(" ")[1] +
                        "</begintime><enddate>" +
                        endLeaveDate.split(" ")[0] +
                        "</enddate><endtime>" +
                        endLeaveDate.split(" ")[1] +
                        "</endtime><datumdate>" +
                        ((needBaseday == true) ? baseday : '') +
                        "</datumdate></LayoutHeader>";
                    //console.log(countLeaveHoursByEndQueryData);
                    CountLeaveHoursByEnd();

                }
            } else {
                $('#endText').text(pleaseSelectStr);
                $("#endDate").val("");
                //请假数恢复00
                $("#leaveDays").text("0");
                $("#leaveHours").text("0");
            }

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        });

        function GetReason() {
            leaveReason = $.trim($("#leaveReason").val()); //review by alan

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        }

        var timeoutGetReason = null;
        //實時獲取多行文本值
        $("#leaveReason").on("keyup", function() {

            if (timeoutGetReason != null) {
                clearTimeout(timeoutGetReason);
                timeoutGetReason = null;
            }
            timeoutGetReason = setTimeout(function() {
                GetReason();
            }, 2000);

        });

        //清除請假申請
        $("#emptyLeaveForm").on("click", function() {
            //申請日期
            $('#applyDay').text(applyDay);

            //類別
            $.each($("#categroy-popup-option-list li"), function(i, item) {
                if ($(item).text() === allLeaveCategroyStr) {
                    $(item).trigger("click");
                    return false;
                }
            });

            //假別
            getLeaveByCategory();
            leaveid = "";

            //代理人不清除

            //開始時間
            $("#startText").text(pleaseSelectStr);
            $("#startDate").val("");
            startLeaveDate = "";

            //結束時間
            $("#endText").text(pleaseSelectStr);
            $("#endDate").val("");
            endLeaveDate = "";

            //請假理由
            $("#leaveReason").val("");
            leaveReason = "";

            //基準日
            $("#chooseBaseday").text(selectBasedayStr);
            $("#oldBaseday").val("");
            $("#newBaseday").val("");
            baseday = "";

            //请假数
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");
        });

        //預覽送簽按鈕
        $("#previewBtn").on("click", function() {
            GetReason();//手寫或語音輸入
            if ($('#previewBtn').hasClass('leavePreview-active-btn')) {
                //傳值到預覽頁面
                $("#applyCategroy").text(leaveCategory);
                $("#applyLeave").text(leaveType);
                $("#applyAgent").text(agentName);
                $("#applyStartday").text(startLeaveDate);
                $("#applyEndday").text(endLeaveDate);
                $("#applyReason").text(leaveReason); //review by alan
                $("#previewLeaveDays").text(countApplyDays);
                $("#previewLeaveHours").text(countApplyHours);

                $('.apply-container').hide();
                $('#viewPersonalLeave .leaveMenu').hide();
                $('.apply-preview').show();
                $('#backMain').show();
                $("#applyBtn").show();
            }
        });

        //从预览返回申请
        $("#backMain").on("click", function() {
            $('.apply-preview').hide();
            $('#backMain').hide();
            $('.apply-container').show();
            $('#viewPersonalLeave .leaveMenu').show();
            //return false;
        });

        //立即預約popup
        $("#applyBtn").on("click", function() {
            popupMsgInit('.confirmSend');
        });

        //確定送簽
        $("#confirmSendLeave").on("click", function() {
            $("#applyBtn").hide();
            loadingMask("show");
            sendApplyLeaveQueryData = '<LayoutHeader><empno>' +
                myEmpNo +
                '</empno><delegate>' +
                agentid +
                '</delegate><leaveid>' +
                leaveid +
                '</leaveid><begindate>' +
                startLeaveDate.split(" ")[0] +
                '</begindate><begintime>' +
                startLeaveDate.split(" ")[1] +
                '</begintime><enddate>' +
                endLeaveDate.split(" ")[0] +
                '</enddate><endtime>' +
                endLeaveDate.split(" ")[1] +
                '</endtime><datumdate>' +
                ((needBaseday == true) ? baseday : '') +
                '</datumdate><applydays>' +
                countApplyDays +
                '</applydays><applyhours>' +
                countApplyHours +
                '</applyhours><reason>' +
                leaveReason +
                '</reason><isattached>' +
                '</isattached><attachment>' +
                '</attachment><formid>' +
                ((editLeaveForm == false) ? '' : leaveDetailObj['formid']) +
                '</formid></LayoutHeader>';

            //console.log(sendApplyLeaveQueryData);
            //呼叫API
            SendApplyLeaveData();
        });

    }
});
