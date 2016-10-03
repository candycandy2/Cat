
$(document).on("pagecreate", "#viewDetailInfo", function(){

    $("#viewDetailInfo").pagecontainer({
        create: function(event, ui) {
            console.log("----pagecreate----DetailInfo");
            
            $("#viewDetailInfo").on("pageshow", function(event, ui){
                console.log("show----DetailInfo");
            });
        }
    });

});
