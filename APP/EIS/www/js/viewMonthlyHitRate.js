$(document).one("pagebeforecreate", function(){
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
});

$(document).one("pagecreate", "#viewMonthlyHitRate", function(){

    $("#viewMonthlyHitRate").pagecontainer({
        create: function(event, ui) {
            /********************************** page event *************************************/
            $("#viewYTDHitRate").on("pagebeforeshow", function(event, ui){

            });
        }
    });

    $("#mypanel #panel-header-content").on("click", function(){
    	$("#viewHitRate").show();
    	$("#viewMonthlyHitRate").hide();
    	$("#viewYTDHitRate").hide();
    	$("#mypanel").panel("close");
    });
    


	// $(".menu-btn").on("click", function(){
	// 	$("#mypanel").panel("open");
 //    });

 //    $("#viewMonthlyHitRate").on( "swiperight", function(event){
 //        if($(".ui-page-active").jqmData("panel") !== "open"){
 //            $("#mypanel").panel( "open");
 //        }
 //    });

});
