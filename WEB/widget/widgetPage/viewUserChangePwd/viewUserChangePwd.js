$("#viewUserChangePwd").pagecontainer({
    create: function (event, ui) {



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

        /********************************** page event ***********************************/
        $("#viewUserChangePwd").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserChangePwd").one("pageshow", function (event, ui) {
            $('#userOldPwd').attr('placeholder', langStr['str_143']);
            $('#userNewPwd').attr('placeholder', langStr['str_144']);
            $('#userCofirmPwd').attr('placeholder', langStr['str_145']);
        });

        $("#viewUserChangePwd").on("pageshow", function (event, ui) {

        });

        $("#viewUserChangePwd").on("pagehide", function (event, ui) {

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
        $('.user-change-pwd').on('click', function () {
            var has = $(this).hasClass('button-active');
            var oldPwd = $('#userOldPwd').val();
            var newPwd = $('#userNewPwd').val();
            var confirmPwd = $('#userCofirmPwd').val();

            if (has) {
                //1.检查旧密码
                var oldResult = checkPwdFormat(oldPwd);

                if(!oldResult) {
                    //提示旧密码格式错误
                    console.log('旧密码格式错误');
                } else {
                    //2.检查新密码
                    var newResult = checkPwdFormat(newPwd);
                    if(!newResult) {
                        //提示新密码格式错误
                        console.log('新密码格式错误');
                    } else {
                        //3.确认新密码
                        var confirmResult = checkPwdFormat(newPwd, confirmPwd);
                        if(!confirmResult) {
                            //提示新密码输入不一致
                            console.log('新密码输入不一致');
                        } else {
                            //Call API
                            console.log('Call API');
                        }
                    }
                }

            }
        });



    }
});