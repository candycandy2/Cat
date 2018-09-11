$("#viewUserRecordList").pagecontainer({
    create: function (event, ui) {



        function initialPage() {

        }

        //获取储值记录
        function getStoreRecord(startDate, endDate) {
            var self = this;
            var queryStr = "&start_date=" + startDate + "&end_date=" + endDate;

            this.successCallback = function () {
                if (data['result_code'] == '1') {
                    var record_list = data['content'];
                    var content = '';

                    for (var i in record_list) {
                        content += '<li class="user-record-list"><div><div>' +
                            record_list[i]['store_record'].point_type + ' / No.' + record_list[i]['store_record'].store_id +
                            '</div><div>TWD ' + record_list[i]['store_record'].store_total +
                            '</div></div><div>' + record_list[i]['store_record'].store_time + '</div></li>';
                    }
                    $('.user-record-ul').html('').append(content);
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
            var queryStr = "&emp_type=emp&start_date=" + startDate + "&end_date=" + endDate;

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
                    $('.user-record-ul').html('').append(content);
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecord", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewUserRecordList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserRecordList").one("pageshow", function (event, ui) {

        });

        $("#viewUserRecordList").on("pageshow", function (event, ui) {
            // var queryData = JSON.parse(window.sessionStorage.getItem('query_user_record'));
            // if (queryData['type'] == 'store') {
            //     getStoreRecord(queryData['start'], queryData['end']);

            // } else if (queryData['type'] == 'trade') {
            //     getTradeRecord(queryData['start'], queryData['end']);

            // }
        });

        $("#viewUserRecordList").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('#userRefresh').on('click', function () {
            // var queryData = JSON.parse(window.sessionStorage.getItem('query_user_record'));
            // if (queryData['type'] == 'store') {
            //     getStoreRecord(queryData['start'], queryData['end']);

            // } else if (queryData['type'] == 'trade') {
            //     getTradeRecord(queryData['start'], queryData['end']);

            // }
        });



    }
});