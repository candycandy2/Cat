$("#viewLeaveSubmit").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewLeaveSubmit").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveSubmit").keypress(function(event) {
        });
    }
});