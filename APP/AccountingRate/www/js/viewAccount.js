
$("#viewAccount").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.APIRequest = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };

    // Date Month for head main 20170324 ************************************************************************

      window.Today    = new Date();

        var MonthWord =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var todayYear   = Today.getFullYear();
        var todayMonth  = Today.getMonth()+1;
        var todayDate   = Today.getDate();
        var lastMonth   = Today.getMonth();
       
        var FromStatus  = "AUD";  
        var ToStatus    = "NTD";
        
  

    //  $(".frag1").text(todayMonth+" "+todayYear);
    //  $(".frag2").text(lastMonth+" "+todayYear);
        $(".frag1").text(MonthWord[todayMonth-1]+" "+todayYear);
        $(".frag2").text(MonthWord[todayMonth-2]+" "+todayYear);
        
        
     
      
        $(".mainword1").text("From "+ FromStatus +" to "+ToStatus+" ");  
        $(".mainword3").text("Update on "+todayYear+"/"+todayMonth+"/"+todayDate);  
    //  Exception Img   **************************************************************************    
  

        /********************************** page event *************************************/
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {
           // Addhtml();


        });

        $("#viewAccount").on("pageshow", function(event, ui) {
         //   Addhtml();
        //$("#ultestA").append(contenttest);
        //$("#eventWorkConfirmA").popup('open');//action
        //  $("#eventWorkConfirmB").popup('open');     
 
        });    

        /********************************** dom event *************************************/
        $('#viewAccount').keypress(function(event) {

        });

    }
});
