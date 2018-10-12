$("#viewUserTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewUserPayMain';

        //进行交易
        function makeNewTrade(tradeInfo) {
            var self = this;

            var shop_id = tradeInfo['shop_id'];
            var shop_name = tradeInfo['shop_name'];
            var trade_pwd = tradeInfo['trade_pwd'];
            var trade_price = tradeInfo['trade_price'];
            var trade_token = tradeInfo['trade_token'];

            var queryStr = '&emp_no=' + loginData['emp_no'] + '&shop_id=' + shop_id + '&price=' + trade_price;

            this.successCallback = function (data) {
                console.log(data);

                $('.trade-shop').text(shop_name);
                $('.trade-no').text(loginData['emp_no']);
                $('.trade-id').text(data['content'].trade_id);
                $('.trade-money').text(data['content'].point_now);
                var tradeDate = new Date(data['content'].trade_time * 1000).toLocaleDateString('zh');
                var tradeTime = new Date(data['content'].trade_time * 1000).toTimeString().substr(0, 5);
                $('.trade-time').text(tradeDate + ' ' + tradeTime);

                //交易成功或失败
                if (data['result_code'] == '1') {
                    $('.user-fail-reason').hide();
                    $('.trade-status').text(langStr['wgt_068']);
                    $('.trade-reason').text('');
                    $('.trade-pay').text(trade_price);

                    //更新消费券余额
                    window.sessionStorage.setItem('user_point_dirty', 'Y');
                    window.sessionStorage.setItem('user_point', data['content'].point_now);
                } else {
                    $('.user-fail-reason').show();
                    $('.trade-status').text(langStr['wgt_069']);
                    $('.trade-reason').text(data['message']);
                    $('.trade-pay').text('0');

                    //如果余额不足，更新消费券余额
                    if(data['result_code'] == '000924') {
                        window.sessionStorage.setItem('user_point_dirty', 'Y');
                        window.sessionStorage.setItem('user_point', data['content'].point_now);
                    }
                }

                loadingMask("hide");
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "newTrade", 'trade-pwd', 'trade-token', trade_pwd, trade_token, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewUserTradeResult").on("pagebeforeshow", function (event, ui) {
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //API
                makeNewTrade(trade_info);
            }
        });

        $("#viewUserTradeResult").one("pageshow", function (event, ui) {
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //API
                makeNewTrade(trade_info);
            }
            //back page
            window.sessionStorage.setItem('viewUserTradeResult_backTo', backToPage);
        });

        $("#viewUserTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewUserTradeResult").on("pagehide", function (event, ui) {
            window.sessionStorage.removeItem('trade_info');
        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            onBackKeyDown();
        });


    }
});