$("#viewShopInputPwd").pagecontainer({
    create: function (event, ui) {

        var pwdNum = '',
            trade_price,
            shop_id,
            shop_name,
            current_emp,
            trade_token;

        //获取交易token
        function getTradeToken(pwd) {
            var self = this;
            trade_price = window.sessionStorage.getItem('trade_price');
            shop_id = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_id'];
            shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
            current_emp = window.sessionStorage.getItem('current_emp');

            var queryStr = '&emp_no=' + current_emp + '&price=' + trade_price + '&shop_id=' + shop_id;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    trade_token = data['content'].trade_token;
                    $('.shop-password-next').addClass('button-active');

                } else if(data['result_code'] == '000929') {
                    //密码错误，popup msg
                    popupMsgInit('.shopErrorPwd');
                    initialPage();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "getTradeToken", 'trade-pwd', null, pwd, null, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //进行交易
        function makeNewTrade(pwd, emp, shop, price, token) {
            var self = this;
            var queryStr = '&emp_no=' + emp + '&shop_id=' + shop + '&price=' + price;

            this.successCallback = function (data) {
                console.log(data);

                var trade_info = {};
                trade_info['shop_name'] = shop_name;
                trade_info['emp_no'] = current_emp;
                trade_info['trade_id'] = data['content'].trade_id;
                trade_info['point_now'] = data['content'].point_now;
                
                var tradeDate = new Date(data['content'].trade_time * 1000).toLocaleDateString('zh');
                var tradeTime = new Date(data['content'].trade_time * 1000).toTimeString().substr(0, 5);
                trade_info['trade_time'] = tradeDate + ' ' + tradeTime;

                if (data['result_code'] == '1') {
                    //1. save result
                    trade_info['trade_success'] = 'Y';
                    trade_info['trade_status'] = langStr['wgt_068'];//交易成功
                    trade_info['error_reason'] = '';
                    trade_info['trade_point'] = price;

                } else {
                    trade_info['trade_success'] = 'N';
                    trade_info['trade_status'] = langStr['wgt_069'];//交易失敗
                    trade_info['error_reason'] = data['message'];//失败原因
                    trade_info['trade_point'] = '0';
                }

                window.sessionStorage.setItem('trade_result', JSON.stringify(trade_info));
                checkWidgetPage('viewShopTradeResult', pageVisitedList);
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "newTrade", 'trade-pwd', 'trade-token', pwd, token, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        function initialPage() {
            pwdNum = '';
            $('.pwd-circle').hide();
            $('.pwd-box').removeClass('pwd-active');
            $('.pwd-box:eq(0)').addClass('pwd-active');
            $('.shop-password-next').removeClass('button-active');
        }


        /********************************** page event ***********************************/
        $("#viewShopInputPwd").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopInputPwd").on("pageshow", function (event, ui) {

        });

        $("#viewShopInputPwd").on("pagehide", function (event, ui) {
            initialPage();
        });


        /********************************** dom event *************************************/
        //模拟键盘按下的动画效果
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
        $('.shop-password-clear-one').on('click', function (event) {
            event.preventDefault();

            if (pwdNum.length > 0) {
                pwdNum = pwdNum.substring(0, pwdNum.length - 1);
                $('.pwd-box:eq(' + (pwdNum.length + 1).toString() + ')').removeClass('pwd-active');
                $('.pwd-circle:eq(' + pwdNum.length.toString() + ')').hide();
                $('.pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            //'下一步'按钮不可用
            $('.shop-password-next').removeClass('button-active');
            //密码可以继续输入
            $('.num-keyboard[data-value]').addClass('enter-pwd');
        });

        //下一步
        $('.shop-password-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                loadingMask("show");
                //API:进行交易
                makeNewTrade(pwdNum, current_emp, shop_id, trade_price, trade_token);
            }
        });


    }
});