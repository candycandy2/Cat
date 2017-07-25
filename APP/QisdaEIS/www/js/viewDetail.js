/********************/
var ro = "ALL";

//get BU & CSD series
var companySeries1 = [20, 33, 53, 76];
var companySeries2 = [31, 26, 58, 43];
var companySeries3 = [46, 38, 21, 47];
var companySeries4 = [58, 37, 76, 51];

var columnData1 = [56, 72, 34, 94, 86, 85];
var columnData2 = [79, 52, 74, 90, 53, 72];
var columnData3 = [67, 89, 54, 16, 45, 66];
var columnData4 = [58, 71, 89, 36, 93, 46];
var columnMinusData1 = [0, 0, 0, 0, 0, 0];
var columnMinusData2 = [35, 28, -30, 24, 25, 14];
var columnMinusData3 = [37, -26, -22, -23, -19, 0];
var columnMinusData4 = [0, 0, 0, 0, 0, 0];

var categoriesMonth = ['60天', '70天', '80天', '90天'];
var categoriesWeek = ['W21', 'W22', 'W23', 'W24', 'W25', 'W26'];
var companyCode = ['66558', '67326', '69410'];
var companyName = ['东森电视股份有限公司', '飞利浦股份有限公司', 'AAAA股份有限公司'];
var userName = "Alan Chen";
var startDate = "5/4";
var endDate = "6/15";

var dataContent = "";
var dataTotal = dataContent
			+ '<li class="bu-data-list" style="background-color:#ffffff">'
			+	'<ul>'
			+		'<li>'
			+			'<div style="text-align: left;text-indent:3VW;">'
			+				'<div class="font-style7">'
			+					'<span>Total</span>'
			+				'</div>'	
			+			'</div>'
			+		'</li>'
			+		'<li>'
			+			'<span class="font-style7">0</span>'
			+		'</li>'
			+		'<li>'
			+			'<div></div>'
			+		'</li>'
			+		'<li>'
			+		'</li>'
			+	'</ul>'
			+ '</li>';
				
var dataSingle = dataContent
			+ '<li class="bu-data-list">'
			+	'<ul>'
			+		'<li>'
			+			'<div style="text-align: center;">'
			+				'<div class="font-style7">'
			+					'<span>-</span>'
			+				'</div>'	
			+			'</div>'
			+		'</li>'
			+		'<li style="text-align: center;">'
			+			'<span class="font-style7">-</span>'
			+		'</li>'
			+		'<li style="text-align: center;">'
			+			'<div>-</div>'
			+		'</li>'
			+		'<li>'
			+			'<img src="img/list_down.png" class="buSingleListBtn" />'
			+		'</li>'
			+	'</ul>'
			+ '</li>';

//area highcharts option
var areaOption = {
	chart: {
        type: 'area',
        margin: [0, 0, 0, 0]
    },
    title: {
        text: null
    },
    legend: {
    	enabled: false
    },
    credits: {
    	enabled: false
    },
    xAxis: {
    	lineWidth: 1,
    	tickWidth: 0,
        allowDecimals: false,
        labels: {
        	enabled: false,
        	formatter: function(){
        		return categoriesMonth[this.value];
        	}
        },
        tickInterval: 1
    },
    yAxis: {
        title: {
            text: null
        },
        gridLineWidth: 0,
        visible: false
    },
    plotOptions: {
    	area: {
    		lineWidth: 1,
    		fillColor: '#DFEDFA',
    		marker: {
                enabled: true,
                symbol: 'circle',
                radius: 1
            }
    	}
    },
    tooltip: {
        enabled: false
    },
    series: [{
        data: companySeries1
    }]
};

//column highcharts option
var columnOption = {
	chart: {
        type: 'column',
        margin: [10, 5, 28, 40]
    },
    title: {
        text: ''
    },
    subtitle:{
    	text: ''
    },
    credits: {
    	enabled: false
    },
    xAxis: {
        categories: categoriesWeek,
        labels: {
        	style: {
        		fontSize: '9px'
        	}
        }
    },
    yAxis: {
        title: {
            text: null
        },
        labels: {
            format: '{value}K',
            style: {
            	fontSize: '9px'
            }
        }
    },
    legend: {		     
        enabled: false
    },
    tooltip: {
       	useHTML: true,
	    shadow: false,
	    borderWidth: 1,
	    borderColor: 'gray',
	    backgroundColor:　'#ffffff',
	    headerFormat: '<table class="fontTooltip">' +
	    '<tr><td><strong>{point.x}</strong></td></tr>' +
	    '<tr><td><strong>' + companyCode[0] + ' ' + companyName[0] + '</strong></td></tr>',
	    pointFormat: '<tr><td>{series.name}:USD${point.y}</td></tr>',
	    footerFormat: '</table>',
	    followPointer: false,
        followTouchMove: false,
	    valueSuffix: 'K',
	    shared: true
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }   
    },
    series: [{
        name: '1-15 Days',
        color: '#81B4E1',
        data: columnData1
    }, {
        name: '16-45 Days',
        color: '#F79620',
        data: columnData2
    }, {
        name: '46-75 Days',
        color: '#F36D21',
        data: columnData3
    }, {
        name: 'Over 75 Days',
        color: '#ED3824',
        data: columnData4
    }]
	
};



