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
			    	name: 'Budget QTY',
			    	type: 'column',
			    	color: '#0AB5B6',
			    	data: [3612, 2904, 3339, 2922, 1794, 1843, 2791, 2702, 1694, 2598, 2605, 3212],
			    	pointStart: 1
				},{
					name: 'Actual QTY',
					type: 'column',
					color: '#F4A143',
			    	data: [2634, 2782, 2851, 2112, 3191, 3101, 2991, 2217, 2781, 2669, 3221, 2215],
        			pointStart: 1
				},{
					name: 'RT Budget QTY',
					type: 'line',
					color: '#A0C83A',
					data: [10, 26, 45, 86, 168, 426, 840, 1280, 2160, 2913, 3524, 3948],
					pointStart: 1
				},{
					name: 'RT Actual QTY',
					type: 'line',
					color: '#134A8C',
					data: [10, 22, 41, 83, 161, 320, 764, 1280, 1060, 1120, 1024, 2048],
					yAxis: 1,
					pointStart: 1
				}]
			});
			loadingMask("hide");
        });
    }
});