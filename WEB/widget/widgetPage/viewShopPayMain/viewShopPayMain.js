$("#viewShopPayMain").pagecontainer({
    create: function (event, ui) {



        /********************************** page event ***********************************/
        $("#viewShopPayMain").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopPayMain").on("pageshow", function (event, ui) {

        });

        $("#viewShopPayMain").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //店家结帐
        $('.shop-pay').on('click', function () {
            checkAppPage('viewShopSelectUser');
            //checkWidgetPage('viewShopSelectUser');
        });

        //店家记录
        $('.shop-record').on('click', function () {
            //checkAppPage('viewShopQueryRecord');
            checkWidgetPage('viewShopQueryRecord');
        });

        


    }
});