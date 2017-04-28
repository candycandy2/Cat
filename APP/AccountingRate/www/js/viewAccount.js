
$("#viewAccount").pagecontainer({
    create: function(event, ui) {
       // First
        var FromStatus  = "All Currency";          
        var ToStatus    = "EUR";

        var tabActiveIDs = "#fragment-1";
        // Sencod
        //var FromStatus  = "NTD";  
        //var ToStatus    = "All Currency";
        // One
        //var FromStatus  = "NTD";//var ToStatus  = "NTD";  
        var test;
        var statuscountrypop;
        var statuscountryrate;
       

        var array     = [    ];   
        var arrayRate = [    ];  


        var arrayadd =["NTD","USD"];
        //var arrayadd            =[];
        var arrayaddtemp        =[];
        var arrayrateadd        =[];
        var arraycomb           =[];
        var arrayratecomb       =[];
        var packJsontemp        =[];
       

       
       var storage =JSON.parse(localStorage.getItem("arrayadd"));
        
        function initial(){
            if (storage != null){ //0 error ?
                    arrayadd = storage; 
                    console.log('YA-already10');
            }
            else if (storage == null) 
            {
                console.log('YA-52 initial');
                arrayadd  =["NTD","USD"];
                localStorage.setItem("arrayadd",JSON.stringify(arrayadd));
            }
            console.log('arrayadd_'+arrayadd);
        }
        /* 20170426 mark for test  */                  
        
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

       // window.UTC = Math.round(Date.UTC(todayYear,todayMonth-3,todayDate)/1000);
        window.UTC              = Math.round(Date.UTC(todayYear,todayMonth-3,todayDate)/1000);
        var nowTimstamp         = window.Today.TimeStamp();   
        window.Jsonflagnow      = todayMonth; 
        var Parameter           = UTC;
    


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
            
            Expiretime();
            Jsonparse(1);
            initial();
          
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
           
            statuscountrypop = $(this).prop("id");
           
            //$("#fragment-1 #NTD")   favorite
            //$("#fragment-2 #NTD")   
             
         
            if ($("#"+statuscountrypop).hasClass("favorite")) 
            {
                $("#eventWorkConfirmB").popup('open');
            }
            else 
            {
                $("#eventWorkConfirmA").popup('open');             
            }
            /* 20170426 mark for test
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
            Buttonimg();//html reset => would be error


            
            localStorage.setItem("arrayadd",JSON.stringify(arrayadd));  //2017 05 add
             /*20170426   */
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
            Buttonimg();

            
            localStorage.setItem("arrayadd",JSON.stringify(arrayadd)); 
             /* 20170426*/
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
          
            var EventList = new GetAccountingRate();  //API
        }

        
        function Jsonparsecheck(Jsonflag) {   //After API     

             /*
            if (packJsontemp == 0) // no renew
                {                
                    packJsontemp =JSON.parse(localStorage.getItem('packJsontemp')); 
                }
            else  
                {   
                    Parameter = UTC;  
                    var EventList = new GetAccountingRate();   //call API 2       
                }  
            */
            Jsonparsenext(1); 
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

               
                var packJson = packJsontemp ; //packJsontemp 
                localStorage.setItem("packJsontemp",JSON.stringify(packJsontemp));  
           
     

                arrayRate           = ["undefined"]; 
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

                  
                     if ((FromStatus =="All Currency")&&(exdate ==todayYear+'/0'+Jsonflagnow+'/01'))      
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
                 
                  
                    else if ((ToStatus =="All Currency")&&(exdate ==todayYear+'/0'+Jsonflagnow+'/01'))
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
                        if ((getfrom == FromStatus)&&(getto ==ToStatus)&&(exdate ==todayYear+'/0'+Jsonflagnow+'/01')) //FromStatus   ToStatus 
                           
                            {  
                                arraygetrate.push(getrate);                  
                                arrayRate= arraygetrate;     
                                console.log('OK i:'+i+'Rate:'+getrate+'from:'+getfrom+'to:'+getto +'Data:'+exdate); 
                            }
                    } 
                }
             
               
             
                for (var i=0; i<arrayadd.length; i++)  
                {
                      var rateindex = array.indexOf(arrayadd[i]);
                                       
                      if (rateindex >= 0) 
                        {   var ratetemp  = arrayRate[rateindex]; 
                            arrayrateadd.push(ratetemp);
                            console.log(arrayadd[i]+'_'+ratetemp);
                        }                           
                      else if (rateindex < 0)
                        {   var ratetemp  = "undefined";
                            arrayrateadd.push(ratetemp);
                            console.log(arrayadd[i]+'_'+ratetemp);
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
            //loadingMask("show");
                      
            var queryDataParameter = "<Last_update_date>" + Parameter+ "</Last_update_date>"; //20170427 test
        

            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            console.log("UTC_"+UTC);
         
            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];
                var chatroomIDList = [];               

                if (resultCode == 1) {      
   

                    //loadingMask("hide");
                    packJsontemp  = data['Content'];    
                   
                    Jsonparsecheck();  //test by 0429 wait              
                    //Jsonparsenext(1);  
                  
                } 


            };

            this.failCallback = function(data) { 
                //loadingMask("hide");

            };

            var __construct = function() {
                CustomAPI("POST", true, "GetAccountingRate", self.successCallback, self.failCallback, queryData, "");
            }();

    }//function getEventList(eventType)



    function Expiretime(){  //use global UTCtime to handle 
            /*
            var storagetimeYear =JSON.parse(localStorage.getItem('localYear'));
            var storagetimeMon = JSON.parse(localStorage.getItem('localMonth'));
            var storagetimeDate =JSON.parse(localStorage.getItem('localDate'));
       
            window.UTCtime = Math.round(Date.UTC(storagetimeYear,storagetimeMon-1, storagetimeDate)/1000); //last time
          

            if (storagetimeMon != null){ 

                    Parameter = UTCtime;      //use last data                    
            }
            else if (storagetimeMon == null)  //first time 
            {
                    Parameter = UTC;        
            }

            localStorage.setItem("localYear",JSON.stringify  (todayYear));
            localStorage.setItem("localMonth",JSON.stringify (todayMonth));
            localStorage.setItem("localDate",JSON.stringify  (todayDate));   
            */     
    }//Expiretime

  }  
    
    /********************************** API*************************************/
});
