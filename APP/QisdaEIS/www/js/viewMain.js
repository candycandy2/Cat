//get BU & CSD series
var buBubbleSeries = [
	{ x: 65, y: 62, name: 'TE', data: {}, color: '#99CC33' },
    { x: 67, y: 60, name: 'TF', data: {}, color: '#40C1C7' },
    { x: 74, y: 49, name: 'TN', data: {}, color: '#FFCC66' },			            
    { x: 78, y: 92, name: 'FL', data: {}, color: '#5AAEE1' },
    { x: 82, y: 20, name: 'FS', data: {}, color: '#948078' },
    { x: 88, y: 52, name: 'TY', data: {}, color: '#AC8BC0' }
];
var csdBubbleSeries = [
	{ x: 74, y: 36, name: 'TE', data: {}, color: '#99CC33' },
    { x: 82, y: 45, name: 'TF', data: {}, color: '#40C1C7' },
    { x: 66, y: 60, name: 'TN', data: {}, color: '#FFCC66' },			            
    { x: 88, y: 73, name: 'FL', data: {}, color: '#5AAEE1' },
    { x: 63, y: 28, name: 'FS', data: {}, color: '#948078' },
    { x: 91, y: 57, name: 'TY', data: {}, color: '#AC8BC0' }
];
var buRectSeries = [
	{ name: '东森股份有限公司', code: '66588', value: 10, colorValue: 10, day1: 2256, day16: 876, day46: 432, day76: 1258 }, 
	{ name: '飞利浦股份有限公司', code: '60324', value: 9, colorValue: 30, day1: 738, day16: 456, day46: 1024, day76: 2586 }, 
	{ name: 'AAAA股份有限公司', code: '67498', value: 8, colorValue: 40, day1: 1443, day16: 563, day46: 2254, day76: 896 }, 
	{ name: 'BBBB股份有限公司', code: '62406', value: 7, colorValue: 50, day1: 207, day16: 1078, day46: 567, day76: 2963 }, 
	{ name: 'CCCC股份有限公司', code: '63201', value: 4, colorValue: 60, day1: 985, day16: 2246, day46: 409, day76: 4587 }, 
	{ name: 'DDDD股份有限公司', code: '64885', value: 4, colorValue: 70, day1: 441, day16: 798, day46: 1059, day76: 3062 }
];
var csdRectSeries = [
	{ name: 'EEEE股份有限公司', code: '60586', value: 7, colorValue: 10, day1: 785, day16: 464, day46: 3560, day76: 2557 }, 
	{ name: 'FFFF股份有限公司', code: '61273', value: 10, colorValue: 20, day1: 524, day16: 1674, day46: 897, day76: 1356 }, 
	{ name: 'GGGG股份有限公司', code: '65792', value: 2, colorValue: 45, day1: 747, day16: 1654, day46: 5647, day76: 2441 }, 
	{ name: 'HHHH股份有限公司', code: '63496', value: 4, colorValue: 55, day1: 1242, day16: 344, day46: 3684, day76: 687 }, 
	{ name: 'IIII股份有限公司', code: '65068', value: 8, colorValue: 65, day1: 2364, day16: 841, day46: 653, day76: 457 }, 
	{ name: 'JJJJ股份有限公司', code: '69876', value: 8, colorValue: 75, day1: 1254, day16: 2503, day46: 486, day76: 698 }
];

//bubble highcharts option
var bubbleOption = {
	chart: {
        type: 'bubble',
        marginTop: 5,
        plotBorderWidth: 0,
        zoomType: 'none'
   	},
    legend: {
        enabled: false
    },
    title: {	
        text: null
    },
    xAxis: {
        gridLineWidth: 0,
        title: {
            text: 'Max Overdue Days of Each Facility(Days)',
            x: -20
        },
        labels: {
            format: '{value}'
        },
        tickWidth: 1,
        tickPositions: [70, 80, 90],
        min: 60,
        max: 93
    },
    yAxis: {
        lineWidth: 0,
        title: {
            text: 'Overdue Amount of Each Facility(USD$)',
            style: {
            	"fontSize": "11px"
            },
            y: 15
        },
        labels: {
            format: '{value}K'
        },
        maxPadding: 0.2,
        tickPositions: [0, 25, 50, 75, 100],
        endOnTick: false
    },
    tooltip: {
        useHTML: true,
        shadow: false,
        borderColor: '#FDC24F',
        backgroundColor: 'rgba(247,247,247,0.85)',
        headerFormat: '<table class="fontTooltip">',
        pointFormat: '<tr><td>{point.name}</td></tr>' +
        '<tr><td>Total Overdue AR Amt.:USD${point.y}K</td></tr>' +
        '<tr><td>Max Overdue Days:{point.x}days</td></tr>',
        footerFormat: '</table>',
        followPointer: true
    },
    plotOptions: {
        series: {
        	maxSize: 40,
        	minSize: 40,
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: { 
                	"color": "#ffffff",
                	"fontSize": "12px", 
                	"textOutline": "-2px -2px contrast"
                }
            },
            point: {
            	events: {
            		click: function(event){
            			console.log(this.x+","+this.y);
            			if(window.orientation === 180 || window.orientation === 0){
            				$('#overview-hc-rectangle').show();
            			}
            			if(window.orientation === 90 || window.orientation === -90){
            				zoomInChart();
            				$('#backBtn').show();
            				$('#overview-hc-bubble-landscape').hide();
            				$('#overview-hc-rectangle-landscape').show();
            					
            			}
            			      			
            		}
            	}
            }
        }
    },
    series: [{		    	
        data: buBubbleSeries
    }],
    exporting: {
        enabled: false
    },
    credits: {
    	enabled: false
    }
};

