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
            if(device.platform === "iOS") {
                $("#datetimes").focus();
            }else if(device.platform == "Android") {
                $("#datetimes").click();
            }  
        });

        $("#btn2").on("click", function(){
            if(device.platform === "iOS") {
                $("#dates").focus();
            }else if(device.platform == "Android") {
                $("#dates").click();
            }
        });

        $("#btn3").on("click", function(){
            if(device.platform === "iOS") {
                $("#times").focus();
            }else if(device.platform == "Android") {
                $("#times").click();
            }
        });

        $("#btn4").on("click", function(){
            if(device.platform === "iOS") {
                $("#months").focus();
            }else if(device.platform == "Android") {
                $("#months").click();
            }
        });

        $("#btn5").on("click", function(){
            if(device.platform === "iOS") {
                $("#weeks").focus();
            }else if(device.platform == "Android") {
                $("#weeks").click();
            }
        });


    }
});
