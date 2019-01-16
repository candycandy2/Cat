$("#viewPayShopReturnSearch").pagecontainer({
    create: function(event, ui) {

        //获取该交易的详细信息
        function checkTradeByTarget() {
            var self = this;

            let trade_id = $('#returnTradeCode').val();
            let shop_id = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_id'];
            let queryStr = '&trade_id=' + trade_id + '&shop_id=' + shop_id;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    
                } else if(data['result_code'] == '000933') {
                    //此交易码不存在
                } else if(data['result_code'] == '000934') {
                    //交易码与店家不符
                } else if(data['result_code'] == '000935') {
                    //交易逾期，超过7天
                } else if(data['result_code'] == '000936') {
                    //已退款成功
                } else if(data['result_code'] == '000937') {
                    //无法取消
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "checkTradeID", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewPayShopReturnSearch").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewPayShopReturnSearch").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewPayShopReturnSearch .page-main').css('height', mainHeight);
        });

        $("#viewPayShopReturnSearch").on("pageshow", function(event, ui) {

        });

        $("#viewPayShopReturnSearch").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //輸入交易碼後六位
        $('#returnTradeCode').on('input', function() {
            let val = $(this).val();
            if(val != '') {
                $('.returnToReason').addClass('active-btn-green');
            } else {
                $('.returnToReason').removeClass('active-btn-green');
            }
        });

        //下一步
        $('.returnToReason').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                checkTradeByTarget();
            }
        });


    }
});