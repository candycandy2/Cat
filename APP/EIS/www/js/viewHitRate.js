$(document).one("pagebeforecreate", function(){
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();

    $(document).on("pageshow", function(){
		var chart;
		$(document).ready(function(){
			chart = new Highcharts.Chart({
        		chart: {
        			renderTo: 'test',
            		type: 'column'
        		},
        		title: {
            		text: 'Monthly Average Rainfall'
        		},
        		subtitle: {
            		text: 'Source: WorldClimate.com'
        		},
        		xAxis: {
			    	categories: [
			        	'Jan',
			        	'Feb',
			        	'Mar',
			        	'Apr',
			        	'May',
			        	'Jun',
			        	'Jul',
			        	'Aug',
			        	'Sep',
			        	'Oct',
			        	'Nov',
			        	'Dec'
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
			    	shared: true,
			    	useHTML: true
				},
				plotOptions: {
			    	column: {
			        	pointPadding: 0.2,
			        	borderWidth: 0
			    	}
				},
				series: [{
			    	name: 'Tokyo',
			    	data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

				}]
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