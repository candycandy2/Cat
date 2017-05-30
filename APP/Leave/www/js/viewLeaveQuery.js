$("#viewLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        /********************************** page event *************************************/
        $("#viewLeaveQuery").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewLeaveQuery").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveQuery").keypress(function(event) {
        });
    }
});