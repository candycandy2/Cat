var chart, ro, product, tab, year, month, actualValue, budgetHitRate, yoyGrowth;
var hcRo = "All";
var hcProduct = "All product";
var productList = '<a id="ALL">ALL</a>';
var monthlyHighchartsData = {
	"Actual QTY" : {},
	"Actual AMT" : {},
	"Actual ASP" : {}, 
	"Budget QTY" : {},
	"Budget AMT" : {},
	"Budget ASP" : {}
};
var monthlyHitRateData = {
	"QTY" : [],
	"AMT" : [],
	"ASP" : []
}

$("#viewMonthlyHitRate").pagecontainer({
    create: function(event, ui) {

        window.UserAuthority = function() {
            var index = 0;   
            this.successCallback = function(data) {
                userAuthoritycallbackData = data["Content"]["DataList"];
                length = userAuthoritycallbackData.length;
                for(var i=0; i<length; i++) {
                    for(var j in userAuthoritycallbackData[i]) {
                        if(userAuthoritycallbackData[i][j] == "PRODUCT") {
                            productList += '<a id="' + userAuthoritycallbackData[i]["PVALUE"] + '">' + userAuthoritycallbackData[i]["PVALUE"] + '</a>' ;
                        }
                    }
                }
                $(".Product").html("");
                $(".Product").append(productList).enhanceWithin();
                setScrollMenuHeight();

                year = thisYear-1;
                month = thisMonth;
                while(index < 13) {
                    monthlyPageDateList += "<div>" + monTable[month] + year + "</div>";
                    monthlyPageDate[index] = month + "." + year;
                    if(month == 12){
                        year++;
                        month = 0;
                    }
                    month++;
                    index++;
                }
                $(".sliderMonthly").html("");
                $(".sliderMonthly").append(monthlyPageDateList).enhanceWithin();
                
                index = 0;
                year = thisYear-1;
                month = thisMonth;
                while(index < 2) {
                    ytdPageDateList += "<div>" + year + "</div>";
                    if(year == thisYear) {
                        ytdPageDate[index] = thisMonth + "." + year;
                    }else{
                        ytdPageDate[index] = 12 + "." + year;
                    }
                    index++;
                    year++;
                }
                $(".sliderYTD").html("");
                $(".sliderYTD").append(ytdPageDateList).enhanceWithin();

                loadingMask("hide");
            };
            this.failCallback = function(data) {
                console.log("api misconnected");
            };
            var _construct = function() {
                CustomAPI("POST", true, "UserAuthority", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        window.ProductDetail = function() {
            this.successCallback = function(data) {
                productDetailcallbackData = data["Content"]["DataList"];
                length = productDetailcallbackData.length;
                convertData();
            }

            this.failCallback = function(data) {
                console.log("api misconnected");
            }

            var _constrcut = function() {
                CustomAPI("POST", true, "ProductDetail", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        function getActualValue(ro, product, year, month, type) {
            var actualIndex;
            var Actual = 0;
            var totalAMT = 0;
            var totalQTY = 0;
            if(type == "QTY") {
                actualIndex = 0;
            }else if(type == "AMT") {
                actualIndex = 2;
            }
            if(ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        totalQTY += eisdata[year][month][i][j][0];
                        totalAMT += eisdata[year][month][i][j][2];
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    totalQTY += eisdata[year][month][ro][i][0];
                    totalAMT += eisdata[year][month][ro][i][2];
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    totalQTY += eisdata[year][month][i][product][0];
                    totalAMT += eisdata[year][month][i][product][2];
                }
            }else {
                Actual = eisdata[year][month][ro][product][actualIndex];
                totalQTY = eisdata[year][month][ro][product][0];
                totalAMT = eisdata[year][month][ro][product][2];
            }
            if(type == "ASP") {
                if(totalQTY != 0) {
                    Actual = (totalAMT / totalQTY);
                }else {
                    Actual = 0;
                }
            }
            return Math.round(Actual * Math.pow(10, 2)) / 100;
        }

        function getBudgetHitRate(ro, product, year, month, type) {
            var actualIndex, budgetIndex, result;
            var Actual = 0;
            var Budget = 0;
            var ActualAMT = 0;
            var ActualQTY = 0;
            var BudgetAMT = 0;
            var BudgetQTY = 0;
            if(type == "QTY") {
                actualIndex = 0;
                budgetIndex = 1;
            }else if(type == "AMT") {
                actualIndex = 2;
                budgetIndex = 3;
            }
            if(ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        Budget += eisdata[year][month][i][j][budgetIndex];
                        ActualQTY += eisdata[year][month][i][j][0];
                        BudgetQTY += eisdata[year][month][i][j][1];
                        ActualAMT += eisdata[year][month][i][j][2];
                        BudgetAMT += eisdata[year][month][i][j][3];
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    Budget += eisdata[year][month][ro][i][budgetIndex];
                    ActualQTY += eisdata[year][month][ro][i][0];
                    BudgetQTY += eisdata[year][month][ro][i][1];
                    ActualAMT += eisdata[year][month][ro][i][2];
                    BudgetAMT += eisdata[year][month][ro][i][3];
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    Budget += eisdata[year][month][i][product][budgetIndex];
                    ActualQTY += eisdata[year][month][i][product][0];
                    BudgetQTY += eisdata[year][month][i][product][1];
                    ActualAMT += eisdata[year][month][i][product][2];
                    BudgetAMT += eisdata[year][month][i][product][3];
                }
            }else {
                Actual = eisdata[year][month][ro][product][actualIndex];
                Budget = eisdata[year][month][ro][product][budgetIndex];
                ActualQTY = eisdata[year][month][ro][product][0];
                BudgetQTY = eisdata[year][month][ro][product][1];
                ActualAMT = eisdata[year][month][ro][product][2];
                BudgetAMT = eisdata[year][month][ro][product][3];
            }
            if(type == "ASP") {
                if(BudgetQTY != 0 && BudgetAMT != 0 && ActualQTY != 0) {
                    return Math.round(((ActualAMT/ActualQTY) / (BudgetAMT/BudgetQTY)) * Math.pow(10, 4)) / 100;
                }else {
                    return 0;
                }
            }
            if(Budget != 0) {
                return Math.round((Actual / Budget) * Math.pow(10, 4)) / 100;
            }else {
                return 0;
            }
        }

        function getYOYGrowth(ro, product, year, month, type) {
            var actualIndex;
            var Actual = 0;
            var lastActual = 0;
            var ActualAMT = 0;
            var ActualQTY = 0;
            var lastActualAMT = 0;
            var lastActualQTY = 0;
            if(type == "QTY") {
                actualIndex = 0;
            }else if(type == "AMT") {
                actualIndex = 2;
            }
            if (ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {    //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        ActualQTY += eisdata[year][month][i][j][0];
                        ActualAMT += eisdata[year][month][i][j][2];
                        if(eisdata[year-1][month][i].hasOwnProperty(j)){
                            lastActual += eisdata[year-1][month][i][j][actualIndex];
                            lastActualQTY += eisdata[year-1][month][i][j][0];
                            lastActualAMT += eisdata[year-1][month][i][j][2];
                        }
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    ActualQTY += eisdata[year][month][ro][i][0];
                    ActualAMT += eisdata[year][month][ro][i][2];
                    if(eisdata[year-1][month][ro].hasOwnProperty(i)) {
                        lastActual += eisdata[year-1][month][ro][i][actualIndex];
                        lastActualQTY += eisdata[year-1][month][ro][i][0];
                        lastActualAMT += eisdata[year-1][month][ro][i][2];
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    ActualQTY += eisdata[year][month][i][product][0];
                    ActualAMT += eisdata[year][month][i][product][2];
                    if(eisdata[year-1][month][i].hasOwnProperty(product)) {
                        lastActual += eisdata[year-1][month][i][product][actualIndex];
                        lastActualQTY += eisdata[year-1][month][i][product][0];
                        lastActualAMT += eisdata[year-1][month][i][product][2];
                    }
                }
            }else {
                if(eisdata[year-1][month][ro].hasOwnProperty(product)) {
                    Actual = eisdata[year][month][ro][product][actualIndex];
                    lastActual = eisdata[year-1][month][ro][product][actualIndex];
                    ActualQTY = eisdata[year][month][ro][product][0];
                    ActualAMT = eisdata[year][month][ro][product][2];                    
                    lastActualQTY = eisdata[year-1][month][ro][product][0];
                    lastActualAMT = eisdata[year-1][month][ro][product][2];
                }
            }
            if(type == "ASP") {
                if(lastActualQTY != 0 && lastActualAMT != 0 && ActualQTY != 0) {
                    return Math.round((((ActualAMT/ActualQTY) / (lastActualAMT/lastActualQTY)) - 1)* Math.pow(10, 4)) / 100;
                }else {
                    return 0;
                }
            }
            if(lastActual != 0){
                return Math.round(((Actual / lastActual) - 1) * Math.pow(10, 4)) / 100;
            }else {
                return 0;
            }
        }

        function getHighchartsData(ro, product) {
            if(ro == "ALL" && product == "ALL") {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                    	monthlyHighchartsData[i][hcYear] = [];
                    }
                    for(var month in eisdata[hcYear]) {
                    	for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        for(var ro in eisdata[hcYear][month]) {
                            for(var product in eisdata[hcYear][month][ro]) {
                                monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][0];
                                monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][1];
                                monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][2];
                                monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][3];
                            }
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                    	monthlyHighchartsData[i][hcYear] = []; 
                    }
                    for(var month in eisdata[hcYear]) {
                        for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        for(var product in eisdata[hcYear][month][ro]) {
                        	monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][0];
                        	monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][1];
                            monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][2];
                            monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][3];
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                    	monthlyHighchartsData[i][hcYear] = []; 
                    }
                    for(var month in eisdata[hcYear]) {
                    	for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        for(var ro in eisdata[hcYear][month]) {
                            if(eisdata[hcYear][month][ro].hasOwnProperty(product)) {
								monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][0];
								monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][1];
								monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][2];
								monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][3];
                            }
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }else {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                    	monthlyHighchartsData[i][hcYear] = []; 
                    }
                    for(var month in eisdata[hcYear]) {
                    	for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        if(eisdata[hcYear][month][ro].hasOwnProperty(product)) {
                        	monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][0];
                        	monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][1];
                            monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][2];
                            monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][3];  
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }
            if(year == thisYear) {
                for(var i=thisYear-3; i<thisYear; i++) {
                    monthlyHighchartsData["Actual QTY"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Actual AMT"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Actual ASP"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Budget QTY"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Budget AMT"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Budget ASP"][i].splice(Number(thisMonth), 11);
                }
            }
        }

        function showData() {
            $("#title-content #ActualValue p").text(formatNumber(actualValue));
            $("#title-content #BudgetHitRate p").text(formatNumber(budgetHitRate) + "%");
            if(budgetHitRate < 80) {
                $("#title-content #BudgetHitRate p").css("color", "#ee3839");
            }else if(budgetHitRate > 95) {
                $("#title-content #BudgetHitRate p").css("color", "#48af56");
            }else {
                $("#title-content #BudgetHitRate p").css("color", "#e6be20");
            }
            if(yoyGrowth < 0) {
                $("#title-content #YOYGrowth p").text(formatNumber(yoyGrowth) + "%");
                $("#title-content #YOYGrowth p").css("color", "#ee3839");
            }else {
                $("#title-content #YOYGrowth p").text("+" + formatNumber(yoyGrowth) + "%");
                $("#title-content #YOYGrowth p").css("color", "#48af56");
            }
        }

        function convertData() {
            var month, rosite;
            var ActualASP = 0;
            var BudgetASP = 0;
            var index = 0;
            for(var i=productDetailcallbackData[0]["YEAR"]; i<=productDetailcallbackData[length-1]["YEAR"]; i++) {
                eisdata[i] = {};
                month = (i == productDetailcallbackData[length-1]["YEAR"]) ? (productDetailcallbackData[length-1]["MONTH"]) : 12;  
                for(var j=1; j<=month; j++) {
                    eisdata[i][j] = {};
                    while(index<length && j == productDetailcallbackData[index]["MONTH"]) {
                        rosite = productDetailcallbackData[index]["RO_SITE"];
                        eisdata[i][j][rosite] = {};
                        while(index<length && rosite == productDetailcallbackData[index]["RO_SITE"]) {
                            eisdata[i][j][rosite][productDetailcallbackData[index]["PRODUCT"]] = [
                                Number(productDetailcallbackData[index]["ACTUAL_QTY"]),
                                Number(productDetailcallbackData[index]["BUDGET_QTY"]),
                                Number(productDetailcallbackData[index]["ACTUAL_ADJ_AMT"]),
                                Number(productDetailcallbackData[index]["BUDGET_AMT"])
                            ];
                            ActualASP = 0;
                            BudgetASP = 0;
                            index++;
                        }
                    }
                }
            }
        }

        function setScrollMenuHeight() {
            $('div.scrollmenu a').css({'width': ($('body').width()-5)/6});
        }

        function initSlider() {
            if($(".sliderMonthly").hasClass("slick-slider") || $(".sliderMonthly").hasClass("slick-initialized")){
                $(".sliderMonthly").slick("unslick");
            }
            $(".sliderMonthly").slick({
                initialSlide: 0,
                autopaly: false,
                dots: false,
                responseive: [{
                    breakpoint: 500,
                    settings: {
                        arrows: true,
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }],
                infinite: false
            });
        }

        $(".sliderMonthly").on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            year = monthlyPageDate[nextSlide].match(/([0-9]{0,2})\.([0-9]{0,4})/)[2];
            month = monthlyPageDate[nextSlide].match(/([0-9]{0,2})\.([0-9]{0,4})/)[1];
            getHighchartsData(ro, product);
            chart.series[0].update({name: (year-2) + "  Actual " + tab, data: monthlyHighchartsData["Actual " + tab][year-2]});
            chart.series[1].update({name: (year-1) + "  Actual " + tab, data: monthlyHighchartsData["Actual " + tab][year-1]});
            chart.series[2].update({name: (year) + "  Actual " + tab, data: monthlyHighchartsData["Actual " + tab][year]});
            chart.series[3].update({name: (year) + "  Budget " + tab, data: monthlyHighchartsData["Budget " + tab][year]});
            chart.tooltip.hide();
            actualValue = getActualValue(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
        });

        function showHighchart() {
            chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'viewMonthlyHitRate-hc-canvas',
                    marginBottom: 80,
                    marginTop: 20,
                    marginLeft: 35,
                    marginRight: 35
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Month',
                        align: 'high',   
                        x: 31,
                        y: -18
                    },
                    tickInterval: 1,
                    max: 12,
                    min: 1,
                    crosshair: true,
                },
                yAxis: [{
                    title: {
                        text: ''
                    },
                    labels: {
                        x: -2
                    },
                    min: 0,
                }, {
                    title: {
                        text: '',
                    },
                    labels: {
                        x: 5
                    },
                    opposite: true,
                    min: 0,
                }],
                legend: {
                    align: 'left',
                    float: true,
                    x: -7,
                    y: 13
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        var index = 0;
                        var s = '<b>' + hcRo + ' Hit Rate - ' + hcProduct + '</b>';
                        var dollar = "$";
                        var detailInfo = [];
                        if(tab == "QTY"){
                            dollar = "";
                        }
                        $.each(this.points, function () {
                            if(tab == "ASP"){
                                this.y = Math.round(this.y * Math.pow(10, 2)) / 100;
                            }
                            detailInfo[index++] = '<br/>' + hcTable[this.x] + ' ' + this.series.name + ' = ' + dollar + formatNumber(this.y);
                        });
                        for(var i=0; i<detailInfo.length; i++) {
                            s += detailInfo[--index];
                        }
                        return s;
                    },
                    shared: true,
                    useHTML: true,
                    hideDelay: 0,
                    crosshairs: false
                },
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0,
                        pointStart: 1
                    },
                    line: {
                        pointStart: 1
                    }
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: (year-2) + " Actual QTY",
                    type: 'column',
                    color: '#0AB5B6',
                }, {
                    name: (year-1) + " Actual QTY",
                    type: 'column',
                    color: '#F4A143',
                }, {
                    name: (year) + " Actual QTY",
                    type: 'column',
                    color: '#824E9F',
                }, {
                    name: (year) + " Budget QTY",
                    type: 'line',
                    color: '#134A8C',
                    lineWidth: 1,
                    yAxis: 1
                }]
            });
        }

        /********************************** page event *************************************/
        $("#viewMonthlyHitRate").on("pageshow", function(event, ui) {
            ro = "ALL";
            product = "ALL";
            tab = "QTY";
            year = thisYear;
            month = thisMonth;
            hcRo = "All";
            hcProduct = "All product";
            initSlider();
            $(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            getHighchartsData(ro, product);
            showHighchart();
            showData();
            chart.series[0].setData(monthlyHighchartsData["Actual " + tab][year-2], false, false, false);
            chart.series[1].setData(monthlyHighchartsData["Actual " + tab][year-1], false, false, false);
            chart.series[2].setData(monthlyHighchartsData["Actual " + tab][year], false, false, false);
            chart.series[3].setData(monthlyHighchartsData["Budget " + tab][year], false, false, false);
            $("#viewMonthlyHitRate #title-container > #title > #actualValue > p").text("Net Quantity");
            $("label[for=viewMonthlyHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewMonthlyHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewMonthlyHitRate-tab-3]").removeClass('ui-btn-active');
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');
            $(".sliderMonthly").slick("slickGoTo", monthlyPageDate.length-1, true);
            loadingMask("hide");
            chartWidth = chart.chartWidth;
            chartHeight = chart.chartHeight;
        });

        $(".page-tabs #viewMonthlyHitRate-tab-1").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("Net Quantity");
            tab = "QTY";
            chart.series[0].update({name: (year-2) + " Actual " + tab, data: monthlyHighchartsData["Actual QTY"][year-2]});
            chart.series[1].update({name: (year-1) + " Actual " + tab, data: monthlyHighchartsData["Actual QTY"][year-1]});
            chart.series[2].update({name: (year) + " Actual " + tab, data: monthlyHighchartsData["Actual QTY"][year]});
            chart.series[3].update({name: (year) + " Budget " + tab, data: monthlyHighchartsData["Budget QTY"][year]});
            chart.yAxis[0].setTitle({
                text: '' 
            });
            chart.tooltip.hide();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("Adj. Sales");
            tab = "AMT";
            chart.series[0].update({name: (year-2) + "  Actual " + tab, data: monthlyHighchartsData["Actual AMT"][year-2]});
            chart.series[1].update({name: (year-1) + "  Actual " + tab, data: monthlyHighchartsData["Actual AMT"][year-1]});
            chart.series[2].update({name: (year) + "  Actual " + tab, data: monthlyHighchartsData["Actual AMT"][year]});
            chart.series[3].update({name: (year) + "  Budget " + tab, data: monthlyHighchartsData["Budget AMT"][year]});
            chart.yAxis[0].setTitle({
                text: '(USD$)',
                align: 'high',
                rotation: 0,
                offset: 0,
                x: 11,
                y: -11
            });
            chart.tooltip.hide();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("ASP");
            tab = "ASP";
            chart.series[0].update({name: (year-2) + "  Actual " + tab, data: monthlyHighchartsData["Actual ASP"][year-2]});
            chart.series[1].update({name: (year-1) + "  Actual " + tab, data: monthlyHighchartsData["Actual ASP"][year-1]});
            chart.series[2].update({name: (year) + "  Actual " + tab, data: monthlyHighchartsData["Actual ASP"][year]});
            chart.series[3].update({name: (year) + "  Budget " + tab, data: monthlyHighchartsData["Budget ASP"][year]});
            chart.yAxis[0].setTitle({
                text: '(USD$)',
                align: 'high',
                rotation: 0,
                offset: 0,
                x: 11,
                y: -11
            });
            chart.tooltip.hide();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
        });

        // scroll menu on click
        $(document).on('click', '#viewMonthlyHitRate .Ro > a', function(e) {
            e.preventDefault();
            ro = $(this).context.id;
            if($(this).context.id == "ALL"){
                hcRo = "All";
            }else{
                hcRo = $(this).context.id;
            }
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            getHighchartsData(ro, product);
            showData();
            chart.series[0].setData(monthlyHighchartsData["Actual " + tab][year-2], true, true, false);
            chart.series[1].setData(monthlyHighchartsData["Actual " + tab][year-1], true, true, false);
            chart.series[2].setData(monthlyHighchartsData["Actual " + tab][year], true, true, false);
            chart.series[3].setData(monthlyHighchartsData["Budget " + tab][year], true, true, false);
        });

        $(document).on('click', '#viewMonthlyHitRate .Product > a', function(e) {
            e.preventDefault();
            product = $(this).context.id;
            if($(this).context.id == "ALL"){
                hcProduct = "All product";
            }else{
                hcProduct = $(this).context.id;
            }
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            getHighchartsData(ro, product);
            showData();
            chart.series[0].setData(monthlyHighchartsData["Actual " + tab][year-2], true, true, false);
            chart.series[1].setData(monthlyHighchartsData["Actual " + tab][year-1], true, true, false);
            chart.series[2].setData(monthlyHighchartsData["Actual " + tab][year], true, true, false);
            chart.series[3].setData(monthlyHighchartsData["Budget " + tab][year], true, true, false);
        });

        // window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
        //     var screenWidth = $("html").width(), screenHeight = $("html").height();
        //     // portraint
        //     if (window.orientation === 180 || window.orientation === 0) {
        //         $("body div.ui-footer.ui-bar-inherit.ui-footer-fixed.slideup").show();
        //         $(".viewIndex.ui-page .ui-content.page-main>form").show();
        //         $("#viewMonthlyHitRate .page-header, .sliderMonthly, #title-container, div > .scrollmenu, .hc-fragment").show();
        //         $("#viewMonthlyHitRate-hc-canvas").css("height", "46.5VH");
        //         chart.legend.update({ itemStyle: {fontSize: 12}});
        //         chart.setSize(chartWidth, chartHeight);
        //     }
        //     // landscape
        //     if (window.orientation === 90 || window.orientation === -90 ) {
        //         $("body div.ui-footer.ui-bar-inherit.ui-footer-fixed.slideup").hide();
        //         $(".viewIndex.ui-page .ui-content.page-main>form").hide();
        //         $("#viewMonthlyHitRate .page-header, .sliderMonthly, #title-container, div > .scrollmenu").hide();
        //         $(".viewIndex.ui-page").css("background-color", "#fff");
        //         $(".hc-fragment").css("height", "auto");
        //         $(".hc-fragment").show();
        //         chart.legend.update({ itemStyle: {fontSize: 14}});
        //         chart.setSize(screenHeight, screenWidth*0.8);
        //     }
        // }, false);
    }
});