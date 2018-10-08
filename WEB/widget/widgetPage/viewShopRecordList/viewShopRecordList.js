$("#viewShopRecordList").pagecontainer({
    create: function (event, ui) {


        //获取店家消费券交易记录
        function getTradeRecordForShop() {
            var self = this;

            var query_data = JSON.parse(window.localStorage.getItem('shop_record_query'));
            var type = query_data['point_type_id'].toString();
            var startDate = query_data['start_date'].toString();
            var endDate = query_data['end_date'].toString();

            var queryStr = "&point_type_id=" + type + "&start_date=" + startDate + "&end_date=" + endDate;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //month
                    var recordYear = new Date(query_data['start_date'] * 1000).getFullYear();
                    var recordMonth = new Date(query_data['start_date'] * 1000).getMonth() + 1;
                    var recordTime = recordYear.toString() + '/' + recordMonth.toString();
                    $('.shop-record-month').text(recordTime);
                    //total money
                    var totalMoney = data['content']['sum_trade_point'].toString();
                    $('.shop-record-point').text(totalMoney);
                    //type
                    $('.shop-point-type').text(data['content']['point_type_name']);
                    //shop name
                    var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
                    //API回传数据
                    var record_list = data['content']['trade_record'];
                    var content = '';
                    for (var i in record_list) {
                        var tradeDate = new Date(record_list[i].trade_time * 1000).toLocaleDateString('zh');
                        var tradeTime = new Date(record_list[i].trade_time * 1000).toTimeString().substr(0, 5);

                        content += '<li class="shop-record-list"><div><div>' + shop_name + ' / No.' +
                            record_list[i].trade_id + '</div><div>TWD ' + record_list[i].trade_point + 
                            '</div></div><div>' + tradeDate + ' ' + tradeTime + '</div></li>';
                        
                    }
                    $('.shop-record-ul').html('').append(content);
                    setPageHeight();
                }

                loadingMask("hide");
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecordShop", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //动态设置页面高度
        function setPageHeight() {
            var headHeight = $('#viewShopRecordList .page-header').height();
            var titleHeight = $('.shop-record-total').height();
            var listHeight = $('.shop-record-ul').height();

            var totalHeight;
            if (device.platform === "iOS") {
                totalHeight = (headHeight + titleHeight + listHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + titleHeight + listHeight).toString();
            }

            $('.shop-record-scroll > div').css('height', totalHeight + 'px');
        }


        /********************************** page event ***********************************/
        $("#viewShopRecordList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopRecordList").one("pageshow", function (event, ui) {

        });

        $("#viewShopRecordList").on("pageshow", function (event, ui) {
            //API：获取交易记录
            getTradeRecordForShop();
        });

        $("#viewShopRecordList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //更新消费券交易记录
        $('.recordRefresh').on('click', function () {
            //1.获取当前年月
            var now = new Date();
            var curYear = now.getFullYear();
            var curMonth = now.getMonth() + 1;
            //2.获取查询条件
            var queryData = JSON.parse(window.localStorage.getItem('shop_record_query'));
            var queryYear = new Date(queryData['start_date'] * 1000).getFullYear();
            var queryMonth = new Date(queryData['start_date'] * 1000).getMonth() + 1;
            //3.比较年月
            if(queryYear == curYear && queryMonth == curMonth) {
                loadingMask("show");
                getTradeRecordForShop();
            }
        });


    }
});