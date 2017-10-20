$("#viewBackLeaveQuery").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        /********************************** page event *************************************/
        $("#viewBackLeaveQuery").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewBackLeaveQuery").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewBackLeaveQuery").keypress(function(event) {
            
        });


        $("#btn1").on("click", function(){
            $("#datetimes").click();
        });

        $("#btn2").on("click", function(){
            $("#datetime").click();
        });

        $("#btn3").on("click", function(){
            $("#dates").click();
        });

        $("#btn4").on("click", function(){
            $("#times").click();
        });

        $("#btn5").on("click", function(){
            $("#months").click();
        });

        $("#btn6").on("click", function(){
            $("#weeks").tap();
        });


    }
});
