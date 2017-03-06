var chart, ro, product, year, month, actualValue, budgetHitRate, tab;
var Actual = {};
var Budget = {};
var HighchartsName = "Actual QTY";
var highchartsData = {
    "Actual QTY" : {},
    "Actual AMT" : {},
    "Actual ASP" : {}, 
    "Budget QTY" : {},
    "Budget AMT" : {},
    "Budget ASP" : {}
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
                    Actual = eisdata[year][index][ro][product][actualIndex];
                    Budget = eisdata[year][index][ro][product][budgetIndex];
                    ActualQTY = eisdata[year][index][ro][product][0];
                    BudgetQTY = eisdata[year][index][ro][product][1];
                    ActualAMT = eisdata[year][index][ro][product][2];
                    BudgetAMT = eisdata[year][index][ro][product][3];
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
            if(budgetHitRate <= 80) {
                $("#title-content #BudgetHitRate p").css("color", "#ee3839");
            }else if(budgetHitRate > 95) {
                $("#title-content #BudgetHitRate p").css("color", "#48af56");
            }else {
                $("#title-content #BudgetHitRate p").css("color", "#e6be20");
            }
        }

        /********************************** page event *************************************/
        $("#viewYTDHitRate").on("pageshow", function(event, ui) {
			$(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');

            ro = "ALL";
            product = "ALL";
            tab = "QTY";
            year = thisYear;
            month = thisMonth;

            actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
            getHighchartsData(ro, product, thisYear, thisMonth);
            
			chart = new Highcharts.Chart ({
				chart: {
					renderTo: 'viewYTDHitRate-hc-canvas',
					marginBottom: 75,
					marginTop: 25,
					marginLeft: 55
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
						y: 6.5
					},
			    	tickInterval: 1,
			    	crosshair: true
				},
				yAxis: [{
		    		title: {
		        		text: 'USD($K)',
		        		align: 'high',
		        		rotation: 0,
		        		offset: 0,
		        		x: 4,
		        		y: -15
		    		},
		        	min: 0,
		        	tickInterval: 200
			    }, {
			    	title: {
		        		text: '',
		    		},
		    		opposite: true,
		        	min: 0,
		        	tickInterval: 500
			    }],
				legend: {
					align: 'left',
					float: true,
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
			        	borderWidth: 0
			    	}
				},
				exporting: {
					enabled: false
				},
				series: [{
			    	name: 'Budget QTY',
			    	type: 'column',
			    	color: '#0AB5B6',
			    	// data: [3612, 2904, 3339, 2922, 1794, 1843, 2791, 2702, 1694, 2598, 2605, 3212],
			    	pointStart: 1
				},{
					name: 'Actual QTY',
					type: 'column',
					color: '#F4A143',
			    	// data: [2634, 2782, 2851, 2112, 3191, 3101, 2991, 2217, 2781, 2669, 3221, 2215],
        			pointStart: 1
				},{
					name: 'RT Budget QTY',
					type: 'line',
					color: '#A0C83A',
					// data: [10, 26, 45, 86, 168, 426, 840, 1280, 2160, 2913, 3524, 3948],
					pointStart: 1
				},{
					name: 'RT Actual QTY',
					type: 'line',
					color: '#134A8C',
					// data: [10, 22, 41, 83, 161, 320, 764, 1280, 1060, 1120, 1024, 2048],
					yAxis: 1,
					pointStart: 1
				}]
			});
			// initSlider();
            showData();
            chart.series[0].setData(highchartsData["Actual QTY"][thisYear-3], true, true, false);
            chart.series[1].setData(highchartsData["Actual QTY"][thisYear-2], true, true, false);
            chart.series[2].setData(highchartsData["Actual QTY"][thisYear-1], true, true, false);
            chart.series[3].setData(highchartsData["Budget QTY"][thisYear-1], true, true, false);
            $("label[for=viewYTDHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewYTDHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewYTDHitRate-tab-3]").removeClass('ui-btn-active');
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');
			loadingMask("hide");
        });

        // function initSlider(){
        //     $(".sliderYTD").slick({
        //         autopaly: false,
        //         dots: false,
        //         infinite: false
        //     });
        // }

        // $(document).ready(function(){
        //     $(".sliderYTD").slick({
        //         autopaly: false,
        //         dots: false,
        //         infinite: false
        //     });
        // });
        
        // $("#viewYTDHitRate").on("ready", function () {
        //     initSlider();
        // });

		$(".page-tabs #viewYTDHitRate-tab-1").on("click", function() {
		    tab = "QTY";
		    actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
		    HighchartsName = "Actual QTY";
		    showData();
		    chart.series[0].setData(highchartsData["Actual QTY"][thisYear-3], true, true, false);
            chart.series[1].setData(highchartsData["Actual QTY"][thisYear-2], true, true, false);
            chart.series[2].setData(highchartsData["Actual QTY"][thisYear-1], true, true, false);
            chart.series[3].setData(highchartsData["Budget QTY"][thisYear-1], true, true, false);
		});

		$(".page-tabs #viewYTDHitRate-tab-2").on("click", function() {
		    tab = "AMT";
		    actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
		    HighchartsName = "Actual AMT";
		    showData();
		    chart.series[0].setData(highchartsData["Actual AMT"][thisYear-3], true, true, false);
            chart.series[1].setData(highchartsData["Actual AMT"][thisYear-2], true, true, false);
            chart.series[2].setData(highchartsData["Actual AMT"][thisYear-1], true, true, false);
            chart.series[3].setData(highchartsData["Budget AMT"][thisYear-1], true, true, false);
		});

		$(".page-tabs #viewYTDHitRate-tab-3").on("click", function() {
		    tab = "ASP";
		    actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
		    HighchartsName = "Actual ASP";
		    showData();
		    chart.series[0].setData(highchartsData["Actual ASP"][thisYear-3], true, true, false);
            chart.series[1].setData(highchartsData["Actual ASP"][thisYear-2], true, true, false);
            chart.series[2].setData(highchartsData["Actual ASP"][thisYear-1], true, true, false);
            chart.series[3].setData(highchartsData["Budget ASP"][thisYear-1], true, true, false);
		});
		// scroll menu on click
		$(document).on('click', '#viewYTDHitRate .Ro > a', function(e) {
		    e.preventDefault();
		    ro = $(this).context.id
		    $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
		    $(this).addClass('hover');
		    actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
            budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
		    getHighchartsData(ro, product, thisYear, thisMonth);
		    showData();
		    chart.series[0].setData(highchartsData["Actual " + tab][thisYear-3], true, true, false);
            chart.series[1].setData(highchartsData["Actual " + tab][thisYear-2], true, true, false);
            chart.series[2].setData(highchartsData["Actual " + tab][thisYear-1], true, true, false);
            chart.series[3].setData(highchartsData["Budget " + tab][thisYear-1], true, true, false);
		});

		$(document).on('click', '#viewYTDHitRate .Product > a', function(e) {
		    e.preventDefault();
		    product = $(this).context.id;
		    $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
		    $(this).addClass('hover');
		    actualValue = getActualValue(ro, product, thisYear, thisMonth, tab);
		    budgetHitRate = getBudgetHitRate(ro, product, thisYear, thisMonth, tab);
		    getHighchartsData(ro, product, thisYear, thisMonth);
		    showData();
            chart.series[0].setData(highchartsData["Actual " + tab][thisYear-3], true, true, false);
            chart.series[1].setData(highchartsData["Actual " + tab][thisYear-2], true, true, false);
            chart.series[2].setData(highchartsData["Actual " + tab][thisYear-1], true, true, false);
            chart.series[3].setData(highchartsData["Budget " + tab][thisYear-1], true, true, false);
		});
    }
});