var chart, ro, product, tab, year, month, actualValue, budgetHitRate, yoyGrowth;
var productList = '<a id="ALL">ALL</a>';
var highchartsData = {
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
            year = thisYear-1;
            month = thisMonth;
            this.successCallback = function(data) {
                callbackData = data["Content"]["DataList"];
                length = callbackData.length;
                for(var i=0; i<length; i++) {
                    for(var j in callbackData[i]) {
                        if(callbackData[i][j] == "PRODUCT") {
                            productList += '<a id="' + callbackData[i]["PVALUE"] + '">' + callbackData[i]["PVALUE"] + '</a>' ;
                        }
                    }
                }
                $(".Product").html("");
                $(".Product").append(productList).enhanceWithin();
                setScrollMenuHeight();

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
                callbackData = data["Content"]["DataList"];
                length = callbackData.length;
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
                    lastActualQTY = eisdata[year][month][ro][product][0];
                    lastActualAMT = eisdata[year][month][ro][product][2];
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

        function getHighchartsData(ro, product, year, month) {
            if(ro == "ALL" && product == "ALL") {
                for(var year in eisdata) {
                    for(var i in highchartsData) {
                    	highchartsData[i][year] = []; 
                    }
                    for(var month in eisdata[year]) {
                    	for(var i in highchartsData) {
                    		highchartsData[i][year][Number(month)-1] = 0;
                    	}
                        for(var ro in eisdata[year][month]) {
                            for(var product in eisdata[year][month][ro]) {
                                highchartsData["Actual QTY"][year][Number(month)-1] += eisdata[year][month][ro][product][0];
                                highchartsData["Budget QTY"][year][Number(month)-1] += eisdata[year][month][ro][product][1];
                                highchartsData["Actual AMT"][year][Number(month)-1] += eisdata[year][month][ro][product][2];
                                highchartsData["Budget AMT"][year][Number(month)-1] += eisdata[year][month][ro][product][3];
                            }
                        }
                        if(highchartsData["Actual QTY"][year][Number(month)-1] != 0) {
	                        highchartsData["Actual ASP"][year][Number(month)-1] = (highchartsData["Actual AMT"][year][Number(month)-1] / highchartsData["Actual QTY"][year][Number(month)-1]);
                    	}
                    	if(highchartsData["Budget QTY"][year][Number(month)-1] != 0){
                    		highchartsData["Budget ASP"][year][Number(month)-1] = (highchartsData["Budget AMT"][year][Number(month)-1] / highchartsData["Budget QTY"][year][Number(month)-1]);
                    	}
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var year in eisdata) {
                    for(var i in highchartsData) {
                    	highchartsData[i][year] = []; 
                    }
                    for(var month in eisdata[year]) {
                        for(var i in highchartsData) {
                    		highchartsData[i][year][Number(month)-1] = 0;
                    	}
                        for(var product in eisdata[year][month][ro]) {
                        	highchartsData["Actual QTY"][year][Number(month)-1] += eisdata[year][month][ro][product][0];
                        	highchartsData["Budget QTY"][year][Number(month)-1] += eisdata[year][month][ro][product][1];
                            highchartsData["Actual AMT"][year][Number(month)-1] += eisdata[year][month][ro][product][2];
                            highchartsData["Budget AMT"][year][Number(month)-1] += eisdata[year][month][ro][product][3];
                        }
                        if(highchartsData["Actual QTY"][year][Number(month)-1] != 0) {
	                        highchartsData["Actual ASP"][year][Number(month)-1] = (highchartsData["Actual AMT"][year][Number(month)-1] / highchartsData["Actual QTY"][year][Number(month)-1]);
                    	}
                    	if(highchartsData["Budget QTY"][year][Number(month)-1] != 0){
                    		highchartsData["Budget ASP"][year][Number(month)-1] = (highchartsData["Budget AMT"][year][Number(month)-1] / highchartsData["Budget QTY"][year][Number(month)-1]);
                    	}
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var year in eisdata) {
                    for(var i in highchartsData) {
                    	highchartsData[i][year] = []; 
                    }
                    for(var month in eisdata[year]) {
                    	for(var i in highchartsData) {
                    		highchartsData[i][year][Number(month)-1] = 0;
                    	}
                        for(var ro in eisdata[year][month]) {
                            if(eisdata[year][month][ro].hasOwnProperty(product)) {
								highchartsData["Actual QTY"][year][Number(month)-1] += eisdata[year][month][ro][product][0];
								highchartsData["Budget QTY"][year][Number(month)-1] += eisdata[year][month][ro][product][1];
								highchartsData["Actual AMT"][year][Number(month)-1] += eisdata[year][month][ro][product][2];
								highchartsData["Budget AMT"][year][Number(month)-1] += eisdata[year][month][ro][product][3];  
                            }
                        }
                        if(highchartsData["Actual QTY"][year][Number(month)-1] != 0) {
	                        highchartsData["Actual ASP"][year][Number(month)-1] = (highchartsData["Actual AMT"][year][Number(month)-1] / highchartsData["Actual QTY"][year][Number(month)-1]);
                    	}
                    	if(highchartsData["Budget QTY"][year][Number(month)-1] != 0){
                    		highchartsData["Budget ASP"][year][Number(month)-1] = (highchartsData["Budget AMT"][year][Number(month)-1] / highchartsData["Budget QTY"][year][Number(month)-1]);
                    	}
                    }
                }
            }else {
               for(var year in eisdata) {
                    for(var i in highchartsData) {
                    	highchartsData[i][year] = []; 
                    }
                    for(var month in eisdata[year]) {
                    	for(var i in highchartsData) {
                    		highchartsData[i][year][Number(month)-1] = 0;
                    	}
                        if(eisdata[year][month][ro].hasOwnProperty(product)) {
                        	highchartsData["Actual QTY"][year][Number(month)-1] = eisdata[year][month][ro][product][0];
                        	highchartsData["Budget QTY"][year][Number(month)-1] = eisdata[year][month][ro][product][1];
                            highchartsData["Actual AMT"][year][Number(month)-1] = eisdata[year][month][ro][product][2];
                            highchartsData["Budget AMT"][year][Number(month)-1] = eisdata[year][month][ro][product][3];  
                        }
                        if(highchartsData["Actual QTY"][year][Number(month)-1] != 0) {
	                        highchartsData["Actual ASP"][year][Number(month)-1] = (highchartsData["Actual AMT"][year][Number(month)-1] / highchartsData["Actual QTY"][year][Number(month)-1]);
                    	}
                    	if(highchartsData["Budget QTY"][year][Number(month)-1] != 0){
                    		highchartsData["Budget ASP"][year][Number(month)-1] = (highchartsData["Budget AMT"][year][Number(month)-1] / highchartsData["Budget QTY"][year][Number(month)-1]);
                    	}
                    }
                }
            }

        }

        function showData() {
            $("#title-content #ActualValue p").text(actualValue);
            $("#title-content #BudgetHitRate p").text(budgetHitRate + "%");
            if(budgetHitRate < 80) {
                $("#title-content #BudgetHitRate p").css("color", "#ee3839");
            }else if(budgetHitRate > 95) {
                $("#title-content #BudgetHitRate p").css("color", "#48af56");
            }else {
                $("#title-content #BudgetHitRate p").css("color", "#e6be20");
            }
            if(yoyGrowth < 0) {
                $("#title-content #YOYGrowth p").text(yoyGrowth + "%");
                $("#title-content #YOYGrowth p").css("color", "#ee3839");
            }else {
                $("#title-content #YOYGrowth p").text("+" + yoyGrowth + "%");
                $("#title-content #YOYGrowth p").css("color", "#48af56");
            }
        }

        function convertData() {
            var month, rosite;
            var ActualASP = 0;
            var BudgetASP = 0;
            var index = 0;
            for(var i=callbackData[0]["YEAR"]; i<=callbackData[length-1]["YEAR"]; i++) {
                eisdata[i] = {};
                month = (i == callbackData[length-1]["YEAR"]) ? (callbackData[length-1]["MONTH"]) : 12;  
                for(var j=1; j<=month; j++) {
                    eisdata[i][j] = {};
                    while(index<length && j == callbackData[index]["MONTH"]) {
                        rosite = callbackData[index]["RO_SITE"];
                        eisdata[i][j][rosite] = {};
                        while(index<length && rosite == callbackData[index]["RO_SITE"]) {
                            if(Number(callbackData[index]["ACTUAL_QTY"]) != 0) {
                                ActualASP = Number(callbackData[index]["ACTUAL_ADJ_AMT"]) / Number(callbackData[index]["ACTUAL_QTY"]);    
                            }
                            if(Number(callbackData[index]["BUDGET_QTY"]) != 0) {
                                BudgetASP = Number(callbackData[index]["BUDGET_AMT"]) / Number(callbackData[index]["BUDGET_QTY"]);    
                            }
                            eisdata[i][j][rosite][callbackData[index]["PRODUCT"]] = [
                                Number(callbackData[index]["ACTUAL_QTY"]),
                                Number(callbackData[index]["BUDGET_QTY"]),
                                Number(callbackData[index]["ACTUAL_ADJ_AMT"]),
                                Number(callbackData[index]["BUDGET_AMT"]),
                                ActualASP,
                                BudgetASP
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
            actualValue = getActualValue(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
            getHighchartsData(ro, product, year, month);
            chart.series[0].setData(highchartsData["Actual " + tab][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual " + tab][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual " + tab][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget " + tab][year], true, true, false);
            chart.series[0].update({name: (year-2) + " Actual " + tab});
            chart.series[1].update({name: (year-1) + " Actual " + tab});
            chart.series[2].update({name: (year) + " Actual " + tab});
            chart.series[3].update({name: (year) + " Budget " + tab});
        });

        /********************************** page event *************************************/
        $("#viewMonthlyHitRate").on("pageshow", function(event, ui) {
            $(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            
            ro = "ALL";
            product = "ALL";
            tab = "QTY";
            year = thisYear;
            month = thisMonth;
            
            actualValue = getActualValue(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            getHighchartsData(ro, product, thisYear, thisMonth);

            chart = new Highcharts.Chart({
        		chart: {
        			renderTo: 'viewMonthlyHitRate-hc-canvas',
        			marginBottom: 80,
        			marginTop: 20,
        			marginLeft: 55
        		},
        		title: {
        			text: ''
        		},
        		xAxis: {
        			title: {
        				text: '(Mth)',
        				align: 'high'	
        			},
        			tickInterval: 1,
        			crosshair: true
        		},
        		yAxis: {
        			title: {
        				text: '(USD$M)',
        				align: 'high',
        				rotation: 0,
        				offset: 0,
        				x: 6,
        				y: -11
        			},
        			min: 0,
        			tickInterval: 1000
        		},
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
        			shared: true
        		},
        		plotOptions: {
        			column: {
        				pointPadding: 0,
        				borderWidth: 0
        			}
        		},
        		exporting: {
        			enabled: false
        		},
        		series: [{
        			name: (year-2) + " Actual QTY",
        			type: 'column',
        			color: '#0AB5B6',
        			// data: Actual[thisYear-3],
        			pointStart: 1
        		}, {
        			name: (year-1) + " Actual QTY",
        			type: 'column',
        			color: '#F4A143',
        			// data: Actual[thisYear-2],
        			pointStart: 1
        		}, {
        			name: (year) + " Actual QTY",
        			type: 'column',
        			color: '#824E9F',
        			// data: Actual[thisYear-1],
        			pointStart: 1
        		}, {
        			name: (year) + " Budget QTY",
        			type: 'line',
        			color: '#134A8C',
        			lineWidth: 1,
        			// data: BudgetAMT[thisYear-1],
        			pointStart: 1
        		}]
        	});
            showData();
            $("#title-container > #title > #actualValue > p").text("Net Quantity");
            chart.series[0].setData(highchartsData["Actual QTY"][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual QTY"][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual QTY"][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget QTY"][year], true, true, false);
            $("label[for=viewMonthlyHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewMonthlyHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewMonthlyHitRate-tab-3]").removeClass('ui-btn-active');
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');

            initSlider();
            $(".sliderMonthly").slick("slickGoTo", monthlyPageDate.length-1, true);
            loadingMask("hide");
        });

        $(".page-tabs #viewMonthlyHitRate-tab-1").on("click", function() {
            tab = "QTY";
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);

            showData();
            $("#title-container > #title > #actualValue > p").text("Net Quantity");
            chart.series[0].setData(highchartsData["Actual QTY"][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual QTY"][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual QTY"][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget QTY"][year], true, true, false);
            chart.series[0].update({name: (year-2) + " Actual " + tab});
            chart.series[1].update({name: (year-1) + " Actual " + tab});
            chart.series[2].update({name: (year) + " Actual " + tab});
            chart.series[3].update({name: (year) + " Budget " + tab});
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
            tab = "AMT";
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
            $("#title-container > #title > #actualValue > p").text("Adj. Sales");
            chart.series[0].setData(highchartsData["Actual AMT"][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual AMT"][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual AMT"][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget AMT"][year], true, true, false);
            chart.series[0].update({name: (year-2) + "  Actual " + tab});
            chart.series[1].update({name: (year-1) + "  Actual " + tab});
            chart.series[2].update({name: (year) + "  Actual " + tab});
            chart.series[3].update({name: (year) + "  Budget " + tab});
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
            tab = "ASP";
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
            $("#title-container > #title > #actualValue > p").text("ASP");
            chart.series[0].setData(highchartsData["Actual ASP"][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual ASP"][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual ASP"][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget ASP"][year], true, true, false);
            chart.series[0].update({name: (year-2) + "  Actual " + tab});
            chart.series[1].update({name: (year-1) + "  Actual " + tab});
            chart.series[2].update({name: (year) + "  Actual " + tab});
            chart.series[3].update({name: (year) + "  Budget " + tab});
        });

        // scroll menu on click
        $(document).on('click', '#viewMonthlyHitRate .Ro > a', function(e) {
            e.preventDefault();
            ro = $(this).context.id
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            getHighchartsData(ro, product, thisYear, thisMonth);
            showData();
            chart.series[0].setData(highchartsData["Actual " + tab][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual " + tab][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual " + tab][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget " + tab][year], true, true, false);
        });

        $(document).on('click', '#viewMonthlyHitRate .Product > a', function(e) {
            e.preventDefault();
            product = $(this).context.id;
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            getHighchartsData(ro, product, thisYear, thisMonth);
            showData();
            chart.series[0].setData(highchartsData["Actual " + tab][year-2], true, true, false);
            chart.series[1].setData(highchartsData["Actual " + tab][year-1], true, true, false);
            chart.series[2].setData(highchartsData["Actual " + tab][year], true, true, false);
            chart.series[3].setData(highchartsData["Budget " + tab][year], true, true, false);
        });
    }
});