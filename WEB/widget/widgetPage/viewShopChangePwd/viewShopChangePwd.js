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
        function checkForm() {
            var oldPwd = $('#shopOldPwd').val();
            var newPwd = $('#shopNewPwd').val();
            var confirmPwd = $('#shopCofirmPwd').val();

            if (oldPwd != '' && newPwd != '' && confirmPwd != '') {
                $('.shop-change-pwd').addClass('button-active');
            } else {
                $('.shop-change-pwd').removeClass('button-active');
            }
        }

        //检查密码
        function checkPwdFormat(pwd1, pwd2) {
            pwd2 = pwd2 || null;

            if(pwd2 == null) {
                var flag = false;
                for(var i = 0; i < pwd1.length; i++) {
                    if(pwd1.charCodeAt(i) > 255) {
                        flag = true;
                        break;
                    }
                }
                if(flag) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if(pwd1 == pwd2) {
                    return true;
                } else {
                    return false;
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
            checkForm();
        });

        //新密码
        $('#shopNewPwd').on('input', function () {
            checkForm();
        });

        //确认新密码
        $('#shopCofirmPwd').on('input', function () {
            checkForm();
        });

        //修改密码
        $('.shop-change-pwd').on('touchstart', function (event) {
            //event.stopPropagation();
            var has = $(this).hasClass('button-active');
            var oldPwd = $('#shopOldPwd').val();
            var newPwd = $('#shopNewPwd').val();
            var confirmPwd = $('#shopCofirmPwd').val();

            if (has) {
                //失去焦点
                //document.activeElement.blur();
                $('#shopOldPwd').blur();
                $('#shopNewPwd').blur();
                $('#shopCofirmPwd').blur();

                setTimeout(function() {
                    //1.检查旧密码是否包含中文
                    var oldResult = checkPwdFormat(oldPwd);
                    if(!oldResult) {
                        $('.shopChangePwdError .header-title-main .header-text').text(langStr['wgt_082']);
                        $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                        $('.shopChangePwdError').popup('open');

                    } else {
                        //2.检查新密码
                        var newResult = checkPwdFormat(newPwd);
                        if(!newResult) {
                            $('.shopChangePwdError .header-title-main .header-text').text(langStr['wgt_080']);
                            $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_091']);
                            $('.shopChangePwdError').popup('open');

                        } else {
                            //3.确认密码
                            var confirmResult = checkPwdFormat(newPwd, confirmPwd);
                            if(!confirmResult) {
                                $('.shopChangePwdError .header-title-main .header-text').text(langStr['wgt_079']);
                                $('.shopChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                                $('.shopChangePwdError').popup('open');
                            } else {
                                //API:修改登录密码
                                changeQAccountPwd(oldPwd, newPwd);
                            }
                        }
                    }

                }, 500)
            }

            return false;
        });

        //removeClass
        $('.shop-change-pwd').on('touchend', function () {
            $('#viewShopChangePwd .ui-header').removeClass('ui-fixed-hidden');
        });

        //阻止事件冒泡
        $('.shop-change-foot').on('touchstart', function(event) {
            //event.stopPropagation();
            return false;
        });

        //关闭popup
        $('.shopChangePwdError .btn-cancel').on('click', function() {
            $('.shopChangePwdError').popup('close');
        });


    }
});