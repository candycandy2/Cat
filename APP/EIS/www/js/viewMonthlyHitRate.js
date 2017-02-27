var chart, ro, product;
var year = thisYear;
var month = thisMonth;
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

        // function addItem2scrollmenu() {
        //     for(var i in eisdata[thisYear][thisMonth]["BQA"]) {
        //         ProductList += '<a>' + i + '</a>';
        //     }
        //     $(".Product").html("");
        //     $(".Product").append(ProductList).enhanceWithin();
        // }

        function getActualValue(ro, product, year, month, type) {
            // var budgetHitRate, YOYGrowth;
            // if(product != "ALL") {
            //     for(var i in eisdata[year][month][ro]) {
            //     }
            // }else {
            // }
        }

        function getBudgetHitRate(ro, product, year, month, type) {
            var divisor, dividend;
            var Actual = 0;
            var Budget = 0;
            if(type == "Quantity") {
                divisor = 1;
                dividend = 0;
            }else if(type == "Amount"){
                divisor = 3;
                dividend = 2;
            }else if(type == "ASP"){
                divisor = 5;
                dividend = 4;
            }
            if (ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][dividend];
                        Budget += eisdata[year][month][i][j][divisor];
                    }
                }
                return (Actual / Budget) * 100;
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][dividend];
                    Budget += eisdata[year][month][ro][i][divisor];
                }
                return (Actual / Budget) * 100;
            }else if(ro == "ALL" && product != "ALL"){
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][dividend];
                    Budget += eisdata[year][month][i][product][divisor];
                }
                return (Actual / Budget) * 100;
            }else {
                return (eisdata[year][month][ro][product][dividend] / eisdata[year][month][ro][product][divisor]) * 100;
            }    
        }

        // function getYOYGrowth(ro, product, year, month) {
        //     var ActualAMT = 0;
        //     var lastActualAMT = 0; 
        //     if (ro == "ALL" && product == "ALL") {
        //         for(var i in eisdata[year][month]) {   //ro
        //             for(var j in eisdata[year][month][i]) {   //product
        //                 ActualAMT += Number(eisdata[year][month][i][j][3]);
        //                 lastActualAMT += Numbrt(eisdata[year-1][month][i][j][3]);
        //             }
        //         }
        //         return (ActualAMT / BudgetAMT) * 100;
        //     }else if(ro != "ALL" && product == "ALL") {
        //         for(var i in eisdata[year][month][ro]) {
        //             ActualAMT += Number(eisdata[year][month][ro][i][3]);
        //             BudgetAMT += Number(eisdata[year][month][ro][i][2]);
        //         }
        //         return (ActualAMT / BudgetAMT) * 100;
        //     }else if(ro == "ALL" && product != "ALL"){
        //         for(var i in eisdata[year][month]) {
        //             ActualAMT += Number(eisdata[year][month][i][product][3]);
        //             BudgetAMT += Number(eisdata[year][month][i][product][2]);
        //         }
        //         return (ActualAMT / BudgetAMT) * 100;
        //     }else {
        //         return (eisdata[year][month][ro][product][3] / eisdata[year][month][ro][product][2]) * 100;
        //     }
        // }

        function getHighchartsData() {
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
            // $(".slider").slick({
            //     autopaly: false,
            //     dots: false,
            //     responseive: [{
            //         breakpoint: 500,
            //         settings: {
            //             arrows: true,
            //             infinite: false,
            //             slidesToShow: 2,
            //             slidesToScroll: 2
            //         }
            //     }]
            // });
        });

        $(".page-tabs #viewMonthlyHitRate-tab-1").on("click", function() {
            // getActualValue("ALL", "ALL", thisYear, thisMonth, "ACTUAL_QTY");
            // var a = getBudgetHitRate(ro, product, thisYear, thisMonth, "Quantity");
            var a = getBudgetHitRate("ALL", "ALL", thisYear, thisMonth, "Quantity");
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
            // getActualValue("ALL", "ALL", thisYear, thisMonth, "ACTUAL_ADJ_AMT");
            // var a = getBudgetHitRate(ro, product, thisYear, thisMonth, "Amount");
            var a = getBudgetHitRate("ALL", "ALL", thisYear, thisMonth, "Amount");
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
            // getActualValue("ALL", "ALL", thisYear, thisMonth, "");
            var a = getBudgetHitRate("ALL", "ALL", thisYear, thisMonth, "ASP");
        });
    }
});