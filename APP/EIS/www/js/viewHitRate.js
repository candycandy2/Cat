$(document).one("pagebeforecreate", function() {
    $.mobile.pageContainer.prepend(panel);
    $("#mypanel").panel().enhanceWithin();

    $(document).on("pageshow", function() {
		var chart;
		$(document).ready(function() {
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
        	$(".fragment-1").show();
			$(".fragment-2").hide();
			$(".fragment-3").hide();
        }
    });

    $("#mypanel #panel-sub-header").on("click", function(){
    	$("#viewHitRate").hide();
    	$("#viewMonthlyHitRate").show();
    	$("#mypanel").panel("close");
    });

    $(".page-tabs #tab-1").on("click", function(){
    	$(".fragment-1").show();
		$(".fragment-2").hide();
		$(".fragment-3").hide();
    });

    $(".page-tabs #tab-2").on("click", function(){
    	$(".fragment-1").hide();
		$(".fragment-2").show();
		$(".fragment-3").hide();
	});

    $(".page-tabs #tab-3").on("click", function(){
    	$(".fragment-1").hide();
		$(".fragment-2").hide();
		$(".fragment-3").show();
	});

	$(".viewIndex").on( "swiperight", function(event){
		if($(".ui-page-active").jqmData("panel") !== "open"){
			$("#mypanel").panel( "open");
		}
	});

    $(".menu-btn").on("click", function(){
    	$("#mypanel").panel("open");
    });
});