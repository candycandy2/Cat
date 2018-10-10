$("#viewShopTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewShopPayMain';

        //获取交易结果
        function getTradeResult() {
            var trade_result = JSON.parse(window.sessionStorage.getItem('trade_result'));

            //1. 交易失败才需显示原因
            var trade_success = trade_result['trade_success'];
            if(trade_success == 'Y') {
                $('.shop-fail-reason').hide();
            } else {
                $('.shop-fail-reason').show();
            }

            //2. 其他信息
            $('.trade-shop').text(trade_result['shop_name']);
            $('.trade-status').text(trade_result['trade_status']);
            $('.trade-reason').text(trade_result['error_reason']);
            $('.trade-no').text(trade_result['emp_no']);
            $('.trade-id').text(trade_result['trade_id']);
            $('.trade-pay').text(trade_result['trade_point']);
            $('.trade-time').text(trade_result['trade_time']);
            $('.trade-money').text(trade_result['point_now']);

            loadingMask("hide");
        }


        /********************************** page event ***********************************/
        $("#viewShopTradeResult").on("pagebeforeshow", function (event, ui) {
            //API:获取交易结果
            getTradeResult();
        });

        $("#viewShopTradeResult").one("pageshow", function (event, ui) {
            //API:获取交易结果
            getTradeResult();
        });

        $("#viewShopTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewShopTradeResult").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //返回
        $('.shop-trade-back').on('click', function () {
            var backPage = window.sessionStorage.getItem('viewShopTradeResult_backTo');
            if(backPage == null) {
                window.sessionStorage.setItem('viewShopTradeResult_backTo', backToPage);
            }
            onBackKeyDown();
        });


    }
});