$('#viewDetail').pagecontainer({
	create: function (event, ui) {
		function getChartAreaAndColumn(){
			buChartArea1 = new Highcharts.Chart('buChartArea1', areaOption);
			buChartArea1.series[0].setData(companySeries1, true, true, false);
			
			buChartArea2 = new Highcharts.Chart('buChartArea2', areaOption);
			buChartArea2.series[0].setData(companySeries2, true, true, false);
			
			buChartArea3 = new Highcharts.Chart('buChartArea3', areaOption);
			buChartArea3.series[0].setData(companySeries3, true, true, false);
			
			buChartArea4 = new Highcharts.Chart('buChartArea4', areaOption);
			buChartArea4.series[0].setData(companySeries4, true, true, false);
			
			csdChartArea1 = new Highcharts.Chart('csdChartArea1', areaOption);
			csdChartArea1.series[0].setData(companySeries1, true, true, false);
			
			csdChartArea2 = new Highcharts.Chart('csdChartArea2', areaOption);
			csdChartArea2.series[0].setData(companySeries2, true, true, false);
			
			csdChartArea3 = new Highcharts.Chart('csdChartArea3', areaOption);
			csdChartArea3.series[0].setData(companySeries3, true, true, false);
			
			csdChartArea4 = new Highcharts.Chart('csdChartArea4', areaOption);
			csdChartArea4.series[0].setData(companySeries4, true, true, false);
			
			buChartColumn1 = new Highcharts.Chart('buChartColumn1', columnOption);
			buChartColumn1.series[0].setData(columnData1, true, true, false);
			buChartColumn1.series[1].setData(columnData2, true, true, false);
			buChartColumn1.series[2].setData(columnData3, true, true, false);
			buChartColumn1.series[3].setData(columnData4, true, true, false);
			
			buChartColumn2 = new Highcharts.Chart('buChartColumn2', columnOption);
			buChartColumn2.series[0].setData(columnData2, true, true, false);
			buChartColumn2.series[1].setData(columnData1, true, true, false);
			buChartColumn2.series[2].setData(columnData4, true, true, false);
			buChartColumn2.series[3].setData(columnData3, true, true, false);
			
			buChartColumn3 = new Highcharts.Chart('buChartColumn3', columnOption);
			buChartColumn3.series[0].setData(columnData3, true, true, false);
			buChartColumn3.series[1].setData(columnData2, true, true, false);
			buChartColumn3.series[2].setData(columnData4, true, true, false);
			buChartColumn3.series[3].setData(columnData1, true, true, false);
			
			csdChartColumn1 = new Highcharts.Chart('csdChartColumn1', columnOption);
			csdChartColumn1.series[0].setData(columnData4, true, true, false);
			csdChartColumn1.series[1].setData(columnData3, true, true, false);
			csdChartColumn1.series[2].setData(columnData1, true, true, false);
			csdChartColumn1.series[3].setData(columnData2, true, true, false);
			
			csdChartColumn2 = new Highcharts.Chart('csdChartColumn2', columnOption);
			csdChartColumn2.series[0].setData(columnData1, true, true, false);
			csdChartColumn2.series[1].setData(columnData4, true, true, false);
			csdChartColumn2.series[2].setData(columnData2, true, true, false);
			csdChartColumn2.series[3].setData(columnData3, true, true, false);
			
			csdChartColumn3 = new Highcharts.Chart('csdChartColumn3', columnOption);
			csdChartColumn3.series[0].setData(columnData2, true, true, false);
			csdChartColumn3.series[1].setData(columnData1, true, true, false);
			csdChartColumn3.series[2].setData(columnData3, true, true, false);
			csdChartColumn3.series[3].setData(columnData4, true, true, false);
			
		}
		
		function getLandscapeColumn(){
			chartColumnLandscape = new Highcharts.Chart('viewDetail-hc-column-landscape', columnOption);
			chartColumnLandscape.series[0].setData(columnData1, true, true, false);
			chartColumnLandscape.series[1].setData(columnData2, true, true, false);
			chartColumnLandscape.series[2].setData(columnData3, true, true, false);
			chartColumnLandscape.series[3].setData(columnData4, true, true, false);
			
			chartColumnLandscape.update({ 
				chart: {
					marginTop: 90
				},
				title: {
					text: 'Total AR and Overdue Amount',
					style: {
						fontWidth: 'bold'
					}
				},
				subtitle: {
					text: companyCode[0] + ' ' + companyName[0] + '<br>' + 'Owner:' + userName + ' ' +  'Date:' + startDate + '-' + endDate
				}
			});
		}
		
		function changeScrollmenu(ro){
			if(ro === 'LCD'){
				$('#BU ul li').remove();
				$('#BU ul').append(dataSingle);
				$('#BU ul').append(dataTotal);
				
			}else if(ro === 'ALL'){
				//恢复到ALL所有类别
			}
		}
		
		/********************************** page event *************************************/		
		$('#viewDetail').on('pageshow', function(event, ui){
			getChartAreaAndColumn();
			getLandscapeColumn();
			
			$("label[for=viewDetail-tab-1]").addClass('ui-btn-active');
            $("label[for=viewDetail-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewDetail-tab-3]").removeClass('ui-btn-active');
            $(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Ro #ALL").addClass('hover');
            
			
		});
		
		// scroll menu on click
        $(document).on('click', '#viewDetail .Ro > a', function(e) {
            e.preventDefault();
            ro = $(this).context.id;
			
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
			
			//changeScrollmenu(ro);
			
        });
		
	}
});


