$("#viewShopChangePwd").pagecontainer({
    create: function (event, ui) {

        function checkFormPwd() {
            var oldPwd = $('#shopOldPwd').val();
            var newPwd = $('#shopNewPwd').val();
            var confirmPwd = $('#shopCofirmPwd').val();

            if (oldPwd != '' && newPwd != '' && confirmPwd != '') {
                $('.shop-change-pwd').addClass('button-active');
            } else {
                $('.shop-change-pwd').removeClass('button-active');
            }
        }


        /********************************** page event ***********************************/
        $("#viewShopChangePwd").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopChangePwd").one("pageshow", function (event, ui) {
            $('#shopOldPwd').attr('placeholder', langStr['wgt_063']);
            $('#shopNewPwd').attr('placeholder', langStr['wgt_064']);
            $('#shopCofirmPwd').attr('placeholder', langStr['wgt_048']);
        });

        $("#viewShopChangePwd").on("pageshow", function (event, ui) {

        });

        $("#viewShopChangePwd").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //旧密码
        $('#shopOldPwd').on('input', function () {
            checkFormPwd();
        });

        //新密码
        $('#shopNewPwd').on('input', function () {
            checkFormPwd();
        });

        //确认新密码
        $('#shopCofirmPwd').on('input', function () {
            checkFormPwd();
        });

        //修改密码
        $('.shop-change-pwd').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                
            }
        });



    }
});