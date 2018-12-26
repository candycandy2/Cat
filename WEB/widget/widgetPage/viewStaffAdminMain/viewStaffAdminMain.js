$("#viewStaffAdminMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminMain/img/',
            staffServiceID = 'meetingroomService',//茶水服务id
            staffServiceType = 'staff',//茶水服务类型
            staffKey = 'appempservice',
            statusList = [
            {id: 1, item: '服務中'},
            {id: 2, item: '忙碌中'},
            {id: 3, item: '暫停服務'},
        ];

        //初始化總機狀態dropdownlist
        function initAdminSetting() {
            var settingData = {
                id: "adminSettingPopup",
                option: [],
                title: '<input type="text" id="adminSettingNotice" maxlength="15" placeholder="總機公告(限15字)" />',
                defaultText: '暫停服務',
                defaultValue: '0',
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            for(var i in statusList) {
                settingData['option'][i] = {};
                settingData['option'][i]['value'] = statusList[i].id;
                settingData['option'][i]['text'] = statusList[i].item;
            }

            tplJS.DropdownList("viewStaffAdminMain", "adminSettingHidden", "prepend", "typeB", settingData);

            //去除默認選擇
            //$('#adminSettingPopup-option-list .tpl-dropdown-list-selected').removeClass('tpl-dropdown-list-selected');
        }

        //获取所有茶水相关讨论版
        function getBoardType() {
            let queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source></LayoutHeader>";

            var successCallback = function(data) {

                if(data['ResultCode'] == '1') {
                    let boardArr = data['Content']['board_list'];
                    let boardObj = {};
                    for(var i in boardArr) {
                        if(boardArr[i].board_name == 'staffFAQ') {
                            boardObj['staffFAQ'] = boardArr[i];

                        } else if(boardArr[i].board_name == 'staffAnnounce') {
                            boardObj['staffAnnounce'] = boardArr[i];
                        }
                    }
                    boardObj['lastUpdateTime'] = new Date();
                    window.localStorage.setItem('staffBoardType', JSON.stringify(boardObj));
                }

            };

            var failCallback = function(data) {};

            var __construct = function() {
                let staffBoardType = JSON.parse(window.localStorage.getItem('staffBoardType'));
                if(staffBoardType == null || checkDataExpired(staffBoardType['lastUpdateTime'], 1, 'dd')) {
                    QForumPlugin.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");
                }
            }();
        }

        //获取是否存在茶水服务，或者
        function getStaffEmpService() {
            var self = this;
            let queryData = JSON.stringify({
                service_id: staffServiceID//hardcode
            });

            this.successCallback = function(data) {
                //console.log(data);
                //表示没有该服务052002，需要newEmpService:meetingroomService
                if(data['result_code'] == '052002') {
                    newStaffEmpService();
                } else if(data['result_code'] == '1') {
                    let arr = data['content']['service_type_list'];

                    //1. 先找到staff服务
                    let staffArr = [];
                    for(var i in arr) {
                        if(arr[i]['service_type'] == staffServiceType) {
                            staffArr = arr[i]['service_id_list'];
                            break;
                        }
                    }

                    //2. 再找到meetingroom服务
                    let serviceArr = [];
                    for(var i in staffArr) {
                        if(staffArr[i]['service_id'] == staffServiceID) {
                            serviceArr = staffArr[i]['target_list'];
                            break;
                        }
                    }

                    //3. save to session
                    window.sessionStorage.setItem('meetingroomServiceTargetList', JSON.stringify(serviceArr));

                    //4. 获取当日和明日所有预约
                    getTodayAllReserve();
                    getTomorrowAllReserve();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "getEmpServiceTargetList", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //新增茶水服务，just only once
        function newStaffEmpService() {
            var self = this;
            let queryData = JSON.stringify({
                service_id: staffServiceID,//hardcode
                type: staffServiceType,//hardcode
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no']
            });

            this.successCallback = function(data) {
                console.log(data);
                //新增茶水服务成功后，再获取一次serviceTargetList
                getStaffEmpService();
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "newEmpService", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //获取当日该总机服务下所有会议室的茶水预约
        function getTodayAllReserve() {
            var self = this;
            let queryData = JSON.stringify({
                service_id: staffServiceID,
                start_date: new Date(new Date().yyyymmdd("/") + " 00:00:00").getTime() / 1000,
                end_date: new Date(new Date().yyyymmdd("/") + " 23:59:59").getTime() / 1000
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    let todayArr = data['content']['record_list'];
                    if(todayArr.length == 0) {
                        //本会议室今日暂无茶水预约
                        $('.today-no-data').show();
                        $('.main-today-ul').html('');
                        $('.main-complete-ul').html('');
                    } else {
                        $('.today-no-data').hide();
                        let noCompleteContent = '';
                        let completedContent = '';
                        for(var i in todayArr) {
                            //先区分已完成和未完成部分
                            if(todayArr[i]['complete'] == 'N') {
                                noCompleteContent += '<li class="today-list"><div class="today-item">' +
                                    todayArr[i]['info_push_content'] +
                                    ' / ' +
                                    todayArr[i]['reserve_login_id'] +
                                    '</div><div class="today-handle"><div class="today-done-btn" data-id="' +
                                    todayArr[i]['reserve_id'] +
                                    '"></div><div class="today-tel-btn"></div></div></li>';
                            } else {
                                completedContent += '<li class="complete-list"><div>' +
                                    todayArr[i]['info_push_content'] +
                                    ' / Allen.Z.Yuan</div><div></div></li>';
                            }
                        }

                        $('.main-today-ul').html('').append(noCompleteContent);
                        $('.main-complete-ul').html('').append(completedContent);
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //更新时间
                let nowTime = new Date().yyyymmdd('/') + ' ' + new Date().hhmm();
                $('.admin-main-update-time').text(nowTime);
                //API
                EmpServicePlugin.QPlayAPI("POST", "getReserveRecord", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //获取明日该总机服务下所有会议室的茶水预约
        function getTomorrowAllReserve() {
            var self = this;
            let queryData = JSON.stringify({
                service_id: staffServiceID,
                start_date: new Date(new Date().yyyymmdd("/") + " 00:00:00").getTime() / 1000 + 60 * 60 * 24,
                end_date: new Date(new Date().yyyymmdd("/") + " 23:59:59").getTime() / 1000 + 60 * 60 * 24
            });

            this.successCallback = function(data) {
                //console.log(data);

                if(data['result_code'] == '1') {
                    let tomorrowArr = data['content']['record_list'];
                    if(tomorrowArr.length == 0) {
                        //本会议室明日暂无茶水预约
                        $('.tomorrow-no-data').show();
                        $('.main-tomorrow-ul').html('');
                    } else {
                        $('.tomorrow-no-data').hide();
                        let content = '';
                        for(var i in tomorrowArr) {
                            content += '<li class="tomorrow-list"><div>' +
                                tomorrowArr[i]['info_push_content'] +
                                ' / ' +
                                tomorrowArr[i]['reserve_login_id'] +
                                '</div></li>';
                        }

                        $('.main-tomorrow-ul').html('').append(content);
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "getReserveRecord", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //完成某项茶水服务
        function completeTodayReserve(id) {
            var self = this;
            let queryData = JSON.stringify({
                reserve_id: id,
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no']
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    //成功以后，重新捞取当日记录
                    getTodayAllReserve();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "setReserveComplete", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //tese
        function newReserveTest() {
            var self = this;
            let queryData = JSON.stringify({
                target_id_row_id: 15,//T01
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                start_date: '1545796800',//12:30
                end_date: '1545796800',//12:00
                info_push_title: '茶水預約',
                info_push_content: '12:00 T01 預約茶3杯水1杯',
                info_data: '{"T01","12:00","3","1"}',
                push: '11'
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "newReserve", self.successCallback, self.failCallback, queryData, '');
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminMain .page-main').css('height', mainHeight);
            initAdminSetting();
            //获取所有staff的board主题
            getBoardType();
            //是否有茶水服务
            getStaffEmpService();
            //newReserveTest();
        });

        $("#viewStaffAdminMain").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切換本日和明日
        $('.admin-main-navbar > div').on('click', function() {
            var has = $(this).hasClass('active-navbar');

            if(!has) {
                var type = $(this).data('type');
                $(this).addClass('active-navbar');
                if(type == 'today') {
                    $('div[data-type="tomorrow"]').removeClass('active-navbar');
                    $('.admin-main-tomorrow').hide();
                } else {
                    $('div[data-type="today"]').removeClass('active-navbar');
                    $('.admin-main-today').hide();
                }
                $('.admin-main-' + type).show();
            }
        });

        //左滑 打開handle
        $('.admin-main-today').on('swipeleft', '.today-item', function() {
            $(this).animate({left: '-40vw'}, 200, 'linear');
        });

        //右滑 關閉handle
        $('.admin-main-today').on('swiperight', '.today-item', function() {
            $(this).animate({left: '0'}, 200, 'linear');
        });

        //点击完成
        $('.main-today-ul').on('click', '.today-done-btn', function() {
            let reserve_id = $(this).data('id');
            completeTodayReserve(reserve_id);
        });

        //点击电话
        $('.main-today-ul').on('click', '.today-tel-btn', function() {
            let reserve_id = $(this).data('id');
            //yellowpage or rrs
        });

        //setting admin status
        $('#adminSettingBtn').on('click', function() {
            $('#adminSettingPopup').trigger('click');
        });

        //彈窗關閉，text控件失焦
        $(document).on("popupafterclose", "#adminSettingPopup-option-popup", function() {
            $('#adminSettingNotice').blur();
            //value
            var value = $('#adminSettingNotice').val();
            $('.title-text-now').text(value);
            //text
            var text = $.trim($('#adminSettingPopup').text());
            $('.title-text-status').text(text);
        });

        //改變狀態
        $(document).on('change', '#adminSettingPopup', function() {
            var statusValue = $(this).val();
            if(statusValue == 1) {
                $('.main-title-status').removeClass('active-status-false').addClass('active-status-true');
            } else if (statusValue == 2) {
                $('.main-title-status').removeClass('active-status-true').addClass('active-status-false');
            } else {
                $('.main-title-status').removeClass('active-status-true').removeClass('active-status-false');
            }
        });


    }
});