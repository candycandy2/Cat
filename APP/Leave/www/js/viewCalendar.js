$("#viewCalendar").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        $(document).ready(function() {
            $("#viewCalendar #myCalendar").zabuto_calendar({
                language: "en",
                show_previous: true,
                show_next: true,
                cell_border: true,
                show_days: true,
                weekstartson: 0,
                nav_icon: {
                    prev: '<i class="fa fa-chevron-circle-left"></i>',
                    next: '<i class="fa fa-chevron-circle-right"></i>'
                }
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