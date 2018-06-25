$("#viewMyCalendar").pagecontainer({
    create: function (event, ui) {

        var reserveDateList = [], reservePositionList = [];

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
                // changeDateEventListener: function (year, month) {
                //     addReserveToCalendar(year, month);
                // },
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

        //记录每个预约的位置，只有在pageshow时才能调用
        //且只调用一次，记录每个预约的原始位置
        function setReservePosition() {
            if (reservePositionList.length == 0) {
                for (var i in reserveDateList) {
                    var x = $(".reserve-list[data-index=" + i + "]").offset().left;
                    reservePositionList.push(x);
                }
            }
        }

        /********************************** page event ***********************************/
        $("#viewMyCalendar").on("pagebeforeshow", function (event, ui) {
            //calendar只需第一次加载
            if (viewCalendarInitial) {
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

                //预约carousel
                createReserveDetail();

                viewCalendarInitial = false;
            }
        });

        $("#viewMyCalendar").on("pageshow", function (event, ui) {
            setReservePosition();
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