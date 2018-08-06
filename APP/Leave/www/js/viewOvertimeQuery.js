var viewLeaveQueryInit = false;
var formSigning = langStr["str_147"]; //"表單簽核中";
var formRefused = langStr["str_150"]; //"表單已拒絕";
var formWithdrawed = langStr["str_148"]; //"表單已撤回";
var formEffected = langStr["str_149"]; //"表單已生效";
var formEnter = langStr["str_208"]; //"時數登入中";

var employeeName;
var overtimeListArr = [];
var overtimeDetailObj = {};
var withdrawOTReason;

//請假單頁初始化
function leaveQueryInit() {
    $("#backDetailList").hide();
    $("#backSignPreview").hide();
    $("#backEffectPreview").hide();
    $(".leave-query-detail-sign").hide();
    $(".leave-query-withdraw").hide();
    $(".leave-query-dispel").hide();
    $("#viewOvertimeQuery .leaveMenu").show();
    $(".leave-query-main").show();
    $("#viewOvertimeQuery .ui-title").find("span").text(leaveQueryStr);
}

$("#viewOvertimeQuery").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        //獲取加班單列表——<LayoutHeader><EmpNo>0003023</EmpNo></LayoutHeader>
        window.QueryEmployeeOvertimeApplyForm = function() {

            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["overtimeformlist"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var formidArr = $("formid", htmlDom);
                    var formnoArr = $("formno", htmlDom);
                    var statusArr = $("status", htmlDom);
                    var periodArr = $("period", htmlDom);
                    var overtimehoursArr = $("hours", htmlDom);

                    overtimeListArr = [];
                    for (var i = 0; i < formidArr.length; i++) {
                        var overtimeObject = {};
                        overtimeObject["formid"] = $(formidArr[i]).html();
                        overtimeObject["formno"] = $(formnoArr[i]).html();
                        overtimeObject["status"] = $(statusArr[i]).html();
                        overtimeObject["period"] = $(periodArr[i]).html();                      
                        overtimeObject["hours"] = ($(overtimehoursArr[i]).html().split(".")[1] == "0") ? $(overtimehoursArr[i]).html().split(".")[0] : $(overtimehoursArr[i]).html();

                        //表單簽核的4種狀態
                        if ($(statusArr[i]).html() == "AP") {
                            overtimeObject["statusName"] = formEffected;
                        } else if ($(statusArr[i]).html() == "RC") {
                            overtimeObject["statusName"] = formWithdrawed;
                        } else if ($(statusArr[i]).html() == "RJ") {
                            overtimeObject["statusName"] = formRefused;
                        } else if ($(statusArr[i]).html() == "wA") {
                            overtimeObject["statusName"] = formSigning;
                        } else if ($(statusArr[i]).html() == "wP") {
                            overtimeObject["statusName"] = formEnter;
                        }

                        overtimeListArr.push(overtimeObject);
                    }

                    //after custom API
                    setAllOvertimeList();

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", false, "QueryEmployeeOvertimeForm", self.successCallback, self.failCallback, queryEmployeeOvertimeApplyFormQueryData, "");
            }();
        };

        //獲取加班單詳情——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid></LayoutHeader>
        window.OvertimeApplyFormDetail = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    //1.回傳假單詳細信息
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var applydate = $("applydate", htmlDom);
                    var reasons = $("reason", htmlDom);
                    var targetdate = $("targetdate", htmlDom);
                    var expectfrom = $("expectFrom", htmlDom);
                    var expectto = $("expectTo", htmlDom);

                    overtimeDetailObj["applydate"] = $(applydate).html().split(" ")[0];
                    overtimeDetailObj["reason"] = $.trim($(reasons).html());
                    overtimeDetailObj["targetdate"] = $(targetdate).html();
                    overtimeDetailObj["expectInterval"] = $(expectfrom).html() + ' - ' + $(expectto).html();

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

                    var overtimeSignList = [];
                    //首先遍历签核状态，再生成html元素
                    getSignFlow(overtimeSignList, serialArr, empnameArr, ynArr, dateArr, remarkArr);
                    setLeaveFlowToPopup(overtimeSignList, ".leave-flow-ul");

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", false, "OvertimeFormDetail", self.successCallback, self.failCallback, overtimeApplyFormDetailQueryData, "");
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
                    $("#confirmWithdrawOTBtn").removeClass("leavePreview-active-btn");
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

        //添加所有加班到列表
        function setAllOvertimeList() {
            var overtimeListHtml = "";
            if (overtimeListArr.length === 0) {
                overtimeListHtml = "";
            } else {
                for (var i in overtimeListArr) {
                    overtimeListHtml += '<div class="leave-query-list">' +
                        '<div>' +
                        '<div class="overtime-query-state font-style3" form-id="' + overtimeListArr[i]["formid"] + '">' +
                        '<span>' + overtimeListArr[i]["statusName"] + '</span>' +
                        '<img src="img/more.png">' +
                        '</div>' +
                        '<div class="leave-query-base font-style11">' +
                        '<div class="leave-query-basedata">' +
                        '<div>' +
                        //'<span>加班單號：</span>' +
                        '<span>' + langStr["str_209"] + ' </span>' +
                        '<span class="leave-id">' + overtimeListArr[i]["formno"] + '</span>' +
                        '</div>' +
                        '</div>' +

                        '<div>' +
                        //'<span>加班區間：</span>' +
                        '<span>' + langStr["str_210"] + ' </span>' +
                        '<span>' + overtimeListArr[i]["period"] + '</span>' +
                        '</div>' +
                        '<div>' +
                        //'<span>加班時數：</span>' +
                        '<span>' + langStr["str_211"] + ' </span>' +
                        '<span>' + overtimeListArr[i]["hours"] + '</span>' +
                        //'<span> 小時</span>' +
                        '<span> ' + langStr["str_088"] + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div></div>' +
                        '</div>';
                }
            }
            //判断请假单列表是否有数据
            if (overtimeListArr.length == 0) {
                $("#maxOvertimeMsg").text(langStr["str_212"]);
                $(".overtime-query-main-list").empty().append(overtimeListHtml);
            } else {
                $("#maxOvertimeMsg").text(langStr["str_213"]);
                $(".overtime-query-main-list").empty().append(overtimeListHtml);
            }
        }

        //根据formid从假单列表当中获取该假单部分信息
        function getOvertimeDetailByID(id) {
            for (var i in overtimeListArr) {
                if (overtimeListArr[i]["formid"] == id) {
                    return overtimeListArr[i];
                }
            }
        }

        //假單詳情傳值
        function setLeaveDataToDetail() {
            $("#overtimeApplyDate").text(overtimeDetailObj["applydate"]);
            $("#overtimeFormNo").text(overtimeDetailObj["formno"]);
            $("#overtimeStatus").text(overtimeDetailObj["statusName"]);
            $("#overtimeDate").text(overtimeDetailObj["targetdate"]);
            $("#overtimeInterval").text(overtimeDetailObj["expectInterval"]);
            $("#overtimeApplyHours").text(overtimeDetailObj["hours"]);
            $("#overtimeApplyReason").text(overtimeDetailObj["reason"]);

            //撤回頁面的“請假單號”
            //$("#withdrawFormNo").text(overtimeDetailObj["formno"]);
            //銷假頁面的“請假單號”
            //$("#revokeFormNo").text(overtimeDetailObj["formno"]);
        }

        function periodFromOvertimeDateToNow(overtimedate) {
            var today = new Date();
            var otDate = new Date(overtimedate);
            var otperiod = otDate.getTime() - today.getTime(); 
            var periodday = parsenInt(otperiod/86400000) + 1;
            return periodday;
        }

        /********************************** page event *************************************/
        $("#viewOvertimeQuery").on("pagebeforeshow", function(event, ui) {
            $("#viewOvertimeQuery .leaveMenu").show();
        });

        $("#viewOvertimeQuery").on("pageshow", function(event, ui) {
            $("#withdrawOTApplyDate").text(applyDay);
            $("#revokeApplyDate").text(applyDay);
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewOvertimeQuery").keypress(function(event) {});


        //點擊詳細，根據不同表單狀態顯示不同頁面——click
        $(document).on("click", ".overtime-query-state", function() {
            loadingMask("show");

            var self = $.trim($(this).text());
            var formid = $(this).attr("form-id")
            var overtimedate = overtimeDetailObj["targetdate"];

            //先获取部分详情，另外部分详情在API中获取
            overtimeDetailObj = getOvertimeDetailByID(formid);

            overtimeApplyFormDetailQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                formid +
                '</formid></LayoutHeader>';
            //呼叫API
            OvertimeApplyFormDetail();

            if (self == formSigning) {
                overtimeListToDetail("overtimeWithdraw", "overtimeDelete", "overtimeEnter", "overtimeNoEnter", "");
            } else if (self == formWithdrawed) {
                overtimeListToDetail("overtimeDelete", "overtimeWithdraw", "overtimeEnter", "overtimeNoEnter", "");
            } else if (self == formEnter) {
                if (periodFromOvertimeDateToNow(overtimedate) <= 30) {
                    overtimeListToDetail("overtimeEnter", "leaveWithdraw", "overtimeDelete", "overtimeNoEnter", "");
                } else {
                    overtimeListToDetail("overtimeNoEnter", "leaveWithdraw", "overtimeDelete", "overtimeEnter", "");
                }               
            } else {
                overtimeListToDetail("overtimeWithdraw", "overtimeDelete", "overtimeEnter", "overtimeNoEnter", null);
            }
        });

        //返回加班單列表——click
        $("#backOTDetailList").on("click", function() {
            //跳转前本页恢复初始状态
            $("#backOTDetailList").hide();
            $(".leave-query-detail-sign").hide();
            $("#viewOvertimeQuery .leaveMenu").show();
            $(".leave-query-main").show();
        });

        //籤核中狀態——click——popup
        $("#signOvertimeDetail").on("click", function() {
            popupMsgInit('.signOTStateFlow');
        });

        //撤回按鈕——click
        $("#overtimeWithdraw").on("click", function() {
            $(".leave-query-detail-sign").hide();
            $("#backOTDetailList").hide();
            $(".leave-query-withdraw").show();
            $("#backSignOTList").show();
        });

        //從撤回返回詳情
        $("#backSignOTList").on("click", function() {
            $(".leave-query-withdraw").hide();
            $("#backSignOTList").hide();
            $(".leave-query-detail-sign").show();
            $("#backOTDetailList").show();
        });

        function WithdrawOTReason() {
            withdrawOTReason = $.trim($("#withdrawOTReason").val());

            if (withdrawOTReason !== "") {
                $("#confirmWithdrawOTBtn").addClass("leavePreview-active-btn");
            } else {
                $("#confirmWithdrawOTBtn").removeClass("leavePreview-active-btn");
            }
        }

        var timeoutWithdrawOTReason = null;
        //輸入撤回理由——textarea
        $("#withdrawOTReason").on("keyup", function() {

            if (timeoutWithdrawOTReason != null) {
                clearTimeout(timeoutWithdrawOTReason);
                timeoutWithdrawOTReason = null;
            }
            timeoutWithdrawOTReason = setTimeout(function() {
                WithdrawOTReason();
            }, 2000);

        });

        //撤回假單按鈕——popup
        $("#confirmWithdrawOTBtn").on("click", function() {
            if ($("#confirmWithdrawOTBtn").hasClass("leavePreview-active-btn")) {
                //popup提示確定或取消
                $("#withdrawOTReason").blur();
                setTimeout(function() {
                    popupMsgInit(".confirmWithdrawOT");
                }, 100);

            }
        });
    }
});