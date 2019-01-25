$("#viewQPayUserTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewQPayUserMain';

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

                var tradeDate = new Date(data['content'].trade_time * 1000).toLocaleDateString('zh');
                var tradeTime = new Date(data['content'].trade_time * 1000).toTimeString().substr(0, 5);
                $('.user-trade-time').text(tradeDate + ' ' + tradeTime);
                $('.user-trade-shop').text(shop_name);
                $('.user-trade-emp').text(loginData['emp_no']);
                $('.user-trade-id').text(data['content'].trade_id);
                $('.user-trade-remain').text(data['content'].point_now);

                //交易成功或失败
                if (data['result_code'] == '1') {
                    $('.user-trade-fail').hide();
                    $('.user-trade-icon img').attr('src', serverURL + '/widget/widgetPage/viewQPayUserTradeResult/img/result_success.png');
                    $('.user-trade-status').css('color', '#009688');
                    $('.user-trade-status').text(langStr['wgt_068']);
                    $('.user-trade-money').text(trade_price);
                    $('.trade-fail-reason').text('');

                    //更新消费券余额
                    window.sessionStorage.setItem('user_point_dirty', 'Y');
                    window.sessionStorage.setItem('user_point', data['content'].point_now);

                } else {
                    $('.user-trade-fail').show();
                    $('.user-trade-icon img').attr('src', serverURL + '/widget/widgetPage/viewQPayUserTradeResult/img/result_warn.png');
                    $('.user-trade-status').css('color', '#C22C2B');
                    $('.user-trade-status').text(langStr['wgt_069']);
                    $('.user-trade-money').text('0');
                    $('.trade-fail-reason').text(data['message']);

                    //如果余额不足，更新消费券余额
                    if(data['result_code'] == '000924') {
                        window.sessionStorage.setItem('user_point_dirty', 'Y');
                        window.sessionStorage.setItem('user_point', data['content'].point_now);
                    }
                }

                //loadingMask("hide");
                $('.user-trade-loading').hide();
                $('.user-trade-main').show();
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPINewHeader("GET", "newTrade", 'trade-pwd', 'trade-token', trade_pwd, trade_token, self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewQPayUserTradeResult").on("pagebeforeshow", function (event, ui) {
            //只有从上一页（输入密码）跳转过来才有trade_info，才需要API
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //loading
                $('.user-trade-main').hide();
                $('.user-trade-loading').show();
                //API
                makeNewTrade(trade_info);
            }
        });

        $("#viewQPayUserTradeResult").one("pageshow", function (event, ui) {
            //只有从上一页（输入密码）跳转过来才有trade_info，才需要API
            var trade_info = JSON.parse(window.sessionStorage.getItem('trade_info'));
            if(trade_info !== null) {
                //API
                makeNewTrade(trade_info);
            }
            //back page
            window.sessionStorage.setItem('viewQPayUserTradeResult_backTo', backToPage);
        });

        $("#viewQPayUserTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserTradeResult").on("pagehide", function (event, ui) {
            //离开此页清除trade_info
            window.sessionStorage.removeItem('trade_info');
        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            onBackKeyDown();
        });


    }
});