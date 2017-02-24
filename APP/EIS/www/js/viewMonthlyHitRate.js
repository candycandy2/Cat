var chart;
var ProductList = '<a>ALL</a>';
var ActualQTY = {};
var BudgetAMT = {};

$("#viewMonthlyHitRate").pagecontainer({
    create: function(event, ui) {

        // window.UserAuthority = function() {
            
        //     this.successCallback = function(data) {
        //         callbackData = data["Content"]["DataList"];
        //         length = callbackData.length;
        //         for(var i=0; i<length; i++) {
        //             for(var j in callbackData[i]) {
        //                 if(callbackData[i][j] == "PRODUCT") {
        //                     ProductList += '<a>' + callbackData[i]["PVALUE"] + '</a>' ;
        //                 }
        //             }
        //         }
        //         $(".Product").html("");
        //         $(".Product").append(ProductList).enhanceWithin();
        //     };
        //     this.failCallback = function(data) {
        //         console.log("api misconnected");
        //     };
        //     var _construct = function() {
        //         CustomAPI("POST", true, "UserAuthority", self.successCallback, self.failCallback, queryData, "");
        //     }();
        // };


        window.ProductDetail = function() {

            this.successCallback = function(data) {
                callbackData = data["Content"]["DataList"];
                length = callbackData.length;
                convertData();
                addItem2scrollmenu();
                getHighchartsData();
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

        function addItem2scrollmenu() {
            for(var i in eisdata[thisYear][thisMonth]["BQA"]) {
                ProductList += '<a>' + i + '</a>';
            }
            $(".Product").html("");
            $(".Product").append(ProductList).enhanceWithin();
        }

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
                            ActualQTY[year][Number(month)-1] += Number(eisdata[year][month][ro][product][1]);
                            BudgetAMT[year][Number(month)-1] += Number(eisdata[year][month][ro][product][2]);
                        }
                    }
                }
            }
        }

        function convertData() {
            var month, rosite;
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
                            eisdata[i][j][rosite][callbackData[index]["PRODUCT"]] = [
                                callbackData[index]["BUDGET_QTY"],
                                callbackData[index]["ACTUAL_QTY"],
                                callbackData[index]["BUDGET_AMT"],
                                callbackData[index]["ACTUAL_ADJ_AMT"]
                            ];
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
            
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
          
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
           
        });
    }
});