$("#viewUserTradeResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewMain3';


        //获取交易结果
        function getTradeResult() {
            var trade_result = JSON.parse(window.sessionStorage.getItem('trade_result'));

            //1. 交易失败才需显示原因
            var trade_success = trade_result['trade_success'];
            if (trade_success == 'Y') {
                $('.trade-reason-container').hide();
            } else {
                $('.trade-reason-container').show();
            }

            //2. 其他信息
            $('.trade-shop').text(trade_result['shop_name']);
            $('.trade-status').text(trade_result['trade_status']);
            $('.trade-reason').text(trade_result['error_reason']);
            $('.trade-no').text(loginData['emp_no']);
            $('.trade-id').text(trade_result['trade_id']);
            $('.trade-pay').text(trade_result['trade_point']);
            $('.trade-time').text(trade_result['trade_time']);
            $('.trade-money').text(trade_result['point_now']);

            loadingMask("hide");
        }


        /********************************** page event ***********************************/
        $("#viewUserTradeResult").on("pagebeforeshow", function (event, ui) {
            //API
            getTradeResult();
        });

        $("#viewUserTradeResult").one("pageshow", function (event, ui) {
            //API
            getTradeResult();
        });

        $("#viewUserTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewUserTradeResult").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            var backPage = window.sessionStorage.getItem('viewUserTradeResult_backTo');
            if(backPage == null) {
                window.sessionStorage.setItem('viewUserTradeResult_backTo', backToPage);
            }
            //交易结果返回需要特殊处理，不会返回前一页，而是返回viewMain3
            onBackKeyDown();
        });


    }
});