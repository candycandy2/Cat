var leaveDetailList = [
    {leaveid: "572000", categroy: "去年彈休", leave: "去年彈休", leaveday: "1", applyday: "2017-02-14",
    startday: "2017/02/15 8:00", endday: "2017/02/15 17:00", state: "1", agent: "Mary", leavehours: "0"},
    {leaveid: "572001", categroy: "病假", leave: "三天病假", leaveday: "0", applyday: "2017-05-14",
    startday: "2017/05/14 13:00", endday: "2017/05/14 17:00", state: "1", agent: "Jenny", leavehours: "4"},
    {leaveid: "572002", categroy: "事假", leave: "特殊事假", leaveday: "2", applyday: "2017-08-14",
    startday: "2017/08/16 8:00", endday: "2017/08/17 17:00", state: "1", agent: "Jack", leavehours: "0"},
];

var withdrawReason;

$("#viewLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        /********************************** page event *************************************/
        $("#viewLeaveQuery").on("pagebeforeshow", function(event, ui) {
            $(".leaveApplyday").text(applyDay);
        });

        $("#viewLeaveQuery").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveQuery").keypress(function(event) {
        });

        //點擊詳細——click
        $(".leave-query-state").on("click", function() {
            var self = $(this).next().children().find('.leave-id').text();
            //console.log(self);

            $("#leaveMenu").hide();
            $(".leave-query-main").hide();
            $("#backContainer").show();
            $(".leave-query-detail").show();

        });

        //返回假單列表——click
        $("#backContainer").on("click", function() {
            $("#backContainer").hide();
            $(".leave-query-detail").hide();
            $("#leaveMenu").show();
            $(".leave-query-main").show();    
            return false;
        });

        //籤核狀態——click——popup
        $(".leave-detail-img").on("click", function() {
            popupMsgInit('.leaveStateFlow');
        });

        //撤回按鈕——click
        $("#withdraw").on("click", function() {
            $(".leave-query-detail").hide();
            $("#backContainer").hide();
            $(".leave-query-withdraw").show();
            $("#backPreview").show();
        });

        //返回詳情——click
        $("#backPreview").on("click", function() {
            $(".leave-query-withdraw").hide();
            $("#backPreview").hide();
            $(".leave-query-detail").show();
            $("#backContainer").show();
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

        //確認撤回按鈕——click
        $("#confirmWithdrawBtn").on("click", function() {
            if($("#confirmWithdrawBtn").hasClass("leavePreview-active-btn")) {
                //如果可以點擊，則彈窗提示確認或取消
                console.log("撤回成功");
                popupMsgInit(".confirmWithdraw");
            }else {
                console.log("不能點擊");
            }
        });
    }
});