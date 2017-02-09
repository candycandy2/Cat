$(document).one("pagebeforecreate", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();
});

$(document).one("pagecreate", "#viewHitRate", function(){
	var chart;
	var a = [49.9, 71.5, 106.4, 129.2, 144.0];
	var b = [33, 74, 121, 101.5, 89.1];
	var c = [20, 68.9, 56.6, 81.3, 103.4];

	var htmlContent = "";
	var highchart = '<div id="highcharts" style="height:38VH;"></div>';
	$("#hc-canvas").html("");
	$("#hc-canvas").prepend($(highchart)).enhanceWithin();

    $("#viewHitRate").pagecontainer({
        create: function(event, ui) {
			
			/********************************** page event *************************************/
            $("#viewHitRate").on("pagebeforeshow", function(event, ui){
				chart = new Highcharts.Chart({
	        		chart: {
	        			renderTo: 'highcharts',
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
				    	name: 'Budget AMT'
				    
					},{
						name: 'Actual AMT'
				    	
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

    $("#mypanel #panel-header-content").on("click", function(){
    	$("#viewHitRate").show();
    	$("#viewMonthlyHitRate").hide();
    	$("#viewYTDHitRate").hide();
    	$("#mypanel").panel("close");
    });

	$("#mypanel #panel-sub-header").on("click", function(){
    	$("#viewHitRate").hide();
    	$("#viewMonthlyHitRate").show();
    	$("#viewYTDHitRate").hide();
    	$("#mypanel").panel("close");
    });

    $("#mypanel #panel-sub-header-content").on("click", function(){
    	$("#viewHitRate").hide();
    	$("#viewMonthlyHitRate").hide();
    	$("#viewYTDHitRate").show();
    	$("#mypanel").panel("close");
    });

	$(".menu-btn").on("click", function(){
		$("#mypanel").panel("open");
    });

    $("#viewHitRate").on( "swiperight", function(event){
		if($(".ui-page-active").jqmData("panel") !== "open"){
            $("#mypanel").panel( "open");
        }
    });

	// function drawHighcharts(BAMT, AAMT) {
	//     $(document).on("pageshow", function() {
	// 		$(document).ready(function() {
	// 			chart = new Highcharts.Chart({
	//         		chart: {
	//         			renderTo: 'highcharts',
	//             		type: 'column'
	//         		},
	// 				title: {
	//         			text: '' 
	//     			},
	//         		xAxis: {
	// 			    	categories: [
	// 			        	'BQA',
	// 			       		'BQC',
	// 			       		'BQE',
	// 			       		'BQL',
	// 			       		'BQP'
	// 			    	],
	// 			    	crosshair: true
	// 				},
	// 				yAxis: {
	// 			    	min: 0,
	// 			    	title: {
	// 			        	text: ''
	// 			    	}
	// 				},
	// 				credits: {
	// 					enabled: false
	// 				},
	// 				tooltip: {
	// 			    	headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	// 			    	pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	// 			        	'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
	// 			    	footerFormat: '</table>',
	// 			    	shared: false,
	// 			    	useHTML: true
	// 				},
	// 				plotOptions: {
	// 			    	column: {
	// 			        	pointPadding: 0,
	// 			        	borderWidth: 0
	// 			    	}
	// 				},
	// 				series: [{
	// 			    	name: 'Budget AMT',
	// 			    	data: BAMT
	// 				},{
	// 					name: 'Actual AMT',
	// 			    	data: AAMT
	// 				}
	// 				]
	// 			});
	// 		});
	// 	});
	// }
});