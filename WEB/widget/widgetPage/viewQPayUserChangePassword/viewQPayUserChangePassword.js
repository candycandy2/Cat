$("#viewQPayUserChangePassword").pagecontainer({
    create: function (event, ui) {


        function initialPage() {
            $('#userOldPwd').val('');
            $('#userNewPwd').val('');
            $('#userCofirmPwd').val('');
            $('.user-change-pwd').removeClass('button-active');
        }

        //检查表单
        function checkFormPwd() {
            var oldPwd = $('#userOldPwd').val();
            var newPwd = $('#userNewPwd').val();
            var confirmPwd = $('#userCofirmPwd').val();

            if (oldPwd != '' && newPwd != '' && confirmPwd != '') {
                $('.user-change-pwd').addClass('button-active');
            } else {
                $('.user-change-pwd').removeClass('button-active');
            }
        }

        //检查密码格式
        function checkPwdFormat(val1, val2) {
            val2 = val2 || null;

            if (val2 == null) {
                var arr = val1.split('');

                if (arr.length != 4) {
                    return false;
                } else {
                    for (var i in arr) {
                        if (Number(arr[i]).toString() === 'NaN') {
                            return false;
                        }
                    }
                    return true;
                }

            } else {
                if(val1 === val2) {
                    return true;
                } else {
                    return false;
                }
            }

        }

        //API:更改交易密码
        function changeTradePwd(oldPwd, newPwd) {
            var self = this;

            this.successCallback = function (data) {
                //console.log(data);

                if (data['result_code'] == '1') {
                    //popup:交易密码更改成功
                    $("#userChangeSuccess").fadeIn(100).delay(2000).fadeOut(100);
                    setTimeout(function() {
                        $('#viewQPayUserChangePassword .page-back').trigger('click');
                    }, 2000);

                } else if(data['result_code'] == '000925') {
                    //旧密码错误 popup msg
                    $('.userChangePwdError .header-title-main .header-text').text(langStr['wgt_078']);
                    $('.userChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                    $('.userChangePwdError').popup('open');

                } else if(data['result_code'] == '000901') {
                    //员工信息错误（该员工从未领取过消费券）
                    $('.userChangePwdError .header-title-main .header-text').text(langStr['wgt_217']);
                    $('.userChangePwdError .header-title .header-text').text(langStr['wgt_218']);
                    $('.userChangePwdError').popup('open');
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "changeTradePwdForAPP", 'old-trade-pwd', 'new-trade-pwd', oldPwd, newPwd, self.successCallback, self.failCallback, null, null, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewQPayUserChangePassword").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayUserChangePassword").one("pageshow", function (event, ui) {
            $('#userOldPwd').attr('placeholder', langStr['wgt_046']);
            $('#userNewPwd').attr('placeholder', langStr['wgt_047']);
            $('#userCofirmPwd').attr('placeholder', langStr['wgt_048']);
        });

        $("#viewQPayUserChangePassword").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserChangePassword").on("pagehide", function (event, ui) {
            //initial
            initialPage();
        });


        /********************************** dom event *************************************/
        //旧密码
        $('#userOldPwd').on('input', function () {
            checkFormPwd();
        });

        //新密码
        $('#userNewPwd').on('input', function () {
            checkFormPwd();
        });

        //确认新密码
        $('#userCofirmPwd').on('input', function () {
            checkFormPwd();
        });

        //更改密码
        $('.user-change-pwd').on('touchstart', function (event) {
            //event.stopPropagation();
            var has = $(this).hasClass('button-active');
            var oldPwd = $('#userOldPwd').val();
            var newPwd = $('#userNewPwd').val();
            var confirmPwd = $('#userCofirmPwd').val();

            if (has) {
                //0.input失去焦点
                //document.activeElement.blur();
                $('#userOldPwd').blur();
                $('#userNewPwd').blur();
                $('#userCofirmPwd').blur();

                setTimeout(function() {
                    //1.检查旧密码
                    var oldResult = checkPwdFormat(oldPwd);
                    if(!oldResult) {
                        //提示旧密码格式错误
                        $('.userChangePwdError .header-title-main .header-text').text(langStr['wgt_082']);
                        $('.userChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                        $('.userChangePwdError').popup('open');
                    } else {
                        //2.检查新密码
                        var newResult = checkPwdFormat(newPwd);
                        if(!newResult) {
                            //提示新密码格式错误
                            $('.userChangePwdError .header-title-main .header-text').text(langStr['wgt_080']);
                            $('.userChangePwdError .header-title .header-text').text(langStr['wgt_081']);
                            $('.userChangePwdError').popup('open');
                        } else {
                            //3.确认新密码
                            var confirmResult = checkPwdFormat(newPwd, confirmPwd);
                            if(!confirmResult) {
                                //提示新密码输入不一致
                                $('.userChangePwdError .header-title-main .header-text').text(langStr['wgt_079']);
                                $('.userChangePwdError .header-title .header-text').text(langStr['wgt_045']);
                                $('.userChangePwdError').popup('open');
                            } else {
                                //API:修改交易密码
                                changeTradePwd(oldPwd, newPwd);
                            }
                        }
                    }
                }, 500)
            }

            return false;
        });

        //removeClass
        $('.user-change-pwd').on('touchend', function () {
            $('#viewQPayUserChangePassword .ui-header').removeClass('ui-fixed-hidden');
        });

        //阻止事件冒泡
        $('.user-change-foot').on('touchstart', function(event) {
            //event.stopPropagation();
            return false;
        });

        //关闭popup
        $('.userChangePwdError .btn-cancel').on('click', function() {
            $('.userChangePwdError').popup('close');
        });


    }
});