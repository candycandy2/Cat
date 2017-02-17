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
        			name: '2014 Actual QTY',
        			type: 'column',
        			color: '#0AB5B6',
        			data: [1912, 2904, 3390, 2922, 2794, 1843, 2791, 2702, 2694, 1598, 2605, 3120],
        			pointStart: 1
        		}, {
        			name: '2015 Actual QTY',
        			type: 'column',
        			color: '#F4A143',
        			data: [2634, 1782, 1851, 2112, 3910, 1010, 1991, 2217, 2781, 3669, 1221, 2150],
        			pointStart: 1
        		}, {
        			name: '2016 Actual QTY',
        			type: 'column',
        			color: '#824E9F',
        			data: [2700, 2806, 711, 601, 577, 496, 901, 661, 1249, 712, 3600, 912],
        			pointStart: 1
        		}, {
        			name: '2016 Actual Budget',
        			type: 'line',
        			color: '#134A8C',
        			lineWidth: 1,
        			data: [910, 1880, 1520, 1250, 1680, 1090, 3520, 2590, 3400, 3080, 1110, 2220],
        			pointStart: 1
        		}]
        	});

        	loadingMask("hide");

    	});

    }
});