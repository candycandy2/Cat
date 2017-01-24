
$(document).one("pagecreate", "#viewHitRate", function(){
    
    $("#viewHitRate").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.QueryCompanyData = function() {
                

            };

            /********************************** page event *************************************/
            $("#viewHitRate").on("pagebeforeshow", function(event, ui) {
                if (doClearInputData) {
                    clearInputData();
                    doClearInputData = true;
                }
            });

            /********************************** dom event *************************************/

        }
    });

});