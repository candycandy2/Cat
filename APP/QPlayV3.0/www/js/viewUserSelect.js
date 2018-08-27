$("#viewUserSelect").pagecontainer({
    create: function (event, ui) {



        /********************************** page event ***********************************/
        $("#viewUserSelect").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserSelect").on("pageshow", function (event, ui) {

        });

        $("#viewUserSelect").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('.user-select-shop').on('click', '.user-select-list', function () {
            checkAppPage('viewUserPay');
        });

    }
});