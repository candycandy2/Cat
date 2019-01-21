$("#viewShopRecordList").pagecontainer({
    create: function (event, ui) {

        var refreshInterval = null;//每3秒refresh金額

        //获取店家消费券交易记录
        function getTradeRecordForShop() {
            var self = this;

            var query_data = JSON.parse(window.localStorage.getItem('shop_record_query'));
            var type_id = query_data['point_type_id'];
            var startDate = query_data['start_date'];
            var endDate = query_data['end_date'];

            //url query string
            var queryStr = "&point_type_id=" + type_id.toString() + "&start_date=" + startDate.toString() + "&end_date=" + endDate.toString();

            //month
            var recordYear = new Date(startDate * 1000).getFullYear();
            var recordMonth = new Date(startDate * 1000).getMonth() + 1;
            var recordTime = recordYear.toString() + '/' + recordMonth.toString();
            $('.shop-record-month').text(recordTime);
            //type
            var type_name = query_data['point_type_name'];
            $('.shop-point-type').text(type_name);

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //total money
                    var totalMoney = data['content']['sum_trade_point'].toString();
                    $('.shop-record-point').text(totalMoney);
                    //shop name
                    var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
                    //API回传数据
                    var record_list = data['content']['trade_record'];
                    var content = '';
                    for (var i in record_list) {

                        if(record_list[i]['trade_success'] == 'Y') {
                            var tradeDate = new Date(record_list[i].trade_time * 1000).yyyymmdd('/');
                            var tradeTime = new Date(record_list[i].trade_time * 1000).hhmm();

                            content += '<li class="shop-record-list"><div><div>' +
                                shop_name +
                                ' / No.' +
                                record_list[i].trade_id +
                                '</div><div>TWD ' +
                                (record_list[i].cancel_trade == 'Y' ? '-' : '') +
                                record_list[i].trade_point + 
                                '</div></div><div><div>' +
                                (record_list[i].cancel_trade == 'Y' ? record_list[i].cancel_reason : '') +
                                '</div><div>' +
                                tradeDate + ' ' + tradeTime +
                                '</div></div></li>';
                        }

                    }

                    if(content != '') {
                        $('.shop-no-record').hide();
                        $('.shop-record-ul').html('').append(content);

                    } else {
                        //no success data
                        $('.shop-record-ul').html('');
                        $('.shop-no-record').show();

                    }

                }

                loadingMask("hide");

                setPageHeight();
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
            //進入該頁面，每3秒refresh金額
            refreshInterval = setInterval(function() {
                $('#recordRefresh').trigger('click');
            }, 3000);
        });

        $("#viewShopRecordList").on("pagehide", function (event, ui) {
            //離開該頁面，取消refresh
            clearInterval(refreshInterval);
            refreshInterval = null;
        });


        /********************************** dom event *************************************/
        //更新消费券交易记录
        $('#recordRefresh').on('click', function () {
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
                //loadingMask("show");
                getTradeRecordForShop();
            }
        });


    }
});