var chart, ro, product, year, month, actualValue, budgetHitRate, yoyGrowth, tab;
var ProductList = '<a id="ALL">ALL</a>';
var ActualQTY = {};
var BudgetQTY = {};
var ActualAMT = {};
var BudgetAMT = {};
var HighchartsName = "Actual QTY";

$("#viewMonthlyHitRate").pagecontainer({
    create: function(event, ui) {

        window.UserAuthority = function() {
            
            this.successCallback = function(data) {
                callbackData = data["Content"]["DataList"];
                length = callbackData.length;
                for(var i=0; i<length; i++) {
                    for(var j in callbackData[i]) {
                        if(callbackData[i][j] == "PRODUCT") {
                            ProductList += '<a id="' + callbackData[i]["PVALUE"] + '">' + callbackData[i]["PVALUE"] + '</a>' ;
                        }
                    }
                }
                $(".Product").html("");
                $(".Product").append(ProductList).enhanceWithin();
                setScrollMenuHeight();
            };
            this.failCallback = function(data) {
                console.log("api misconnected");
            };
            var _construct = function() {
                CustomAPI("POST", true, "UserAuthority", self.successCallback, self.failCallback, queryData, "");
            }();
        };

        window.ProductDetail = function() {
            year = thisYear;
            month = thisMonth;
            this.successCallback = function(data) {
                callbackData = data["Content"]["DataList"];
                length = callbackData.length;
                convertData();
                // addItem2scrollmenu();
            }

            this.failCallback = function(data) {
                console.log("api misconnected");
            }

            var _constrcut = function() {
                CustomAPI("POST", true, "ProductDetail", self.successCallback, self.failCallback, queryData, "");
            }();
        };

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
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                }
            }else if(ro == "ALL" && product != "ALL"){
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                }
            }else {
                Actual = eisdata[year][month][ro][product][actualIndex];
            }
            return Math.round(Actual * Math.pow(10, 2)) / 100;
        }

        function getBudgetHitRate(ro, product, year, month, type) {
            var actualIndex, budgetIndex, result;
            var Actual = 0;
            var Budget = 0;
            if(type == "Quantity") {
                budgetIndex = 1;
                actualIndex = 0;
            }else if(type == "Amount") {
                budgetIndex = 3;
                actualIndex = 2;
            }else if(type == "ASP") {
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
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    Budget += eisdata[year][month][ro][i][budgetIndex];
                }
            }else if(ro == "ALL" && product != "ALL"){
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    Budget += eisdata[year][month][i][product][budgetIndex];
                }
            }else {
                Actual = eisdata[year][month][ro][product][actualIndex];
                Budget = eisdata[year][month][ro][product][budgetIndex];
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
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    if(eisdata[year-1][month][ro].hasOwnProperty(i)) {
                        lastActual += eisdata[year-1][month][ro][i][actualIndex];
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    Actual += eisdata[year][month][i][product][actualIndex];
                    if(eisdata[year-1][month][i].hasOwnProperty(product)) {
                        lastActual += eisdata[year-1][month][i][product][actualIndex];
                    }
                }
            }else {
                if(eisdata[year-1][month][ro].hasOwnProperty(product)) {
                    Actual = eisdata[year][month][ro][product][actualIndex];
                    lastActual = eisdata[year-1][month][ro][product][actualIndex];
                }
            }
            if(lastActual != 0){
                return Math.round(((Actual / lastActual) - 1) * Math.pow(10, 4)) / 100;
            }else {
                return 0;
            }
        }

        function getHighchartsData(ro, product, year, month, type) {
            var actualIndex, budgetIndex;
            var total = 0;
            var Actual = 0;
            if(type == "Quantity") {
                actualIndex = 0;
                budgetIndex = 1;
            }else if(type == "Amount") {
                actualIndex = 2;
                budgetIndex = 3;
            }else if(type == "ASP") {
                actualIndex = 4;
                budgetIndex = 5;
            }
            if (ro == "ALL" && product == "ALL") {
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
            }else if(ro != "ALL" && product == "ALL") {
                
            }else if(ro == "ALL" && product != "ALL") {
                
            }else {

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

        function setScrollMenuHeight(){
            $('div.scrollmenu a').css({'width': ($('body').width()-5)/6});
        }

        /********************************** page event *************************************/
        $("#viewMonthlyHitRate").on("pageshow", function(event, ui) {
            tab = "Quantity";
            ro = "ALL";
            product = "ALL";
            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            yoyGrowth = getYOYGrowth(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            getHighchartsData(ro, product, thisYear, thisMonth, tab);
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
        			name: (thisYear-3) + " " + HighchartsName,
        			type: 'column',
        			color: '#0AB5B6',
        			data: ActualQTY[thisYear-3],
        			pointStart: 1
        		}, {
        			name: (thisYear-2) + " " + HighchartsName,
        			type: 'column',
        			color: '#F4A143',
        			data: ActualQTY[thisYear-2],
        			pointStart: 1
        		}, {
        			name: (thisYear-1) + " " + HighchartsName,
        			type: 'column',
        			color: '#824E9F',
        			data: ActualQTY[thisYear-1],
        			pointStart: 1
        		}, {
        			name: (thisYear-3) + " " + "Actual Budget",
        			type: 'line',
        			color: '#134A8C',
        			lineWidth: 1,
        			// data: BudgetAMT[thisYear-1],
        			pointStart: 1
        		}]
        	});
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
            //     }],
            //     infinite: false
            // });
            showData();
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');
            loadingMask("hide");
        });

        $(".page-tabs #viewMonthlyHitRate-tab-1").on("click", function() {
            tab = "Quantity";
            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            yoyGrowth = getYOYGrowth(ro, product, thisYear, thisMonth, tab);
            HighchartsName = "Actual QTY";
            showData();
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
            tab = "Amount";
            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            yoyGrowth = getYOYGrowth(ro, product, thisYear, thisMonth, tab);
            HighchartsName = "Actual AMT";
            showData();
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
            tab = "ASP";
            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            yoyGrowth = getYOYGrowth(ro, product, thisYear, thisMonth, tab);
            HighchartsName = "Actual ASP";
            showData();
        });

        // scroll menu on click
        $(document).on('click', '.Ro > a', function(e){
            e.preventDefault();
            ro = $(this).context.id
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            yoyGrowth = getYOYGrowth(ro, product, thisYear, thisMonth, tab);
            showData();
        });

        $(document).on('click', '.Product > a', function(e){
            e.preventDefault();
            product = $(this).context.id;
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            yoyGrowth = getYOYGrowth(ro, product, thisYear, thisMonth, tab);
            showData();
        });
    }
});