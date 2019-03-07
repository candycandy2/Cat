$("#viewQPayShopReturnSearch").pagecontainer({
    create: function(event, ui) {

        //获取该交易的详细信息
        function checkTradeByTarget() {
            var self = this;

            var trade_id = $('#returnTradeCode').val();
            var shop_id = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_id'];
            var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
            var queryStr = '&trade_id=' + trade_id + '&shop_id=' + shop_id;

            this.successCallback = function (data) {
                //console.log(data);

                if (data['result_code'] == '1') {
                    var obj = {
                        shop_id: shop_id,
                        trade_shop: shop_name,
                        trade_id: data['content']['trade_id'],
                        trade_price: data['content']['trade_price'],
                        trade_time: data['content']['trade_time']
                    };
                    checkWidgetPage('viewQPayShopReturnReason', pageVisitedList, obj);
                } else if(data['result_code'] == '000939' ||
                data['result_code'] == '000940' ||
                data['result_code'] == '000941' ||
                data['result_code'] == '000942' ||
                data['result_code'] == '000943' ||
                data['result_code'] == '000923' ||
                data['result_code'] == '000945') {
                    $('.tradeCodeFailPopup .header-title').text(data['message']);
                    popupMsgInit('.tradeCodeFailPopup');
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "checkTradeID", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewQPayShopReturnSearch").on("pagebeforeshow", function(event, ui) {
            var isInit = window.sessionStorage.getItem('cancelTradeSuccess');
            if(isInit != null) {
                $('#returnTradeCode').val('');
                $('.returnToReason').removeClass('active-btn-green');
                window.sessionStorage.removeItem('cancelTradeSuccess');
            }
        });

        $("#viewQPayShopReturnSearch").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewQPayShopReturnSearch .page-main').css('height', mainHeight);
        });

        $("#viewQPayShopReturnSearch").on("pageshow", function(event, ui) {

        });

        $("#viewQPayShopReturnSearch").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //輸入交易碼後六位
        $('#returnTradeCode').on('input', function() {
            var val = $(this).val();
            var valLength = $(this).val().length;
            if(val != '' && valLength == 6) {
                $('.returnToReason').addClass('active-btn-green');
            } else {
                $('.returnToReason').removeClass('active-btn-green');
            }
        });

        //下一步
        $('.returnToReason').on('click', function() {
            var has = $(this).hasClass('active-btn-green');
            if(has) {
                checkTradeByTarget();
            }
        });


    }
});