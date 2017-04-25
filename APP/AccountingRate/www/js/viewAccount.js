
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


        //var arrayadd =["NTD","USD","EUR"];//,"EUR","AUD"
        var arrayadd            =[];
        var arrayaddtemp        =[];
        var arrayrateadd        =[];
        var arraycomb           =[];
        var arrayratecomb       =[];
        var packJsontemp        =[];

                          
        
        /********************************** function *************************************/
        window.APIRequest = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
         
            };

            this.failCallback = function(data) {};

            var __construct = function() {             
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
            
            Jsonparse(1);
          
        });

        $("#viewAccount").on("pageshow", function(event, ui) {
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
                 $(".buttononeCountry1").html(tmpsetT);  
                 $(".buttononeCountry2").html(tmpsetF);
               
                 $(".buttonone1").attr("src","img/tmp/"+tmpsetT +".png");
                 $(".buttontwo1").attr("src","img/tmp/"+tmpsetF+".png");             
              
                 FromStatus = tmpsetT;
                 ToStatus =  tmpsetF ;
                 $(".mainword1").text("From "+ FromStatus  +" to "+ ToStatus  +" ");  
                
                 Jsonparsenext(1);                
                 Buttonimg();                
        });
   //  Transfer   ************************************************************************** 
        function Buttonimg()    
        {   
            $(".buttonone1").attr("src","img/tmp/"+ FromStatus  +".png");
            $(".buttontwo1").attr("src","img/tmp/"+ ToStatus +".png");

            if (FromStatus =="All Currency")
             {   
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
            {   
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


        }     
        /********************************** Event *************************************/
        //$(document).on("tabsactivate", "#tabevent", function(event,ui) { 
        
         $(document).on("tabsactivate", function(event,ui) { 
            tabActiveIDs = ui.newPanel.selector;
         
            if (ui.newPanel.selector === "#fragment-1"){              
                Jsonflagnow =todayMonth;               
                Jsonparsenext(1);                 
            }
            else if (ui.newPanel.selector === "#fragment-2"){               
                Jsonflagnow =todayMonth-1;               
                Jsonparsenext(1);                             
            }

         });
        /********************************** Event *************************************/
       // $(document).on("click", ".Listdiv1", function() {  //20170416 sunday ,modify
        $(document).on("click", ".select", function() {  //20170416 sunday ,modify for page2
           

                /* 20170425 mark for test
            statuscountrypop = $(this).prop("id");
           
          
            
          
            if ($("#"+statuscountrypop).hasClass("favorite")) 
            {
                $("#eventWorkConfirmB").popup('open');
            }
            else 
            {
                $("#eventWorkConfirmA").popup('open');             
            }

              */
        });


        /********************************** Popup *************************************/

        $(document).on("click", "#eventWorkConfirmA .confirm", function() { // B window OK   

           
            $("#"+statuscountrypop).children(".star_icon").css("opacity","1"); //li id 
            $("#"+statuscountrypop).children(".nonstar_icon").css("opacity","1");
            $("#"+statuscountrypop).addClass("favorite");
            
           
            arrayadd.push(statuscountrypop);//20170416
            

            statuscountryrate = $("#"+statuscountrypop).parent().find(".ListDollar1").text(); //20160421
            arrayrateadd.push(statuscountryrate);


              Test(); //reoragionize array
            //Buttonimg();//html reset => would be error

            $("#eventWorkConfirmA").popup('close');
             /*20170424 8pm   */



            /*var a = array.indexOf(statuscountrypop);
            array.splice(a,1);
            */


            /*move 20170416
            arrayadd.push(statuscountrypop);//20170416
            array.splice(array.indexOf(statuscountrypop));

           */

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
          
            arrayadd.splice (arrayadd.indexOf(statuscountrypop),1);
            arrayrateadd.splice(arrayrateadd.indexOf(statuscountryrate),1);
            Test(); 
            $("#eventWorkConfirmB").popup('close');
            /*20170424 8:pm  */

            //20170416
            //array.push(statuscountrypop);


   
            /*20170422 follow       
               arrayrateadd.splice(arrayadd.indexOf(statuscountryrate),1);

            */
           
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
            
             Jsonparsenext(1);         
             

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
     
             Jsonparsenext(1);

         
            $("#popupB").popup('close');
        });
        /********************************** Favorite*************************************/
        function Test(){
            arraycomb      = arrayadd.concat(array.sort());        
            //array.splice (arrayadd.indexOf(arrayadd));          
            
            arrayratecomb  = arrayrateadd.concat(arrayRate);
            Buttonimg();       
            Favorite();    
        }


        function Favorite(){            

            
            //Get] Initial  from array and add to the id 
            for (var i=0 ; i< arrayadd.length; i++)
          
            {    statuscountrypop = arrayadd[i];
                {
                    $("#"+statuscountrypop).addClass("favorite");
                   // $("."+statuscountrypop).addClass("favorite");
             

                }
            }

            if ($("li").children(".favorite")) //use favorite to contrl star (not nontstar) 
            {
                $("li").children(".favorite").children(".star_icon").css("opacity","1"); //li id 
                $("li").children(".favorite").children(".nonstar_icon").css("opacity","1"); //li id 

            } 
           /* 0425 */

      
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
        
                $("#ultestA").html(" "); 
                $("#ultestA").append(content);  
                $("#ultestB").html(" "); 
                Favorite();//add for test 20170424

            }
            if (tabActiveIDs  === "#fragment-2"){
         
                $("#ultestB").html(" "); 
                $("#ultestB").append(content); 
                $("#ultestA").html(" "); 
                Favorite();

            } 
                     
        }


        function AddhtmlFirst()    
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
                $("#ultestB").html(" "); 
                Favorite();//add for test 20170424

            }
              

           
            if (tabActiveIDs  === "#fragment-2"){
                $("#ultestB").html(" "); 
                $("#ultestB").append(content);   
                $("#ultestA").html(" "); 
                Favorite();//add for test 20170424

            } 
                    
        }

        function AddhtmlSecond()      
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
                $("#ultestA").append(content);    
                $("#ultestB").html(" "); 
                Favorite();

            }
         
            if (tabActiveIDs  === "#fragment-2"){
                $("#ultestB").html(" "); 
                $("#ultestB").append(content);    //insert month  
                $("#ultestA").html(" "); 
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
         
        function Jsonparse(Jsonflag) {          
            var EventList = new GetAccountingRate();  
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
          

                arrayRate           = ["undefine"]; 
                var arraygetrate    = [];
                var arraygetFrom    = [];
                var arraygetTo      = [];
                var cleartest       = 0;
                arrayrateadd    = [];              
           

                for (var i=0; i<packJson.length; i++)
                {
                    getrate     = packJson[i].Ex_Rate;   
                    getfrom     = packJson[i].From_Currency;
                    getto       = packJson[i].To_Currency;
                    exdate      = packJson[i].Ex_Date;

                    if ((FromStatus =="All Currency")&&(exdate =='2017/0'+Jsonflagnow+'/01'))        
                    { 
                        if (getto == ToStatus) 
                            {
                                arraygetFrom.push(getfrom);       
                                arraygetrate.push(getrate);  
                               
                                array     = arraygetFrom;
                                arrayRate = arraygetrate;
                                console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate); 
                            }
                    }
                 
                    else if ((ToStatus =="All Currency")&&(exdate =='2017/0'+Jsonflagnow+'/01'))
                    {   
                      
                        if (getfrom == FromStatus) 
                            {
                                arraygetTo.push(getto);      
                                arraygetrate.push(getrate);
                               
                                array= arraygetTo;
                                arrayRate= arraygetrate;
                                console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate); 
                            }                        
                    }
                                             
                    else if ((FromStatus != "All Currency")&&(ToStatus !="All Currency"))
                    {                        
                        if ((getfrom == FromStatus)&&(getto ==ToStatus)&&(exdate =='2017/0'+Jsonflagnow+'/01')) //FromStatus   ToStatus 
                            {  
                                arraygetrate.push(getrate);                  
                                arrayRate= arraygetrate;     //issue for last rate 20170421
                                console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate); 
                            }
                    } 
                }
             
               
             
                for (var i=0; i<arrayadd.length; i++)  
                {
                      var rateindex = array.indexOf(arrayadd[i]);
                      var ratetemp  = arrayRate[rateindex];                      
                      if (rateindex > 0) 
                        { 
                            arrayrateadd.push(ratetemp);
                        }                           
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
   
     function GetAccountingRate(eventType) {

            eventType = eventType || null;
            var self = this;

            //queryData Type: (According to Dropdown List [Event Type])
            //value:0 [All Event] >       <emp_no>0407731</emp_no>
            //value:1 [undone Event] >    <event_status>0</event_status><emp_no>0407731</emp_no>
            //value:2 [done Event] >      <event_status>1</event_status><emp_no>0407731</emp_no>
            //value:3 [emergency Event] > <event_type_parameter_value>1</event_type_parameter_value><emp_no>0407731</emp_no>
            //value:4 [normal Event] >    <event_type_parameter_value>2</event_type_parameter_value><emp_no>0407731</emp_no>
          
           
            var queryDataParameter = "<Last_update_date>" + '1483356362' + "</Last_update_date>";
        

            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            console.log("UTC_"+UTC);
         
            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];
                var chatroomIDList = [];               

                if (resultCode == 1) {      
                    $(".event-list-no-data").hide();

                   
                    packJsontemp  = data['Content'];                      
                    Jsonparsenext(1);  
                  
                } 


            };

            this.failCallback = function(data) { 
                //loadingMask("hide");

            };

            var __construct = function() {
                CustomAPI("POST", true, "GetAccountingRate", self.successCallback, self.failCallback, queryData, "");
            }();

        }//function getEventList(eventType)
      
    }  
    
    /********************************** API*************************************/
});
