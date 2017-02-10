var chart;
var a = [1, 1, 1, 1, 1];
var b = [2, 2, 2, 2, 2];
var c = [3, 3, 3, 3, 3];

$("#viewHitRate").pagecontainer({
    create: function(event, ui) {
		

    	$("#viewHitRate").on("pagebeforeshow", function(event, ui) {
    		console.log("a");
    	});

		/********************************** page event *************************************/
        $("#viewHitRate").on("pageshow", function(event, ui) {
			chart = new Highcharts.Chart ({
				chart: {
					renderTo: 'hc-canvas',
		    		type: 'column'
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
			    	min: 0,
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
			    	name: 'Budget AMT',
			    	data: [1, 1, 1, 1, 1] 
				},{
					name: 'Actual AMT',
			    	data: [2, 2, 2, 2, 2]
				}]
			});
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