$("#viewStaffAdminMain").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminMain/img/',
            staffServiceID = 'meetingroomService',//茶水服务id
            staffServiceType = 'staff',//茶水服务类型
            staffKey = 'appempservice',
            statusList = [
                {id: 1, item: langStr['wgt_114']},
                {id: 2, item: langStr['wgt_115']},
                {id: 0, item: langStr['wgt_116']},
            ],
            status_row_id,
            adminRefresh = null,
            refreshInterval = null,
            allowPush = null,
            headerHeight;

        //获取当前时间并精确到秒
        function getTimeSec() {
            var hh = new Date().getHours().toString();
            var mm = new Date().getMinutes().toString();
            var ss = new Date().getSeconds().toString();
            return (hh[1] ? hh : '0' + hh[0]) + ':' + (mm[1] ? mm : '0' + mm[0]) + ':' + (ss[1] ? ss : '0' + ss[0]);
        }

        //初始化總機狀態dropdownlist
        function initAdminSetting() {
            var settingData = {
                id: "adminSettingPopup",
                option: [],
                title: '<input type="text" id="adminSettingNotice" maxlength="15" placeholder="' + langStr['wgt_122'] + '" />',
                defaultText: langStr['wgt_116'],
                defaultValue: 100,
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
                            let feedbackBoard = boardArr[i]['board_id'];
                            getpostList(feedbackBoard);

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
                if(staffBoardType == null || checkDataExpired(staffBoardType['lastUpdateTime'], 7, 'dd')) {
                    QForumPlugin.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");
                } else {
                    let feedbackBoard = staffBoardType['staffFAQ']['board_id'];
                    getpostList(feedbackBoard);
                }
            }();
        }

        //获取反馈问题未读数量
        function getpostList(id) {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                id +
                "</board_id></LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    //只需要统计未读信息的数量即可
                    let unreadCount = 0;
                    //readlist已读列表
                    let readList = JSON.parse(window.localStorage.getItem('AdminFeedbackList')) || {};
                    let readLength = Object.getOwnPropertyNames(readList).length;
                    //postlist
                    let postList = data['Content'];
                    window.sessionStorage.setItem('AdminFeedBackArray', JSON.stringify(postList));

                    if(readLength == 0) {
                        unreadCount = postList.length;
                    } else {
                        for(var i in postList) {
                            //1.确认已读未读状态
                            if(typeof readList[postList[i]['post_id']] == 'undefined') {
                                unreadCount++;
                            }
                        }
                    }

                    //如果数量大于0显示在菜单badge上
                    if(unreadCount > 0) {
                        $('.newFeedback').show();
                        $('#feedbackBadge').text(unreadCount).show();
                    } else {
                        $('.newFeedback').hide();
                        $('#feedbackBadge').hide();
                    }
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostList", successCallback, failCallback, queryData, "");
            }();
        }

        //获取总机状态
        function getStaffStatus() {
            var self = this;
            let queryData = JSON.stringify({
                status_id: staffServiceID//hardcode
            });

            this.successCallback = function(data) {
                //console.log(data);

                //表示没有该状态000934，需要setStatus:meetingroomService
                if(data['result_code'] == '000934') {
                    newStaffStatus();
                } else if(data['result_code'] == '1') {

                    let status_info;
                    for(var i in data['content']['status_list']) {
                        if(data['content']['status_list'][i]['status_id'] == staffServiceID) {
                            status_info = data['content']['status_list'][i]['period_list'][0];
                            break;
                        }
                    }
                    //1.绿灯红灯
                    status_row_id = status_info['life_crontab_row_id'];
                    let statusValue = status_info['status'];
                    $('#adminSettingPopup option:eq(0)').text(statusValue);
                    if(statusValue == 1) {
                        $('.main-title-status').addClass('active-status-true');
                        $('#adminSettingPopup-option-popup li:eq(0)').addClass('tpl-dropdown-list-selected');
                    } else if(statusValue == 2) {
                        $('.main-title-status').addClass('active-status-false');
                        $('#adminSettingPopup-option-popup li:eq(1)').addClass('tpl-dropdown-list-selected');
                    } else if(statusValue == 0) {
                        $('#adminSettingPopup-option-popup li:eq(2)').addClass('tpl-dropdown-list-selected');
                    }
                    //2.状态名称
                    let statusText = $('#adminSettingPopup-option-popup .tpl-dropdown-list-selected').text();
                    $('.title-text-status').text(statusText);
                    //3.状态描述，暂用crontab栏位存取
                    let description = (status_info['note'] == null ? '' : status_info['note']);
                    $('.title-text-now').text(description);
                    $('#adminSettingNotice').val(description);
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                StatusPlugin.QPlayAPI("POST", "getStatus", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //新增总机状态
        function newStaffStatus() {
            var self = this;
            let queryData = JSON.stringify({
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                status_new: [{
                    status_id: staffServiceID,
                    status_type: staffServiceType,
                    period_list: [{
                        life_type: 0,//表示无生命周期
                        status: 1,//1表示online,0表示offline,2表示busy
                        crontab: '*****'
                    }]
                }]
            });

            this.successCallback = function(data) {
                //console.log(data);

                if(data['result_code'] == '1') {
                    //如果新增成功，再获取一次当前总机状态
                    getStaffStatus();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                StatusPlugin.QPlayAPI("POST", "setStatus", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //修改总机状态
        function setStaffStatus(id, desc) {
            var self = this;
            let queryData = JSON.stringify({
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                status_update: [{
                    status_id: staffServiceID,
                    status_type: staffServiceType,//与status_id择一
                    period_list: [{
                        life_crontab_row_id: status_row_id,
                        life_type: 0,//表示无生命周期
                        status: id,//1表示online,0表示offline,2表示busy
                        crontab: '*****',
                        note: desc
                    }]
                }]
            });

            this.successCallback = function(data) {
                //console.log(data);
                //nothing to do
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                StatusPlugin.QPlayAPI("POST", "setStatus", self.successCallback, self.failCallback, queryData, '');
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

                    //1.先找到staff服务
                    let staffArr = [];
                    for(var i in arr) {
                        if(arr[i]['service_type'] == staffServiceType) {
                            staffArr = arr[i]['service_id_list'];
                            break;
                        }
                    }

                    //2.再找到meetingroom服务
                    let serviceArr = [];
                    for(var i in staffArr) {
                        if(staffArr[i]['service_id'] == staffServiceID) {
                            serviceArr = staffArr[i]['target_list'];
                            break;
                        }
                    }

                    //3.排序
                    serviceArr.sort(function(a, b) {
                        return a['target_id'].localeCompare(b['target_id']);
                    });

                    //4.save to session
                    window.sessionStorage.setItem('meetingroomServiceTargetList', JSON.stringify(serviceArr));

                    //5.获取当日和明日所有预约
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
                //console.log(data);

                if(data['result_code'] == '1') {
                    //新增茶水服务成功后，再获取一次serviceTargetList
                    getStaffEmpService();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "newEmpService", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //获取当前总机（登录人）是否在推播列表中
        function getEmpServiceList() {
            var self = this;
            var queryData = JSON.stringify({
                service_type: staffServiceType
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    //先找到茶水的service_id
                    var serviceArr = data['content']['service_type_list'][0]['service_id_list'];
                    var pushArr = [];
                    for(var i in  serviceArr) {
                        if(serviceArr[i]['service_id'] == staffServiceID) {
                            pushArr = serviceArr[i]['push_list'];
                            break;
                        }
                    }

                    //再找个人
                    var flag = false;
                    for(var i in pushArr) {
                        if(pushArr[i]['emp_no'] == loginData['emp_no']) {
                            flag = true;
                            break;
                        }
                    }

                    //判断是否找到个人，如果没有找到，开关关闭；否则开关开启。
                    //并且将结果记录到local端，每次进来首先看local端是否有数据
                    if(flag) {
                        allowPush = true;
                        //1. append img
                        $('.title-text-switch').append('<img src="' + serverURL + imgURL + 'switch_open.png" data-type="delete">');
                        //2. save local
                        window.localStorage.setItem('OpenAdminPush', 'Y');
                        //3. do something
                        getStaffEmpService();
                        getBoardType();
                        //4. 设置定时器和下拉更新
                        refreshInterval = setInterval(function() {
                            getTodayAllReserve();
                            getTomorrowAllReserve();
                        }, 10000);
                        adminRefresh = PullToRefresh.init({
                            mainElement: '.admin-main-update',
                            onRefresh: function() {
                                getTodayAllReserve();
                                getTomorrowAllReserve();
                            }
                        });
                    } else {
                        allowPush = false;
                        //1. append img
                        $('.title-text-switch').append('<img src="' + serverURL + imgURL + 'switch_close.png" data-type="new">');
                        //2. save local
                        window.localStorage.setItem('OpenAdminPush', 'N');
                        //3. nothing to do
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                var openPush = window.localStorage.getItem('OpenAdminPush');
                if(openPush == 'Y') {
                    allowPush = true;
                    //append img
                    $('.title-text-switch').append('<img src="' + serverURL + imgURL + 'switch_open.png" data-type="delete">');
                    //do something
                    getStaffEmpService();
                    getBoardType();
                    //4. 设置定时器和下拉更新
                    refreshInterval = setInterval(function() {
                        getTodayAllReserve();
                        getTomorrowAllReserve();
                    }, 10000);
                    adminRefresh = PullToRefresh.init({
                        mainElement: '.admin-main-update',
                        onRefresh: function() {
                            getTodayAllReserve();
                            getTomorrowAllReserve();
                        }
                    });
                } else if(openPush == 'N') {
                    allowPush = false;
                    //append img
                    $('.title-text-switch').append('<img src="' + serverURL + imgURL + 'switch_close.png" data-type="new">');
                    //nothing to do
                } else {
                    EmpServicePlugin.QPlayAPI("POST", "getEmpServiceList", self.successCallback, self.failCallback, queryData, '');
                }
            }();
        }

        //修改个人的推播设定
        function setServicePush(type) {
            var self = this;
            var queryData = {
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no']
            };
            queryData[type] = [];
            queryData[type].push(staffServiceID);

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    if(type == 'delete') {
                        //img
                        $('.title-text-switch img').attr('src', serverURL + imgURL + 'switch_close.png');
                        $('.title-text-switch img').attr('data-type', 'new');
                        //data
                        allowPush = false;
                        window.localStorage.setItem('OpenAdminPush', 'N');
                        //清除定时器下拉更新
                        if(refreshInterval != null) {
                            clearInterval(refreshInterval);
                            refreshInterval = null;
                        }
                        if(adminRefresh != null) {
                            adminRefresh.destroy();
                            $('#viewStaffAdminMain .ptr--ptr').remove();
                            adminRefresh = null;
                        }
                        //do something
                        $('.main-today-ul').html('');
                        $('.main-complete-ul').html('');
                        $('.main-tomorrow-ul').html('');
                    } else {
                        //img
                        $('.title-text-switch img').attr('src', serverURL + imgURL + 'switch_open.png');
                        $('.title-text-switch img').attr('data-type', 'delete');
                        //data
                        allowPush = true;
                        window.localStorage.setItem('OpenAdminPush', 'Y');
                        //do something
                        getStaffEmpService();
                        getBoardType();
                        //设置定时器和下拉更新
                        refreshInterval = setInterval(function() {
                            getTodayAllReserve();
                            getTomorrowAllReserve();
                        }, 10000);
                        adminRefresh = PullToRefresh.init({
                            mainElement: '.admin-main-update',
                            onRefresh: function() {
                                getTodayAllReserve();
                                getTomorrowAllReserve();
                            }
                        });
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "setEmpServicePush", self.successCallback, self.failCallback, JSON.stringify(queryData), '');
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
                //console.log(data);

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
                            //先区分未完成和已完成部分
                            if(todayArr[i]['complete'] == 'N') {
                                noCompleteContent += '<li class="today-list"><div class="today-item">' +
                                    todayArr[i]['info_push_content'].replace(' ', ';').split(';')[1] +
                                    '</div><div class="today-handle"><div class="today-done-btn" data-id="' +
                                    todayArr[i]['reserve_id'] +
                                    '"></div><div class="today-tel-btn" data-name="' +
                                    todayArr[i]['reserve_login_id'] +
                                    '"></div></div></li>';
                            } else {
                                completedContent += '<li class="complete-list"><div>' +
                                    todayArr[i]['info_push_content'].replace(' ', ';').split(';')[1] +
                                    '</div><div></div></li>';
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
                let nowTime = new Date().yyyymmdd('/') + ' ' + getTimeSec();
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
                                tomorrowArr[i]['info_push_content'].replace(' ', ';').split(';')[1] +
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
                //console.log(data);

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

        //查询电话yellowpage
        function getTelephoneByName(name) {
            let queryData = '<LayoutHeader><Company>All Company</Company><Name_CH></Name_CH>' +
                '<Name_EN>' + name + '</Name_EN><DeptCode></DeptCode><Ext_No></Ext_No></LayoutHeader>';

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    //只取第一个电话号码
                    let tel = $.trim(data['Content'][0]['Ext_No']).split(';')[0];
                    window.location.href = "tel://" + tel;
                } else {
                    $("#noTelephoneData").fadeIn(100).delay(2000).fadeOut(100);
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                YellowPagePlugin.CustomAPI("POST", false, "QueryEmployeeData", successCallback, failCallback, queryData, "");
            }();
        }

        //scroll事件
        $('#viewStaffAdminMain .page-main').on('scroll', function() {
            let mainTop = $('#viewStaffAdminMain .page-main > div').offset().top;
            if(device.platform === "iOS") {
                mainTop -= iOSFixedTopPX();
            }
            //判断是否需要下拉更新
            if(Math.abs(mainTop - headerHeight) < 3) {
                if(adminRefresh == null) {
                    adminRefresh = PullToRefresh.init({
                        mainElement: '.admin-main-update',
                        onRefresh: function() {
                            getTodayAllReserve();
                            getTomorrowAllReserve();
                        }
                    });
                }
            } else {
                if(adminRefresh != null) {
                    adminRefresh.destroy();
                    $('#viewStaffAdminMain .ptr--ptr').remove();
                    adminRefresh = null;
                }
            }
        });


        /********************************** page event ***********************************/
        $("#viewStaffAdminMain").on("pagebeforeshow", function(event, ui) {
            if(refreshInterval == null && allowPush == true) {
                refreshInterval = setInterval(function() {
                    getTodayAllReserve();
                    getTomorrowAllReserve();
                }, 10000);
            }
            if(adminRefresh == null && allowPush == true) {
                adminRefresh = PullToRefresh.init({
                    mainElement: '.admin-main-update',
                    onRefresh: function() {
                        getTodayAllReserve();
                        getTomorrowAllReserve();
                    }
                });
            }
        });

        $("#viewStaffAdminMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminMain .page-main').css('height', mainHeight);
            $('.admin-today-date').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));
            headerHeight = $('#viewStaffAdminMain .page-header').height();
            //初始化总机状态设定dropdownlist
            initAdminSetting();
            //获取推播权限
            getEmpServiceList();
            //是否有总机状态
            getStaffStatus();
        });

        $("#viewStaffAdminMain").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminMain").on("pagehide", function(event, ui) {
            //离开时清除定时器
            if(refreshInterval != null) {
                clearInterval(refreshInterval);
                refreshInterval = null;
            }
            //去除下拉更新
            if(adminRefresh != null) {
                adminRefresh.destroy();
                $('#viewStaffAdminMain .ptr--ptr').remove();
                adminRefresh = null;
            }
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
            let en_name = $(this).data('name');
            getTelephoneByName(en_name);
        });

        //setting admin status
        $('#adminSettingBtn').on('click', function() {
            if(allowPush == false) {
                popupMsgInit('.openManagePower');
                return false;
            } else if(allowPush == true) {
                $('#adminSettingPopup').trigger('click');
            }
        });

        //关闭popup后修改状态
        $('#viewStaffAdminMain').on('popupafterclose', '#adminSettingPopup-option-popup', function() {
            $('#adminSettingNotice').blur();
            //1.改变成绿灯或红灯
            let statusValue = $('#adminSettingPopup').val();
            if(statusValue == 1) {
                $('.main-title-status').removeClass('active-status-false').addClass('active-status-true');
            } else if (statusValue == 2) {
                $('.main-title-status').removeClass('active-status-true').addClass('active-status-false');
            } else if(statusValue == 0) {
                $('.main-title-status').removeClass('active-status-true').removeClass('active-status-false');
            }
            //2.修改状态名称
            let statusText = $('#adminSettingPopup-option-popup .tpl-dropdown-list-selected').text();
            $('.title-text-status').text(statusText);
            //3.修改状态描述
            let description = $.trim($('#adminSettingNotice').val());
            $('.title-text-now').text(description);
            //4.API
            setStaffStatus(statusValue, description);
        });

        //关闭推播信息，更新所有预约
        $('#cancelNewMessage').on('click', function() {
            //属于该页面的操作，只有在该页面点击关闭推播才会触发
            let pageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0]['id'];
            if(pageID == 'viewStaffAdminMain' && allowPush == true) {
                getTodayAllReserve();
                getTomorrowAllReserve();
            }
        });

        //点击菜单需要判断是否有推播权限
        $('.staff-admin-menu-btn').on('click', function() {
            if(allowPush == false) {
                popupMsgInit('.openManagePower');
                return false;
            }
        });

        //修改是否接受推播
        $('.title-text-switch').on('click', function() {
            var type = $(this).children('img').attr('data-type');
            setServicePush(type);
        });


    }
});