$("#viewShopChangePwd").pagecontainer({
    create: function (event, ui) {

        function checkFormPwd(compare) {
            var oldPwd = $('#shopOldPwd').val();
            var newPwd = $('#shopNewPwd').val();
            var confirmPwd = $('#shopCofirmPwd').val();

            if (oldPwd != '' && newPwd != '' && confirmPwd != '') {
                $('.shop-change-pwd').addClass('button-active');
            } else {
                $('.shop-change-pwd').removeClass('button-active');
            }

            if(compare !== null) {
                if(newPwd !== confirmPwd) {
                    return false;
                } else {
                    return true;
                }
            }
        }

        //API:修改登录密码
        function changeQAccountPwd(oldPwd, newPwd) {
            var self = this;

            this.successCallback = function () {
                if (data['result_code'] == '1') {
                    //popup:交易密码更改成功
                    //返回上一页
                } else {
                    //popup:失败原因
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "changeQAccountPwd", oldPwd, newPwd, self.successCallback, self.failCallback, null, null, "low", 30000, true);
            }();
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
                var result = checkFormPwd('compare');
                if(!result) {
                    console.log('新密码不一致！');
                } else {
                    //API:修改密码

                }
            }
        });



    }
});