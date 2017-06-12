var tab = "thisMonth";
var lytmTotalActualAMT = 0;
var lylmTotalActualAMT = 0;
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

            if(localStorage.getItem("hitRateEisData") === null) {
    	    	this.successCallback = function(data) {
                    roSummaryCallBackData = data["Content"]["DataList"];
    	    		length = roSummaryCallBackData.length;
    	    		thisYear = roSummaryCallBackData[length-1]["YEAR"];
    	    		thisMonth = roSummaryCallBackData[length-1]["MONTH"];
                    UserAuthority();
    	    		convertData();
                    //review by alan
                    getAllData();
                    $("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
                    showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT, thisMonthData);
                    showHighchart();
                    loadingMask("hide");
                    if (window.orientation === 90 || window.orientation === -90 ) {
                        zoomInChart();
                    }
                    localStorage.setItem("hitRateEisData", JSON.stringify([hitRateEisData, nowTime]));
                    localStorage.setItem("thisYear", JSON.stringify([thisYear, nowTime]));
                    localStorage.setItem("thisMonth", JSON.stringify([thisMonth, nowTime]));  
                };

    	    	this.failCallback = function(data) {
    	    		console.log("api misconnected");
    	    	};

    			var _construct = function() {
    				CustomAPI("POST", true, "ROSummary", self.successCallback, self.failCallback, ROSummaryQueryData, "");
    			}();
            }else {
                hitRateEisData = JSON.parse(localStorage.getItem("hitRateEisData"))[0];
                thisYear = JSON.parse(localStorage.getItem("thisYear"))[0];
                thisMonth = JSON.parse(localStorage.getItem("thisMonth"))[0];
                UserAuthority();
                getAllData();
                $("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
                showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT, thisMonthData);
                showHighchart();
                loadingMask("hide");
                if (window.orientation === 90 || window.orientation === -90 ) {
                    zoomInChart();
                }
                var lastTime = JSON.parse(localStorage.getItem("hitRateEisData"))[1];
                if (checkDataExpired(lastTime, thisMonthExpiredTime, 'hh')) {
                    localStorage.removeItem("hitRateEisData");
                    ROSummary();
                }
            }
        };

        function getAllData() {
            if(thisMonth == 1) {
                ytdMonth = 12;
                ytdYear = thisYear - 1;
            }else {
                ytdMonth = Number(thisMonth) - 1;
                ytdYear = thisYear;
            }
            for(var i in hitRateEisData[thisYear][thisMonth]) {
                thisMonthData[i] = {};
                lastMonthData[i] = {};
                ytdData[i] = {};
            }
            for(var ro in hitRateEisData[ytdYear-1][ytdMonth]) {
                lastYTDActualAMT[ro] = 0;
                lytmTotalActualAMT += hitRateEisData[thisYear-1][thisMonth][ro][1];
                if(thisMonth != 1) {
                    lylmTotalActualAMT += hitRateEisData[thisYear-1][thisMonth-1][ro][1];
                }else{
                    lylmTotalActualAMT += hitRateEisData[thisYear-2][12][ro][1];
                }
                for(var i=1; i<=Number(ytdMonth); i++) {
                    lastYTDActualAMT[ro] += hitRateEisData[ytdYear-1][i][ro][1];
                }
            }
            getHighcahrtsData(thisYear, thisMonth, "BUDGET_AMT", thisMonthBudgetAMT);
            getHighcahrtsData(thisYear, thisMonth, "ACTUAL_ADJ_AMT", thisMonthActualAMT);
            getHighcahrtsData(thisYear, thisMonth-1, "BUDGET_AMT", lastMonthBudgetAMT);
            getHighcahrtsData(thisYear, thisMonth-1, "ACTUAL_ADJ_AMT", lastMonthActualAMT);
            getHighcahrtsData(ytdYear, ytdMonth, "YTDBUDGET_AMT", YTDBudgetAMT);
            getHighcahrtsData(ytdYear, ytdMonth, "YTDACTUAL_ADJ_AMT", YTDActualAMT);

            calculateData(thisYear, thisMonth, "YOYGrowth", thisMonthData);
            calculateData(thisYear, thisMonth, "BudgetHitRate", thisMonthData);
            calculateData(thisYear, thisMonth-1, "YOYGrowth", lastMonthData);
            calculateData(thisYear, thisMonth-1, "BudgetHitRate", lastMonthData);
            calculateData(ytdYear, ytdMonth, "YTDYOYGrowth", ytdData);
            calculateData(ytdYear, ytdMonth, "YTDBudgetHitRate", ytdData); 
        }

    	function calculateData(year, month, type, data_array) {
    		var index = 0;
    		if(month == 0) {
    			month = 12;
    			year--;
    		}
    		if(type == "YOYGrowth") {
	    		for(var i in hitRateEisData[year][month]) {
	    			data_array[i]["YOYGrowth"] = (hitRateEisData[year][month][i][1] / hitRateEisData[year-1][month][i][1]) - 1;
	    		}
    		}else if(type == "BudgetHitRate") {
    			for(var i in hitRateEisData[year][month]) {
    				data_array[i]["BudgetHitRate"] = hitRateEisData[year][month][i][1] / hitRateEisData[year][month][i][0];
    			}
    		}else if(type == "YTDYOYGrowth") {
    			for(var i in hitRateEisData[year][month]) {
    				data_array[i]["YOYGrowth"] = (YTDActualAMT[index++] / lastYTDActualAMT[i]) - 1;
    			}
    		}else if(type == "YTDBudgetHitRate") {
    			for(var i in hitRateEisData[year][month]) {
    				data_array[i]["BudgetHitRate"] = (YTDActualAMT[index] / YTDBudgetAMT[index]);
    				index++;
    			}
    		}
    	}

    	function showData(tab, AAMT_array, BAMT_array, data_array) {
    		var index = 0;
    		var ActualAMT, budgetHitRate, YOYGrowth, totalBudgetHitRate, totalYOYGrowth;
            var totalActualAMT = 0;
            var totalBudgetAMT = 0;
            var totalLastYTDActualAMT = 0;
			for(var ro in data_array) {
				ActualAMT = Math.round(AAMT_array[index++] / Math.pow(10, 4)) / 100;
				budgetHitRate = Math.round((data_array[ro]["BudgetHitRate"] * Math.pow(10, 4))) / 100;
				YOYGrowth = Math.round((data_array[ro]["YOYGrowth"] * Math.pow(10, 4))) / 100;
				totalActualAMT += ActualAMT;

                $("#" + ro + " .AS span").text(ActualAMT);
				$("#" + ro + " .HR span").text(budgetHitRate + "%");
				if(budgetHitRate < 80) {
					$("#" + ro + " .HR").css('background', '#ee3839');
				}else if(budgetHitRate > 95) {
					$("#" + ro + " .HR").css('background', '#48af56');
				}else{
					$("#" + ro + " .HR").css('background', '#e6be20');
				}
				if(YOYGrowth < 0 ) {
                    $("#" + ro + " .YR span").text(YOYGrowth + "%");
					$("#" + ro + " .YR").css('background', '#ee3839');
				}else{
                    $("#" + ro + " .YR span").text("+" + YOYGrowth + "%");
					$("#" + ro + " .YR").css('background', '#48af56');
				}
			}
            $("#total .dataContainer .AS span").text(Math.round(totalActualAMT * Math.pow(10, 2)) / 100);
            for(var i=0; i<AAMT_array.length; i++) {
                totalActualAMT += AAMT_array[i];
                totalBudgetAMT += BAMT_array[i];
            }
            totalBudgetHitRate = (totalActualAMT / totalBudgetAMT) * 100;
            $("#total .dataContainer .HR span").text((Math.round(totalBudgetHitRate * Math.pow(10, 2)) / 100) + "%");
            if(totalBudgetHitRate < 80) {
                $("#total .dataContainer .HR").css('background', '#ee3839');
            }else if(totalBudgetHitRate > 95) {
                $("#total .dataContainer .HR").css('background', '#48af56');
            }else {
                $("#total .dataContainer .HR").css('background', '#e6be20');
            }
                 
            for(var i in lastYTDActualAMT) {
                totalLastYTDActualAMT += lastYTDActualAMT[i];
            }
            if(tab == "thisMonth") {
                totalYOYGrowth = ((totalActualAMT / lytmTotalActualAMT) - 1) * 100;
            }else if(tab == "lastMonth") {
                totalYOYGrowth = ((totalActualAMT / lylmTotalActualAMT) - 1) * 100;
            }else if (tab == "YTD") {
                totalYOYGrowth = ((totalActualAMT / totalLastYTDActualAMT) - 1) * 100;
            }
            if(totalYOYGrowth < 0) {
                $("#total .dataContainer .YR span").text((Math.round(totalYOYGrowth * Math.pow(10, 2)) / 100) + "%");
                $("#total .dataContainer .YR").css('background', '#ee3839')
            }else{
                $("#total .dataContainer .YR span").text("+"+ (Math.round(totalYOYGrowth * Math.pow(10, 2)) / 100) + "%");
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
	    		for(var i in hitRateEisData[year][month]) {
	    			data_array[index++] = hitRateEisData[year][month][i][0];
	    		}
    		}else if(type == "ACTUAL_ADJ_AMT") {
    			for(var i in hitRateEisData[year][month]) {
	    			data_array[index++] = hitRateEisData[year][month][i][1];
	    		}
    		}else if(type == "YTDBUDGET_AMT") {
    			for(var ro in hitRateEisData[year][month]) {
    				data_array[index] = 0;
    				for(var i=1; i<=month; i++) {
                        data_array[index] += hitRateEisData[year][i][ro][0];
                    }
    				index++;
    			}
    		}else if(type == "YTDACTUAL_ADJ_AMT") {
    			for(var ro in hitRateEisData[year][month]) {
    				data_array[index] = 0;
    				for(var i=1; i<=month; i++) {
                        data_array[index] += hitRateEisData[year][i][ro][1];
                    }
    				index++;
    			}
    		}
    	}

    	function convertData() {
    		var month;
    		var rosite = 0;
	    	for(var i=roSummaryCallBackData[0]["YEAR"]; i<=roSummaryCallBackData[length-1]["YEAR"]; i++) {
	    		hitRateEisData[i] = {};
	    		month = (i == roSummaryCallBackData[length-1]["YEAR"]) ? (roSummaryCallBackData[length-1]["MONTH"]) : 12;  
	    		for(var j=1; j<=month; j++) {
	    			hitRateEisData[i][j] = {};
	    			for(var k=0; k<5 && rosite<length; k++) {
	    				hitRateEisData[i][j][roSummaryCallBackData[rosite]["RO_SITE"]] = 
	    						[Number(roSummaryCallBackData[rosite]["BUDGET_AMT"]), Number(roSummaryCallBackData[rosite]["ACTUAL_ADJ_AMT"])];
	    				rosite++;
	    			}
	    		}
	    	}
    	}

        function showHighchart() {
            options = {
                chart: {
                    marginTop: 30,
                    marginLeft: 50,
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
                    crosshair: true,
                },
                yAxis: {
                    title: {
                        text: '(USD$)',
                        align: 'high',
                        rotation: 0,
                        offset: 0,
                        x: -10,
                        y: -11
                    },
                    min: 0,
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
                    formatter: function () {
                        var s = '<b>' + this.x + ' Hit Rate</b>';
                        $.each(this.points, function () {
                           s += '<br/> ' + this.series.name + ' = $' + formatNumber(this.y);
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
            }
            options.chart.renderTo = "viewHitRate-hc-canvas";
            chart = new Highcharts.Chart(options);
            options.chart.renderTo = "viewHitRate-hc-landscape-canvas";
            chartLandscape = new Highcharts.Chart(options);
            chartLandscape.legend.update({itemStyle: {fontSize: 14}, align: "center"});
        }

		/********************************** page event *************************************/
        $("#viewHitRate").on("pageshow", function(event, ui) {
            showHighchart();
            $("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
            $(".YTD-Str").css("display", "none");
            $("#viewHitRate ul > li").css("height", "5.8VH");
            $("#viewHitRate #total").css("height", "6.1VH");
            $("label[for=viewHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewHitRate-tab-3]").removeClass('ui-btn-active');
            if(lastPageID != "viewHitRate") {
                showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT, thisMonthData);
                loadingMask("hide");
            }
            if (window.orientation === 90 || window.orientation === -90 ) {
                zoomInChart();
            }
            ytdStrExist = false;
        });

        $(".page-tabs #viewHitRate-tab-1").on("click", function() {
            $("#viewHitRate .page-date").text(monTable[thisMonth]+thisYear);
        	$(".YTD-Str").css("display", "none");
            $("#viewHitRate ul > li").css("height", "5.8VH");
            $("#viewHitRate #total").css("height", "6.1VH");
            chart.series[0].setData(thisMonthBudgetAMT, true, true, false);
        	chart.series[1].setData(thisMonthActualAMT, true, true, false );
            chart.tooltip.hide();
            chartLandscape.series[0].setData(thisMonthBudgetAMT, true, true, false);
            chartLandscape.series[1].setData(thisMonthActualAMT, true, true, false );
        	showData("thisMonth", thisMonthActualAMT, thisMonthBudgetAMT,thisMonthData);
            ytdStrExist = false;
        });

        $(".page-tabs #viewHitRate-tab-2").on("click", function() {
            if(thisMonth != 1) {
        	   $("#viewHitRate .page-date").text(monTable[thisMonth-1]+thisYear);
            }else{
                $("#viewHitRate .page-date").text(monTable[12]+(thisYear-1));
            }
            $(".YTD-Str").css("display", "none");
            $("#viewHitRate ul > li").css("height", "5.8VH");
            $("#viewHitRate #total").css("height", "6.1VH");
        	chart.series[0].setData(lastMonthBudgetAMT, true, true, false);
        	chart.series[1].setData(lastMonthActualAMT, true, true, false);
        	chart.tooltip.hide();
            chartLandscape.series[0].setData(lastMonthBudgetAMT, true, true, false);
            chartLandscape.series[1].setData(lastMonthActualAMT, true, true, false);
            showData("lastMonth", lastMonthActualAMT, lastMonthBudgetAMT, lastMonthData);
            ytdStrExist = false;
        });

        $(".page-tabs #viewHitRate-tab-3").on("click", function() {
            if(thisMonth != 1) {
                $("#viewHitRate .page-date").text(thisYear);
                $(".YTD-Str").css("display", "block");
                $("#viewHitRate ul > li").css("height", "5.4VH");
                $("#viewHitRate #total").css("height", "5.8VH");
                ytdStrExist = true;
            }else{
                $("#viewHitRate .page-date").text(thisYear-1);
                ytdStrExist = false;
            }
    		chart.series[0].setData(YTDBudgetAMT, true, true, false);
        	chart.series[1].setData(YTDActualAMT, true, true, false);
        	chart.tooltip.hide();
            chartLandscape.series[0].setData(YTDBudgetAMT, true, true, false);
            chartLandscape.series[1].setData(YTDActualAMT, true, true, false);
            showData("YTD", YTDActualAMT, YTDBudgetAMT, ytdData);
        });
    }
});