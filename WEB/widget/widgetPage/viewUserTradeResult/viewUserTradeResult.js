$("#viewUserTradeResult").pagecontainer({
    create: function (event, ui) {

        function initialPage() {
            
        }

        /********************************** page event ***********************************/
        $("#viewUserTradeResult").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewUserTradeResult").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            //有待商榷
            checkAppPage('viewMain3');
        });

    }
});