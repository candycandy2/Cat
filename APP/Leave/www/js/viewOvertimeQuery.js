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

//加班單頁初始化
function overtimeQueryInit() {
    $("#backOTDetailList").hide();
    $("#backSignOTList").hide();
    $(".leave-query-detail-sign").hide();
    $(".leave-query-withdraw").hide();
    $(".actualot-query-detail-sign").hide();
    $("#viewOvertimeQuery .leaveMenu").show();
    $(".leave-query-main").show();
    //$("#viewOvertimeQuery .ui-title").find("span").text(leaveQueryStr);
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
                        } else if ($(statusArr[i]).html() == "WA") {
                            overtimeObject["statusName"] = formSigning;
                        } else if ($(statusArr[i]).html() == "WP") {
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
                    var status = $("status", htmlDom);
                    var reasons = $("reason", htmlDom);
                    var targetdate = $("targetdate", htmlDom);
                    var expectfrom = $("expectFrom", htmlDom);
                    var expectto = $("expectTo", htmlDom);
                    var actualfrom = $("actualFrom", htmlDom);
                    var actualto = $("actualTo", htmlDom);
                    var actualtotalhour = $("actualTotalhours", htmlDom);
                    var type = $("type", htmlDom);

                    overtimeDetailObj["applydate"] = $(applydate).html().split(" ")[0];
                    overtimeDetailObj["status"] = $.trim($(status).html());
                    overtimeDetailObj["reason"] = $.trim($(reasons).html());
                    overtimeDetailObj["targetdate"] = $(targetdate).html();
                    overtimeDetailObj["expectFrom"] = $(expectfrom).html();
                    overtimeDetailObj["expectTo"] = $(expectto).html();
                    overtimeDetailObj["expectInterval"] = $(expectfrom).html() + ' - ' + $(expectto).html();
                    overtimeDetailObj["actualFrom"] = $(actualfrom).html();
                    overtimeDetailObj["actualTo"] = $(actualto).html();
                    overtimeDetailObj["actualTotalhours"] = ($(actualtotalhour).html().split(".")[1] == "0") ? $(actualtotalhour).html().split(".")[0] : $(actualtotalhour).html();
                    overtimeDetailObj["type"] = ($.trim($(type).html()) == "1") ? '補休' : '加班費';
                    //改变详情页内容
                    if (overtimeDetailObj["actualTotalhours"] !== "0" && overtimeDetailObj["status"] === "WA") {
                        setActualOTDataToDetail();
                    } else {
                        setOvertimeDataToDetail();
                    }           
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

        //撤回加班單——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid><formno>572000</formno><reason>測試</reason></LayoutHeader>
        window.RecallOvertimeApplyForm = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);

                    //如果成功则跳转，如果失败则提示错误信息
                    if ($(successMsg).html() != undefined) {
                        //成功后先返回假单列表，再重新呼叫API获取最新数据
                        QueryEmployeeOvertimeApplyForm();
                        overtimeQueryInit();
                        $("#withdrawOTMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        loadingMask("hide");
                        var errorMsg = $("error", htmlDom);
                        $('.overtimeErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.overtimeErrorMsg');
                    }

                    $("#withdrawOTReason").val("");
                    $("#withdrawOTBtnWhenSigning").removeClass("leavePreview-active-btn");
                }
            };

            this.failCallback = function(data) {}; 

            var __construct = function() {
                CustomAPI("POST", true, "RecallOvertimeForm", self.successCallback, self.failCallback, recallOvertimeApplyFormQueryData, "");
            }();
        };

        //刪除加班單——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid></LayoutHeader>
        window.DeleteOvertimeApplyForm = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);

                    if ($(successMsg).html() != undefined) {
                        //成功后先返回假单列表，再重新呼叫API获取最新数据
                        QueryEmployeeOvertimeApplyForm();
                        overtimeQueryInit();
                        $("#deleteOTMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        loadingMask("hide");
                        var errorMsg = $("error", htmlDom);
                        $('.overtimeErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.overtimeErrorMsg');
                    }

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "DeleteOvertimeForm", self.successCallback, self.failCallback, deleteOvertimeFormQueryData, "");
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

        //加班單詳情傳值
        function setOvertimeDataToDetail() {
            $("#backOTDetailList").show();
            $("#backActualOTDetailList").hide();
            $("#overtimeApplyDate").text(overtimeDetailObj["applydate"]);
            $("#overtimeFormNo").text(overtimeDetailObj["formno"]);
            $("#overtimeStatus").text(overtimeDetailObj["statusName"]);
            $("#overtimeDate").text(overtimeDetailObj["targetdate"]);
            $("#overtimeInterval").text(overtimeDetailObj["expectInterval"]);
            $("#overtimeApplyHours").text(overtimeDetailObj["hours"]);
            $("#overtimeApplyReason").text(overtimeDetailObj["reason"]);
            //撤回頁面的“請假單號”
            $("#withdrawOTFormNo").text(overtimeDetailObj["formno"]);
            $(".actualot-query-detail-sign").hide();
            $(".leave-query-detail-sign").show();            
        }

        //加班單(有實際區間)詳情傳值
        function setActualOTDataToDetail() {
            $("#backActualOTDetailList").show();
            $("#backOTDetailList").hide();
            var originalOTInterval = overtimeDetailObj["targetdate"] + " " + overtimeDetailObj["expectFrom"] + " - " + overtimeDetailObj["targetdate"] +  " " + overtimeDetailObj["expectTo"];
            var actualOTInterval = overtimeDetailObj["targetdate"] + " " + overtimeDetailObj["actualFrom"] + " - " + overtimeDetailObj["targetdate"] +  " " + overtimeDetailObj["actualTo"];
            $("#otApplyDate").text(overtimeDetailObj["applydate"]);
            $("#otFormNo").text(overtimeDetailObj["formno"]);
            $("#otStatus").text(overtimeDetailObj["statusName"]);
            $("#originalOTPeriod").text(originalOTInterval);
            $("#originalTotalHours").text(overtimeDetailObj["hours"]);
            $("#otApplyReason").text(overtimeDetailObj["reason"]);
            $("#actualOTPeriod").text(actualOTInterval);
            $("#actualTotalHours").text(overtimeDetailObj["actualTotalhours"]);
            $("#overtimePaid").text(overtimeDetailObj["type"]);           
            //撤回頁面的“請假單號”
            $("#withdrawOTFormNo").text(overtimeDetailObj["formno"]);            
            $(".actualot-query-detail-sign").show();
            $(".leave-query-detail-sign").hide();
        }

        function periodFromOvertimeDateToNow(overtimedate) {
            var today = new Date();
            var otDate = new Date(overtimedate);
            var otperiod = otDate.getTime() - today.getTime(); 
            var periodday = parseInt(otperiod/86400000) + 1;
            return periodday;
        }

        /********************************** page event *************************************/
        $("#viewOvertimeQuery").on("pagebeforeshow", function(event, ui) {
            if (!changePageFromSubmitToDetail) {
                $("#backOTDetailList").click();
            } else {
                //從時數登入申請返回加班明細
                $('#viewOvertimeQuery .leaveMenu').hide();
                changePageFromSubmitToDetail = false;
            }
        });

        $("#viewOvertimeQuery").on("pageshow", function(event, ui) {
            $("#withdrawOTApplyDate").text(applyDay);
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewOvertimeQuery").keypress(function(event) {});


        //點擊詳細，根據不同表單狀態顯示不同頁面——click
        $(document).on("click", ".overtime-query-state", function() {
            loadingMask("show");

            var self = $.trim($(this).text());
            var formid = $(this).attr("form-id")
            //先获取部分详情，另外部分详情在API中获取
            overtimeDetailObj = getOvertimeDetailByID(formid);

            overtimeApplyFormDetailQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                formid +
                '</formid></LayoutHeader>';
            //呼叫API
            OvertimeApplyFormDetail();
            var overtimedate = overtimeDetailObj["targetdate"];

            if (self == formSigning) {
                overtimeListToDetail("overtimeWithdraw", "overtimeDelete", "overtimeEnter", "overtimeNoEnter", "");
            } else if (self == formWithdrawed) {
                overtimeListToDetail("overtimeDelete", "overtimeWithdraw", "overtimeEnter", "overtimeNoEnter", "");
            } else if (self == formEnter) {
                if (periodFromOvertimeDateToNow(overtimedate) <= 30) {
                    overtimeListToDetail("overtimeEnter", "overtimeWithdraw", "overtimeDelete", "overtimeNoEnter", "");
                } else {
                    overtimeListToDetail("overtimeNoEnter", "overtimeWithdraw", "overtimeDelete", "overtimeEnter", "");
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

        //返回加班單列表——click
        $("#backActualOTDetailList").on("click", function() {
            //跳转前本页恢复初始状态
            $("#backActualOTDetailList").hide();
            $(".actualot-query-detail-sign").hide();
            $("#viewOvertimeQuery .leaveMenu").show();
            $(".leave-query-main").show();
        });

        //籤核中狀態——click——popup
        $("#signOvertimeDetail").on("click", function() {
            popupMsgInit('.signOTStateFlow');
        });

        //籤核中狀態——click——popup
        $("#signOTDetail").on("click", function() {
            popupMsgInit('.signOTStateFlow');
        });

        //撤回按鈕——click
        $("#withdrawOTBtn").on("click", function() {
            $(".leave-query-detail-sign").hide();
            $("#backOTDetailList").hide();
            $(".leave-query-withdraw").show();
            $("#backSignOTList").show();
        });

        //時數登入中的撤回表單按鈕——click
        $(".withdrawRefuseOT").on("click", function() {
            $(".leave-query-detail-sign").hide();
            $("#backOTDetailList").hide();
            $(".leave-query-withdraw").show();
            $("#backSignOTList").show();
        });

        //實際時數撤回按鈕——click
        $("#withdrawActualOTBtn").on("click", function() {
            $(".actualot-query-detail-sign").hide();
            $("#backActualOTDetailList").hide();
            $(".leave-query-withdraw").show();
            $("#backActualSignOTList").show();
        });

        //編輯按鈕——click
        $("#editRefuseOT").on("click", function() {
            $("#backOTDetailList").click();
            viewEditOTApplyShow = true;
            changePageByPanel("viewOvertimeSubmit");
        });

        //從撤回返回詳情
        $("#backSignOTList").on("click", function() {
            $(".leave-query-withdraw").hide();
            $("#backSignOTList").hide();
            $(".leave-query-detail-sign").show();
            $("#backOTDetailList").show();
        });

        //從實際時數撤回返回詳情
        $("#backActualSignOTList").on("click", function() {
            $(".leave-query-withdraw").hide();
            $("#backActualSignOTList").hide();
            $(".actualot-query-detail-sign").show();
            $("#backActualOTDetailList").show();
        });

        function WithdrawOTReason() {
            withdrawOTReason = $.trim($("#withdrawOTReason").val());

            if (withdrawOTReason !== "") {
                $("#withdrawOTBtnWhenSigning").addClass("leavePreview-active-btn");
            } else {
                $("#withdrawOTBtnWhenSigning").removeClass("leavePreview-active-btn");
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
        $("#withdrawOTBtnWhenSigning").on("click", function() {
            if ($("#withdrawOTBtnWhenSigning").hasClass("leavePreview-active-btn")) {
                //popup提示確定或取消
                $("#withdrawOTReason").blur();
                setTimeout(function() {
                    popupMsgInit(".confirmWithdrawOT");
                }, 100);
            }
        });

        //確認撤回
        $("#confirmWithdrawOTBtn").on("click", function() {
            loadingMask("show");
            recallOvertimeApplyFormQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                overtimeDetailObj["formid"] +
                '</formid><formno>' +
                overtimeDetailObj["formno"] +
                '</formno><reason>' +
                withdrawOTReason +
                '</reason></LayoutHeader>';
            //API
            RecallOvertimeApplyForm();
        });

        $("#enterActualOT").on("click", function() {
            viewAcutalOTApplyShow = true;   
            changePageByPanel("viewOvertimeSubmit");
        });   

        //刪除加班單——popup
        $("#deleteRefuseOT").on("click", function() {
            popupMsgInit(".confirmDeleteOT");
        });

        //確認刪除加班單——click
        $("#confirmDeleteOvertime").on("click", function() {
            loadingMask("show");
            deleteOvertimeFormQueryData = '<LayoutHeader><EmpNo>' +
                myEmpNo +
                '</EmpNo><formid>' +
                overtimeDetailObj["formid"] +
                '</formid></LayoutHeader>';
            //API
            DeleteOvertimeApplyForm();

        });
    }
});