// var htmlContent = "";
// var holidayList = htmlContent
//                 + '<li>'
//                 +   '<span>'
//                 +   '- 1/1開國紀念日 ‧ 1/2補假一日'
//                 +   '</span>'
//                 + '</li>'
//                 + '<li>'
//                 +   '<span>'
//                 +   '- 1/28初一逢周六 ‧ 1/31補假一日'
//                 +   '</span>'
//                 + '</li>'
//                 + '<li>'
//                 +   '<span>'
//                 +   '- 1/29初二逢週日 ‧ 2/1補假一日'
//                 +   '</span>'
//                 + '</li>';

$("#viewCalendar").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        $(document).ready(function() {
            $("#viewCalendar #myCalendar").calendar({
                id: "viewCalendar",
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
                ]
            });
        });

        /********************************** page event *************************************/
        $("#viewCalendar").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewCalendar").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/

    }
});