$("#viewHolidayCalendar").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        function initialHolidayCalendar() {
            holidayCalendar = new Calendar({
                renderTo: "#viewHolidayCalendar #myCalendar",
                id: "viewHolidayCalendar-calendar",
                show_days: true,
                weekstartson: 0,
                markWeekend: true,
                showNextyear: true,
                infoData: QTYholidayData,
                showInfoListTo: "#viewHolidayCalendar .infoList",
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                },
                legend: [{
                    type: "img-text",
                    label: langStr["str_007"], // "星期六日"
                    classname: "weekend-icon"
                }, {
                    type: "img-text",
                    label: langStr["str_008"], // "放假節日"
                    classname: "holiday-icon"
                }]
            });
        }

        /********************************** page event *************************************/
        $("#viewHolidayCalendar").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewHolidayCalendar").one("pageshow", function(event, ui) {
            initialHolidayCalendar();
            loadingMask("hide");
        });

        $("#viewHolidayCalendar").on("pageshow", function(event, ui) {
            loadingMask("hide");
            changeLeavePanelBKColor();
        });

        /********************************** dom event *************************************/
        $(".page-tabs #viewHolidayCalendar-tab-1").on("click", function() {
            holidayCalendar.refreshInfoList(QTYholidayData);
        });

        $(".page-tabs #viewHolidayCalendar-tab-2").on("click", function() {
            holidayCalendar.refreshInfoList(BQCholidayData);
        });

        $(".page-tabs #viewHolidayCalendar-tab-3").on("click", function() {
            holidayCalendar.refreshInfoList(QCSholidayData);
        });

        $(document).on('click', '#viewHolidayCalendar .leaveMenu', function() {
            $("#mypanel").panel("open");
            $(".page-mask").show();
        })

    }
});