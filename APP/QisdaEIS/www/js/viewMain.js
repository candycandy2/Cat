//get BU & CSD series
var buBubbleSeries = [
	{ x: 65, y: 62, name: 'TE', product: '', color: '#99CC33' },
    { x: 67, y: 60, name: 'TF', product: '', color: '#40C1C7' },
    { x: 74, y: 49, name: 'TN', product: '', color: '#FFCC66' },			            
    { x: 78, y: 92, name: 'FL', product: '', color: '#5AAEE1' },
    { x: 82, y: 20, name: 'FS', product: '', color: '#948078' },
    { x: 88, y: 52, name: 'TY', product: '', color: '#AC8BC0' }
];
var csdBubbleSeries = [
	{ x: 74, y: 36, name: 'TE', product: '', color: '#99CC33' },
    { x: 82, y: 45, name: 'TF', product: '', color: '#40C1C7' },
    { x: 66, y: 60, name: 'TN', product: '', color: '#FFCC66' },			            
    { x: 88, y: 73, name: 'FL', product: '', color: '#5AAEE1' },
    { x: 63, y: 28, name: 'FS', product: '', color: '#948078' },
    { x: 91, y: 57, name: 'TY', product: '', color: '#AC8BC0' }
];
var buRectSeries = [
	{ name: '公司名称', code: '66588', value: 10, colorValue: 10 }, 
	{ name: '飞利浦股份有限公司', code: '60324', value: 10, colorValue: 30 }, 
	{ name: 'AAAA股份有限公司', code: '67498', value: 8, colorValue: 40 }, 
	{ name: 'BBBB股份有限公司', code: '62406', value: 6, colorValue: 50 }, 
	{ name: 'CCCC股份有限公司', code: '63201', value: 4, colorValue: 60 }, 
	{ name: 'DDDD股份有限公司', code: '64885', value: 4, colorValue: 70 }
];
var csdRectSeries = [
	{ name: 'EEEE股份有限公司', code: '60586', value: 7, colorValue: 0.1 }, 
	{ name: 'FFFF股份有限公司', code: '61273', value: 10, colorValue: 0.45 }, 
	{ name: 'GGGG股份有限公司', code: '65792', value: 2, colorValue: 0.6 }, 
	{ name: 'HHHH股份有限公司', code: '63496', value: 4, colorValue: 0.75 }, 
	{ name: 'IIII股份有限公司', code: '65068', value: 8, colorValue: 0.9 }, 
	{ name: 'JJJJ股份有限公司', code: '69876', value: 8, colorValue: 1 }
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
            }
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
        '<tr><td>Totail Overdue AR Amt.:USD${point.y}K</td></tr>' +
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
            				$('#backBtn').show();
            				$('#overview-hc-bubble-landscape').hide();
            				$('#overview-hc-rectangle-landscape').show();
            				zoomInChart();
            					
            			}
            			      			
            		}
            	}
            }
        }
    },
    series: [{		    	
        data: buBubbleSeries
    }],
    credits: {
    	enabled: false
    }
};

//rect highcharts option
var rectOption = {
	chart: {
		marginTop: 20,
		marginBottom: 70,
		marginRight: 5,
		backgroundColor: '#F8FCFB',
		zoomType: 'none'
	},
	colorAxis: {
        minColor: '#81B4E1',
        maxColor: '#EF3623',
        tickPositions: [0, 15, 45, 75],
        stops: [
            [0, '#81B4E1'],
            [0.2, '#81B4E1'],
            [0.2, '#F79620'],
            [1, '#EF3623']
        ]
   	},
   	tooltip: {
        useHTML: true,
        shadow: false,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor:　'#ffffff',
        headerFormat: '<table class="fontTooltip">',
        pointFormat: '<tr><td>{point.code} {point.name}</td></tr>' +
        '<tr><td>1-15 Days:USD$10000</td></tr>' +
        '<tr><td>16-45 Days:USD$10000</td></tr>' +
        '<tr><td>46-75 Days:USD$10000</td></tr>' +
        '<tr><td>Over 75 Days:USD$10000</td></tr>' ,
        footerFormat: '</table>',
        followPointer: true
    },
    series: [{
    	data: buRectSeries,
        type: "treemap",
        color: 'black',
        layoutAlgorithm: 'squarified',
        dataLabels: {
            enabled: true,
            align: 'center',
            overflow: 'hidden',
            padding:　2,
            format: '{point.code}' + ' ' + '{point.name}'
        }
        
    }],
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
			chartbubble.series[0].setData(buBubbleSeries);
			
			chartLandscapebubble = new Highcharts.Chart('overview-hc-bubble-landscape', bubbleOption);
			chartLandscapebubble.series[0].setData(buBubbleSeries);
			
			chartLandscapebubble.legend.update({itemStyle: {fontSize: 14}, align: "center"});
			
		}
		
		function showRect(){	
			chartRect = new Highcharts.Chart('overview-hc-rectangle', rectOption);
			chartRect.series[0].setData(buRectSeries);
			
			chartLandscapeRect = new Highcharts.Chart('overview-hc-rectangle-landscape', rectOption);
			chartLandscapeRect.series[0].setData(buRectSeries);
			
			chartLandscapeRect.legend.update({itemStyle: {fontSize: 14}, align: "center"});
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
			chartbubble.series[0].setData(buBubbleSeries);
			chartRect.series[0].setData(buRectSeries);
            chartbubble.tooltip.hide();
            chartRect.tooltip.hide();
            
            chartLandscapebubble.series[0].setData(buBubbleSeries);
            chartLandscapeRect.series[0].setData(buRectSeries);
            chartLandscapebubble.tooltip.hide();
            chartLandscapeRect.tooltip.hide();
            $('#overview-hc-rectangle').hide();
            
        });
        
        $(".page-tabs #viewMain-tab-2").on("click", function() {
			chartbubble.series[0].setData(csdBubbleSeries);
			chartRect.series[0].setData(csdRectSeries);
            chartbubble.tooltip.hide();
            chartRect.tooltip.hide();
            
            chartLandscapebubble.series[0].setData(csdBubbleSeries);
            chartLandscapeRect.series[0].setData(csdRectSeries);
            chartLandscapebubble.tooltip.hide();
            chartLandscapeRect.tooltip.hide();
            $('#overview-hc-rectangle').hide();
            
        });
		
	}
});










