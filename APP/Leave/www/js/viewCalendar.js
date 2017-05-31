$("#viewCalendar").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

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