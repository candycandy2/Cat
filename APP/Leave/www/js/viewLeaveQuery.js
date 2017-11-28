var leaveSignStr = langStr["str_147"];    //表單簽核中
var leaveRefuseStr = langStr["str_150"];    //表單已拒絕
var leaveWithdrawStr = langStr["str_148"];    //表單已撤回
var leaveEffectStr = langStr["str_149"];    //表單已生效
var leaveRevokeStr = langStr["str_157"];    //銷假申請
var leaveQueryStr = langStr["str_078"];    //假單查詢
var viewLeaveQueryInit = false;
var formSigning = "表單簽核中";
var formRefused = "表單已拒絕";
var formWithdrawed = "表單已撤回";
var formEffected = "表單已生效";
var signedStr = "已簽核";
var withdrawedStr = "已撤銷";
var rejectedStr = "已拒絕";
var notSignStr = "未簽核";
var detailFromPage;
var employeeName;
var leaveListArr = [];
var leaveDetailObj = {};
var withdrawReason,dispelReason;

//請假單頁初始化
function leaveQueryInit() {
    $("#backDetailList").hide();
    $("#backSignPreview").hide();
    $("#backEffectPreview").hide();
    $(".leave-query-detail-sign").hide();
    $(".leave-query-withdraw").hide();
    $(".leave-query-dispel").hide();
    $(".leaveMenu").show();
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
                if(data['ResultCode'] === "1") {
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
                    for(var i = 0; i < formidArr.length; i++) {
                        var leaveObject = {};
                        leaveObject["formid"] = $(formidArr[i]).html();
                        leaveObject["formno"] = $(formnoArr[i]).html();
                        leaveObject["status"] = $(statusArr[i]).html();
                        leaveObject["leaveid"] = $(leaveidArr[i]).html();
                        leaveObject["begindate"] = $(begindateArr[i]).html();
                        leaveObject["begintime"] = $(begintimeArr[i]).html();
                        leaveObject["enddate"] = $(enddateArr[i]).html();
                        leaveObject["endtime"] = $(endtimeArr[i]).html();
                        leaveObject["days"] = $(leavedaysArr[i]).html();
                        leaveObject["hours"] = $(leavehoursArr[i]).html();

                        //表單簽核的4種狀態
                        if($(statusArr[i]).html() == "AP") {
                            leaveObject["statusName"] = formEffected;
                        } else if($(statusArr[i]).html() == "RC") {
                            leaveObject["statusName"] = formWithdrawed;
                        } else if($(statusArr[i]).html() == "RJ") {
                            leaveObject["statusName"] = formRefused;
                        } else {
                            leaveObject["statusName"] = formSigning;
                        }

                        //銷假狀態
                        if($(cancelstatusArr[i]).html() !== "") {
                            leaveObject["cancelstatus"] = "（"+$(cancelstatusArr[i]).html()+"）";
                        } else {
                            leaveObject["cancelstatus"] = "";
                        }

                        //添加假别名称
                        for(var j = 0; j < LeaveObjList.length; j++) {
                            if(leaveObject["leaveid"] == LeaveObjList[j]["leaveid"]) {
                                leaveObject["name"] = LeaveObjList[j]["name"];
                                leaveObject["category"] = LeaveObjList[j]["category"];
                                break;
                            } else {
                                leaveObject["name"] = "";
                                leaveObject["category"] = "";
                            }
                        }

                        leaveListArr.push(leaveObject);
                    }

                    //after custom API
                    //setAllLeaveList();

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", false, "QueryEmployeeLeaveApplyForm", self.successCallback, self.failCallback, queryEmployeeLeaveApplyFormQueryData, "");
            }();
        };

        //獲取請假單詳情——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid></LayoutHeader>
        window.LeaveApplyFormDetail = function() {
            
            this.successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] === "1") {
                    //1.回傳假單詳細信息
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var applydate = $("applydate", htmlDom);
                    var delegate = $("delegate", htmlDom);
                    var reasons = $("reason", htmlDom);
                    var datumdate = $("datumdate", htmlDom);
                    var filestatus = $("filestatus", htmlDom);

                    //根据代理人工号，查找代理人姓名
                    queryEmployeeDetailQueryData = '<LayoutHeader><EmpNo>'
                                                 + myEmpNo
                                                 + '</EmpNo><qEmpno>'
                                                 + $(delegate).html()
                                                 + '</qEmpno><qName></qName></LayoutHeader>';
                    //根据id获取代理人姓名
                    QueryEmployeeDetail();
                    leaveDetailObj["agentname"] = $(employeeName).html();

                    //补全另一部分详情
                    leaveDetailObj["applydate"] = $(applydate).html();
                    leaveDetailObj["reason"] = $(reasons).html();
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

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", false, "LeaveApplyFormDetail", self.successCallback, self.failCallback, leaveApplyFormDetailQueryData, "");
            }();
        };

        //撤回請假單——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid><formno>572000</formno><reason>測試</reason></LayoutHeader>
        window.RecallLeaveApplyForm = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    

                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "RecallLeaveApplyForm", self.successCallback, self.failCallback, recallLeaveApplyFormQueryData, "");
            }();
        };

        //刪除請假單——<LayoutHeader><EmpNo>0003023</EmpNo><formid>123456</formid></LayoutHeader>
        window.DeleteLeaveApplyForm = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    //console.log(htmlDom);
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "DeleteLeaveApplyForm", self.successCallback, self.failCallback, deleteLeaveApplyFormQueryData, "");
            }();
        };

        //送出銷假單——<LayoutHeader><EmpNo>0003023</EmpNo><applyformid>512340</applyformid><reason>沒事</reason></LayoutHeader>
        window.SendLeaveCancelFormData = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    
                    
                    
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "SendLeaveCancelFormData", self.successCallback, self.failCallback, sendLeaveCancelFormDataQueryData, "");
            }();
        };

        //查询代理人信息
        window.QueryEmployeeDetail = function() {

            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var department = $("department", htmlDom);
                    var empno = $("empno", htmlDom);
                    employeeName = $("name", htmlDom);

                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", false, "QueryEmployeeData", self.successCallback, self.failCallback, queryEmployeeDetailQueryData, "");
            }();
        };

        //添加所有請假到列表
        function setAllLeaveList() {
            var leaveListHtml = "";
            for(var i in leaveListArr) {
                leaveListHtml += '<div class="leave-query-list">' +
                                    '<div>' +
                                        '<div class="leave-query-state font-style3" form-id="' + leaveListArr[i]["formid"] + '">' +
                                            '<span>' + leaveListArr[i]["statusName"] + '</span>' + 
                                            '<span>' + leaveListArr[i]["cancelstatus"] + '</span>' +
                                            '<img src="img/btn_nextpage.png">' +
                                        '</div>' +
                                        '<div class="leave-query-base font-style10">' +
                                            '<div class="leave-query-basedata">' +
                                                '<div>' +
                                                    '<span>請假單號：</span>' +
                                                    '<span class="leave-id">' + leaveListArr[i]["formno"] + '</span>' +
                                                '</div>' +
                                                '<div>' +
                                                    '<span>假別：</span>' +
                                                    '<span>' + leaveListArr[i]["name"] + '</span>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div>' +
                                                '<span>請假區間：</span>' +
                                                '<span>' + leaveListArr[i]["begindate"] + ' ' + leaveListArr[i]["begintime"] + '</span>' +
                                                '<span> - </span>' +
                                                '<span>' + leaveListArr[i]["enddate"] + ' ' + leaveListArr[i]["endtime"] + '</span>' +
                                            '</div>' +
                                            '<div>' +
                                                '<span>請假數：</span>' +
                                                '<span>' + leaveListArr[i]["days"] + '</span>' +
                                                '<span> 天 </span>' +
                                                '<span>' + leaveListArr[i]["hours"] + '</span>' +
                                                '<span> 小時</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div></div>' +
                                '</div>';
            }
            
            //判断请假单列表是否有数据
            if(leaveListArr.length == 0) {
                $("#maxLeaveMsg").text("*暫無假單記錄");
            } else {
                $("#maxLeaveMsg").text("*僅顯示近10筆假單記錄");
                $(".leave-query-main-list").empty().append(leaveListHtml);
            }
        }

        //從銷假返回詳情
        function backLeaveToDetail() {
            $(".leave-query-dispel").hide();
            $("#backEffectPreview").hide();
            $(".leave-query-detail-sign").show();
            $("#backDetailList").show();
            $("#viewLeaveQuery .ui-title").find("span").text(leaveQueryStr);
        }

        //給 “請假申請” 頁面傳值
        function setDataToLeaveApply(apply, num, category, type, agent, start, end, reason, base, date, time) {
            //修改申請日期
            //$("#applyDay").text(apply);

            //修改類別
            leaveCategory = category;

            //修改假別
            $.each($("#leave-popup-option-list li"), function(i, item) {
                if($(item).text() == type) {
                    $(item).trigger("click");
                    return false;
                }
            });

            //修改代理人
            agentName = agent;
            var agentOption = '<option hidden>' + agent + '</option>';
            $("#leave-agent-popup").find("option").remove().end().append(agentOption);
            tplJS.reSizeDropdownList("leave-agent-popup", "typeB");

            //修改開始日期
            startLeaveDate = start;
            $("#startText").text(start);
            $("#startDate").val(start.replace(" ", "T"));

            //修改結束日期
            endLeaveDate = end;
            $("#endText").text(end);
            $("#endDate").val(end.replace(" ", "T"));

            //修改請假理由
            leaveReason = reason;
            $("#leaveReason").val(reason);

            //修改基準日
            baseday = base;
            $("#chooseBaseday").text(base);

            //請假數
            countApplyDays = date;
            countApplyHours = time;
            $("#leaveDays").text(date);
            $("#leaveHours").text(time);

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        }

        //根据formid从假单列表当中获取该假单部分信息
        function getLeaveDetailByID(id) {
            for(var i in leaveListArr) {
                if(leaveListArr[i]["formid"] == id) {
                    return leaveListArr[i];
                }
            }
        }

        //假單詳情傳值
        function setLeaveDataToDetail() {
            $("#leaveApplyDate").text(dateFormatter(leaveDetailObj["applydate"]));
            $("#leaveFormNo").text(leaveDetailObj["formno"]);
            $("#leaveStatus").text(leaveDetailObj["statusName"]);
            $("#leaveCategory").text(leaveDetailObj["category"]);
            $("#leaveName").text(leaveDetailObj["name"]);
            $("#leaveAgentName").text(leaveDetailObj["agentname"]);
            $("#leaveStartDate").text(leaveDetailObj["begindate"].split("/").join("-"));
            $("#leaveStartTime").text(leaveDetailObj["begintime"]);
            $("#leaveEndDate").text(leaveDetailObj["enddate"].split("/").join("-"));
            $("#leaveEndTime").text(leaveDetailObj["endtime"]);
            $("#leaveApplyDays").text(leaveDetailObj["days"]);
            $("#leaveApplyHours").text(leaveDetailObj["hours"]);
            $("#leaveApplyReason").text(leaveDetailObj["reason"]);
            //撤回頁面的“申請日期”和“請假單號”
            $("#withdrawApplyDate").text(dateFormatter(leaveDetailObj["applydate"]));
            $("#withdrawFormNo").text(leaveDetailObj["formno"]);
            //銷假頁面的“申請日期”和“請假單號”
            $("#revokeApplyDate").text(dateFormatter(leaveDetailObj["applydate"]));
            $("#revokeFormNo").text(leaveDetailObj["formno"]);
        }


        /********************************** page event *************************************/
        $("#viewLeaveQuery").on("pagebeforeshow", function(event, ui) {
            if(!viewLeaveQueryInit) {
                //after custom API
                setAllLeaveList();
                viewLeaveQueryInit = true;
            }
            $(".leaveMenu").show();  
            
        });

        $("#viewLeaveQuery").on("pageshow", function(event, ui) {
            //此变量用来记录详情页是从哪里跳转的，true表示本页（假单页），false表示“销假单页”
            detailFromPage = true;
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveQuery").keypress(function(event) {
        });

        //點擊詳細，根據不同表單狀態顯示不同頁面——click
        $(document).on("click", ".leave-query-state", function() {
            loadingMask("show");
            //var self = $(this).children("span").eq(0).text();
            var self = $.trim($(this).text());
            var formid = $(this).attr("form-id");      

            //先获取部分详情，另外部分详情在API中获取
            leaveDetailObj = getLeaveDetailByID(formid);

            leaveApplyFormDetailQueryData = '<LayoutHeader><EmpNo>' 
                                            + myEmpNo 
                                            + '</EmpNo><formid>' 
                                            + formid 
                                            + '</formid></LayoutHeader>';
            //呼叫API
            LeaveApplyFormDetail();

            if(self == formSigning) {
                leaveListToDetail("leaveWithdraw", "leaveDelete", "leaveRevoke", "");
            }else if(self == formRefused || self == formWithdrawed) {
                leaveListToDetail("leaveDelete", "leaveWithdraw", "leaveRevoke", "");
            }else if(self == formEffected) {
                leaveListToDetail("leaveRevoke", "leaveWithdraw", "leaveDelete", "");
            }else {
                leaveListToDetail("leaveRevoke", "leaveWithdraw", "leaveDelete", null);
            }

        });

        //返回假單列表——click
        $("#backDetailList").on("click", function() {
            $("#backDetailList").hide();
            $(".leave-query-detail-sign").hide();
            $(".leaveMenu").show();
            $(".leave-query-main").show();    
            return false;
        });

        //籤核中狀態——click——popup
        $("#signLeaveDetail").on("click", function() {
            popupMsgInit('.signStateFlow');
        });

        //已撤回狀態——click——popup
        $("#withdrawLeaveDetail").on("click", function() {
            popupMsgInit('.withdrawStateFlow');
        });

        //已拒絕狀態——click——popup
        $("#refuseLeaveDetail").on("click", function() {
            popupMsgInit('.refuseStateFlow');
        });

        //已生效狀態——click——popup
        $("#effectLeaveDetail").on("click", function() {
            popupMsgInit('.effectStateFlow');
        });

        //已銷假狀態——click——popup
        $("#backLeaveDetail").on("click", function() {
            popupMsgInit('.effectStateFlow');
        });

        //撤回按鈕——click
        $("#withdrawLeaveBtn").on("click", function() {
            $(".leave-query-detail-sign").hide();
            $("#backDetailList").hide();
            $(".leave-query-withdraw").show();
            $("#backSignPreview").show();
        });

        //從撤回返回詳情——click
        $("#backSignPreview").on("click", function() {
            $(".leave-query-withdraw").hide();
            $("#backSignPreview").hide();
            $(".leave-query-detail-sign").show();
            $("#backDetailList").show();
            return false;
        });

        //輸入撤回理由——textarea
        $("#withdrawReason").on("keyup", function() {
            withdrawReason = $(this).val();

            if(withdrawReason !== "") {
                $("#confirmWithdrawBtn").addClass("leavePreview-active-btn");
            }else {
                $("#confirmWithdrawBtn").removeClass("leavePreview-active-btn");
            }
        });

        //撤回假單按鈕——popup
        $("#confirmWithdrawBtn").on("click", function() {
            if($("#confirmWithdrawBtn").hasClass("leavePreview-active-btn")) {
                //popup提示確定或取消
                popupMsgInit(".confirmWithdraw");
            }
        });

        //確認撤回
        $("#comfirmWithdrawLeave").on("click", function() {
            recallLeaveApplyFormQueryData = '<LayoutHeader><EmpNo>' +
                                            myEmpNo +
                                            '</EmpNo><formid>' +
                                            leaveDetailObj["formid"] +
                                            '</formid><formno>' +
                                            leaveDetailObj["formno"] +
                                            '</formno><reason>' +
                                            withdrawReason +
                                            '</reason></LayoutHeader>';

            console.log(recallLeaveApplyFormQueryData);
            //API
            //RecallLeaveApplyForm();

            leaveQueryInit();
            $("#withdrawLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //刪除假單——popup
        $("#deleteRefuseLeave").on("click", function() {
            popupMsgInit(".confirmDelete");
        });

        //確認刪除假單——click
        $("#comfirmDeleteLeave").on("click", function() {
            deleteLeaveApplyFormQueryData = '<LayoutHeader><EmpNo>'
                                            + myEmpNo 
                                            + '</EmpNo><formid>'
                                            + leaveDetailObj["formid"]
                                            + '</formid></LayoutHeader>';

            console.log(deleteLeaveApplyFormQueryData);
            //API
            //DeleteLeaveApplyForm();

            leaveQueryInit();
            $("#deleteLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //編輯假單
        $("#editRefuseLeave").on("click", function() {
            var bortherNode = $(this).parent().parent().children("div");
            var applyText = dateFormatter(leaveDetailObj["applydate"]);
            var leavenumText = leaveDetailObj["formid"];
            var categoryText = leaveDetailObj["category"];
            var leaveText = leaveDetailObj["name"];
            var agentText = leaveDetailObj["agentid"];
            var startText = leaveDetailObj["begindate"].split("/").join("-") + " " + leaveDetailObj["begintime"];
            var endText = leaveDetailObj["enddate"].split("/").join("-") + " " + leaveDetailObj["endtime"];
            var reasonText = leaveDetailObj["reason"];
            var baseText = dateFormatter(leaveDetailObj["datumdate"]);
            var daysText = leaveDetailObj["days"];
            var hoursText = leaveDetailObj["hours"];

            $("#backDetailList").click();
            changePageByPanel("viewLeaveSubmit");

            //跳轉到 “請假申請” 頁面進行編輯
            setDataToLeaveApply(applyText, leavenumText, categoryText, leaveText, agentText, startText, endText, reasonText, baseText, daysText, hoursText);
        });

        //銷假申請——click
        $("#dispelLeave").on("click", function() {
            $("#viewLeaveQuery .ui-title").find("span").text(leaveRevokeStr);
            $(".leave-query-detail-sign").hide();
            $("#backDetailList").hide();
            $(".leave-query-dispel").show();
            $("#backEffectPreview").show();
        });

        //從銷假返回詳情——click
        $("#backEffectPreview").on("click", function() {
            backLeaveToDetail();
            return false;
        });

        //輸入銷假理由——keyup
        $("#dispelReason").on("keyup", function() {
            dispelReason = $(this).val();

            if(dispelReason !== "") {
                $("#confirmDispelBtn").addClass("leavePreview-active-btn");
            }else {
                $("#confirmDispelBtn").removeClass("leavePreview-active-btn");
            }
        });

        //確定銷假送簽——click
        $("#confirmDispelBtn").on("click", function() {
            if($("#confirmDispelBtn").hasClass("leavePreview-active-btn")) {
                popupMsgInit(".confirmRevoke");
            } 
        });

        //確定銷假
        $("#comfirmRevokeLeave").on("click", function() {
            sendLeaveCancelFormDataQueryData = '<LayoutHeader><EmpNo>'
                                                + myEmpNo
                                                + '</EmpNo><applyformid>'
                                                + leaveDetailObj["formid"]
                                                + '</applyformid><reason>'
                                                + dispelReason
                                                + '</reason></LayoutHeader>';
            
            console.log(sendLeaveCancelFormDataQueryData);
            //API
            //SendLeaveCancelFormData();

            leaveQueryInit();
            changePageByPanel("viewBackLeaveQuery");
            $("#backLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //取消申請(同返回操作一致)——click
        $("#cancelApply").on("click", function() {
            backLeaveToDetail();
        });
        
    }
});