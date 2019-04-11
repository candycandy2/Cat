$("#viewQPayShopReturnResult").pagecontainer({
    create: function (event, ui) {

        var backToPage = 'viewUserPayMain',
            imgURL = '/widget/widgetPage/viewQPayShopReturnResult/img/';

        //获取结果
        function getTradeResult() {
            var trade_info = JSON.parse(window.sessionStorage.getItem('viewQPayShopReturnResult_parmData'));

            if(trade_info['success'] == 'Y') {
                $('.user-trade-fail').hide();
                $('.user-trade-success').show();
                $('.user-trade-icon img').attr('src', serverURL + imgURL + 'result_success.gif');
                $('.user-trade-status').css('color', '#009688');
                $('.user-trade-status').text(langStr['wgt_164']);
                $('.user-trade-return').text(trade_info['reason']);

                //gif再换成png
                setTimeout(function() {
                    $('.user-trade-icon img').attr('src', serverURL + imgURL + 'result_success.png');
                }, 2100);

            } else {
                $('.user-trade-success').hide();
                $('.user-trade-fail').show();
                $('.user-trade-icon img').attr('src', serverURL + imgURL + 'result_warn.png');
                $('.user-trade-status').css('color', '#C22C2B');
                $('.user-trade-status').text(langStr['wgt_165']);
                $('.trade-fail-reason').text(trade_info['message']);
            }

            $('.user-trade-money').text(trade_info['cancel_price']);
            $('.user-trade-time').text(new Date(trade_info['cancel_time'] * 1000).yyyymmdd('/') + ' ' + new Date(trade_info['cancel_time'] * 1000).hhmm());
            $('.user-trade-shop').text(trade_info['trade_shop']);
            $('.user-trade-id').text(trade_info['cancel_trade_id']);

            //隐藏空白，显示内容
            $('.user-trade-loading').hide();
            $('.user-trade-main').show();
        }

        //back key
        function onBackKeyDownSpecial() {
            for(var i = 0; i < 3; i++){
                pageVisitedList.pop();
            }
            onBackKeyDown();
        }


        /********************************** page event ***********************************/
        $("#viewQPayShopReturnResult").one("pagebeforeshow", function (event, ui) {
            //first time coming this page append loading gif
            var img = $('<img>').attr('src', serverURL + imgURL + 'loading.gif');
            $('.user-trade-loading').append(img);
        });

        $("#viewQPayShopReturnResult").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayShopReturnResult").one("pageshow", function (event, ui) {

        });

        $("#viewQPayShopReturnResult").on("pageshow", function (event, ui) {
            getTradeResult();
            //解除原本的事件监听
            document.removeEventListener("backbutton", onBackKeyDown, false);
            //监听本页自己的backkey logic
            document.addEventListener("backbutton", onBackKeyDownSpecial, false);
        });

        $("#viewQPayShopReturnResult").on("pagehide", function (event, ui) {
            $('.user-trade-main').hide();
            $('.user-trade-loading').show();
            document.removeEventListener("backbutton", onBackKeyDownSpecial, false);
            document.addEventListener("backbutton", onBackKeyDown, false);
        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            onBackKeyDownSpecial();
        });


    }
});