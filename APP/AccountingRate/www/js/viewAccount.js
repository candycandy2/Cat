
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
       
        var FromStatus  = "All Currency";  
        var ToStatus    = "USD";


        $(".buttononeCountry1").text(FromStatus);
        $(".buttononeCountry2").text(ToStatus);   

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
                //  Buttonimg();
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
                 Buttonimg(); 
        });
   //  Transfer   ************************************************************************** 
        function Buttonimg()     //when to call(when confirm must to test once)      
        {   
            $(".buttonone1").attr("src","img/tmp/"+ FromStatus  +".png");
            $(".buttontwo1").attr("src","img/tmp/"+ ToStatus +".png");

            if (FromStatus =="All Currency")
             {    // Bug for img show 
               $(".buttonone1").removeClass('buttononeFlag1');
               $(".buttonone1").addClass('buttononeFlag1non');
              // AddhtmlFirst();
             }
            else
             {
               $(".buttonone1").removeClass('buttononeFlag1non');
               $(".buttonone1").addClass('buttononeFlag1');

            }

            if (ToStatus =="All Currency")
            {   // Bug for img show 
              $(".buttontwo1").removeClass('buttononeFlag2');
              $(".buttontwo1").addClass('buttononeFlag1non');
            //  AddhtmlSecond();

            }
            else
            {
              $(".buttontwo1").removeClass('buttononeFlag1non');
              $(".buttontwo1").addClass('buttononeFlag2');

            }            
        }     
            Buttonimg(); 

 
  


        /********************************** page event *************************************/
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {
           // Addhtml();


        });

        $("#viewAccount").on("pageshow", function(event, ui) {
         //   Addhtml();
        //$("#ultestA").append(contenttest);
        //$("#eventWorkConfirmA").popup('open');//action
        //  $("#eventWorkConfirmB").popup('open');              
            Buttonimg(); 
   
            var eventConfirmA = { //Add
                id: "eventWorkConfirmA",  //template id
                content: $("template#tplAddConfirmA").html()
            };

        //   tplJS.Popup("viewExample2", "contentID", "append", eventCancelWorkDoneConfirmData);
        //Pop2
            var eventConfirmB = {  //Remove
                id: "eventWorkConfirmB",        // html template id  
                content: $("template#tplRemoveB").html()  //
            };
             
            tplJS.Popup("viewAccount", "contentID", "append", eventConfirmA);  
            tplJS.Popup("viewAccount", "contentID", "append", eventConfirmB);
        });    



        /********************************** Popup *************************************/
        $(document).on("click", ".Listdiv1", function() {  // C Flag special window OK
            
            //var sta2 =$(this).find(".ListRate2").text().trim(); 
            $("#eventWorkConfirmA").popup('open');

        });

        $(document).on("click", "#eventWorkConfirmA .confirm", function() { // B window OK   

           // $('img.'+countrystatus).removeClass('nonstar_icon');
           // $('img.'+countrystatus).addClass('star_icon');  
            $("#eventWorkConfirmA").popup('close');
        });

        $(document).on("click", "#eventWorkConfirmA .cancel", function() {  // B window OK
            $("#eventWorkConfirmA").popup('close');

        });

        /********************************** Popup  *************************************/
        $(document).on("click", ".Listdiv1", function() {  // C Flag special window OK
           // $("#eventWorkConfirmB").popup('open');

        });

        $(document).on("click", "#eventWorkConfirmB .confirm", function() { // B window OK   
           // $('span.3'+countrystatus).removeClass('star_icon');
           // $('span.3'+countrystatus).addClass('nonstar_icon');
            $("#eventWorkConfirmB").popup('close');
        });

        $(document).on("click", "#eventWorkConfirmB .cancel", function() {  // B window OK
            $("#eventWorkConfirmB").popup('close');

        });

        /********************************** Popup  *************************************/
        $(document).on("click", "#popupA .popListdiv1", function() {  //.Listdiv1  
           //$("popListdiv1").css("background-color", "#FFFF30");
            var statuspop = $(this).find(".ListRate1popup").text().trim();
            FromStatus    = statuspop;

            if ((FromStatus =="All Currency") && (ToStatus =="All Currency")) 
            {                
                alert("NO!不可以喔!~");
                FromStatus    = "NTD";
            }
               
            $(".mainword1").text("From "+ FromStatus  +" to "+ ToStatus +" ");  
            $(".mainword3").text("Update on "+todayYear+"/"+todayMonth+"/"+todayDate);  
         
            $(".buttonone1").attr("src","img/tmp/"+ FromStatus +".png");
            $(".buttontwo1").attr("src","img/tmp/"+ ToStatus +".png");

            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);   
           
             Buttonimg();
                      

            $("#popupA").popup('close');

        });


        /********************************** dom event *************************************/


        $('#viewAccount').keypress(function(event) {

        });

    }
});
