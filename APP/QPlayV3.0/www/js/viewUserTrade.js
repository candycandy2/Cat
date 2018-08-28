$("#viewUserTrade").pagecontainer({
    create: function (event, ui) {

        function initialPage() {
            
        }

        /********************************** page event ***********************************/
        $("#viewUserTrade").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserTrade").on("pageshow", function (event, ui) {

        });

        $("#viewUserTrade").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            //有待商榷
            checkAppPage('viewMain3');
        });

    }
});