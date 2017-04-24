
$("#viewAccount").pagecontainer({
    create: function(event, ui) {
       // First
        var FromStatus  = "All Currency";          
        var ToStatus    = "USD";

        var tabActiveIDs = "#fragment-1";
        // Sencod
        //var FromStatus  = "NTD";  
        //var ToStatus    = "All Currency";
        // One
        //var FromStatus  = "NTD";//var ToStatus  = "NTD";  
        var test;
        var statuscountrypop;
        var statuscountryrate;
        /*var array = [
                     "AED","BDT","BRL","CAD",
                     "CHF","CZK","EUR","GBP","HKD",
                     "IDR","INR","JPY","KRW","MMK",
                     "MXN","MYR","NTD","NZD","PHP",
                     "RMB","RUB","SEK","SGD","THB",
                     "TRL","VND","ZAR" ]; 

         ar arrayRate =[
                    "1","2","3","4","5",
                    "6","7","8","9","10",
                    "11","12","13","14","15",
                    "16","17","18","19","20",
                    "21","22","23","24","25",
        ];
        */

        var array     = [    ];   
        var arrayRate = [    ];     

        var arrayadd =["NTD","USD","EUR"];//,"EUR","AUD"
        //var arrayadd            =[];
        var arrayaddtemp        =[];
        var arrayrateadd        =[];
        var arrayratecomb       =[];
        var arrayratecomb       =[];
        var packJsontemp        =[];

                          
        
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
        var MonthWord   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var todayYear   = Today.getFullYear();
        var todayMonth  = Today.getMonth()+1;
        var todayDate   = Today.getDate();
        var lastMonth   = Today.getMonth();

        window.UTC = Math.round(Date.UTC(todayYear,todayMonth-3,todayDate)/1000);

        var nowTimstamp = window.Today.TimeStamp();
        //var Jsonflagnow ='3'; //todayMonth
        window.Jsonflagnow = todayMonth; 
    


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
            
            
            //var EventList = new GetAccountingRate(); //add for test 20170418 API 


        });

        $("#viewAccount").on("pageshow", function(event, ui) {
         //  
           Jsonparse(1);
            //Jsonparse(1);
            //Test();         
            //Buttonimg(); 

            //AddhtmlOne();
            //AddhtmlFirst(); 
            //AddhtmlSecond(); 
   
            //Favorite();   //wait for html

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
                 Jsonparse(1); 
                 Buttonimg(); 
                 //Favorite();  //bugfix
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
        //$(document).on("tabsactivate", "#tabevent", function(event,ui) { 
        
         $(document).on("tabsactivate", function(event,ui) { 
            tabActiveIDs = ui.newPanel.selector;
         
            if (ui.newPanel.selector === "#fragment-1"){
                /*
                Jsonflagnow =todayMonth-1;  
                */ 
                Jsonflagnow =todayMonth;
                //Favorite();
                Jsonparse(1);            
                //Buttonimg(); 
                console.log("tab1");

            }
            else if (ui.newPanel.selector === "#fragment-2"){
                 /*
                Jsonflagnow =todayMonth;
                 */
                Jsonflagnow =todayMonth-1;
                //Favorite();//20170424test
                Jsonparse(1);
                //Buttonimg(); 
                console.log("tab2");
            }

         });
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
            /*var a = array.indexOf(statuscountrypop);
            array.splice(a,1);
            */

            statuscountryrate = $("#"+statuscountrypop).parent().find(".ListDollar1").text(); //20160421
            arrayrateadd.push(statuscountryrate);
            
            /*20170422
            arrayrateadd =.push(statuscountryrate);
            var b = arrayrate.indexOf(statuscountryrate);
            arrayrate.splice(b,1);
            */


            //arrayrateadd.push(statuscountrypop);
            //$("#"+statuscountrypop).parent()(".star_icon").css("opacity","1"); 
            //$("#NZD").next().children(".Listdiv3").children(".ListDollar1").text()
           
            //var b= $("#"+statuscountrypop).next().children(".Listdiv3").children(".ListDollar1").text();//20160421
            
            /*20170421 
            var b= $("#"+statuscountrypop).parent().find(".ListDollar1").text(); //20160421
            */

            //$("#NTD").parent().children(".Listdiv3").children("ListDollar1").text();
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

            statuscountryrate = $("#"+statuscountrypop).parent().find(".ListDollar1").text(); 
           //20170416
            arrayadd.splice (arrayadd.indexOf(statuscountrypop),1);
            arrayrateadd.splice(arrayrateadd.indexOf(statuscountryrate),1);
            //array.push(statuscountrypop);


   
            /*20170422 follow       
               arrayrateadd.splice(arrayadd.indexOf(statuscountryrate),1);

            */


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
                alert("NO!不可以喔!~ ^-^ ");
                FromStatus    = "NTD";
            }
               
            $(".mainword1").text("From "+ FromStatus  +" to "+ ToStatus +" ");  
            $(".mainword3").text("Update on "+todayYear+"/"+todayMonth+"/"+todayDate);  
         
            $(".buttonone1").attr("src","img/tmp/"+ FromStatus +".png");
            $(".buttontwo1").attr("src","img/tmp/"+ ToStatus +".png");

            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);   
           
             Jsonparse(1);
             //Test();  

             //Buttonimg();
             //Favorite();         

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
     
             Jsonparse(1);
             //Test(); 

             //Buttonimg();
             //Favorite();
            $("#popupB").popup('close');
        });
        /********************************** Favorite*************************************/
        function Test(){
           /*move 20170416
            
            var arrayadd =["NTD","EUR","AUD"];
            */
            /* 20170419 Issue 
           
            for (var j=0 ; j< arrayadd.length; j++)//3 
            {  for (var i=0 ; i< array.length; i++)//29 if it doesn't have one? 
          
                {   if ( array[i] = arrayadd[j])
                    {
                        //array[i] delete 
                    array.splice(array.indexOf(arrayadd[j]),1);
                    //arrayaddtemp
                    arrayrateadd.push(arrayRate[i]);

                    } 
                }
            }
            */

            //array.splice (arrayadd.indexOf(arrayadd));           
         
            arraycomb      = arrayadd.concat(array.sort()); 
            arrayratecomb  = arrayrateadd.concat(arrayRate); // would ot match the country 
            console.log("908 "+arrayrateadd);

            Buttonimg(); //20170416
           // Favorite();  //20170416
        }


        function Favorite(){            

            //Get] Initial  from array and add to the id 
            for (var i=0 ; i< arrayadd.length; i++)
          
            {    statuscountrypop = arrayadd[i];
                {
                   // $("#"+statuscountrypop).addClass("favorite");
                    $("."+statuscountrypop).addClass("favorite");
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

           

            if (tabActiveIDs  === "#fragment-1")
            {
                //Jsonparse(4);
                $("#ultestA").html(" "); 
                $("#ultestA").append(content);  
                Favorite();


            }
            if (tabActiveIDs  === "#fragment-2"){
                //Jsonparse(3);
                $("#ultestB").html(" "); 
                $("#ultestB").append(content); 
                Favorite();

            } 
                     
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
            if (tabActiveIDs  === "#fragment-1")
            {
                $("#ultestA").html(" "); 
                $("#ultestA").append(content);  
                Favorite();//add for test 20170424

            }
              

           
            if (tabActiveIDs  === "#fragment-2"){
                $("#ultestB").html(" "); 
                $("#ultestB").append(content);   
                Favorite();//add for test 20170424

            } 
                    
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

            if (tabActiveIDs  === "#fragment-1")
            {
                $("#ultestA").html(" "); 
                $("#ultestA").append(content);    //insert month
                Favorite();//add for test 20170424
            }
         
            if (tabActiveIDs  === "#fragment-2"){
                $("#ultestB").html(" "); 
                $("#ultestB").append(content);    //insert month  
                Favorite();//add for test 20170424
            } 
                
        }
     /********************************** html  *************************************/
        function CountrylisthtmlOne(index){// one to one
                    return '<li data-icon="false" class="1_li CountryA" id="litest">'
                    //+'<div class="Listdiv1 select" id='
                    //+ FromStatus
                    //+'>'


                    +'<div class="Listdiv1 select ' 
                    + FromStatus
                    +'"'
                    +'id='
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
                    +'<span class="ListDollar1" >'
                    + arrayRate[index]
                    //+ 10.032 
                    +'</span> '    
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
                    //+'<div class="Listdiv1 select" id='
                    //+ arraycomb[index]
                    +'<div class="Listdiv1 select ' 
                    + arraycomb[index]
                    +'"'
                    +'id='
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
                    +'<span class="ListDollar1" >'
                    + arrayratecomb[index] 
                   // + arrayRate[index] 
                   // +'10.032'
                    +'</span> '    
                    +'<span class="ListRate2">'
                    + ToStatus 
                    +'</span>'    
                    +'<br> '    
                    +'</div>'    
                    +'</div>'   
                    +'</li>';         
        }

        function CountrylisthtmlSecond(index,country){//Second is all
                    return '<li data-icon="false" class="1_li CountryA" id="litest">'
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
                    
                    +'<div class="Listdiv2 select ' 
                    + arraycomb[index]
                    +'"'
                    +'id='
                    + arraycomb[index]

                    +'>'
                    //+'<div class="Listdiv2 select" id='
                    //+ arraycomb[index]
                    //+'>'       
                    +'<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '        
                    +'<img  class="ListviewFlag2" src ="img/tmp/'
                    + arraycomb[index] 
                    +'.png">'                   
                    +'<div class="Listdiv3">'    
                    +'<span class="ListDollar1" >'
                   // + arrayRate[index] 
                    + arrayratecomb[index] 
                    // +'10.032'
                    +'</span> '    
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

        function Pophtmlfirst(){ //0422 for prepare
                    return '<li data-icon="false" class="1_li CountryA" id="litest">'
                    +'<div class="Listdiv1" id='
                    +'</li>' ;   
                 
        }

        function Pophtmlnext(){
                    return '<li data-icon="false" class="1_li CountryA" id="litest">'
                    +'<div class="Listdiv1" id='             
                    +'</div>'   
                    +'</li>' ;   
     
        }
        /********************************** html *************************************/
        /********************************** dom event *************************************/

        /********************************** API*************************************/
  
        //Initial , pop
        function Jsonparse(Jsonflag) {
            //packJsontemp = []; 
            var EventList = new GetAccountingRate();  //20170420 5pm mark for test 
            //window.setTimeout(sleepgo,10000);
            // window.setTimeout(Jsonparsenext,3000);
            //sleep(10000);         
            //Jsonparsenext(Jsonflag);  // 20170421
        }

        function sleep(milliseconds) {
          var start = new Date().getTime();
          for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds){
              break;
            }
          }
        }

        function Jsonparsenext(Jsonflag) {        


            var packJson = packJsontemp ;

            if (packJsontemp == 0) //test for data from back 
                { console.log("621packJsontemp NO");}
            else  
                { console.log("621packJsontemp OK");}
           // var packJson  = data["Content"]; //API
            /*
            var packJson =[

                {   //var arrayadd =["NTD","EUR","AUD"];
                    "From_Currency" : "AED",
                    "To_Currency"   : "USD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "61.134"
                },

                { 
                    "From_Currency" : "NTD",//
                    "To_Currency"   : "USD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "0.0333"
                },
                { 
                    "From_Currency" : "NTD",//
                    "To_Currency"   : "USD", 
                    "Ex_Date"       : "2017/4/1",
                    "Ex_Rate"       : "0.035"
                },

                { 
                    "From_Currency" : "USD",
                    "To_Currency"   : "NTD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "31.125"
                },
                { 
                    "From_Currency" : "USD",
                    "To_Currency"   : "AED", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "0.001"
                },

                { 
                    "From_Currency" : "AED",
                    "To_Currency"   : "EUR", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "61.134"
                }, 

                { 
                    "From_Currency" : "AED",
                    "To_Currency"   : "NTD", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "8.3523"
                },

                { 
                    "From_Currency" : "EUR",//
                    "To_Currency"   : "RUB", 
                    "Ex_Date"       : "2017/3/1",
                    "Ex_Rate"       : "61.134"
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

        */

                arrayRate           = ["undefine"]; 
                var arraygetrate    = [];
                var arraygetFrom    = [];
                var arraygetTo      = [];
                var cleartest       = 0;
                arrayrateadd    = [];   //but add not clear re to next time 
                //arrayadd auto find arrayrateadd

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

                for (var i=0; i<packJson.length; i++)
                {

                    getrate     = packJson[i].Ex_Rate;   //variable
                    getfrom     = packJson[i].From_Currency;
                    getto       = packJson[i].To_Currency;
                    exdate      = packJson[i].Ex_Date;
                      //variable to array 
                    console.log('i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate);  
                    //arraygetTo.push(getto);    

                   //clear for array and rate 
//Jsonflagnow
                    //if ((FromStatus =="All Currency")&&(exdate =='2017/03/01'))
                    if ((FromStatus =="All Currency")&&(exdate =='2017/0'+Jsonflagnow+'/01'))
                     //First &&(Ex_Date =='2017/3/1')
                     //First &&(Ex_Date =='2017/'++'/1')
                    { 
                        if (getto == ToStatus) //To NTD 's  ; from save
                            {
                                arraygetFrom.push(getfrom);       
                                arraygetrate.push(getrate);  
                                console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate); 
                                array     = arraygetFrom;
                                arrayRate = arraygetrate;
                                //change
                            }
                            //
                    }
                    //array= arraygetFrom;
                    //Buttonimg();

                    
                    //else if ((ToStatus =="All Currency")&&(exdate =='2017/03/01'))//Second 
                    else if ((ToStatus =="All Currency")&&(exdate =='2017/0'+Jsonflagnow+'/01'))//Second 
                    {   // Bug for img show 
                      
                        if (getfrom == FromStatus) // NTD 's from save
                            {
                                arraygetTo.push(getto);      
                                arraygetrate.push(getrate);
                                console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate);   

                                array= arraygetTo;
                                arrayRate= arraygetrate;
                                //change
                            }
                        
                    }
                                             
                    else if ((FromStatus != "All Currency")&&(ToStatus !="All Currency"))
                    {
                        
                        if ((getfrom == FromStatus)&&(getto ==ToStatus)&&(exdate =='2017/03/01')) //FromStatus   ToStatus 
                            {  //Json data i item == FromStatus
                              arraygetrate.push(getrate);                  
                              arrayRate= arraygetrate;     //issue for last rate 20170421
                              console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate); 
                             

                             //if arrayRate

                            }

                        /*if ((getfrom == FromStatus)&&(getto ==ToStatus)&&(exdate =='2017/03/01'))   
                            {
                                arrayRate= ["undefine"];   

                            }
                         */         
                    } 

                 
                }
             

               
               /*4/22

                for (var i=0; i<arrayadd.length; i++)  //NTD USA
                {
                  var statuscountryrate = $("#"+arrayadd[i]).parent().find(".ListDollar1").text(); 
                  arrayrateadd.push(statuscountryrate);
                }
              
               */ 
             
               for (var i=0; i<arrayadd.length; i++)  //NTD USA //renew for rate //pop for head
                {
                  var rateindex = array.indexOf(arrayadd[i]);
                  var ratetemp  = arrayRate[rateindex];
                  
                  if (rateindex > 0) 
                    { 
                        arrayrateadd.push(ratetemp);
                        console.log("908 "+arrayrateadd);
                    } //renew for rate 3.9158 
                      
                  else if (rateindex < 0)
                    {
                        arrayrateadd.push("undefine");
                    }                
                }

                

                Test();         
                Buttonimg();                 
              

        }

  
 
        /********************************** API*************************************/


        $('#viewAccount').keypress(function(event) {

        });

 

     /********************************** API*************************************/
   
     function GetAccountingRate(eventType) {//getEventList  //Unexpected token function 717 - 62

            eventType = eventType || null;
            var self = this;

            //queryData Type: (According to Dropdown List [Event Type])
            //value:0 [All Event] >       <emp_no>0407731</emp_no>
            //value:1 [undone Event] >    <event_status>0</event_status><emp_no>0407731</emp_no>
            //value:2 [done Event] >      <event_status>1</event_status><emp_no>0407731</emp_no>
            //value:3 [emergency Event] > <event_type_parameter_value>1</event_type_parameter_value><emp_no>0407731</emp_no>
            //value:4 [normal Event] >    <event_type_parameter_value>2</event_type_parameter_value><emp_no>0407731</emp_no>
          
           // var queryDataParameter = "<Last_update_date>" + '1492570457' + "</Last_update_date>";
        
           //var queryDataParameter = "<Last_update_date>" +  UTC + "</Last_update_date>";
            var queryDataParameter = "<Last_update_date>" + '1483356362' + "</Last_update_date>";
        

            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            console.log("UTC_"+UTC);
            //var queryData = "999";//UTD

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];
                var chatroomIDList = [];
                console.log('APIreturn _'+resultCode);

                if (resultCode == 1) {      //20170420
                    $(".event-list-no-data").hide();

                   // eventListData = data['Content'];
                    packJsontemp  = data['Content']; //API
                    console.log(packJsontemp);//not show
                    
                     
                    Jsonparsenext(1);  

                    /*for (var i=0; i<data['Content'].length; i++) {
                        //Chatroom ID
                        if (data['Content'][i].chatroom_id !== null && data['Content'][i].chatroom_id.length != 0) {
                            chatroomIDList.push(data['Content'][i].chatroom_id);
                        }
                    }
                    */
                    //Update Message Count
                    //getMessageCount(chatroomIDList);

                } 


            };

            this.failCallback = function(data) { 


            };

            var __construct = function() {
                CustomAPI("POST", true, "GetAccountingRate", self.successCallback, self.failCallback, queryData, "");
            }();

        }//function getEventList(eventType)
      
    }  
    
    /********************************** API*************************************/
});
