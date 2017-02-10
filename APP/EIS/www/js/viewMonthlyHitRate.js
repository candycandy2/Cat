//$(document).one("pagecreate", "#viewMonthlyHitRate", function(){

    $("#viewMonthlyHitRate").pagecontainer({
        create: function(event, ui) {
            /********************************** page event *************************************/
            $("#viewYTDHitRate").on("pagebeforeshow", function(event, ui){

            });
        }
    });
//});
