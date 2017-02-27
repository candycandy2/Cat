var chart, ro, product, year, month;
var ProductList = '<a>ALL</a>';
var ActualQTY = {};
var BudgetQTY = {};
var ActualAMT = {};
var BudgetAMT = {};
var HighchartsName = [];

$("#viewMonthlyHitRate").pagecontainer({
    create: function(event, ui) {

        window.UserAuthority = function() {
            
            this.successCallback = function(data) {
                callbackData = data["Content"]["DataList"];
                length = callbackData.length;
                for(var i=0; i<length; i++) {
                    for(var j in callbackData[i]) {
                        if(callbackData[i][j] == "PRODUCT") {
                            ProductList += '<a>' + callbackData[i]["PVALUE"] + '</a>' ;
                        }
                    }
                }
                $(".Product").html("");
                $(".Product").append(ProductList).enhanceWithin();
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
                year = thisYear;
                month = thisMonth;
                convertData();
                getHighchartsData();
                // addItem2scrollmenu();
            }

            this.failCallback = function(data) {
                console.log("api misconnected");
            }

            var _constrcut = function() {
                CustomAPI("POST", true, "ProductDetail", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        function showData() {

        }

     /*   function addItem2scrollmenu() {
            for(var i in eisdata[thisYear][thisMonth]["BQA"]) {
                ProductList += '<a>' + i + '</a>';
            }
            $(".Product").html("");
            $(".Product").append(ProductList).enhanceWithin();
        }*/

        function getActualValue(ro, product, year, month, type) {
            var actualIndex;
            var Actual = 0;
            if(type == "Quantity") {
                actualIndex = 0;
            }else if(type == "Amount") {
                actualIndex = 2;
            }else if(type == "ASP") {
                actualIndex = 4;
            }
            if(ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                    }
                }
                return Math.round(Actual * Math.pow(10, 2)) / 100;
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                }
                return Math.round(Actual * Math.pow(10, 2)) / 100;
            }else if(ro == "ALL" && product != "ALL"){
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                }
                return Math.round(Actual * Math.pow(10, 2)) / 100;
            }else {
                return Math.round((eisdata[year][month][ro][product][actualIndex]) * Math.pow(10, 2)) / 100;
            }
        }

        function getBudgetHitRate(ro, product, year, month, type) {
            var actualIndex, budgetIndex;
            var Actual = 0;
            var Budget = 0;
            if(type == "Quantity") {
                budgetIndex = 1;
                actualIndex = 0;
            }else if(type == "Amount"){
                budgetIndex = 3;
                actualIndex = 2;
            }else if(type == "ASP"){
                budgetIndex = 5;
                actualIndex = 4;
            }
            if(ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        Budget += eisdata[year][month][i][j][budgetIndex];
                    }
                }
                return Math.round((Actual / Budget) * Math.pow(10, 4)) / 100;
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    Budget += eisdata[year][month][ro][i][budgetIndex];
                }
                return Math.round((Actual / Budget) * Math.pow(10, 4)) / 100;
            }else if(ro == "ALL" && product != "ALL"){
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    Budget += eisdata[year][month][i][product][budgetIndex];
                }
                return Math.round((Actual / Budget) * Math.pow(10, 4)) / 100;
            }else {
                var result = (eisdata[year][month][ro][product][actualIndex] / eisdata[year][month][ro][product][budgetIndex]);
                return Math.round(result * Math.pow(10, 4)) / 100;
            }
        }

        function getYOYGrowth(ro, product, year, month, type) {
            var actualIndex;
            var Actual = 0;
            var lastActual = 0;
            if(type == "Quantity") {
                actualIndex = 0;
            }else if(type == "Amount") {
                actualIndex = 2;
            }else if(type == "ASP") {
                actualIndex = 4;
            }
            if (ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {    //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        if(eisdata[year-1][month][i].hasOwnProperty(j)){
                            lastActual += eisdata[year-1][month][i][j][actualIndex];
                        }
                    }
                }
                return Math.round(((Actual / lastActual)  - 1 ) * Math.pow(10, 4)) / 100;
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    if(eisdata[year-1][month][i].hasOwnProperty(j)) {
                        lastActual += eisdata[year-1][month][ro][i][actualIndex];
                    }
                }
                return Math.round(((Actual / lastActual)  - 1 ) * Math.pow(10, 4)) / 100;
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    if(eisdata[year-1][month][i].hasOwnProperty(j)) {
                        lastActual += eisdata[year-1][month][i][product][actualIndex];
                    }
                }
                return Math.round(((Actual / lastActual)  - 1 ) * Math.pow(10, 4)) / 100;
            }else {
                if(eisdata[year-1][month][i].hasOwnProperty(j)) {
                    var result = ((eisdata[year][month][ro][product][actualIndex] / eisdata[year-1][month][ro][product][actualIndex]) - 1);
                    Math.round(result * Math.pow(10, 4)) / 100
                }else {
                    //In ro, the product doesn't exist in last year.
                }
            }
        }

        function getHighchartsData(ro, product, year, month, type) {
            var total = 0;
            for(var year in eisdata) {
                ActualQTY[year] = [];
                BudgetAMT[year] = [];
                for(var month in eisdata[year]) {
                    ActualQTY[year][Number(month)-1] = 0;
                    BudgetAMT[year][Number(month)-1] = 0;
                    for(var ro in eisdata[year][month]) {
                        for(var product in eisdata[year][month][ro]) {
                            ActualQTY[year][Number(month)-1] += eisdata[year][month][ro][product][0];
                            BudgetAMT[year][Number(month)-1] += eisdata[year][month][ro][product][3];
                        }
                    }
                }
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

        /********************************** page event *************************************/
        $("#viewMonthlyHitRate").on("pageshow", function(event, ui) {
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
        			tickInterval: 10000
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
        			name: (thisYear-3) + ' Actual QTY',
        			type: 'column',
        			color: '#0AB5B6',
        			data: ActualQTY[thisYear-3],
        			pointStart: 1
        		}, {
        			name: (thisYear-2) + ' Actual QTY',
        			type: 'column',
        			color: '#F4A143',
        			data: ActualQTY[thisYear-2],
        			pointStart: 1
        		}, {
        			name: (thisYear-1) + ' Actual QTY',
        			type: 'column',
        			color: '#824E9F',
        			data: ActualQTY[thisYear-1],
        			pointStart: 1
        		}, {
        			name: (thisYear-1) + ' Actual Budget',
        			type: 'line',
        			color: '#134A8C',
        			lineWidth: 1,
        			// data: BudgetAMT[thisYear-1],
        			pointStart: 1
        		}]
        	});
        	loadingMask("hide");
            $(".slider").slick({
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
                }]
            });
        });

        $(".page-tabs #viewMonthlyHitRate-tab-1").on("click", function() {
            $("#title-content #ActualValue p").text(getActualValue("ALL", "ALL", thisYear, thisMonth, "Quantity"));
            $("#title-content #BudgetHitRate p").text(getBudgetHitRate("ALL", "ALL", thisYear, thisMonth, "Quantity"));
            $("#title-content #YOYGrowth p").text(getYOYGrowth("ALL", "ALL", thisYear, thisMonth, "Quantity"));
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
            $("#title-content #ActualValue p").text(getActualValue("ALL", "ALL", thisYear, thisMonth, "Amount"));
            $("#title-content #BudgetHitRate p").text(getBudgetHitRate("ALL", "ALL", thisYear, thisMonth, "Amount"));
            $("#title-content #YOYGrowth p").text(getYOYGrowth("ALL", "ALL", thisYear, thisMonth, "Amount"));
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
            $("#title-content #ActualValue p").text(getActualValue("ALL", "ALL", thisYear, thisMonth, "ASP"));
            $("#title-content #BudgetHitRate p").text(getBudgetHitRate("ALL", "ALL", thisYear, thisMonth, "ASP"));
            $("#title-content #YOYGrowth p").text(getYOYGrowth("ALL", "ALL", thisYear, thisMonth, "ASP"));
        });
    }
});