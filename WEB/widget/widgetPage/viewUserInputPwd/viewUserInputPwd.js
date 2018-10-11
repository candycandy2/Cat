$("#viewUserInputPwd").pagecontainer({
    create: function (event, ui) {

        var pwdNum = '',
            shop_id,
            shop_name,
            trade_price,
            trade_token;

        //获取交易token
        function getTradeToken(pwd) {
            var self = this;
            trade_price = window.sessionStorage.getItem('trade_price');
            shop_id = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_id'];
            shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];

            var queryStr = '&emp_no=' + loginData['emp_no'] + '&price=' + trade_price + '&shop_id=' + shop_id;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    trade_token = data['content'].trade_token;
                    $('.user-password-next').addClass('button-active');

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
        }


        /********************************** page event ***********************************/
        $("#viewUserInputPwd").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserInputPwd").on("pageshow", function (event, ui) {

        });

        $("#viewUserInputPwd").on("pagehide", function (event, ui) {
            initialPage();
        });


        /********************************** dom event *************************************/
        //模拟键盘
        $('.num-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');

        }).on('touchend', function () {
            $(this).removeClass('keydown-active');

        });

        //输入交易密码
        $('.enter-pwd').on('tap', function (event) {
            event.preventDefault();

            var num = $(this).attr('data-value');
            if (pwdNum.length < 4) {
                pwdNum += num;
                $('.pwd-box:eq(' + (pwdNum.length - 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + (pwdNum.length - 1).toString() + ')').show();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            if (pwdNum.length == 4) {
                //如果已输入4位数密码，就不能再输入
                $('.num-keyboard[data-value]').removeClass('enter-pwd');
                //API:获取token并验证密码
                getTradeToken(pwdNum);
            }
        });

        //回删输入密码
        $('.user-password-clear-one').on('tap', function (event) {
            event.preventDefault();

            if (pwdNum.length > 0) {
                pwdNum = pwdNum.substring(0, pwdNum.length - 1);
                $('.pwd-box:eq(' + (pwdNum.length + 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + pwdNum.length.toString() + ')').hide();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            //'下一步'按钮不可用
            $('.user-password-next').removeClass('button-active');
            //密码可以继续输入
            $('.num-keyboard[data-value]').addClass('enter-pwd');
        });

        //下一步
        $('.user-password-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                loadingMask("show");
                var trade_info = {
                    'shop_id': shop_id,
                    'shop_name': shop_name,
                    'trade_pwd': pwdNum,
                    'trade_price': trade_price,
                    'trade_token': trade_token
                };
                window.sessionStorage.setItem('trade_info', JSON.stringify(trade_info));
                checkWidgetPage('viewUserTradeResult', pageVisitedList);
            }
        });


    }
});