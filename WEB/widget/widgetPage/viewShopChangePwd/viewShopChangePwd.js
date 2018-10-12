$("#viewShopChangePwd").pagecontainer({
    create: function (event, ui) {

        //页面初始化
        function initialPage() {
            $('#shopOldPwd').val('');
            $('#shopNewPwd').val('');
            $('#shopCofirmPwd').val('');
            $('.shop-change-pwd').removeClass('button-active');
        }

        //检查表单
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

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //popup:交易密码更改成功
                    $('#viewShopChangePwd .page-back').trigger('click');
                    window.sessionStorage.setItem('shopChangePwdSuccess', 'Y');

                } else if(data['result_code'] == '000926') {
                    //popup:失败原因，旧密码错误
                    $('.shopChangePwdError .header-title-main .header-text').text(langStr['wgt_078']);
                    $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                    $('.shopChangePwdError').popup('open');

                } else if(data['result_code'] == '000931') {
                    //popup:失败原因，新密码格式错误
                    $('.shopChangePwdError .header-title-main .header-text').text(langStr['wgt_080']);
                    $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_091']);
                    $('.shopChangePwdError').popup('open');

                } else {
                    //popup:失败原因，其他原因
                    var errorReason = data['message'];
                    $('.shopChangePwdError .header-title-main .header-text').text(errorReason);
                    $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                    $('.shopChangePwdError').popup('open');

                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                //QPlayAPIEx("GET", "changeQAccountPwd", oldPwd, newPwd, self.successCallback, self.failCallback, null, null, "low", 30000, true);
                QPlayAPINewHeader("GET", "changeQAccountPwd", 'old-qaccount-pwd', 'new-qaccount-pwd', oldPwd, newPwd, self.successCallback, self.failCallback, null, null, "low", 30000, true);
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
            //initial
            initialPage();
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
                //失去焦点
                //document.activeElement.blur();
                $('#shopOldPwd').blur();
                $('#shopNewPwd').blur();
                $('#shopCofirmPwd').blur();

                setTimeout(function() {
                    var result = checkFormPwd('compare');
                    if(!result) {
                        //popup:新密码不一致
                        $('.shopChangePwdError .header-title-main .header-text').text(langStr['wgt_079']);
                        $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                        $('.shopChangePwdError').popup('open');
                    } else {
                        var oldPwd = $('#shopOldPwd').val();
                        var newPwd = $('#shopNewPwd').val();

                        //API:修改登录密码
                        changeQAccountPwd(oldPwd, newPwd);
                    }
                }, 750)
                
            }
        });

        //关闭popup
        $('.shopChangePwdError .btn-cancel').on('click', function() {
            $('.shopChangePwdError').popup('close');
        })


    }
});