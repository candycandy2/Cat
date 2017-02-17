var chart, thisYear, thisMonth;
var hcBudgetAMT = [];
var hcActualAMT = [];
$("#viewHitRate").pagecontainer ({
    create: function(event, ui) {
    	
    	window.ROSummary = function() {
		
	    	this.successCallback = function(data) {
	    		callBackData = data["Content"]["DataList"];
	    		length = callBackData.length;
	    		thisYear = callBackData[length-1]["YEAR"];
	    		thisMonth = callBackData[length-1]["MONTH"];
	    		$(".page-date").text(monTable[thisMonth]+thisYear);
	    		convertData(data);
	    		getHighcahrtsData(thisYear, thisMonth);
	    	};

	    	this.failCallback = function(data) {
	    		console.log("api misconnected");
	    	};

			var _construct = function() {
				CustomAPI("POST", true, "ROSummary", self.successCallback, self.failCallback, queryData, "");
			}();
		};

    	function convertData(data) {
    		var month;
    		var rosite = 0;
	    	for(var i=data["Content"]["DataList"][0]["YEAR"]; i<=data["Content"]["DataList"][length-1]["YEAR"]; i++) {
	    		eisdata[i] = {};
	    		month = (i == data["Content"]["DataList"][length-1]["YEAR"]) ? (data["Content"]["DataList"][length-1]["MONTH"]) : 12;  
	    		for(var j=1; j<=month; j++) {
	    			eisdata[i][j] = {};
	    			for(var k=0; k<5 && rosite<length; k++) {
	    				eisdata[i][j][data["Content"]["DataList"][rosite]["RO_SITE"]] = 
	    						[data["Content"]["DataList"][rosite]["BUDGET_AMT"], data["Content"]["DataList"][rosite]["ACTUAL_ADJ_AMT"]];
	    				rosite++;
	    			}
	    		}
	    	}
    	}

    	function calBudget_AMT() {
    		
    	}

    	function calActual_AMT() {
    		
    	}

    	function getHighcahrtsData(year, month) {
    		var a = 0;
    		for(var i in eisdata[year][month]) {
    			hcBudgetAMT[a] = (Number(eisdata[year][month][i][0]));
    			hcActualAMT[a] = (Number(eisdata[year][month][i][1]));
    			a++;
    		}
    	}

    	$("#viewHitRate").on("pagebeforeshow", function(event, ui) {
			// getHighcahrtsData();    		
    	});

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
        			tickInterval: 1000
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
			    	data: hcBudgetAMT
				},{
					name: 'Actual AMT',
					type: 'column',
					color: '#F4A143',
			    	data: hcActualAMT
				}]
			});
			loadingMask("hide");
        });

        $(".page-tabs #viewHitRate-tab-1").on("click", function(){
        	getHighcahrtsData(thisYear, thisMonth);
        	chart.series[0].setData(hcBudgetAMT, true);
        	chart.series[1].setData(hcActualAMT, true);
        });

        $(".page-tabs #viewHitRate-tab-2").on("click", function(){
        	getHighcahrtsData(thisYear, thisMonth-1);
        	chart.series[0].setData(hcBudgetAMT, true);
        	chart.series[1].setData(hcActualAMT, true);
        });

        $(".page-tabs #viewHitRate-tab-3").on("click", function(){
    		
        });
	}
});