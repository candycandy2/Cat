$("#viewQPayShopReturnPassword").pagecontainer({
    create: function (event, ui) {

        var pwdNum = '',
            trade_token;

        //获取交易token
        function getTradeToken(pwd) {
            var self = this;
            var trad_info = JSON.parse(window.sessionStorage.getItem('viewQPayShopReturnPassword_parmData'));
            var trade_price = trad_info['trade_price'];
            var shop_id = trad_info['shop_id'];

            var queryStr = '&emp_no=' + loginData['emp_no'] + '&price=' + trade_price + '&shop_id=' + shop_id + '&action=cancel';

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    trade_token = data['content'].trade_token;
                    $('.shop-trade-pwd-next').addClass('button-active');

                } else if(data['result_code'] == '000929') {
                    //密码错误，popup msg
                    popupMsgInit('.shopPwdErrorPopup');
                    initialPage();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "getTradeToken", 'trade-pwd', null, pwd, null, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //申请退款退货
        function cancelTargetTrade() {
            var self = this;

            var trade_info = JSON.parse(window.sessionStorage.getItem('viewQPayShopReturnPassword_parmData'));
            var shop_id = trade_info['shop_id'];
            var trade_pwd = pwdNum;
            var trade_price = trade_info['trade_price'];
            var trade_id = trade_info['trade_id'].substr(1, 6);//只取后6位数字
            var reason = trade_info['reason'];

            var queryStr = '&emp_no=' + loginData['emp_no'] + '&shop_id=' + shop_id + '&price=' + trade_price + '&trade_id=' + trade_id + '&reason=' + reason;

            this.successCallback = function (data) {
                console.log(data);

                //交易成功或失败
                if (data['result_code'] == '1') {
                    trade_info['cancel_trade_id'] = data['content']['cancel_trade_id'];
                    trade_info['cancel_price'] = data['content']['cancel_price'];
                    trade_info['cancel_time'] = data['content']['cancel_time'];
                    trade_info['message'] = data['message'];
                    trade_info['success'] = 'Y';
                } else {
                    trade_info['cancel_trade_id'] = trade_info['trade_id'];
                    trade_info['cancel_price'] = '0';
                    trade_info['cancel_time'] = Math.round(new Date().getTime() / 1000);
                    trade_info['message'] = data['message'];
                    trade_info['success'] = 'N';
                }

                checkWidgetPage('viewQPayShopReturnResult', pageVisitedList, trade_info);

                //不管成功或失败，都清除交易查询的交易码
                window.sessionStorage.setItem('cancelTradeSuccess', 'Y');

            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "cancelTrade", 'trade-pwd', 'trade-token', trade_pwd, trade_token, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        function initialPage() {
            pwdNum = '';
            $('.shop-trade-pwd-number .pwd-circle').hide();
            $('.shop-trade-pwd-number .pwd-box').removeClass('pwd-active');
            $('.shop-trade-pwd-number .pwd-box:eq(0)').addClass('pwd-active');
            $('.shop-trade-pwd-next').removeClass('button-active');
        }


        /********************************** page event ***********************************/
        $("#viewQPayShopReturnPassword").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayShopReturnPassword").on("pageshow", function (event, ui) {

        });

        $("#viewQPayShopReturnPassword").on("pagehide", function (event, ui) {
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
        $('.shop-trade-pwd-keyboard .enter-pwd').on('tap', function (event) {
            event.preventDefault();

            var num = $(this).attr('data-value');
            if (pwdNum.length < 4) {
                pwdNum += num;
                $('.shop-trade-pwd-number .pwd-box:eq(' + (pwdNum.length - 1).toString() + ')').removeClass('pwd-active');
                $('.shop-trade-pwd-number .pwd-circle:eq(' + (pwdNum.length - 1).toString() + ')').show();
                $('.shop-trade-pwd-number .pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            if (pwdNum.length == 4) {
                //如果已输入4位数密码，就不能再输入
                $('.shop-trade-pwd-keyboard .num-keyboard[data-value]').removeClass('enter-pwd');
                //API:获取token并验证密码
                getTradeToken(pwdNum);
            }
        });

        //回删输入密码
        $('.shop-trade-pwd-clear-one').on('tap', function (event) {
            event.preventDefault();

            if (pwdNum.length > 0) {
                pwdNum = pwdNum.substring(0, pwdNum.length - 1);
                $('.shop-trade-pwd-number .pwd-box:eq(' + (pwdNum.length + 1).toString() + ')').removeClass('pwd-active');
                $('.shop-trade-pwd-number .pwd-circle:eq(' + pwdNum.length.toString() + ')').hide();
                $('.shop-trade-pwd-number .pwd-box:eq(' + pwdNum.length.toString() + ')').addClass('pwd-active');
            }

            //'下一步'按钮不可用
            $('.shop-trade-pwd-next').removeClass('button-active');
            //密码可以继续输入
            $('.shop-trade-pwd-keyboard .num-keyboard[data-value]').addClass('enter-pwd');
        });

        //下一步
        $('.shop-trade-pwd-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if (has) {
                cancelTargetTrade();
            }
        });


    }
});