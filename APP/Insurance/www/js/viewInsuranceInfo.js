

$("#viewInsuranceInfo").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
      

        /********************************** page event *************************************/
        $("#viewInsuranceInfo").on("pagebeforeshow", function(event, ui){

        });

        $("#viewInsuranceInfo").on("pageshow", function(event, ui) {
            loadingMask("hide");

        });

        /********************************** dom event *************************************/
       
    }
});




