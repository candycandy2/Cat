var leaveid, leaveType, agentid, beginDate, endDate, beginTime, endTime;
var viewPersonalLeaveInit = false;
var leaveTimetab = "leaveTime-tab1";
var leaveTypeSelected = false;
//var fulldayHide = false;
var timoutQueryEmployeeData = null;
var quickLeaveList = [];
var allLeaveList = [];
var allLeaveCategroyStr = "所有類別";

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

$("#viewPersonalLeave").pagecontainer({
    create: function (event, ui) {


        /********************************** function *************************************/
        //快速请假页面——获取部分假别
        function getQuickLeaveList() {
            for (var i = 0; i < quickLeaveList.length; i++) {
                leaveTypeData["option"][i] = {};
                leaveTypeData["option"][i]["value"] = quickLeaveList[i]["leaveid"];
                leaveTypeData["option"][i]["text"] = quickLeaveList[i]["name"];
            }

            //生成快速请假dropdownlist
            tplJS.DropdownList("viewPersonalLeave", "leaveType", "prepend", "typeB", leaveTypeData);
        }

        //请假申请页面——获取所有类别
        function getAllCategroyList() {
            var categroyLeave = [];

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
            tplJS.DropdownList("viewLeaveSubmit", "leaveCategroy", "prepend", "typeB", categroyData);

            //默認選中popup “所有類別”
            $.each($("#categroy-popup-option-list li"), function (i, item) {
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

                //basedate
                $("#chooseBaseday").text(selectBasedayStr);
                //$("#oldBaseday").val("");
                //$("#newBaseday").val("");
                $('#baseDate').hide();
                $('#divEmpty').hide();
                needBaseday = false;
            }

            //enddate
            //$("#endText").text(pleaseSelectStr);
            //$("#endDate").val("");
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");
        }

        //送签成功恢复初始状态
        function clearLeaveDataAfterSend() {
            //假别
            var leaveOption = '<option hidden>' + pleaseSelectStr + '</option>';
            $("#leaveType-popup").find("option").remove().end().append(agentOption);
            tplJS.reSizeDropdownList("leaveType-popup", "typeB");
            $("#leaveType-popup").next().text("");

            //请假日期
            $("#leaveDate a:eq(0)").click();

            //请假时段
            $("#leaveTime-tab1").click();
        }

        //行事历
        window.QueryCalendarData = function () {

            this.successCallback = function (data) {
                myCalendarData = {};
                myHolidayData = [];
                var leaveFlag = "3";
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["Result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var colorTagArry = $("color", htmlDom);
                    var informationTagArry = $("information", htmlDom);

                    for (var day = 1; day <= colorTagArry.length; day++) {
                        if (myCalendarData[$(colorTagArry[day - 1]).html()] === undefined) {
                            myCalendarData[$(colorTagArry[day - 1]).html()] = [];
                        }
                        myCalendarData[$(colorTagArry[day - 1]).html()].push(day);
                        myHolidayData[day] = parseCDATA($(informationTagArry[day - 1]).html());
                    }
                    if (leaveFlag in myCalendarData) {
                        for (var day in myCalendarData[leaveFlag]) {
                            $("#viewPersonalLeave-calendar #" + myCalendarData[leaveFlag][day]).parent().addClass("leave");
                        }
                    }

                }
                loadingMask("hide");
            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", true, "QueryCalendarData", self.successCallback, self.failCallback, queryCalendarData, "");
            }();
        };

        //获取默认设置，包括所有假别、注意事项等
        window.GetDefaultSetting = function () {

            this.successCallback = function (data) {
                //console.log(data);

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
                        //var noticeDom = '<p>' + noticeData + '</p>';
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
                        //var noticeDom = '<p>' + noticeData + '</p>';
                        $("#infoContent-3").empty().append(noticeData);
                    }

                }

            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", false, "GetDefaultSetting", self.successCallback, self.failCallback, getDefaultSettingQueryData, "");
            }();

        };

        //根据leaveid查询假别剩余时数
        window.QueryLeftDaysData = function () {

            this.successCallback = function (data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var leftDays = $("leftdays", htmlDom);
                    var quickLeaveLeft = parseFloat($(leftDays).html());

                    var visitedPage = visitedPageList[visitedPageList.length - 1];
                    if (visitedPage == "viewPersonalLeave") {
                        //after custom API
                        checkLeftDaysByQuickLeave(quickLeaveLeft);
                    } else if (visitedPage == "viewLeaveSubmit") {
                        //after custom API
                        checkLeftDaysNoBasedate(quickLeaveLeft);
                    }
                }
            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", true, "QueryLeftDaysData", self.successCallback, self.failCallback, queryLeftDaysData, "");
            }();
        };

        //查询员工信息（代理人查询）
        window.QueryEmployeeData = function (callback) {
            callback = callback || null;

            this.successCallback = function (data) {
                if (data['ResultCode'] === "1") {
                    var agentList = "";
                    //var agentNotExist = false;
                    //如果未找到代理人，popup提示，找到代理人则生成list供用户选择
                    if (data['Content'][0] == undefined) {
                        //agentNotExist = true;
                        $("#agent-popup-option").popup("close");
                        popupMsgInit('.agentNotExist');
                    } else {
                        var callbackData = data['Content'][0]["result"];
                        var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                        var DepArry = $("Department", htmlDom);
                        var nameArry = $("name", htmlDom);
                        var agentIDArry = $("Empno", htmlDom);
                        for (var i = 0; i < DepArry.length; i++) {
                            if ($(agentIDArry[i]).html() !== localStorage["emp_no"]) {
                                agentList += '<li class="tpl-option-msg-list" value="' + $(agentIDArry[i]).html() + "" + '">'
                                    + '<div style="width: 25VW;"><span>'
                                    + $(DepArry[i]).html()
                                    + '</span></div>'
                                    + '<div><span>'
                                    + $(nameArry[i]).html()
                                    + '</span></div>'
                                    + '</li>';
                            }
                        }

                        if (agentList != "") {
                            var visitedPage = visitedPageList[visitedPageList.length - 1];
                            if (visitedPage == "viewPersonalLeave") {
                                //viewPersonalLeave
                                $("#agent-popup-option-list").empty().append(agentList);
                                resizePopup("agent-popup-option");

                                $("#agent-popup-option-list").show();
                                $("#queryLoader").hide();
                            } else if (visitedPage == "viewLeaveSubmit") {
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
                            $("#agent-popup-option").popup("close");
                            popupMsgInit('.agentNotExist');
                        }



                        // if(agentList == "") {
                        //     agentNotExist = true;
                        // }else {

                        // }
                    }

                    // if(agentNotExist) {
                    //     $("#agent-popup-option").popup("close");
                    //     popupMsgInit('.agentNotExist');

                    //     //Clear Data
                    //     var newOption = '<option hidden>請選擇</option>';
                    //     var newOption = '<option hidden>' + langStr["str_069"] + '</option>';
                    //     //veiwPersonalLeave
                    //     $("#agent-popup").find("option").remove().end().append(newOption);
                    //     //viewLeaveSubmit
                    //     $("#leave-agent-popup").find("option").remove().end().append(newOption);
                    //     agentid = "";
                    //     window.localStorage.removeItem('agent');
                    //     setTimeout(function(){
                    //         //viewPersonalLeave
                    //         tplJS.reSizeDropdownList("agent-popup", "typeB");
                    //         //viewLeaveSubmit
                    //         tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                    //     }, 1000);
                    // }
                }
            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", true, "QueryEmployeeData", self.successCallback, self.failCallback, queryEmployeeData, "");
            }();
        };

        //计算请假时数
        window.CountLeaveHours = function () {

            this.successCallback = function (data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var quickSuccess = $("success", htmlDom);
                    var quickError = $("error", htmlDom);
                    var applyDays = $("ApplyDays", htmlDom);
                    var applyHours = $("ApplyHours", htmlDom);
                    // var quickApplyDays = $(applyDays).html();
                    // var quickApplyHours = $(applyHours).html();

                    //如果请假时数计算成功则直接可以申请快速请假
                    if ($(quickSuccess).html() != undefined) {
                        sendLeaveApplicationData = "<LayoutHeader><empno>"
                            + myEmpNo
                            + "</empno><delegate>"
                            + agentid
                            + "</delegate><leaveid>"
                            + leaveid
                            + "</leaveid><begindate>"
                            + beginDate
                            + "</begindate><begintime>"
                            + beginTime
                            + "</begintime><enddate>"
                            + endDate
                            + "</enddate><endtime>"
                            + endTime
                            + "</endtime><datumdate></datumdate><applydays>"
                            + $(applyDays).html()
                            + "</applydays><applyhours>"
                            + $(applyHours).html()
                            + "</applyhours><reason>"
                            + leaveType
                            + "</reason><isattached>"
                            + "</isattached><attachment>"
                            + "</attachment><formid>"
                            + "</formid></LayoutHeader>";

                        console.log(sendLeaveApplicationData);
                        //呼叫API
                        SendLeaveApplicationData();
                    } else {
                        var msgContent = $(quickError).html();
                        $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.applyLeaveFail');
                    }

                    loadingMask("hide");
                }
            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", true, "CountLeaveHours", self.successCallback, self.failCallback, countLeaveHoursQueryData, "");
            }();
        };

        //假单送签
        window.SendLeaveApplicationData = function () {

            this.successCallback = function (data) {
                console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];

                    // if (callbackData.indexOf("error") > 0) {
                    //     //$('.applyLeaveFail').find('.main-paragraph').html("假單送簽失敗");
                    //     $('.applyLeaveFail').find('.main-paragraph').html(langStr["str_073"]);
                    //     popupMsgInit('.applyLeaveFail');
                    // } else {
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var success = $("success", htmlDom);
                    if ($(success).html() != undefined) {
                        //如果送签成功，重新获取请假单列表，并跳转到“请假单查询”页，并记录代理人到local端
                        QueryEmployeeLeaveApplyForm();
                        changePageByPanel("viewLeaveQuery");
                        $(".toast-style").fadeIn(100).delay(2000).fadeOut(100);
                        //请假成功清除内容，不包括代理人
                        clearLeaveDataAfterSend();
                        //如果快读请假申请成功，代理人信息存到local端，姓名在前，工号在后
                        localStorage.setItem("agent", JSON.stringify([$("#agent-popup option").text(), agentid]));
                    } else {
                        var error = $("error", htmlDom);
                        var msgContent = $(error).html();
                        $('.applyLeaveFail').find('.main-paragraph').html(msgContent);
                        popupMsgInit('.applyLeaveFail');
                    }
                    // }
                    loadingMask("hide");
                }
            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", true, "SendLeaveApplicationData", self.successCallback, self.failCallback, sendLeaveApplicationData, "");
            }();
        };

        //个人剩余假别资讯<LayoutHeader><EmpNo>0003023</EmpNo></LayoutHeader>
        window.QueryEmployeeLeaveInfo = function (leaveid) {

            this.successCallback = function (data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var nameArr = $("name", htmlDom);
                    var valueArr = $("value", htmlDom);

                    var leaveInfoHtml = '';
                    for (var i = 0; i < nameArr.length; i++) {
                        leaveInfoHtml += '<li>'
                            + '<div><span>'
                            + $(nameArr[i]).html()
                            + '</span></div><div><span>'
                            + $(valueArr[i]).html()
                            + '</span><span> 天</span></div></li>';
                    }

                    $("#infoContent-1 ul").empty().append(leaveInfoHtml);
                }
            };

            this.failCallback = function (data) {
            };

            var __construct = function () {
                CustomAPI("POST", true, "QueryEmployeeLeaveInfo", self.successCallback, self.failCallback, queryEmployeeLeaveInfoQueryData, "");
            }();
        };

        function parseCDATA(data) {
            data = data.toString();
            var dataTempA = data.split("CDATA");
            var dataTempB = dataTempA[1].split("[");
            var dataTempC = dataTempB[1].split("]]");

            return dataTempC[0];
        }

        $(document).ready(function () {
            prslvsCalendar = new Calendar({
                renderTo: "#viewPersonalLeave #myCalendar",
                id: "viewPersonalLeave-calendar",
                language: "default",
                show_days: true,
                weekstartson: 0,
                markToday: true,
                markWeekend: true,
                changeDateEventListener: function (year, month) {
                    queryCalendarData = "<LayoutHeader><Year>"
                        + year
                        + "</Year><Month>"
                        + month
                        + "</Month><EmpNo>"
                        + myEmpNo
                        + "</EmpNo></LayoutHeader>";
                    //呼叫API
                    QueryCalendarData();
                },
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                }
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeave").one("pagebeforeshow", function (event, ui) {
            $("#tab-1").hide();
            $("#tab-2").show();
            if (lastPageID === "viewPersonalLeave") {
                //viewPersonalLeave
                tplJS.DropdownList("viewPersonalLeave", "agent", "prepend", "typeB", agentData);
                //viewLeaveSubmit
                tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
            }
            $("label[for=viewPersonalLeave-tab-1]").removeClass('ui-btn-active');
            $("label[for=viewPersonalLeave-tab-2]").addClass('ui-btn-active');

            if (!viewPersonalLeaveInit) {
                //第一次進入首頁檢查是否有代理人信息，有則檢查代理人是否在職
                if (localStorage.getItem("agent") !== null) {
                    queryEmployeeDetailQueryData = '<LayoutHeader><EmpNo>'
                        + myEmpNo
                        + '</EmpNo><qEmpno>'
                        + JSON.parse(localStorage.getItem("agent"))[1]
                        + '</qEmpno><qName></qName></LayoutHeader>';
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
                viewPersonalLeaveInit = true;
            }

        });

        $("#viewPersonalLeave").on("pageshow", function (event, ui) {

            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $(".page-tabs #viewPersonalLeave-tab-1").on("click", function () {
            $("#tab-1").show();
            $("#tab-2").hide();
        });

        $(".page-tabs #viewPersonalLeave-tab-2").on("click", function () {
            $("#tab-1").hide();
            $("#tab-2").show();

            // if(localStorage.getItem("agent") !== null) {
            //     queryEmployeeData = "<LayoutHeader><EmpNo>"
            //                       + myEmpNo
            //                       + "</EmpNo><qEmpno>"
            //                       + JSON.parse(localStorage.getItem("agent"))[1]
            //                       + "</qEmpno><qName>"
            //                       + JSON.parse(localStorage.getItem("agent"))[0]
            //                       + "</qName></LayoutHeader>";
            //     //呼叫API
            //     QueryEmployeeData();
            // }
        });

        $("#infoTitle-1").on("click", function () {
            if ($("#infoContent-1").css("display") === "none") {
                $("#infoContent-1").slideDown(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_up.png");
            } else if ($("#infoContent-1").css("display") === "block") {
                $("#infoContent-1").slideUp(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#infoTitle-3").on("click", function () {
            if ($("#infoContent-3").css("display") === "none") {
                $("#infoContent-3").slideDown(500);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_up.png")
            } else if ($("#infoContent-3").css("display") === "block") {
                $("#infoContent-3").slideUp(500);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_down.png")
            }
        });

        $("#leaveTime-tab1").on("click", function () {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            //$("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab2]").text(langStr["str_074"]);
            //$("label[for=leaveTime-tab3]").text("下午");
            $("label[for=leaveTime-tab3]").text(langStr["str_075"]);
            leaveTimetab = "leaveTime-tab1";
        });

        $("#leaveTime-tab2").on("click", function () {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            $("label[for=leaveTime-tab2]").text("08:00-12:00");
            //$("label[for=leaveTime-tab3]").text("下午");
            $("label[for=leaveTime-tab3]").text(langStr["str_075"]);
            leaveTimetab = "leaveTime-tab2";
        });

        $("#leaveTime-tab3").on("click", function () {
            timeArry = splitTime($(this).val());
            beginTime = timeArry[1];
            endTime = timeArry[2];
            //$("label[for=leaveTime-tab2]").text("上午");
            $("label[for=leaveTime-tab2]").text(langStr["str_074"]);
            $("label[for=leaveTime-tab3]").text("13:00-17:00");
            leaveTimetab = "leaveTime-tab3";
        });

        $("#leaveConfirm").on("click", function () {
            if ($("#leaveConfirm").hasClass("btn-enable")) {
                countLeaveHoursQueryData = "<LayoutHeader><EmpNo>"
                    + myEmpNo
                    + "</EmpNo><leaveid>"
                    + leaveid
                    + "</leaveid><begindate>"
                    + beginDate
                    + "</begindate><begintime>"
                    + beginTime
                    + "</begintime><enddate>"
                    + endDate
                    + "</enddate><endtime>"
                    + endTime
                    + "</endtime><datumdate></datumdate></LayoutHeader>";

                if (localStorage.getItem("agent") !== null) {
                    queryEmployeeData = "<LayoutHeader><EmpNo>"
                        + myEmpNo
                        + "</EmpNo><qEmpno>"
                        + JSON.parse(localStorage.getItem("agent"))[1]
                        + "</qEmpno><qName>"
                        + JSON.parse(localStorage.getItem("agent"))[0]
                        + "</qName></LayoutHeader>";
                    //呼叫API
                    QueryEmployeeData("CountLeaveHours");
                } else {
                    //呼叫API
                    CountLeaveHours();

                }

            }
        });

        $(document).on("keyup", "#searchBar", function (e) {
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
            queryEmployeeData = "<LayoutHeader><EmpNo>"
                + myEmpNo
                + "</EmpNo><qEmpno>"
                + searchEmpNo
                + "</qEmpno><qName>"
                + searchName
                + "</qName></LayoutHeader>";
            console.log(queryEmployeeData);
            if (timoutQueryEmployeeData != null) {
                clearTimeout(timoutQueryEmployeeData);
                timoutQueryEmployeeData = null;
            }
            timoutQueryEmployeeData = setTimeout(function () {
                //呼叫API
                QueryEmployeeData();

                $("#queryLoader").show();
                $("#agent-popup-option-list").hide();
            }, 2000);
            if (e.which == 13) {
                $("#searchBar").blur();
            }
        });

        $(document).on("change", "#leaveType-popup", function () {
            leaveid = $(this).val();
            leaveType = $.trim($(this).text());
            leaveTypeSelected = true;
        });

        $(document).on("popupafterclose", "#leaveType-popup-option", function () {
            if (leaveTypeSelected) {
                for (var i = 0; i < quickLeaveList.length; i++) {
                    if (leaveid === quickLeaveList[i]["leaveid"]) {
                        queryLeftDaysData = "<LayoutHeader><EmpNo>"
                            + myEmpNo
                            + "</EmpNo><leaveid>"
                            + quickLeaveList[i]["leaveid"]
                            + "</leaveid></LayoutHeader>";
                        //呼叫API
                        QueryLeftDaysData();

                    }
                }
            }
        });

        $(document).on("click", "#agent-popup-option ul li", function (e) {
            agentid = $(this).attr("value");
        });

        $(document).on("popupafterclose", "#agent-popup-option", function () {
            if (leaveid != "" && agentid != "") {
                $("#leaveConfirm").removeClass("btn-disable");
                $("#leaveConfirm").addClass("btn-enable");
            }
        });

        $(document).on("popupafteropen", "#agent-popup-option", function () {
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
            }, 0, function () {
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

        //Calendar Event
        $(document).on({
            click: function (event) {
                var isLeave = false;
                var isWeekend = false;
                var isNormal = false;
                var dayNumber = $(event.target).prop("id");
                var divWidth;
                var divWidthPX;
                var firstTdWidth;
                var calendarFirstTr = $(".QPlayCalendar").find("tr:eq(1)")[0];
                var calendarFirstTrTop = $(calendarFirstTr).position().top;
                var tooltipMarginTop = parseInt(document.documentElement.clientWidth * 1.724 / 100, 10);
                calendarFirstTrTop = parseInt(calendarFirstTrTop + tooltipMarginTop, 10);
                var clickTdTop = $(event.target).parent().position().top;
                var tooltipTop;

                //Leave
                if ($(event.target).parent().hasClass("leave")) {
                    isLeave = true;
                }

                //Weekend
                if ($(event.target).parent().hasClass("weekend")) {
                    isWeekend = true;
                }

                //Normal
                if (!isLeave && !isWeekend) {
                    isNormal = true;
                }

                if (isLeave) {
                    divWidth = "48vw";
                    firstTdWidth = "24vw";
                    divWidthPX = parseInt(document.documentElement.clientWidth * 48 / 100, 10);
                    tooltipTop = calendarFirstTrTop;
                } else if (isWeekend) {
                    divWidth = "32vw";
                    divWidthPX = parseInt(document.documentElement.clientWidth * 32 / 100, 10);
                    tooltipTop = parseInt(clickTdTop + tooltipMarginTop, 10);
                } else if (isNormal) {
                    divWidth = "25vw";
                    divWidthPX = parseInt(document.documentElement.clientWidth * 25 / 100, 10);
                    tooltipTop = parseInt(clickTdTop + tooltipMarginTop, 10);
                }

                //Tooltip position: left / right
                var dayIndexInWeek = $(event.target).parent().index(); //0,1,2,3,4,5,6
                var tooltipPosition = "right";
                var tooltipHorizontalPosition;
                var tdLeft = $(event.target).position().left;
                var tdWidth = $(event.target).width();
                var tdPaddingY = parseInt(document.documentElement.clientWidth * 1.53 / 100, 10);
                var tooltipMarginY = parseInt(document.documentElement.clientWidth * 2.81 / 100, 10);

                if (dayIndexInWeek >= 3) {
                    tooltipPosition = "left";
                }

                if (tooltipPosition === "left") {
                    tooltipHorizontalPosition = "left:" + parseInt(tdLeft - divWidthPX - tdPaddingY - tooltipMarginY, 10) + "px;";
                } else {
                    tooltipHorizontalPosition = "left:" + parseInt(tdLeft + tdWidth - tdPaddingY * 2 + tooltipMarginY, 10) + "px;";
                }

                $(".tooltip").remove();
                $("#viewPersonalLeave").append('<div class="tooltip" style="width:' + divWidth + '; top:' + tooltipTop + 'px; ' + tooltipHorizontalPosition + '">' + myHolidayData[dayNumber] + '</div>');

                if (isLeave) {
                    $(".tooltip").find("table").css({
                        "width": divWidth,
                        "line-height": "1.2"
                    });

                    $(".tooltip").find("table").each(function (index, dom) {
                        $(dom).find("td:eq(0)").css("width", firstTdWidth);
                    });
                }

            }
        }, ".QPlayCalendar");

        $(document).on("click", function (event) {
            if (!$(event.target).parent().parent().parent().parent().parent().hasClass("QPlayCalendar")) {
                if (!$(event.target).parent().parent().parent().parent().parent().hasClass("tooltip")) {
                    if ($(".tooltip").length > 0) {
                        $(".tooltip").remove();
                    }
                }
            }
        });

        $(document).on("change", "input[name=radio-choice-h-2]", function () {
            if ($(".tooltip").length > 0) {
                $(".tooltip").remove();
            }
        });

        //Leave Date scroll click
        $(document).on("click", "#leaveDate a", function () {
            $("#leaveDate a").removeClass("hover");
            $(this).addClass("hover");

            beginDate = endDate = $(this).data("value");
        });

    }
});
