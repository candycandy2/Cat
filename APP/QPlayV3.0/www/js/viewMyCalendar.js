$("#viewMyCalendar").pagecontainer({
    create: function (event, ui) {

        
        

        /********************************** page event ***********************************/
        $("#viewMyCalendar").on("pagebeforeshow", function (event, ui) {
            var prslvsCalendar = new Calendar({
                renderTo: "#viewMyCalendar #myCalendar",
                id: "viewPersonalLeave-calendar",
                language: "default",
                show_days: true,
                weekstartson: 0,
                markToday: true,
                markWeekend: true,
                showNextyear: true,
                // changeDateEventListener: function(year, month) {
                //     queryCalendarData = "<LayoutHeader><Year>" +
                //         year +
                //         "</Year><Month>" +
                //         month +
                //         "</Month><EmpNo>" +
                //         myEmpNo +
                //         "</EmpNo></LayoutHeader>";
                //     //throw new Error("call QueryCalendarData.");
                //     //呼叫API
                //     QueryCalendarData();
                // },
                nav_icon: {
                    prev: '<img src="img/prev.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                }
            });
        });

        $("#viewMyCalendar").on("pageshow", function (event, ui) {

        });

        $("#viewMyCalendar").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});