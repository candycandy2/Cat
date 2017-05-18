$("#viewAccount").pagecontainer({
    create: function(event, ui) {

        var showDataMonth = []; //Which months should be displayed
        var allCurrencyData = {};
        var favoriteCurrencyData = ["NTD", "USD", "EUR"];
        var dataMonth;
        var allCountry = [];
        var deviceHeight;
        var getFavoriteData = false;
        var latestUpdateDatetime = "0";
        var resizePopupA = false;
        var resizePopupB = false;
        var popupMinHeight = 0;

        var MonthWord = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var FromStatus = "USD" ;
        var ToStatus = "All Currency";
        var tabActiveIDs;
        var checkDefaultActiveTab = false;
        var packJsontemp = [];
        var arrayLast_update_date = [];
        var statuscountrypop;
        var TWOMonthDate = 0;

        /********************************** Calculate Date *************************************/
        window.Today = new Date();
        var todayYear = Today.getFullYear();
        var todayMonth = Today.getMonth() + 1;
        var todayDate = Today.getDate();
        var lastMonth = Today.getMonth();
        var date = new Date(todayYear, todayMonth - 1, todayDate);
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 60);
        var nd = new Date(newDate);
        TWOMonthDate = Math.round(nd / 1000);
        var Parameter = TWOMonthDate;

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

                    localStorage.setItem("localYear", JSON.stringify(todayYear));
                    localStorage.setItem("localMonth", JSON.stringify(todayMonth));
                    localStorage.setItem("localDate", JSON.stringify(todayDate));
                }
                dataListView();
            };

            this.failCallback = function(data) {
                loadingMask("hide");
            };

            var __construct = function() {
                CustomAPI("POST", true, "GetAccountingRate", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        /********************************** page event *************************************/
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {
            Expiretime();

            /* global PullToRefresh */
            PullToRefresh.init({
                mainElement: '#fragment-1',
                onRefresh: function() {
                    //do something for refresh
                    Expiretime();
                }
            });
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

        /********************************** html *************************************/
        function AddhtmlOne() {

            var content = "";
            var currencyRate;

            $.each(allCurrencyData, function(countryFrom, toData){
                if (countryFrom === FromStatus) {
                    $.each(toData[dataMonth], function(countryTo, currencyData){
                        if (countryTo === ToStatus) {
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

            footerFixed();
        }

        function AddhtmlFirst() {

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

            recoveryPageHeight();
        }

        function AddhtmlSecond() {

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
            
            recoveryPageHeight();
        }

        /********************************** html  *************************************/
        function CountrylisthtmlOne(rate, cssClassFrom, favoriteFrom, cssClassTo, favoriteTo) {
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
                + '</div>' + '</div>' + '</li><hr class="ui-hr ui-hr-option">';
        }

        function CountrylisthtmlFirst(country, rate, cssClass, favorite) {
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
                + '</div>' + '</li><hr class="ui-hr ui-hr-option">';
        }

        function CountrylisthtmlSecond(country, rate, cssClass, favorite) {
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
                + '</div>' + '</div>' + '</li><hr class="ui-hr ui-hr-option">';
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

            var AccountingRate = new GetAccountingRate(); //call API1
        }

        function Jsonparsecheck() {
            Jsonparsenext();
        }

        function Jsonparsenext() {

            if (window.localStorage.getItem("allCountry") !== null) {
                allCountry = JSON.parse(window.localStorage.getItem("allCountry"));
            }
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

            for (var i = 0; i < packJson.length; i++) {
                getrate = packJson[i].Ex_Rate;
                getfrom = packJson[i].From_Currency;
                getto = packJson[i].To_Currency;
                exdate = packJson[i].Ex_Date;
                Last_update = packJson[i].LAST_UPDATE_DATE;
                arrayLast_update_date.push(Last_update);

                //Get All Country Data From API
                if (allCountry.indexOf(getfrom) == -1) {
                    allCountry.push(getfrom);
                }
                if (allCountry.indexOf(getto) == -1) {
                    allCountry.push(getto);
                }

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

            allCountry.sort();
            window.localStorage.setItem("allCountry", JSON.stringify(allCountry));

            //According to the Ex_Date, only display the latest 2 month's data
            showDataMonth.sort().reverse();
            showDataMonth.splice(2);
            showDataMonth.reverse();
            window.localStorage.setItem("showDataMonth", JSON.stringify(showDataMonth));

            //Remove the old data
            //ex: if now have data of month [4,5,6], and now date is June, then remove data of month [4]
            $.each(allCurrencyData, function(countryFrom, toData){
                $.each(toData, function(month, currencyData){
                    if (showDataMonth.indexOf(parseInt(month, 10)) == -1) {
                        delete allCurrencyData[countryFrom][month];
                    }
                });
            });
            window.localStorage.setItem("allCurrencyData", JSON.stringify(allCurrencyData));

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
        }

        /********************************** Favorite*************************************/
        function Reorganization() {

            //Get favorite Only once atfer open APP
            if (!getFavoriteData) {
                if (window.localStorage.getItem("favoriteCurrencyData") !== null) {
                    favoriteCurrencyData = JSON.parse(window.localStorage.getItem("favoriteCurrencyData"));
                }
                getFavoriteData = true;
            }

            //Sort Favorite Data, if [NTD] exist, [NTD] should be the first data
            if (favoriteCurrencyData.indexOf("NTD") == -1) {
                favoriteCurrencyData.sort();
            } else {
                var NTD = ["NTD"];
                var NTDIndex = favoriteCurrencyData.indexOf("NTD");
                favoriteCurrencyData.splice(NTDIndex, 1);

                var tempData = favoriteCurrencyData;
                tempData.sort();
                favoriteCurrencyData = NTD.concat(tempData);
            }
            window.localStorage.setItem("favoriteCurrencyData", JSON.stringify(favoriteCurrencyData));
            dataListView();
        }

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
            } else {
                $(".buttonone1").removeClass('buttononeFlag1non');
                $(".buttonone1").addClass('buttononeFlag1');
            }

            if (ToStatus == "All Currency") {
                $(".buttontwo1").removeClass('buttononeFlag2');
                $(".buttontwo1").addClass('buttononeFlag1non');
            } else {
                $(".buttontwo1").removeClass('buttononeFlag1non');
                $(".buttontwo1").addClass('buttononeFlag2');
            }
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
        }

        function dataListView(popupID) {
            popupID = popupID || null;

            //According to the date of device, decide the default month
            if (checkDefaultActiveTab == false) {
                var activeTabIndex;

                if (todayMonth == showDataMonth[0]) {
                    activeTabIndex = 0;
                    tabActiveIDs = "#fragment-1";
                } else if (todayMonth == showDataMonth[1]) {
                    activeTabIndex = 1;
                    tabActiveIDs = "#fragment-2";
                }

                $("#tabevent a:eq(" + activeTabIndex + ")").addClass("ui-btn-active");
                $("#tabevent").tabs({ active: activeTabIndex });

                checkDefaultActiveTab = true;
            }

            //Decide to show which month
            if (tabActiveIDs === "#fragment-1") {
                dataMonth = showDataMonth[0];
            } else {
                dataMonth = showDataMonth[1];
            }

            if (FromStatus == "All Currency" && ToStatus == "All Currency") {
                $("ul[data-role='listview'][class^='test']").html("");
                $(".info-string").hide();
                $(".error-string").show();
                tplJS.preventPageScroll();
            } else {
                $(".info-string").show();
                $(".error-string").hide();
                tplJS.recoveryPageScroll();

                if (FromStatus == "All Currency") {
                    AddhtmlFirst();
                }

                if (ToStatus == "All Currency") {
                    AddhtmlSecond();
                }

                if (FromStatus != "All Currency" && ToStatus != "All Currency") {
                    AddhtmlOne(popupID);

                    //Prevent Page Scorll
                    $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
                        'height': deviceHeight
                    });

                    $('.ui-page-active.ui-page').css({
                        'min-height': deviceHeight
                    });
                }
            }
        }

        function recoveryPageHeight() {
            var pageHeight = $(tabActiveIDs).height() + $(".tabs-top-fixed").height() + $(".mainword").height() + parseInt($(".mainword").css("marginTop"), 10);
            $('.ui-page-active .page-main, .ui-page-active .ui-tabs').css({
                'height': pageHeight + "px"
            });

            $('.ui-page-active.ui-page').css({
                'height': parseInt(pageHeight + 5, 10) + "px",
                'min-height': parseInt(pageHeight + 5, 10) + "px"
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

            if (popupMinHeight === 0) {
                popupMinHeight = popupMainHeight;
            } else {
                if (popupMainHeight < popupMinHeight) {
                    popupMainHeight = popupMinHeight;
                }
            }

            $("#" + popupID).find("div[data-role='main'] .main").height(popupMainHeight);

            popupPositionProcess(popupID);
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
            var showAllCountryOption = true;
            var dataListCountry = [];
            var dataListContent = "";

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
                                dataListCountry.push(countryFrom);
                            }
                        });
                    });

                    showAllCountryOption = true;
                } else if (FromStatus != "All Currency" && ToStatus == "All Currency") {
                    $.each(allCurrencyData, function(countryFrom, toData){
                        var countryIndex = allCountry.indexOf(countryFrom);
                        if (countryIndex != -1) {
                            dataListCountry.push(countryFrom);
                        }
                    });
                } else if (FromStatus == "All Currency" && ToStatus == "All Currency") {
                    dataListCountry = allCountry;
                }
            }

            if (popupID === "popupB") {
                if (FromStatus != "All Currency") {
                    $.each(allCurrencyData, function(countryFrom, toData){
                        if (countryFrom === FromStatus) {
                            $.each(toData[dataMonth], function(countryTo, currencyData){
                                dataListCountry.push(countryTo);
                            });
                        }
                    });

                    showAllCountryOption = true;
                } else if (FromStatus == "All Currency") {
                    dataListCountry = allCountry;
                }
            }

            var popupListLiHTML = $("template#tplPopupListLi").html();

            if (showAllCountryOption) {
                var popupListLi = $(popupListLiHTML);

                if (selectedCountry === "All Currency") {
                    popupListLi.addClass("tpl-dropdown-list-selected");
                }

                popupListLi.find(".ListviewFlag1popup").prop("src", "img/tmp/all.png");
                popupListLi.find(".ListRate1popup").html("All Currency");
                dataListContent += popupListLi[0].outerHTML + popupListLi[2].outerHTML;
            }

            for (var i=0; i<dataListCountry.length; i++) {
                var popupListLi = $(popupListLiHTML);

                if (selectedCountry === dataListCountry[i]) {
                    popupListLi.addClass("tpl-dropdown-list-selected");
                }

                popupListLi.find(".ListviewFlag1popup").prop("src", "img/tmp/" + dataListCountry[i] + ".png");
                popupListLi.find(".ListRate1popup").html(dataListCountry[i]);
                dataListContent += popupListLi[0].outerHTML + popupListLi[2].outerHTML;
            }

            $("#" + popupID).find("ul").html("");
            $("#" + popupID).find("ul").append(dataListContent);

            if (popupID === "popupA" && !resizePopupA) {
                popupResizeProcess("popupA");
                resizePopupA = true;
            }
            if (popupID === "popupB" && !resizePopupB) {
                popupResizeProcess("popupB");
                resizePopupB = true;
            }
        }

        /********************************** dom event *************************************/
        $(document).on("tabsactivate", function(event, ui) {
            tabActiveIDs = ui.newPanel.selector;
            dataListView();
        });

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
            Buttonimg();
            dataListView();
        });

        /********************************** Popup *************************************/
        $(document).on("click", "#eventWorkConfirmA .confirm", function() {
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

        //Popup - Select Country
        $(document).on({
            popupafteropen: function() {
                var domID = $(this).prop("id");
                popupPositionProcess(domID);
                popupDataProcess(domID);
            },
            popupbeforeposition: function() {
                tplJS.preventPageScroll();
            },
            popupafterclose: function() {
                footerFixed();
            },
            click: function(event) {
                var domID = $(this).prop("id");

                //close popup
                if ($(event.target).hasClass("close-popup")) {
                    $("#" + domID).popup("close");
                    tplJS.recoveryPageScroll();
                }

                //select country
                if ($(event.target).is("[class*='List']")) {
                    //Find Country Name
                    var domParent = $(event.target);
                    if ($(event.target).hasClass("ListviewFlag1popup") || $(event.target).hasClass("ListRate1popup")) {
                        domParent = $(event.target).parent();
                    }

                    if (domID === "popupA") {
                        FromStatus = domParent.find(".ListRate1popup").text();
                    } else if (domID === "popupB") {
                        ToStatus = domParent.find(".ListRate1popup").text();
                    }

                    $("#" + domID).popup('close');
                    footerFixed();
                    tplJS.recoveryPageScroll();

                    Monthchange();
                    dataListView();
                    Buttonimg();
                }
            }
        }, ".app-popup");

        //Scenario
        $("#deleteTest").on("click", function() {
            $("#testContent").hide();
        });

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
        });
    }
});
