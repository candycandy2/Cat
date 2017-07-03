$("#viewHolidayCalendar").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        $(document).ready(function() {
            holidayCalendar = new Calendar({
                renderTo: "#viewHolidayCalendar #myCalendar",
                id: "viewHolidayCalendar-calendar",
                language: "default",
                show_days: true,
                weekstartson: 0,
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                },
                legend: [
                    {
                        type: "img-text", 
                        label: "星期六日",
                        badge: "",
                        classname: "weekend-icon"
                    }, {
                        type: "img-text",
                        label: "放假節日",
                        badge: "",
                        classname: "holiday-icon"
                    }
                ],
                showInfoListTo: "#viewHolidayCalendar .infoList"
            });
        });

        /********************************** page event *************************************/
        $("#viewHolidayCalendar").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewHolidayCalendar").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $(".page-tabs #viewHolidayCalendar-tab-1").on("click", function() {
            $.getJSON("string/QTY-holiday.json", function(data) {
                holidayData = data;
            });
        });

        $(".page-tabs #viewHolidayCalendar-tab-2").on("click", function() {
            $.getJSON("string/BQC-holiday.json", function(data) {
                holidayData = data;
            });
        });

        $(".page-tabs #viewHolidayCalendar-tab-3").on("click", function() {
            $.getJSON("string/QCS-holiday.json", function(data) {
                holidayData = data;
            });
        });
    }
});