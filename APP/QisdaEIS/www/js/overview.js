/* blobal variable */
var hightchartScale = 0.7;

$(function(){
	
})

/************************* echarts *******************************/


var dataGZ = [
    [64,26,80,27,1.163,27,13,"TE"],
    [66,85,62,71,1.195,60,8,"TF"],
    [68,56,38,74,1.363,37,7,"TN"],
    [70,15,21,36,0.634,40,9,"TT"],
    [70,48,42,46,0.915,81,13,"TC"],
    [71,65,54,69,1.067,92,16,"TU"],
    [78,40,30,28,0.924,51,2,"TY"],
    [82,45,48,74,1.236,75,26,"FS"],
    [81,60,85,113,1.237,114,27,"FL"],
    [97,62,81,104,1.041,56,40,"KL"],
];

var schema = [
    {name: 'date', index: 0, text: '日'},
    {name: 'AQIindex', index: 1, text: 'AQI指数'},
    {name: 'PM25', index: 2, text: 'PM2.5'},
    {name: 'PM10', index: 3, text: 'PM10'},
    {name: 'CO', index: 4, text: '一氧化碳（CO）'},
    {name: 'NO2', index: 5, text: '二氧化氮（NO2）'},
    {name: 'SO2', index: 6, text: '二氧化硫（SO2）'},
    {name: '项目', index: 7, text: '项目组'}
];

var option = {
    backgroundColor: 'white',
    color: [
        /*'#dd4444', '#fec42c', */'#80F1BE'
    ],
    /*legend: {
        y: 'top',
        data: ['北京', '上海', '广州'],
        textStyle: {
            color: '#fff',
            fontSize: 16
        }
    },*/
    grid: {
        x: '15%',
        x2: '5%',
        y: '10%',
        y2: '20%',
    },
    tooltip: {
        padding: 10,
        textStyle: {
        	color: 'black'
        },
        backgroundColor: '#F7F8F1',
        borderColor: '#F4D8AF',
        borderWidth: 1,
        formatter: function (obj) {
            var value = obj.value;
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3);color: black; font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">LTV(LG/Philips)<br>'
                + 'Totail Overdue AR Amt.：USD$ ' + value[1] + 'K' + '<br>'
                + 'Max Overdue Days： ' + value[0] + 'days</div>';
        }
    },
    xAxis: {
        type: 'value',
        name: 'Max Overdue Days of Each Facility   (Day)',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
            color: '#727272',
            fontSize: 12
        },
        max: 100,
        min: 60,
        splitLine: {
            show: true
        },
        axisLine: {
            lineStyle: {
                color: '#727272'
            }
        }
    },
    yAxis: {
        type: 'value',
        name: 'Overdue Amount of Each Facility (USD$)',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: {
            color: '#727272',
            fontSize: 12
        },
        axisLine: {
            lineStyle: {
                color: '#727272'
            }
        },
        splitLine: {
            show: true,
            formatter: '{b}:{c}'
        }
    },
    /*visualMap: [
        {
            left: 'right',
            top: '10%',
            dimension: 2,
            min: 0,
            max: 250,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ['圆形大小：PM2.5'],
            textGap: 30,
            textStyle: {
                color: '#fff'
            },
            inRange: {
                symbolSize: [10, 70]
            },
            outOfRange: {
                symbolSize: [10, 70],
                color: ['rgba(255,255,255,.2)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#444']
                }
            }
        },
        {
            left: 'right',
            bottom: '5%',
            dimension: 6,
            min: 0,
            max: 50,
            itemHeight: 120,
            calculable: true,
            precision: 0.1,
            text: ['明暗：二氧化硫'],
            textGap: 30,
            textStyle: {
                color: '#fff'
            },
            inRange: {
                colorLightness: [1, 0.5]
            },
            outOfRange: {
                color: ['rgba(255,255,255,.2)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#444']
                }
            }
        }
    ],*/
    series: {
        name: '广州',
        type: 'scatter',
        symbolSize: 30,
        label: {
        	normal: {
        		show: true,
        		formatter: function (params) {
        			var value = params.value;
        			return value[7] ;
        		},
        		textStyle: {
        			color: 'black',
        			fontWeight: 'bold',
        			fontFamily: 'Arial',
        			fontSize: 14
        		}
        	}
        	
        },
        itemStyle: {
        	normal: {
		        opacity: 0.8,
		        shadowBlur: 10,
		        shadowOffsetX: 0,
		        shadowOffsetY: 0,
		        shadowColor: 'rgba(0, 0, 0, 0.5)'
		    }
        },
        data: dataGZ
            
    }   
};

var chartBubble = echarts.init(document.getElementById('chartBubble'));
chartBubble.setOption(option);

chartBubble.on('click', function (params) {
    //console.log(params);
    var datas=params.data;
    console.log(datas);
    
    $('#chartRectangle').css('display', 'block');
});

/******************************* highcharts ********************************/
var options = {
	colorAxis: {
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    },
    series: [{
        type: "treemap",
        layoutAlgorithm: 'squarified',
        data: [{
            name: '东森有限公司',
            value: 10,
            colorValue: 1
        }, {
            name: '飞利浦有限公司',
            value: 6,
            colorValue: 1
        }, {
            name: '东森有限公司',
            value: 4,
            colorValue: 1
        }, {
            name: '东森有限公司',
            value: 3,
            colorValue: 4
        }, {
            name: '东森有限公司',
            value: 3,
            colorValue: 4
        }, {
            name: '东森有限公司',
            value: 2,
            colorValue: 8
        }, {
            name: '东森有限公司',
            value: 2,
            colorValue: 8
        }]
    }],
    title: {
        text: null
    },
    credits: {
    	enabled: false
    }
}

var chartRectangle = Highcharts.chart('chartRectangle',options);

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

$('#longPress').on('taphold', function(){
	$('#popup').popup('open');
});

$('#closePopup').on('tap', function(){
	$('#popup').popup('close');
});



