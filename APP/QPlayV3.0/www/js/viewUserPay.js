$("#viewUserPay").pagecontainer({
    create: function (event, ui) {

        var payNum = '';

        /********************************** page event ***********************************/
        $("#viewUserPay").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserPay").on("pageshow", function (event, ui) {

        });

        $("#viewUserPay").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('.num-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');
        });

        $('.num-keyboard').on('touchend', function () {
            $(this).removeClass('keydown-active');
        });

        

    }
});