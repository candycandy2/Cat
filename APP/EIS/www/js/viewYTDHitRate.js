var chart;

$("#viewYTDHitRate").pagecontainer({
    create: function(event, ui) {
        /********************************** page event *************************************/
        $("#viewYTDHitRate").on("pagebeforeshow", function(event, ui){

        });

        $("#viewYTDHitRate").on("pageshow", function(event, ui){
			chart = new Highcharts.Chart ({
				chart: {
					renderTo: 'viewYTDHitRate-hc-canvas',
		    		type: 'column'
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
			    	minorTickInterval: 1,
			    	type: 'logarithmic',
			    	title: {
			        	text: ''
			    	}
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
				series: [{
			    	name: 'Budget QTY',
			    	type: 'column',
			    	data: [56.12, 90.4, 33.9, 92.2, 79.4, 84.3, 79.1, 70.2, 69.4, 59.8, 60.5, 12],
			    	pointStart: 1
				},{
					name: 'Actual QTY',
					type: 'column',
			    	data: [63.4, 78.2, 85.1, 112, 91, 101, 99.1, 21.7, 78.1, 66.9, 12.21, 21.5],
        			pointStart: 1
				},{
					name: 'RT Budget QTY',
					type: 'spline',
					data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
					pointStart: 1
				},{
					name: 'RT Actual QTY',
					type: 'spline', 
					data: [0.1, 0.2, 0.4, 0.8, 1.6, 3.2, 6.4, 12.8, 25.6, 51.2, 102.4, 204.8],
					pointStart: 1
				}]
			});

			loadingMask("hide");
        });
    }
});