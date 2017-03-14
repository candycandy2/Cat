var chart, ro, product, year, month, actualValue, budgetHitRate, tab;
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
                        Actual += eisdata[year][index][ro][product][actualIndex];
                        totalQTY += eisdata[year][index][ro][product][0];
                        totalAMT += eisdata[year][index][ro][product][2];
                    }
                    index++;
                }
            }else {
                while(index <= Number(month)) {
                    Actual += eisdata[year][index][ro][product][actualIndex];
                    totalQTY += eisdata[year][index][ro][product][0];
                    totalAMT += eisdata[year][index][ro][product][2];
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
                        Actual += eisdata[year][index][ro][product][actualIndex];
                        Budget += eisdata[year][index][ro][product][budgetIndex];
                        ActualQTY += eisdata[year][index][ro][product][0];
                        BudgetQTY += eisdata[year][index][ro][product][1];
                        ActualAMT += eisdata[year][index][ro][product][2];
                        BudgetAMT += eisdata[year][index][ro][product][3];
                    }
                    index++;
                }
            }else {
                while(index <= Number(month)){
                    Actual += eisdata[year][index][ro][product][actualIndex];
                    Budget += eisdata[year][index][ro][product][budgetIndex];
                    ActualQTY += eisdata[year][index][ro][product][0];
                    BudgetQTY += eisdata[year][index][ro][product][1];
                    ActualAMT += eisdata[year][index][ro][product][2];
                    BudgetAMT += eisdata[year][index][ro][product][3];
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
		
		function getHighchartsData(ro, product, year, month) {
            var rtAQ = 0;
            var rtBQ = 0;
            var rtAA = 0;
            var rtBA = 0;
            for(var i in ytdHighchartsData) {
                ytdHighchartsData[i] = [];
            }
            if(ro == "ALL" && product == "ALL") {
                for(var month in eisdata[year]) {
                	for(var i in ytdHighchartsData) {
                		ytdHighchartsData[i][Number(month)-1] = 0;
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
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1]  / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var month in eisdata[year]) {
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
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {    
                for(var month in eisdata[year]) {
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
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] / ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }else {
                for(var month in eisdata[year]) {
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
                    if(ytdHighchartsData["Actual QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Actual QTY"][Number(month)-1] != 0) {
                        ytdHighchartsData["Actual ASP"][Number(month)-1] = (ytdHighchartsData["Actual AMT"][Number(month)-1] / ytdHighchartsData["Actual QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Actual ASP"][Number(month)-1] = (ytdHighchartsData["RT Actual AMT"][Number(month)-1] / ytdHighchartsData["RT Actual QTY"][Number(month)-1]);
                    }
                	if(ytdHighchartsData["Budget QTY"][Number(month)-1] != 0 && ytdHighchartsData["RT Budget QTY"][Number(month)-1] != 0){
                		ytdHighchartsData["Budget ASP"][Number(month)-1] = (ytdHighchartsData["Budget AMT"][Number(month)-1] / ytdHighchartsData["Budget QTY"][Number(month)-1]);
                        ytdHighchartsData["RT Budget ASP"][Number(month)-1] = (ytdHighchartsData["RT Budget AMT"][Number(month)-1] /ytdHighchartsData["RT Budget QTY"][Number(month)-1]);
                    }
                }
            }
        }

		function showData() {
            $("#title-content #ActualValue p").text(actualValue);
            $("#title-content #BudgetHitRate p").text(budgetHitRate + "%");
            if(budgetHitRate <= 80) {
                $("#title-content #BudgetHitRate p").css("color", "#ee3839");
            }else if(budgetHitRate > 95) {
                $("#title-content #BudgetHitRate p").css("color", "#48af56");
            }else {
                $("#title-content #BudgetHitRate p").css("color", "#e6be20");
            }
        }

        function initSlider() {
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
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            getHighchartsData(ro, product, year, month);
            chart.series[0].setData(ytdHighchartsData["Budget " + tab], true, true, false);
            chart.series[1].setData(ytdHighchartsData["Actual " + tab], true, true, false);
            chart.series[2].setData(ytdHighchartsData["RT Budget " + tab], true, true, false);
            chart.series[3].setData(ytdHighchartsData["RT Actual " + tab], true, true, false);
            showData();
        });

        /********************************** page event *************************************/
        $("#viewYTDHitRate").on("pageshow", function(event, ui) {
            ro = "ALL";
            product = "ALL";
            tab = "QTY";
            year = thisYear;
            month = thisMonth;
            initSlider();
            $(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');

			chart = new Highcharts.Chart ({
				chart: {
					renderTo: 'viewYTDHitRate-hc-canvas',
					marginBottom: 75,
					marginTop: 25,
					marginLeft: 60,
                    marginRight: 25
				},
				title: {
					text: '' 
				},
				xAxis: {
					title: {
						text: '(Mth)',
						align: 'high',
						offset: 0,
						x: 25,
						y: 7
					},
			    	tickInterval: 1,
                    max: 12,
                    min: 1,
			    	crosshair: true
				},
				yAxis: [{
		    		title: {
		        		text: ''
		    		},
		        	min: 0
			    }, {
			    	title: {
		        		text: '',
		    		},
		    		opposite: true,
		        	min: 0,
			    }],
				legend: {
					align: 'left',
					float: true,
                    itemDistance: 30,
					x: -3,
					y: 5
				},
				credits: {
					enabled: false
				},
				tooltip: {
			    	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			    	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			        	'<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
			    	footerFormat: '</table>',
			    	shared: false,
			    	useHTML: true
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
			    	name: 'Budget QTY',
			    	type: 'column',
			    	color: '#0AB5B6',
				},{
					name: 'Actual QTY',
					type: 'column',
					color: '#F4A143',
				},{
					name: 'RT Budget QTY',
					type: 'line',
					color: '#A0C83A',
                    // yAxis: 1,
				},{
					name: 'RT Actual QTY',
					type: 'line',
					color: '#134A8C',
					// yAxis: 1,
				}]
			});
            showData();
            $("#viewYTDHitRate #title-container > #title > #actualValue > p").text("YTD Net Quantity");
            $("label[for=viewYTDHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewYTDHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewYTDHitRate-tab-3]").removeClass('ui-btn-active');
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');
            $(".sliderYTD").slick("slickGoTo", ytdPageDate.length-1, true);
			loadingMask("hide");
        });

		$(".page-tabs #viewYTDHitRate-tab-1").on("click", function() {
		    tab = "QTY";
		    actualValue = getActualValue(ro, product, year, month, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
		    showData();
            $("#title-container > #title > #actualValue > p").text("YTD Net Quantity");
		    chart.series[0].update({name: "Budget " + tab, data: ytdHighchartsData["Budget " + tab]});
            chart.series[1].update({name: "Actual " + tab, data: ytdHighchartsData["Actual " + tab]});
            chart.series[2].update({name: "RT Budget " + tab, data: ytdHighchartsData["RT Budget " + tab]});
            chart.series[3].update({name: "RT Actual " + tab, data: ytdHighchartsData["RT Actual " + tab]});
            chart.yAxis[0].setTitle({
                text: '',
            });
		});

		$(".page-tabs #viewYTDHitRate-tab-2").on("click", function() {
		    tab = "AMT";
		    actualValue = getActualValue(ro, product, year, month, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
		    showData();
            $("#title-container > #title > #actualValue > p").text("YTD Adj. Sales");
		    chart.series[0].update({name: "Budget " + tab, data: ytdHighchartsData["Budget " + tab]});
            chart.series[1].update({name: "Actual " + tab, data: ytdHighchartsData["Actual " + tab]});
            chart.series[2].update({name: "RT Budget " + tab, data: ytdHighchartsData["RT Budget " + tab]});
            chart.series[3].update({name: "RT Actual " + tab, data: ytdHighchartsData["RT Actual " + tab]});
            chart.yAxis[0].setTitle({
                text: '(USD)',
                align: 'high',
                rotation: 0,
                offset: 0,
                x: -11,
                y: -11
            });
		});

		$(".page-tabs #viewYTDHitRate-tab-3").on("click", function() {
		    tab = "ASP";
		    actualValue = getActualValue(ro, product, year, month, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
		    showData();
            $("#title-container > #title > #actualValue > p").text("YTD ASP");
            chart.series[0].update({name: "Budget " + tab, data: ytdHighchartsData["Budget " + tab]});
		    chart.series[1].update({name: "Actual " + tab, data: ytdHighchartsData["Actual " + tab]});
            chart.series[2].update({name: "RT Budget " + tab, data: ytdHighchartsData["RT Budget " + tab]});
            chart.series[3].update({name: "RT Actual " + tab, data: ytdHighchartsData["RT Actual " + tab]});
            chart.yAxis[0].setTitle({
                text: '(USD)',
                align: 'high',
                rotation: 0,
                offset: 0,
                x: -11,
                y: -11
            });
        });
		// scroll menu on click
		$(document).on('click', '#viewYTDHitRate .Ro > a', function(e) {
		    e.preventDefault();
		    ro = $(this).context.id
		    $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
		    $(this).addClass('hover');
		    actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
		    getHighchartsData(ro, product, year, month);
		    showData();
		    chart.series[0].setData(ytdHighchartsData["Budget " + tab], true, true, false);
            chart.series[1].setData(ytdHighchartsData["Actual " + tab], true, true, false);
            chart.series[2].setData(ytdHighchartsData["RT Budget " + tab], true, true, false);
            chart.series[3].setData(ytdHighchartsData["RT Actual " + tab], true, true, false);
		});

		$(document).on('click', '#viewYTDHitRate .Product > a', function(e) {
		    e.preventDefault();
		    product = $(this).context.id;
		    $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
		    $(this).addClass('hover');
		    actualValue = getActualValue(ro, product, year, month, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
		    getHighchartsData(ro, product, year, month);
		    showData();
            chart.series[0].setData(ytdHighchartsData["Budget " + tab], true, true, false);
            chart.series[1].setData(ytdHighchartsData["Actual " + tab], true, true, false);
            chart.series[2].setData(ytdHighchartsData["RT Budget " + tab], true, true, false);
            chart.series[3].setData(ytdHighchartsData["RT Actual " + tab], true, true, false);
        });
    }
});