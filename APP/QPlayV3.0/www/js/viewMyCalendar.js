$("#viewMyCalendar").pagecontainer({
    create: function (event, ui) {

        var reserveDateList = [],
            reservePositionList = [],
            pageInitial = false,
            leaveAppData = {
                key: 'appleave',
                secretKey: '86883911af025422b626131ff932a4b5'
            }


        /********************************** function ***********************************/
        function initialCalendar(holidayData) {
            reserveCalendar = new Calendar({
                renderTo: "#viewMyCalendar #myCalendar",
                id: "reserveCalendar",
                language: getCalendarLanguage(browserLanguage),
                show_days: true,
                weekstartson: 0,
                markToday: true,
                markWeekend: true,
                showNextyear: true,
                reserveData: JSON.parse(sessionStorage.getItem('reserveList')),
                infoData: holidayData,
                showInfoListTo: "#viewMyCalendar .infoList",
                changeDateEventListener: function (year, month) {
                    //leave
                    QueryCalendarData(year, month);
                    //切换月份需要更新carousel
                    createCarousel();
                },
                nav_icon: {
                    prev: '<img src="img/prev.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                }
            });
        }

        function getCalendarLanguage(language) {
            if (language == 'en-us') {
                return 'en';
            } else {
                return 'zh';
            }
        }

        function createReserveCarousel(arr) {
            //1. content
            var length = 0;
            var content = '';
            $.each($('#reserveCalendar td'), function (index, item) {
                content += '<div class="reserve-list" data-index="' + index +
                    '" data-id="' + $(item).attr('id') +
                    '"><div class="reserve-title">' +
                    new Date($(item).attr('id')).toLocaleDateString(browserLanguage, { year: 'numeric', month: 'long', day: 'numeric' }) +
                    '</div><div class="reserve-content" style="display:none;"></div><div class="reserve-null">' + langStr['str_099'] + '</div></div>';
                length++;
            });

            //2. width
            var marginWidth = 3.71;
            var itemWidth = 85.16;
            var containerWidth = (marginWidth + itemWidth) * length + marginWidth;
            $('#reserveContent').css('width', containerWidth.toString() + 'vw');
            $("#reserveContent").html('').append(content);

            //3. 遍历当天所有预约
            $.each($(".reserve-list"), function (index, item) {
                for (var i in arr) {
                    if ($(item).attr("data-id") == i) {
                        var detailContent = '';
                        for (var j = 0; j < arr[i].length; j++) {
                            detailContent += '<div class="reserve-li"><div class="reserve-li-time"><div class="reserve-start">' +
                                arr[i][j].ReserveBeginTime +
                                '</div><div class="reserve-end">' +
                                arr[i][j].ReserveEndTime +
                                '</div></div><div class="reserve-li-item">' +
                                arr[i][j].item +
                                '</div></div>';
                        }
                        $(item).children(".reserve-content").append(detailContent);
                        $(item).children(".reserve-null").hide();
                        $(item).children(".reserve-content").show();
                    }
                }
            });

            //4. position
            $('#myReserve').addClass('opacity').show();
            $("#myReserveList").scrollLeft(0);
            reservePositionList = [];
            var today = new Date().yyyymmdd("-");
            var todayIndex = '';
            $.each($(".reserve-list"), function (index, item) {
                // save position
                var x = $(item).offset().left;
                reservePositionList.push(x);

                // find today index
                if (today == $(item).attr('data-id')) {
                    todayIndex = index;
                }
            });

            //9. scroll left
            if (!pageInitial) {
                $("#myReserveList").scrollLeft(reservePositionList[todayIndex] - scrollLeftOffset(marginWidth));
                $('#myReserve').removeClass('opacity');
                pageInitial = true;
            } else {
                $('#myReserve').hide().removeClass('opacity');
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

                    }

                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPIByKey("POST", true, key, secret, "QueryCalendarData", self.successCallback, self.failCallback, queryData, "", 15, "low");
            }();
        };

        function parseCDATA(data) {
            data = data.toString();
            var dataTempA = data.split("CDATA");
            var dataTempB = dataTempA[1].split("[");
            var dataTempC = dataTempB[1].split("]]");

            return dataTempC[0];
        }

        //include calendar & leave
        function createCalendarPage(data) {
            //1. calendar
            initialCalendar(data);

            //2. leave app
            var currentDate = new Date();
            var currentYear = currentDate.getFullYear().toString();
            var currentMonth = (currentDate.getMonth() + 1).toString();
            QueryCalendarData(currentYear, currentMonth);
        }

        //reserve carousel
        function createCarousel() {

            var checkReserveData = setInterval(function () {
                var changeReserveListDirty = sessionStorage.getItem('changeReserveListDirty');
                var reserveArr = JSON.parse(sessionStorage.getItem('reserveList'));

                if (reserveArr !== null && changeReserveListDirty == 'N') {
                    clearInterval(checkReserveData);
                    createReserveCarousel(reserveArr);
                }
            }, 1000);
        }

        /********************************** page event ***********************************/
        $("#viewMyCalendar").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewMyCalendar").one("pageshow", function (event, ui) {
            //1. calendar
            var siteCode = localStorage.getItem("site_code");
            if (siteCode == "QCS" || siteCode == "BQC") {
                $.getJSON("string/" + siteCode + "-holiday.json", function (data) {
                    createCalendarPage(data);
                });
            } else {
                $.getJSON("string/QTY-holiday.json", function (data) {
                    createCalendarPage(data);
                });
            }

            //2. carousel
            createCarousel();

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

            if ($(this).hasClass('reserveDay')) {
                $.each($(".reserve-list"), function (index, item) {
                    if (dateId == $(item).attr("data-id")) {
                        $("#myReserve").show();
                        $("#myReserveList").scrollLeft(0).scrollLeft(reservePositionList[index] - scrollLeftOffset(3.71));
                        return false;
                    }
                });
            } else {
                $("#noReserve").fadeIn(100).delay(500).fadeOut(100);
            }
        });

        //滑动切换月份
        // var x;
        // var change;
        // $('#myCalendar').on('touchstart', function (event) {
        //     x = event.originalEvent.targetTouches[0].pageX;

        // }).on('touchmove', function (event) {
        //     change = event.originalEvent.targetTouches[0].pageX - x;

        // }).on('touchend', function (event) {
        //     if (change > 0 && Math.abs(change) > 150) {
        //         $('.QPlayCalendar-navPrev').trigger('click');
        //     } else if (change < 0 && Math.abs(change) > 150) {
        //         $('.QPlayCalendar-navNext').trigger('click');
        //     }
        // });

    }
});