$("#viewMyCalendar").pagecontainer({
    create: function (event, ui) {

        /********************************** function ***********************************/
        function initialCalendar(holidayData) {
            if (holidayData == null) {
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
                    ///infoData: holidayData,
                    showInfoListTo: "#viewMyCalendar .infoList",
                    // changeDateEventListener: function (year, month) {
                    //     addReserveToCalendar(year, month);
                    // },
                    nav_icon: {
                        prev: '<img src="img/prev.png" id="left-navigation" class="nav_icon">',
                        next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                    }
                });
            } else {
                reserveCalendar = new Calendar({
                    renderTo: "#viewMyCalendar #myCalendar",
                    id: "reserveCalendar",
                    language: "default",
                    show_days: true,
                    weekstartson: 0,
                    markToday: true,
                    markWeekend: true,
                    showNextyear: true,
                    infoData: holidayData,
                    reserveData: reserveList,
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
        }

        /********************************** page event ***********************************/
        $("#viewMyCalendar").on("pagebeforeshow", function (event, ui) {
            if (viewCalendarInitial) {
                var siteCode = localStorage.getItem("site_code");
                if (siteCode == "QCS" || siteCode == "BQC" || siteCode == "QTY") {
                    $.getJSON("string/" + siteCode + "-holiday.json", function (data) {
                        //holidayData = data;
                        initialCalendar(data);
                    });
                } else {
                    initialCalendar(null);
                }

                viewCalendarInitial = false;
            }

        });

        $("#viewMyCalendar").on("pageshow", function (event, ui) {

        });

        $("#viewMyCalendar").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/


    }
});