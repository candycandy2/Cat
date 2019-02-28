$("#viewStaffUserMain").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffUserMain/img/',
            staffKey = 'appempservice',
            staffService = 'meetingroomService',
            staffType = 'staff',
            teaCount = 0,
            waterCount = 0;

        //获取当前时间并精确到秒
        function getTimeBySecond() {
            var hh = new Date().getHours().toString();
            var mm = new Date().getMinutes().toString();
            var ss = new Date().getSeconds().toString();
            return (hh[1] ? hh : '0' + hh[0]) + ':' + (mm[1] ? mm : '0' + mm[0]) + ':' + (ss[1] ? ss : '0' + ss[0]);
        }

        //获取所有讨论版
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
                if(staffBoardType == null || checkDataExpired(staffBoardType['lastUpdateTime'], 7, 'dd')) {
                    QForumPlugin.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");
                }
            }();
        }

        //前台通过星期和时间控制用户是否需要获取总机状态
        //总机工作日及时间周一到周五，早上8点-12点，下午13点-17点
        function checkAdminWorkTime() {
            //1.先判断当天是否是工作日
            let workDay = new Date().getDay();
            if(workDay !== 6 && workDay !== 0) {
                //2.在判断时间是否在区间内
                let workTime = new Date().getTime();
                let am_start = new Date(new Date().yyyymmdd('/') + ' 08:00').getTime();
                let am_end = new Date(new Date().yyyymmdd('/') + ' 12:00').getTime();
                let pm_start = new Date(new Date().yyyymmdd('/') + ' 13:00').getTime();
                let pm_end = new Date(new Date().yyyymmdd('/') + ' 17:00').getTime();
                if((workTime > am_start && workTime < am_end) || (workTime > pm_start && workTime < pm_end)) {
                    return true;
                }
            }
            return false;
        }

        //获取总机状态
        function getStaffStatus(type) {
            type = type || null;
            var self = this;
            let queryData = JSON.stringify({
                status_id: staffService
            });

            this.successCallback = function(data) {
                //console.log(data);
                
                if(data['result_code'] == '1') {
                    //茶水信息
                    let roomText = $('#userChooseRoom option:selected').text();
                    let staffType = $('input[name="teaType"]:checked').val();
                    let typeText = (staffType == 'needTea' ? '添加' : '添加茶水');
                    let teaText = (staffType == 'needTea' && teaCount != 0 ? '茶' + teaCount + '杯' : '');
                    let waterText = (staffType == 'needTea' && waterCount != 0 ? '水' + waterCount + '杯' : '');
                    //遍历此status
                    let statusData;
                    for(var i in data['content']['status_list']) {
                        if(data['content']['status_list'][i]['status_id'] == staffService) {
                            statusData = data['content']['status_list'][i]['period_list'][0];
                            break;
                        }
                    }
                    //总机状态描述
                    let description = (statusData['note'] == null ? '' : statusData['note']);
                    $('.user-status-desc').text(description);
                    //popup
                    let statusValue = statusData['status'];
                    if(statusValue == 1) {
                        $('.user-status-text').text('總機服務中');
                        $('.user-main-status').removeClass('active-status-false').addClass('active-status-true');
                        $('.service-offline').hide();
                        $('.service-online').show();
                        if(type != null) {
                            $('.confirmAddTeaPopup .header-title').text(roomText + typeText + teaText + waterText + '?');
                            popupMsgInit('.confirmAddTeaPopup');
                        }
                    } else if(statusValue == 2) {
                        $('.user-status-text').text('總機忙碌中');
                        $('.user-main-status').removeClass('active-status-true').addClass('active-status-false');
                        $('.service-offline').hide();
                        $('.service-online').show();
                        if(type != null) {
                            $('.adminBusyPopup .main-paragraph').text(roomText + typeText + teaText + waterText);
                            popupMsgInit('.adminBusyPopup');
                        }
                    } else if(statusValue == 0) {
                        $('.user-status-text').text('總機暫停服務');
                        $('.user-main-status').removeClass('active-status-true').removeClass('active-status-false');
                        $('.service-online').hide();
                        $('.service-offline').show();
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                StatusPlugin.QPlayAPI("POST", "getStatus", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //获取所有可提供茶水预约服务的会议室
        function getStaffEmpService() {
            var self = this;
            let queryData = JSON.stringify({
                service_id: staffService
            });

            this.successCallback = function(data) {
                //console.log(data);

                if(data['result_code'] == '1') {
                    let arr = data['content']['service_type_list'];

                    //1.先找到staff服务
                    let staffArr = [];
                    for(var i in arr) {
                        if(arr[i]['service_type'] == staffType) {
                            staffArr = arr[i]['service_id_list'];
                            break;
                        }
                    }

                    //2.再找到meetingroom服务
                    let serviceArr = [];
                    for(var i in staffArr) {
                        if(staffArr[i]['service_id'] == staffService) {
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

                    //5.meetingroom dropdownlist
                    initMeetingRoomDropDdown(serviceArr);
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "getEmpServiceTargetList", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //根据使用权限生成会议室的下拉选单
        function initMeetingRoomDropDdown(arr) {
            let roomData = {
                id: "userChooseRoom",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }

            for(var i in arr) {
                roomData["option"][i] = {};
                roomData["option"][i]["value"] = arr[i]['target_id_row_id'];
                roomData["option"][i]["text"] = arr[i]['target_id'];
            }

            tplJS.DropdownList("viewStaffUserMain", "userChooseMeetingRoom", "prepend", "typeB", roomData);
            //减少间距
            let typeWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('userChooseRoom', null, typeWidth);
            //默认选中第一个，会触发select onchange事件getReserveByTarget()
            $('#userChooseRoom-option-list li:eq(0)').trigger('click');
        }

        //获取该会议室前后一小时内的预约
        function getReserveByTarget(id) {
            var self = this;
            let queryData = JSON.stringify({
                target_id_row_id: id,
                start_date: Math.floor(new Date().getTime() / 1000) - 60 * 60,//前一小时减去3600秒
                end_date: Math.floor(new Date().getTime() / 1000) + 60 * 60//后一小时加上3600秒
            });

            this.successCallback = function(data) {
                //console.log(data);

                if(data['result_code'] == '1') {
                    let arr = data['content']['record_list'];
                    if(arr.length > 0) {
                        $('.today-room-none').hide();

                        let content = '';
                        for(var i in arr) {
                            //删除index为1的日期和index为2的会议室
                            let infoArr = arr[i]['info_push_content'].split(' ');
                            let infoPush = infoArr[1] + ' ' + infoArr[3] + ' ' + infoArr[4] + ' ' + infoArr[5];
                            content += '<li' +
                                (arr[i]['complete'] == 'N' ? '' : ' class="past-time"') +
                                '><span>' +
                                infoPush +
                                ' </span><span>' +
                                (arr[i]['complete'] == 'N' ? '' : '(' + new Date(arr[i]['complete_at'] * 1000).hhmm() + '已送達)') +
                                '</span></li>';
                        }

                        $('.today-room-list ul').append(content);

                    } else {
                        $('.today-room-none').show();
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //更新时间
                let nowTime = new Date().yyyymmdd('/') + ' ' + getTimeBySecond();
                $('.user-main-update-time').text(nowTime);
                //清空列表
                $('.today-room-list ul').html('');
                //API
                EmpServicePlugin.QPlayAPI("POST", "getTargetReserveData", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //快速加水
        function quickNewReserve() {
            var self = this;

            let target_row_id = $('#userChooseRoom').val();//当前 dropdownlist value
            let target_name = $.trim($('#userChooseRoom').text());//当前会议室名称
            let rightNow = Math.floor(new Date().getTime() / 1000);//当前时间戳，且开始时间与结束时间相同
            let teaType = $('input[name="teaType"]:checked').val();
            let teaInfo = {
                time: new Date().hhmm(),
                id: target_name,
                tea: teaCount,
                water: waterCount
            };
            let typeContent = (teaType == 'needTea' ? '加' : '添加茶水');
            let teaContent = (teaCount == 0 ? '' : '茶' + teaCount + '杯');
            let waterContent = (waterCount == 0 ? '' : '水' + waterCount + '杯');
            let pushContent = new Date().mmdd('/') +
                ' ' +
                teaInfo['time'] +
                ' ' +
                teaInfo['id'] +
                ' ' +
                typeContent +
                (teaType == 'needTea' ? teaContent + waterContent : '');

            let queryData = JSON.stringify({
                target_id_row_id: target_row_id,
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no'],
                start_date: rightNow,
                end_date: rightNow,
                info_push_admin_title: '同仁茶水申請通知',
                info_push_admin_content: pushContent + ' / ' + loginData['loginid'],
                info_push_emp_title: '茶水申請已發送',
                info_push_emp_content: pushContent,
                info_data: JSON.stringify(teaInfo),
                push: '11'
            });

            this.successCallback = function(data) {
                //console.log(data);

                if(data['result_code'] == '1') {
                    $("#applyTeaSuccess").fadeIn(100).delay(2000).fadeOut(100);
                    //預約成功後初始化
                    initCountData();
                    //刷新数据
                    $('.refreshTargetRoom').trigger('tap');
                }

                loadingMask('hide');
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "newReserve", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //加法-茶水
        function additionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.add-tea-count .' + type + '-addition').hasClass('cannot-addition');
            if(!has) {
                let count = (type == 'tea' ? ++teaCount : ++waterCount);
                $('.add-tea-count .' + type + '-result').text(count);

                //当count>0时减法可用
                if(count > 0) {
                    $('.add-tea-count .' + type + '-subtraction').addClass('can-subtraction');              
                }

                //当count=20时加法不可用
                if(count == 20) {
                    $('.add-tea-count .' + type + '-addition').addClass('cannot-addition');
                }
            }

            //判断teaCount和waterCount，只要任意一个大于0，按钮可用
            if(teaCount > 0 || waterCount > 0) {
                $('.addTeaBtn').addClass('active-btn-green');
            }
        }

        //减法-茶水
        function subtractionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.add-tea-count .' + type + '-subtraction').hasClass('can-subtraction');
            if(has) {
                let count = (type == 'tea' ? --teaCount : --waterCount);
                $('.add-tea-count .' + type + '-result').text(count);

                //当count=0时减法不可用
                if(count == 0) {
                    $('.add-tea-count .' + type + '-subtraction').removeClass('can-subtraction');
                }

                //当count<20时加法可用
                if(count < 20) {
                    $('.add-tea-count .' + type + '-addition').removeClass('cannot-addition');
                }
            }

            //判断teaCount和waterCount，当两者都为0时，按钮不可用
            if(teaCount == 0 && waterCount == 0) {
                $('.addTeaBtn').removeClass('active-btn-green');
            }
        }

        //数据初始化
        function initCountData() {
            teaCount = 0,
            waterCount = 0;
            $('.addTeaBtn').removeClass('active-btn-green');
            $('.add-tea-count .tea-addition').removeClass('cannot-addition');
            $('.add-tea-count .water-addition').removeClass('cannot-addition');
            $('.add-tea-count .tea-subtraction').removeClass('can-subtraction');
            $('.add-tea-count .water-subtraction').removeClass('can-subtraction');
            $('.add-tea-count .tea-result').text('0');
            $('.add-tea-count .water-result').text('0');
            $('label[for="needTea"]').trigger('click');
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserMain .page-main').css('height', mainHeight);
            $('.user-today-name').text(loginData['loginid']);
            $('.user-today-date').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));

            //iphone x下增加高度
            if(checkiPhoneX()){
                $('#viewStaffUserMain .add-tea-today').css('height', '82vw');
                $('#viewStaffUserMain .today-room-list').css('height', '58vw');
            }

            //获取所有可预约的会议室
            getStaffEmpService();
            //获取所有staff的board主题
            getBoardType();
        });

        $("#viewStaffUserMain").on("pageshow", function(event, ui) {
            var needStatus = checkAdminWorkTime();
            if(needStatus) {
                //获取总机状态
                getStaffStatus();
            }
        });

        $("#viewStaffUserMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //更新总机状态
        $('.update-service').on('tap', function() {
            //添加旋转动画
            $('.update-service div:eq(1)').addClass('refresh-rotate');
            //判断是否在服务时段
            var needStatus = checkAdminWorkTime();
            if(needStatus) {
                //获取总机状态
                getStaffStatus();
            }
            //取消旋转动画
            setTimeout(function(){
                $('.update-service div:eq(1)').removeClass('refresh-rotate');
            }, 800);
        });

        //切换会议室
        $('#userChooseMeetingRoom').on('change', '#userChooseRoom', function() {
            let room_code = $.trim($(this).text());
            $('.followRoomChange').text(room_code);
            let target_id_row_id = $(this).val();
            getReserveByTarget(target_id_row_id);
            //减少间距
            let typeWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('userChooseRoom', null, typeWidth);
        });

        //刷新當前room的預約
        $('.refreshTargetRoom').on('tap', function() {
            //添加旋转动画
            $('.refreshTargetRoom').addClass('refresh-rotate');
            //再次点击已选的会议室，主动触发select onchange事件getReserveByTarget()
            $('#userChooseRoom-option-list li.tpl-dropdown-list-selected').trigger('click');
            //取消旋转动画
            setTimeout(function(){
                $('.refreshTargetRoom').removeClass('refresh-rotate');
            }, 800);
        });

        //单选茶还是水
        $('input[name="teaType"]').on('change', function() {
            let teaType = $(this).val();

            //判断是否要杯子
            if(teaType == 'needTea') {
                $('.add-tea-count').removeClass('visible-hide');
                if(teaCount == 0 && waterCount == 0) {
                    $('.addTeaBtn').removeClass('active-btn-green');
                }
            } else {
                $('.add-tea-count').addClass('visible-hide');
                $('.addTeaBtn').addClass('active-btn-green');
            }
        });

        //加法-茶水
        $('.add-tea-count .count-select').on('tap', '.tea-addition, .water-addition', function() {
            let teaType = $(this).parent().data('type');
            additionCount(teaType);
        });

        //减法-茶水
        $('.add-tea-count .count-select').on('tap', '.tea-subtraction, .water-subtraction', function() {
            let teaType = $(this).parent().data('type');
            subtractionCount(teaType);
        });

        //茶水预约
        $('.addTeaBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            var needStatus = checkAdminWorkTime();
            if(has && needStatus) {
                //获取总机状态
                getStaffStatus('new');
            } else if(!needStatus) {
                $('.user-status-text').text('總機暫停服務');
                $('.user-main-status').removeClass('active-status-true').removeClass('active-status-false');
                $('.service-online').hide();
                $('.service-offline').show();
            }
        });

        //确定送出茶水预约
        $('#viewStaffUserMain').on('click', '.userAddTeaBtn, .userWaitBtn', function() {
            loadingMask('show');
            //API
            quickNewReserve();
        });


    }
});