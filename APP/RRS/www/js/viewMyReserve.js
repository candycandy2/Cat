$(document).one('pagecreate', '#viewMyReserve', function() {

    $('#viewMyReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function queryMyReserve() {

                var self = this;

                this.successCallback = $.getJSON('js/QueryReserve', function(data) {

                    if (data['result_code'] == '1') {

                        $('div[id^=def-]').remove();

                        var htmlContent_today = '';
                        var htmlContent_other = '';
                        var originItem = ['default', '[begin]', '[end]', '[value]', '[room]', '[date]', 'disable'];

                        sortDataByKey(data['content'], 'ReserveDate', 'asc');

                        for (var i = 0, item; item = data['content'][i]; i++) {

                            // convert yyyymmdd to yyyy/mm/dd
                            var arrCutString = cutStringToArray(item.reserveDate, ['4','2','2']);
                            var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];

                            // convert date format to mm/dd(day of week)
                            var d = new Date(strDate);
                            var dateFormat =
                                d.getMonth() + 1 + '/' +
                                d.getDate() +
                                dictDayOfWeek[d.getDay()];

                            var replaceItem = ['def-'+ item.traceID, item.bTime, item.eTime, item.traceID, item.roomName, dateFormat, ''];

                            if (item.reserveDate == new Date().yyyymmdd('')) {
                                htmlContent_today
                                    += replaceStr($('#defaultToday').get(0).outerHTML, originItem, replaceItem);
                            } else {
                                htmlContent_other
                                    += replaceStr($('#defaultOtherDay').get(0).outerHTML, originItem, replaceItem);
                            }
                        }

                        $('#todayLine').after(htmlContent_today);
                        $('#otherDayLine').after(htmlContent_other);

                    } else {
                        //ResultCode = 001901, [no data]
                    }
                });

                // this.failCallback = function(data) {};

                // var __construct = function() {
                //     QPlayAPI("POST", "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData);
                // }();

            }

            /********************************** page event *************************************/
            $('#viewMyReserve').on('pagebeforeshow', function(event, ui) {
                // loadingMask("show");
                queryMyReserve();
            });

            /********************************** dom event *************************************/

        }
    });

});
