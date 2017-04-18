
$("#viewAccount").pagecontainer({
    create: function(event, ui) {
       // First
        var FromStatus  = "All Currency";          
        var ToStatus    = "USD";


        // Sencod
        //var FromStatus  = "NTD";  
        //var ToStatus    = "All Currency";

        // One
        //var FromStatus  = "NTD";//var ToStatus  = "NTD";  


        var test;
        var statuscountrypop;
        //var array =[ "GBP","AED","SGD","AUD"       ];

        var array = ["AED","BDT","BRL","CAD",
                    "CHF","CZK","EUR","GBP","HKD",
                    "IDR","INR","JPY","KRW","MMK",
                    "MXN","MYR","NTD","NZD","PHP",
                    "RMB","RUB","SEK","SGD","THB",
                    "TRL","VND","ZAR" ]; 

        var arrayadd =["NTD","EUR","AUD"];
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
          //  Jsonparse(1);
            Test();         
            Buttonimg(); 

            //AddhtmlOne();
            AddhtmlFirst(); 
            //AddhtmlSecond(); 
   
            Favorite();   //wait for html

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
               AddhtmlFirst();
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
                AddhtmlSecond();

            }
            else
            {
              $(".buttontwo1").removeClass('buttononeFlag1non');
              $(".buttontwo1").addClass('buttononeFlag2');

            }            

            
            if ((FromStatus !="All Currency")&&(ToStatus !="All Currency"))
            {
                  AddhtmlOne();
            }

            //Favorite();
           // Test();

        }     

        /********************************** Event *************************************/
       // $(document).on("click", ".Listdiv1", function() {  //20170416 sunday ,modify
        $(document).on("click", ".select", function() {  //20170416 sunday ,modify for page2
               
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
            
           /*move 20170416
            arrayadd.push(statuscountrypop);//20170416
            array.splice(array.indexOf(statuscountrypop));

           */
            arrayadd.push(statuscountrypop);//20170416
            var a = array.indexOf(statuscountrypop);
            array.splice(a,1);
            //array.splice(array.indexOf(statuscountrypop),1);

            Test(); //reoragionize array
            //Buttonimg();//html reset => would be error

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

           //20170416
            arrayadd.splice (arrayadd.indexOf(statuscountrypop),1);
            array.push(statuscountrypop);
            Test(); 

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
             Favorite();         

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
             Favorite();
            $("#popupB").popup('close');
        });
        /********************************** Favorite*************************************/
        function Test(){
           /*move 20170416
            

            */
            //array.splice (arrayadd.indexOf(arrayadd));           
            
            arraycomb = arrayadd.concat(array);   
            Buttonimg(); //20170416
            Favorite();  //20170416
        }


        function Favorite(){  
            //Get] Initial  from array and add to the id 
            for (var i=0 ; i< arrayadd.length; i++)
          
            {    statuscountrypop = arrayadd[i];
                {
                    $("#"+statuscountrypop).addClass("favorite");
                    // 20170416 
                    // arrayadd

                }
            }


            //Favorite//click//html       
           //check for show 
            if ($("li").children(".favorite")) //use favorite to contrl star (not nontstar) 
            {
                $("li").children(".favorite").children(".star_icon").css("opacity","1"); //li id 
                $("li").children(".favorite").children(".nonstar_icon").css("opacity","1"); //li id 

            } 
           
      
        }

     /********************************** html *************************************/
        function AddhtmlOne()           
        {   
            var htmltemp = "";               
            for (var i=0 ; i< 1; i++){ //array initial.lenggth
                           
                var country  = 'Candy';
                var index    = "";                       
                content  = htmltemp + CountrylisthtmlOne(i ,country);
                 htmltemp = content;  
            }                      
            $("#ultestA").html(" "); 
            $("#ultestA").append(content);                    
        }


        function AddhtmlFirst()     //First is All    
        {   
            var htmltemp = "";               
            for (var i=0 ; i< arraycomb.length; i++)
            { 
                var country = 'Candy';                   
                var index    = "";
                content  = htmltemp + CountrylisthtmlFirst(i ,country);
                htmltemp = content;           
            }  
            $("#ultestA").html(" "); 
            $("#ultestA").append(content);            
        }

        function AddhtmlSecond()      //Second is All     
        {                
            var htmltemp = "";               
            for (var i=0 ; i< arraycomb.length; i++){ 
                    var country = 'Candy';                    
                    var index    = "";
                    content  = htmltemp + CountrylisthtmlSecond(i ,country);
                    htmltemp = content;               
            }                
            $("#ultestA").html(" "); 
            $("#ultestA").append(content);            
        }
     /********************************** html  *************************************/
        function CountrylisthtmlOne(index){// one to one
                    return '<li data-icon="false" class="1_li CountryA" id="litest">'
                    +'<div class="Listdiv1 select" id='
                    + FromStatus
                    +'>'
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '  
                    +'<img  class="ListviewFlag1" src ="img/tmp/'
                    + FromStatus
                    +'.png"> '        
                    +'<span class="ListRate1">'                
                    +'1 '
                    + FromStatus
                    +'</span>  '        
                    +'<div  class="Listdiv1equalmark4">=</div>'
                    +'</div>'
                    +'<div class="Listdiv2">'       
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '        
                    +'<img  class="ListviewFlag2" src ="img/tmp/'
                    + ToStatus 
                    +'.png">'                   
                    +'<div class="Listdiv3">'    
                    +'<span class="ListDollar1" >10.032 </span> '    
                    +'<span class="ListRate2">'
                    + ToStatus 
                    +'</span>'    
                    +'<br> '    
                    +'</div>'    
                    +'</div>'   
                    +'</li>' ;                     
                    
        }

        function CountrylisthtmlFirst(index,country){ //First is all
                    return '<li data-icon="false" class="1_li CountryA" id="litest">'
                    +'<div class="Listdiv1 select" id='
                    + arraycomb[index]
                    +'>'
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '  
                    +'<img  class="ListviewFlag1" src ="img/tmp/'
                    + arraycomb[index]
                    +'.png"> '        
                    +'<span class="ListRate1">'                
                    +'1 '
                    + arraycomb[index]
                    +'</span>  '        
                    +'<div  class="Listdiv1equalmark4">=</div>'
                    +'</div>'
                    +'<div class="Listdiv2">'       
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '        
                    +'<img  class="ListviewFlag2" src ="img/tmp/'
                    + ToStatus 
                    +'.png">'                   
                    +'<div class="Listdiv3">'    
                    +'<span class="ListDollar1" >10.032 </span> '    
                    +'<span class="ListRate2">'
                    + ToStatus 
                    +'</span>'    
                    +'<br> '    
                    +'</div>'    
                    +'</div>'   
                    +'</li>';              
                    +'<hr>';                         
        }

        function CountrylisthtmlSecond(index,country){//Second is all
                    return '<li data-icon="false" class="1_li CountryA firstli" id="litest">'
                    +'<div class="Listdiv1" id='
                    +
                    +'>'
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '  
                    +'<img  class="ListviewFlag1" src ="img/tmp/'
                    + FromStatus
                    +'.png"> '        
                    +'<span class="ListRate1">'                
                    +'1 '
                    + FromStatus
                    +'</span>  '        
                    +'<div  class="Listdiv1equalmark4">=</div>'
                    +'</div>'
                    +'<div class="Listdiv2 select" id='
                    + arraycomb[index]
                    +'>'       
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '        
                    +'<img  class="ListviewFlag2" src ="img/tmp/'
                    + arraycomb[index] 
                    +'.png">'                   
                    +'<div class="Listdiv3">'    
                    +'<span class="ListDollar1" >10.032 </span> '    
                    +'<span class="ListRate2">'
                    + arraycomb[index]
                    +'</span>'    
                    +'<br> '    
                    +'</div>'    
                    +'</div>'   
                    +'</li>' ;   
                    /*+'<br>'
                    +'<br>'
                    +'<hr>';
                    */         
        }



        /********************************** html *************************************/
        /********************************** dom event *************************************/

        /********************************** API*************************************/

        //Initial , pop
        function Jsonparse(Jsonflag) {
            var packJson =[

                { 
                    "From_Currency" : "AED",
                    "To_Currency"   : "NTD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "8.3523"
                },

                { 
                    "From_Currency" : "EUR",
                    "To_Currency"   : "RUB", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "61.134"
                },

                { 
                    "From_Currency" : "AED",
                    "To_Currency"   : "USD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "61.134"
                },

                { 
                    "From_Currency" : "AED",
                    "To_Currency"   : "EUR", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "61.134"
                }, 

                { 
                    "From_Currency" : "NTD",
                    "To_Currency"   : "USD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "8"
                },

                { 
                    "From_Currency" : "NTD",
                    "To_Currency"   : "EUR", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "2"
                }, 
                { 
                    "From_Currency" : "NTD",
                    "To_Currency"   : "CAD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "2"
                } 
            ];

            var arraygetrate    =[];
            var arraygetFrom    =[];
            var arraygetTo      =[];
            var cleartest       = 0;

           /* if (cleartest == "1"){
                  array=[];
                  arrayTo=[];
                  arraygetrate=[];
                    // array.length        = 0;          //clear  to put country
                    //arrayTo.length      = 0;          //clear  to put country
                    //arraygetrate.length = 0;          //clear  rate 
                    //if ((getfrom == "EUR") &&(getto =="RUB"))
                }
            */

                for (var i=0; i<packJson.length; i++){

                    getrate     = packJson[i].Ex_Rate;   //variable
                    getfrom     = packJson[i].From_Currency;
                    getto       = packJson[i].To_Currency;
                  
                    arraygetFrom.push(getfrom);    //variable to array 
                    arraygetTo.push(getto);    

                   //clear for array and rate 

                if (FromStatus =="All Currency")
                {

                }
               

                if (ToStatus =="All Currency")
                {   // Bug for img show 
                  
                    
                }
                         
                
                if ((FromStatus !="All Currency")&&(ToStatus !="All Currency"))
                {
                     
                }

               //if (Jsonflag == 1) //From =All    TO =NTD
               {
                    if ((getto == ToStatus) && (getto != ToStatus))                   
                    {  //To checked , From all save
                      array.push(getfrom);                            // AddhtmlFirst(); 
                      arraygetrate.push(getrate);       
                    }
               }

               if (Jsonflag == 2) //To =All  then save from   From NTD
               {
                    if ((getfrom == FromStatus) && (getto != FromStatus))
                    {  //From checked , To all save
                     arrayTo.push(getto);               // AddhtmlSecond();  i1 = usa , i2 =EUR 
                     arraygetrate.push(getrate);        //                   i1 =5    , i2 =2
                     var test = arraygetrate;
                    }
               }   
               if (Jsonflag == 0)
               { 
                    if ((getfrom == FromStatus) && (getto ==ToStatus)) //FromStatus   ToStatus 
                    {  //Json data i item == FromStatus
                      arraygetrate.push(getrate);                      // AddhtmlOne();
                    }
               }  
            }
            //for loop
            cleartest == "1";
        }

 
        /********************************** API*************************************/


        $('#viewAccount').keypress(function(event) {

        });

    }

     /********************************** API*************************************/
    /*
     function getEventList(eventType) {//getEventList

            eventType = eventType || null;
            var self = this;

            //queryData Type: (According to Dropdown List [Event Type])
            //value:0 [All Event] >       <emp_no>0407731</emp_no>
            //value:1 [undone Event] >    <event_status>0</event_status><emp_no>0407731</emp_no>
            //value:2 [done Event] >      <event_status>1</event_status><emp_no>0407731</emp_no>
            //value:3 [emergency Event] > <event_type_parameter_value>1</event_type_parameter_value><emp_no>0407731</emp_no>
            //value:4 [normal Event] >    <event_type_parameter_value>2</event_type_parameter_value><emp_no>0407731</emp_no>
            var queryDataParameter = "<emp_no>" + loginData["emp_no"] + "</emp_no>";

            if (eventType === "1") {
                queryDataParameter = "<event_status>0</event_status>" + queryDataParameter;
            } else if (eventType === "2") {
                queryDataParameter = "<event_status>1</event_status>" + queryDataParameter;
            } else if (eventType === "3") {
                queryDataParameter = "<event_type_parameter_value>1</event_type_parameter_value>" + queryDataParameter;
            } else if (eventType === "4") {
                queryDataParameter = "<event_type_parameter_value>2</event_type_parameter_value>" + queryDataParameter;
            }

            //var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";


            var queryData = "";//UTD

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];
                var chatroomIDList = [];

                if (resultCode === 1) {
                    $(".event-list-no-data").hide();

                    eventListData = data['Content'];

                    for (var i=0; i<data['Content'].length; i++) {
                        //Chatroom ID
                        if (data['Content'][i].chatroom_id !== null && data['Content'][i].chatroom_id.length != 0) {
                            chatroomIDList.push(data['Content'][i].chatroom_id);
                        }
                    }

                    //Update Message Count
                    getMessageCount(chatroomIDList);

                } 


            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getEventList", self.successCallback, self.failCallback, queryData, "");
            }();

        }
        */
    /********************************** API*************************************/
});
