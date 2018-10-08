$("#viewUserRecordList").pagecontainer({
    create: function (event, ui) {


        //获取储值记录
        function getStoreRecord() {
            var self = this;
            //开始时间为当年的第一天
            let start_time = new Date(new Date().getFullYear().toString() + '/1/1 00:00:00').getTime() / 1000;
            //结束时间为当天
            let end_time = Math.round(new Date().getTime() / 1000);
            //查询条件
            let queryStr = "&start_date=" + start_time.toString() + "&end_date=" + end_time.toString();

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    var record_list = data['content']['store_record'];
                    var content = '';
                    for (var i in record_list) {
                        var storeDate = new Date(record_list[i].store_time * 1000).toLocaleDateString('zh');
                        var storeTime = new Date(record_list[i].store_time * 1000).toTimeString().substr(0, 5);

                        content += '<li class="user-record-list"><div><div>' +
                            record_list[i].point_type + ' / No.' + record_list[i].store_id +
                            '</div><div>TWD ' + record_list[i].store_total +
                            '</div></div><div><div></div><div>' + storeDate + ' ' + storeTime + '</div></div></li>';
                    }
                    
                    $('.user-store-record-ul').html('').append(content);
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getStoreRecord", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //获取交易记录
        function getTradeRecord() {
            var self = this;
            //开始时间为当年的第一天
            let start_time = new Date(new Date().getFullYear().toString() + '/1/1 00:00:00').getTime() / 1000;
            //结束时间为当天
            let end_time = Math.round(new Date().getTime() / 1000);
            //查询条件
            let queryStr = "&start_date=" + start_time.toString() + "&end_date=" + end_time.toString();

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    var record_list = data['content']['trade_record'];
                    var content = '';
                    for (var i in record_list) {
                        var tradeDate = new Date(record_list[i].trade_time * 1000).toLocaleDateString('zh');
                        var tradeTime = new Date(record_list[i].trade_time * 1000).toTimeString().substr(0, 5);
                        var errorCode = record_list[i].error_code;
                        var errorReason = '';

                        switch (errorCode) {
                            case '':
                                errorReason = '';
                                break;

                            case '000923':
                                errorReason = langStr['wgt_085'];
                                break;
                        
                            case '000924':
                                errorReason = langStr['wgt_086'];
                                break;

                            case '000927':
                                errorReason = langStr['wgt_087'];
                                break;

                            case '000928':
                                errorReason = langStr['wgt_088'];
                                break;

                            case '000929':
                                errorReason = langStr['wgt_089'];
                                break;
                            
                            default:
                                errorReason = langStr['wgt_090'];
                        }

                        content += '<li class="user-record-list"><div><div>' + record_list[i].shop_name +
                            ' / No.' + record_list[i].trade_id + '</div><div>TWD ' +
                            (record_list[i].trade_success == 'N' ? '0' : '-' + record_list[i].trade_point) +
                            '</div></div><div><div>' + (errorCode !== '' ? langStr['wgt_069'] + '：' + errorReason : '') + 
                            '</div><div>' + tradeDate + ' ' + tradeTime + '</div></div></li>';
                    }

                    $('.user-trade-record-ul').html('').append(content);

                    loadingMask("hide");

                    setRecordListHeight();
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getTradeRecordEmp", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //动态设置页面高度
        function setRecordListHeight() {
            var headHeight = $('#viewUserRecordList .page-header').height();
            var storeHeight = $('.user-store-record-ul').height();
            var tradeHeight = $('.user-trade-record-ul').height();
            var totalHeight;

            if (device.platform === "iOS") {
                totalHeight = (headHeight + storeHeight + tradeHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (headHeight + storeHeight + tradeHeight).toString();
            }
            $('.user-record > div').css('height', totalHeight + 'px');
        }


        /********************************** page event ***********************************/
        $("#viewUserRecordList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserRecordList").one("pageshow", function (event, ui) {
            getStoreRecord();
            getTradeRecord();
        });

        $("#viewUserRecordList").on("pageshow", function (event, ui) {

        });

        $("#viewUserRecordList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('#userRefresh').on('click', function () {
            loadingMask("show");
            getStoreRecord();
            getTradeRecord();
        });


    }
});