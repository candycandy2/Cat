$("#viewUserPassword").pagecontainer({
    create: function (event, ui) {

        var pwdNum = '';

        function initialPage() {
            pwdNum = '';
            $('.pwd-circle').hide();
            $('.pwd-box').removeClass('pwd-active');
            $('.pwd-box:eq(0)').addClass('pwd-active');
        }

        /********************************** page event ***********************************/
        $("#viewUserPassword").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserPassword").on("pageshow", function (event, ui) {

        });

        $("#viewUserPassword").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        //模拟键盘按下的动画效果
        $('.num-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');
        });

        $('.num-keyboard').on('touchend', function () {
            $(this).removeClass('keydown-active');
        });

        //输入交易密码
        $('.num-keyboard[data-value]').on('click', function () {
            var num = $(this).attr('data-value');

            if (pwdNum.length < 4) {
                pwdNum += num;
                $('.pwd-box:eq(' + (pwdNum.length - 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + (pwdNum.length - 1).toString() + ')').show();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            if (pwdNum.length == 4) {
                //'下一步'按钮可用
                $('.user-password-next').addClass('button-active');
            }

        })

        //回删输入密码
        $('.user-password-clear-one').on('click', function () {
            if (pwdNum.length > 0) {
                pwdNum = pwdNum.substring(0, pwdNum.length - 1);
                $('.pwd-box:eq(' + (pwdNum.length + 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + pwdNum.length.toString() + ')').hide();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            //'下一步'按钮不可用
            $('.user-password-next').removeClass('button-active');
        });

        //下一步
        $('.user-password-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                //Call API make trade
                checkWidgetPage('viewUserTrade');
            }
        });



    }
});