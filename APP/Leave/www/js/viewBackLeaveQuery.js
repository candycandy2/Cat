var backLeaveStateSign = langStr["str_147"];    //表單簽核中
var backLeaveStateWithdraw = langStr["str_148"];    //表單已撤回
var backLeaveStateEffect = langStr["str_149"];  //表單已生效
var backLeaveStateRefuse = langStr["str_150"];  //表單已拒絕
var viewBackLeaveQueryInit = false;
var backLeaveListArr = [];
var signToWithdrawReason;


$("#viewBackLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //獲取銷假單列表——<LayoutHeader><EmpNo>0003023</EmpNo></LayoutHeader>
        window.QueryEmployeeLeaveCancelForm = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {      
                    var callbackData = data['Content'][0]["cancelformlist"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    var formidArr = $("formid", htmlDoc);
                    var formnoArr = $("formno", htmlDoc);
                    var statusArr = $("status", htmlDoc);
                    var leaveidArr = $("leaveid", htmlDoc);
                    var begindateArr = $("begindate", htmlDoc);
                    var begintimeArr = $("begintime", htmlDoc);
                    var enddateArr = $("enddate", htmlDoc);
                    var endtimeArr = $("endtime", htmlDoc);
                    var leavedaysArr = $("days", htmlDoc);
                    var leavehoursArr = $("hours", htmlDoc);

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
                    //setBackLeaveList();
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", false, "QueryEmployeeLeaveCancelForm", self.successCallback, self.failCallback, QueryEmployeeLeaveCancelFormQueryData, "");
            }();
        };

        //獲取銷假單詳情——<EmpNo>0409132</EmpNo><formid>123456</formid>
        window.LeaveCancelFormDetail = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    //console.log(htmlDoc);
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "LeaveCancelFormDetail", self.successCallback, self.failCallback, LeaveCancelFormDetailQueryData, "");
            }();
        };

        //撤回銷假單——<EmpNo>0409132</EmpNo><formid>123456</formid><formno>572000</formno><reason>測試</reason>
        window.RecallLeaveCancelForm = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    //console.log(htmlDoc);
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "RecallLeaveCancelForm", self.successCallback, self.failCallback, RecallLeaveCancelFormQueryData, "");
            }();
        };

        //刪除銷假單——<EmpNo>0409132</EmpNo><formid>123456</formid>
        window.DeleteLeaveCancelForm = function() {
            
            this.successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] === "1") {
                    var callbackData = data['Content'][0]["result"];
                    var htmlDoc = new DOMParser().parseFromString(callbackData, "text/html");
                    //console.log(htmlDoc);
                }
            };

            this.failCallback = function(data) {
            };

            var __construct = function() {
                CustomAPI("POST", true, "DeleteLeaveCancelForm", self.successCallback, self.failCallback, DeleteLeaveCancelFormQueryData, "");
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
                                            '<img src="img/btn_nextpage.png">' +
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

        /********************************** page event *************************************/
        $("#viewBackLeaveQuery").on("pagebeforeshow", function(event, ui) {
            if(!viewBackLeaveQueryInit) {
                setBackLeaveList();
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
            //var self = $(this).children("span").eq(0).text();
            var self = $.trim($(this).text());
            console.log(self);
            var formid = $(this).attr("form-id");
            console.log(formid);

            if(self == formSigning) {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-sign").show();
                $("#backLeaveWithdraw").show();
                $("#backLeaveDelete").hide();
            } else if(self == formWithdrawed) {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-sign").show();
                $("#backLeaveWithdraw").hide();
                $("#backLeaveDelete").show();
            } else {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-sign").show();
                $("#backLeaveWithdraw").hide();
                $("#backLeaveDelete").hide();
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
            backLeaveQueryInit();
            $("#withdrawBackLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //已拒絕流程——popup
        $("#backLeaveRefuseFlow").on("click", function() {
            popupMsgInit(".refuseIngFlow");
        });

        //已撤回流程——popup
        $("#backLeaveWithdrawFlow").on("click", function() {
            popupMsgInit(".withdrawIngFlow");
        });

        //已生效流程——popup
        $("#backLeaveEffectFlow").on("click", function() {
            popupMsgInit(".effectIngFlow");
        });

        //刪除銷假單——popup
        $("#deleteBackLeaveBtn").on("click", function() {
            popupMsgInit(".confirmToDelete");
        });

        //確定刪除銷假單——click
        $("#comfirmDeleteBackLeave").on("click", function() {
            backLeaveQueryInit();
            $("#deleteBackLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //根據“請假單號”跳轉到請假單詳情頁
        $(".return-leave-detail").on("click", function() {
            $("#backToList").trigger("click");
            changePageByPanel("viewLeaveQuery");
            //同viewLeaveQuery的銷假狀態
            $(".leaveMenu").hide();
            $(".leave-query-main").hide();
            $("#backDetailList").show();
            $(".leave-query-detail-back").show();
        });

    }
});
