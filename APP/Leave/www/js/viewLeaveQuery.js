var leaveDetailList = [
    {leaveid: "572000", categroy: "去年彈休", leave: "去年彈休", leaveday: "1", applyday: "2017-02-14",
    startday: "2017/02/15 8:00", endday: "2017/02/15 17:00", state: "1", agent: "Mary", leavehours: "0"},
    {leaveid: "572001", categroy: "病假", leave: "三天病假", leaveday: "0", applyday: "2017-05-14",
    startday: "2017/05/14 13:00", endday: "2017/05/14 17:00", state: "1", agent: "Jenny", leavehours: "4"},
    {leaveid: "572002", categroy: "事假", leave: "特殊事假", leaveday: "2", applyday: "2017-08-14",
    startday: "2017/08/16 8:00", endday: "2017/08/17 17:00", state: "1", agent: "Jack", leavehours: "0"},
];

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
            $(".leave-query-withdraw").hide();
            $(".leave-query-dispel").hide();
            $(".leaveMenu").show();
            $(".leave-query-main").show();
        }

        //從銷假返回詳情
        function backLeaveToDetail() {
            $(".leave-query-dispel").hide();
            $("#backEffectPreview").hide();
            $("#comfirmDispel").hide();
            $("#cancelApply").hide();
            $(".leave-query-detail-effect").show();
            $("#previewDispel").show();
            $("#backDetailList").show();
            $("#dispelReason").removeAttr("readonly");
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
            var self = $(this).next().children().find('.leave-id').text();
            var leaveState = $(this).children("span").first().text();
            //console.log(leaveState);

            if(leaveState == "表單簽核中") {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-sign").show();
            }else if(leaveState =="表單已拒絕") {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-refuse").show();
            }else if(leaveState =="表單已撤回") {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-withdraw").show();
            }else if(leaveState =="表單已生效") {
                $(".leaveMenu").hide();
                $(".leave-query-main").hide();
                $("#backDetailList").show();
                $(".leave-query-detail-effect").show();
            }
            

        });

        //返回假單列表——click
        $("#backDetailList").on("click", function() {
            $("#backDetailList").hide();
            $(".leave-query-detail-sign").hide();
            $(".leave-query-detail-refuse").hide();
            $(".leave-query-detail-withdraw").hide();
            $(".leave-query-detail-effect").hide();
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

        //已拒絕狀態——click——popup
        $("#effectLeaveDetail").on("click", function() {
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

        //輸入撤回理由——keyup
        $("#withdrawReason").on("keyup", function() {
            withdrawReason = $(this).val();

            if(withdrawReason !== "") {
                $("#confirmWithdrawBtn").addClass("leavePreview-active-btn");
            }else {
                $("#confirmWithdrawBtn").removeClass("leavePreview-active-btn");
            }
        });

        //撤回假單按鈕——click
        $("#confirmWithdrawBtn").on("click", function() {
            if($("#confirmWithdrawBtn").hasClass("leavePreview-active-btn")) {
                //如果可以點擊，則彈窗提示確認或取消
                popupMsgInit(".confirmWithdraw");
            }
        });

        //確認撤回
        $("#comfirmWithdrawLeave").on("click", function() {
            leaveQueryInit();
            $("#withdrawLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //刪除假單彈框——popup
        $("#deleteRefuseLeave").on("click", function() {
            popupMsgInit(".confirmDelete");
        });

        //刪除假單彈框——popup
        $("#deleteWithdrawLeave").on("click", function() {
            popupMsgInit(".confirmDelete");
        });

        //確認刪除假單——click
        $("#comfirmDeleteLeave").on("click", function() {
            leaveQueryInit();
            $("#deleteLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        //銷假申請——click
        $("#dispelLeave").on("click", function() {
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
                $("#previewDispelBtn").addClass("leavePreview-active-btn");
            }else {
                $("#previewDispelBtn").removeClass("leavePreview-active-btn");
            }
        });

        //預覽送簽——click
        $("#previewDispelBtn").on("click", function() {
            if($("#previewDispelBtn").hasClass("leavePreview-active-btn")) {
                $("#dispelReason").attr("readonly", "readonly");
                $("#previewDispel").hide();
                $("#comfirmDispel").show();
                $("#cancelApply").show();
            } 
        });

        //確定送簽——click
        $("#comfirmDispel").on("click", function() {
            leaveQueryInit();
            $("#backLeaveMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
            
        });

        //取消申請(同返回操作一樣)——click
        $("#cancelApply").on("click", function() {
            backLeaveToDetail();
        });
    }
});