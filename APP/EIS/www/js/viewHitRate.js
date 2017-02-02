$(document).one("pagebeforecreate", function(){
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();

    $(document).on("pageshow", function(){
		var chart;
		$(document).ready(function(){
			chart = new Highcharts.Chart({
        		chart: {
        			renderTo: 'highcharts-1',
            		type: 'column'
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
			        	text: 'Rainfall (mm)'
			    	}
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
			    	data: [49.9, 71.5, 106.4, 129.2, 144.0]
				},{
					name: 'Actual AMT',
			    	data: [69, 64.5, 126.4, 119.2, 104.0]
				}
				]
			});
		});
	});
});

$(document).one("pagecreate", "#viewHitRate", function(){

    $("#viewHitRate").pagecontainer({
        create: function(event, ui) {
        }
    });





    $(".menu-btn").on("click", function(){
    });
});