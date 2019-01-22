$("#viewQPayShopTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewQPayShopMain';

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

                var tradeDate = new Date(data['content'].trade_time * 1000).toLocaleDateString('zh');
                var tradeTime = new Date(data['content'].trade_time * 1000).toTimeString().substr(0, 5);
                $('.shop-trade-time').text(tradeDate + ' ' + tradeTime);
                $('.shop-trade-shop').text(shop_name);
                $('.shop-trade-emp').text(current_emp);
                $('.shop-trade-id').text(data['content'].trade_id);
                $('.shop-trade-remain').text(data['content'].point_now);

                //交易成功或失败
                if (data['result_code'] == '1') {
                    $('.shop-trade-fail').hide();
                    $('.shop-trade-icon img').attr('src', serverURL + '/widget/widgetPage/viewQPayShopTradeResult/img/result_success.png');
                    $('.shop-trade-status').css('color', '#009688');
                    $('.shop-trade-status').text(langStr['wgt_068']);
                    $('.shop-trade-money').text(trade_price);
                    $('.trade-fail-reason').text('');

                } else {
                    $('.shop-trade-fail').show();
                    $('.shop-trade-icon img').attr('src', serverURL + '/widget/widgetPage/viewQPayShopTradeResult/img/result_warn.png');
                    $('.shop-trade-status').css('color', '#C22C2B');
                    $('.shop-trade-status').text(langStr['wgt_069']);
                    $('.shop-trade-money').text('0');
                    $('.trade-fail-reason').text(data['message']);
                }

                //loadingMask("hide");
                $('.shop-trade-loading').hide();
                $('.shop-trade-main').show();
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "newTrade", 'trade-pwd', 'trade-token', trade_pwd, trade_token, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewQPayShopTradeResult").on("pagebeforeshow", function (event, ui) {
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //loading
                $('.shop-trade-main').hide();
                $('.shop-trade-loading').show();
                //API
                makeNewTrade(trade_info);
            }
        });

        $("#viewQPayShopTradeResult").one("pageshow", function (event, ui) {
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //API
                makeNewTrade(trade_info);
            }
            //back page
            window.sessionStorage.setItem('viewQPayShopTradeResult_backTo', backToPage);
        });

        $("#viewQPayShopTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewQPayShopTradeResult").on("pagehide", function (event, ui) {
            window.sessionStorage.removeItem('trade_info');
        });


        /********************************** dom event *************************************/
        //返回
        $('.shop-trade-back').on('click', function () {
            onBackKeyDown();
        });


    }
});