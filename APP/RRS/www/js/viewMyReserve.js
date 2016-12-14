$(document).one('pagecreate', '#viewMyReserve', function() {
    var clickAggTarceID = '';
    var clickReserveDate = '';

    $('#viewMyReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getAPIQueryMyReserve() {
                var self = this;
                var today = new Date();
                var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + today.yyyymmdd('') + '</NowDate></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "1") {
                        //Successful
                        $('div[id^=def-]').remove();

                        var htmlContent_today = '';
                        var htmlContent_other = '';
                        var originItem = ['default', '[begin]', '[end]', '[value]', '[room]', '[date]', '[dateformate]', 'disable'];

                        sortDataByKey(data['Content'], 'ReserveDate', 'asc');

                        for (var i = 0, item; item = data['Content'][i]; i++) {

                            // convert yyyymmdd(string) to yyyy/mm/dd
                            var arrCutString = cutStringToArray(item.ReserveDate, ['4', '2', '2']);
                            var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];

                            // convert date format to mm/dd(day of week)
                            var d = new Date(strDate);
                            var dateFormat = d.mmdd('/') + dictDayOfWeek[d.getDay()];

                            var replaceItem = ['def-' + item.ReserveTraceAggID, item.ReserveBeginTime, item.ReserveEndTime, item.ReserveTraceAggID, item.MeetingRoomName, item.ReserveDate, dateFormat, ''];

                            if (item.ReserveDate == new Date().yyyymmdd('')) {
                                $('#myReserve :first-child h2').removeClass('disable');
                                htmlContent_today
                                    += replaceStr($('#defaultToday').get(0).outerHTML, originItem, replaceItem);
                            } else {
                                htmlContent_other
                                    += replaceStr($('#defaultOtherDay').get(0).outerHTML, originItem, replaceItem);
                            }
                        }

                        $('#todayLine').after(htmlContent_today);
                        $('#otherDayLine').after(htmlContent_other);

                    } else if (data['ResultCode'] === "002901") {
                        //Not Found Reserve Data
                        popupMsg('myReservePopupMsg', 'noDataMsg', '沒有您的預約資料', '', true, '返回預約頁面', '#', '#');
                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "QueryMyReserve", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIMyReserveCancel(date, traceID) {
                var self = this;
                var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID></ReserveTraceID><ReserveTraceAggID>' + traceID + '</ReserveTraceAggID></LayoutHeader>';

                this.successCallback = function(data) {

                    if (data['ResultCode'] === "002905") {
                        //Cancel a Reservation Successful
                        $('div[id^=def-' + traceID + ']').hide();
                        popupMsg('myReservePopupMsg', 'successMsg', '取消預約成功', '', true, '確定', '#', '#');

                    } else if (data['ResultCode'] === "002906") {
                        //Cancel a Reservation Failed
                        popupMsg('myReservePopupMsg', 'failMsg', '取消預約失敗', '', true, '確定', '#', '#');
                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData);
                }();
            }

            /********************************** page event *************************************/
            $('#viewMyReserve').on('pagebeforeshow', function(event, ui) {
                var doAPIQueryMyReserve = new getAPIQueryMyReserve();
            });

            /********************************** dom event *************************************/

            $('body').on('click', 'div[id^=def-] a', function() {
                clickAggTarceID = $(this).attr('value');
                clickReserveDate = $(this).attr('date');
                popupMsg('myReservePopupMsg', 'cancelMsg', '確定取消預約', '', true, '確定', '#', '#');
            });

            $('body').on('click', 'div[for=cancelMsg] #confirm', function() {
                var doAPIMyReserveCancel = new getAPIMyReserveCancel(clickReserveDate, clickAggTarceID);
            });

            $('body').on('click', 'div[for=noDataMsg] #confirm', function() {
                $.mobile.changePage('#viewReserve');
            });

            $('body').on('click', 'div[for=successMsg] #confirm', function() {
                $('div[for=successMsg]').popup('close');
            });

            $('body').on('click', 'div[for=failMsg] #confirm', function() {
                $('div[for=failMsg]').popup('close');
            });

            $('#myReserveBack').on('click', function() {
                $.mobile.changePage('#viewReserve');
            });
        }
    });

});
