$("#viewAccount").pagecontainer({
    create: function(event, ui) {
        //Darren - start
        //Which months should be displayed
        window.showDataMonth = [];
        window.allCurrencyData = {};
        window.favoriteCurrencyData = ["NTD", "USD", "EUR"];
        var dataMonth;
        window.allCountry = ["AED","AUD","BDT","BRL","CAD","CHF","CZK","EUR","GBP","HKD","IDR",
        "INR","JPY","KRW","MMK","MXN","MYR","NTD","NZD","PHP","RMB","RUB","SEK","SGD","THB","TRL","USD","VND","ZAR"];
        var deviceHeight;
        var getFavoriteData = false;
        var latestUpdateDatetime = "0";
        //end

        var FromStatus = "USD" ;
        var ToStatus = "All Currency";
        var tabActiveIDs = "#fragment-1";
        window.packJsontemp = [];
        var arrayLast_update_date = [];
        var statuscountrypop;

        /*
        var statuscountryrate;
        var CheckifReloadflag1 = 0;
        var CheckifReloadflag2 = 0;
        window.array = [];
        window.arrayRate = [];
        window.arrayadd = ["NTD", "USD", "EUR"];
        var arrayaddtemp = [];
        window.arrayrateadd = [];
        window.arraycomb = [];
        var arrayratecomb = [];
        window.Last_date = "0";
        window.dateshow = "2020/01/01";
        */

        //Scenario 0504
        var ScenarioUTC = 0;
        var testday = 0;
        var TWOMonthDate = 0;
        var test = 0;

        /*
        //Scenario 0504
        var storage = JSON.parse(localStorage.getItem("arrayadd"));
        function initial() {
            if (storage != null) {
                arrayadd = storage;
                //console.log('YA-already10 favorite');
            } else if (storage == null) {
                //console.log('YA-52 initial');
                localStorage.setItem("arrayadd", JSON.stringify(arrayadd));
            }
            //console.log('arrayadd_' + arrayadd);
        }
        */

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
        //console.log('63.date' + date);
        newDate.setDate(newDate.getDate() - 60);
        var nd = new Date(newDate);
        //console.log('66' + nd);
        /********************************** function *************************************/
        window.Today = new Date();
        var MonthWord = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var todayYear = Today.getFullYear();
        var todayMonth = Today.getMonth() + 1;
        var todayDate = Today.getDate();
        var lastMonth = Today.getMonth();

        var date = new Date(todayYear, todayMonth - 1, todayDate);
        var newDate = new Date(date);
        //console.log('63.date' + date);
        newDate.setDate(newDate.getDate() - 60);
        var nd = new Date(newDate);
        TWOMonthDate = Math.round(nd / 1000);
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

        function Monthchange() {
            //Warning : don't modify it

            $(".buttononeCountry1").text(FromStatus);
            $(".buttononeCountry2").text(ToStatus);

            var todayYearmod = todayYear.toString().substring(2, 4);

            for (var i=0; i<showDataMonth.length; i++) {
                var fragNum = parseInt(i + 1, 10);
                $(".frag" + fragNum).text(MonthWord[showDataMonth[i] - 1] + "-" + todayYearmod);
            }

            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");

            var dateshow = latestUpdateDatetime.toString().substr(0, 10);
            $(".mainword3").text("Updated on "+ dateshow);
            /*
            todayYearmod = todayYear;
            var todayYearmod = todayYearmod.toString().substring(2, 4);

            $(".frag1").text(MonthWord[todayMonth - 1] + "-" + todayYearmod);
            $(".frag2").text(MonthWord[todayMonth - 2] + "-" + todayYearmod);

            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");
            // $(".mainword3").text("Updated on " + todayYear + "/" + todayMonth + "/" + todayDate);
            //console.log('Last_date'+Last_date);
            dateshow = Last_date.toString().substr(0, 10);
            // console.log("dateshow_" + dateshow);
            $(".mainword3").text("Updated on "+ dateshow);
            //$(".mainword3").text("Updated on " + Last_date);
            //Last_date
            */
        }

        function MonthCalculator() {
            var Twomonthdate = 60;
            var date = new Date(todayYear, todayMonth - 1, todayDate);
            var newDate = new Date(date);
            newDate.setDate(newDate.getDate() + testday);
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

        /*
        $(document).on("click", ".buttonScenario1", function() { // 0510

            var date = new Date(todayYear, todayMonth - 1, todayDate);
            var newDate = new Date(date);

            window.UTCtime = Math.round(Date.UTC(todayYear, todayMonth - 1, todayDate) / 1000); //5/09
            Parameter = UTCtime;

            //console.log('Day1.date' + date);
            //console.log("Day2"+UTCtime);
            var date = new Date(todayYear, todayMonth - 1, todayDate);
            var newDate = new Date(date);
            newDate.setDate(newDate.getDate() - 60);
            var nd = new Date(newDate);
            TWOMonthDate = Math.round(nd / 1000);   
            //console.log('Day1.TWOMonthDate' + TWOMonthDate);  
            test==1     

            // ModifyScenario();
            // Monthchange();
            var EventList = new GetAccountingRate(); //call API1
        });

        $(document).on("click", ".buttonScenario2", function() { //0511
            //1494489600
            // var ScenarioYear  = todayYear;
            // var ScenarioMonth  = todayMonth;
            // var ScenarioDay    = todayDate;
            window.UTCtime = Math.round(Date.UTC(todayYear, todayMonth - 1, todayDate) / 1000); //yesterday
            Parameter = UTCtime;

            console.log("Day2"+UTCtime);
            //Parameter = '1494489600';
            //TWOMonthDate = '1489219200';
            var EventList = new GetAccountingRate(); //call API1
            // Jsonparse();
            // testday =2;
            // MonthCalculator() ;

            // ModifyScenario();
            // Monthchange();
            //var EventList = new GetAccountingRate(); //call API1
        });

        $(document).on("click", ".buttonScenario3", function() { //0512
            //1494576000
            // var ScenarioYear  = todayYear;
            //var ScenarioMonth  = todayMonth;
            //var ScenarioDay    = todayDate;
            window.UTCtime = Math.round(Date.UTC(todayYear, todayMonth - 1, todayDate+1) / 1000); //yesterday
            Parameter = UTCtime;

            //console.log("Day3"+ UTCtime);
            //Parameter = '1494576000';
            //TWOMonthDate = '1489305600';
            Jsonparse();
            //testday =3;
            //ModifyScenario();
            //Monthchange();
        });

        $(document).on("click", ".buttonScenario70", function() { //0509 +70 
            //console.log("Day70 _0719(0510)) 1500364800");
            
            window.UTCtime = Math.round(Date.UTC(todayYear, todayMonth - 1, todayDate+2) / 1000); //yesterday
            Parameter = UTCtime;           

            //console.log('Day70.date_510' + UTCtime);
            var date = new Date(todayYear, todayMonth - 1, todayDate);
            var newDate = new Date(date);
            newDate.setDate(newDate.getDate() +70-60);
            var nd = new Date(newDate);
            TWOMonthDate = Math.round(nd / 1000);
            //1500364800 
            //  testday =3;
            //  ModifyScenario();
            //  Monthchange();

            //  Parameter = '1500451200';
            //  TWOMonthDate = '1495180800';
            // Jsonparse();
        });
        */
        $(document).on("click", ".buttonScenario", function() {
            var id = $(this).prop("id");
            var testDate = new Date();
            var tempDate;
            var dayChange = false;

            if (id === "scenario2") {
                tempDate = testDate.setDate(testDate.getDate() + 1);
                dayChange = true;
            } else if (id === "scenario3") {
                tempDate = testDate.setDate(testDate.getDate() + 2);
                dayChange = true;
            } else if (id === "scenario70") {
                tempDate = testDate.setDate(testDate.getDate() + 70);
                dayChange = true;
            }

            if (dayChange) {
                testDate = new Date(tempDate);
            }

            Parameter = testDate.TimeStamp();
            var AccountingRate = new GetAccountingRate();
            console.log(testDate.TimeStamp());
        });

        /********************************** Scenario  *************************************/
        /********************************** page event *************************************/
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {
            Expiretime();
            //Jsonparse(1);
            //Monthchange();
            //initial();
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

            $("#popupA").popup({ dismissible: false });
            $("#popupB").popup({ dismissible: false });

            //Adjust margin-top of Tab content
            var navbarHeight = $(".tabs-top-fixed").height();
            var mainPaddingTop = parseInt(document.documentElement.clientWidth * 4.3 / 100, 10);
            var mainwordMarginTop = parseInt(navbarHeight - mainPaddingTop, 10);
            $(".mainword").css("margin-top", mainwordMarginTop + "px");

            deviceHeight = parseInt(document.documentElement.clientWidth - mainwordMarginTop, 10);
        });

        //************************************************************************** 
        $(document).on("click", ".buttontransfer", function() {
            var tmpsetF = $(".buttononeCountry1").html();
            var tmpsetT = $(".buttononeCountry2").html();
            $(".buttononeCountry1").html(tmpsetT);
            $(".buttononeCountry2").html(tmpsetF);

            if (tmpsetT != "All Currency") {
                $(".buttonone1").attr("src", "img/tmp/" + tmpsetT + ".png");
            }
            if (tmpsetF != "All Currency") {
                $(".buttontwo1").attr("src", "img/tmp/" + tmpsetF + ".png");
            }

            FromStatus = tmpsetT;
            ToStatus = tmpsetF;
            $(".mainword1").text("From " + FromStatus + " to " + ToStatus + " ");
            //Favorite();
            //Jsonparsenext(1);
            Buttonimg();
            dataListView();
        });

        function Buttonimg() {
            if (FromStatus != "All Currency") {
                $(".buttonone1").attr("src", "img/tmp/" + FromStatus + ".png");
            }
            if (ToStatus != "All Currency") {
                $(".buttontwo1").attr("src", "img/tmp/" + ToStatus + ".png");
            }

            if (FromStatus == "All Currency") {
                $(".buttonone1").removeClass('buttononeFlag1');
                $(".buttonone1").addClass('buttononeFlag1non');
                //AddhtmlFirst();
            } else {
                $(".buttonone1").removeClass('buttononeFlag1non');
                $(".buttonone1").addClass('buttononeFlag1');
            }

            if (ToStatus == "All Currency") {
                $(".buttontwo1").removeClass('buttononeFlag2');
                $(".buttontwo1").addClass('buttononeFlag1non');
                //AddhtmlSecond();
            } else {
                $(".buttontwo1").removeClass('buttononeFlag1non');
                $(".buttontwo1").addClass('buttononeFlag2');
            }

            if ((FromStatus != "All Currency") && (ToStatus != "All Currency")) {
                //AddhtmlOne();
            }
        }
        /********************************** Event *************************************/
        $(document).on("tabsactivate", function(event, ui) {
            tabActiveIDs = ui.newPanel.selector;
            dataListView();
            /*
            if (ui.newPanel.selector === "#fragment-1") {
                Jsonflagnow = todayMonth;
                Jsonparsenext(1);
            } else if (ui.newPanel.selector === "#fragment-2") {
                Jsonflagnow = todayMonth - 1;
                Jsonparsenext(1);
            }
            */
        });

        /********************************** Add/Remove Favorite *************************************/
        $(document).on("click", ".select", function() {
            statuscountrypop = $(this).prop("id");

            if ($("#" + statuscountrypop).hasClass("favorite")) {
                $("#eventWorkConfirmB .header.font-style1").html("Remove「" + statuscountrypop + "」from favorite ?");
                $("#eventWorkConfirmB").popup('open');
            } else {
                $("#eventWorkConfirmA .header.font-style1").html("Add「" + statuscountrypop + "」to favorite ?");
                $("#eventWorkConfirmA").popup('open');
            }
        });

        /********************************** Popup *************************************/
        $(document).on("click", "#eventWorkConfirmA .confirm", function() {
            /*
            $("#" + statuscountrypop).children(".star_icon").css("opacity", "1");
            $("#" + statuscountrypop).children(".nonstar_icon").css("opacity", "1");
            $("#" + statuscountrypop).addClass("favorite");
            arrayadd.push(statuscountrypop);
            statuscountryrate = $("#" + statuscountrypop).parent().find(".ListDollar1").text();
            arrayrateadd.push(statuscountryrate);
            Reorganization();
            localStorage.setItem("arrayadd", JSON.stringify(arrayadd));
            $("#eventWorkConfirmA").popup('close');
            */
            favoriteCurrencyData.push(statuscountrypop);
            Reorganization();
            $("#eventWorkConfirmA").popup('close');
            footerFixed();
        });

        $(document).on("click", "#eventWorkConfirmA .cancel", function() {
            $("#eventWorkConfirmA").popup('close');
            footerFixed();
        });

        /********************************** Popup  *************************************/
        $(document).on("click", "#eventWorkConfirmB .confirm", function() {
            /*
            $("#" + statuscountrypop).children(".star_icon").css("opacity", "0");
            $("#" + statuscountrypop).children(".nonstar_icon").css("opacity", "0");
            $("#" + statuscountrypop).removeClass("favorite");
            statuscountryrate = $("#" + statuscountrypop).parent().find(".ListDollar1").text();
            arrayadd.splice(arrayadd.indexOf(statuscountrypop), 1);
            arrayrateadd.splice(arrayrateadd.indexOf(statuscountryrate), 1);
            Reorganization();
            localStorage.setItem("arrayadd", JSON.stringify(arrayadd));

            $("#eventWorkConfirmB").popup('close');
            */
            var index = favoriteCurrencyData.indexOf(statuscountrypop);
            if (index > -1) {
                favoriteCurrencyData.splice(index, 1);
            }
            Reorganization();
            $("#eventWorkConfirmB").popup('close');
            footerFixed();
        });

        $(document).on("click", "#eventWorkConfirmB .cancel", function() { // B window OK
            $("#eventWorkConfirmB").popup('close');
            footerFixed();
        });

        /********************************** Popup  *************************************/
        /*
        $(document).on("click", "#popupA .popListdiv1", function() { //.Listdiv1  
            var statuspop = $(this).find(".ListRate1popup").text().trim();
            FromStatus = statuspop;

            if ((FromStatus == "All Currency") && (ToStatus == "All Currency")) {
                //alert("NO!不可以喔!~ ^-^ ");
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
        */

        /********************************** Popup *************************************/
        /*
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
        */

        /********************************** Favorite*************************************/
        function Reorganization() {
            /*
            arrayadd.sort();        

            arraycomb = arrayadd.concat(array.sort());
            arrayratecomb = arrayrateadd.concat(arrayRate);
            Buttonimg();
            Favorite();
            */

            //Get favorite Only once atfer open APP
            if (!getFavoriteData) {
                if (window.localStorage.getItem("favoriteCurrencyData") !== null) {
                    favoriteCurrencyData = JSON.parse(window.localStorage.getItem("favoriteCurrencyData"));
                    getFavoriteData = true;
                }
            }

            //Sort Favorite Data, if [NTD] exist, [NTD] should be the first data
            if (favoriteCurrencyData.indexOf("NTD") == -1) {
                favoriteCurrencyData.sort();
            } else {
                var NTD = ["NTD"];
                favoriteCurrencyData.splice(0, 1)
                var tempData = favoriteCurrencyData;
                tempData.sort();
                favoriteCurrencyData = NTD.concat(tempData);
            }
            window.localStorage.setItem("favoriteCurrencyData", JSON.stringify(favoriteCurrencyData));

            dataListView();
        }

        function Favorite() {
            /*
            for (var i = 0; i < arrayadd.length; i++) {
                statuscountrypop = arrayadd[i]; 
                $(".choose#" + statuscountrypop).addClass("favorite"); 
            }
            if ($("li").children(".favorite")) {
                $("li").children(".favorite").children(".star_icon").css("opacity", "1"); //li id 
                $("li").children(".favorite").children(".nonstar_icon").css("opacity", "1"); //li id 
            }
            */
        }

        /********************************** html *************************************/
        function AddhtmlOne() {
            /*
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
                $("#ultestA").listview('refresh');
                $("#ultestB").html(" ");
                //Favorite(); //add for test 20170424
            }

            if (tabActiveIDs === "#fragment-2") {
                $("#ultestB").html(" ");
                $("#ultestB").append(content);
                $("#ultestB").listview('refresh');
                $("#ultestA").html(" ");
                //Favorite();
            }
            */
            var content = "";
            var currencyRate;

            $.each(allCurrencyData, function(countryFrom, toData){
                if (countryFrom === FromStatus) {
                    $.each(toData[dataMonth], function(countryTo, currencyData){
                        if (countryTo === ToStatus) {
                            /*
                            if (favoriteCurrencyData.indexOf(countryTo) == -1) {
                                console.log("----2");
                                content += CountrylisthtmlSecond(countryTo, currencyData["Ex_Rate"], "nonstar_icon", false);
                            } else {
                                console.log("----1");
                                content += CountrylisthtmlFirst(countryFrom, currencyData["Ex_Rate"], "star_icon", true);
                            }
                            */
                            currencyRate = currencyData["Ex_Rate"];
                            return false;
                        }
                    });
                }
            });

            //check if FromStatus/ToStatus are exist in favorite
            if (favoriteCurrencyData.indexOf(FromStatus) == -1) {
                var cssClassFrom = "nonstar_icon";
                var favoriteFrom = false;
            } else {
                var cssClassFrom = "star_icon";
                var favoriteFrom = true;
            }

            if (favoriteCurrencyData.indexOf(ToStatus) == -1) {
                var cssClassTo = "nonstar_icon";
                var favoriteTo = false;
            } else {
                var cssClassTo = "star_icon";
                var favoriteTo = true;
            }


            content += CountrylisthtmlOne(currencyRate, cssClassFrom, favoriteFrom, cssClassTo, favoriteTo);

            $("ul[data-role='listview'][class^='test']").html("");
            $(tabActiveIDs + " ul").append(content);
            $(tabActiveIDs + " ul").listview('refresh');
            footerFixed();
        }

        function AddhtmlFirst() {
            /*
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
                $("#ultestA").listview('refresh');
                $("#ultestB").html(" ");
                Favorite(); //add for test 20170424
            }

            if (tabActiveIDs === "#fragment-2") {
                $("#ultestB").html(" ");
                $("#ultestB").append(content);
                $("#ultestB").listview('refresh');
                $("#ultestA").html(" ");
                Favorite();
            }
            */
            var content = "";

            for (var i=0; i<favoriteCurrencyData.length; i++) {
                $.each(allCurrencyData, function(countryFrom, toData){
                    if (countryFrom === favoriteCurrencyData[i]) {
                        $.each(toData[dataMonth], function(countryTo, currencyData){
                            if (countryTo === ToStatus) {
                                content += CountrylisthtmlFirst(favoriteCurrencyData[i], currencyData["Ex_Rate"], "star_icon", true);
                                return false;
                            }
                        });
                    }
                });
            }

            $.each(allCurrencyData, function(countryFrom, toData){
                $.each(toData[dataMonth], function(countryTo, currencyData){
                    if (favoriteCurrencyData.indexOf(countryFrom) == -1) {
                        if (countryTo === ToStatus) {
                            content += CountrylisthtmlFirst(countryFrom, currencyData["Ex_Rate"], "nonstar_icon", false);
                            return false;
                        }
                    }
                });
            });

            $("ul[data-role='listview'][class^='test']").html("");
            $(tabActiveIDs + " ul").append(content);
            $(tabActiveIDs + " ul").listview('refresh');

            recoveryPageHeight();
        }

        function AddhtmlSecond() {
            /*
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
                $("#ultestA").listview('refresh');
                $("#ultestB").html(" ");
                Favorite();
            }

            if (tabActiveIDs === "#fragment-2") {
                $("#ultestB").html(" ");
                $("#ultestB").append(content); //insert month  
                $("#ultestB").listview('refresh');
                $("#ultestA").html(" ");
                Favorite(); //add for test 20170424
            }
            */
            var content = "";

            for (var i=0; i<favoriteCurrencyData.length; i++) {
                $.each(allCurrencyData, function(countryFrom, toData){
                    if (countryFrom === FromStatus) {
                        $.each(toData[dataMonth], function(countryTo, currencyData){
                            if (countryTo === favoriteCurrencyData[i]) {
                                content += CountrylisthtmlSecond(countryTo, currencyData["Ex_Rate"], "star_icon", true);
                                return false;
                            }
                        });
                        return false;
                    }
                });
            }

            $.each(allCurrencyData, function(countryFrom, toData){
                if (countryFrom === FromStatus) {
                    $.each(toData[dataMonth], function(countryTo, currencyData){
                        if (favoriteCurrencyData.indexOf(countryTo) == -1) {
                            content += CountrylisthtmlSecond(countryTo, currencyData["Ex_Rate"], "nonstar_icon", false);
                        }
                    });
                    return false;
                }
            });

            $("ul[data-role='listview'][class^='test']").html("");
            $(tabActiveIDs + " ul").append(content);
            $(tabActiveIDs + " ul").listview('refresh');

            recoveryPageHeight();
        }

        /********************************** html  *************************************/
        function CountrylisthtmlOne(rate, cssClassFrom, favoriteFrom, cssClassTo, favoriteTo) {
            /*
            return '<li data-icon="false" class="1_li CountryA" id="litest">' 
            + '<div class="Listdiv1 select choose ' 
            + '"' + 'id=' + FromStatus + '>' 
            + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' 
            + '<img  class="ListviewFlag1" src ="img/tmp/' + FromStatus + '.png"> ' 
            + '<span class="ListRate1">' + '1 ' + FromStatus + '</span>  ' 
            + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' 
            + '<div class="Listdiv2 select choose"' + 'id=' + ToStatus + '>' 
            + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' 
            + '<img  class="ListviewFlag2" src ="img/tmp/' + ToStatus + '.png">' 
            + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + arrayRate[index] 
            + '</span> ' + '<span class="ListRate2">' + ToStatus + '</span>' + '<br> '
             + '</div>' + '</div>' + '</li>';
            */
            if (favoriteFrom) {
                var favoriteClassFrom = " favorite";
            } else {
                var favoriteClassFrom = "";
            }

            if (favoriteTo) {
                var favoriteClassTo = " favorite";
            } else {
                var favoriteClassTo = "";
            }

            return '<li data-icon="false" class="1_li CountryA" id="litest">' 
                + '<div class="Listdiv1 select choose ' + FromStatus + favoriteClassFrom
                + '"' + 'id=' + FromStatus + '>' 
                + '<img  class="' + cssClassFrom + '" src ="img/tmp/favorite.png"> ' 
                + '<img  class="ListviewFlag1" src ="img/tmp/' + FromStatus + '.png"> ' 
                + '<span class="ListRate1">' + '1 ' + FromStatus + '</span>  ' 
                + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' 
                + '<div class="Listdiv2 select choose ' + ToStatus + favoriteClassTo + '"' + 'id=' + ToStatus + '>' 
                + '<img  class="' + cssClassTo + '" src ="img/tmp/favorite.png"> ' 
                + '<img  class="ListviewFlag2" src ="img/tmp/' + ToStatus + '.png">' 
                + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + rate
                + '</span> ' + '<span class="ListRate2">' + ToStatus + '</span>' + '<br> '
                + '</div>' + '</div>' + '</li>';
        }

        function CountrylisthtmlFirst(country, rate, cssClass, favorite) {
            /*
            return '<li data-icon="false" class="1_li CountryA " id="litest">' 
            + '<div class="Listdiv1 select choose ' + arraycomb[index] + '"' + 'id=' 
            + arraycomb[index] + '>' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' 
            + '<img  class="ListviewFlag1" src ="img/tmp/' + arraycomb[index] + '.png"> ' 
            + '<span class="ListRate1">' + '1 ' + arraycomb[index] + '</span>  '
             + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' + '<div class="Listdiv2">' 
             + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '
             + '<img  class="ListviewFlag2" src ="img/tmp/' + ToStatus + '.png">' 
             + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + arrayratecomb[index] 
             + '</span> ' + '<span class="ListRate2">' + ToStatus + '</span>' + '<br> ' + '</div>' 
             + '</div>' + '</li>';
            */
            if (favorite) {
                var favoriteClass = " favorite";
            } else {
                var favoriteClass = "";
            }

            return '<li data-icon="false" class="1_li CountryA ">' 
                + '<div class="Listdiv1 select choose ' + country + favoriteClass + '"' + 'id=' 
                + country + '>' + '<img  class="' + cssClass + '" src ="img/tmp/favorite.png"> ' 
                + '<img  class="ListviewFlag1" src ="img/tmp/' + country + '.png"> ' 
                + '<span class="ListRate1">' + '1 ' + country + '</span>  '
                + '<div  class="Listdiv1equalmark4">=</div>' + '</div>' + '<div class="Listdiv2">' 
                + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> '
                + '<img  class="ListviewFlag2" src ="img/tmp/' + ToStatus + '.png">' 
                + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + rate 
                + '</span> ' + '<span class="ListRate2">' + ToStatus + '</span>' + '<br> ' + '</div>' 
                + '</div>' + '</li>';
        }

        function CountrylisthtmlSecond(country, rate, cssClass, favorite) {
            /*
            return '<li data-icon="false" class="1_li CountryA" id="litest">' 
            + '<div class="Listdiv1" id=' + FromStatus + '>'
             + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' 
             + '<img  class="ListviewFlag1" src ="img/tmp/' + FromStatus 
             + '.png"> ' + '<span class="ListRate1">' + '1 ' + FromStatus 
             + '</span>  ' + '<div  class="Listdiv1equalmark4">=</div>'
              + '</div>' + '<div class="Listdiv2 select choose ' + arraycomb[index] + '"' 
              + 'id= ' + arraycomb[index] + '>' + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' 
              + '<img  class="ListviewFlag2" src ="img/tmp/' + arraycomb[index] + '.png">'
               + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + arrayratecomb[index] 
               + '</span> ' + '<span class="ListRate2">' + arraycomb[index] + '</span>' + '<br> '
             + '</div>' + '</div>' + '</li>';
            */
            if (favorite) {
                var favoriteClass = " favorite";
            } else {
                var favoriteClass = "";
            }

            return '<li data-icon="false" class="1_li CountryA">' 
                + '<div class="Listdiv1" id=' + FromStatus + '>'
                + '<img  class="nonstar_icon" src ="img/tmp/favorite.png"> ' 
                + '<img  class="ListviewFlag1" src ="img/tmp/' + FromStatus 
                + '.png"> ' + '<span class="ListRate1">' + '1 ' + FromStatus 
                + '</span>  ' + '<div  class="Listdiv1equalmark4">=</div>'
                + '</div>' + '<div class="Listdiv2 select choose ' + country + favoriteClass + '"' 
                + 'id= ' + country + '>' + '<img  class="' + cssClass + '" src ="img/tmp/favorite.png"> ' 
                + '<img  class="ListviewFlag2" src ="img/tmp/' + country + '.png">'
                + '<div class="Listdiv3">' + '<span class="ListDollar1" >' + rate
                + '</span> ' + '<span class="ListRate2">' + country + '</span>' + '<br> '
                + '</div>' + '</div>' + '</li>';
        }

        function Pophtmlfirst() {
            return '<li data-icon="false" class="1_li CountryA" id="litest">' + '<div class="Listdiv1" id=' + '</li>';
        }

        function Pophtmlnext() {
            return '<li data-icon="false" class="1_li CountryA" id="litest">' + '<div class="Listdiv1" id=' + '</div>' + '</li>';
        }

        /********************************** html *************************************/
        /********************************** API*************************************/
        function Jsonparse() {
           // console.log('680.Jsonparse - API');
           // CheckifReloadflag1 = JSON.parse(localStorage.getItem('CheckifReloadflag1'));
           // if ((CheckifReloadflag1) != 1) //first
           // {
           //     console.log("599.first");
           //     Jsonparsecheck();
           // } else {
                var AccountingRate = new GetAccountingRate(); //call API1
           // }
        }

        function Jsonparsecheck() {
            /*
            if (packJsontemp.length == 0) { //norenew
                CheckifReloadflag2 = 1;
            } else {
                CheckifReloadflag2 = 0;
            }
            */
            /* 20170502  add by 新增需求*/
            /*if ((CheckifReloadflag2 == 1) && (CheckifReloadflag1 == 1)) {
                packJsontemp = JSON.parse(localStorage.getItem('packJsontemp'));
                //console.log("690-1. Null use local");
                //console.log("690-3 .run local");
            } else if ((CheckifReloadflag2 != 0) && (CheckifReloadflag1 != 1)) { 
                Parameter = TWOMonthDate;
                var EventList = new GetAccountingRate();
                CheckifReloadflag1 = 1; //Had got all data
                localStorage.setItem("CheckifReloadflag1", JSON.stringify(CheckifReloadflag1));
                //console.log("690-2 .Call again API");
                test=0;
            }*/

            Jsonparsenext();
        }

        function Jsonparsenext() {

            if (window.localStorage.getItem("allCurrencyData") !== null) {
                allCurrencyData = JSON.parse(window.localStorage.getItem("allCurrencyData"));
            }
            if (window.localStorage.getItem("showDataMonth") !== null) {
                showDataMonth = JSON.parse(window.localStorage.getItem("showDataMonth"));
            }
            if (window.localStorage.getItem("latestUpdateDatetime") !== null) {
                latestUpdateDatetime = window.localStorage.getItem("latestUpdateDatetime");
            }

            var packJson = packJsontemp;
            localStorage.setItem("packJsontemp", JSON.stringify(packJsontemp));
            /*
            console.log("720. Jsonparsenext");
            arrayRate = ["1"];
            var arraygetrate = [];
            var arraygetFrom = [];
            var arraygetTo = [];

            var cleartest = 0;
            arrayrateadd = [];
            */
            for (var i = 0; i < packJson.length; i++) {
                getrate = packJson[i].Ex_Rate;
                getfrom = packJson[i].From_Currency;
                getto = packJson[i].To_Currency;
                exdate = packJson[i].Ex_Date;
                Last_update = packJson[i].LAST_UPDATE_DATE;
                arrayLast_update_date.push(Last_update);

                /*
                if ((FromStatus == "All Currency") && (exdate == todayYear + '/0' + Jsonflagnow + '/01')) {
                    if (getto == ToStatus) {
                        arraygetFrom.push(getfrom);
                        arraygetrate.push(getrate);

                        array = arraygetFrom;
                        arrayRate = arraygetrate;
                        //console.log('OK i:' + i + 'Rate:' + getrate + 'from:' + getfrom + 'to:' + getto + 'Data:' + exdate);
                    }
                } else if ((ToStatus == "All Currency") && (exdate == todayYear + '/0' + Jsonflagnow + '/01')) {
                    if (getfrom == FromStatus) {
                        arraygetTo.push(getto);
                        arraygetrate.push(getrate);
                        array = arraygetTo;
                        arrayRate = arraygetrate;

                        //console.log('OK i:' + i + 'Rate:' + getrate + 'from:' + getfrom + 'to:' + getto + 'Data:' + exdate);
                    }
                } else if ((FromStatus != "All Currency") && (ToStatus != "All Currency")) {
                    if ((getfrom == FromStatus) && (getto == ToStatus) && (exdate == todayYear + '/0' + Jsonflagnow + '/01')) //FromStatus   ToStatus 
                    {
                        arraygetrate.push(getrate);
                        arrayRate = arraygetrate;
                        //console.log('OK i:' + i + 'Rate:' + getrate + 'from:' + getfrom + 'to:' + getto + 'Data:' + exdate);
                    }
                }*/

                //Check if the month of Ex_Date is exist in showDataMonth
                var tempExDate = new Date(exdate);
                var tempExDateMonth = parseInt(tempExDate.getMonth() + 1, 10);
                if (showDataMonth.indexOf(tempExDateMonth) == -1) {
                    showDataMonth.push(tempExDateMonth);
                }

                //Process all currency data
                if (allCurrencyData[getfrom] === undefined) {
                    allCurrencyData[getfrom] = {};
                }

                if (allCurrencyData[getfrom][tempExDateMonth] === undefined) {
                    allCurrencyData[getfrom][tempExDateMonth] = {};   
                }

                if (allCurrencyData[getfrom][tempExDateMonth][getto] === undefined) {
                    allCurrencyData[getfrom][tempExDateMonth][getto] = {};
                }

                allCurrencyData[getfrom][tempExDateMonth][getto]["Ex_Date"] = exdate;
                allCurrencyData[getfrom][tempExDateMonth][getto]["Ex_Rate"] = getrate;
            }

            window.localStorage.setItem("allCurrencyData", JSON.stringify(allCurrencyData));

            //According to the Ex_Date, only display the latest 2 month's data
            showDataMonth.sort().reverse();
            showDataMonth.splice(2);
            showDataMonth.reverse();
            window.localStorage.setItem("showDataMonth", JSON.stringify(showDataMonth));

            //Decide the latest_update_datetime
            if (arrayLast_update_date.length > 0) { 
                arrayLast_update_date.sort();
                var b = arrayLast_update_date.length - 1;
                var newDatetime = arrayLast_update_date[b];

                var newDate = new Date(newDatetime);
                var newTimestamp = newDate.TimeStamp();
                var oldDate = new Date(latestUpdateDatetime);
                var oldTimestamp = oldDate.TimeStamp();

                if (newTimestamp > oldTimestamp) {
                    latestUpdateDatetime = newDatetime;
                }

                window.localStorage.setItem("latestUpdateDatetime", latestUpdateDatetime);
            }

            Reorganization();
            Buttonimg();
            Monthchange();

            /*
            for (var i = 0; i < arrayadd.length; i++) {
                var rateindex = array.indexOf(arrayadd[i]);
                if (rateindex >= 0) {
                    var ratetemp = arrayRate[rateindex];
                    arrayrateadd.push(ratetemp);
                    //console.log(arrayadd[i] + '_' + ratetemp);
                } else if (rateindex < 0) {
                    var ratetemp = "NaN";
                    arrayrateadd.push(ratetemp);
                    //console.log(arrayadd[i] + '_' + ratetemp);
                }
            }
            //console.log("Last_date_" + Last_date);
            */
        }

        /********************************** API*************************************/
        function GetAccountingRate() {
            var self = this;

            loadingMask("show");

            var queryDataParameter = "<Last_update_date>" + Parameter + "</Last_update_date>";
            var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

            this.successCallback = function(data) {
                var resultCode = data['ResultCode'];
                if (resultCode == 1) {
                    loadingMask("hide");
                    packJsontemp = data['Content'];
                    Jsonparsecheck();
                }
            };

            this.failCallback = function(data) {
                loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "GetAccountingRate", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        function Expiretime() {
            var storagetimeYear = JSON.parse(localStorage.getItem('localYear'));
            var storagetimeMon = JSON.parse(localStorage.getItem('localMonth'));
            var storagetimeDate = JSON.parse(localStorage.getItem('localDate'));

            if (storagetimeMon != null) {
                window.UTCtime = Math.round(Date.UTC(storagetimeYear, storagetimeMon - 1, storagetimeDate) / 1000);
                Parameter = UTCtime;
            } else if (storagetimeMon == null) {
                Parameter = TWOMonthDate;
            }

            localStorage.setItem("localYear", JSON.stringify(todayYear));
            localStorage.setItem("localMonth", JSON.stringify(todayMonth));
            localStorage.setItem("localDate", JSON.stringify(todayDate));

            Jsonparse();
        }

        function dataListView(popupID) {
            popupID = popupID || null;

            //Decide to show which month
            if (tabActiveIDs === "#fragment-1") {
                dataMonth = showDataMonth[0];
            } else {
                dataMonth = showDataMonth[1];
            }

            if (FromStatus == "All Currency") {
                AddhtmlFirst();
            }

            if (ToStatus == "All Currency") {
                AddhtmlSecond();
            }

            if (FromStatus != "All Currency" && ToStatus != "All Currency") {
                AddhtmlOne(popupID);

                //Prevent PAge Scorll
                $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
                    'height': deviceHeight
                });

                $('.ui-page-active.ui-page').css({
                    'min-height': deviceHeight
                });
            }
        }

        function recoveryPageHeight() {
            var pageHeight = $(tabActiveIDs).height() + $(".tabs-top-fixed").height() + $(".mainword").height() + parseInt($(".mainword").css("marginTop"), 10);
            $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
                'height': pageHeight
            });

            $('.ui-page-active.ui-page').css({
                'min-height': pageHeight
            });

            $('.ui-page-active .ui-tabs').css({
                'overflow-y': 'hidden'
            });

            footerFixed();
        }

        function popupResizeProcess(popupID) {
            //Resize listview
            var popupHeight = $("#" + popupID).height();
            var popupHeaderHeight = $("#" + popupID).find("div[data-role='main'] .header").height();
            //ui-content paddint-top:5.07vw
            var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);
            //Ul margin-top:5.07vw
            var ulMarginTop = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);
            //Ul margin-bottom:5.07vw
            var ulMarginBottom = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - uiContentPaddingHeight - ulMarginTop - ulMarginBottom, 10);
            $("#" + popupID).find("div[data-role='main'] .main").height(popupMainHeight);
        }

        function popupPositionProcess(popupID) {
            //Set Position
            var popupWidth = $("#" + popupID + "-popup").width();
            var popupHeight = $("#" + popupID + "-popup").height();
            var top = parseInt((document.documentElement.clientHeight - popupHeight) / 2, 10);
            $("#" + popupID + "-popup").css("top", top + "px");

            //Remove JQM CSS
            $("#" + popupID).find("div[data-role='main'] .main li").removeClass("ui-li-static ui-body-inherit ui-first-child");
            $("#" + popupID).find("div[data-role='main'] .main").removeClass("ui-listview");
        }

        function popupDataProcess(popupID) {
            var selectedCountry;
            var hiddenCountry;
            var showAllCountryOption = false;
            var noDataCountry = allCountry.slice();
            var dataList = $("#" + popupID).find("li");

            $(dataList).removeClass("tpl-option-msg-list tpl-dropdown-list-selected");
            $(dataList).addClass("tpl-option-msg-list");
            $(dataList).css("display", "block");
            $("#" + popupID).find("hr").css("display", "block");

            if (popupID === "popupA") {
                selectedCountry = FromStatus;
                hiddenCountry = ToStatus
            } else if (popupID === "popupB") {
                selectedCountry = ToStatus;
                hiddenCountry = FromStatus;
            }

            //If the ToStatus has no currency data, don't display this counry in datalist
            if (popupID === "popupA") {
                if (FromStatus == "All Currency" && ToStatus != "All Currency" || 
                    FromStatus != "All Currency" && ToStatus != "All Currency") {

                    $.each(allCurrencyData, function(countryFrom, toData){
                        var currencyExist = false;

                        $.each(toData[dataMonth], function(countryTo, currencyData){
                            if (countryTo === ToStatus) {
                                currencyExist = true;
                            }
                        });

                        if (currencyExist) {
                            var countryIndex = noDataCountry.indexOf(countryFrom);
                            if (countryIndex != -1) {
                                noDataCountry.splice(countryIndex, 1);
                            }
                        }
                    });

                    showAllCountryOption = true;
                } else if (FromStatus != "All Currency" && ToStatus == "All Currency") {
                    noDataCountry = [];
                }
            }

            if (popupID === "popupB") {
                if (FromStatus != "All Currency") {
                    $.each(allCurrencyData, function(countryFrom, toData){
                        if (countryFrom === FromStatus) {
                            $.each(toData[dataMonth], function(countryTo, currencyData){
                                var countryIndex = noDataCountry.indexOf(countryTo);
                                if (countryIndex != -1) {
                                    noDataCountry.splice(countryIndex, 1);
                                }
                            });
                        }
                    });

                    showAllCountryOption = true;
                } else if (FromStatus == "All Currency") {
                    noDataCountry = [];
                }
            }

            $.each(dataList, function(liIndex, liContent) {
                var hidden = false;
                var countryName = $(liContent).find(".ListRate1popup").html();

                if (countryName === selectedCountry) {
                    $(liContent).addClass("tpl-dropdown-list-selected");
                }

                if (countryName === hiddenCountry) {
                    hidden = true;
                }

                if (noDataCountry.indexOf(countryName) != -1) {
                    hidden = true;
                }

                //Option [All Country]
                if (liIndex == 0 && !showAllCountryOption) {
                    hidden = true;
                }

                if (hidden) {
                    //remove hr beside this data
                    $("#" + popupID).find("hr:eq(" + liIndex + ")").css("display", "none");
                    $(liContent).css("display", "none");
                }
            });

        }

        /********************************** dom event *************************************/
        $(document).one("popupafteropen", "#popupA", function() {
            popupResizeProcess("popupA");
        });

        $(document).on({
            popupafteropen: function() {
                popupPositionProcess("popupA");
                popupDataProcess("popupA");
            },
            popupbeforeposition: function() {
                tplJS.preventPageScroll();
            },
            click: function(event) {
                //close popup
                if ($(event.target).hasClass("close-popup")) {
                    $("#popupA").popup("close");
                    tplJS.recoveryPageScroll();
                }
                //select country
                if ($(event.target).hasClass("popListdiv1")) {
                    FromStatus = $(event.target).find(".ListRate1popup").text();
            
                    $("#popupA").popup('close');
                    footerFixed();
                    tplJS.recoveryPageScroll();

                    Monthchange();
                    dataListView();
                    Buttonimg();
                }                
            }
        }, "#popupA");

        $(document).one("popupafteropen", "#popupB", function() {
            popupResizeProcess("popupB");
        });

        $(document).on({
            popupafteropen: function() {
                popupPositionProcess("popupB");
                popupDataProcess("popupB");
            },
            popupbeforeposition: function() {
                tplJS.preventPageScroll();
            },
            click: function(event) {
                //close popup
                if ($(event.target).hasClass("close-popup")) {
                    $("#popupB").popup("close");
                    tplJS.recoveryPageScroll();
                }
                //select country
                if ($(event.target).hasClass("popListdiv1")) {
                    ToStatus = $(event.target).find(".ListRate1popup").text();
            
                    $("#popupB").popup('close');
                    footerFixed();
                    tplJS.recoveryPageScroll();

                    Monthchange();
                    dataListView();
                    Buttonimg();
                }                
            }
        }, "#popupB");
    }
});
