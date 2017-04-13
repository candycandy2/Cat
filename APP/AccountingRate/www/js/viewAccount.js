
$("#viewAccount").pagecontainer({
    create: function(event, ui) {
        var statuscountrypop;
        var array =[ "GBP","AED","SGD","AUD"
                     ];

        var arrayadd =["NTD","EUR","AUD"
                      ];
        var arraycomb =[
                      ];
        
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


        todayYearmod  = todayYear;        

        var todayYearmod   = todayYearmod.toString().substring(2,4);   

        $(".frag1").text(MonthWord[todayMonth-1]+"-"+todayYearmod);
        $(".frag2").text(MonthWord[todayMonth-2]+"-"+todayYearmod);
        
      
        $(".mainword1").text("From "+ FromStatus +" to "+ToStatus+" ");  
        $(".mainword3").text("Updated on "+todayYear+"/"+todayMonth+"/"+todayDate);  
    //  Exception Img   **************************************************************************  



     


        /********************************** page event *************************************/
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {

           

        });

        $("#viewAccount").on("pageshow", function(event, ui) {
         //  
            Favorite();
            Buttonimg(); 
   
            var eventConfirmA = { 
                id: "eventWorkConfirmA",  
                content: $("template#tplAddConfirmA").html()
            };

      
        
            var eventConfirmB = {  
                id: "eventWorkConfirmB",        
                content: $("template#tplRemoveB").html()  
            };
             
            tplJS.Popup("viewAccount", "contentID", "append", eventConfirmA);  
            tplJS.Popup("viewAccount", "contentID", "append", eventConfirmB);

          /*201704test
            $("#popupA").popup( { dismissible : false});
            $("#popupB").popup( { dismissible : false });
          */   
        });    



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
                // Addhtml();  
        
                 Buttonimg(); 
        });
   //  Transfer   ************************************************************************** 
        function Buttonimg()    
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

        /********************************** Event *************************************/
        $(document).on("click", ".Listdiv1", function() {  // C Flag special window OK
                
            statuscountrypop = $(this).prop("id");
           
            if ($("#"+statuscountrypop).hasClass("favorite")) 
            {
                $("#eventWorkConfirmB").popup('open');
            }
            else 
            {
                $("#eventWorkConfirmA").popup('open');             
            }
        });


        /********************************** Popup *************************************/

        $(document).on("click", "#eventWorkConfirmA .confirm", function() { // B window OK   

            $("#"+statuscountrypop).children(".star_icon").css("opacity","1"); //li id 
            $("#"+statuscountrypop).children(".nonstar_icon").css("opacity","1");
            $("#"+statuscountrypop).addClass("favorite");


            Favorite();




            $("#eventWorkConfirmA").popup('close');
        });

        $(document).on("click", "#eventWorkConfirmA .cancel", function() {  // B window OK
            $("#eventWorkConfirmA").popup('close');

        });

        /********************************** Popup  *************************************/

        $(document).on("click", "#eventWorkConfirmB .confirm", function() { // B window OK   
            $("#"+statuscountrypop).children(".star_icon").css("opacity","0");  
            $("#"+statuscountrypop).children(".nonstar_icon").css("opacity","0");   
            $("#"+statuscountrypop).removeClass("favorite"); 


       

            $("#eventWorkConfirmB").popup('close');
        });

        $(document).on("click", "#eventWorkConfirmB .cancel", function() {  // B window OK
            $("#eventWorkConfirmB").popup('close');

        });

 
        /********************************** Popup  *************************************/
        $(document).on("click", "#popupA .popListdiv1", function() {  //.Listdiv1  
           

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

        /********************************** Popup *************************************/
        $(document).on("click", "#popupB .popListdiv1", function() {     //popListadd
           //$("popListdiv1").css("background-color", "#FFFF30");
            
            var statuspop = $(this).find(".ListRate1popup").text().trim(); //ListRate1popup
            ToStatus    =statuspop;
            if ((FromStatus =="All Currency") && (ToStatus =="All Currency")) 
            {                
                alert("NO!不可以喔!~");
                ToStatus    = "NTD";
            }
                 

            $(".mainword1").text("From "+ FromStatus  +" to "+ ToStatus +" ");  
            $(".mainword3").text("Update on "+todayYear+"/"+todayMonth+"/"+todayDate);  
         
            $(".buttonone1").attr("src","img/tmp/"+ FromStatus  +".png");
            $(".buttontwo1").attr("src","img/tmp/"+ ToStatus +".png");

            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);   
     
            
             Buttonimg();
            $("#popupB").popup('close');
        });
        /********************************** Favorite*************************************/
        function Favorite(){  
            //add
           
             /*
            for (var i=0 ; i< arrayadd.length; i++)
          
            {    statuscountrypop=arrayadd[i];
                {
                    $("#"+statuscountrypop).addClass("favorite");
                }
            }
          
           
           //check
            if ($("li").children(".favorite")) //use favorite to contrl star (not nontstar) 
            {
                $("li").children(".favorite").children(".star_icon").css("opacity","1"); //li id 
                $("li").children(".favorite").children(".nonstar_icon").css("opacity","1"); //li id 

            }       

         */
/*
            if ($(".Listdiv1").hasClass("favorite")) //use favorite to contrl star (not nontstar) 
            {
                $(".Listdiv1").children(".star_icon").css("opacity","1"); //li id 
                $(".Listdiv1").children(".nonstar_icon").css("opacity","1");

            }  
        
        
            if ($("#"+statuscountrypop).hasClass("favorite")) 
            {
                array.splice(array.indexOf(arrayadd)).sort();   
                array.splice(array.indexOf(statuscountrypop)).sort();      
                array.sort();
                arrayadd.unshift(statuscountrypop);
                arraycomb = arrayadd.concat(array);


                console.log("arrayinit_GBP-AED-SGD-AUD 3");
                console.log("arrayadd_NTD_EUR_AUD 3");
                console.log("283_array_"+array);
                console.log("306_arrayadd_"+arrayadd);
                console.log("307_arraycomb_"+arraycomb);
            }
    */
        }
        /********************************** dom event *************************************/


        $('#viewAccount').keypress(function(event) {

        });

    }
});
