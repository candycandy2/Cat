$("#viewShopSelectUser").pagecontainer({
    create: function (event, ui) {

        /********************************** page event ***********************************/
        $("#viewShopSelectUser").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopSelectUser").one("pageshow", function (event, ui) {
            $('inputEmpNo').attr('placeholder', langStr['wgt_067']);
        });

        $("#viewShopSelectUser").on("pageshow", function (event, ui) {

        });

        $("#viewShopSelectUser").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //切换类型
        $('.select-user-type > div').on('click', function () {
            var type = $(this).attr('data-type');
            var has = $(this).hasClass('type-active');

            if (!has && type == 'qplay') {
                $('.other-user-title').removeClass('type-active');
                $('.other-user').hide();
                $('.qplay-user-title').addClass('type-active');
                $('.qplay-user').show();
            } else if (!has && type == 'other') {
                $('.qplay-user-title').removeClass('type-active');
                $('.qplay-user').hide();
                $('.other-user-title').addClass('type-active');
                $('.other-user').show();
            }

        });

        //输入工号
        $('#inputEmpNo').on('input', function () {
            var val = $.trim($(this).val());
            if (val != '') {
                $('.other-user-pwd').addClass('button-active');
            } else {
                $('.other-user-pwd').removeClass('button-active');
            }
        });

        //清除工号
        $('#clearEmpNo').on('click', function () {
            $('#inputEmpNo').val('');
            $('.other-user-pwd').removeClass('button-active');
        });

        //下一步
        $('.other-user-pwd').on('click', function () {
            var has = $(this).hasClass('button-active');
            if(has) {
                //API:工号是否存在
                checkWidgetPage('viewShopUserAcount');
            }
        });


    }
});