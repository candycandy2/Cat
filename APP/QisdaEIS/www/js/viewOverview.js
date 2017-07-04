/* blobal variable */
var hightchartScale = 0.7;

$(function(){
	
})

/************************* highcharts *******************************/

var option1 = {
    chart: {
        type: 'bubble',
        marginTop: 40,
        plotBorderWidth: 1,
        zoomType: 'xy'
    },
    legend: {
        enabled: false
    },
    title: {	
        text: null
    },
    xAxis: {
        gridLineWidth: 1,
        title: {
            text: 'Max Overdue Days of Each Facility (Day)'
        },
        labels: {
            format: '{value}'
        },
        tickWidth: 0,
        tickPositions: [70, 80, 90],
        min: 60,
        max: 100
    },
    yAxis: {
        startOnTick: false,
        endOnTick: false,
        title: {
            text: 'Overdue Amount of Each Facility (USD$)'
        },
        labels: {
            format: '{value}K'
        },
        maxPadding: 0.2,
        tickPositions: [0, 25, 50, 75, 100],
        min: 0
    },
    tooltip: {
        useHTML: true,
        shadow: false,
        borderColor: '#FDC24F',
        backgroundColor: '#F8F9FC',
        headerFormat: '<table class="fontTooltip">',
        pointFormat: '<tr><td>{point.product}</td></tr>' +
        '<tr><td>Totail Overdue AR Amt.：USD${point.y}K</td></tr>' +
        '<tr><td>Max Overdue Days：{point.x}days</td></tr>',
        footerFormat: '</table>',
        followPointer: true
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                style: { 
                	"fontSize": "12px", 
                	"textOutline": null
                }
            },
            point: {
            	events: {
            		click: function(){
            			$('#overview-hc-rectangle').css('display', 'block');
            			
            		}
            	}
            }
        }
    },
    series: [{
        data: [
            { x: 97, y: 75, z: 35, name: 'TE', product: 'LTV(LG/Philips)' },
            { x: 86.5, y: 95, z: 35, name: 'TF', product: 'LTV(LG/Philips)' },
            { x: 80.8, y: 71, z: 35, name: 'TT', product: 'LTV(LG/Philips)' },
            { x: 76, y: 79, z: 35, name: 'TN', product: 'LTV(LG/Philips)' },
            { x: 80.3, y: 60, z: 35, name: 'TC', product: 'LTV(LG/Philips)' },
            { x: 78.4, y: 25, z: 35, name: 'TU', product: 'LTV(LG/Philips)' },
            { x: 62, y: 80, z: 35, name: 'TY', product: 'LTV(LG/Philips)' },
            { x: 73.5, y: 63, z: 35, name: 'FL', product: 'LTV(LG/Philips)' },
            { x: 71, y: 73, z: 35, name: 'FS', product: 'LTV(LG/Philips)' },
            { x: 69.2, y: 15, z: 35, name: 'KL', product: 'LTV(LG/Philips)' }
        ]
    }],
    credits: {
    	enabled: false
    }
};

var bubble1 = new Highcharts.Chart('overview-hc-bubble',option1);
var bubble2 = new Highcharts.Chart('overview-hc-bubble-landscape',option1);


/******************************* highcharts ********************************/
var option2 = {
	colorAxis: {
        minColor: '#FFFF6A',
        maxColor: '#FE0000'
    },
    series: [{
        type: "treemap",
        color: 'black',
        layoutAlgorithm: 'squarified',
        data: [{
            name: '东森电视事业股份有限公司',
            value: 12,
            colorValue: 2.5
        }, {
            name: '飞利浦股份有限公司',
            value: 5,
            colorValue: 0
        }, {
            name: '东森电视事业股份有限公司',
            value: 4,
            colorValue: 10
        }, {
            name: '东森电视事业股份有限公司',
            value: 2,
            colorValue: 6
        }, {
            name: '东森电视事业股份有限公司',
            value: 2,
            colorValue: 2.5
        }, {
            name: '东森电视事业股份有限公司',
            value: 2,
            colorValue: 0
        }, {
            name: '东森电视事业股份有限公司',
            value: 2,
            colorValue: 10
        }]
    }],
    title: {
        text: null
    },
    credits: {
    	enabled: false
    }
}

var rectangle1 = new Highcharts.Chart('overview-hc-rectangle',option2);

/*panel*/
$('#pageOverview').on('tap', function(){
	$('#pageOverview').addClass('panel-active').removeClass('panel-normal');
	$('#pageDetail').addClass('panel-normal').removeClass('panel-active');
	$('#panels').panel('close');
});

$('#pageDetail').on('tap', function(){
	$('#pageOverview').addClass('panel-normal').removeClass('panel-active');
	$('#pageDetail').addClass('panel-active').removeClass('panel-normal');
	$('#panels').panel('close');
});





