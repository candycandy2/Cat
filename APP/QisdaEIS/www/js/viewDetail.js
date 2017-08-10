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
//var categoriesWeek = ['W21', 'W22', 'W23', 'W24', 'W25', 'W26']; 动态获取，由timeAxis代替
var companyCode = ['66558', '67326', '69410'];
var companyName = ['东森电视股份有限公司', '飞利浦股份有限公司', 'AAAA股份有限公司'];
var userName = "Alan Chen";
var startDate = "5/4";
var endDate = "6/15";
var timeAxis = [];
var buOverdueDetail = [];
var csdOverdueDetail = [];
var buOverdueSoon = [];
var csdOverdueSoon = [];
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
			
var noneDataTwoColumn = '<li class="data-list-none-twoColumn">' +
							'<div>-</div>' +
							'<div>-</div>' +
						'</li>';
						
var noneDataThreeColumn = '<li class="data-list-none-threeColumn">' +
							'<div>-</div>' +
							'<div>-</div>' +
							'<div>-</div>' +
						'</li>';
						
var noneDataFourColumn = '<li class="data-list-none-fourColumn">' +
							'<div>-</div>' +
							'<div>-</div>' +
							'<div>-</div>' +
							'<div>-</div>' +
						'</li>';
						
var noneDataTwoTotal = '<li class="overduesoon-total">' +
							'<div class="font-style7">' +
								'<span>Total</span>' +
							'</div>' +
							'<div class="font-style7">' +
								'<span>0</span>' +
							'</div>' +
						'</li>';

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
        categories: timeAxis,
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

function clickSingleListBtn(){
	//buSingleListBtn
	$('.buSingleListBtn').on('click', function(){
		var self = $(this);
		if(self.attr('src') === 'img/list_down.png'){
			self.attr('src', 'img/list_up.png');
			self.parent().parent().parent().next().show();
			self.parent().parent().parent().css('border-bottom', '1px solid white');

		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
			self.parent().parent().parent().css('border-bottom', '1px solid #D6D6D6');
		}

		if($('.buSingleListBtn[src="img/list_down.png"]').length === 3){
			$('#buAllListBtn').attr('src', 'img/all_list_down.png');
		}

		if($('.buSingleListBtn[src="img/list_up.png"]').length === 3){
			$('#buAllListBtn').attr('src', 'img/all_list_up.png');
		}

	});

	//csdSingleListBtn
	$('.csdSingleListBtn').on('click', function(){
		var self = $(this);
		if(self.attr('src') === 'img/list_down.png'){
			self.attr('src', 'img/list_up.png');
			self.parent().parent().parent().next().show();
			self.parent().parent().parent().css('border-bottom', '1px solid white');

		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
			self.parent().parent().parent().css('border-bottom', '1px solid #D6D6D6');
		}

		if($('.csdSingleListBtn[src="img/list_down.png"]').length === 3){
			$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
		}

		if($('.csdSingleListBtn[src="img/list_up.png"]').length === 3){
			$('#csdAllListBtn').attr('src', 'img/all_list_up.png');
		}
	});
	
}

