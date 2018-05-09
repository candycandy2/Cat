var leaveRevokeStr = langStr["str_157"]; //銷假申請
var leaveQueryStr = langStr["str_078"]; //假單查詢
var viewLeaveQueryInit = false;
var formSigning = langStr["str_147"]; //"表單簽核中";
var formRefused = langStr["str_150"]; //"表單已拒絕";
var formWithdrawed = langStr["str_148"]; //"表單已撤回";
var formEffected = langStr["str_149"]; //"表單已生效";
var revokedStr = langStr["str_176"]; //"已銷假";
var revokingStr = langStr["str_175"]; //"銷假中";
var leaveDetailFrom = true;
var employeeName;
var leaveListArr = [];
var leaveDetailObj = {};
var withdrawReason, dispelReason;

//請假單頁初始化
function leaveQueryInit() {
    $("#backDetailList").hide();
    $("#backSignPreview").hide();
    $("#backEffectPreview").hide();
    $(".leave-query-detail-sign").hide();
    $(".leave-query-withdraw").hide();
    $(".leave-query-dispel").hide();
    $("#viewLeaveQuery .leaveMenu").show();
    $(".leave-query-main").show();
    $("#viewLeaveQuery .ui-title").find("span").text(leaveQueryStr);
}

$("#viewLeaveQuery").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        //獲取請假單列表——<LayoutHeader><EmpNo>0003023</EmpNo></LayoutHeader>
        window.QueryEmployeeLeaveApplyForm = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["applyformlist"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var formidArr = $("formid", htmlDom);
                    var formnoArr = $("formno", htmlDom);
                    var statusArr = $("status", htmlDom);
                    var leaveidArr = $("leaveid", htmlDom);
                    var begindateArr = $("begindate", htmlDom);
                    var begintimeArr = $("begintime", htmlDom);
                    var enddateArr = $("enddate", htmlDom);
                    var endtimeArr = $("endtime", htmlDom);
                    var leavedaysArr = $("days", htmlDom);
                    var leavehoursArr = $("hours", htmlDom);
                    var cancelstatusArr = $("cancelstatus", htmlDom);

                    leaveListArr = [];
                    for (var i = 0; i < formidArr.length; i++) {
                        var leaveObject = {};
                        leaveObject["formid"] = $(formidArr[i]).html();
                        leaveObject["formno"] = $(formnoArr[i]).html();
                        leaveObject["status"] = $(statusArr[i]).html();
                        leaveObject["leaveid"] = $(leaveidArr[i]).html();
                        leaveObject["begindate"] = $(begindateArr[i]).html();
                        leaveObject["begintime"] = $(begintimeArr[i]).html();
                        leaveObject["enddate"] = $(enddateArr[i]).html();
                        leaveObject["endtime"] = $(endtimeArr[i]).html();
                        leaveObject["days"] = ($(leavedaysArr[i]).html().split(".")[1] == "0") ? $(leavedaysArr[i]).html().split(".")[0] : $(leavedaysArr[i]).html();
                        leaveObject["hours"] = ($(leavehoursArr[i]).html().split(".")[1] == "0") ? $(leavehoursArr[i]).html().split(".")[0] : $(leavehoursArr[i]).html();
                        leaveObject["cancelstatus"] = $(cancelstatusArr[i]).html();

                        //表單簽核的4種狀態
                        if ($(statusArr[i]).html() == "AP") {
                            leaveObject["statusName"] = formEffected;
                        } else if ($(statusArr[i]).html() == "RC") {
                            leaveObject["statusName"] = formWithdrawed;
                        } else if ($(statusArr[i]).html() == "RJ") {
                            leaveObject["statusName"] = formRefused;
                        } else {
                            leaveObject["statusName"] = formSigning;
                        }

                        //銷假狀態
                        if ($(cancelstatusArr[i]).html() == "WA") {
                            leaveObject["cancelname"] = "(" + revokingStr + ")";
                        } else if ($(cancelstatusArr[i]).html() == "AP") {
                            leaveObject["cancelname"] = "(" + revokedStr + ")";
                        } else {
                            leaveObject["cancelname"] = "";
                        }

                        //添加假别名称
                        for (var j = 0; j < allLeaveList.length; j++) {
                            if (leaveObject["leaveid"] == allLeaveList[j]["leaveid"]) {
                                leaveObject["name"] = allLeaveList[j]["name"];
                                leaveObject["category"] = allLeaveList[j]["category"];
                                break;
                            } else {
                                leaveObject["name"] = "";
                                leaveObject["category"] = "";
                            }
                        }

                        leaveListArr.push(leaveObject);
                    }

                    //after custom API
                    setAllLeaveList();

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", false, "QueryEmployeeLeaveApplyForm", self.successCallback, self.failCallback, queryEmployeeLeaveApplyFormQueryData, "");
            }();
        };

        //獲取請假單詳情——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid></LayoutHeader>
        window.LeaveApplyFormDetail = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    //1.回傳假單詳細信息
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var applydate = $("applydate", htmlDom);
                    var delegate = $("delegate", htmlDom);
                    var reasons = $("reason", htmlDom);
                    var datumdate = $("datumdate", htmlDom);
                    var filestatus = $("filestatus", htmlDom);

                    //根据代理人工号，查找代理人姓名
                    queryEmployeeDetailQueryData = '<LayoutHeader><EmpNo>' +
                        myEmpNo +
                        '</EmpNo><qEmpno>' +
                        $(delegate).html() +
                        '</qEmpno><qName></qName></LayoutHeader>';
                    //根据id获取代理人姓名
                    QueryEmployeeDetail();
                    leaveDetailObj["agentname"] = employeeName;

                    //补全另一部分详情
                    leaveDetailObj["applydate"] = $(applydate).html().split(" ")[0];
                    leaveDetailObj["reason"] = $.trim($(reasons).html());
                    leaveDetailObj["agentid"] = $(delegate).html();
                    leaveDetailObj["datumdate"] = $(datumdate).html();
                    leaveDetailObj["filestatus"] = $(filestatus).html();

                    //改变详情页内容
                    setLeaveDataToDetail();

                    //2.回傳簽核流程
                    var approveData = data['Content'][0]["approverecord"];
                    var approveDom = new DOMParser().parseFromString(approveData, "text/html");
                    var serialArr = $("app_serial", approveDom);
                    var empnameArr = $("app_emp_name", approveDom);
                    var ynArr = $("app_yn", approveDom);
                    var dateArr = $("app_date", approveDom);
                    var remarkArr = $("app_remark", approveDom);

                    var leaveSignList = [];
                    //首先遍历签核状态，再生成html元素
                    getSignFlow(leaveSignList, serialArr, empnameArr, ynArr, dateArr, remarkArr);
                    setLeaveFlowToPopup(leaveSignList, ".leave-flow-ul");

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", false, "LeaveApplyFormDetail", self.successCallback, self.failCallback, leaveApplyFormDetailQueryData, "");
            }();
        };

        //撤回請假單——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid><formno>572000</formno><reason>測試</reason></LayoutHeader>
        window.RecallLeaveApplyForm = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);

                    //如果成功则跳转，如果失败则提示错误信息
                    if ($(successMsg).html() != undefined) {
                        //成功后先返回假单列表，再重新呼叫API获取最新数据
                        QueryEmployeeLeaveApplyForm();
                        leaveQueryInit();
                        $("#withdrawLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        loadingMask("hide");
                        var errorMsg = $("error", htmlDom);
                        $('.leaveErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.leaveErrorMsg');
                    }

                    $("#withdrawReason").val("");
                    $("#confirmWithdrawBtn").removeClass("leavePreview-active-btn");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "RecallLeaveApplyForm", self.successCallback, self.failCallback, recallLeaveApplyFormQueryData, "");
            }();
        };

        //刪除請假單——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid></LayoutHeader>
        window.DeleteLeaveApplyForm = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);

                    if ($(successMsg).html() != undefined) {
                        //成功后先返回假单列表，再重新呼叫API获取最新数据
                        QueryEmployeeLeaveApplyForm();
                        leaveQueryInit();
                        $("#deleteLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        loadingMask("hide");
                        var errorMsg = $("error", htmlDom);
                        $('.leaveErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.leaveErrorMsg');
                    }

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "DeleteLeaveApplyForm", self.successCallback, self.failCallback, deleteLeaveApplyFormQueryData, "");
            }();
        };

        //送出銷假單——<LayoutHeader><EmpNo>0003023</EmpNo><applyformid>512340</applyformid><reason>沒事</reason></LayoutHeader>
        window.SendLeaveCancelFormData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);

                    if ($(successMsg).html() != undefined) {
                        //成功后先跳转到销假单列表，再重新呼叫API获取最新数据
                        QueryEmployeeLeaveApplyForm();
                        QueryEmployeeLeaveCancelForm();
                        leaveQueryInit();
                        changePageByPanel("viewBackLeaveQuery");
                        $("#backLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        loadingMask("hide");
                        var errorMsg = $("error", htmlDom);
                        $('.leaveErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.leaveErrorMsg');
                    }

                    $("#dispelReason").val("");
                    $("#confirmDispelBtn").removeClass("leavePreview-active-btn");

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "SendLeaveCancelFormData", self.successCallback, self.failCallback, sendLeaveCancelFormDataQueryData, "");
            }();
        };

        //查询代理人信息
        window.QueryEmployeeDetail = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    //如果Content.length=0,則未查到代理人信息
                    if (data['Content'].length == 0) {
                        employeeName = "";

                    } else {
                        var callbackData = data['Content'][0]["result"];
                        var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                        var department = $("department", htmlDom);
                        var empno = $("empno", htmlDom);
                        var ename = $("name", htmlDom);
                        employeeName = $.trim($(ename).html());
                    }

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", false, "QueryEmployeeData", self.successCallback, self.failCallback, queryEmployeeDetailQueryData, "");
            }();
        };

        //添加所有請假到列表
        function setAllLeaveList() {
            var leaveListHtml = "";
            for (var i in leaveListArr) {
                leaveListHtml += '<div class="leave-query-list">' +
                    '<div>' +
                    '<div class="leave-query-state font-style3" form-id="' + leaveListArr[i]["formid"] + '">' +
                    '<span>' + leaveListArr[i]["statusName"] + '</span>' +
                    '<span>' + leaveListArr[i]["cancelname"] + '</span>' +
                    '<img src="img/more.png">' +
                    '</div>' +
                    '<div class="leave-query-base font-style11">' +
                    '<div class="leave-query-basedata">' +
                    '<div>' +
                    //'<span>請假單號：</span>' +
                    '<span>' + langStr["str_131"] + ' </span>' +
                    '<span class="leave-id">' + leaveListArr[i]["formno"] + '</span>' +
                    '</div>' +
                    '<div>' +
                    //'<span>假別：</span>' +
                    '<span>' + langStr["str_152"] + ' </span>' +
                    '<span>' + leaveListArr[i]["name"] + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    //'<span>請假區間：</span>' +
                    '<span>' + langStr["str_138"] + ' </span>' +
                    '<span>' + leaveListArr[i]["begindate"] + ' ' + leaveListArr[i]["begintime"] + '</span>' +
                    '<span> - </span>' +
                    '<span>' + leaveListArr[i]["enddate"] + ' ' + leaveListArr[i]["endtime"] + '</span>' +
                    '</div>' +
                    '<div>' +
                    //'<span>請假數：</span>' +
                    '<span>' + langStr["str_153"] + ' </span>' +
                    '<span>' + leaveListArr[i]["days"] + ' </span>' +
                    //'<span> 天 </span>' +
                    '<span> ' + langStr["str_071"] + ' </span>' +
                    '<span>' + leaveListArr[i]["hours"] + '</span>' +
                    //'<span> 小時</span>' +
                    '<span> ' + langStr["str_088"] + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div></div>' +
                    '</div>';
            }

            //判断请假单列表是否有数据
            if (leaveListArr.length == 0) {
                $("#maxLeaveMsg").text(langStr["str_177"]);
            } else {
                $("#maxLeaveMsg").text(langStr["str_145"]);
                $(".leave-query-main-list").empty().append(leaveListHtml);
            }
        }

        //根据formid从假单列表当中获取该假单部分信息
        function getLeaveDetailByID(id) {
            for (var i in leaveListArr) {
                if (leaveListArr[i]["formid"] == id) {
                    return leaveListArr[i];
                }
            }
        }

        //假單詳情傳值
        function setLeaveDataToDetail() {
            $("#leaveApplyDate").text(leaveDetailObj["applydate"]);
            $("#leaveFormNo").text(leaveDetailObj["formno"]);
            $("#leaveStatus").text(leaveDetailObj["statusName"]);
            $("#leaveCategory").text(leaveDetailObj["category"]);
            $("#leaveName").text(leaveDetailObj["name"]);
            $("#leaveAgentName").text(leaveDetailObj["agentname"]);
            $("#leaveStartDate").text(leaveDetailObj["begindate"]);
            $("#leaveStartTime").text(leaveDetailObj["begintime"]);
            $("#leaveEndDate").text(leaveDetailObj["enddate"]);
            $("#leaveEndTime").text(leaveDetailObj["endtime"]);
            $("#leaveApplyDays").text(leaveDetailObj["days"]);
            $("#leaveApplyHours").text(leaveDetailObj["hours"]);
            $("#leaveApplyReason").text(leaveDetailObj["reason"]);
            //撤回頁面的“請假單號”
            $("#withdrawFormNo").text(leaveDetailObj["formno"]);
            //銷假頁面的“請假單號”
            $("#revokeFormNo").text(leaveDetailObj["formno"]);
        }


        /********************************** page event *************************************/
        $("#viewLeaveQuery").on("pagebeforeshow", function(event, ui) {
            $("#viewLeaveQuery .leaveMenu").show();
            /**** PullToRefresh ****/
            // PullToRefresh.init({
            //     mainElement: '.page-date',
            //     onRefresh: function() {
            //         loadingMask("show");
            //         //请假单只需要更新请假单列表
            //         QueryEmployeeLeaveApplyForm();
            //         QueryEmployeeLeaveCancelForm();
            //     }
            // });

        });

        $("#viewLeaveQuery").on("pageshow", function(event, ui) {
            $("#withdrawApplyDate").text(applyDay);
            $("#revokeApplyDate").text(applyDay);
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveQuery").keypress(function(event) {});

        //點擊詳細，根據不同表單狀態顯示不同頁面——click
        $(document).on("click", ".leave-query-state", function() {
            loadingMask("show");
            //此變數記錄詳情頁的來源，true爲本頁（假單查詢），false爲“銷假單查詢”
            leaveDetailFrom = true;
            //var self = $(this).children("span").eq(0).text();
            var self = $.trim($(this).text());
            var formid = $(this).attr("form-id");

            //先获取部分详情，另外部分详情在API中获取
            leaveDetailObj = getLeaveDetailByID(formid);

            leaveApplyFormDetailQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                formid +
                '</formid></LayoutHeader>';
            //呼叫API
            LeaveApplyFormDetail();

            if (self == formSigning) {
                leaveListToDetail("leaveWithdraw", "leaveDelete", "leaveRevoke", "");
            } else if (self == formRefused || self == formWithdrawed) {
                leaveListToDetail("leaveDelete", "leaveWithdraw", "leaveRevoke", "");
            } else if (self == formEffected) {
                leaveListToDetail("leaveRevoke", "leaveWithdraw", "leaveDelete", "");
            } else {
                leaveListToDetail("leaveRevoke", "leaveWithdraw", "leaveDelete", null);
            }

        });

        //返回假單列表——click
        $("#backDetailList").on("click", function() {
            //跳转前本页恢复初始状态
            $("#backDetailList").hide();
            $(".leave-query-detail-sign").hide();
            $("#viewLeaveQuery .leaveMenu").show();
            $(".leave-query-main").show();
            //如果为false则是从“销假单查询”的详情而来，如果为true则不用操作
            if (leaveDetailFrom == false) {
                //先切换到“销假单查询”页
                changePageByPanel("viewBackLeaveQuery");
                //再到“销假单查询”的详情页即“假单详情的来源”
                $(".backLeave-query-main").hide();
                $("#viewBackLeaveQuery .leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-sign").show();
            }
            //return false;

        });

        //籤核中狀態——click——popup
        $("#signLeaveDetail").on("click", function() {
            popupMsgInit('.signStateFlow');
        });

        //撤回按鈕——click
        $("#withdrawLeaveBtn").on("click", function() {
            $(".leave-query-detail-sign").hide();
            $("#backDetailList").hide();
            $(".leave-query-withdraw").show();
            $("#backSignPreview").show();
        });

        //從撤回返回詳情
        $("#backSignPreview").on("click", function() {
            $(".leave-query-withdraw").hide();
            $("#backSignPreview").hide();
            $(".leave-query-detail-sign").show();
            $("#backDetailList").show();
            //return false;
        });

        function WithdrawReason() {
            withdrawReason = $.trim($("#withdrawReason").val());

            if (withdrawReason !== "") {
                $("#confirmWithdrawBtn").addClass("leavePreview-active-btn");
            } else {
                $("#confirmWithdrawBtn").removeClass("leavePreview-active-btn");
            }
        }

        var timeoutWithdrawReason = null;
        //輸入撤回理由——textarea
        $("#withdrawReason").on("keyup", function() {

            if (timeoutWithdrawReason != null) {
                clearTimeout(timeoutWithdrawReason);
                timeoutWithdrawReason = null;
            }
            timeoutWithdrawReason = setTimeout(function() {
                WithdrawReason();
            }, 2000);

        });

        //撤回假單按鈕——popup
        $("#confirmWithdrawBtn").on("click", function() {
            if ($("#confirmWithdrawBtn").hasClass("leavePreview-active-btn")) {
                //popup提示確定或取消
                $("#withdrawReason").blur();
                setTimeout(function() {
                    popupMsgInit(".confirmWithdraw");
                }, 100);

            }
        });

        //確認撤回
        $("#confirmWithdrawLeave").on("click", function() {
            loadingMask("show");
            recallLeaveApplyFormQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                leaveDetailObj["formid"] +
                '</formid><formno>' +
                leaveDetailObj["formno"] +
                '</formno><reason>' +
                withdrawReason +
                '</reason></LayoutHeader>';
            //API
            RecallLeaveApplyForm();

        });

        //刪除假單——popup
        $("#deleteRefuseLeave").on("click", function() {
            popupMsgInit(".confirmDelete");
        });

        //確認刪除假單——click
        $("#confirmDeleteLeave").on("click", function() {
            loadingMask("show");
            deleteLeaveApplyFormQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                leaveDetailObj["formid"] +
                '</formid></LayoutHeader>';
            //API
            DeleteLeaveApplyForm();

        });

        //編輯假單
        $("#editRefuseLeave").on("click", function() {
            loadingMask("show");
            editLeaveForm = true;

            /**************** 1.取值 ***************/
            var startText = leaveDetailObj["begindate"] + " " + leaveDetailObj["begintime"];
            var endText = leaveDetailObj["enddate"] + " " + leaveDetailObj["endtime"];

            //根据代理人id查找代理人姓名，代理人信息已在獲取詳情時存在leaveDetailObj中
            leaveid = leaveDetailObj["leaveid"];
            leaveCategory = leaveDetailObj["category"];

            /**************** 2.传值 ***************/
            //修改類別成所有类别
            $.each($("#categroy-popup-option-list li"), function(i, item) {
                if ($(item).text() == allLeaveCategroyStr) {
                    $(item).trigger("click");
                    return false;
                }
            });

            //修改假別
            queryLeftDaysData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><leaveid>" +
                leaveid +
                "</leaveid></LayoutHeader>";
            queryDatumDatesQueryData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><leaveid>" +
                leaveid +
                "</leaveid></LayoutHeader>";

            $.each($("#leave-popup-option-list li"), function(i, item) {
                if ($(item).text() == leaveDetailObj["name"]) {
                    $(item).trigger("click");
                    return false;
                }
            });

            //修改代理人——如果需要编辑假单，还需要检查代理人是否在职，如果不编辑只需显示代理人信息即可
            if (employeeName !== "") {
                agentid = leaveDetailObj["agentid"];
                agentName = leaveDetailObj["agentname"];
                var options = '<option hidden>' + agentName + '</option>';
                $("#leave-agent-popup").find("option").remove().end().append(options);
                tplJS.reSizeDropdownList("leave-agent-popup", "typeB");

            } else {
                agentid = "";
                agentName = "";
                var options = '<option hidden>' + pleaseSelectStr + '</option>';
                $("#leave-agent-popup").find("option").remove().end().append(options);
                tplJS.reSizeDropdownList("leave-agent-popup", "typeB");

            }


            //修改開始日期
            startLeaveDate = startText;
            $("#startText").text(startLeaveDate);
            //$("#startDate").val(startLeaveDate.replace(" ", "T"));

            //修改結束日期
            endLeaveDate = endText;
            $("#endText").text(endLeaveDate);
            //$("#endDate").val(endLeaveDate.replace(" ", "T"));

            //修改請假理由
            leaveReason = leaveDetailObj["reason"];
            $("#leaveReason").val(leaveReason);

            //修改基準日
            baseday = leaveDetailObj["datumdate"];
            $("#chooseBaseday").text(baseday);

            //修改请假数
            $("#leaveDays").text("0");
            $("#leaveHours").text("0");

            /**************** 3.跳转 ***************/
            $("#backDetailList").click();
            changePageByPanel("viewLeaveSubmit");

            /**************** 4.计算请假数 ***************/
            setTimeout(function() {
                countLeaveHoursByEndQueryData = "<LayoutHeader><EmpNo>" +
                    myEmpNo +
                    "</EmpNo><leaveid>" +
                    leaveDetailObj["leaveid"] +
                    "</leaveid><begindate>" +
                    leaveDetailObj["begindate"] +
                    "</begindate><begintime>" +
                    leaveDetailObj["begintime"] +
                    "</begintime><enddate>" +
                    leaveDetailObj["enddate"] +
                    "</enddate><endtime>" +
                    leaveDetailObj["endtime"] +
                    "</endtime><datumdate>" +
                    baseday +
                    "</datumdate></LayoutHeader>";
                //console.log(countLeaveHoursByEndQueryData);
                //呼叫API
                CountLeaveHoursByEnd();
            }, 2000);

        });

        //銷假申請——click
        $("#dispelLeave").on("click", function() {
            $("#viewLeaveQuery .ui-title").find("span").text(leaveRevokeStr);
            $(".leave-query-detail-sign").hide();
            $("#backDetailList").hide();
            $(".leave-query-dispel").show();
            $("#backEffectPreview").show();
        });

        //從銷假返回詳情
        $("#backEffectPreview").on("click", function() {
            $("#viewLeaveQuery .ui-title").find("span").text(leaveQueryStr);
            $(".leave-query-dispel").hide();
            $("#backEffectPreview").hide();
            $(".leave-query-detail-sign").show();
            $("#backDetailList").show();
            //return false;
        });

        function DispelReason() {
            dispelReason = $.trim($("#dispelReason").val());

            if (dispelReason !== "") {
                $("#confirmDispelBtn").addClass("leavePreview-active-btn");
            } else {
                $("#confirmDispelBtn").removeClass("leavePreview-active-btn");
            }
        }

        var timeoutDispelReason = null;
        //輸入銷假理由——textarea
        $("#dispelReason").on("keyup", function() {

            if (timeoutDispelReason != null) {
                clearTimeout(timeoutDispelReason);
                timeoutDispelReason = null;
            }
            timeoutDispelReason = setTimeout(function() {
                DispelReason();
            }, 2000);

        });

        //確定銷假送簽——click
        $("#confirmDispelBtn").on("click", function() {
            if ($("#confirmDispelBtn").hasClass("leavePreview-active-btn")) {
                $("#dispelReason").blur();
                setTimeout(function() {
                    popupMsgInit(".confirmRevoke");
                }, 100);

            }
        });

        //確定銷假
        $("#confirmRevokeLeave").on("click", function() {
            loadingMask("show");
            sendLeaveCancelFormDataQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><applyformid>' +
                leaveDetailObj["formid"] +
                '</applyformid><reason>' +
                dispelReason +
                '</reason></LayoutHeader>';
            //API
            SendLeaveCancelFormData();

        });

        //取消申請(同返回操作一致)——click
        $("#cancelApply").on("click", function() {
            $("#backEffectPreview").trigger("click");
        });

    }
});