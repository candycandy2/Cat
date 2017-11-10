var leaveDetailList = [
    {leaveid: "572000", categroy: "去年彈休", leave: "去年彈休", leaveday: "1", applyday: "2017-02-14",
    startday: "2017/02/15 8:00", endday: "2017/02/15 17:00", state: "1", agent: "Mary", leavehours: "0"},
    {leaveid: "572001", categroy: "病假", leave: "三天病假", leaveday: "0", applyday: "2017-05-14",
    startday: "2017/05/14 13:00", endday: "2017/05/14 17:00", state: "1", agent: "Jenny", leavehours: "4"},
    {leaveid: "572002", categroy: "事假", leave: "特殊事假", leaveday: "2", applyday: "2017-08-14",
    startday: "2017/08/16 8:00", endday: "2017/08/17 17:00", state: "1", agent: "Jack", leavehours: "0"},
];

var leaveSignStr = langStr["str_147"];    //表單簽核中
var leaveRefuseStr = langStr["str_150"];    //表單已拒絕
var leaveWithdrawStr = langStr["str_148"];    //表單已撤回
var leaveEffectStr = langStr["str_149"];    //表單已生效
var leaveRevokeStr = langStr["str_157"];    //銷假申請
var leaveQueryStr = langStr["str_078"];    //假單查詢
var withdrawReason,dispelReason;

$("#viewLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //請假單頁初始化
        function leaveQueryInit() {
            $("#backDetailList").hide();
            $("#backSignPreview").hide();
            $("#backEffectPreview").hide();
            $(".leave-query-detail-sign").hide();          
            $(".leave-query-detail-refuse").hide();
            $(".leave-query-detail-withdraw").hide();
            $(".leave-query-detail-effect").hide();
            $(".leave-query-detail-back").hide();
            $(".leave-query-withdraw").hide();
            $(".leave-query-dispel").hide();
            $(".leaveMenu").show();
            $(".leave-query-main").show();
            $("#viewLeaveQuery .ui-title").find("span").text(leaveQueryStr);
        }

        //從銷假返回詳情
        function backLeaveToDetail() {
            $(".leave-query-dispel").hide();
            $("#backEffectPreview").hide();
            $(".leave-query-detail-effect").show();
            $("#backDetailList").show();
            $("#viewLeaveQuery .ui-title").find("span").text(leaveQueryStr);
            //$("#dispelReason").removeAttr("readonly");
        }

        //給 “請假申請” 頁面賦值
        function setDataToLeaveApply(apply, num, type, agent, start, end, reason, base) {
            //修改申請日期
            $("#applyDay").text(apply);

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

            //檢查是否可以預覽送簽
            checkLeaveBeforePreview();
        }

        /********************************** page event *************************************/
        $("#viewLeaveQuery").on("pagebeforeshow", function(event, ui) {
            $(".leaveMenu").show();
        });

        $("#viewLeaveQuery").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveQuery").keypress(function(event) {
        });

        //點擊詳細，根據不同表單狀態顯示不同頁面——click
        $(".leave-query-state").on("click", function() {
            //var self = $(this).children("span").eq(0).text();
            var self = $.trim($(this).text());
            //console.log(self);

            if(self == leaveSignStr) {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-sign").show();
            }else if(self == leaveRefuseStr) {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-refuse").show();
            }else if(self == leaveWithdrawStr) {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-withdraw").show();
            }else if(self == leaveEffectStr) {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-effect").show();
            }else {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-back").show();
            }
        });

        //返回假單列表——click
        $("#backDetailList").on("click", function() {
            $("#backDetailList").hide();
            $(".leave-query-detail-sign").hide();
            $(".leave-query-detail-refuse").hide();
            $(".leave-query-detail-withdraw").hide();
            $(".leave-query-detail-effect").hide();
            $(".leave-query-detail-back").hide();
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
                //如果可以點擊，則彈窗提示確認或取消
                popupMsgInit(".confirmWithdraw");
            }
        });

        //確認撤回
        $("#comfirmWithdrawLeave").on("click", function() {
            leaveQueryInit();
            $("#withdrawLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //刪除假單（拒絕狀態下）彈框——popup
        $("#deleteRefuseLeave").on("click", function() {
            popupMsgInit(".confirmDelete");
        });

        //刪除假單（撤回狀態下）彈框——popup
        $("#deleteWithdrawLeave").on("click", function() {
            popupMsgInit(".confirmDelete");
        });

        //確認刪除假單——click
        $("#comfirmDeleteLeave").on("click", function() {
            leaveQueryInit();
            $("#deleteLeaveMsg.popup-msg-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //編輯假單（決絕狀態下）
        $("#editRefuseLeave").on("click", function() {
            var bortherNode = $(this).parent().parent().children("div");
            var applyText = bortherNode.eq(0).children("div").eq(0).children("span").eq(1).text();
            var leavenumText = bortherNode.eq(0).children("div").eq(1).children("span").eq(1).text();
            var leaveText = bortherNode.eq(3).children("div").eq(2).children("span").text();
            var agentText = bortherNode.eq(4).children("div").eq(2).children("span").text();
            var startText = bortherNode.eq(5).children("div").eq(2).children("span").eq(0).text();
            var endText = bortherNode.eq(5).children("div").eq(2).children("span").eq(2).text();
            var reasonText = bortherNode.eq(7).children("div").eq(2).children("span").text();
            var baseText = "2017-10-24"

            $("#backDetailList").click();
            changePageByPanel("viewLeaveSubmit");

            //跳轉到 “請假申請” 頁面進行編輯
            setDataToLeaveApply(applyText, leavenumText, leaveText, agentText, startText, endText, reasonText, baseText);
        });

        //刪除假單（撤回狀態下）
        $("#editWithdrawLeave").on("click", function() {
            var bortherNode = $(this).parent().parent().children("div");
            var applyText = bortherNode.eq(0).children("div").eq(0).children("span").eq(1).text();
            var leavenumText = bortherNode.eq(0).children("div").eq(1).children("span").eq(1).text();
            var leaveText = bortherNode.eq(3).children("div").eq(2).children("span").text();
            var agentText = bortherNode.eq(4).children("div").eq(2).children("span").text();
            var startText = bortherNode.eq(5).children("div").eq(2).children("span").eq(0).text();
            var endText = bortherNode.eq(5).children("div").eq(2).children("span").eq(2).text();
            var reasonText = bortherNode.eq(7).children("div").eq(2).children("span").text();
            var baseText = "2017-10-24"

            $("#backDetailList").click();
            changePageByPanel("viewLeaveSubmit");

            //跳轉到 “請假申請” 頁面進行編輯
            setDataToLeaveApply(applyText, leavenumText, leaveText, agentText, startText, endText, reasonText, baseText);
        });

        //銷假申請——click
        $("#dispelLeave").on("click", function() {
            $("#viewLeaveQuery .ui-title").find("span").text(leaveRevokeStr);
            $(".leave-query-detail-effect").hide();
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