var year, month, actualValue, budgetHitRate;
var ro = "ALL";
var product = "ALL";
var tab = "AMT";
var hcRo = "All";
var hcProduct = "All product";
var hcTitle = "(USD$)";
var Actual = {};
var Budget = {};
var ytdHighchartsData = {
    "Actual QTY" : [],
    "Actual AMT" : [],
    "Actual ASP" : [],
    "Budget QTY" : [],
    "Budget AMT" : [],
    "Budget ASP" : [],
    "RT Actual QTY" : [],
    "RT Actual AMT" : [],
    "RT Actual ASP" : [],
    "RT Budget QTY" : [],
    "RT Budget AMT" : [],
    "RT Budget ASP" : [],
};

$("#viewYTDHitRate").pagecontainer({
    create: function(event, ui) {

    	function getActualValue(ro, product, year, month, type) {
            var index = 1;
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
                while(index <= Number(month)) {
                    for(var ro in eisdata[year][index]) {
                        for(var product in eisdata[year][index][ro]) {
                            Actual += eisdata[year][index][ro][product][actualIndex];
                            totalQTY += eisdata[year][index][ro][product][0];
                            totalAMT += eisdata[year][index][ro][product][2];
                        }
                    }
                    index++;
                }
            }else if(ro != "ALL" && product == "ALL") {
                while(index <= Number(month)) {
                    for(var product in eisdata[year][index][ro]) {
                        Actual += eisdata[year][index][ro][product][actualIndex];
                        totalQTY += eisdata[year][index][ro][product][0];
                        totalAMT += eisdata[year][index][ro][product][2];
                    }
                    index++;
                }
            }else if(ro == "ALL" && product != "ALL") {
                while(index <= Number(month)) {
                    for(var ro in eisdata[year][index]) {
                        if(eisdata[year][index][ro].hasOwnProperty(product)) {
                            Actual += eisdata[year][index][ro][product][actualIndex];
                            totalQTY += eisdata[year][index][ro][product][0];
                            totalAMT += eisdata[year][index][ro][product][2];
                        }else {
                            Actual += 0;
                            totalQTY += 0;
                            totalAMT += 0;
                        }
                    }
                    index++;
                }
            }else {
                while(index <= Number(month)) {
                    if(eisdata[year][index][ro].hasOwnProperty(product)) {
                        Actual += eisdata[year][index][ro][product][actualIndex];
                        totalQTY += eisdata[year][index][ro][product][0];
                        totalAMT += eisdata[year][index][ro][product][2];
                    }else {
                        Actual += 0;
                        totalQTY += 0;
                        totalAMT += 0;
                    }
                    index++;
                }
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
            var index = 1;
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
                while(index <= Number(month)) {    
                    for(var ro in eisdata[year][index]) {   //ro
                        for(var product in eisdata[year][index][ro]) {   //product
                            Actual += eisdata[year][index][ro][product][actualIndex];
                            Budget += eisdata[year][index][ro][product][budgetIndex];
                            ActualQTY += eisdata[year][index][ro][product][0];
                            BudgetQTY += eisdata[year][index][ro][product][1];
                            ActualAMT += eisdata[year][index][ro][product][2];
                            BudgetAMT += eisdata[year][index][ro][product][3];
                        }
                    }
                    index++;
                }
            }else if(ro != "ALL" && product == "ALL") {
                while(index <= Number(month)) { 
                    for(var product in eisdata[year][index][ro]) {
                        Actual += eisdata[year][index][ro][product][actualIndex];
                        Budget += eisdata[year][index][ro][product][budgetIndex];
                        ActualQTY += eisdata[year][index][ro][product][0];
                        BudgetQTY += eisdata[year][index][ro][product][1];
                        ActualAMT += eisdata[year][index][ro][product][2];
                        BudgetAMT += eisdata[year][index][ro][product][3];
                    }
                    index++;
                }
            }else if(ro == "ALL" && product != "ALL") {
                while(index <= Number(month)) {
                    for(var ro in eisdata[year][index]) {
                        if(eisdata[year][index][ro].hasOwnProperty(product)) {
                            Actual += eisdata[year][index][ro][product][actualIndex];
                            Budget += eisdata[year][index][ro][product][budgetIndex];
                            ActualQTY += eisdata[year][index][ro][product][0];
                            BudgetQTY += eisdata[year][index][ro][product][1];
                            ActualAMT += eisdata[year][index][ro][product][2];
                            BudgetAMT += eisdata[year][index][ro][product][3];
                        }else {
                            Actual += 0;
                            Budget += 0;
                            ActualQTY += 0;
                            BudgetQTY += 0;
                            ActualAMT += 0;
                            BudgetAMT += 0;
                        }
                    }
                    index++;
                }
            }else {
                while(index <= Number(month)){
                    if(eisdata[year][index][ro].hasOwnProperty(product)) {
                        Actual += eisdata[year][index][ro][product][actualIndex];
                        Budget += eisdata[year][index][ro][product][budgetIndex];
                        ActualQTY += eisdata[year][index][ro][product][0];
                        BudgetQTY += eisdata[year][index][ro][product][1];
                        ActualAMT += eisdata[year][index][ro][product][2];
                        BudgetAMT += eisdata[year][index][ro][product][3];
                    }else {
                        Actual += 0;
                        Budget += 0;
                        ActualQTY += 0;
                        BudgetQTY += 0;
                        ActualAMT += 0;
                        BudgetAMT += 0;
                    }
                    index++;
                }
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
		
		function getHighchartsData(ro, product, year, ytdMonth) {
            var rtAQ = 0;
            var rtBQ = 0;
            var rtAA = 0;
            var rtBA = 0;
            for(var i in ytdHighchartsData) {
                ytdHighchartsData[i] = [];
            }
            if(ro == "ALL" && product == "ALL") {
                for(var month=1; month<=ytdMonth; month++) {
                // for(var month in eisdata[year]) {
                    for(var j in ytdHighchartsData) {
                        ytdHighchartsData[j][Number(month)-1] = 0;
                    }
                    for(var ro in eisdata[year][month]) {
                        for(var product in eisdata[year][month][ro]) {
                            ytdHighchartsData["Actual QTY"][Number(month)-1] += eisdata[year][month][ro][product][0];
                            ytdHighchartsData["Budget QTY"][Number(month)-1] += eisdata[year][month][ro][product][1];
                            ytdHighchartsData["Actual AMT"][Number(month)-1] += eisdata[year][month][ro][product][2];
                            ytdHighchartsData["Budget AMT"][Number(month)-1] += eisdata[year][month][ro][product][3];
                        }
                    }
                    ytdHighchartsData["RT Actual QTY"][Number(month)-1] = ytdHighchartsData["Actual QTY"][Number(month)-1] + rtAQ;
                    ytdHighchartsData["RT Budget QTY"][Number(month)-1] = ytdHighchartsData["Budget QTY"][Number(month)-1] + rtBQ;
                    ytdHighchartsData["RT Actual AMT"][Number(month)-1] = ytdHighchartsData["Actual AMT"][Number(month)-1] + rtAA;
                    ytdHighchartsData["RT Budget AMT"][Number(month)-1] = ytdHighchartsData["Budget AMT"][Number(month)-1] + rtBA;
                    rtAQ = ytdHighchartsData["RT Actual QTY"][Number(month)-1];
                    rtBQ = ytdHighchartsData["RT Budget QTY"][Number(month)-1];
                    rtAA = ytdHighchartsData["RT Actual AMT"][Number(month)-1];
                    rtBA = ytdHighchartsData["RT Budget AMT"][Number(month)-1];
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var month=1; month<=ytdMonth; month++) {
                // for(var month in eisdata[year]) {
                    for(var i in ytdHighchartsData) {
                        ytdHighchartsData[i][Number(month)-1] = 0;
                    }
                    for(var product in eisdata[year][month][ro]) {
                    	ytdHighchartsData["Actual QTY"][Number(month)-1] += eisdata[year][month][ro][product][0];
                    	ytdHighchartsData["Budget QTY"][Number(month)-1] += eisdata[year][month][ro][product][1];
                        ytdHighchartsData["Actual AMT"][Number(month)-1] += eisdata[year][month][ro][product][2];
                        ytdHighchartsData["Budget AMT"][Number(month)-1] += eisdata[year][month][ro][product][3];
                    }
                    ytdHighchartsData["RT Actual QTY"][Number(month)-1] = ytdHighchartsData["Actual QTY"][Number(month)-1] + rtAQ;
                    ytdHighchartsData["RT Budget QTY"][Number(month)-1] = ytdHighchartsData["Budget QTY"][Number(month)-1] + rtBQ;
                    ytdHighchartsData["RT Actual AMT"][Number(month)-1] = ytdHighchartsData["Actual AMT"][Number(month)-1] + rtAA;
                    ytdHighchartsData["RT Budget AMT"][Number(month)-1] = ytdHighchartsData["Budget AMT"][Number(month)-1] + rtBA;
                    rtAQ = ytdHighchartsData["RT Actual QTY"][Number(month)-1];
                    rtBQ = ytdHighchartsData["RT Budget QTY"][Number(month)-1];
                    rtAA = ytdHighchartsData["RT Actual AMT"][Number(month)-1];
                    rtBA = ytdHighchartsData["RT Budget AMT"][Number(month)-1];
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var month=1; month<=ytdMonth; month++) {
                // for(var month in eisdata[year]) {
                    for(var i in ytdHighchartsData) {
                        ytdHighchartsData[i][Number(month)-1] = 0;
                    }
                    for(var ro in eisdata[year][month]) {
                        if(eisdata[year][month][ro].hasOwnProperty(product)) {
    						ytdHighchartsData["Actual QTY"][Number(month)-1] += eisdata[year][month][ro][product][0];
    						ytdHighchartsData["Budget QTY"][Number(month)-1] += eisdata[year][month][ro][product][1];
    						ytdHighchartsData["Actual AMT"][Number(month)-1] += eisdata[year][month][ro][product][2];
    						ytdHighchartsData["Budget AMT"][Number(month)-1] += eisdata[year][month][ro][product][3];  
                        }
                    }
                    ytdHighchartsData["RT Actual QTY"][Number(month)-1] = ytdHighchartsData["Actual QTY"][Number(month)-1] + rtAQ;
                    ytdHighchartsData["RT Budget QTY"][Number(month)-1] = ytdHighchartsData["Budget QTY"][Number(month)-1] + rtBQ;
                    ytdHighchartsData["RT Actual AMT"][Number(month)-1] = ytdHighchartsData["Actual AMT"][Number(month)-1] + rtAA;
                    ytdHighchartsData["RT Budget AMT"][Number(month)-1] = ytdHighchartsData["Budget AMT"][Number(month)-1] + rtBA;
                    rtAQ = ytdHighchartsData["RT Actual QTY"][Number(month)-1];
                    rtBQ = ytdHighchartsData["RT Budget QTY"][Number(month)-1];
                    rtAA = ytdHighchartsData["RT Actual AMT"][Number(month)-1];
                    rtBA = ytdHighchartsData["RT Budget AMT"][Number(month)-1];
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }else {
                for(var month=1; month<=ytdMonth; month++) {
                // for(var month in eisdata[year]) {
                    for(var i in ytdHighchartsData) {
                        ytdHighchartsData[i][Number(month)-1] = 0;
                    }
                    if(eisdata[year][month][ro].hasOwnProperty(product)) {
                    	ytdHighchartsData["Actual QTY"][Number(month)-1] = eisdata[year][month][ro][product][0];
                    	ytdHighchartsData["Budget QTY"][Number(month)-1] = eisdata[year][month][ro][product][1];
                        ytdHighchartsData["Actual AMT"][Number(month)-1] = eisdata[year][month][ro][product][2];
                        ytdHighchartsData["Budget AMT"][Number(month)-1] = eisdata[year][month][ro][product][3];
                    }
                    ytdHighchartsData["RT Actual QTY"][Number(month)-1] = ytdHighchartsData["Actual QTY"][Number(month)-1] + rtAQ;
                    ytdHighchartsData["RT Budget QTY"][Number(month)-1] = ytdHighchartsData["Budget QTY"][Number(month)-1] + rtBQ;
                    ytdHighchartsData["RT Actual AMT"][Number(month)-1] = ytdHighchartsData["Actual AMT"][Number(month)-1] + rtAA;
                    ytdHighchartsData["RT Budget AMT"][Number(month)-1] = ytdHighchartsData["Budget AMT"][Number(month)-1] + rtBA;
                    rtAQ = ytdHighchartsData["RT Actual QTY"][Number(month)-1];
                    rtBQ = ytdHighchartsData["RT Budget QTY"][Number(month)-1];
                    rtAA = ytdHighchartsData["RT Actual AMT"][Number(month)-1];
                    rtBA = ytdHighchartsData["RT Budget AMT"][Number(month)-1];
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0) {
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                    }
                    if(ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
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
        }

        function initSlider() {
            if (ytdPageDateExist) {
                var index = 0;
                year = ytdYear-1;
                month = ytdMonth;
                while(index < 2) {
                    ytdPageDateList += "<div>" + year + "</div>";
                    if(year == ytdYear) {
                        ytdPageDate[index] = ytdMonth + "." + year;
                    }else{
                        ytdPageDate[index] = 12 + "." + year;
                    }
                    index++;
                    year++;
                }
                $(".sliderYTD").html("");
                $(".sliderYTD").append(ytdPageDateList).enhanceWithin();
            }
            ytdPageDateExist = false;
            if($(".sliderYTD").hasClass("slick-slider") || $(".sliderYTD").hasClass("slick-initialized")){
                $(".sliderYTD").slick("unslick");
            }
            $(".sliderYTD").slick({
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

        $(".sliderYTD").on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            year = ytdPageDate[nextSlide].match(/([0-9]{0,2})\.([0-9]{0,4})/)[2];
            month = ytdPageDate[nextSlide].match(/([0-9]{0,2})\.([0-9]{0,4})/)[1];
            if(year == ytdYear && month != 12) {
                $(".YTD-Str").css("display", "block");
                ytdStrExist = true;
            }else {
                $(".YTD-Str").css("display", "none");
                ytdStrExist = false;
            }
            getHighchartsData(ro, product, year, month);
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
        });

        function showHighchart() {
            options = {
                chart: {
                    marginBottom: 75,
                    marginTop: 25,
                    marginLeft: 35,
                    marginRight: 45
                },
                title: {
                    text: '' 
                },
                xAxis: {
                    title: {
                        text: 'Month',
                        align: 'high',
                        offset: 0,
                        x: 38,
                        y: 7
                    },
                    tickInterval: 1,
                    max: 12,
                    min: 1,
                    crosshair: true
                },
                yAxis: [{
                    title: {
                        text: hcTitle,
                        align: 'high',
                        rotation: 0,
                        offset: 0,
                        x: 11,
                        y: -11
                    },
                    labels: {
                        x: -2
                    },
                    min: 0
                }, {
                    title: {
                        text: '',
                    },
                    labels: {
                        x: 5,
                        padding: -7,
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
                        var s = '<b>' + hcTable[this.x] + " " + year + " " + hcRo + ' Hit Rate - ' + hcProduct + '</b>';
                        var dollar = "$";
                        if(tab == "QTY"){
                            dollar = "";
                        }
                        $.each(this.points, function () {
                            if(tab == "ASP"){
                                this.y = Math.round(this.y * Math.pow(10, 2)) / 100;
                            }
                            s += '<br/>' + this.series.name + ' = ' + dollar + formatNumber(this.y);
                        });
                        return s;
                    },
                    shared: true,
                    useHTML: true,
                    hideDelay: 0
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
                    name: "Budget " + tab,
                    type: 'column',
                    color: '#0AB5B6',
                    data: ytdHighchartsData["Budget " + tab]
                },{
                    name: "Actual " + tab,
                    type: 'column',
                    color: '#F4A143',
                    data: ytdHighchartsData["Actual " + tab]
                },{
                    name: "RT Budget " + tab,
                    type: 'line',
                    color: '#A0C83A',
                    data: ytdHighchartsData["RT Budget " + tab],
                    yAxis: 1,
                },{
                    name: "RT Actual " + tab,
                    type: 'line',
                    color: '#134A8C',
                    data: ytdHighchartsData["RT Actual " + tab],
                    yAxis: 1,
                }]
            };
            options.chart.renderTo = "viewYTDHitRate-hc-canvas";
            chart = new Highcharts.Chart(options);
            options.chart.renderTo = "viewYTDHitRate-hc-landscape-canvas";
            chartLandscape = new Highcharts.Chart(options);
            chartLandscape.legend.update({itemStyle: {fontSize: 14}, align: "center"});
        }

        /********************************** page event *************************************/
        $("#viewYTDHitRate").on("pagebeforeshow", function(event, ui) {
            /* global PullToRefresh */
            PullToRefresh.init({
                mainElement: '.sliderYTD',
                onRefresh: function() {
                    if($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == "viewYTDHitRate") {
                        nowTime = new Date();
                        eisdata = {};
                        localStorage.removeItem("eisdata");
                        callProductDetailAPIReduce();
                        callProductDetailAPI();
                    }
                }
            });
        });

        $("#viewYTDHitRate").on("pageshow", function(event, ui) {
            // localStorage.setItem("eisdata", JSON.stringify([eisdata, nowTime]));
            initSlider();
            $("#viewYTDHitRate #title-container > #title > #actualValue > p").text("YTD Adj. Sales");
            $("label[for=viewYTDHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewYTDHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewYTDHitRate-tab-3]").removeClass('ui-btn-active');
            $(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #ALL").removeClass('disableHover');
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');
            
            ro = "ALL";
            product = "ALL";
            tab = "AMT";
            year = ytdYear;
            month = ytdMonth;
            hcRo = "All";
            hcProduct = "All product";
			showHighchart();
            showData();
            $(".sliderYTD").slick("slickGoTo", ytdPageDate.length-1, true);
			loadingMask("hide");
        });

		$(".page-tabs #viewYTDHitRate-tab-1").on("click", function() {
		    $("#title-container > #title > #actualValue > p").text("YTD Adj. Sales");
            tab = "AMT";
            $(".Product #ALL").removeClass('disableHover');
            hcTitle = "(USD$)";
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
		});

		$(".page-tabs #viewYTDHitRate-tab-2").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("YTD ASP");
		    tab = "ASP";
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #ALL").addClass('disableHover');
            if(product == "ALL") {
                product = firstProduct;
            }
            $(".Product #" + product).addClass('hover');
            hcTitle = "(USD$)";
            getHighchartsData(ro, product, year, month);
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
        });

		$(".page-tabs #viewYTDHitRate-tab-3").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("YTD Net Quantity");
            tab = "QTY";
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #ALL").addClass('disableHover');
            if(product == "ALL") {
                product = firstProduct;
            }
            $(".Product #" + product).addClass('hover');
            hcTitle = "";
            getHighchartsData(ro, product, year, month);
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
        });

		// scroll menu on click
		$(document).on('click', '#viewYTDHitRate .Ro > a', function(e) {
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
		    getHighchartsData(ro, product, year, month);
            showHighchart();
            showData();
		});

		$(document).on('click', '#viewYTDHitRate .Product > a', function(e) {
		    e.preventDefault();
            if(tab == "AMT" || $(this).context.id != "ALL") {
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
    		    getHighchartsData(ro, product, year, month);
                showHighchart();
                showData();
            }
        });
    }
});