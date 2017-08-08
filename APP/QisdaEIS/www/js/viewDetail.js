/********************/
var ro = "ALL";

//get BU & CSD series
var companySeries1 = [20, 33, 53, 76];
var companySeries2 = [31, 26, 58, 43];
var companySeries3 = [46, 38, 21, 47];
var companySeries4 = [58, 37, 76, 51];

var columnData1 = [44656, 36472, 25634, 87794, 65686, 44485];
var columnData2 = [55879, 54752, 65074, 48490, 65953, 46072];
var columnData3 = [84567, 43989, 63854, 35016, 54245, 57166];
var columnData4 = [55058, 76371, 57389, 43136, 36593, 78846];
var columnMinusData1 = [0, 0, 0, 0, 0, 0];
var columnMinusData2 = [35, 28, -30, 24, 25, 14];
var columnMinusData3 = [37, -26, -22, -23, -19, 0];
var columnMinusData4 = [0, 0, 0, 0, 0, 0];

var company = [
	{code: '641287', name: '东森股份有限公司', category: 'BU', productLine: 'LCD', total: 200000,
	advance: 300000, over1: 1684, over16: 6452, over46: 16884, over76: 268455}
];

var categoriesMonth = ['60天', '70天', '80天', '90天'];
var categoriesWeek = ['W21', 'W22', 'W23', 'W24', 'W25', 'W26'];
var companyCode = ['66558', '67326', '69410'];
var companyName = ['东森电视股份有限公司', '飞利浦股份有限公司', 'AAAA股份有限公司'];
var userName = "Alan Chen";
var startDate = "5/4";
var endDate = "6/15";
var buOverdue = [];
var csdOverdue = [];
var buOutstand = [];
var csdOutstand = [];
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
//	    headerFormat: '<table class="fontTooltip">' + '<tr><td>' + this.x + '</td></tr>' +
//	     '<tr><td>' + companyCode[0] + '</td></tr>',
//      pointFormat: '<tr><td>' + this.series.name + ':USD$' + this.y + '</td></tr>',
//      footerFormat: '</table>',
	   	formatter: function () {
	        var s = '<b>' + this.x + '</b><br/><b>' + companyCode[0] + ' ' + companyName[0] + '</b>';
	        $.each(this.points, function () {
	           s += '<br/> ' + this.series.name + ':USD$' + this.y;
	        });
	        return s;
	    },
	    followPointer: false,
        followTouchMove: false,
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

