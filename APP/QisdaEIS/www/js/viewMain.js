//get BU & CSD series
var buBubbleSeries = [
	{ x: 63, y: 25, name: 'TE', product: '', color: '#99CC33' },
    { x: 67, y: 60, name: 'TF', product: '', color: '#40C1C7' },
    { x: 74, y: 49, name: 'TN', product: '', color: '#FFCC66' },			            
    { x: 78, y: 85, name: 'FL', product: '', color: '#5AAEE1' },
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
	{ name: '东森电视事业股份有限公司', value: 10, colorValue: 15 }, 
	{ name: '飞利浦股份有限公司', value: 10, colorValue: 30 }, 
	{ name: '东森电视事业股份有限公司', value: 6, colorValue: 40 }, 
	{ name: '东森电视事业股份有限公司', value: 6, colorValue: 50 }, 
	{ name: '东森电视事业股份有限公司', value: 3, colorValue: 60 }, 
	{ name: '东森电视事业股份有限公司', value: 3, colorValue: 70 }
];


//bubble highcharts option
var bubbleOption = {
	chart: {
        type: 'bubble',
        marginTop: 40,
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
            text: 'Max Overdue Days of Each Facility(Day)',
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
    	allowDecimals: false,
        lineWidth: 0,
        title: {
            text: 'Overdue Amount of Each Facility(USD$)'
        },
        labels: {
            format: '{value}K'
        },
        //maxPadding: 0.2,
        tickPositions: [0, 25, 50, 75, 100]
        /*min: 0*/
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
            			//hcHidden = true;
            			$('#overview-hc-rectangle').show();
            			
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
		marginTop: 40,
		marginBottom: 60,
		backgroundColor: '#F8FCFB',
		zoomType: 'none'
	},
	colorAxis: {
		min: 0,
		max: 50,
        minColor: '#F79620',
        maxColor: '#EF3623',
        tickPositions: [0, 15, 45, 75],
        stops: [
            [0, '#81B4E1'],
            [15, '#F79620'],
            [75, '#EF3623']
        ]
    },
    series: [{
    	data: buRectSeries,
        type: "treemap",
        color: 'black',
        layoutAlgorithm: 'squarified'
        
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
		$("#viewMain").on("pagebeforeshow", function(event, ui) {
			showBubble();
			showRect();
			
			if (window.orientation === 90 || window.orientation === -90 ) {
                zoomInChart();
            }
            //ytdStrExist = false;
			
		});
		
		
		
	}
});










