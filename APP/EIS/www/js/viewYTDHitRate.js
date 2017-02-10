//$(document).one("pagebeforecreate", function(){
    //$.mobile.pageContainer.prepend(panel);
    //$("#mypanel").panel().enhanceWithin();
//});

//$(document).one("pagecreate", "#viewYTDHitRate", function(){
    
    $("#viewYTDHitRate").pagecontainer({
        create: function(event, ui) {
            /********************************** page event *************************************/
            $("#viewYTDHitRate").on("pagebeforeshow", function(event, ui){

            });
        }
    });
//});
