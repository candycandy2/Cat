$("#viewStaffUserReserve").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffUserReserve/img/',
            staffService = 'meetingroomService',
            staffType = 'staff';

        function getMyReserve() {
            var self = this;

            let queryData = JSON.stringify({
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                service_id: staffService,
                service_type: staffType,
                start_date: new Date(new Date().yyyymmdd('/') + ' 00:00').getTime() / 1000,
                end_date: new Date(new Date().yyyymmdd('/') + ' 00:00').getTime() / 1000 + 14 * 24 * 60 * 60
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    //分组：当日和当日之后
                    let arr = data['content'][0]['record_list'];
                    let nowDate = new Date().yyyymmdd('/');
                    let todayArr = [];
                    let afterArr = [];
                    for(var i in arr) {
                        let itemDate = new Date(arr[i]['start_date'] * 1000).yyyymmdd('/');
                        if(nowDate == itemDate) {
                            todayArr.push(arr[i]);
                        } else {
                            afterArr.push(arr[i]);
                        }
                    }

                    //今日和今日后14日我的预约列表
                    createTodayReserve(todayArr);
                    createAFterReserve(afterArr);
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "getMyReserve", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //当日预约，已完成的不能删除和编辑，距离开始时间剩余不足半小时的不能编辑和删除
        function createTodayReserve(arr) {
            if(arr.length > 0) {
                let afterHalfHour = Math.floor(new Date().getTime() / 1000) + 30 * 60;
                let content = '';
                for(var i in arr) {
                    content += '<li class="tea-reserve-list"><div>' +
                        arr[i]['info_push_content'] +
                        '</div><div' +
                        (afterHalfHour > arr[i]['start_date'] ? ' class="hide"' : '') +
                        '></div><div' +
                        (afterHalfHour > arr[i]['start_date'] ? ' class="hide"' : '') +
                        '></div></li>';
                }

                $('.tea-today-list').html('').append(content);
            }
        }

        //往后14日的预约
        function createAFterReserve(arr) {
            if(arr.length > 0) {
                let content = '';
                for(var i in arr) {
                    content += '<li class="tea-reserve-list"><div>' +
                        new Date(arr[i]['start_date'] * 1000).mmdd('/') +
                        ' ' +
                        arr[i]['info_push_content'] +
                        '</div><div></div><div></div></li>';
                }

                $('.tea-after-list').html('').append(content);
            }
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserReserve").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserReserve").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserReserve .page-main').css('height', mainHeight);
        });

        $("#viewStaffUserReserve").on("pageshow", function(event, ui) {
            var msgContent = JSON.parse(window.sessionStorage.getItem('viewStaffUserReserve_parmData'));
            if(msgContent != null) {
                $('.reserveTeaNow .header-title').text(msgContent['content']);
                popupMsgInit('.reserveTeaNow');
                window.sessionStorage.removeItem('viewStaffUserReserve_parmData');
            }
            getMyReserve();
        });

        $("#viewStaffUserReserve").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});