/*****************************************************************/
$('#viewDetail').pagecontainer({
	create: function (event, ui) {
		
		window.OverdueDetail = function() {
			this.successCallback = function(data) {
				overdueDetailCallBackData = data["Content"];
				for(var i in overdueDetailCallBackData){
					if(overdueDetailCallBackData[i]["Header"]["TYPE"] == "BU"){
						buOverdue.push(overdueDetailCallBackData[i]);
					}
					else{
						csdOverdue.push(overdueDetailCallBackData[i]);
					}
				}
				//console.log(buOverdue);
				
			
				
			};
			
			this.failCallback = function(data) {
				console.log("api misconnected");
			};
			
			var _construct = function(){
				CustomAPI("POST", true, "OverdueDetail", self.successCallback, self.failCallback, OverdueDetailQueryData, "");
			}();
		};
		
		window.OutstandDetail = function() {
			this.successCallback = function(data) {
				outstandDetailCallBackData = data["Content"];
				getOverdueSoonData();
			};
			
			this.failCallback = function(data) {
				console.log("api misconnected");
			};
			
			var _construct = function(){
				CustomAPI("POST", true, "OutstandDetail", self.successCallback, self.failCallback, OutstandDetailQueryData, "");
			}();
		};
		
		window.CreditExpiredSoon = function() {
			this.successCallback = function(data) {
				console.log(data);
			};
			
			this.failCallback = function(data) {
				console.log("api misconnected");
			};
			
			var _construct = function(){
				CustomAPI("POST", true, "CreditExpiredSoon", self.successCallback, self.failCallback, CreditExpiredSoonQueryData, "");
			}();
		};
		
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
		
		function getOverdueSoonData(){
			for(var i in outstandDetailCallBackData){
				if(outstandDetailCallBackData[i]["TYPE"] == "BU"){
					buOutstand.push(outstandDetailCallBackData[i]);
				}
				else{
					csdOutstand.push(outstandDetailCallBackData[i]);
				}
			}
			console.log(buOutstand);
			
			for(var i in buOutstand){
				var buOutstandDetailContent = '<li class="data-list-overduesoon">' +
												'<div>' +
													'<div class="font-style7">' +
														'<span>' + buOutstand[i]["CUSTOMER"] + '</span>' +
													'</div>' +
												'</div>' +
												'<div class="font-style7">' +
													'<span>' + buOutstand[i]["DUE_SOON_INV"] + '</span>' +
												'</div>' +
											'</li>';
				$('.overduesoon-bu').append(buOutstandDetailContent);
				
				var buOutstandDetailTotal += parseFloat(buOutstand[i]["DUE_SOON_INV"]);
				
			}
			
			var buOutstandDetailContentTotal = '<li class="overduesoon-total">' +
													'<div class="font-style7">' +
														'<span>Total</span>' +
													'</div>' +
													'<div class="font-style7">' +
														'<span>' + buOutstandDetailTotal + '</span>' +
													'</div>' +
												'</li>';
			
			$('.overduesoon-bu').append(buOutstandDetailContentTotal);		
			
			for(var i in csdOutstand){
				var csdOutstandDetailContent = '<li class="data-list-overduesoon">' +
												'<div>' +
													'<div class="font-style7">' +
														'<span>' + buOutstand[i]["CUSTOMER"] + '</span>' +
													'</div>' +
												'</div>' +
												'<div class="font-style7">' +
													'<span>' + buOutstand[i]["DUE_SOON_INV"] + '</span>' +
												'</div>' +
											'</li>';
				$('.overduesoon-csd').append(csdOutstandDetailContent);
				
				var csdOutstandDetailTotal += parseFloat(buOutstand[i]["DUE_SOON_INV"]);
			}
			
			var csdOutstandDetailContentTotal = '<li class="overduesoon-total">' +
													'<div class="font-style7">' +
														'<span>Total</span>' +
													'</div>' +
													'<div class="font-style7">' +
														'<span>' + csdOutstandDetailTotal + '</span>' +
													'</div>' +
												'</li>';
			
			$('.overduesoon-csd').append(csdOutstandDetailContentTotal);
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
		
		//将数字每三位加逗号
		function numberToLocaleString(){
			$('.font-localString').each(function() {
				$(this).text(parseInt($(this).text()).toLocaleString());
			});
			
			
			$('.overdue-tab2 span').each(function() {
				$(this).text(parseInt($(this).text()).toLocaleString());
			})	
			
		}
		
		/********************************** page event *************************************/	
		$("#viewDetail").on("pagebeforeshow", function(event, ui){
			/* global PullToRefresh */
			
			
			changePageInitViewDetail();
		});
		
		$('#viewDetail').on('pageshow', function(event, ui){
			getChartAreaAndColumn();
			getLandscapeColumn();
			zoomInChartByColumn();			
			
		});
		
		$(".page-tabs #viewDetail-tab-1").on("click", function(){
			$('#overdueSoon').hide();
			$('#expiredSoon').hide();
			$('#overdue').show();
		});
		
		$(".page-tabs #viewDetail-tab-2").on("click", function(){
			$('#overdue').hide();
			$('#expiredSoon').hide();
			$('#overdueSoon').show()
		});
		
		$(".page-tabs #viewDetail-tab-3").on("click", function(){
			$('#overdue').hide();
			$('#overdueSoon').hide();
			$('#expiredSoon').show();
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


