$("#viewUserSelectShop").pagecontainer({
    create: function (event, ui) {



        /********************************** page event ***********************************/
        $("#viewUserSelectShop").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserSelectShop").on("pageshow", function (event, ui) {

        });

        $("#viewUserSelectShop").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('.user-select-shop').on('click', '.user-select-list', function () {
            checkWidgetPage('viewUserInputAmount');
        });

    }
});