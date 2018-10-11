$("#viewShopTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewShopPayMain';

        //进行交易
        function makeNewTrade(tradeInfo) {
            var self = this;

            var shop_id = tradeInfo['shop_id'];
            var shop_name = tradeInfo['shop_name'];
            var trade_pwd = tradeInfo['trade_pwd'];
            var trade_price = tradeInfo['trade_price'];
            var trade_token = tradeInfo['trade_token'];
            var current_emp = tradeInfo['emp_no'];

            var queryStr = '&emp_no=' + current_emp + '&shop_id=' + shop_id + '&price=' + trade_price;

            this.successCallback = function (data) {
                console.log(data);

                $('.trade-shop').text(shop_name);
                $('.trade-no').text(current_emp);
                $('.trade-id').text(data['content'].trade_id);
                $('.trade-money').text(data['content'].point_now);
                var tradeDate = new Date(data['content'].trade_time * 1000).toLocaleDateString('zh');
                var tradeTime = new Date(data['content'].trade_time * 1000).toTimeString().substr(0, 5);
                $('.trade-time').text(tradeDate + ' ' + tradeTime);

                //交易成功或失败
                if (data['result_code'] == '1') {
                    $('.shop-fail-reason').hide();
                    $('.trade-status').text(langStr['wgt_068']);
                    $('.trade-reason').text('');
                    $('.trade-pay').text(trade_price);

                } else {
                    $('.shop-fail-reason').show();
                    $('.trade-status').text(langStr['wgt_069']);
                    $('.trade-reason').text(data['message']);
                    $('.trade-pay').text('0');
                }

                loadingMask("hide");
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "newTrade", 'trade-pwd', 'trade-token', trade_pwd, trade_token, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewShopTradeResult").on("pagebeforeshow", function (event, ui) {
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //API
                makeNewTrade(trade_info);
            }
        });

        $("#viewShopTradeResult").one("pageshow", function (event, ui) {
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //API
                makeNewTrade(trade_info);
            }
            //back page
            window.sessionStorage.setItem('viewShopTradeResult_backTo', backToPage);
        });

        $("#viewShopTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewShopTradeResult").on("pagehide", function (event, ui) {
            window.sessionStorage.removeItem('trade_info');
        });


        /********************************** dom event *************************************/
        //返回
        $('.shop-trade-back').on('click', function () {
            onBackKeyDown();
        });


    }
});