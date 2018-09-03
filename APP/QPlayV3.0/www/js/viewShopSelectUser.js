$("#viewShopSelectUser").pagecontainer({
    create: function (event, ui) {

        /********************************** page event ***********************************/
        $("#viewShopSelectUser").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopSelectUser").on("pageshow", function (event, ui) {

        });

        $("#viewShopSelectUser").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('.select-user-type > div').on('click', function () {
            var type = $(this).attr('data-type');
            var has = $(this).hasClass('type-active');

            if(!has && type == 'qplay') {
                $('.other-user-title').removeClass('type-active');
                $('.other-user').hide();
                $('.qplay-user-title').addClass('type-active');
                $('.qplay-user').show();
            } else if(!has && type == 'other') {
                $('.qplay-user-title').removeClass('type-active');
                $('.qplay-user').hide();
                $('.other-user-title').addClass('type-active');
                $('.other-user').show();
            }
            
        });




    }
});