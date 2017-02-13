var chart;


$("#viewMonthlyHitRate").pagecontainer({
    create: function(event, ui) {
        /********************************** page event *************************************/
        $("#viewMonthlyHitRate").on("pagebeforeshow", function(event, ui){
        	console.log("a");
        });

        $("#viewMonthlyHitRate").on("pageshow", function(event, ui){
        	chart = new Highcharts.Chart({
        		chart: {
        			renderTo: 'viewMonthlyHitRate-hc-canvas',
        		},
        		title: {
        			text: ''
        		},
        		xAxis: {
        			title: {
        				text: '(Mth)'	
        			},
        			tickInterval: 1,
        			crosshair: true
        		},
        		yAxis: {
        			min: 0,
        			title: {
        				text: '(USD$K)'
        			}
        		},
        		tooltip: {
        			shared: true
        		},
        		credits: {
        			enabled: false
        		},
        		plotOptions: {
        			column: {
        				pointPadding: 0,
        				borderWidth: 0
        			}
        		},
        		series: [{
        			name: '2014 Actual QTY',
        			type: 'column',
        			data: [56.12, 90.4, 33.9, 92.2, 79.4, 84.3, 79.1, 70.2, 69.4, 59.8, 60.5, 12],
        			pointStart: 1
        		}, {
        			name: '2015 Actual QTY',
        			type: 'column',
        			data: [63.4, 78.2, 85.1, 112, 91, 101, 99.1, 21.7, 78.1, 66.9, 12.21, 21.5],
        			pointStart: 1
        		}, {
        			name: '2016 Actual QTY',
        			type: 'column',
        			data: [86, 72.6, 71.1, 60.1, 57.7, 49.6, 90.1, 66.1, 12.4, 71.2, 55, 41.2],
        			pointStart: 1
        		}, {
        			name: '2016 Actual Budget',
        			type: 'spline',
        			data: [91, 88, 52, 125, 48, 90, 72, 59, 34, 108, 111, 92],
        			pointStart: 1
        		}]
        	});

        	loadingMask("hide");

    	});

    }
});