/*****************************************************************/
$('#viewDetail').pagecontainer({
	create: function (event, ui) {
		
		window.OverdueDetail = function() {
			this.successCallback = function(data) {
				overdueDetailCallBackData = data["Content"];
				
				//get time axis on area and column
				for(var i in overdueDetailCallBackData[0]["Detail"]){
					timeAxis.push(overdueDetailCallBackData[0]["Detail"][i]["WEEK"]);
				}
				
				for(var i in overdueDetailCallBackData){
					if(overdueDetailCallBackData[i]["Header"]["TYPE"] == "BU"){
						buOverdueSoon.push(overdueDetailCallBackData[i]);
					}
					else{
						csdOverdueSoon.push(overdueDetailCallBackData[i]);
					}
				}
				//console.log(overdueDetailCallBackData);
					
				$.each(overdueDetailCallBackData, function(i, item) {
					if(item["Header"]["TYPE"] == "BU"){
						buOverdueDetail.push(item);
					}
					else{
						csdOverdueDetail.push(item);
					}
				});
				console.log(buOverdueDetail);
				
				$.each(buOverdueDetail, function(i, item) {
					var overdueDetailTotal = parseFloat(item["Detail"][5]["OVER_1_15_INV"]) + parseFloat(item["Detail"][5]["OVER_16_45_INV"]) + 
											parseFloat(item["Detail"][5]["OVER_46_75_INV"]) + parseFloat(item["Detail"][5]["OVER_76_INV"]);
					
					var overdueDetailContent = '<li class="bu-data-list">' +
											'<ul>' +
												'<li>' +
													'<div>' +
														'<div class="font-style7">' +
															'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
														'</div>' +	
													'</div>' +
												'</li>' +
												'<li>' +
													'<span class="font-style7 font-localString">' + overdueDetailTotal + '</span>' +
												'</li>' +
												'<li>' +
													'<div id="buArea' + i + '"></div>' +
												'</li>' +
												'<li>' +
													'<img src="img/list_down.png" class="buSingleListBtn" />' +
												'</li>' +
											'</ul>' +
										'</li>' +
										'<li class="bu-single-list">' +
											'<div>' +
												'<div class="font-style12">Total AR and Overdue Amount</div>' +
												'<div class="font-style13">' +
													'<span>Date:</span>' +
													'<span>5/14</span>' +
													'<span>-</span>' +
													'<span>6/15</span>' +
												'</div>' +
											'</div>' +
											'<div class="font-style13">' +
												'<span>' + item["Header"]["OWNER"] + '</span>' +
												'<span>Owner:</span>' +	
											'</div>' +
											'<div>' +
												'<div class="overdue-tab1 font-style13">' +
													'<div><span>1-15 Days</span></div>' +
													'<div><span>16-45 Days</span></div>' +
													'<div><span>46-75 Days</span></div>' +
													'<div><span>Over 75 Days</span></div>' +
												'</div>' +
												'<div class="overdue-tab2 font-style13">' +
													'<div><span>' + item["Detail"][5]["OVER_1_15_INV"] + '</span></div>' +
													'<div><span>' + item["Detail"][5]["OVER_16_45_INV"] + '</span></div>' +
													'<div><span>' + item["Detail"][5]["OVER_46_75_INV"] + '</span></div>' +
													'<div><span>' + item["Detail"][5]["OVER_76_INV"] + '</span></div>' +
												'</div>' +
											'</div>' +
											'<div id="buColumn' + i + '"></div>' +
										'</li>';
					
					$('.overdueDetail-bu').append(overdueDetailContent);
					
					/******** area图表 ********/
					var areaSeries = [];
					
					var areaWeek0 = parseFloat(item["Detail"][0]["OVER_1_15_INV"]) + parseFloat(item["Detail"][0]["OVER_16_45_INV"]) +
							    parseFloat(item["Detail"][0]["OVER_46_75_INV"]) + parseFloat(item["Detail"][0]["OVER_76_INV"]);
					areaSeries.push(areaWeek0);
					var areaWeek1 = parseFloat(item["Detail"][1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][1]["OVER_16_45_INV"]) +
							    parseFloat(item["Detail"][1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][1]["OVER_76_INV"]);
					areaSeries.push(areaWeek1);
					var areaWeek2 = parseFloat(item["Detail"][2]["OVER_1_15_INV"]) + parseFloat(item["Detail"][2]["OVER_16_45_INV"]) +
							    parseFloat(item["Detail"][2]["OVER_46_75_INV"]) + parseFloat(item["Detail"][2]["OVER_76_INV"]);
					areaSeries.push(areaWeek2);
					var areaWeek3 = parseFloat(item["Detail"][3]["OVER_1_15_INV"]) + parseFloat(item["Detail"][3]["OVER_16_45_INV"]) +
							    parseFloat(item["Detail"][3]["OVER_46_75_INV"]) + parseFloat(item["Detail"][3]["OVER_76_INV"]);
					areaSeries.push(areaWeek3);
					var areaWeek4 = parseFloat(item["Detail"][4]["OVER_1_15_INV"]) + parseFloat(item["Detail"][4]["OVER_16_45_INV"]) +
							    parseFloat(item["Detail"][4]["OVER_46_75_INV"]) + parseFloat(item["Detail"][4]["OVER_76_INV"]);
					areaSeries.push(areaWeek4);
					var areaWeek5 = parseFloat(item["Detail"][5]["OVER_1_15_INV"]) + parseFloat(item["Detail"][5]["OVER_16_45_INV"]) +
							    parseFloat(item["Detail"][5]["OVER_46_75_INV"]) + parseFloat(item["Detail"][5]["OVER_76_INV"]);
					areaSeries.push(areaWeek5);
					
					//console.log(areaSeries);
					
					var buArea = new Highcharts.Chart('buArea' + i, areaOption);
					buArea.series[0].setData(areaSeries, true, true, false);
					
					
					/*********** column图表 **********/
					var columnSeries1 = [];
					var column0 = parseFloat(item["Detail"][0]["OVER_1_15_INV"]);
					columnSeries1.push(column0);
					var column1 = parseFloat(item["Detail"][1]["OVER_1_15_INV"]);
					columnSeries1.push(column1);
					var column2 = parseFloat(item["Detail"][2]["OVER_1_15_INV"]);
					columnSeries1.push(column2);
					var column3 = parseFloat(item["Detail"][3]["OVER_1_15_INV"]);
					columnSeries1.push(column3);
					var column4 = parseFloat(item["Detail"][4]["OVER_1_15_INV"]);
					columnSeries1.push(column4);
					var column5 = parseFloat(item["Detail"][5]["OVER_1_15_INV"]);
					columnSeries1.push(column5);
					
					var columnSeries2 = [];
					var column6 = parseFloat(item["Detail"][0]["OVER_16_45_INV"]);
					columnSeries2.push(column6);
					var column7 = parseFloat(item["Detail"][1]["OVER_16_45_INV"]);
					columnSeries2.push(column7);
					var column8 = parseFloat(item["Detail"][2]["OVER_16_45_INV"]);
					columnSeries2.push(column8);
					var column9 = parseFloat(item["Detail"][3]["OVER_16_45_INV"]);
					columnSeries2.push(column9);
					var column10 = parseFloat(item["Detail"][4]["OVER_16_45_INV"]);
					columnSeries2.push(column10);
					var column11 = parseFloat(item["Detail"][5]["OVER_16_45_INV"]);
					columnSeries2.push(column11);
					
					var columnSeries3 = [];
					var column12 = parseFloat(item["Detail"][0]["OVER_46_75_INV"]);
					columnSeries3.push(column12);
					var column13 = parseFloat(item["Detail"][1]["OVER_46_75_INV"]);
					columnSeries3.push(column13);
					var column14 = parseFloat(item["Detail"][2]["OVER_46_75_INV"]);
					columnSeries3.push(column14);
					var column15 = parseFloat(item["Detail"][3]["OVER_46_75_INV"]);
					columnSeries3.push(column15);
					var column16 = parseFloat(item["Detail"][4]["OVER_46_75_INV"]);
					columnSeries3.push(column16);
					var column17 = parseFloat(item["Detail"][5]["OVER_46_75_INV"]);
					columnSeries3.push(column17);
					
					var columnSeries4 = [];
					var column18 = parseFloat(item["Detail"][0]["OVER_76_INV"]);
					columnSeries4.push(column18);
					var column19 = parseFloat(item["Detail"][1]["OVER_76_INV"]);
					columnSeries4.push(column19);
					var column20 = parseFloat(item["Detail"][2]["OVER_76_INV"]);
					columnSeries4.push(column20);
					var column21 = parseFloat(item["Detail"][3]["OVER_76_INV"]);
					columnSeries4.push(column21);
					var column22 = parseFloat(item["Detail"][4]["OVER_76_INV"]);
					columnSeries4.push(column22);
					var column23 = parseFloat(item["Detail"][5]["OVER_76_INV"]);
					columnSeries4.push(column23);
					
					var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
					buColumn.series[0].setData(columnSeries1, true, true, false);
					buColumn.series[1].setData(columnSeries2, true, true, false);
					buColumn.series[2].setData(columnSeries3, true, true, false);
					buColumn.series[3].setData(columnSeries4, true, true, false);
					
				});
				
				clickSingleListBtn();
				
				
				
				
				
				
			
				
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
				creditExpiredSoonCallBackData = data["Content"];
				getExpiredSoonData();
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
			var buOutstandDetailTotal = 0;
			var csdOutstandDetailTotal = 0;
			for(var i in outstandDetailCallBackData){
				if(outstandDetailCallBackData[i]["TYPE"] == "BU"){
					buOutstand.push(outstandDetailCallBackData[i]);
				}
				else{
					csdOutstand.push(outstandDetailCallBackData[i]);
				}
			}
			//console.log(buOutstand);
			
			if(buOutstand.length > 0){
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

					buOutstandDetailTotal +=  parseFloat(buOutstand[i]["DUE_SOON_INV"]);
					
				}
				
				var buOutstandDetailContentTotal = '<li class="overduesoon-total">' +
														'<div class="font-style7">' +
															'<span>Total</span>' +
														'</div>' +
														'<div class="font-style7">' +
															'<span>' + buOutstandDetailTotal.toFixed(2) + '</span>' +
														'</div>' +
													'</li>';
				
				$('.overduesoon-bu').append(buOutstandDetailContentTotal);
			}
			else{
				$('.overduesoon-bu').append(noneDataTwoColumn);
				$('.overduesoon-bu').append(noneDataTwoTotal);
			}
					
			if(csdOutstand.length > 0){
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
					
					csdOutstandDetailTotal += parseFloat(buOutstand[i]["DUE_SOON_INV"]);
				}
				
				var csdOutstandDetailContentTotal = '<li class="overduesoon-total">' +
														'<div class="font-style7">' +
															'<span>Total</span>' +
														'</div>' +
														'<div class="font-style7">' +
															'<span>' + csdOutstandDetailTotal.toFixed(2) + '</span>' +
														'</div>' +
													'</li>';
				
				$('.overduesoon-csd').append(csdOutstandDetailContentTotal);
			}
			else{
				$('.overduesoon-csd').append(noneDataTwoColumn);
				$('.overduesoon-csd').append(noneDataTwoTotal);
			}
			
		}
		
		function getExpiredSoonData() {
			if(creditExpiredSoonCallBackData.length > 0){
				for(var i in creditExpiredSoonCallBackData) {
					var expiredSoonContent = '<li class="data-list-expiredsoon">' +
												'<div>' +
													'<div class="font-style7">' +
														'<span>' + creditExpiredSoonCallBackData[i]["CUSTOMER"] + '</span>' +
													'</div>' +
												'</div>' +
												'<div class="font-style7">' +
													'<span>' + creditExpiredSoonCallBackData[i]["EXPIRED_DATE"] + '</span>' +
												'</div>' +
												'<div class="font-style7">' +
													'<span>' + creditExpiredSoonCallBackData[i]["CREDIT_LIIMIT"] + '</span>' +
												'</div>' +
											'</li>';
					
					$('.expiredsoon').append(expiredSoonContent);	
				}
			}
			else{
				$('.expiredsoon').append(noneDataThreeColumn);
				
			}
			
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


