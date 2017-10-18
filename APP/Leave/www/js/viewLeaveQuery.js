$("#viewLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        /********************************** page event *************************************/
        $("#viewLeaveQuery").on("pagebeforeshow", function(event, ui) {
            $("#leaveApplyday").text(applyDay);
        });

        $("#viewLeaveQuery").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveQuery").keypress(function(event) {
        });

        //點擊詳細
        $(".leave-query-state").on("click", function() {
            var self = $(this).next().children().find('.leave-id').text();
            //console.log(self);

            $(".leaveMenu").hide();
            $(".leave-query-main").hide();
            $("#backContainer").show();
            $(".leave-query-detail").show();

        });

        //返回假單列表
        $("#backContainer").on("click", function() {
            $(".leaveMenu").show();
            $(".leave-query-main").show();
            $("#backContainer").hide();
            $(".leave-query-detail").hide();
            return false;
        });

        //籤核狀態——popup
        $(".leave-detail-img").on("click", function() {
            popupMsgInit('.leaveStateFlow');
        });
    }
});