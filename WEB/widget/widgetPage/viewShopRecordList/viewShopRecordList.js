$("#viewShopRecordList").pagecontainer({
    create: function (event, ui) {


        //获取店家消费券交易记录
        function getTradeRecord() {
            var self = this;

            var queryData = JSON.parse(window.sessionStorage.getItem('query_shop_record'));
            var type = queryData['type'];
            var startDate = queryData['start'];
            var endDate = queryData['end'];

            var queryStr = "&emp_type=shop&point_type=" + type + "&start_date=" + startDate + "&end_date=" + endDate;

            this.successCallback = function () {
                if (data['result_code'] == '1') {
                    var record_list = data['content'];
                    var content = '';

                    for (var i in record_list) {
                        if (record_list[i]['trade_record'].trade_success == 'Y') {
                            content += '<li class="user-record-list"><div><div>' + record_list[i]['trade_record'].shop_name +
                                ' / No.' + record_list[i]['trade_record'].trade_id + '</div><div>TWD -' +
                                record_list[i]['trade_record'].trade_point + '</div></div><div>' +
                                record_list[i]['trade_record'].trade_time + '</div></li>';
                        }
                    }
                    $('.shop-record-ul').html('').append(content);
                    setPageHeight();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecord", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

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
            //Call API
            //getTradeRecord();
        });

        $("#viewShopRecordList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('.recordRefresh').on('click', function () {
            //Call API
            //getTradeRecord();
        });




    }
});