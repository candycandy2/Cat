$("#viewQPayUserRecordList").pagecontainer({
    create: function (event, ui) {

        var storeListFinish = false,
            tradeListFinish = false;

        //获取储值记录
        function getStoreRecord() {
            var self = this;
            //开始时间为当年的第一天
            let start_time = new Date(new Date().getFullYear().toString() + '/1/1 00:00:00').getTime() / 1000;
            //结束时间为当天此时此刻
            let end_time = Math.round(new Date().getTime() / 1000);
            //查询条件
            let queryStr = "&start_date=" + start_time.toString() + "&end_date=" + end_time.toString();

            this.successCallback = function (data) {
                //console.log(data);

                if (data['result_code'] == '1') {
                    var record_list = data['content']['store_record'];
                    var content = '';
                    for (var i in record_list) {
                        var store_time = record_list[i].store_time;
                        var storeDate = new Date(store_time * 1000).yyyymmdd('/');
                        var storeTime = new Date(store_time * 1000).hhmm();

                        content += '<li class="user-record-list" data-index="' + store_time.toString() +
                            '"><div><div>' + record_list[i].point_type + langStr['wgt_096'] + ' / No.' + record_list[i].store_id +
                            '</div><div>TWD ' + record_list[i].store_total + '</div></div><div><div></div><div>' +
                            storeDate + ' ' + storeTime + '</div></div></li>';
                    }
                    
                    $('.user-record-ul').append(content);
                    
                }

                storeListFinish = true;
            };

            this.failCallback = function () {
                storeListFinish = true;
            };

            var __construct = function () {
                QPlayAPIEx("GET", "getStoreRecord", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //获取交易记录
        function getTradeRecord() {
            var self = this;
            //开始时间为当年的第一天
            let start_time = new Date(new Date().getFullYear().toString() + '/1/1 00:00:00').getTime() / 1000;
            //结束时间为当天此时此刻
            let end_time = Math.round(new Date().getTime() / 1000);
            //查询条件
            let queryStr = "&start_date=" + start_time.toString() + "&end_date=" + end_time.toString();

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    var record_list = data['content']['trade_record'];
                    var content = '';
                    for (var i in record_list) {

                        if(record_list[i]['trade_success'] == 'Y') {
                            var trade_time = record_list[i].trade_time;
                            var tradeDate = new Date(trade_time * 1000).yyyymmdd('/');
                            var tradeTime = new Date(trade_time * 1000).hhmm();

                            content += '<li class="user-record-list" data-index="' +
                                trade_time.toString() +
                                '"><div><div>' +
                                record_list[i].shop_name +
                                ' / No.' +
                                record_list[i].trade_id +
                                '</div><div>TWD ' +
                                (record_list[i].cancel_trade == 'Y' ? '' : '-') +
                                record_list[i].trade_point +
                                '</div></div><div><div>' +
                                (record_list[i].cancel_trade == 'Y' ? record_list[i].cancel_reason : '') +
                                '</div><div>' +
                                tradeDate + ' ' + tradeTime +
                                '</div></div></li>';
                        }
                        
                    }

                    $('.user-record-ul').append(content);
                    
                }

                tradeListFinish = true;
            };

            this.failCallback = function () {
                tradeListFinish = true;
            };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecordEmp", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //动态设置页面高度
        function setRecordListHeight() {
            var headHeight = $('#viewQPayUserRecordList .page-header').height();
            var MainHeight = $('.user-record-ul').height();
            var totalHeight;

            if (device.platform === "iOS") {
                totalHeight = (headHeight + MainHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + MainHeight).toString();
            }
            $('.user-record > div').css('height', totalHeight + 'px');
        }

        //DOM排序
        function sortRecordList() {
            var recordInterval = setInterval(function() {
                if(storeListFinish && tradeListFinish) {
                    clearInterval(recordInterval);

                    var $list = $('.user-record-ul li');

                    $list.sort(function (a, b) {
                        var index1 = $(a).data('index');
                        var index2 = $(b).data('index');
                        if(parseInt(index1) < parseInt(index2)) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    $list.detach().appendTo('.user-record-ul');

                    loadingMask("hide");

                    setRecordListHeight();
                }
            }, 500);
        }


        /********************************** page event ***********************************/
        $("#viewQPayUserRecordList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQPayUserRecordList").one("pageshow", function (event, ui) {
            //API
            getTradeRecord();
            getStoreRecord();
            //sort
            sortRecordList();
        });

        $("#viewQPayUserRecordList").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserRecordList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('#userRefresh').on('click', function () {
            loadingMask("show");
            $('.user-record-ul').html('');
            storeListFinish = false;
            tradeListFinish = false;
            //API
            getTradeRecord();
            getStoreRecord();
            //sort
            sortRecordList();
        });


    }
});