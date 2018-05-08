var calendarData = false;

$("#viewPersonalLeaveCalendar").pagecontainer({
    create: function(event, ui) {


        /********************************** function *************************************/
        //行事历
        window.QueryCalendarData = function() {

            this.successCallback = function(data) {
                //console.log(data);
                myCalendarData = {};
                myHolidayData = [];
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
                                $("#viewPersonalLeave-calendar #" + myCalendarData[leaveFlag][day]).parent().addClass("leave");
                            }
                        }

                        //遍歷假日列表，統一爲藍色
                        for (var i in myCalendarData[holidayFlag]) {
                            $("#viewPersonalLeave-calendar #" + myCalendarData[holidayFlag][i]).addClass("weekend");
                        }

                        calendarData = true;
                    } else {
                        calendarData = false;
                    }


                }
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPIEx("POST", true, "QueryCalendarData", self.successCallback, self.failCallback, queryCalendarData, "", 60 * 60);
            }();
        };

        function parseCDATA(data) {
            data = data.toString();
            var dataTempA = data.split("CDATA");
            var dataTempB = dataTempA[1].split("[");
            var dataTempC = dataTempB[1].split("]]");

            return dataTempC[0];
        }

        $(document).ready(function() {
            prslvsCalendar = new Calendar({
                renderTo: "#viewPersonalLeaveCalendar #myCalendar",
                id: "viewPersonalLeave-calendar",
                language: "default",
                show_days: true,
                weekstartson: 0,
                markToday: true,
                markWeekend: true,
                showNextyear: true,
                changeDateEventListener: function(year, month) {
                    queryCalendarData = "<LayoutHeader><Year>" +
                        year +
                        "</Year><Month>" +
                        month +
                        "</Month><EmpNo>" +
                        myEmpNo +
                        "</EmpNo></LayoutHeader>";
                    //throw new Error("call QueryCalendarData.");
                    //呼叫API
                    QueryCalendarData();
                },
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                }
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeaveCalendar").one("pagebeforeshow", function(event, ui) {

        });

        $("#viewPersonalLeaveCalendar").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/

        $("#infoTitle-1").on("click", function() {
            if ($("#infoContent-1").css("display") === "none") {
                $("#infoContent-1").slideDown(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_up.png");
            } else if ($("#infoContent-1").css("display") === "block") {
                $("#infoContent-1").slideUp(500);
                $("#infoTitle-1").find(".listDown").attr("src", "img/list_down.png");

            }
        });

        $("#infoTitle-3").on("click", function() {
            if ($("#infoContent-3").css("display") === "none") {
                $("#infoContent-3").slideDown(500);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_up.png");
                $('html,body').animate({ scrollTop: $('#infoContent-3').offset().top }, 1000);
            } else if ($("#infoContent-3").css("display") === "block") {
                $("#infoContent-3").slideUp(500);
                $("#infoTitle-3").find(".listDown").attr("src", "img/list_down.png");
            }
        });

        //Calendar Event
        $(document).on({
            click: function(event) {
                //只有當calendar=true有數據時才添加 tooltip
                if (calendarData) {
                    var isLeave = false;
                    var isWeekend = false;
                    var isNormal = false;
                    var dayNumber = $(event.target).prop("id");
                    var divWidth;
                    var divWidthPX;
                    var firstTdWidth;
                    var calendarFirstTr = $(".QPlayCalendar").find("tr:eq(1)")[0];
                    var calendarFirstTrTop = $(calendarFirstTr).position().top;
                    var tooltipMarginTop = parseInt(document.documentElement.clientWidth * 1.724 / 100, 10);
                    calendarFirstTrTop = parseInt(calendarFirstTrTop + tooltipMarginTop, 10);
                    var clickTdTop = $(event.target).parent().position().top;
                    var tooltipTop;

                    //Leave
                    if ($(event.target).parent().hasClass("leave")) {
                        isLeave = true;
                    }

                    //Weekend
                    if ($(event.target).parent().hasClass("weekend")) {
                        isWeekend = true;
                    }

                    //Normal
                    if (!isLeave && !isWeekend) {
                        isNormal = true;
                    }

                    if (isLeave) {
                        divWidth = "48vw";
                        firstTdWidth = "24vw";
                        divWidthPX = parseInt(document.documentElement.clientWidth * 48 / 100, 10);
                        tooltipTop = calendarFirstTrTop;
                    } else if (isWeekend) {
                        divWidth = "26vw";
                        divWidthPX = parseInt(document.documentElement.clientWidth * 26 / 100, 10);
                        tooltipTop = parseInt(clickTdTop + tooltipMarginTop, 10);
                    } else if (isNormal) {
                        divWidth = "26vw";
                        divWidthPX = parseInt(document.documentElement.clientWidth * 26 / 100, 10);
                        tooltipTop = parseInt(clickTdTop + tooltipMarginTop, 10);
                    }

                    //Tooltip position: left / right
                    var dayIndexInWeek = $(event.target).parent().index(); //0,1,2,3,4,5,6
                    var tooltipPosition = "right";
                    var tooltipHorizontalPosition;
                    var tdLeft = $(event.target).position().left;
                    var tdWidth = $(event.target).width();
                    var tdPaddingY = parseInt(document.documentElement.clientWidth * 1.53 / 100, 10);
                    var tooltipMarginY = parseInt(document.documentElement.clientWidth * 2.81 / 100, 10);

                    if (dayIndexInWeek >= 3) {
                        tooltipPosition = "left";
                    }

                    if (tooltipPosition === "left") {
                        tooltipHorizontalPosition = "left:" + parseInt(tdLeft - divWidthPX - tdPaddingY - tooltipMarginY, 10) + "px;";
                    } else {
                        tooltipHorizontalPosition = "left:" + parseInt(tdLeft + tdWidth - tdPaddingY * 2 + tooltipMarginY, 10) + "px;";
                    }

                    $(".tooltip").remove();
                    $("#viewPersonalLeaveCalendar").append('<div class="tooltip" style="width:' + divWidth + '; top:' + tooltipTop + 'px; ' + tooltipHorizontalPosition + '">' + myHolidayData[dayNumber] + '</div>');

                    if (isLeave) {
                        $(".tooltip").find("table").css({
                            "width": divWidth,
                            "line-height": "1.2"
                        });

                        $(".tooltip").find("table").each(function(index, dom) {
                            $(dom).find("td:eq(0)").css("width", firstTdWidth);
                        });
                    }
                }

            }
        }, ".QPlayCalendar");

        $(document).on("click", function(event) {
            if (!$(event.target).parent().parent().parent().parent().parent().hasClass("QPlayCalendar")) {
                if (!$(event.target).parent().parent().parent().parent().parent().hasClass("tooltip")) {
                    if ($(".tooltip").length > 0) {
                        $(".tooltip").remove();
                    }
                }
            }
        });

        $(document).on("change", "input[name=radio-choice-h-2]", function() {
            if ($(".tooltip").length > 0) {
                $(".tooltip").remove();
            }
        });

        //Leave Date scroll click
        $(document).on("click", "#leaveDate a", function() {
            $("#leaveDate a").removeClass("hover");
            $(this).addClass("hover");

            beginDate = endDate = $(this).data("value");
        });

    }
});