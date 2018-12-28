$("#viewStaffUserAppointment").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserAppointment/img/',
            teaCount = 0,
            waterCount = 0,
            activeCount = 0;

        //获取可选会议室和可选日期
        function getTargetAndDateList() {
            //1. meeting room
            let targetList = JSON.parse(window.sessionStorage.getItem('meetingroomServiceTargetList'));

            $('.appointment-room-list').css('width', targetList.length * 31 + 'vw');//31为1个list的宽度

            let targetContent = '';
            for(var i in targetList) {
                targetContent += '<li' +
                    (i == 0 ? ' class="active-staff"' : '') +
                    ' data-id="' +
                    targetList[i]['target_id_row_id'] +
                    '">' +
                    targetList[i]['target_id'] +
                    '</li>';
            }

            $('.appointment-room-list ul').html('').append(targetContent);

            //2. date list，当日往后14日
            let dateList = getDateList(14);

            let dateContent = '';
            let dateLength = 0;//可选日期的个数（需排除周末）
            for(var i in dateList) {
                let numDay = new Date(dateList[i]).getDay();//星期
                let languageDay;//星期
                //去掉周末
                if(numDay != 6 && numDay != 0) {
                    dateLength++;//记录可选日期的个数
                    languageDay = new Date(dateList[i]).toLocaleDateString(browserLanguage, {weekday:'short'});
                    dateContent += '<li data-item="' +
                        dateList[i] +
                        '"'+(dateLength == 1 ? ' class="active-staff"' : '')+'>' +
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

            //3. 是否需要限制半个小时内不能预约
            limitHoursRightNow(0);

            //4. 根据已有active-staff，来确定会议室和日期，获取该会议室当天所有预约
            getReserveByTarget();
        }

        //根据会议室和日期，获取某天所有预约
        function getReserveByTarget() {
            let target_row_id = $('.appointment-room-list .active-staff').data('id');
            let target_date = $('.appointment-date-list .active-staff').data('item');

            var self = this;
            let queryData = JSON.stringify({
                target_id_row_id: target_row_id,
                start_date: new Date(target_date + ' 00:00:00').getTime() / 1000,
                end_date: new Date(target_date + ' 23:59:59').getTime() / 1000
            });

            this.successCallback = function(data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    let targetList = data['content']['data_list'];
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "getTargetReserveData", self.successCallback, self.failCallback, queryData, '');
            }();
        }

        //返回可选日期区间，从当天开始
        function getDateList(length) {
            let nowDate = new Date();
            let nowYear = nowDate.getFullYear();
            let nowMonth = nowDate.getMonth();
            let nowDay = nowDate.getDate();

            let dateArr = [];
            for(var i = 0; i < length; i++) {
                let newDate = new Date(nowYear, nowMonth, nowDay + i).yyyymmdd('/');
                dateArr.push(newDate);
            }
            return dateArr;
        }

        //限制当前时间点内半个小时不能预约，UI上添加rest
        function limitHoursRightNow(i) {
            //1. 先判断日期选择第一个是否是当日，不是当日说明是周末，则不需要卡控
            let currentDate = new Date().yyyymmdd('/');
            let firstDate = $('.appointment-date-list li:eq(0)').data('item');
            if(currentDate == firstDate && i == 0) {
                //2. 遍历所有时段list判断时段的时间戳是否小于半个小时后的时间戳
                let afterTemp = Math.floor(new Date().getTime() / 1000) + 30 * 60;

                $('.appointment-hour li').each(function(index, elem) {
                    let hourTemp = new Date(currentDate + ' ' + $(elem).data('hour')).getTime() / 1000;
                    if(hourTemp < afterTemp) {
                        $(elem).addClass('rest-hour');
                    }
                });
            } else {
                //否则刷新UI，去除限制
                $('.appointment-hour li').each(function(index, elem) {
                    if($(elem).data('hour') != '12:00' && $(elem).data('hour') != '12:30') {
                        $(elem).removeClass('rest-hour');
                    }
                });
            }
        }

        //加法-茶水
        function additionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.appointment-count .' + type + '-addition').hasClass('cannot-addition');
            if(!has) {
                let count = (type == 'tea' ? ++teaCount : ++waterCount);
                $('.appointment-count .' + type + '-result').text(count);

                //当count>0时减法可用
                if(count > 0) {
                    $('.appointment-count .' + type + '-subtraction').addClass('can-subtraction');              
                }

                //当count=20时加法不可用
                if(count == 20) {
                    $('.appointment-count .' + type + '-addition').addClass('cannot-addition');
                }
            }

            //判断teaCount和waterCount，只要任意一个大于0，按钮可用
            if((teaCount > 0 || waterCount > 0) && activeCount > 0) {
                $('.appointmentTeaBtn').addClass('active-btn-green');
            }
        }

        //减法-茶水
        function subtractionCount(type) {
            //1.加法是否可用，根据class判断
            let has = $('.appointment-count .' + type + '-subtraction').hasClass('can-subtraction');
            if(has) {
                let count = (type == 'tea' ? --teaCount : --waterCount);
                $('.appointment-count .' + type + '-result').text(count);

                //当count=0时减法不可用
                if(count == 0) {
                    $('.appointment-count .' + type + '-subtraction').removeClass('can-subtraction');
                }

                //当count<20时加法可用
                if(count < 20) {
                    $('.appointment-count .' + type + '-addition').removeClass('cannot-addition');
                }
            }

            //判断teaCount和waterCount，当两者都为0时，按钮不可用
            if((teaCount == 0 && waterCount == 0) || activeCount == 0) {
                $('.appointmentTeaBtn').removeClass('active-btn-green');
            }
        }

        //检查是否选择时段，时段为必选
        function checkActiveHours() {
            let arr = [];
            $('.appointment-hour li').each(function(index, elem) {
                let has = $(elem).hasClass('active-hour');
                if(has) {
                    arr.push($(elem).data('08:00'));
                }
            });
            return arr;
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserAppointment").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserAppointment").one("pageshow", function(event, ui) {
            //动态生成会议室和日期，并获取该会议室当天所有预约
            getTargetAndDateList();
        });

        $("#viewStaffUserAppointment").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserAppointment").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //选择会议室
        $('.appointment-room-list ul').on('click', 'li', function() {
            $('.appointment-room-list li').removeClass('active-staff');
            $(this).addClass('active-staff');
            //切换会议室需获取该会议室某一天的所有预约
            getReserveByTarget();
        });

        //选择日期
        $('.appointment-date-list ul').on('click', 'li', function() {
            $('.appointment-date-list li').removeClass('active-staff');
            $(this).addClass('active-staff');
            //如果日期选择非当日，刷新UI不限制时间段是否可选，如果选择当日限制当前时间后半个小时内不能预约
            let index = $(this).index();
            limitHoursRightNow(index);
            //切换日期需获取该日某一会议室所有预约
            getReserveByTarget();
        });

        //选择时段
        $('.hour-list').on('click', function() {
            var rest = $(this).hasClass('rest-hour');//休息时段
            var checked = $(this).hasClass('checked-hour');//他人预约时段
            var active = $(this).hasClass('active-hour');//激活的时段

            //只能选择空白时段
            if(!rest && !checked) {
                if(!active) {
                    $(this).addClass('active-hour');
                    activeCount++;
                } else {
                    $(this).removeClass('active-hour');
                    activeCount--
                }
            }

            //按钮是否可用
            if((teaCount > 0 || waterCount > 0) && activeCount > 0) {
                $('.appointmentTeaBtn').addClass('active-btn-green');
            } else {
                $('.appointmentTeaBtn').removeClass('active-btn-green');
            }
        });

        //加法-茶水
        $('.appointment-count .count-select').on('click', '.tea-addition, .water-addition', function() {
            let teaType = $(this).parent().data('type');
            additionCount(teaType);
        });

        //减法-茶水
        $('.appointment-count .count-select').on('click', '.tea-subtraction, .water-subtraction', function() {
            let teaType = $(this).parent().data('type');
            subtractionCount(teaType);
        });

        //茶水预约
        $('.appointmentTeaBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                //API
            }
        });


    }
});