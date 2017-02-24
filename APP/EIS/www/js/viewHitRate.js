var chart;
var thisMonthBudgetAMT = [];
var thisMonthActualAMT = [];
var lastMonthBudgetAMT = [];
var lastMonthActualAMT = [];
var YTDBudgetAMT = [];
var YTDActualAMT = [];
var lastYTDActualAMT = {};
var thisMonthData = {};
var lastMonthData = {};
var ytdData = {};

$("#viewHitRate").pagecontainer ({
    create: function(event, ui) {
    	
    	window.ROSummary = function() {
		
	    	this.successCallback = function(data) {
	    		callbackData = data["Content"]["DataList"];
	    		length = callbackData.length;
	    		thisYear = callbackData[length-1]["YEAR"];
	    		thisMonth = callbackData[length-1]["MONTH"];
	    		$("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
	    		
	    		convertData();
	    		
	    		getHighcahrtsData(thisYear, thisMonth, "BUDGET_AMT", thisMonthBudgetAMT);
	    		getHighcahrtsData(thisYear, thisMonth, "ACTUAL_ADJ_AMT", thisMonthActualAMT);
	    		
                for(var i in eisdata[thisYear][thisMonth]) {
                    thisMonthData[i] = {};
                    lastMonthData[i] = {};
                    ytdData[i] = {};
                }

                for(var i in eisdata[thisYear-1][thisMonth]) {
                    lastYTDActualAMT[i] = 0;
                    for(var j in eisdata[thisYear-1]) {
                        if(Number(j) <= Number(thisMonth)) {
                            lastYTDActualAMT[i] += (Number(eisdata[thisYear-1][j][i][1])); 
                        }
                    }
                }

                calculateData(thisYear, thisMonth, "YOYGrowth", thisMonthData);
                calculateData(thisYear, thisMonth, "BudgetHitRate", thisMonthData);
                showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT,thisMonthData);
                loadingMask("hide");

                getHighcahrtsData(thisYear, thisMonth-1, "BUDGET_AMT", lastMonthBudgetAMT);
                getHighcahrtsData(thisYear, thisMonth-1, "ACTUAL_ADJ_AMT", lastMonthActualAMT);
                getHighcahrtsData(thisYear, thisMonth, "YTDBUDGET_AMT", YTDBudgetAMT);
                getHighcahrtsData(thisYear, thisMonth, "YTDACTUAL_ADJ_AMT", YTDActualAMT);
	    		calculateData(thisYear, thisMonth-1, "YOYGrowth", lastMonthData);
	    		calculateData(thisYear, thisMonth-1, "BudgetHitRate", lastMonthData);
	    		calculateData(thisYear, thisMonth, "YTDYOYGrowth", ytdData);
	    		calculateData(thisYear, thisMonth, "YTDBudgetHitRate", ytdData);
                ProductDetail();
            };

	    	this.failCallback = function(data) {
	    		console.log("api misconnected");
	    	};

			var _construct = function() {
				CustomAPI("POST", true, "ROSummary", self.successCallback, self.failCallback, queryData, "");
			}();
		};

    	function calculateData(year, month, type, data_array) {
    		var index = 0;
    		if(month == 0) {
    			month = 12;
    			year--;
    		}
    		if(type == "YOYGrowth") {
	    		for(var i in eisdata[year][month]) {
	    			data_array[i]["YOYGrowth"] = (eisdata[year][month][i][1] / eisdata[year-1][month][i][1]) - 1;
	    		}
    		}else if(type == "BudgetHitRate") {
    			for(var i in eisdata[year][month]) {
    				data_array[i]["BudgetHitRate"] = eisdata[year][month][i][1] / eisdata[year][month][i][0];
    			}
    		}else if(type == "YTDYOYGrowth") {
    			for(var i in eisdata[year][month]) {
    				data_array[i]["YOYGrowth"] = (YTDActualAMT[index++] / lastYTDActualAMT[i]) - 1;
    			}
    		}else if(type == "YTDBudgetHitRate") {
    			for(var i in eisdata[year][month]) {
    				data_array[i]["BudgetHitRate"] = (YTDActualAMT[index] / YTDBudgetAMT[index]);
    				index++;
    			}
    		}
    	}

    	function showData(tab, AAMT_array, BAMT_array, data_array) {
    		var pattern = /(^[0-9\-]*\.{0,1}\d{0,2})\d*/;
    		var index = 0;
    		var ActualAMT, budgetHitRate, YOYGrowth, totalBudgetHitRate, totalYOYGrowth;
            var totalActualAMT = 0;
            var totalBudgetAMT = 0;
            var totalLastYTDActualAMT = 0;
			for(var ro in data_array) {
				ActualAMT = "" + (AAMT_array[index++] / Math.pow(10, 6));
				budgetHitRate = "" + (data_array[ro]["BudgetHitRate"] * 100);
				YOYGrowth = "" + (data_array[ro]["YOYGrowth"] * 100);
				$("#" + ro + " .AS span").text(ActualAMT.match(pattern)[1]);
                totalActualAMT += Number(ActualAMT.match(pattern)[1]);
				$("#" + ro + " .HR span").text(budgetHitRate.match(pattern)[1] + "%");
				
				if(Number(YOYGrowth.match(pattern)[1]) < 0) {
    				$("#" + ro + " .YR span").text(YOYGrowth.match(pattern)[1] + "%");
    			}else {
    				$("#" + ro + " .YR span").text("+" + YOYGrowth.match(pattern)[1] + "%");
    			}

				if((data_array[ro]["BudgetHitRate"] * 100) < 80) {
					$("#" + ro + " .HR").css('background', '#ee3839');
				}else if((data_array[ro]["BudgetHitRate"] * 100) >= 95) {
					$("#" + ro + " .HR").css('background', '#48af56');
				}else{
					$("#" + ro + " .HR").css('background', '#e6be20');
				}
				if((data_array[ro]["YOYGrowth"] * 100) < 0 ) {
					$("#" + ro + " .YR").css('background', '#ee3839');
				}else{
					$("#" + ro + " .YR").css('background', '#48af56');
				}
			}
            $("#total .dataContainer .AS span").text((""+totalActualAMT).match(pattern)[1]);
            for(var i=0; i<AAMT_array.length; i++) {
                totalActualAMT += AAMT_array[i];
                totalBudgetAMT += BAMT_array[i];
            }
            totalBudgetHitRate = "" + ((totalActualAMT / totalBudgetAMT) * 100);
            if(Number(totalBudgetHitRate) < 80) {
                $("#total .dataContainer .HR").css('background', '#ee3839');
            }else if(Number(totalBudgetHitRate) >= 95) {
                $("#total .dataContainer .HR").css('background', '#48af56');
            }else {
                $("#total .dataContainer .HR").css('background', '#e6be20');
            }
            $("#total .dataContainer .HR span").text(totalBudgetHitRate.match(pattern)[1] + "%");     
            for(var i in lastYTDActualAMT) {
                totalLastYTDActualAMT += lastYTDActualAMT[i];
            }
            totalYOYGrowth = ((totalActualAMT / totalLastYTDActualAMT) - 1) * 100;
            if(totalYOYGrowth < 0) {
                $("#total .dataContainer .YR span").text((""+totalYOYGrowth).match(pattern)[1]+"%");
                $("#total .dataContainer .YR").css('background', '#ee3839')
            }else{
                $("#total .dataContainer .YR span").text(("+"+(""+totalYOYGrowth).match(pattern)[1])+"%");
                $("#total .dataContainer .YR").css('background', '#48af56');
            }
        }

    	function getHighcahrtsData(year, month, type, data_array) {
    		var index = 0;
    		if(month == 0) {
    			month = 12;
    			year--;
    		}
    		if(type == "BUDGET_AMT") {
	    		for(var i in eisdata[year][month]) {
	    			data_array[index++] = (Number(eisdata[year][month][i][0]));
	    		}
    		}else if(type == "ACTUAL_ADJ_AMT") {
    			for(var i in eisdata[year][month]) {
	    			data_array[index++] = (Number(eisdata[year][month][i][1]));
	    		}
    		}else if(type == "YTDBUDGET_AMT") {
    			for(var i in eisdata[year][month]) {
    				data_array[index] = 0;
    				for(var j in eisdata[year]) {
    					data_array[index] += (Number(eisdata[year][j][i][0])); 
    				}
    				index++;
    			}
    		}else if(type == "YTDACTUAL_ADJ_AMT") {
    			for(var i in eisdata[year][month]) {
    				data_array[index] = 0;
    				for(var j in eisdata[year]) {
    					data_array[index] += (Number(eisdata[year][j][i][1])); 
    				}
    				index++;
    			}
    		}
    	}

    	function convertData() {
    		var month;
    		var rosite = 0;
	    	for(var i=callbackData[0]["YEAR"]; i<=callbackData[length-1]["YEAR"]; i++) {
	    		eisdata[i] = {};
	    		month = (i == callbackData[length-1]["YEAR"]) ? (callbackData[length-1]["MONTH"]) : 12;  
	    		for(var j=1; j<=month; j++) {
	    			eisdata[i][j] = {};
	    			for(var k=0; k<5 && rosite<length; k++) {
	    				eisdata[i][j][callbackData[rosite]["RO_SITE"]] = 
	    						[callbackData[rosite]["BUDGET_AMT"], callbackData[rosite]["ACTUAL_ADJ_AMT"]];
	    				rosite++;
	    			}
	    		}
	    	}
    	}

		/********************************** page event *************************************/
        $("#viewHitRate").on("pageshow", function(event, ui) {
			chart = new Highcharts.Chart ({
				chart: {
					renderTo: 'viewHitRate-hc-canvas',
					marginTop: 30,
					marginLeft: 50
				},
				title: {
					text: '' 
				},
				xAxis: {
			    	categories: [
			        	'BQA',
			       		'BQC',
			       		'BQE',
			       		'BQL',
			       		'BQP'
			    	],
			    	crosshair: true
				},
				yAxis: {
        			title: {
        				text: '(USD$M)',
        				align: 'high',
        				rotation: 0,
        				offset: 0,
        				x: 5,
        				y: -11
        			},
        			min: 0,
        			tickInterval: 1000000
        		},
				legend: {
					align: 'left',
					float: true,
					x: -13,
					y: 10
				},
				credits: {
					enabled: false
				},
				tooltip: {
			    	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			    	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
			        	'<td style="padding:0"><b>{point.y:.1f} $M</b></td></tr>',
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
			    	name: 'Budget AMT',
			    	type: 'column',
			    	color: '#0AB5B6',
			    	data: thisMonthBudgetAMT
				},{
					name: 'Actual AMT',
					type: 'column',
					color: '#F4A143',
			    	data: thisMonthActualAMT
				}]
			});
            $("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
            $("label[for=viewHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewHitRate-tab-2]").removeClass('ui-btn-active'); 
            $("label[for=viewHitRate-tab-3]").removeClass('ui-btn-active');
            showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT,thisMonthData);
			loadingMask("hide");
        });

        $(".page-tabs #viewHitRate-tab-1").on("click", function() {
        	$("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
        	chart.series[0].setData(thisMonthBudgetAMT, true, true, false);
        	chart.series[1].setData(thisMonthActualAMT, true, true, false );
        	showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT,thisMonthData);
        });

        $(".page-tabs #viewHitRate-tab-2").on("click", function() {
        	$("#viewHitRate .page-date").text(monTable[thisMonth-1]+thisYear);
        	chart.series[0].setData(lastMonthBudgetAMT, true, true, false);
        	chart.series[1].setData(lastMonthActualAMT, true, true, false);
        	showData("lastMonth", lastMonthActualAMT, lastMonthBudgetAMT, lastMonthData);
        });

        $(".page-tabs #viewHitRate-tab-3").on("click", function() {
    		$("#viewHitRate .page-date").text(thisYear);
    		chart.series[0].setData(YTDBudgetAMT, true, true, false);
        	chart.series[1].setData(YTDActualAMT, true, true, false);
        	showData("YTD", YTDActualAMT, YTDBudgetAMT, ytdData);
        });
	}
});