var chart;
var ProductList = '<a>ALL</a>';
var ActualQTY = [];

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
        			tickInterval: 500
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
        			name: (thisYear-2) + ' Actual QTY',
        			type: 'column',
        			color: '#0AB5B6',
        			data: [1912, 2904, 3390, 2922, 2794, 1843, 2791, 2702, 2694, 1598, 2605, 3120],
        			pointStart: 1
        		}, {
        			name: (thisYear-1) + ' Actual QTY',
        			type: 'column',
        			color: '#F4A143',
        			data: [2634, 1782, 1851, 2112, 3910, 1010, 1991, 2217, 2781, 3669, 1221, 2150],
        			pointStart: 1
        		}, {
        			name: thisYear + ' Actual QTY',
        			type: 'column',
        			color: '#824E9F',
        			data: [2700, 2806, 711, 601, 577, 496, 901, 661, 1249, 712, 3600, 912],
        			pointStart: 1
        		}, {
        			name: thisYear + ' Actual Budget',
        			type: 'line',
        			color: '#134A8C',
        			lineWidth: 1,
        			data: [910, 1880, 1520, 1250, 1680, 1090, 3520, 2590, 3400, 3080, 1110, 2220],
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