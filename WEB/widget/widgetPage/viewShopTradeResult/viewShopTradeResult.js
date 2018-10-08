$("#viewShopTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewShopSelectUser';

        function initialPage() {

        }

        //获取交易结果
        function getTradeResult() {
            var trade_result = JSON.parse(window.sessionStorage.getItem('trade_result'));

            //1. 交易失败才有失败原因
            var trade_status = trade_result['trade_status'];
            $('.trade-status').text(trade_status);
            if (trade_status == langStr['wgt_068']) {
                $('.trade-reason-container').hide();
            } else {
                $('.trade-reason').text(trade_result['error_reason']);
                $('.trade-reason-container').show();
            }

            //2. 其他信息
            $('.trade-no').text(loginData['emp_no']);
            $('.trade-shop').text(trade_result['shop_name']);
            $('.trade-id').text(trade_result['trade_id']);
            $('.trade-pay').text(trade_result['trade_point']);
            $('.trade-time').text(trade_result['trade_time']);
            $('.trade-money').text(trade_result['point_now']);
        }

        /********************************** page event ***********************************/
        $("#viewShopTradeResult").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopTradeResult").one("pageshow", function (event, ui) {
            window.sessionStorage.setItem('viewShopTradeResult_backTo', backToPage);
        });

        $("#viewShopTradeResult").on("pageshow", function (event, ui) {
            //获取交易结果
            //getTradeResult();
        });

        $("#viewShopTradeResult").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //返回
        $('.shop-trade-back').on('click', function () {
            //交易结果返回需要特殊处理，不会返回前一页，而是返回viewMain3
            onBackKeyDown();
        });

    }
});