
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

        //var todayYearmod   = "2015";  
        todayYearmod  = todayYear;        
       // var todayYearmod   = todayYear.substring(2,3); //20170405 pm 
        var todayYearmod   = todayYearmod.toString().substring(2,4);    //20170405 pm   OK~
    //  $(".frag1").text(todayMonth+" "+todayYear);
    //  $(".frag2").text(lastMonth+" "+todayYear);
        $(".frag1").text(MonthWord[todayMonth-1]+"-"+todayYearmod);
        $(".frag2").text(MonthWord[todayMonth-2]+"-"+todayYearmod);
        
        
     
      
        $(".mainword1").text("From "+ FromStatus +" to "+ToStatus+" ");  
        $(".mainword3").text("Updated on "+todayYear+"/"+todayMonth+"/"+todayDate);  
    //  Exception Img   **************************************************************************    
    
    //  Transfer   ************************************************************************** 

        $(document).on("click", ".buttontransfer", function() {      
                 tmpsetF = $(".buttononeCountry1").html(); 
                 tmpsetT = $(".buttononeCountry2").html();
        
                 $(".buttononeCountry1").html(tmpsetT);  
                 $(".buttononeCountry2").html(tmpsetF);
                
                 $(".buttonone1").attr("src","img/tmp/"+tmpsetT +".png");
                 $(".buttontwo1").attr("src","img/tmp/"+tmpsetF+".png");             
                /*
                 arraytmp     = array;
                 arraytmpTo   = arrayTo;

                 array        = arraytmpTo;   //set
                 arrayTo      = arraytmp  ;
                 */
                // $("#ultestA").remove(content); 
                 FromStatus = tmpsetT;
                 ToStatus =  tmpsetF ;
                 $(".mainword1").text("From "+ FromStatus  +" to "+ ToStatus  +" ");  
                //Buttonimg(); 
                // Addhtml();   // cause a lot => can it renew? not to add?(append) 
                 //$("#fragment-1").html(" "); 
              
        });
   //  Transfer   ************************************************************************** 



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
