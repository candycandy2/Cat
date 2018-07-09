
$("#viewApplyInsurance").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/


        /********************************** page event *************************************/
        $("#viewApplyInsurance").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewApplyInsurance").on("pageshow", function (event, ui) {
            $("#familyName").text(clickFamilyName);
        });
        
        /******************************** datetimepicker ***********************************/


        /********************************** dom event *************************************/
        //返回到個人保險現況，彈窗popup
        $("#backPersonalInsurance").on("click", function () {
            popupMsgInit('.confirmCancelApply');
        });

        //確定取消申請，跳轉
        $("#confirmCancelApplyBtn").on("click", function () {
            $.mobile.changePage("#viewPersonalInsurance"); 
        });
    }
});