//rect highcharts option
var rectOption = {
	chart: {
		type: "treemap",
		marginTop: 40,
		marginBottom: 80,
		backgroundColor: '#F8FCFB',
		zoomType: 'none'
	},
	colorAxis: {
        tickPositions: [0, 15, 45, 75],
        stops: [
            [0, '#81B4E1'],
            [0.2, '#81B4E1'],
            [0.2, '#F79620'],
            [1, '#EF3623']
        ],
        labels: {
        	align: 'right',
        	enabled: true,
        	format: '{value}'       	
        }
   	},
   	tooltip: {
        useHTML: true,
        shadow: false,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor:　'#ffffff',
        headerFormat: '<table class="fontTooltip">',
        pointFormat: '<tr><td>{point.code} {point.name}</td></tr>' +
        '<tr><td>1-15 Days:USD${point.day1}</td></tr>' +
        '<tr><td>16-45 Days:USD${point.day16}</td></tr>' +
        '<tr><td>46-75 Days:USD${point.day46}</td></tr>' +
        '<tr><td>Over 75 Days:USD${point.day76}</td></tr>' ,
        footerFormat: '</table>',
        followPointer: true
    },
    plotOptions: {
    	series: {
	        color: 'black',
	        layoutAlgorithm: 'squarified',
	        dataLabels: {
	            enabled: true,
	            align: 'center',
	            overflow: 'none',
	            crop: false,
	            padding:　2,
	            format: '{point.code}' + ' ' + '{point.name}'
	        }
    	}
    },
    series: [{
    	data: buRectSeries  
    }],
    exporting: {
        enabled: false
    },
    title: {
        text: null
    },
    credits: {
    	enabled: false
    }

};


/*****************************************************************/
$('#viewMain').pagecontainer({
	create: function (event, ui){
		
		
		function showBubble(){
			chartbubble = new Highcharts.Chart('overview-hc-bubble', bubbleOption);
			
			chartLandscapebubble = new Highcharts.Chart('overview-hc-bubble-landscape', bubbleOption);
			
			//chartLandscapebubble.legend.update({itemStyle: {fontSize: 14}, align: "center"});
			
		}
		
		function showRect(){	
			chartRect = new Highcharts.Chart('overview-hc-rectangle', rectOption);
			
			chartLandscapeRect = new Highcharts.Chart('overview-hc-rectangle-landscape', rectOption);
			
			//chartLandscapeRect.legend.update({itemStyle: {fontSize: 14}, align: "center"});
		}
		
		
		/********************************** page event *************************************/
		$("#viewMain").on("pagebeforeshow", function(event, ui){
			

			
		});
		
		$('#viewMain').on('pageshow', function(event, ui){
			showBubble();
			showRect();
			
			$("label[for=viewMain-tab-1]").addClass('ui-btn-active');
            $("label[for=viewMain-tab-2]").removeClass('ui-btn-active');
            
			if (window.orientation === 90 || window.orientation === -90 ) {
                zoomInChart();
           	}
		});
		
		$(".page-tabs #viewMain-tab-1").on("click", function() {
			chartbubble.series[0].setData(buBubbleSeries, true, true, false);
			chartRect.series[0].setData(buRectSeries, true, true, false);
            chartbubble.tooltip.hide();
            chartRect.tooltip.hide();
            
            chartLandscapebubble.series[0].setData(buBubbleSeries, true, true, false);
            chartLandscapeRect.series[0].setData(buRectSeries, true, true, false);
            chartLandscapebubble.tooltip.hide();
            chartLandscapeRect.tooltip.hide();
            $('#overview-hc-rectangle').hide();
            
        });
        
        $(".page-tabs #viewMain-tab-2").on("click", function() {
			chartbubble.series[0].setData(csdBubbleSeries, true, true, false);
			chartRect.series[0].setData(csdRectSeries, true, true, false);
            chartbubble.tooltip.hide();
            chartRect.tooltip.hide();
            
            chartLandscapebubble.series[0].setData(csdBubbleSeries, true, true, false);
            chartLandscapeRect.series[0].setData(csdRectSeries, true, true, false);
            chartLandscapebubble.tooltip.hide();
            chartLandscapeRect.tooltip.hide();
            $('#overview-hc-rectangle').hide();
            
        });
		
	}
});










