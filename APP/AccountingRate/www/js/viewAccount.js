$("#viewAccount").pagecontainer({
    create: function(event, ui) {
        // First

        var FromStatus = "All Currency";
        var ToStatus = "USD";
        var tabActiveIDs = "#fragment-1";
        var test;
        var statuscountrypop;
        var statuscountryrate;


        var CheckifReloadflag1 = 0;
        var CheckifReloadflag2 = 0;
        var array = [];

        var arrayRate = [];
        var arrayadd = ["NTD", "EUR", "GBP"];
        var arrayaddtemp = [];
        var arrayrateadd = [];
        var arraycomb = [];
        var arrayratecomb = [];
        var packJsontemp = [];
   

        //Scenario 0504
        var ScenarioUTC = 0;
        var testday =0;

        //Scenario 0504

        var storage = JSON.parse(localStorage.getItem("arrayadd"));

        function initial() {
            if (storage != null) {
                arrayadd = storage;
                console.log('YA-already10 favorite');
            } else if (storage == null) {
                console.log('YA-52 initial');
                arrayadd = ["NTD", "EUR", "GBP"];
                localStorage.setItem("arrayadd", JSON.stringify(arrayadd));
            }
            console.log('arrayadd_' + arrayadd);
        }


        /********************************** function *************************************/
        window.APIRequest = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");
                var resultcode = data['ResultCode'];
            };

            this.failCallback = function(data) {};
            var __construct = function() {}();
        };

        /********************************** function *************************************/
        var date = new Date('2011', '01', '02');
        var newDate = new Date(date);
        console.log('63.date' + date);
        newDate.setDate(newDate.getDate() - 60);
        var nd = new Date(newDate);
        console.log('66' + nd);
        /********************************** function *************************************/
        window.Today = new Date();
        var MonthWord = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var todayYear = Today.getFullYear();
        var todayMonth = Today.getMonth() + 1;
        var todayDate = Today.getDate();
        var lastMonth = Today.getMonth();

        //review by alan
        //assign meaningful variable : UTC => TWOMonthDate
        //replace calc time function, 2017/1, 2017,2...5/31 -> 2/31

        var date = new Date(todayYear, todayMonth - 1, todayDate);
        var newDate = new Date(date);
        console.log('63.date' + date);
        newDate.setDate(newDate.getDate() - 60);
        var nd = new Date(newDate);
        window.TWOMonthDate = Math.round(nd / 1000);

        //window.UTC = Math.round(Date.UTC(todayYear, todayMonth - 3, todayDate) / 1000); //two month


        var nowTimstamp = window.Today.TimeStamp();
        window.Jsonflagnow = todayMonth;
        var Parameter = TWOMonthDate;
        /********************************** Scenario  *************************************/

        function ModifyScenario() {
            //todayYear   = ScenarioYear  ;  //global
            //todayMonth  = ScenarioMonth ;
            //Parameter   = UTCtime;

        }

        function Monthchange() //Warning : don't modify it 
        {
            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);

            todayYearmod = todayYear;
            var todayYearmod = todayYearmod.toString().substring(2, 4);

            $(".frag1").text(MonthWord[todayMonth - 1] + "-" + todayYearmod);
            $(".frag2").text(MonthWord[todayMonth - 2] + "-" + todayYearmod);

            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");
            $(".mainword3").text("Updated on " + todayYear + "/" + todayMonth + "/" + todayDate);


        }

         function MonthCalculator() 
         {
            var Twomonthdate=60; 
            var date = new Date(todayYear, todayMonth - 1, todayDate);
            var newDate = new Date(date);
            newDate.setDate(newDate.getDate() + testday );
            var nd = new Date(newDate);
            console.log("Scenario1" + nd);
            ScenarioUTC = Math.round(nd / 1000);
            console.log("ScenarioUTC1" + ScenarioUTC);


            newDate.setDate(newDate.getDate() + testday - 60);
            var nd = new Date(newDate);
            console.log("Scenario1two month" + nd);
            ScenarioTWOMonthUTC = Math.round(nd / 1000);
            console.log("ScenarioUTC1 month" + ScenarioUTC);
         }

        $(document).on("click", ".buttonScenario1", function() { //add to html

            testday =1;
            
            TWOMonthDate = ScenarioTWOMonthUTC;
            MonthCalculator() ;
            // var ScenarioYear  = todayYear;
            //var ScenarioMonth  = todayMonth;
            //var ScenarioDay    = todayDate;
      
            ModifyScenario();
            Monthchange();
            var EventList = new GetAccountingRate(); //call API1
        });

        $(document).on("click", ".buttonScenario2", function() { //add to html
            // var ScenarioYear  = todayYear;
            //var ScenarioMonth  = todayMonth;
            //var ScenarioDay    = todayDate;
            testday =2;
            MonthCalculator() ;
            
            ModifyScenario();
            Monthchange();
            var EventList = new GetAccountingRate(); //call API1
        });
        $(document).on("click", ".buttonScenario3", function() { //add to html
            // var ScenarioYear  = todayYear;
            //var ScenarioMonth  = todayMonth;
            //var ScenarioDay    = todayDate;
            testday =3;
            ModifyScenario();
            Monthchange();
            var EventList = new GetAccountingRate(); //call API1
        });



        /********************************** Scenario  *************************************/
        /********************************** page event *************************************/
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {
            Expiretime();
            Jsonparse(1);
            Monthchange();
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

            //Adjust margin-top of Tab content
            var navbarHeight = $(".tabs-top-fixed").height();
            var mainPaddingTop = parseInt(document.documentElement.clientWidth * 3.99 / 100, 10);
            var mainwordMarginTop = parseInt(navbarHeight - mainPaddingTop, 10);
            $(".mainword").css("margin-top", mainwordMarginTop + "px");
        });


        //   ************************************************************************** 

        $(document).on("click", ".buttontransfer", function() {
            var tmpsetF = $(".buttononeCountry1").html();
            var tmpsetT = $(".buttononeCountry2").html();
            $(".buttononeCountry1").html(tmpsetT);
            $(".buttononeCountry2").html(tmpsetF);

            $(".buttonone1").attr("src", "img/tmp/" + tmpsetT + ".png");
            $(".buttontwo1").attr("src", "img/tmp/" + tmpsetF + ".png");

            FromStatus = tmpsetT;
            ToStatus = tmpsetF;
            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");
            Jsonparsenext(1);
            Buttonimg();
        });

        function Buttonimg() {
            $(".buttonone1").attr("src", "img/tmp/" + FromStatus + ".png");
            $(".buttontwo1").attr("src", "img/tmp/" + ToStatus + ".png");

            if (FromStatus == "All Currency") {
                $(".buttonone1").removeClass('buttononeFlag1');
                $(".buttonone1").addClass('buttononeFlag1non');
                AddhtmlFirst();
            } else {
                $(".buttonone1").removeClass('buttononeFlag1non');
                $(".buttonone1").addClass('buttononeFlag1');

            }

            if (ToStatus == "All Currency") {
                $(".buttontwo1").removeClass('buttononeFlag2');
                $(".buttontwo1").addClass('buttononeFlag1non');
                AddhtmlSecond();
            } else {
                $(".buttontwo1").removeClass('buttononeFlag1non');
                $(".buttontwo1").addClass('buttononeFlag2');

            }

            if ((FromStatus != "All Currency") && (ToStatus != "All Currency")) {
                AddhtmlOne();
            }
        }
        /********************************** Event *************************************/
        $(document).on("tabsactivate", function(event, ui) {
            tabActiveIDs = ui.newPanel.selector;
            if (ui.newPanel.selector === "#fragment-1") {
                Jsonflagnow = todayMonth;
                Jsonparsenext(1);
            } else if (ui.newPanel.selector === "#fragment-2") {
                Jsonflagnow = todayMonth - 1;
                Jsonparsenext(1);
            }

        });
        /********************************** Event *************************************/
        $(document).on("click", ".select", function() {
            statuscountrypop = $(this).prop("id");
            if ($("#" + statuscountrypop).hasClass("favorite")) {
                $("#eventWorkConfirmB").popup('open');
            } else {
                $("#eventWorkConfirmA").popup('open');
            }
        });

        /********************************** Popup *************************************/
        $(document).on("click", "#eventWorkConfirmA .confirm", function() {
            $("#" + statuscountrypop).children(".star_icon").css("opacity", "1");
            $("#" + statuscountrypop).children(".nonstar_icon").css("opacity", "1");
            $("#" + statuscountrypop).addClass("favorite");
            arrayadd.push(statuscountrypop);
            statuscountryrate = $("#" + statuscountrypop).parent().find(".ListDollar1").text();
            arrayrateadd.push(statuscountryrate);
            Reorganization();
            localStorage.setItem("arrayadd", JSON.stringify(arrayadd));
            $("#eventWorkConfirmA").popup('close');

            footerFixed();
        });

        $(document).on("click", "#eventWorkConfirmA .cancel", function() {
            $("#eventWorkConfirmA").popup('close');
            footerFixed();
        });

        /********************************** Popup  *************************************/

        $(document).on("click", "#eventWorkConfirmB .confirm", function() {

            $("#" + statuscountrypop).children(".star_icon").css("opacity", "0");
            $("#" + statuscountrypop).children(".nonstar_icon").css("opacity", "0");
            $("#" + statuscountrypop).removeClass("favorite");
            statuscountryrate = $("#" + statuscountrypop).parent().find(".ListDollar1").text();
            arrayadd.splice(arrayadd.indexOf(statuscountrypop), 1);
            arrayrateadd.splice(arrayrateadd.indexOf(statuscountryrate), 1);
            Reorganization();
            localStorage.setItem("arrayadd", JSON.stringify(arrayadd));

            $("#eventWorkConfirmB").popup('close');
            footerFixed();
        });

        $(document).on("click", "#eventWorkConfirmB .cancel", function() { // B window OK
            $("#eventWorkConfirmB").popup('close');
            footerFixed();
        });

        /********************************** Popup  *************************************/
        $(document).on("click", "#popupA .popListdiv1", function() { //.Listdiv1  
            var statuspop = $(this).find(".ListRate1popup").text().trim();
            FromStatus = statuspop;

            if ((FromStatus == "All Currency") && (ToStatus == "All Currency")) {
                alert("NO!不可以喔!~ ^-^ ");
                FromStatus = "NTD";
            }

            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");
            $(".mainword3").text("Update on " + todayYear + "/" + todayMonth + "/" + todayDate);

            $(".buttonone1").attr("src", "img/tmp/" + FromStatus + ".png");
            $(".buttontwo1").attr("src", "img/tmp/" + ToStatus + ".png");

            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);

            Jsonparsenext(1);
            $("#popupA").popup('close');
            footerFixed();
        });

        /********************************** Popup *************************************/
        $(document).on("click", "#popupB .popListdiv1", function() {

            var statuspop = $(this).find(".ListRate1popup").text().trim(); //ListRate1popup
            ToStatus = statuspop;

            if ((FromStatus == "All Currency") && (ToStatus == "All Currency")) {
                alert("NO!不可以喔!~");
                ToStatus = "NTD";
            }

            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");
            $(".mainword3").text("Update on " + todayYear + "/" + todayMonth + "/" + todayDate);

            $(".buttonone1").attr("src", "img/tmp/" + FromStatus + ".png");
            $(".buttontwo1").attr("src", "img/tmp/" + ToStatus + ".png");

            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);

            Jsonparsenext(1);


            $("#popupB").popup('close');
            footerFixed();
        });
        /********************************** Favorite*************************************/

        function Reorganization() {
            arraycomb = arrayadd.concat(array.sort());
            arrayratecomb = arrayrateadd.concat(arrayRate);
            Buttonimg();
            Favorite();
        }


        function Favorite() {
            for (var i = 0; i < arrayadd.length; i++) {
                statuscountrypop = arrayadd[i]; {
                    //$(["class='chooseNTD'"][id="#NTD"]).addClass("favorite")
                    //$(".choose" + statuscountrypop).addClass("favorite");
                    //$(".choose"+ statuscountrypop).addClass("favorite"); //twice X must use id **
                    //$("#choose" + statuscountrypop).addClass("favorite"); //only for add by array id
                    $(".choose#" + statuscountrypop).addClass("favorite"); //twice X must use only id **

                }
            }
            if ($("li").children(".favorite")) {
                $("li").children(".favorite").children(".star_icon").css("opacity", "1"); //li id 
                $("li").children(".favorite").children(".nonstar_icon").css("opacity", "1"); //li id 

            }
        }
        /********************************** html *************************************/
        function AddhtmlOne() {
            var htmltemp = "";
            for (var i = 0; i < 1; i++) { //array initial.lenggth

                var country = 'Candy';
                var index = "";
                content = htmltemp + CountrylisthtmlOne(i, country);
                htmltemp = content;
            }
            if (tabActiveIDs === "#fragment-1") {

                $("#ultestA").html(" ");
                $("#ultestA").append(content);
                $("#ultestB").html(" ");
                Favorite(); //add for test 20170424

            }
            if (tabActiveIDs === "#fragment-2") {

                $("#ultestB").html(" ");
                $("#ultestB").append(content);
                $("#ultestA").html(" ");
                Favorite();

            }
        }

        function AddhtmlFirst() {
            var htmltemp = "";
            for (var i = 0; i < arraycomb.length; i++) {
                var country = 'Candy';
                var index = "";
                content = htmltemp + CountrylisthtmlFirst(i, country);
                htmltemp = content;
            }
            if (tabActiveIDs === "#fragment-1") {
                $("#ultestA").html(" ");
                $("#ultestA").append(content);
                $("#ultestB").html(" ");
                Favorite(); //add for test 20170424

            }
            if (tabActiveIDs === "#fragment-2") {
                $("#ultestB").html(" ");
                $("#ultestB").append(content);
                $("#ultestA").html(" ");
                Favorite();
            }
        }

        function AddhtmlSecond() {
            var htmltemp = "";
            for (var i = 0; i < arraycomb.length; i++) {
                var country = 'Candy';
                var index = "";
                content = htmltemp + CountrylisthtmlSecond(i, country);
                htmltemp = content;
            }

            if (tabActiveIDs === "#fragment-1") {
                $("#ultestA").html(" ");
                $("#ultestA").append(content);
                $("#ultestB").html(" ");
                Favorite();

            }

            if (tabActiveIDs === "#fragment-2") {
                $("#ultestB").html(" ");
                $("#ultestB").append(content); //insert month  
                $("#ultestA").html(" ");
                Favorite(); //add for test 20170424
            }

        }
        /********************************** html  *************************************/
        function CountrylisthtmlOne(index) {
            return '<li data-icon="false" class="1_li CountryA" id="litest">' + '<div class="Listdiv1 select ' + FromStatus + '"' + 'id=' + FromStatus + '>' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' + '<img  class="ListviewFlag1" src ="img/tmp/' + FromStatus + '.png"> ' + '<span class="ListRate1">' + '1 ' + FromStatus + '</span>  ' + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' + '<div class="Listdiv2">' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' + '<img  class="ListviewFlag2" src ="img/tmp/' + ToStatus + '.png">' + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + arrayRate[index] + '</span> ' + '<span class="ListRate2">' + ToStatus + '</span>' + '<br> ' + '</div>' + '</div>' + '</li>';
        }

        function CountrylisthtmlFirst(index, country) {
            return '<li data-icon="false" class="1_li CountryA " id="litest">' + '<div class="Listdiv1 select choose ' + arraycomb[index] + '"' + 'id=' + arraycomb[index] + '>' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' + '<img  class="ListviewFlag1" src ="img/tmp/' + arraycomb[index] + '.png"> ' + '<span class="ListRate1">' + '1 ' + arraycomb[index] + '</span>  ' + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' + '<div class="Listdiv2">' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' + '<img  class="ListviewFlag2" src ="img/tmp/' + ToStatus + '.png">' + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + arrayratecomb[index] + '</span> ' + '<span class="ListRate2">' + ToStatus + '</span>' + '<br> ' + '</div>' + '</div>' + '</li>';
        }

        function CountrylisthtmlSecond(index, country) {
            return '<li data-icon="false" class="1_li CountryA" id="litest">' + '<div class="Listdiv1" id=' + FromStatus + '>' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' + '<img  class="ListviewFlag1" src ="img/tmp/' + FromStatus + '.png"> ' + '<span class="ListRate1">' + '1 ' + FromStatus + '</span>  ' + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' + '<div class="Listdiv2 select choose ' + arraycomb[index] + '"' + 'id= ' + arraycomb[index] + '>' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' + '<img  class="ListviewFlag2" src ="img/tmp/' + arraycomb[index] + '.png">' + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + arrayratecomb[index] + '</span> ' + '<span class="ListRate2">' + arraycomb[index] + '</span>' + '<br> ' + '</div>' + '</div>' + '</li>';
        }

        function Pophtmlfirst() {
            return '<li data-icon="false" class="1_li CountryA" id="litest">' + '<div class="Listdiv1" id=' + '</li>';

        }

        function Pophtmlnext() {
            return '<li data-icon="false" class="1_li CountryA" id="litest">' + '<div class="Listdiv1" id=' + '</div>' + '</li>';

        }
        /********************************** html *************************************/
        /********************************** dom event *************************************/

        /********************************** API*************************************/
        function Jsonparse() {
            console.log('680.Jsonparse - API');
            var EventList = new GetAccountingRate(); //call API1
        }

        function Jsonparsecheck() {

            if (packJsontemp == 0) {
                CheckifReloadflag2 = 1;
            }

            //review by alan
            //assign meaningful variable : flag1, flag2
            /* 20170502  add by 新增需求*/
            if (CheckifReloadflag2 == 1) {
                packJsontemp = JSON.parse(localStorage.getItem('packJsontemp'));
                console.log("690-1. Null use local");

            } else if ((CheckifReloadflag2 != 0) && (CheckifReloadflag1 == 0)) {
                Parameter = TWOMonthDate;
                var EventList = new GetAccountingRate();
                CheckifReloadflag1 = 1; //Had got all data
                console.log("690-2 .Call again API");

            }
            console.log("690-3 .run local");
            Jsonparsenext(1);
        }

        function Jsonparsenext() {
            var packJson = packJsontemp;
            localStorage.setItem("packJsontemp", JSON.stringify(packJsontemp));
            console.log("720. Jsonparsenext");
            arrayRate = ["NaN"];
            var arraygetrate = [];
            var arraygetFrom = [];
            var arraygetTo = [];
            var cleartest = 0;
            arrayrateadd = [];

            for (var i = 0; i < packJson.length; i++) {
                getrate = packJson[i].Ex_Rate;
                getfrom = packJson[i].From_Currency;
                getto = packJson[i].To_Currency;
                exdate = packJson[i].Ex_Date;
                if ((FromStatus == "All Currency") && (exdate == todayYear + '/0' + Jsonflagnow + '/01')) {
                    if (getto == ToStatus) {
                        arraygetFrom.push(getfrom);
                        arraygetrate.push(getrate);

                        array = arraygetFrom;
                        arrayRate = arraygetrate;
                        console.log('OK i:' + i + 'Rate:' + getrate + 'from:' + getfrom + 'to:' + getto + 'Data:' + exdate);
                    }
                } else if ((ToStatus == "All Currency") && (exdate == todayYear + '/0' + Jsonflagnow + '/01')) {
                    if (getfrom == FromStatus) {
                        arraygetTo.push(getto);
                        arraygetrate.push(getrate);
                        array = arraygetTo;
                        arrayRate = arraygetrate;
                        console.log('OK i:' + i + 'Rate:' + getrate + 'from:' + getfrom + 'to:' + getto + 'Data:' + exdate);
                    }
                } else if ((FromStatus != "All Currency") && (ToStatus != "All Currency")) {
                    if ((getfrom == FromStatus) && (getto == ToStatus) && (exdate == todayYear + '/0' + Jsonflagnow + '/01')) //FromStatus   ToStatus 
                    {
                        arraygetrate.push(getrate);
                        arrayRate = arraygetrate;
                        console.log('OK i:' + i + 'Rate:' + getrate + 'from:' + getfrom + 'to:' + getto + 'Data:' + exdate);
                    }
                }
            }

            for (var i = 0; i < arrayadd.length; i++) {
                var rateindex = array.indexOf(arrayadd[i]);
                if (rateindex >= 0) {
                    var ratetemp = arrayRate[rateindex];
                    arrayrateadd.push(ratetemp);
                    console.log(arrayadd[i] + '_' + ratetemp);
                } else if (rateindex < 0) {
                    var ratetemp = "NaN";
                    arrayrateadd.push(ratetemp);
                    console.log(arrayadd[i] + '_' + ratetemp);
                }
            }
            Reorganization();
            Buttonimg();
        }
        /********************************** API*************************************/

        //review by alan
        //remove unused function
        $('#viewAccount').keypress(function(event) {

        });

        /********************************** API*************************************/

        function GetAccountingRate(eventType) {

            eventType = eventType || null;
            var self = this;
            //loadingMask("show");
            console.log("我呼叫" + Parameter);
            //Parameter = '1488412800';

            var queryDataParameter = "<Last_update_date>" + Parameter + "</Last_update_date>"; //20170427 test
            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";
            console.log("UTC_API" + TWOMonthDate);
            this.successCallback = function(data) {
                var resultCode = data['ResultCode'];
                if (resultCode == 1) {
                    //loadingMask("hide");
                    packJsontemp = data['Content'];
                    Jsonparsecheck();
                }
            };
            this.failCallback = function(data) {
                //loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "GetAccountingRate", self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function Expiretime() {
            var storagetimeYear = JSON.parse(localStorage.getItem('localYear'));
            var storagetimeMon = JSON.parse(localStorage.getItem('localMonth'));
            var storagetimeDate = JSON.parse(localStorage.getItem('localDate'));
            window.UTCtime = Math.round(Date.UTC(storagetimeYear, storagetimeMon - 1, storagetimeDate) / 1000);

            if (storagetimeMon != null) {
                Parameter = UTCtime;
                console.log("use local" + UTCtime);
            } else if (storagetimeMon == null) {
                Parameter = TWOMonthDate;
                console.log("use first time" + TWOMonthDate);
            }
            localStorage.setItem("localYear", JSON.stringify(todayYear));
            localStorage.setItem("localMonth", JSON.stringify(todayMonth));
            localStorage.setItem("localDate", JSON.stringify(todayDate));
        }
    }

    /********************************** API*************************************/
});
