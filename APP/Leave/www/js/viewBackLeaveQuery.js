var backLeaveStateSign = langStr["str_147"];    //表單簽核中
var backLeaveStateWithdraw = langStr["str_148"];    //表單已撤回
var backLeaveStateEffect = langStr["str_149"];  //表單已生效
var backLeaveStateRefuse = langStr["str_150"];  //表單已拒絕
var signToWithdrawReason;


$("#viewBackLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
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



        /********************************** page event *************************************/
        $("#viewBackLeaveQuery").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewBackLeaveQuery").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewBackLeaveQuery").keypress(function(event) {
            
        });

        //表單狀況詳細情況
        $(".backLeave-query-state").on("click", function() {
            //var self = $(this).attr("data-num");
            var self = $(this).children("span").text();

            if(self === backLeaveStateSign) {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-sign").show();
            }else if(self === backLeaveStateWithdraw) {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-withdraw").show();
            }else if(self === backLeaveStateEffect) {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-effect").show();
            }else if(self === backLeaveStateRefuse) {
                $(".backLeave-query-main").hide();
                $(".leaveMenu").hide();
                $("#backToList").show();
                $(".backLeave-query-detail-refuse").show();
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
            $("#withdrawBackLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
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
            $("#deleteBackLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
        });

    }
});
