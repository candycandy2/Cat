$("#viewMyCalendar").pagecontainer({
    create: function (event, ui) {

        var reserveDateList = [],
            reservePositionList = [],
            leaveAppData = {
                key: 'appleave',
                secretKey: '86883911af025422b626131ff932a4b5'
            }

        /********************************** function ***********************************/
        function initialCalendar(holidayData) {
            reserveCalendar = new Calendar({
                renderTo: "#viewMyCalendar #myCalendar",
                id: "reserveCalendar",
                language: "default",
                show_days: true,
                weekstartson: 0,
                markToday: true,
                markWeekend: true,
                showNextyear: true,
                reserveData: reserveList,
                infoData: holidayData,
                showInfoListTo: "#viewMyCalendar .infoList",
                changeDateEventListener: function (year, month) {
                    QueryCalendarData(year, month);
                },
                nav_icon: {
                    prev: '<img src="img/prev.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                }
            });
        }

        //按照日期生成预约htnl
        function createReserveDetail() {
            var reserveLength = 30;
            //1. 按照日期生成reserve html
            reserveDateList = getAfterDate(new Date().yyyymmdd(""), reserveLength);
            var content = "";
            for (var i in reserveDateList) {
                content += '<div class="reserve-list" data-index="' + i +
                    '" data-id="' + formateReserveDate(reserveDateList[i], '-') +
                    '"><div class="reserve-title">' + formateReserveDate(reserveDateList[i]) +
                    '</div><div class="reserve-content" style="display:none;"></div><div class="reserve-null">本日无预约</div></div>';
            }

            $("#reserveContent").html('').append(content);

            //2.遍历html和当天所有预约
            $.each($(".reserve-list"), function (index, item) {
                for (var i in reserveList) {
                    if ($(item).attr("data-id") == i) {
                        var content = '';
                        for (var j = 0; j < reserveList[i].length; j++) {
                            content += '<div class="reserve-li"><div class="reserve-li-time"><div class="reserve-start">' +
                                reserveList[i][j].ReserveBeginTime +
                                '</div><div class="reserve-end">' +
                                reserveList[i][j].ReserveEndTime +
                                '</div></div><div class="reserve-li-item">' +
                                reserveList[i][j].item +
                                '</div></div>';
                        }
                        $(item).children(".reserve-content").append(content);
                        $(item).children(".reserve-null").hide();
                        $(item).children(".reserve-content").show();
                    }
                }
            });

            //3.记录每日预约轮播的位置
            if (reservePositionList.length == 0) {
                for (var i in reserveDateList) {
                    var x = $(".reserve-list[data-index=" + i + "]").offset().left;
                    reservePositionList.push(x);
                }
            }

        }

        /**
         * 获取往后N天的日期
         * @param start 起始日期
         * @param count 往后天数
         */
        function getAfterDate(start, count) {
            var year = Number(start.substr(0, 4));
            var month = Number(start.substr(4, 2)) - 1;
            var day = Number(start.substr(6, 2));
            count = Number(count);

            var arr = [];
            for (var i = 0; i < count; i++) {
                var newDate = new Date(year, month, (day + i));

                var _year = newDate.getFullYear().toString();
                var _month = (newDate.getMonth() + 1).toString();
                if (_month.length == 1) {
                    _month = "0" + _month;
                }
                var _day = newDate.getDate().toString();
                if (_day.length == 1) {
                    _day = "0" + _day;
                }

                arr.push(_year + _month + _day);
            }

            return arr;
        }

        //format预约日期格式
        function formateReserveDate(str, symbol) {
            symbol = symbol || null;
            if (symbol == null) {
                return str.substr(0, 4) + "年" + str.substr(4, 2) + "月" + str.substr(6, 2) + "日";
            } else {
                return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
            }
        }

        function QueryCalendarData(year, month) {
            var self = this;
            var queryData = '<LayoutHeader><Year>' +
                year +
                '</Year><Month>' +
                month +
                '</Month><EmpNo>' +
                loginData['emp_no'] +
                //'1204125' +
                '</EmpNo></LayoutHeader>';
            var key = leaveAppData.key;
            var secret = leaveAppData.secretKey;

            this.successCallback = function (data) {

                //console.log(data);

                var myCalendarData = {};
                var myHolidayData = [];
                var leaveFlag = "3";
                var holidayFlag = "2";
                if (data['ResultCode'] === "1") {
                    //length大于0说明有数据，length等于0说明年份不对没有数据
                    if (data['Content'].length > 0) {
                        var callbackData = data['Content'][0]["Result"];
                        var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                        var colorTagArry = $("color", htmlDom);
                        var informationTagArry = $("information", htmlDom);

                        for (var day = 1; day <= colorTagArry.length; day++) {
                            if (myCalendarData[$(colorTagArry[day - 1]).html()] === undefined) {
                                myCalendarData[$(colorTagArry[day - 1]).html()] = [];
                            }
                            myCalendarData[$(colorTagArry[day - 1]).html()].push(day);
                            myHolidayData[day] = parseCDATA($(informationTagArry[day - 1]).html());
                        }
                        if (leaveFlag in myCalendarData) {
                            for (var day in myCalendarData[leaveFlag]) {
                                //$("#reserveCalendar #" + myCalendarData[leaveFlag][day]).parent().addClass("leave");
                                //获取table并append到页面
                                var leaveTable = '<table' + myHolidayData[myCalendarData[leaveFlag][day]].split('<table')[1];
                                $('#leaveTable').html('').append(leaveTable);
                                var leaveMsg = $('#leaveTable tr:eq(0) > td:eq(1)').text();
                                $("#reserveCalendar #" + myCalendarData[leaveFlag][day]).after('<div class="reserve-str">' + leaveMsg + '</div>');
                                //判断子元素个数，大于5的隐藏，既第6个隐藏
                                if ($("#reserveCalendar #" + myCalendarData[leaveFlag][day]).parent().children().length > 5) {
                                    $("#reserveCalendar #" + myCalendarData[leaveFlag][day]).parent().children('div:eq(5)').addClass('hidden-str');
                                }
                            }
                        }

                        //遍歷假日列表，統一爲藍色
                        // for (var i in myCalendarData[holidayFlag]) {
                        //     $("#reserveCalendar #" + myCalendarData[holidayFlag][i]).addClass("weekend");
                        // }

                        //calendarData = true;
                    } else {
                        //calendarData = false;
                    }

                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPIByKey("POST", true, key, secret, "QueryCalendarData", self.successCallback, self.failCallback, queryData, "", 3600, "low");
                //CustomAPIEx("POST", true, "QueryCalendarData", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        function parseCDATA(data) {
            data = data.toString();
            var dataTempA = data.split("CDATA");
            var dataTempB = dataTempA[1].split("[");
            var dataTempC = dataTempB[1].split("]]");

            return dataTempC[0];
        }


        /********************************** page event ***********************************/
        $("#viewMyCalendar").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewMyCalendar").one("pageshow", function (event, ui) {
            //1. calendar
            var siteCode = localStorage.getItem("site_code");
            if (siteCode == "QCS" || siteCode == "BQC") {
                $.getJSON("string/" + siteCode + "-holiday.json", function (data) {
                    initialCalendar(data);
                });
            } else {
                $.getJSON("string/QTY-holiday.json", function (data) {
                    initialCalendar(data);
                });
            }

            //2. reserve carousel
            createReserveDetail();

            //3. leave app
            var currentDate = new Date();
            var currentYear = currentDate.getFullYear().toString();
            var currentMonth = (currentDate.getMonth() + 1).toString();
            QueryCalendarData(currentYear, currentMonth);

        });

        $("#viewMyCalendar").on("pageshow", function (event, ui) {

        });

        $("#viewMyCalendar").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //点击空白区域，隐藏预约
        $("#myReserve").on("click", function (event) {
            var tag = event.target.id;
            if (tag == "myReserve") {
                $("#myReserve").hide();
            }
        });

        //点击有预约的日期，显示预约详情
        $("#myCalendar").on("click", "td", function () {
            var dateId = $(this).attr("id");

            for (var i in reserveDateList) {
                if (dateId == formateReserveDate(reserveDateList[i], '-')) {
                    $("#myReserve").show();
                    $("#myReserveList").scrollLeft(0).scrollLeft(reservePositionList[i] - scrollLeftOffset(3.71));
                }
            }
        });

    }
});