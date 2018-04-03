
$("#viewContact").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        

        /********************************** page event *************************************/
        $("#viewContact").on("pagebeforeshow", function(event, ui){

        });

        $("#viewContact").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("a[id^='button']").on("click", function(){

        });

        
    }
});




