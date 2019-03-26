$("#viewQPayUserInputPassword").pagecontainer({
    create: function (event, ui) {

        var pwdNum = '',
            shop_id,
            shop_name,
            trade_price,
            trade_token,
            MAXseconds = 25,
            countdownInterval = null;

        //获取交易token
        function getTradeToken(pwd) {
            var self = this;
            trade_price = window.sessionStorage.getItem('trade_price');
            shop_id = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_id'];
            shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];

            var queryStr = '&emp_no=' + loginData['emp_no'] + '&price=' + trade_price + '&shop_id=' + shop_id + '&action=new';

            this.successCallback = function (data) {
                //console.log(data);

                if (data['result_code'] == '1') {
                    trade_token = data['content'].trade_token;
                    $('.user-password-next').addClass('button-active');
                    //倒计时开始
                    setCountdownAfterGetToken();

                } else if(data['result_code'] == '000929') {
                    //密码错误，popup msg
                    popupMsgInit('.userErrorPwd');
                    initialPage();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "getTradeToken", 'trade-pwd', null, pwd, null, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        function initialPage() {
            pwdNum = '';
            $('.pwd-circle').hide();
            $('.pwd-box').removeClass('pwd-active');
            $('.pwd-box:eq(0)').addClass('pwd-active');
            $('.user-password-next').removeClass('button-active');

            countdownInterval = null;
            $('.userCountdownSec').text(MAXseconds);
            $('.user-password-countdown').hide();
        }

        //获取token后进行25秒倒计，必须在倒计时结束前进行下一步，否则token失效
        function setCountdownAfterGetToken() {
            var startDate = Date.now();
            $('.userCountdownSec').text(MAXseconds);
            $('.user-password-countdown').show();

            countdownInterval = setInterval(function() {
                var diff = Date.now() - startDate;
                var seconds = Math.floor(diff / 1000);
                var secondStr = MAXseconds - seconds;
                secondStr = (secondStr < 10 ? '0' + secondStr.toString() : secondStr.toString());
                $('.userCountdownSec').text(secondStr);

                //如果倒计时结束，仍然没有进行下一步，视为放弃交易，需要初始化并重新输入密码
                if(seconds > MAXseconds) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                    initialPage();
                }

            }, 1000);
        }

        /********************************** page event ***********************************/
        $("#viewQPayUserInputPassword").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayUserInputPassword").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserInputPassword").on("pagehide", function (event, ui) {
            initialPage();
        });


        /********************************** dom event *************************************/
        //模拟键盘
        $('.pwd-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');

        }).on('touchend', function () {
            $(this).removeClass('keydown-active');

        });

        //输入交易密码
        $('.enter-pwd').on('touchstart', function () {
            var num = $(this).attr('data-value');
            if (pwdNum.length < 4) {
                pwdNum += num;
                $('.pwd-box:eq(' + (pwdNum.length - 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + (pwdNum.length - 1).toString() + ')').show();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            if (pwdNum.length == 4) {
                //如果已输入4位数密码，就不能再输入
                $('.pwd-keyboard[data-value]').removeClass('enter-pwd');
                //API:获取token并验证密码
                getTradeToken(pwdNum);
            }
        });

        //回删输入密码
        $('.user-password-clear-one').on('touchstart', function () {
            if (pwdNum.length > 0) {
                pwdNum = pwdNum.substring(0, pwdNum.length - 1);
                $('.pwd-box:eq(' + (pwdNum.length + 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + pwdNum.length.toString() + ')').hide();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            //'下一步'按钮不可用
            $('.user-password-next').removeClass('button-active');
            //密码可以继续输入
            $('.pwd-keyboard[data-value]').addClass('enter-pwd');
            //倒计时立即结束
            if(countdownInterval != null) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                $('.user-password-countdown').hide();
                $('.userCountdownSec').text(MAXseconds);
            }
        });

        //下一步
        $('.user-password-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                //loadingMask("show");
                var trade_info = {
                    'shop_id': shop_id,
                    'shop_name': shop_name,
                    'trade_pwd': pwdNum,
                    'trade_price': trade_price,
                    'trade_token': trade_token
                };
                window.sessionStorage.setItem('trade_info', JSON.stringify(trade_info));
                checkWidgetPage('viewQPayUserTradeResult', pageVisitedList);
            }
        });


    }
});