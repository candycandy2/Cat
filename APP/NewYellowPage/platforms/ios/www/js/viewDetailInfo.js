
$(document).on("pagecreate", "#viewDetailInfo", function(){

    $("#viewDetailInfo").pagecontainer({
        create: function(event, ui) {
            
            $("#viewDetailInfo").on("pagebeforeshow", function(event, ui){
                console.log(ui);
                window.aaa = ui;
            });

            $("#viewDetailInfo").on("pageshow", function(event, ui){

            });
        }
    });

});
