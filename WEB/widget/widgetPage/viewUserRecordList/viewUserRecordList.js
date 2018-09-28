$("#viewUserRecordList").pagecontainer({
    create: function (event, ui) {



        function initialPage() {

        }

        //获取储值记录
        function getStoreRecord(startDate, endDate) {
            var self = this;
            var queryStr = "&start_date=" + startDate + "&end_date=" + endDate;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    var record_list = data['content']['store_record'];
                    var content = '';

                    for (var i in record_list) {
                        content += '<li class="user-record-list"><div><div>' +
                            record_list[i].point_type + ' / No.' + record_list[i].store_id +
                            '</div><div>TWD ' + record_list[i].store_total +
                            '</div></div><div>' + record_list[i].store_time + '</div></li>';
                    }
                    $('.user-record-ul').html('').append(content);

                    loadingMask("hide");

                    setRecordListHeight();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getStoreRecord", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //获取交易记录
        function getTradeRecord(startDate, endDate) {
            var self = this;
            var queryStr = "&start_date=" + startDate + "&end_date=" + endDate;

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    var record_list = data['content']['trade_record'];
                    var content = '';

                    for (var i in record_list) {
                        if (record_list[i].trade_success == 'Y') {
                            content += '<li class="user-record-list"><div><div>' + record_list[i].shop_name +
                                ' / No.' + record_list[i].trade_id + '</div><div>TWD -' +
                                record_list[i].trade_point + '</div></div><div>' +
                                record_list[i].trade_time + '</div></li>';
                        }
                    }
                    $('.user-record-ul').html('').append(content);

                    loadingMask("hide");

                    setRecordListHeight();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecordEmp", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //设置布局视口
        function setRecordListHeight() {
            var headHeight = $('#viewUserRecordList .page-header').height();
            var mainHeight = $('.user-record-ul').height();
            var totalHeight;

            if (device.platform === "iOS") {
                totalHeight = (headHeight + mainHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + mainHeight).toString();
            }
            $('.user-record > div').css('height', totalHeight + 'px');
        }


        /********************************** page event ***********************************/
        $("#viewUserRecordList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserRecordList").one("pageshow", function (event, ui) {

        });

        $("#viewUserRecordList").on("pageshow", function (event, ui) {
            var queryData = JSON.parse(window.sessionStorage.getItem('query_user_record'));
            if (queryData['type'] == 'store') {
                getStoreRecord(queryData['start'], queryData['end']);

            } else if (queryData['type'] == 'trade') {
                getTradeRecord(queryData['start'], queryData['end']);

            }
        });

        $("#viewUserRecordList").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('#userRefresh').on('click', function () {
            loadingMask("show");
            var queryData = JSON.parse(window.sessionStorage.getItem('query_user_record'));
            if (queryData['type'] == 'store') {
                getStoreRecord(queryData['start'], queryData['end']);

            } else if (queryData['type'] == 'trade') {
                getTradeRecord(queryData['start'], queryData['end']);

            }
        });



    }
});