var chart;
var a = [1000, 1000, 1000, 1000, 1000];
var b = [2000, 2000, 2000, 2000, 2000];
var c = [3000, 3000, 3000, 3000, 3000];

$("#viewHitRate").pagecontainer ({
    create: function(event, ui) {
    	
    	window.a = function() {
    		var queryData = "<LayoutHeader><StartYearMonth>2014/12</StartYearMonth><EndYearMonth>2014/12</EndYearMonth></LayoutHeader>";
    	
	    	this.successCallback = function(data) {
	    		console.log(data);
	    	};

	    	this.failCallback = function(data) {};

			var _cobns = function() {
				CustomAPI("POST", true, "ProductDetail", self.successCallback, self.failCallback, queryData, "");
			}();
		};
    	// $("#viewHitRate").on("pagebeforeshow", function(event, ui) {
    	// });

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
        			tickInterval: 500
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
			        	'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
			    	data: [1000, 1000, 1000, 1000, 1000]
				},{
					name: 'Actual AMT',
					type: 'column',
					color: '#F4A143',
			    	data: [1500, 1500, 1500, 1500, 1500]
				}]
			});

			loadingMask("hide");
			
        });

        $(".page-tabs #viewHitRate-tab-1").on("click", function(){
        	chart.series[0].setData(a, true);
        	chart.series[1].setData(a, true);
        });

        $(".page-tabs #viewHitRate-tab-2").on("click", function(){
        	chart.series[0].setData(b, true);
        	chart.series[1].setData(b, true);
        });

        $(".page-tabs #viewHitRate-tab-3").on("click", function(){
        	chart.series[0].setData(c, true);
        	chart.series[1].setData(c, true);
        });
	}
});