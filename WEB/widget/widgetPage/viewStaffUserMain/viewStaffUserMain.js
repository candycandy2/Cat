$("#viewStaffUserMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserMain/img/',
            staffKey = 'appempservice',
            staffService = 'meetingroomService',
            staffType = 'staff',
            teaCount = 0,
            waterCount = 0;

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
                if(staffBoardType == null || checkDataExpired(staffBoardType['lastUpdateTime'], 1, 'dd')) {
                    QForumPlugin.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");
                }
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

                    //1. 先找到staff服务
                    let staffArr = [];
                    for(var i in arr) {
                        if(arr[i]['service_type'] == staffType) {
                            staffArr = arr[i]['service_id_list'];
                            break;
                        }
                    }

                    //2. 再找到meetingroom服务
                    let serviceArr = [];
                    for(var i in staffArr) {
                        if(staffArr[i]['service_id'] == staffService) {
                            serviceArr = staffArr[i]['target_list'];
                            break;
                        }
                    }

                    //3. save to session
                    window.sessionStorage.setItem('meetingroomServiceTargetList', JSON.stringify(serviceArr));

                    //4. meetingroom dropdownlist
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
                console.log(data);

                if(data['result_code'] == '1') {
                    let arr = data['content']['data_list'];

                    if(arr.length > 0) {
                        $('.today-room-none').hide();

                        let content = '';
                        for(var i in arr) {
                            content += '<li' +
                                (arr[i]['complete'] == 'N' ? '' : ' class="past-time"') +
                                '><span>' +
                                new Date(arr[i]['start_date'] * 1000).hhmm() +
                                ' </span><span>' +
                                arr[i]['reserve_login_id'] + ' ' +
                                arr[i]['info_push_content'].split(' ')[2] +
                                ' </span><span>' +
                                (arr[i]['complete'] == 'N' ? '' : '(' + new Date(arr[i]['complete_at'] * 1000).hhmm() + '已送達)') +
                                '</span></li>';
                        }

                        $('.today-room-list ul').html('').append(content);

                    } else {
                        $('.today-room-list ul').html('');
                        $('.today-room-none').show();
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //更新时间
                let nowTime = new Date().yyyymmdd('/') + ' ' + new Date().hhmm();
                $('.user-main-update-time').text(nowTime);
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
            let typeContent = (teaType == 'needTea' ? '添加' : '加水');
            let teaContent = (teaCount == 0 ? '' : '茶' + teaCount + '杯');
            let waterContent = (waterCount == 0 ? '' : '水' + waterCount + '杯');
            let pushContent = teaInfo['time'] +
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
                info_push_title: '茶水添加',//非即時預約"茶水預約"
                info_push_content: pushContent,
                info_data: JSON.stringify(teaInfo),
                push: '11'
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    //預約成功後初始化
                    initCountData();
                    //刷新数据
                    $('.refreshTargetRoom').trigger('click');
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "newReserve", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //加法-茶水
        function additionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.' + type + '-addition').hasClass('cannot-addition');
            if(!has) {
                let count = (type == 'tea' ? ++teaCount : ++waterCount);
                $('.' + type + '-result').text(count);

                //当count>0时减法可用
                if(count > 0) {
                    $('.' + type + '-subtraction').addClass('can-subtraction');              
                }

                //当count=20时加法不可用
                if(count == 20) {
                    $('.' + type + '-addition').addClass('cannot-addition');
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
            let has = $('.' + type + '-subtraction').hasClass('can-subtraction');
            if(has) {
                let count = (type == 'tea' ? --teaCount : --waterCount);
                $('.' + type + '-result').text(count);

                //当count=0时减法不可用
                if(count == 0) {
                    $('.' + type + '-subtraction').removeClass('can-subtraction');
                }

                //当count<20时加法可用
                if(count < 20) {
                    $('.' + type + '-addition').removeClass('cannot-addition');
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
            $('.tea-addition').removeClass('cannot-addition');
            $('.water-addition').removeClass('cannot-addition');
            $('.tea-subtraction').removeClass('can-subtraction');
            $('.water-subtraction').removeClass('can-subtraction');
            $('.tea-result').text('0');
            $('.water-result').text('0');
            $('label[for="needTea"]').trigger('click');
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserMain .page-main').css('height', mainHeight);

            $('.tea-user-name').text(loginData['loginid']);
            $('.tea-user-today').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));

            //获取所有staff的board主题
            getBoardType();
            //获取所有可预约的会议室
            getStaffEmpService();
        });

        $("#viewStaffUserMain").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切换会议室
        $('#userChooseMeetingRoom').on('change', '#userChooseRoom', function() {
            let room_code = $.trim($(this).text());
            $('.followRoomChange').text(room_code);
            let target_id_row_id = $(this).val();
            getReserveByTarget(target_id_row_id);
        });

        //刷新當前room的預約
        $('.refreshTargetRoom').on('click', function() {
            //再次点击已选的会议室，主动触发select onchange事件getReserveByTarget()
            $('#userChooseRoom-option-list li.tpl-dropdown-list-selected').trigger('click');
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
        $('.count-select').on('click', '.tea-addition, .water-addition', function() {
            let teaType = $(this).parent().data('type');
            additionCount(teaType);
        });

        //减法-茶水
        $('.count-select').on('click', '.tea-subtraction, .water-subtraction', function() {
            let teaType = $(this).parent().data('type');
            subtractionCount(teaType);
        });

        //茶水预约
        $('.addTeaBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                quickNewReserve();
            }
        });


    }
});