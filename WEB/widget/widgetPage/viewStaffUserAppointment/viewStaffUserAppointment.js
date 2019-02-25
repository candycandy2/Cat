$("#viewStaffUserAppointment").pagecontainer({
    create: function (event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserAppointment/img/',
            teaCount = 0,
            waterCount = 0,
            activeCount = 0,
            conditionInit = false,
            reserve_id,
            itemList = [],
            reserveList = [],
            newStatus = langStr['wgt_172'],//加茶水
            updateStatus = langStr['wgt_173'];//修改预约

        //获取可选会议室和可选日期
        function getTargetAndDateList() {
            //1. meeting room
            let targetList = JSON.parse(window.sessionStorage.getItem('meetingroomServiceTargetList'));

            $('.appointment-room-list').css('width', targetList.length * 31 + 'vw');//31为1个list的宽度

            let targetContent = '';
            for (var i in targetList) {
                targetContent += '<li' +
                    (i == 0 ? ' class="active-staff"' : '') +
                    ' data-id="' +
                    targetList[i]['target_id_row_id'] +
                    '" data-item="' +
                    targetList[i]['target_id'] +
                    '">' +
                    targetList[i]['target_id'] +
                    '</li>';
            }

            $('.appointment-room-list ul').html('').append(targetContent);

            //2. date list，当日往后14日
            let dateList = getDateList(14);

            let dateContent = '';
            let dateLength = 0;//可选日期的个数（需排除周末）
            for (var i in dateList) {
                let numDay = new Date(dateList[i]).getDay();//星期
                let languageDay;//星期
                //去掉周末
                if (numDay != 6 && numDay != 0) {
                    dateLength++;//记录可选日期的个数
                    languageDay = new Date(dateList[i]).toLocaleDateString(browserLanguage, { weekday: 'short' });
                    dateContent += '<li data-item="' +
                        dateList[i] +
                        '"' + (dateLength == 1 ? ' class="active-staff"' : '') + '>' +
                        dateList[i].split('/')[1] +
                        '/' +
                        dateList[i].split('/')[2] +
                        '(' +
                        languageDay +
                        ')</li>';
                }
            }

            $('.appointment-date-list').css('width', dateLength * 31 + 'vw');
            $('.appointment-date-list ul').html('').append(dateContent);

            //所有条件初始化已完成
            conditionInit = true;
        }

        //返回可选日期区间，从当天开始
        function getDateList(length) {
            let nowDate = new Date();
            let nowYear = nowDate.getFullYear();
            let nowMonth = nowDate.getMonth();
            let nowDay = nowDate.getDate();

            let dateArr = [];
            for (var i = 0; i < length; i++) {
                let newDate = new Date(nowYear, nowMonth, nowDay + i).yyyymmdd('/');
                dateArr.push(newDate);
            }
            return dateArr;
        }

        //初始化各时段的UI，清除时段的各种状态(恢复时段初始状态)
        function initHoursUI() {
            //去除英文名和其他样式
            $('.appointment-hour li').each(function (index, elem) {
                $(elem).children('div:eq(1)').html('');
                $(elem).removeClass('checked-hour').removeClass('self-hour').removeClass('active-hour');
            });
            //去除已选时段
            activeCount = 0;
            //按钮不可用并初始化
            $('.appointmentTeaBtn').removeClass('active-btn-green').text(newStatus).attr('data-status', 'new');
            //去除reserve_id
            $('.appointment-hour li').removeAttr('data-id');
            itemList = [];
        }

        //根据会议室和日期，获取某天所有预约
        function getReserveByTarget(time) {
            time = time || null;
            let target_row_id = $('.appointment-room-list .active-staff').data('id');
            let target_name = $('.appointment-room-list .active-staff').text();
            let target_date = $('.appointment-date-list .active-staff').data('item');
            let target_key = target_name + '_' + target_date;

            var self = this;
            let queryData = JSON.stringify({
                target_id_row_id: target_row_id,
                start_date: new Date(target_date + ' 00:00:00').getTime() / 1000,
                end_date: new Date(target_date + ' 23:59:59').getTime() / 1000
            });

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    reserveList = data['content']['record_list'];
                    reserveIntoHours(reserveList, time);
                    //save to session
                    window.sessionStorage.setItem(target_key, JSON.stringify(reserveList));
                }
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                reserveList = JSON.parse(window.sessionStorage.getItem(target_key));
                if (reserveList == null) {
                    EmpServicePlugin.QPlayAPI("POST", "getTargetReserveData", self.successCallback, self.failCallback, queryData, '');
                } else {
                    reserveIntoHours(reserveList, time);
                }
            }();
        }

        //更新各时段的预约情况
        function reserveIntoHours(arr, time) {
            if (arr.length > 0) {
                for (var i in arr) {
                    //如果开始时间与结束时间不一致，表示是预约，反之表示是立刻加水
                    if (arr[i]['start_date'] != arr[i]['end_date']) {
                        //转换成小时和分钟08:00
                        let start_time = new Date(arr[i]['start_date'] * 1000).hhmm();
                        $('.appointment-hour li[data-hour="' + start_time + '"]').addClass(arr[i]['reserve_emp_no'] == loginData['emp_no'] ? 'self-hour' : 'checked-hour');
                        let user_name = arr[i]['reserve_login_id'];
                        $('.appointment-hour li[data-hour="' + start_time + '"]').children('div:eq(1)').text(user_name);
                        //添加属性data-id，记录reserve_id
                        $('.appointment-hour li[data-hour="' + start_time + '"]').attr('data-id', arr[i]['reserve_id']);
                    }
                }
            }
            if (time != null) {
                $('.appointment-hour li[data-hour="' + time + '"]').trigger('click');
            }
            loadingMask('hide');
        }

        //检查某时段否是有预约，有预约就不能再预约，没有预约才能新增预约
        function checkReserveByHour() {
            let target_row_id = $('.appointment-room-list .active-staff').data('id');
            let target_date = $('.appointment-date-list .active-staff').data('item');
            let target_hour = $('.active-hour').data('hour');//已选时段有且只有一个
            let target_time = new Date(target_date + ' ' + target_hour).getTime() / 1000;

            //预约时间必须大于当前时间30分钟，所以先判断日期，再判断时间
            let overtime = false;
            let now_date = new Date().yyyymmdd('/');
            if (now_date == target_date) {
                let now_time = Math.floor(new Date().getTime() / 1000) + 30 * 60;
                if (now_time > target_time) {
                    overtime = true;
                }
            }

            var self = this;
            let queryData = JSON.stringify({
                target_id_row_id: target_row_id,
                start_date: target_time,
                end_date: target_time + 30 * 60//往后推30分钟
            });

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //length等于0表示没有预约
                    let reserveArr = data['content']['record_list'];
                    if (reserveArr.length == 0) {
                        newReserveByHour();
                    } else {
                        let noReserve = true;
                        for (var i in reserveArr) {
                            //如果开始时间与结束时间不相等，表示有预约
                            if (reserveArr[i]['start_date'] != reserveArr[i]['end_date']) {
                                noReserve = false;
                                break;
                            }
                        }
                        if (noReserve) {
                            newReserveByHour();
                        } else {
                            popupMsgInit('.reservedPopup');
                            //do some thing
                            let target_name = $('.appointment-room-list .active-staff').text();
                            let target_date = $('.appointment-date-list .active-staff').data('item');
                            let target_key = target_name + '_' + target_date;
                            window.sessionStorage.removeItem(target_key);
                            initHoursUI();
                            getReserveByTarget();
                        }
                    }
                }
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                //如果超时就不需要API，直接popup提示
                if (overtime) {
                    loadingMask('hide');
                    //popup
                    popupMsgInit('.reserveLatePopup');
                } else {
                    EmpServicePlugin.QPlayAPI("POST", "getTargetReserveData", self.successCallback, self.failCallback, queryData, '');
                }
            }();
        }

        //预约成功后，初始化茶水数量以及取消已选时段
        function initTeaNumberSuccess() {
            teaCount = 0,
            waterCount = 0,
            activeCount = 0;
            $('.appointment-hour .active-hour').removeClass('active-hour');
            $('.appointmentTeaBtn').removeClass('active-btn-green');
            $('.appointment-count .tea-addition').removeClass('cannot-addition');
            $('.appointment-count .water-addition').removeClass('cannot-addition');
            $('.appointment-count .tea-subtraction').removeClass('can-subtraction');
            $('.appointment-count .water-subtraction').removeClass('can-subtraction');
            $('.appointment-count .tea-result').text('0');
            $('.appointment-count .water-result').text('0');
        }

        //切换编辑时，只初始化茶水数量
        function onlyInitTeaNumber() {
            teaCount = 0,
            waterCount = 0;
            $('.appointmentTeaBtn').removeClass('active-btn-green');
            $('.appointment-count .tea-addition').removeClass('cannot-addition');
            $('.appointment-count .water-addition').removeClass('cannot-addition');
            $('.appointment-count .tea-subtraction').removeClass('can-subtraction');
            $('.appointment-count .water-subtraction').removeClass('can-subtraction');
            $('.appointment-count .tea-result').text('0');
            $('.appointment-count .water-result').text('0');
        }

        //加法-茶水
        function additionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.appointment-count .' + type + '-addition').hasClass('cannot-addition');
            if (!has) {
                let count = (type == 'tea' ? ++teaCount : ++waterCount);
                $('.appointment-count .' + type + '-result').text(count);

                //当count>0时减法可用
                if (count > 0) {
                    $('.appointment-count .' + type + '-subtraction').addClass('can-subtraction');
                }

                //当count=20时加法不可用
                if (count == 20) {
                    $('.appointment-count .' + type + '-addition').addClass('cannot-addition');
                }
            }

            //判断teaCount和waterCount，只要任意一个大于0，按钮可用
            if ((teaCount > 0 || waterCount > 0) && activeCount > 0) {
                $('.appointmentTeaBtn').addClass('active-btn-green');
            }
        }

        //减法-茶水
        function subtractionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.appointment-count .' + type + '-subtraction').hasClass('can-subtraction');
            if (has) {
                let count = (type == 'tea' ? --teaCount : --waterCount);
                $('.appointment-count .' + type + '-result').text(count);

                //当count=0时减法不可用
                if (count == 0) {
                    $('.appointment-count .' + type + '-subtraction').removeClass('can-subtraction');
                }

                //当count<20时加法可用
                if (count < 20) {
                    $('.appointment-count .' + type + '-addition').removeClass('cannot-addition');
                }
            }

            //判断teaCount和waterCount，当两者都为0时，按钮不可用
            if ((teaCount == 0 && waterCount == 0) || activeCount == 0) {
                $('.appointmentTeaBtn').removeClass('active-btn-green');
            }
        }

        //根据reserve_id查找该预约情况，并设置茶水数
        function setTeaNumberByReserveID(id) {
            //1. 查找对应预约信息
            let reserveDetail = {};
            for (var i in reserveList) {
                if (id == reserveList[i]['reserve_id']) {
                    reserveDetail = JSON.parse(reserveList[i]['info_data']);
                    break;
                }
            }

            //2. 修改预约的茶水数量
            let teaCount = reserveDetail['tea'];
            for (var i = 0; i < teaCount; i++) {
                $('.appointment-count .tea-addition').trigger('click');
            }
            let waterCount = reserveDetail['water'];
            for (var i = 0; i < waterCount; i++) {
                $('.appointment-count .water-addition').trigger('click');
            }
        }

        //新增预约
        function newReserveByHour() {
            var self = this;

            let target_row_id = $('.appointment-room-list .active-staff').data('id');
            let target_name = $('.appointment-room-list .active-staff').text();
            let target_date = $('.appointment-date-list .active-staff').data('item');
            let target_hour = $('.appointment-hour .active-hour').data('hour');
            let start_date = new Date(target_date + ' ' + target_hour).getTime() / 1000;
            let end_date = start_date + 30 * 60;//开始时间的后30分钟
            //info_data
            let teaInfo = {
                date: target_date,
                time: target_hour,
                id: target_name,
                tea: teaCount,
                water: waterCount
            };
            //info_content
            let teaContent = (teaCount == 0 ? '' : '茶' + teaCount + '杯');
            let waterContent = (waterCount == 0 ? '' : '水' + waterCount + '杯');
            let pushContent = teaInfo['time'] +
                ' ' +
                teaInfo['id'] +
                ' 預約' + teaContent + waterContent;
            //queryData
            let queryData = JSON.stringify({
                target_id_row_id: target_row_id,
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                start_date: start_date,
                end_date: end_date,
                info_push_admin_title: '茶水預約',
                info_push_admin_content: pushContent,
                info_push_emp_title: '茶水預約',
                info_push_emp_content: pushContent,
                info_data: JSON.stringify(teaInfo),
                push: '11'
            });

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //1.初始化UI
                    initTeaNumberSuccess();
                    //2.remove session
                    let target_name = $('.appointment-room-list .active-staff').text();
                    let target_date = $('.appointment-date-list .active-staff').data('item');
                    let target_key = target_name + '_' + target_date;
                    window.sessionStorage.removeItem(target_key);
                    //3. 获取该会议室该日期最新的预约
                    initHoursUI();
                    getReserveByTarget();
                }
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                EmpServicePlugin.QPlayAPI("POST", "newReserve", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //修改预约
        function updateSelfReserve(id) {
            var self = this;

            let target_row_id = $('.appointment-room-list .active-staff').data('id');
            let target_name = $('.appointment-room-list .active-staff').text();
            let target_date = $('.appointment-date-list .active-staff').data('item');
            let target_hour = $('.appointment-hour .active-hour').data('hour');
            let start_date = new Date(target_date + ' ' + target_hour).getTime() / 1000;
            let end_date = start_date + 30 * 60;//开始时间的后30分钟
            //info_data
            let teaInfo = {
                date: target_date,
                time: target_hour,
                id: target_name,
                tea: teaCount,
                water: waterCount
            };
            //info_content
            let teaContent = (teaCount == 0 ? '' : '茶' + teaCount + '杯');
            let waterContent = (waterCount == 0 ? '' : '水' + waterCount + '杯');
            let pushContent = teaInfo['time'] +
                ' ' +
                teaInfo['id'] +
                ' 預約' + teaContent + waterContent;
            //queryData
            let queryData = JSON.stringify({
                reserve_id: id,
                target_id_row_id: target_row_id,
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                start_date: start_date,
                end_date: end_date,
                info_push_admin_title: '茶水預約',
                info_push_admin_content: pushContent,
                info_push_emp_title: '茶水預約',
                info_push_emp_content: pushContent,
                info_data: JSON.stringify(teaInfo),
                push: '11'
            });

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //1.初始化UI
                    initTeaNumberSuccess();
                    //2.remove session
                    let target_name = $('.appointment-room-list .active-staff').text();
                    let target_date = $('.appointment-date-list .active-staff').data('item');
                    let target_key = target_name + '_' + target_date;
                    window.sessionStorage.removeItem(target_key);
                    //3. 获取该会议室该日期最新的预约
                    initHoursUI();
                    getReserveByTarget();
                }
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                EmpServicePlugin.QPlayAPI("POST", "editReserve", self.successCallback, self.failCallback, queryData, '');
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserAppointment").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewStaffUserAppointment").one("pageshow", function (event, ui) {
            //动态生成会议室和日期
            getTargetAndDateList();
        });

        $("#viewStaffUserAppointment").on("pageshow", function (event, ui) {
            //如果变为修改预约，就不需要获取默认条件下的预约资料
            let info_data = JSON.parse(window.sessionStorage.getItem('viewStaffUserAppointment_parmData'));
            if (info_data != null) {

                //1.条件是否完成
                let initInterval = setInterval(function (data) {

                    //直到第一次条件初始化完成
                    if (conditionInit) {
                        clearInterval(initInterval);

                        //room
                        let roomItem = data['id'];
                        $('.appointment-room-list li[data-item="' + roomItem + '"]').trigger('click');

                        //date
                        let dateItem = data['date'];
                        $('.appointment-date-list li[data-item="' + dateItem + '"]').trigger('click');

                        //data
                        onlyInitTeaNumber();
                        initHoursUI();
                        getReserveByTarget(data['time']);
                    }

                }, 500, info_data);

                window.sessionStorage.removeItem('viewStaffUserAppointment_parmData');

            } else {
                let defaultInterval = setInterval(function () {
                    //初始化完成，获取默认条件下的预约情况
                    if (conditionInit) {
                        clearInterval(defaultInterval);
                        getReserveByTarget();
                    }
                }, 500)
            }
        });

        $("#viewStaffUserAppointment").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //选择会议室
        $('.appointment-room-list ul').on('click', 'li', function () {
            let has = $(this).hasClass('active-staff');
            if (!has) {
                loadingMask('show');
                //1. add active class
                $('.appointment-room-list li').removeClass('active-staff');
                $(this).addClass('active-staff');

                //2. 如果已选日期，则立即执行
                if (itemList.length == 1) {
                    initHoursUI();
                    getReserveByTarget();
                } else {
                    //3. 如果日期未选，则添加到操作中，并等待3秒看是否会选日期
                    itemList.push('room');
                    setTimeout(function () {
                        if (itemList.length == 1) {
                            initHoursUI();
                            getReserveByTarget();
                        }
                    }, 2000);
                }
            }
        });

        //选择日期
        $('.appointment-date-list ul').on('click', 'li', function () {
            let has = $(this).hasClass('active-staff');
            if (!has) {
                loadingMask('show');
                //1. add active class
                $('.appointment-date-list li').removeClass('active-staff');
                $(this).addClass('active-staff');

                //2. 如果已选会议室，则立即执行
                if (itemList.length == 1) {
                    initHoursUI();
                    getReserveByTarget();
                } else {
                    //3. 如果会议室未选，则添加到操作中，并等待3秒看是否会选会议室
                    itemList.push('date');
                    setTimeout(function () {
                        if (itemList.length == 1) {
                            initHoursUI();
                            getReserveByTarget();
                        }
                    }, 2000);
                }
            }
        });

        //选择时段，一次只能选择一个时段
        $('.hour-list').on('click', function () {
            let rest = $(this).hasClass('rest-hour');//休息时段
            let checked = $(this).hasClass('checked-hour');//他人预约时段
            let active = $(this).hasClass('active-hour');//激活的时段
            let self = $(this).hasClass('self-hour');//自己的时段
            reserve_id = $(this).data('id');

            //只能选择空白时段，且有且只能选择一个时段
            if (!rest && !checked) {
                if (!active && activeCount == 0) {
                    $(this).addClass('active-hour');
                    activeCount++;
                } else if (active) {
                    $(this).removeClass('active-hour');
                    activeCount--;
                } else if (!active && activeCount > 0) {
                    //切换其他时段，还是有且只有一个
                    $('.active-hour').removeClass('active-hour');
                    $(this).addClass('active-hour');
                }
            }

            //按钮是[新增]还是[修改]
            if (!self) {
                $('.appointmentTeaBtn').text(newStatus).attr('data-status', 'new');
            } else {
                //编辑时需要清空茶水数量
                onlyInitTeaNumber();
                //根据reserve_id查找该预约情况，并设置茶水数
                setTeaNumberByReserveID(reserve_id);
                $('.appointmentTeaBtn').text(updateStatus).attr('data-status', 'update');
            }

            //按钮是否可用
            if ((teaCount > 0 || waterCount > 0) && activeCount > 0) {
                $('.appointmentTeaBtn').addClass('active-btn-green');
            } else {
                $('.appointmentTeaBtn').removeClass('active-btn-green');
            }
        });

        //加法-茶水
        $('.appointment-count .count-select').on('click', '.tea-addition, .water-addition', function () {
            let teaType = $(this).parent().data('type');
            additionCount(teaType);
        });

        //减法-茶水
        $('.appointment-count .count-select').on('click', '.tea-subtraction, .water-subtraction', function () {
            let teaType = $(this).parent().data('type');
            subtractionCount(teaType);
        });

        //茶水预约
        $('.appointmentTeaBtn').on('tap', function () {
            let has = $(this).hasClass('active-btn-green');
            let staff_status = $(this).attr('data-status');
            if (has) {
                loadingMask('show');
                if(staff_status == 'new') {
                    //检查该时段是否有预约
                    checkReserveByHour();
                } else {
                    updateSelfReserve(reserve_id);
                    loadingMask('hide');
                }
            }
        });


    }
});