$("#viewCalendar").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        $(document).ready(function() {
            $("#viewCalendar #myCalendar").calendar({
                language: "en",
                show_previous: true,
                show_next: true,
                show_days: true,
                weekstartson: 0,
                nav_icon: {
                    prev: '<img src="img/pre.png" id="left-navigation" class="nav_icon">',
                    next: '<img src="img/next.png" id="right-navigation" class="nav_icon">'
                },
            });
        });

        /********************************** page event *************************************/
        $("#viewCalendar").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewCalendar").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });


        /********************************** dom event *************************************/
        $("#viewCalendar").keypress(function(event) {
        });
    }
});