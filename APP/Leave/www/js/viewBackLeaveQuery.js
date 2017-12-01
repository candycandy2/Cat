var backLeaveStateSign = langStr["str_147"];    //表單簽核中
var backLeaveStateWithdraw = langStr["str_148"];    //表單已撤回
var backLeaveStateEffect = langStr["str_149"];  //表單已生效
var backLeaveStateRefuse = langStr["str_150"];  //表單已拒絕
var viewBackLeaveQueryInit = false;
var backLeaveListArr = [];
var backLeaveDetailObj = {};
var backLeaveFormid;
var signToWithdrawReason;


$("#viewBackLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //獲取銷假單列表——<LayoutHeader><EmpNo>0003023</EmpNo></LayoutHeader>
        window.QueryEmployeeLeaveCancelForm = function() {
            
            this.successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] === "1") {      
                    var callbackData = data['Content'][0]["cancelformlist"];
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

                    backLeaveListArr = [];
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

                        backLeaveListArr.push(leaveObject);
                    }

                    //after custom API
                    setBackLeaveList();
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryEmployeeLeaveCancelForm", self.successCallback, self.failCallback, queryEmployeeLeaveCancelFormQueryData, "");
            }();
        };

        //獲取銷假單詳情——<EmpNo>0409132</EmpNo><formid>123456</formid>
        window.LeaveCancelFormDetail = function() {
            
            this.successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] === "1") {
                    //1.回傳假單詳細信息
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var applydate = $("applydate", htmlDom);
                    var reasons = $("reason", htmlDom);
                    var refleaveformid = $("refleaveformid", htmlDom);
                    var refleaveformno = $("refleaveformno", htmlDom);

                    //补全另一部分详情
                    backLeaveDetailObj["applydate"] = $(applydate).html();
                    backLeaveDetailObj["reason"] = $(reasons).html();
                    backLeaveDetailObj["refleaveformid"] = $(refleaveformid).html();
                    backLeaveDetailObj["refleaveformno"] = $(refleaveformno).html();

                    //改变详情页内容
                    setBackLeaveDataToDetail();

                    //2.回傳簽核流程
                    var approveData = data['Content'][0]["approverecord"];
                    var approveDom = new DOMParser().parseFromString(approveData, "text/html");
                    var serialArr = $("app_serial", approveDom);
                    var empnameArr = $("app_emp_name", approveDom);
                    var ynArr = $("app_yn", approveDom);
                    var dateArr = $("app_date", approveDom);
                    var remarkArr = $("app_remark", approveDom);

                    var backLeaveSignList = [];
                    //首先遍历签核状态，再生成html元素
                    getSignFlow(backLeaveSignList, serialArr, empnameArr, ynArr, dateArr, remarkArr);
                    setLeaveFlowToPopup(backLeaveSignList, ".backLeave-flow-ul");

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", false, "LeaveCancelFormDetail", self.successCallback, self.failCallback, leaveCancelFormDetailQueryData, "");
            }();
        };

        //撤回銷假單——<EmpNo>0409132</EmpNo><formid>123456</formid><formno>572000</formno><reason>測試</reason>
        window.RecallLeaveCancelForm = function() {
            
            this.successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);
                    
                    if($(successMsg).html() !== undefined) {
                        //成功后先返回假单列表，再重新呼叫API获取最新数据
                        $("#backToSign").trigger("click");
                        $("#backToList").trigger("click");
                        QueryEmployeeLeaveCancelForm();
                        $("#withdrawBackLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        var errorMsg = $("error", htmlDom);
                        $('.backLeaveErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.backLeaveErrorMsg');
                    }

                    $("#signTowithdrawReason").val("");
                    $("#signToWithdrawBtn").removeClass("leavePreview-active-btn");
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "RecallLeaveCancelForm", self.successCallback, self.failCallback, recallLeaveCancelFormQueryData, "");
            }();
        };

        //刪除銷假單——<EmpNo>0409132</EmpNo><formid>123456</formid>
        window.DeleteLeaveCancelForm = function() {
            
            this.successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var successMsg = $("success", htmlDom);

                    if($(successMsg).html() !== undefined) {
                        //成功后先返回假单列表，再重新呼叫API获取最新数据
                        $("#backToList").trigger("click");
                        QueryEmployeeLeaveCancelForm();
                        $("#deleteBackLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
                    } else {
                        var errorMsg = $("error", htmlDom);
                        $('.backLeaveErrorMsg').find('.header-text').html($(errorMsg).html());
                        popupMsgInit('.backLeaveErrorMsg');
                    }
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "DeleteLeaveCancelForm", self.successCallback, self.failCallback, deleteLeaveCancelFormQueryData, "");
            }();
        };

        //从“销假单详情”跳转到“请假单详情”
        window.BackLeaveFormLeaveDetail = function() {
            
            this.successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] === "1") {
                    //1.回傳假單詳細信息
                    var callbackData = data['Content'][0]["result"];
                    var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                    var formid = $("formid", htmlDom);
                    var formno = $("formno", htmlDom);
                    var applydate = $("applydate", htmlDom);
                    var status = $("status", htmlDom);
                    var leaveid = $("leaveid", htmlDom);
                    var begindate = $("begindate", htmlDom);
                    var begintime = $("begintime", htmlDom);
                    var enddate = $("enddate", htmlDom);
                    var endtime = $("endtime", htmlDom);
                    var leavedays = $("days", htmlDom);
                    var leavehours = $("hours", htmlDom);
                    var delegate = $("delegate", htmlDom);
                    var reasons = $("reason", htmlDom);
                    var datumdate = $("datumdate", htmlDom);
                    var filestatus = $("filestatus", htmlDom);

                    var obj = {};
                    //查找类别和假别
                    for(var i in LeaveObjList) {
                        if(LeaveObjList[i]["leaveid"] == $(leaveid).html()) {
                            obj["name"] = LeaveObjList[i]["name"];
                            obj["category"] = LeaveObjList[i]["category"];
                        }
                    }
                    //转换status
                    if($(status[i]).html() == "AP") {
                        obj["statusName"] = formEffected;
                    } else if($(status[i]).html() == "RC") {
                        obj["statusName"] = formWithdrawed;
                    } else if($(status[i]).html() == "RJ") {
                        obj["statusName"] = formRefused;
                    } else {
                        obj["statusName"] = formSigning;
                    }

                    //根据代理人工号，查找代理人姓名
                    queryEmployeeDetailQueryData = '<LayoutHeader><EmpNo>'
                                                 + myEmpNo
                                                 + '</EmpNo><qEmpno>'
                                                 + $(delegate).html()
                                                 + '</qEmpno><qName></qName></LayoutHeader>';
                    //根据id获取代理人姓名
                    QueryEmployeeDetail();
                    obj["agentname"] = $(employeeName).html();

                    //传值给假单查询页
                    $("#leaveApplyDate").text(dateFormatter($(applydate).html()));
                    $("#leaveFormNo").text($(formno).html());
                    $("#leaveStatus").text(leaveDetailObj["statusName"]);
                    $("#leaveCategory").text(obj["category"]);
                    $("#leaveName").text(obj["name"]);
                    $("#leaveAgentName").text(obj["agentname"]);
                    $("#leaveStartDate").text(dateFormatter($(begindate).html()));
                    $("#leaveStartTime").text($(begintime).html());
                    $("#leaveEndDate").text(dateFormatter($(enddate).html()));
                    $("#leaveEndTime").text($(endtime).html());
                    $("#leaveApplyDays").text($(leavedays).html());
                    $("#leaveApplyHours").text($(leavehours).html());
                    $("#leaveApplyReason").text($(reasons).html());

                    // //2.回傳簽核流程
                    var approveData = data['Content'][0]["approverecord"];
                    var approveDom = new DOMParser().parseFromString(approveData, "text/html");
                    var serialArr = $("app_serial", approveDom);
                    var empnameArr = $("app_emp_name", approveDom);
                    var ynArr = $("app_yn", approveDom);
                    var dateArr = $("app_date", approveDom);
                    var remarkArr = $("app_remark", approveDom);

                    var backLeaveToLeaveSignList = [];
                    getSignFlow(backLeaveToLeaveSignList, serialArr, empnameArr, ynArr, dateArr, remarkArr);
                    setLeaveFlowToPopup(backLeaveToLeaveSignList, ".leave-flow-ul");

                    //返回，跳转，再show         
                    $("#backToList").trigger("click");
                    changePageByPanel("viewLeaveQuery");
                    leaveListToDetail("leaveRevoke", "leaveWithdraw", "leaveDelete", null);

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "LeaveApplyFormDetail", self.successCallback, self.failCallback, backLeaveFormLeaveDetailQueryData, "");
            }();
        };

        //請假單頁初始化
        function backLeaveQueryInit() {
            $("#backToList").hide();
            $("#backToSign").hide();
            //$("#backEffectPreview").hide();
            $(".backLeave-query-detail-sign").hide();          
            $(".backLeave-query-detail-refuse").hide();
            $(".backLeave-query-detail-withdraw").hide();
            $(".backLeave-query-detail-effect").hide();
            $(".backLeave-query-sign-withdraw").hide();
            //$(".backLeave-query-dispel").hide();
            $(".leaveMenu").show();
            $(".backLeave-query-main").show();
        }

        //動態生成HTML
        function setBackLeaveList() {
            var backLeaveHtml = "";
            for(var i in backLeaveListArr) {
                backLeaveHtml += '<div class="backLeave-query-list">' + 
                                    '<div>' +
                                        '<div class="backLeave-query-state font-style3" form-id="' + backLeaveListArr[i]["formid"] + '">' +
                                            '<span>' + backLeaveListArr[i]["statusName"] + '</span>' +
                                            '<img src="img/more.png">' +
                                        '</div>' +
                                        '<div class="backLeave-query-base font-style10">' +
                                            '<div class="backLeave-query-basedata">' +
                                                '<div>' +
                                                    '<span>請假單號：</span>' +
                                                    '<span class="leave-id">' + backLeaveListArr[i]["formno"] + '</span>' +
                                                '</div>' +
                                                '<div>' +
                                                    '<span>假別：</span>' +
                                                    '<span>' + backLeaveListArr[i]["name"] + '</span>' +
                                                '</div>' +
                                            '</div>' +
                                            '<div>' +
                                                '<span>請假區間：</span>' +
                                                '<span>' + backLeaveListArr[i]["begindate"] + ' ' + backLeaveListArr[i]["begintime"] + '</span>' +
                                                '<span> - </span>' +
                                                '<span>' + backLeaveListArr[i]["enddate"] + ' ' + backLeaveListArr[i]["endtime"] + '</span>' +
                                            '</div>' +
                                            '<div>' +
                                                '<span>請假數：</span>' +
                                                '<span>' + backLeaveListArr[i]["days"] + '</span>' +
                                                '<span> 天 </span>' +
                                                '<span>' + backLeaveListArr[i]["hours"] + '</span>' +
                                                '<span> 小時</span>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div></div>' +
                                '</div>';
            }

            if(backLeaveListArr.length == 0) {
                $("#maxBackLeaveMsg").text("*暫無假單記錄");
            } else {
                $("#maxBackLeaveMsg").text("*僅顯示近10筆假單記錄");
                $(".backLeave-query-main-list").empty().append(backLeaveHtml);
            }

        }

        //从销假单列表到详情
        function backLeaveToDetail(btn1, btn2, state) {
            $(".backLeave-query-main").hide();
            $(".leaveMenu").hide();
            $("#backToList").show();
            $(".backLeave-query-detail-sign").show();
            if(state == null) {
                $("#"+btn1).hide();     
            } else {
                $("#"+btn1).show();
            }
            $("#"+btn2).hide();
        }

        //根据formid从销假单列表当中获取该假单部分信息
        function getBackLeaveDetailByID(id) {
            for(var i in backLeaveListArr) {
                if(id == backLeaveListArr[i]["formid"]) {
                    return backLeaveListArr[i];
                }
            }
        }

        //详情页传值
        function setBackLeaveDataToDetail() {
            $("#backLeaveAppltDate").text(dateFormatter(backLeaveDetailObj["applydate"]));
            $("#backLeaveFormNo").text(backLeaveDetailObj["formno"]);
            $("#backLeaveStatus").text(backLeaveDetailObj["statusName"]);
            $("#refLeaveFormNo").text(backLeaveDetailObj["refleaveformno"]);
            //给销假单动态添加一个属性leave-id，即请假单编号
            $("#signToLeaveDetail").attr("leave-id", backLeaveDetailObj["refleaveformid"]);
            $("#backLeaveApplyReason").text(backLeaveDetailObj["reason"]);
        }

        /********************************** page event *************************************/
        $("#viewBackLeaveQuery").on("pagebeforeshow", function(event, ui) {
            if(!viewBackLeaveQueryInit) {
                //setBackLeaveList();
                viewBackLeaveQueryInit = true;
            }

        });

        $("#viewBackLeaveQuery").on("pageshow", function(event, ui) {

            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewBackLeaveQuery").keypress(function(event) {
            
        });

        //表單狀況詳細情況
        $(document).on("click", ".backLeave-query-state", function() {
            loadingMask("show");
            var self = $.trim($(this).text());
            backLeaveFormid = $(this).attr("form-id");

            //先获取部分详情从销假单列表当中，另外部分详情从详情API中获取
            backLeaveDetailObj = getBackLeaveDetailByID(backLeaveFormid);

            leaveCancelFormDetailQueryData = '<LayoutHeader><EmpNo>' +
                                             myEmpNo +
                                             '</EmpNo><formid>' +
                                             backLeaveFormid +
                                             '</formid></LayoutHeader>';

            //呼叫API
            LeaveCancelFormDetail();

            if(self == formSigning) {
                backLeaveToDetail("backLeaveWithdraw", "backLeaveDelete", "");
            } else if(self == formWithdrawed) {
                backLeaveToDetail("backLeaveDelete", "backLeaveWithdraw", "");
            } else {
                backLeaveToDetail("backLeaveWithdraw", "backLeaveDelete", null);
            }

            
        });

        //返回銷假單列表
        $("#backToList").on("click", function() {
            $("#backToList").hide();
            $(".backLeave-query-detail-sign").hide();
            $(".backLeave-query-detail-refuse").hide();
            $(".backLeave-query-detail-withdraw").hide();
            $(".backLeave-query-detail-effect").hide();
            $(".backLeave-query-main").show();
            $(".leaveMenu").show();
            return false;
        });

        //簽核中流程——popup
        $("#backLeaveSignFlow").on("click", function() {
            popupMsgInit(".signIngFlow");
        });

        //撤回銷假單
        $("#withdrawBackLeaveBtn").on("click", function() {
            $("#backToList").hide();
            $(".backLeave-query-detail-sign").hide();
            $("#backToSign").show();
            $(".backLeave-query-sign-withdraw").show();
        });

        //返回簽核中詳情
        $("#backToSign").on("click", function() {
            $("#backToSign").hide();
            $(".backLeave-query-sign-withdraw").hide();
            $("#backToList").show();
            $(".backLeave-query-detail-sign").show();
            return false;
        });

        //輸入撤回理由——textarea
        $("#signTowithdrawReason").on("keyup", function() {
            signToWithdrawReason = $(this).val();

            if(signToWithdrawReason !== "") {
                $("#signToWithdrawBtn").addClass("leavePreview-active-btn");
            }else {
                $("#signToWithdrawBtn").removeClass("leavePreview-active-btn");
            }
        });

        //撤回銷假單——click
        $("#signToWithdrawBtn").on("click", function() {
            if($("#signToWithdrawBtn").hasClass("leavePreview-active-btn")) {
                popupMsgInit(".confirmToWithdraw");
            }
        });

        //確定撤回
        $("#comfirmWithdrawBackLeave").on("click", function() {
            recallLeaveCancelFormQueryData = '<LayoutHeader><EmpNo>'
                                            + myEmpNo
                                            + '</EmpNo><formid>'
                                            + backLeaveDetailObj["formid"]
                                            + '</formid><formno>'
                                            + backLeaveDetailObj["formno"]
                                            + '</formno><reason>'
                                            + backLeaveDetailObj["reason"]
                                            + '</reason></LayoutHeader>';
        
            //呼叫API
            //RecallLeaveCancelForm();

            //API写好后，放在success里
            $("#backToSign").trigger("click");
            $("#backToList").trigger("click");
            QueryEmployeeLeaveCancelForm();
            $("#withdrawBackLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
            //清空文本，并改变按钮状态
            $("#signTowithdrawReason").val("");
            $("#signToWithdrawBtn").removeClass("leavePreview-active-btn");
        });

        //刪除銷假單——popup
        $("#deleteBackLeaveBtn").on("click", function() {
            popupMsgInit(".confirmToDelete");
        });

        //確定刪除銷假單——click
        $("#comfirmDeleteBackLeave").on("click", function() {
            deleteLeaveCancelFormQueryData = '<LayoutHeader><EmpNo>'
                                            + myEmpNo
                                            + '</EmpNo><formid>'
                                            + backLeaveDetailObj["formid"]
                                            + '</formid></LayoutHeader>';

            //呼叫API
            //DeleteLeaveCancelForm();

            //API写好后，放在success里
            $("#backToList").trigger("click");
            QueryEmployeeLeaveCancelForm();
            $("#deleteBackLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);

        });

        //根據“請假單號”跳轉到請假單詳情頁
        $("#signToLeaveDetail").on("click", function() {
            loadingMask("show");
            leaveDetailFrom = false;
            var refLeaveid = $(this).attr("leave-id");
            //console.log(refLeaveid);
            backLeaveFormLeaveDetailQueryData = '<LayoutHeader><EmpNo>'
                                                + myEmpNo
                                                + '</EmpNo><formid>'
                                                + refLeaveid
                                                + '</formid></LayoutHeader>';
            //呼叫API
            BackLeaveFormLeaveDetail();
            

        });

    }
});
