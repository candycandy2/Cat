/********************/
var viewDetailTab = "overdue";
var facility = "ALL";
var viewDetailInit = false;
var csdDataInit = false;
var overdueInit = false;
var overdueSoonInit = false;
var expiredSoonInit = false;
var facilityInit = false;
//get BU & CSD series
var companySeries1 = [10, 20, 30, 40, 50, 60];
var companySeries2 = [31, 26, 58, 43, 59, 64];
var companySeries3 = [46, 38, 21, 47, 21, 33];
var companySeries4 = [58, 37, 76, 51, 42, 27];

var columnData1 = [44, 36, 24, 87, 66, 45];
var columnData2 = [55, 54, 64, 48, 63, 42];
var columnData3 = [84, 43, 54, 36, 54, 66];
var columnData4 = [55, 76, 59, 46, 36, 46];
var columnData5 = [-44, -36, -24, -87, -86, -45];
var columnData6 = [-55, -52, -64, -48, -63, -42];
var columnData7 = [-87, -49, -63, -36, -54, -66];
var columnData8 = [-58, -71, -89, -36, -36, -46];
var columnData9 = [0, 0, 0, 0, 0, 0];

//var categoriesMonth = ['60天', '70天', '80天', '90天'];
//var categoriesWeek = ['W21', 'W22', 'W23', 'W24', 'W25', 'W26']; 动态获取，由timeAxis代替
var companyName = ['66558 东森电视股份有限公司', '67326 飞利浦股份有限公司', '69410 AAAA股份有限公司'];
var userName = "Alan Chen";
var startDate, endDate;
/*var startDate = "07/05";
var endDate = "08/25";*/
var buColumnCheckAll = false;
var csdColumnCheckAll = false;
var buOutstandDetailTotal = 0;
var csdOutstandDetailTotal = 0;
var week0 = [];
var timeAxis = [];
var otherBuOverdueDetail = [];
var otherCsdOverdueDetail = [];
var buCustomerArr = [];
var csdCustomerArr = [];
var buAreaSeriesINV = [];
var buAreaSeriesCM = [];
var buColumnSeries = [];
var csdAreaSeriesINV = [];
var csdAreaSeriesCM = [];
var csdColumnSeries = [];
var overdueDetailData = {};
var outstandDetailData = {};
var creditExpiredSoonData = {};
var buOverdueDetail = [];
var csdOverdueDetail = [];
var buOutstand = [];
var csdOutstand = [];
var expiredSoon = [];
var dataContent = "";

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

var noneDataFourTotal = '<li class="bu-data-list">' +
							'<ul>' +
								'<li>' +
									'<div style="text-align: left;text-indent: 1.5VW;">' +
										'<div class="font-style7">' +
											'<span>Total</span>' +
										'</div>' +	
									'</div>' +
								'</li>' +
								'<li>' +
									'<span class="font-style7">0</span>' +
								'</li>' +
								'<li>' +
									'<div></div>' +
								'</li>' +
								'<li>' +
								'</li>' +
							'</ul>' +
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
        		return timeAxis[this.value];
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
    		animation: false,
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
	    /*headerFormat: '<table class="fontTooltip"><tr><td>{point.x}</td></tr>' +
	     '<tr><td class="customerName">' + companyName[0] + '</td></tr>',
        pointFormat: '<tr><td>{series.name}:USD${point.y}</td></tr>',
        footerFormat: '</table>',*/
	   	/*formatter: function () {
	        var s = '<b>' + this.x + '</b><br/><b>' + companyName[0] + '</b>';
	        $.each(this.points, function () {
	           s += '<br/> ' + this.series.name + ':USD$' + formatNumber(this.y.toFixed(2));
	        });
	        return s;
	    },*/
	   	formatter: function () {
	        var s = '<b>' + this.x + '</b><br/><b>' + companyName[0] +
	        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
	        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
	        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
	        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
	        return s;
	    },
	    followPointer: false,
        followTouchMove: false,
	    shared: true
    },
    plotOptions: {
        column: {
        	animation: false,
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


function getLandscapeColumn(isInit, type) {
	if(isInit) {
		if(chartColumnLandscape == null) {
			chartColumnLandscape = new Highcharts.Chart('viewDetail-hc-column-landscape', columnOption);
		}
	}
	else {
		if(type == "BU") {
			if(switchState == false){
				if(facility == "ALL"){
					chartColumnLandscape.series[0].setData(buColumnSeries[buArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(buColumnSeries[buArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(buColumnSeries[buArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(buColumnSeries[buArrIndex][3], false, false, false);
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
							text: buOverdueDetail[buArrIndex]["Header"]["CUSTOMER"] + '<br>' + 'Owner:' + buOverdueDetail[buArrIndex]["Header"]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						}
					});
					chartColumnLandscape.redraw(false);
				}
				else{
					chartColumnLandscape.series[0].setData(buColumnSeries[buArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(buColumnSeries[buArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(buColumnSeries[buArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(buColumnSeries[buArrIndex][3], false, false, false);
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
							text: otherBuOverdueDetail[buArrIndex]["Header"]["CUSTOMER"] + '<br>' + 'Owner:' + otherBuOverdueDetail[buArrIndex]["Header"]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						}
					});
					chartColumnLandscape.redraw(false);
				}
				
			}
			else{
				chartColumnLandscape.series[0].setData(buColumnSeries[buArrIndex][0], false, false, false);
				chartColumnLandscape.series[1].setData(buColumnSeries[buArrIndex][1], false, false, false);
				chartColumnLandscape.series[2].setData(buColumnSeries[buArrIndex][2], false, false, false);
				chartColumnLandscape.series[3].setData(buColumnSeries[buArrIndex][3], false, false, false);
				chartColumnLandscape.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: buColumnSeries[buArrIndex][4]
				}, false, false, false);
				chartColumnLandscape.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: buColumnSeries[buArrIndex][5]
				}, false, false, false);
				chartColumnLandscape.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: buColumnSeries[buArrIndex][6]
				}, false, false, false);
				chartColumnLandscape.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: buColumnSeries[buArrIndex][7]
				}, false, false, false);
				chartColumnLandscape.update({
					chart: {
						marginTop: 70
					},
					title: {
						text: 'Overdue Trend in Last 6 weeks'
					},
					subtitle: {
						text: ''
					}
				});
				chartColumnLandscape.redraw(false);
			}
			
		}
		else if(type == "CSD"){
			if(switchState == false){
				if(facility == "ALL"){
					chartColumnLandscape.series[0].setData(csdColumnSeries[csdArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(csdColumnSeries[csdArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(csdColumnSeries[csdArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(csdColumnSeries[csdArrIndex][3], false, false, false);
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
							text: csdOverdueDetail[csdArrIndex]["Header"]["CUSTOMER"] + '<br>' + 'Owner:' + csdOverdueDetail[csdArrIndex]["Header"]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						}
					});
					chartColumnLandscape.redraw(false);
				}
				else{
					chartColumnLandscape.series[0].setData(csdColumnSeries[csdArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(csdColumnSeries[csdArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(csdColumnSeries[csdArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(csdColumnSeries[csdArrIndex][3], false, false, false);
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
							text: otherCsdOverdueDetail[csdArrIndex]["Header"]["CUSTOMER"] + '<br>' + 'Owner:' + otherCsdOverdueDetail[csdArrIndex]["Header"]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						}
					});
					chartColumnLandscape.redraw(false);
				}	
			}
			else{
				chartColumnLandscape.series[0].setData(csdColumnSeries[csdArrIndex][0], false, false, false);
				chartColumnLandscape.series[1].setData(csdColumnSeries[csdArrIndex][1], false, false, false);
				chartColumnLandscape.series[2].setData(csdColumnSeries[csdArrIndex][2], false, false, false);
				chartColumnLandscape.series[3].setData(csdColumnSeries[csdArrIndex][3], false, false, false);
				chartColumnLandscape.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: csdColumnSeries[csdArrIndex][4]
				}, false, false, false);
				chartColumnLandscape.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: csdColumnSeries[csdArrIndex][5]
				}, false, false, false);
				chartColumnLandscape.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: csdColumnSeries[csdArrIndex][6]
				}, false, false, false);
				chartColumnLandscape.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: csdColumnSeries[csdArrIndex][7]
				}, false, false, false);
				chartColumnLandscape.update({
					chart: {
						marginTop: 70
					},
					title: {
						text: 'Overdue Trend in Last 6 weeks'
					},
					subtitle: {
						text: ''
					}
				});
				chartColumnLandscape.redraw(false);
			}
		}		
		

	}
}

//buSingleListBtn
function buSingleListBtn(){	
	$('.buSingleListBtn').on('click', function(){
		var self = $(this);
		var index = $(this).attr('data-index');
		if(self.attr('src') === 'img/list_down.png'){
			self.attr('src', 'img/list_up.png');
			self.parent().parent().parent().next().show();
			self.parent().parent().parent().css('border-bottom', '1px solid white');
			buOverdueDetail[index]["Header"]["SPREAD"] = 1;
			/*buArrIndex = index;
			csdArrIndex = null;*/
			
			if(buColumnCheckAll == false){
				setSingleColumnData(index, 'bu');
			}
			
		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
			self.parent().parent().parent().css('border-bottom', '1px solid #D6D6D6');
			buOverdueDetail[index]["Header"]["SPREAD"] = 0;
			//buArrIndex = null;
			
			/*if(index == buArrIndex){
				buArrIndex = null;
			}*/
			
		}
		
		if($('.buSingleListBtn[src="img/list_down.png"]').length === buAreaSeriesINV.length){
			$('#buAllListBtn').attr('src', 'img/all_list_down.png');
		}

		if($('.buSingleListBtn[src="img/list_up.png"]').length === buAreaSeriesINV.length){
			$('#buAllListBtn').attr('src', 'img/all_list_up.png');
		}
		
	});
	
}

//csdSingleListBtn
function csdSingleListBtn(){
	$('.csdSingleListBtn').on('click', function(){
		var self = $(this);
		var index = $(this).attr('data-index');
		if(self.attr('src') === 'img/list_down.png'){
			self.attr('src', 'img/list_up.png');
			self.parent().parent().parent().next().show();
			self.parent().parent().parent().css('border-bottom', '1px solid white');
			csdOverdueDetail[index]["Header"]["SPREAD"] = 1;
			/*csdArrIndex = index;
			buArrIndex = null;*/
			
			if(csdColumnCheckAll == false){
				setSingleColumnData(index, 'csd');
			}
			
		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
			self.parent().parent().parent().css('border-bottom', '1px solid #D6D6D6');
			csdOverdueDetail[index]["Header"]["SPREAD"] = 0;
			//csdArrIndex = null;
			
			/*if(index == csdArrIndex){
				csdArrIndex = null;
			}*/
			
		}

		if($('.csdSingleListBtn[src="img/list_down.png"]').length === csdAreaSeriesINV.length){
			$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
		}

		if($('.csdSingleListBtn[src="img/list_up.png"]').length === csdAreaSeriesINV.length){
			$('#csdAllListBtn').attr('src', 'img/all_list_up.png');
		}
	});
}


function getOverdueDetailData(){	
	//get week timeAxis
	for(var i in overdueDetailCallBackData){
		if(overdueDetailCallBackData[i]["Detail"].length === 6){
			timeAxis.push(overdueDetailCallBackData[i]["Detail"][0]["WEEK"]);
			timeAxis.push(overdueDetailCallBackData[i]["Detail"][1]["WEEK"]);
			timeAxis.push(overdueDetailCallBackData[i]["Detail"][2]["WEEK"]);
			timeAxis.push(overdueDetailCallBackData[i]["Detail"][3]["WEEK"]);
			timeAxis.push(overdueDetailCallBackData[i]["Detail"][4]["WEEK"]);
			timeAxis.push(overdueDetailCallBackData[i]["Detail"][5]["WEEK"]);
			
			var startDay = overdueDetailCallBackData[i]["Detail"][0]["AGED_DATE"];
			var endDay = overdueDetailCallBackData[i]["Detail"][5]["AGED_DATE"];
			break;
		}
	}
	//get startDate and endDate
	startDate = startDay.substring(5, 10);
	endDate = endDay.substring(5, 10);
	
	$.each(overdueDetailCallBackData, function(i, item) {
		//添加属性spread,即展开详情,默认为0,展开为1
		item["Header"]["SPREAD"] = 0;
		//添加属性total,用来排序
		var totalLength = item["Detail"].length;
		item["Header"]["TOTAL_INV"] = parseFloat(item["Detail"][totalLength-1]["OVER_1_15_INV"]) +
									  parseFloat(item["Detail"][totalLength-1]["OVER_16_45_INV"]) +
									  parseFloat(item["Detail"][totalLength-1]["OVER_46_75_INV"]) +
									  parseFloat(item["Detail"][totalLength-1]["OVER_76_INV"]);
									  
		item["Header"]["TOTAL_CM"] = parseFloat(item["Detail"][totalLength-1]["OVER_1_15_INV"]) + 
									 parseFloat(item["Detail"][totalLength-1]["OVER_1_15_CM"]) +
									 parseFloat(item["Detail"][totalLength-1]["OVER_16_45_INV"]) + 
									 parseFloat(item["Detail"][totalLength-1]["OVER_16_45_CM"]) +
									 parseFloat(item["Detail"][totalLength-1]["OVER_46_75_INV"]) + 
									 parseFloat(item["Detail"][totalLength-1]["OVER_46_75_CM"]) +
									 parseFloat(item["Detail"][totalLength-1]["OVER_76_INV"]) + 
									 parseFloat(item["Detail"][totalLength-1]["OVER_76_CM"]);
										 
		if(item["Header"]["TYPE"] == "BU"){
			buOverdueDetail.push(item);
		}
		else{
			csdOverdueDetail.push(item);
		}
		
	});
	
	//默认按total降序排序
	buOverdueDetail.sort(compareLargeOverdue("Header", "TOTAL_INV"));
	csdOverdueDetail.sort(compareLargeOverdue("Header", "TOTAL_INV"));
	
}

function setBuOverdueDetailData(fac){
	$('.overdueDetail-bu').html("");
	buAreaSeriesINV = [];
	buAreaSeriesCM = [];
	buColumnSeries = [];
	buCustomerArr = [];
	var buOverdueDetailTotalINV = 0;
	var buOverdueDetailTotalCM = 0;
	
	if(fac == "ALL"){
		$.each(buOverdueDetail, function(i, item) {
			//获取detail有几周数据
			var detailLength = item["Detail"].length;
			//获取图表相关信息
			buCustomerArr.push({
				"CUSTOMER": item["Header"]["CUSTOMER"], 
				"OWNER": item["Header"]["OWNER"],
				"TOTAL_INV": item["Header"]["TOTAL_INV"],
				"TOTAL_CM": item["Header"]["TOTAL_CM"]
			});
			/********** switchOff data **********/
			//table
			var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
			var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
			var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
			var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
			var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
			
			//bu总数total
			buOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
			
			//area highchart
			var areaArrINV = getAreaDataSwitchOff(item);
			
			buAreaSeriesINV.push(areaArrINV);
			
			
			/********** switchOn data **********/
			//table
			var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
			var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
			var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
			var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
			var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
			
			//bu总数total
			buOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
			
			//area highchart
			var areaArrCM = getAreaDataSwitchOn(item);
			
			buAreaSeriesCM.push(areaArrCM);
			
			
			/********** common column highchart **********/
			var columnArr = getColumnData(item);
			
			buColumnSeries.push(columnArr);
			
			
			/**************** append html ****************/
			if(switchState == false){
				var overdueDetailContent = '<li class="bu-data-list" id="buShowList' + i + '">' +
												'<ul>' +
													'<li>' +
														'<div>' +
															'<div class="font-style7">' +
																'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
															'</div>' +	
														'</div>' +
													'</li>' +
													'<li>' +
														'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalINV.toFixed(2)) + '</span>' +
													'</li>' +
													'<li>' +
														'<div id="buArea' + i + '"></div>' +
													'</li>' +
													'<li>' +
														'<img src="img/list_down.png" class="buSingleListBtn" id="buDetailBtn' + i + '" data-index="' + i + '" />' +
													'</li>' +
												'</ul>' +
											'</li>' +
											'<li class="bu-single-list" id="buHideList' + i + '">' +
												'<div>' +
													'<div class="font-style12">Total AR and Overdue Amount</div>' +
													'<div class="font-style13">' +
														'<span>Date:</span>' +
														'<span>' + startDate + '</span>' +
														'<span>-</span>' +
														'<span>' + endDate + '</span>' +
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
														'<div><span class="font-day-color">' + formatNumber(inv1.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(inv16.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(inv46.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(inv76.toFixed(2)) + '</span></div>' +
													'</div>' +
												'</div>' +
												'<div class="buColumnHc" id="buColumn' + i + '"></div>' +
											'</li>';
				
			}
			else{
				var overdueDetailContent = '<li class="bu-data-list" id="buShowList' + i + '">' +
												'<ul>' +
													'<li>' +
														'<div>' +
															'<div class="font-style7">' +
																'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
															'</div>' +	
														'</div>' +
													'</li>' +
													'<li>' +
														'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalCM.toFixed(2)) + '</span>' +
													'</li>' +
													'<li>' +
														'<div id="buArea' + i + '"></div>' +
													'</li>' +
													'<li>' +
														'<img src="img/list_down.png" class="buSingleListBtn" id="buDetailBtn' + i + '" data-index="' + i + '" />' +
													'</li>' +
												'</ul>' +
											'</li>' +
											'<li class="bu-single-list" id="buHideList' + i + '">' +
												'<div>' +
													'<div class="font-style12">Total AR and Overdue Amount</div>' +
													'<div class="font-style13">' +
														'<span>Date:</span>' +
														'<span>' + startDate + '</span>' +
														'<span>-</span>' +
														'<span>' + endDate + '</span>' +
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
														'<div><span class="font-day-color">' + formatNumber(cm1.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(cm16.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(cm46.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(cm76.toFixed(2)) + '</span></div>' +
													'</div>' +
												'</div>' +
												'<div class="buColumnHc" id="buColumn' + i + '"></div>' +
											'</li>';
					
			}
				
			$('.overdueDetail-bu').append(overdueDetailContent);
		
		});
		
		//BU total HTML
		setTotalHtml("bu", buOverdueDetailTotalINV, buOverdueDetailTotalCM);
	}
	else{
		otherBuOverdueDetail = [];
		for(var j in buOverdueDetail){
			if(buOverdueDetail[j]["Header"]["FACILITY"] == fac){
				otherBuOverdueDetail.push(buOverdueDetail[j]);
			}
		}
		
		if(otherBuOverdueDetail.length > 0){
			$.each(otherBuOverdueDetail, function(i, item) {
				//获取detail有几周数据
				var detailLength = item["Detail"].length;
				buCustomerArr.push({
					"CUSTOMER": item["Header"]["CUSTOMER"], 
					"OWNER": item["Header"]["OWNER"],
					"TOTAL_INV": item["Header"]["TOTAL_INV"],
					"TOTAL_CM": item["Header"]["TOTAL_CM"]
				});
				/********** switchOff data **********/
				//table
				var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
				var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
				var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
				var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
				var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
				
				//total number
				buOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
				
				//area highchart
				var areaArrINV = getAreaDataSwitchOff(item);
				
				buAreaSeriesINV.push(areaArrINV);
				
				
				/********** switchOn data **********/
				//table
				var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
				var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
				var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
				var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
				var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
				
				//total
				buOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
				
				//area highchart
				var areaArrCM = getAreaDataSwitchOn(item);
				
				buAreaSeriesCM.push(areaArrCM);
				
				
				/********** common column highchart **********/
				var columnArr = getColumnData(item);
				
				buColumnSeries.push(columnArr);
					
				
				/**************** append html ****************/
				if(switchState == false){
					var overdueDetailContent = '<li class="bu-data-list" id="buShowList' + i + '">' +
													'<ul>' +
														'<li>' +
															'<div>' +
																'<div class="font-style7">' +
																	'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
																'</div>' +	
															'</div>' +
														'</li>' +
														'<li>' +
															'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalINV.toFixed(2)) + '</span>' +
														'</li>' +
														'<li>' +
															'<div id="buArea' + i + '"></div>' +
														'</li>' +
														'<li>' +
															'<img src="img/list_down.png" class="buSingleListBtn" id="buDetailBtn' + i + '" data-index="' + i + '" />' +
														'</li>' +
													'</ul>' +
												'</li>' +
												'<li class="bu-single-list" id="buHideList' + i + '">' +
													'<div>' +
														'<div class="font-style12">Total AR and Overdue Amount</div>' +
														'<div class="font-style13">' +
															'<span>Date:</span>' +
															'<span>' + startDate + '</span>' +
															'<span>-</span>' +
															'<span>' + endDate + '</span>' +
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
															'<div><span class="font-day-color">' + formatNumber(inv1.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(inv16.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(inv46.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(inv76.toFixed(2)) + '</span></div>' +
														'</div>' +
													'</div>' +
													'<div class="buColumnHc" id="buColumn' + i + '"></div>' +
												'</li>';
					
				}
				else{
					var overdueDetailContent = '<li class="bu-data-list" id="buShowList' + i + '">' +
													'<ul>' +
														'<li>' +
															'<div>' +
																'<div class="font-style7">' +
																	'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
																'</div>' +	
															'</div>' +
														'</li>' +
														'<li>' +
															'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalCM.toFixed(2)) + '</span>' +
														'</li>' +
														'<li>' +
															'<div id="buArea' + i + '"></div>' +
														'</li>' +
														'<li>' +
															'<img src="img/list_down.png" class="buSingleListBtn" id="buDetailBtn' + i + '" data-index="' + i + '" />' +
														'</li>' +
													'</ul>' +
												'</li>' +
												'<li class="bu-single-list" id="buHideList' + i + '">' +
													'<div>' +
														'<div class="font-style12">Total AR and Overdue Amount</div>' +
														'<div class="font-style13">' +
															'<span>Date:</span>' +
															'<span>' + startDate + '</span>' +
															'<span>-</span>' +
															'<span>' + endDate + '</span>' +
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
															'<div><span class="font-day-color">' + formatNumber(cm1.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(cm16.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(cm46.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(cm76.toFixed(2)) + '</span></div>' +
														'</div>' +
													'</div>' +
													'<div class="buColumnHc" id="buColumn' + i + '"></div>' +
												'</li>';
						
				}
					
				$('.overdueDetail-bu').append(overdueDetailContent);
				
			});
			
			//BU total HTML
			setTotalHtml("bu", buOverdueDetailTotalINV, buOverdueDetailTotalCM);
		}
		else{
			$('.bu-header .priority-img').attr('src', 'img/priority_dis.png');
			$('.overdueDetail-bu').append(noneDataFourColumn);
			$('.overdueDetail-bu').append(noneDataFourTotal);
		}	
	}
	
	changeColorByNum();
}

function setCsdOverdueDetailData(fac){
	$('.overdueDetail-csd').html("");
	csdAreaSeriesINV = [];
	csdAreaSeriesCM = [];
	csdColumnSeries = [];
	csdCustomerArr = [];
	var csdOverdueDetailTotalINV = 0;
	var csdOverdueDetailTotalCM = 0;
	
	if(fac == "ALL"){
		$.each(csdOverdueDetail, function(i, item) {
			//获取detail有几周数据
			var detailLength = item["Detail"].length;
			csdCustomerArr.push({
				"CUSTOMER": item["Header"]["CUSTOMER"], 
				"OWNER": item["Header"]["OWNER"],
				"TOTAL_INV": item["Header"]["TOTAL_INV"],
				"TOTAL_CM": item["Header"]["TOTAL_CM"]
			});
			/********** switchOff data **********/
			//table
			var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
			var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
			var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
			var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
			var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
			
			//total number
			csdOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
			
			//area highchart
			var areaArrINV = getAreaDataSwitchOff(item);
			
			csdAreaSeriesINV.push(areaArrINV);
			
			
			/********** switchOn data **********/
			//table
			var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
			var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
			var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
			var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
			var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
			
			//total
			csdOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
			
			//area highchart
			var areaArrCM = getAreaDataSwitchOn(item);
			
			csdAreaSeriesCM.push(areaArrCM);
			
			
			/********** common column highchart **********/
			var columnArr = getColumnData(item);
			
			csdColumnSeries.push(columnArr);
			
			
			/**************** append html ****************/
			if(switchState == false){
				var overdueDetailContent = '<li class="csd-data-list" id="csdShowList' + i + '">' +
												'<ul>' +
													'<li>' +
														'<div>' +
															'<div class="font-style7">' +
																'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
															'</div>' +	
														'</div>' +
													'</li>' +
													'<li>' +
														'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalINV.toFixed(2)) + '</span>' +
													'</li>' +
													'<li>' +
														'<div id="csdArea' + i + '"></div>' +
													'</li>' +
													'<li>' +
														'<img src="img/list_down.png" class="csdSingleListBtn" id="csdDetailBtn' + i + '" data-index="' + i + '" />' +
													'</li>' +
												'</ul>' +
											'</li>' +
											'<li class="csd-single-list" id="csdHideList' + i + '">' +
												'<div>' +
													'<div class="font-style12">Total AR and Overdue Amount</div>' +
													'<div class="font-style13">' +
														'<span>Date:</span>' +
														'<span>' + startDate + '</span>' +
														'<span>-</span>' +
														'<span>' + endDate + '</span>' +
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
														'<div><span class="font-day-color">' + formatNumber(inv1.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(inv1.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(inv46.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(inv76.toFixed(2)) + '</span></div>' +
													'</div>' +
												'</div>' +
												'<div class="csdColumnHc" id="csdColumn' + i + '"></div>' +
											'</li>';
				
			}
			else{
				var overdueDetailContent = '<li class="csd-data-list" id="csdShowList' + i + '">' +
												'<ul>' +
													'<li>' +
														'<div>' +
															'<div class="font-style7">' +
																'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
															'</div>' +	
														'</div>' +
													'</li>' +
													'<li>' +
														'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalCM.toFixed(2)) + '</span>' +
													'</li>' +
													'<li>' +
														'<div id="csdArea' + i + '"></div>' +
													'</li>' +
													'<li>' +
														'<img src="img/list_down.png" class="csdSingleListBtn" id="csdDetailBtn' + i + '" data-index="' + i + '" />' +
													'</li>' +
												'</ul>' +
											'</li>' +
											'<li class="csd-single-list" id="csdHideList' + i + '">' +
												'<div>' +
													'<div class="font-style12">Total AR and Overdue Amount</div>' +
													'<div class="font-style13">' +
														'<span>Date:</span>' +
														'<span>' + startDate + '</span>' +
														'<span>-</span>' +
														'<span>' + endDate + '</span>' +
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
														'<div><span class="font-day-color">' + formatNumber(cm1.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(cm16.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(cm46.toFixed(2)) + '</span></div>' +
														'<div><span class="font-day-color">' + formatNumber(cm76.toFixed(2)) + '</span></div>' +
													'</div>' +
												'</div>' +
												'<div class="csdColumnHc" id="csdColumn' + i + '"></div>' +
											'</li>';
					
			}
			
			$('.overdueDetail-csd').append(overdueDetailContent);
			
		});
		
		//CSD total HTML
		setTotalHtml("csd", csdOverdueDetailTotalINV, csdOverdueDetailTotalCM);
	}
	else{
		otherCsdOverdueDetail = [];
		for(var j in csdOverdueDetail){
			if(csdOverdueDetail[j]["Header"]["FACILITY"] == fac){
				otherCsdOverdueDetail.push(csdOverdueDetail[j]);
			}
		}
		
		if(otherCsdOverdueDetail.length > 0){
			$.each(otherCsdOverdueDetail, function(i, item) {
				//获取detail有几周数据
				var detailLength = item["Detail"].length;
				csdCustomerArr.push({
					"CUSTOMER": item["Header"]["CUSTOMER"], 
					"OWNER": item["Header"]["OWNER"],
					"TOTAL_INV": item["Header"]["TOTAL_INV"],
					"TOTAL_CM": item["Header"]["TOTAL_CM"]
				});
				/********** switchOff data **********/
				//table
				var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
				var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
				var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
				var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
				var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
				
				//total number
				csdOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
				
				//area highchart
				var areaArrINV = getAreaDataSwitchOff(item);
				
				csdAreaSeriesINV.push(areaArrINV);
				
				
				/********** switchOn data **********/
				//table
				var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
				var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
				var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
				var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
				var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
				
				//total
				csdOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
				
				//area highchart
				var areaArrCM = getAreaDataSwitchOn(item);
				
				csdAreaSeriesCM.push(areaArrCM);
				
				
				/********** common column highchart **********/
				var columnArr = getColumnData(item);
				
				csdColumnSeries.push(columnArr);
				
				
				/**************** append html ****************/
				if(switchState == false){
					var overdueDetailContent = '<li class="csd-data-list" id="csdShowList' + i + '">' +
													'<ul>' +
														'<li>' +
															'<div>' +
																'<div class="font-style7">' +
																	'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
																'</div>' +	
															'</div>' +
														'</li>' +
														'<li>' +
															'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalINV.toFixed(2)) + '</span>' +
														'</li>' +
														'<li>' +
															'<div id="csdArea' + i + '"></div>' +
														'</li>' +
														'<li>' +
															'<img src="img/list_down.png" class="csdSingleListBtn" id="csdDetailBtn' + i + '" data-index="' + i + '" />' +
														'</li>' +
													'</ul>' +
												'</li>' +
												'<li class="csd-single-list" id="csdHideList' + i + '">' +
													'<div>' +
														'<div class="font-style12">Total AR and Overdue Amount</div>' +
														'<div class="font-style13">' +
															'<span>Date:</span>' +
															'<span>' + startDate + '</span>' +
															'<span>-</span>' +
															'<span>' + endDate + '</span>' +
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
															'<div><span class="font-day-color">' + formatNumber(inv1.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(inv16.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(inv46.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(inv76.toFixed(2)) + '</span></div>' +
														'</div>' +
													'</div>' +
													'<div class="csdColumnHc" id="csdColumn' + i + '"></div>' +
												'</li>';
					
				}
				else{
					var overdueDetailContent = '<li class="csd-data-list" id="csdShowList' + i + '">' +
													'<ul>' +
														'<li>' +
															'<div>' +
																'<div class="font-style7">' +
																	'<span>' + item["Header"]["CUSTOMER"] + '</span>' +
																'</div>' +	
															'</div>' +
														'</li>' +
														'<li>' +
															'<span class="font-style7 font-localString">' + formatNumber(overdueDetailTotalCM.toFixed(2)) + '</span>' +
														'</li>' +
														'<li>' +
															'<div id="csdArea' + i + '"></div>' +
														'</li>' +
														'<li>' +
															'<img src="img/list_down.png" class="csdSingleListBtn" id="csdDetailBtn' + i + '" data-index="' + i + '" />' +
														'</li>' +
													'</ul>' +
												'</li>' +
												'<li class="csd-single-list" id="csdHideList' + i + '">' +
													'<div>' +
														'<div class="font-style12">Total AR and Overdue Amount</div>' +
														'<div class="font-style13">' +
															'<span>Date:</span>' +
															'<span>' + startDate + '</span>' +
															'<span>-</span>' +
															'<span>' + endDate + '</span>' +
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
															'<div><span class="font-day-color">' + formatNumber(cm1.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(cm16.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(cm46.toFixed(2)) + '</span></div>' +
															'<div><span class="font-day-color">' + formatNumber(cm76.toFixed(2)) + '</span></div>' +
														'</div>' +
													'</div>' +
													'<div class="csdColumnHc" id="csdColumn' + i + '"></div>' +
												'</li>';
						
				}
				
				$('.overdueDetail-csd').append(overdueDetailContent);
			
			});
			
			//CSD total HTML
			setTotalHtml("csd", csdOverdueDetailTotalINV, csdOverdueDetailTotalCM);
			
		}
		else{
			$('.csd-header .priority-img').attr('src', 'img/priority_dis.png');
			$('.overdueDetail-csd').append(noneDataFourColumn);
			$('.overdueDetail-csd').append(noneDataFourTotal);
		}
	}
	
	changeColorByNum();
	
}



function getColumnData(arr){
	var columnSeries = [];
	
	var columnSeries1 = [];	
	for(var i = 0; i < timeAxis.length; i++){
		var found1 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries1.push(parseFloat(arr["Detail"][j]["OVER_1_15_INV"]));			
				found1 = true;
				break;
			}	
		}
		if(found1 == false){
			columnSeries1.push(0);
		}
	}
	
	var columnSeries2 = [];
	for(var i = 0; i < timeAxis.length; i++){
		var found2 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries2.push(parseFloat(arr["Detail"][j]["OVER_16_45_INV"]));
				found2 = true;
				break;
			}		
		}
		if(found2 == false){
			columnSeries2.push(0);
		}
	}
	
	var columnSeries3 = [];	
	for(var i = 0; i < timeAxis.length; i++){
		var found3 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries3.push(parseFloat(arr["Detail"][j]["OVER_46_75_INV"]));
				found3 = true;
				break;
			}
		}
		if(found3 == false){
			columnSeries3.push(0);
		}
	}
	
	var columnSeries4 = [];
	for(var i = 0; i < timeAxis.length; i++){
		var found4 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries4.push(parseFloat(arr["Detail"][j]["OVER_76_INV"]));
				found4 = true;
				break;
			}
		}
		if(found4 == false){
			columnSeries4.push(0);
		}
	}
	
	var columnSeries5 = [];	
	for(var i = 0; i < timeAxis.length; i++){
		var found5 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries5.push(parseFloat(arr["Detail"][j]["OVER_1_15_CM"]));
				found5 = true;
				break;
			}	
		}
		if(found5 == false){
			columnSeries5.push(0);
		}
	}
	
	var columnSeries6 = [];
	for(var i = 0; i < timeAxis.length; i++){
		var found6 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries6.push(parseFloat(arr["Detail"][j]["OVER_16_45_CM"]));
				found6 = true;
				break;
			}
		}
		if(found6 == false){
			columnSeries6.push(0);
		}
	}
	
	var columnSeries7 = [];
	for(var i = 0; i < timeAxis.length; i++){
		var found7 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries7.push(parseFloat(arr["Detail"][j]["OVER_46_75_CM"]));
				found7 = true;
				break;
			}
		}
		if(found7 == false){
			columnSeries7.push(0);
		}
	}
	
	var columnSeries8 = [];	
	for(var i = 0; i < timeAxis.length; i++){
		var found8 = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				columnSeries8.push(parseFloat(arr["Detail"][j]["OVER_76_CM"]));		
				found8 = true;
				break;
			}
		}
		if(found8 == false){
			columnSeries8.push(0);
		}
	}
	
	/*var column0 = parseFloat(arr["Detail"][0]["OVER_1_15_INV"]);
	var column1 = parseFloat(arr["Detail"][1]["OVER_1_15_INV"]);
	var column2 = parseFloat(arr["Detail"][2]["OVER_1_15_INV"]);
	var column3 = parseFloat(arr["Detail"][3]["OVER_1_15_INV"]);
	var column4 = parseFloat(arr["Detail"][4]["OVER_1_15_INV"]);
	var column5 = parseFloat(arr["Detail"][5]["OVER_1_15_INV"]);
	
	var column6 = parseFloat(arr["Detail"][0]["OVER_16_45_INV"]);
	var column7 = parseFloat(arr["Detail"][1]["OVER_16_45_INV"]);
	var column8 = parseFloat(arr["Detail"][2]["OVER_16_45_INV"]);
	var column9 = parseFloat(arr["Detail"][3]["OVER_16_45_INV"]);
	var column10 = parseFloat(arr["Detail"][4]["OVER_16_45_INV"]);
	var column11 = parseFloat(arr["Detail"][5]["OVER_16_45_INV"]);
	
	var column12 = parseFloat(arr["Detail"][0]["OVER_46_75_INV"]);
	var column13 = parseFloat(arr["Detail"][1]["OVER_46_75_INV"]);
	var column14 = parseFloat(arr["Detail"][2]["OVER_46_75_INV"]);
	var column15 = parseFloat(arr["Detail"][3]["OVER_46_75_INV"]);
	var column16 = parseFloat(arr["Detail"][4]["OVER_46_75_INV"]);
	var column17 = parseFloat(arr["Detail"][5]["OVER_46_75_INV"]);
	
	var column18 = parseFloat(arr["Detail"][0]["OVER_76_INV"]);
	var column19 = parseFloat(arr["Detail"][1]["OVER_76_INV"]);
	var column20 = parseFloat(arr["Detail"][2]["OVER_76_INV"]);
	var column21 = parseFloat(arr["Detail"][3]["OVER_76_INV"]);
	var column22 = parseFloat(arr["Detail"][4]["OVER_76_INV"]);
	var column23 = parseFloat(arr["Detail"][5]["OVER_76_INV"]);
	
	var columnCM0 = parseFloat(arr["Detail"][0]["OVER_1_15_CM"]);
	var columnCM1 = parseFloat(arr["Detail"][1]["OVER_1_15_CM"]);
	var columnCM2 = parseFloat(arr["Detail"][2]["OVER_1_15_CM"]);
	var columnCM3 = parseFloat(arr["Detail"][3]["OVER_1_15_CM"]);
	var columnCM4 = parseFloat(arr["Detail"][4]["OVER_1_15_CM"]);
	var columnCM5 = parseFloat(arr["Detail"][5]["OVER_1_15_CM"]);
	
	var columnCM6 = parseFloat(arr["Detail"][0]["OVER_16_45_CM"]);
	var columnCM7 = parseFloat(arr["Detail"][1]["OVER_16_45_CM"]);
	var columnCM8 = parseFloat(arr["Detail"][2]["OVER_16_45_CM"]);
	var columnCM9 = parseFloat(arr["Detail"][3]["OVER_16_45_CM"]);
	var columnCM10 = parseFloat(arr["Detail"][4]["OVER_16_45_CM"]);
	var columnCM11 = parseFloat(arr["Detail"][5]["OVER_16_45_CM"]);
	
	var columnCM12 = parseFloat(arr["Detail"][0]["OVER_46_75_CM"]);
	var columnCM13 = parseFloat(arr["Detail"][1]["OVER_46_75_CM"]);
	var columnCM14 = parseFloat(arr["Detail"][2]["OVER_46_75_CM"]);
	var columnCM15 = parseFloat(arr["Detail"][3]["OVER_46_75_CM"]);
	var columnCM16 = parseFloat(arr["Detail"][4]["OVER_46_75_CM"]);
	var columnCM17 = parseFloat(arr["Detail"][5]["OVER_46_75_CM"]);
	
	var columnCM18 = parseFloat(arr["Detail"][0]["OVER_76_CM"]);
	var columnCM19 = parseFloat(arr["Detail"][1]["OVER_76_CM"]);
	var columnCM20 = parseFloat(arr["Detail"][2]["OVER_76_CM"]);
	var columnCM21 = parseFloat(arr["Detail"][3]["OVER_76_CM"]);
	var columnCM22 = parseFloat(arr["Detail"][4]["OVER_76_CM"]);
	var columnCM23 = parseFloat(arr["Detail"][5]["OVER_76_CM"]);
	
	var columnSeries1 = [];
	columnSeries1.push(column0);
	columnSeries1.push(column1);
	columnSeries1.push(column2);
	columnSeries1.push(column3);
	columnSeries1.push(column4);
	columnSeries1.push(column5);
	
	var columnSeries2 = [];
	columnSeries2.push(column6);
	columnSeries2.push(column7);
	columnSeries2.push(column8);				
	columnSeries2.push(column9);				
	columnSeries2.push(column10);				
	columnSeries2.push(column11);
	
	var columnSeries3 = [];				
	columnSeries3.push(column12);				
	columnSeries3.push(column13);				
	columnSeries3.push(column14);				
	columnSeries3.push(column15);				
	columnSeries3.push(column16);				
	columnSeries3.push(column17);
	
	var columnSeries4 = [];				
	columnSeries4.push(column18);				
	columnSeries4.push(column19);				
	columnSeries4.push(column20);				
	columnSeries4.push(column21);				
	columnSeries4.push(column22);				
	columnSeries4.push(column23);
	
	var columnSeries5 = [];
	columnSeries5.push(columnCM0);
	columnSeries5.push(columnCM1);
	columnSeries5.push(columnCM2);
	columnSeries5.push(columnCM3);
	columnSeries5.push(columnCM4);
	columnSeries5.push(columnCM5);
	
	var columnSeries6 = [];
	columnSeries6.push(columnCM6);
	columnSeries6.push(columnCM7);
	columnSeries6.push(columnCM8);				
	columnSeries6.push(columnCM9);				
	columnSeries6.push(columnCM10);				
	columnSeries6.push(columnCM11);
	
	var columnSeries7 = [];				
	columnSeries7.push(columnCM12);				
	columnSeries7.push(columnCM13);				
	columnSeries7.push(columnCM14);				
	columnSeries7.push(columnCM15);				
	columnSeries7.push(columnCM16);				
	columnSeries7.push(columnCM17);
	
	var columnSeries8 = [];				
	columnSeries8.push(columnCM18);				
	columnSeries8.push(columnCM19);				
	columnSeries8.push(columnCM20);				
	columnSeries8.push(columnCM21);				
	columnSeries8.push(columnCM22);				
	columnSeries8.push(columnCM23);*/
	
	columnSeries.push(columnSeries1);
	columnSeries.push(columnSeries2);					
	columnSeries.push(columnSeries3);										
	columnSeries.push(columnSeries4);
	columnSeries.push(columnSeries5);
	columnSeries.push(columnSeries6);					
	columnSeries.push(columnSeries7);										
	columnSeries.push(columnSeries8);
	
	return columnSeries;
	
}

function getAreaDataSwitchOff(arr){
	var areaSeriesINV = [];
	
	for(var i = 0; i < timeAxis.length; i++){
		var found = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				areaSeriesINV.push(
					parseFloat(arr["Detail"][j]["OVER_1_15_INV"]) + parseFloat(arr["Detail"][j]["OVER_16_45_INV"]) +
		    		parseFloat(arr["Detail"][j]["OVER_46_75_INV"]) + parseFloat(arr["Detail"][j]["OVER_76_INV"])
				);
				found = true;
				break;
			}
		}
		if(found == false){
			areaSeriesINV.push(0);
		}	
	}
	
	return areaSeriesINV;
}

function getAreaDataSwitchOn(arr){
	var areaSeriesCM = [];
	
	for(var i = 0; i < 6; i++){
		var found = false;
		for(var j = 0; j < arr["Detail"].length; j++){
			if(timeAxis[i] == arr["Detail"][j]["WEEK"]){
				areaSeriesCM.push(
					parseFloat(arr["Detail"][j]["OVER_1_15_INV"]) + parseFloat(arr["Detail"][j]["OVER_16_45_INV"]) +
		    		parseFloat(arr["Detail"][j]["OVER_46_75_INV"]) + parseFloat(arr["Detail"][j]["OVER_76_INV"]) +
		    		parseFloat(arr["Detail"][j]["OVER_1_15_CM"]) + parseFloat(arr["Detail"][j]["OVER_16_45_CM"]) +
		    		parseFloat(arr["Detail"][j]["OVER_46_75_CM"]) + parseFloat(arr["Detail"][j]["OVER_76_CM"])
				);
				found = true;
				break;
			}			
		}
		if(found == false){
			areaSeriesCM.push(0);
		}
	}
	
	return areaSeriesCM;
}


function setBuAreaData() {	
	if(switchState == false){
		if(buAreaSeriesINV.length > buShowNum){
			for(var i = buPageStart; i < buPageEnd; i ++){
				var buArea = new Highcharts.Chart('buArea' + i, areaOption);
				buArea.series[0].setData(buAreaSeriesINV[i], false, false, false);
				buArea.redraw(false);
			}
		}
		else if(buAreaSeriesINV.length > 0 && buAreaSeriesINV.length <= buShowNum){
			for(var i = buPageStart; i < buAreaSeriesINV.length; i ++){
				var buArea = new Highcharts.Chart('buArea' + i, areaOption);
				buArea.series[0].setData(buAreaSeriesINV[i], false, false, false);
				buArea.redraw(false);
			}
		}	
	}
	else{
		if(buAreaSeriesCM.length > buShowNum){
			for(var i = buPageStart; i < buPageEnd; i ++){
				var buArea = new Highcharts.Chart('buArea' + i, areaOption);
				buArea.series[0].setData(buAreaSeriesCM[i], false, false, false);
				buArea.redraw(false);	
			}
		}
		else if(buAreaSeriesCM.length >0 && buAreaSeriesCM.length <= buShowNum){
			for(var i = buPageStart; i < buAreaSeriesCM.length; i ++){
				var buArea = new Highcharts.Chart('buArea' + i, areaOption);
				buArea.series[0].setData(buAreaSeriesCM[i], false, false, false);
				buArea.redraw(false);	
			}
		}
	}
}

function setCsdAreaData(){
	if(switchState == false){
		if(csdAreaSeriesINV.length > csdShowNum){
			for(var i = csdPageStart; i < csdPageEnd; i ++){
				var csdArea = new Highcharts.Chart('csdArea' + i, areaOption);
				csdArea.series[0].setData(csdAreaSeriesINV[i], false, false, false);
				csdArea.redraw(false);
			}
		}
		else if(csdAreaSeriesINV.length > 0 && csdAreaSeriesINV.length <= csdShowNum){
			for(var i = csdPageStart; i < csdAreaSeriesINV.length; i ++){
				var csdArea = new Highcharts.Chart('csdArea' + i, areaOption);
				csdArea.series[0].setData(csdAreaSeriesINV[i], false, false, false);
				csdArea.redraw(false);
			}
		}	
	}
	else{
		if(csdAreaSeriesCM.length > csdShowNum){
			for(var i = csdPageStart; i < csdPageEnd; i ++){
				var csdArea = new Highcharts.Chart('csdArea' + i, areaOption);
				csdArea.series[0].setData(csdAreaSeriesCM[i], false, false, false);
				csdArea.redraw(false);
			}
		}
		else if(csdAreaSeriesCM.length > 0 && csdAreaSeriesCM.length <= csdShowNum){
			for(var i = csdPageStart; i < csdAreaSeriesCM.length; i ++){
				var csdArea = new Highcharts.Chart('csdArea' + i, areaOption);
				csdArea.series[0].setData(csdAreaSeriesCM[i], false, false, false);
				csdArea.redraw(false);
			}
		}
	}
}

function setSingleColumnData(i, type) {
	if(type == 'bu'){
		if(switchState == false){
			var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
			buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
			buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
			buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
			buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
			buColumn.update({
				tooltip: {
					formatter: function () {
				        var s = '<b>' + this.x + '</b><br/><b>' + buCustomerArr[i]["CUSTOMER"] +
				        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
				        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
				        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
				        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
				        return s;
				    }
				}
			});
			buColumn.redraw(false);
		}
		else{
			var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
			buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
			buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
			buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
			buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
			buColumn.addSeries({
				name: '1-15 Days',
		        color: '#81B4E1',
		        data: buColumnSeries[i][4]
			}, false, false, false);
			buColumn.addSeries({
				name: '16-45 Days',
		        color: '#F79620',
		        data: buColumnSeries[i][5]
			}, false, false, false);
			buColumn.addSeries({
				name: '46-75 Days',
		        color: '#F36D21',
		        data: buColumnSeries[i][6]
			}, false, false, false);
			buColumn.addSeries({
				name: 'Over 75 Days',
		        color: '#ED3824',
		        data: buColumnSeries[i][7]
			}, false, false, false);
			buColumn.update({
				tooltip: {
					formatter: function () {
				        var s = '<b>' + this.x + '</b><br/><b>' + buCustomerArr[i]["CUSTOMER"] +
				        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
				        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
				        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
				        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
				        return s;
				    }
				}
			});
			buColumn.redraw(false);
		}
		
	}
	else{
		if(switchState == false){
			var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
			csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
			csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
			csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
			csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
			csdColumn.update({
				tooltip: {
					formatter: function () {
				        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomerArr[i]["CUSTOMER"] +
				        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
				        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
				        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
				        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
				        return s;
				    }
				}
			});
			csdColumn.redraw(false);
		}
		else{
			var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
			csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
			csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
			csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
			csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
			csdColumn.addSeries({
				name: '1-15 Days',
		        color: '#81B4E1',
		        data: csdColumnSeries[i][4]
			}, false, false, false);
			csdColumn.addSeries({
				name: '16-45 Days',
		        color: '#F79620',
		        data: csdColumnSeries[i][5]
			}, false, false, false);
			csdColumn.addSeries({
				name: '46-75 Days',
		        color: '#F36D21',
		        data: csdColumnSeries[i][6]
			}, false, false, false);
			csdColumn.addSeries({
				name: 'Over 75 Days',
		        color: '#ED3824',
		        data: csdColumnSeries[i][7]
			}, false, false, false);
			csdColumn.update({
				tooltip: {
					formatter: function () {
				        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomerArr[i]["CUSTOMER"] +
				        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
				        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
				        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
				        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
				        return s;
				    }
				}
			});
			csdColumn.redraw(false);
			
		}
		
	}	
}

function setAllColumnData(type){
	if(type == 'bu'){
		$('.buColumnHc').html("");
		if(switchState == false){
			for(var i = 0 ; i < buColumnSeries.length; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.redraw(false);
			}
		}
		else{
			for(var i = 0 ; i < buColumnSeries.length; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: buColumnSeries[i][4]
				}, false, false, false);
				buColumn.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: buColumnSeries[i][5]
				}, false, false, false);
				buColumn.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: buColumnSeries[i][6]
				}, false, false, false);
				buColumn.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: buColumnSeries[i][7]
				}, false, false, false);
				buColumn.redraw(false);
			}
		}
	}
	else{
		$('.csdColumnHc').html("");
		if(switchState == false){
			for(var i = 0 ; i < csdColumnSeries.length; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.redraw(false);
			}
		}
		else{
			for(var i = 0 ; i < csdColumnSeries.length; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: csdColumnSeries[i][4]
				}, false, false, false);
				csdColumn.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: csdColumnSeries[i][5]
				}, false, false, false);
				csdColumn.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: csdColumnSeries[i][6]
				}, false, false, false);
				csdColumn.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: csdColumnSeries[i][7]
				}, false, false, false);
				csdColumn.redraw(false);
			}
		}
	}
}

function setBuPartOfColumnData(){
	if(switchState == false){
		if(buColumnSeries.length > buColumnShow){
			for(var i = buColumnPageStart; i < buColumnPageEnd; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
				buColumn.redraw(false);
			}
		}
		else if(buColumnSeries.length > 0 && buColumnSeries.length <= buColumnPageEnd){
			for(var i = buColumnPageStart; i < buColumnSeries.length; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
				buColumn.redraw(false);
			}
		}
	}
	else{
		if(buColumnSeries.length > buColumnShow){
			for(var i = buColumnPageStart; i < buColumnPageEnd; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: buColumnSeries[i][4]
				}, false, false, false);
				buColumn.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: buColumnSeries[i][5]
				}, false, false, false);
				buColumn.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: buColumnSeries[i][6]
				}, false, false, false);
				buColumn.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: buColumnSeries[i][7]
				}, false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
				buColumn.redraw(false);
			}
		}
		else if(buColumnSeries.length > 0 && buColumnSeries.length <= buColumnPageEnd){
			for(var i = buColumnPageStart; i < buColumnSeries.length; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: buColumnSeries[i][4]
				}, false, false, false);
				buColumn.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: buColumnSeries[i][5]
				}, false, false, false);
				buColumn.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: buColumnSeries[i][6]
				}, false, false, false);
				buColumn.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: buColumnSeries[i][7]
				}, false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
				buColumn.redraw(false);
			}
		}
	}
}

function setCsdPartOfColumnData(){
	if(switchState == false){
		if(csdColumnSeries.length > csdColumnShow){
			for(var i = csdColumnPageStart; i < csdColumnPageEnd; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
				csdColumn.redraw(false);
			}
		}
		else if(csdColumnSeries.length > 0 && csdColumnSeries.length <= csdColumnPageEnd){
			for(var i = csdColumnPageStart; i < csdColumnSeries.length; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
				csdColumn.redraw(false);
			}
		}
	}
	else{
		if(csdColumnSeries.length > csdColumnShow){
			for(var i = csdColumnPageStart; i < csdColumnPageEnd; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: csdColumnSeries[i][4]
				}, false, false, false);
				csdColumn.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: csdColumnSeries[i][5]
				}, false, false, false);
				csdColumn.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: csdColumnSeries[i][6]
				}, false, false, false);
				csdColumn.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: csdColumnSeries[i][7]
				}, false, false, false);
				csdColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
				csdColumn.redraw(false);
			}
		}
		else if(csdColumnSeries.length > 0 && csdColumnSeries.length <= csdColumnPageEnd){
			for(var i = csdColumnPageStart; i < csdColumnSeries.length; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.addSeries({
					name: '1-15 Days',
			        color: '#81B4E1',
			        data: csdColumnSeries[i][4]
				}, false, false, false);
				csdColumn.addSeries({
					name: '16-45 Days',
			        color: '#F79620',
			        data: csdColumnSeries[i][5]
				}, false, false, false);
				csdColumn.addSeries({
					name: '46-75 Days',
			        color: '#F36D21',
			        data: csdColumnSeries[i][6]
				}, false, false, false);
				csdColumn.addSeries({
					name: 'Over 75 Days',
			        color: '#ED3824',
			        data: csdColumnSeries[i][7]
				}, false, false, false);
				csdColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomerArr[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
				csdColumn.redraw(false);
			}
		}
	}
}


function setTotalHtml(type, inv, cm){
	if(type == "bu"){
		if(switchState == false){
			var buOverdueDetailContentTotal = '<li class="bu-data-list">' +
											'<ul>' +
												'<li>' +
													'<div style="text-align: left;text-indent: 1.5VW;">' +
														'<div class="font-style7">' +
															'<span>Total</span>' +
														'</div>' +	
													'</div>' +
												'</li>' +
												'<li>' +
													'<span class="font-style7 font-localString">' + formatNumber(inv.toFixed(2)) + '</span>' +
												'</li>' +
												'<li>' +
													'<div id="buArea"></div>' +
												'</li>' +
												'<li>' +
												'</li>' +
											'</ul>' +
										'</li>';
		}
		else{
			var buOverdueDetailContentTotal = '<li class="bu-data-list">' +
											'<ul>' +
												'<li>' +
													'<div style="text-align: left;text-indent: 1.5VW;">' +
														'<div class="font-style7">' +
															'<span>Total</span>' +
														'</div>' +	
													'</div>' +
												'</li>' +
												'<li>' +
													'<span class="font-style7 font-localString">' + formatNumber(cm.toFixed(2)) + '</span>' +
												'</li>' +
												'<li>' +
													'<div id="buArea"></div>' +
												'</li>' +
												'<li>' +
												'</li>' +
											'</ul>' +
										'</li>';
		}
		$('.overdueDetail-bu').append(buOverdueDetailContentTotal);
	}
	else if(type == "csd"){
		if(switchState == false){
			var csdOverdueDetailContentTotal = '<li class="csd-data-list">' +
											'<ul>' +
												'<li>' +
													'<div style="text-align: left;text-indent: 1.5VW;">' +
														'<div class="font-style7">' +
															'<span>Total</span>' +
														'</div>' +	
													'</div>' +
												'</li>' +
												'<li>' +
													'<span class="font-style7 font-localString">' + formatNumber(inv.toFixed(2)) + '</span>' +
												'</li>' +
												'<li>' +
													'<div id="csdArea"></div>' +
												'</li>' +
												'<li>' +
												'</li>' +
											'</ul>' +
										'</li>';
		}
		else{
			var csdOverdueDetailContentTotal = '<li class="csd-data-list">' +
											'<ul>' +
												'<li>' +
													'<div style="text-align: left;text-indent: 1.5VW;">' +
														'<div class="font-style7">' +
															'<span>Total</span>' +
														'</div>' +	
													'</div>' +
												'</li>' +
												'<li>' +
													'<span class="font-style7 font-localString">' + formatNumber(cm.toFixed(2)) + '</span>' +
												'</li>' +
												'<li>' +
													'<div id="csdArea"></div>' +
												'</li>' +
												'<li>' +
												'</li>' +
											'</ul>' +
										'</li>';
		}
		$('.overdueDetail-csd').append(csdOverdueDetailContentTotal);
	}
	
}

function getOverdueSoonData(fac){
	buOutstand = [];
	csdOutstand = [];
	
	if(fac == "ALL"){
		for(var i in outstandDetailCallBackData){
			if(outstandDetailCallBackData[i]["TYPE"] == "BU"){
				buOutstand.push(outstandDetailCallBackData[i]);
			}
			else if(outstandDetailCallBackData[i]["TYPE"] == "CSD"){
				csdOutstand.push(outstandDetailCallBackData[i]);
			}
		}
	}
	else{
		for(var i in outstandDetailCallBackData){
			if(outstandDetailCallBackData[i]["TYPE"] == "BU" && outstandDetailCallBackData[i]["FACILITY"] == fac){
				buOutstand.push(outstandDetailCallBackData[i]);
			}
			else if(outstandDetailCallBackData[i]["TYPE"] == "CSD" && outstandDetailCallBackData[i]["FACILITY"] == fac){
				csdOutstand.push(outstandDetailCallBackData[i]);
			}
		}
	}
	
	//默认按Total降序排序
	buOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
	csdOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
	
}

function setOverdueSoonData(){
	buOutstandDetailTotal = 0;
	csdOutstandDetailTotal = 0;
	$('.overduesoon-bu').html("");
	$('.overduesoon-csd').html("");
	
	if(buOutstand.length > 0){
		$('.overduesoon-bu-header .bu-customer .priority-img').attr('src', 'img/priority_up.png');
		$('.overduesoon-bu-header .bu-totaloverdue .priority-img').attr('src', 'img/priority_down.png');
		for(var i in buOutstand){
			var buOutstandDetailContent = '<li class="data-list-overduesoon">' +
											'<div>' +
												'<div class="font-style7">' +
													'<span>' + buOutstand[i]["CUSTOMER"] + '</span>' +
												'</div>' +
											'</div>' +
											'<div class="font-style7">' +
												'<span>' + formatNumber(parseFloat(buOutstand[i]["DUE_SOON_INV"]).toFixed(2)) + '</span>' +
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
													'<span>' + formatNumber(buOutstandDetailTotal.toFixed(2)) + '</span>' +
												'</div>' +
											'</li>';
		
		$('.overduesoon-bu').append(buOutstandDetailContentTotal);
	}
	else{
		$('.overduesoon-bu-header .priority-img').attr('src', 'img/priority_dis.png');
		$('.overduesoon-bu').append(noneDataTwoColumn);
		$('.overduesoon-bu').append(noneDataTwoTotal);
	}
	
	if(csdOutstand.length > 0){
		$('.overduesoon-csd-header .csd-customer .priority-img').attr('src', 'img/priority_up.png');
		$('.overduesoon-csd-header .csd-totaloverdue .priority-img').attr('src', 'img/priority_down.png');
		for(var i in csdOutstand){
			var csdOutstandDetailContent = '<li class="data-list-overduesoon">' +
											'<div>' +
												'<div class="font-style7">' +
													'<span>' + csdOutstand[i]["CUSTOMER"] + '</span>' +
												'</div>' +
											'</div>' +
											'<div class="font-style7">' +
												'<span>' + formatNumber(parseFloat(csdOutstand[i]["DUE_SOON_INV"]).toFixed(2)) + '</span>' +
											'</div>' +
										'</li>';
			$('.overduesoon-csd').append(csdOutstandDetailContent);
			
			csdOutstandDetailTotal += parseFloat(csdOutstand[i]["DUE_SOON_INV"]);
		}
		
		var csdOutstandDetailContentTotal = '<li class="overduesoon-total">' +
												'<div class="font-style7">' +
													'<span>Total</span>' +
												'</div>' +
												'<div class="font-style7">' +
													'<span>' + formatNumber(csdOutstandDetailTotal.toFixed(2)) + '</span>' +
												'</div>' +
											'</li>';
		
		$('.overduesoon-csd').append(csdOutstandDetailContentTotal);
	}
	else{
		$('.overduesoon-csd-header .priority-img').attr('src', 'img/priority_dis.png');
		$('.overduesoon-csd').append(noneDataTwoColumn);
		$('.overduesoon-csd').append(noneDataTwoTotal);
	}
	
}

function getExpiredSoonData(fac) {
	expiredSoon = [];
	
	if(fac == "ALL"){
		for(var i in creditExpiredSoonCallBackData){
			expiredSoon.push(creditExpiredSoonCallBackData[i]);
		}	
	}
	else{
		for(var i in creditExpiredSoonCallBackData){
			if(creditExpiredSoonCallBackData[i]["FACILITY"] == fac){
				expiredSoon.push(creditExpiredSoonCallBackData[i]);
			}
		}
	}
	
	//console.log(expiredSoon);
}

function setExpiredSoonData(){
	$('.expiredsoon').html("");
	
	if(expiredSoon.length > 0){
		$('.expiredsoon-bu-header .priority-img').attr('src', 'img/priority_up.png');
		for(var i in expiredSoon) {
			var expiredSoonContent = '<li class="data-list-expiredsoon">' +
										'<div>' +
											'<div class="font-style7">' +
												'<span>' + expiredSoon[i]["CUSTOMER"] + '</span>' +
											'</div>' +
										'</div>' +
										'<div class="font-style7">' +
											'<span>' + expiredSoon[i]["EXPIRED_DATE"] + '</span>' +
										'</div>' +
										'<div class="font-style7">' +
											'<span>' + formatNumber(parseFloat(expiredSoon[i]["CREDIT_LIIMIT"]).toFixed(2)) + '</span>' +
										'</div>' +
									'</li>';
			
			$('.expiredsoon').append(expiredSoonContent);	
		}
	}
	else{
		$('.expiredsoon-bu-header .priority-img').attr('src', 'img/priority_dis.png');
		$('.expiredsoon').append(noneDataThreeColumn);
	}
}

function changePageInitViewDetail(){
	$("label[for=viewDetail-tab-1]").addClass('ui-btn-active');
    $("label[for=viewDetail-tab-2]").removeClass('ui-btn-active');
    $("label[for=viewDetail-tab-3]").removeClass('ui-btn-active');
    
	$('#memoBtn').attr('src', 'img/switch_g.png');
	$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    $('.buSingleListBtn').attr('src', 'img/list_down.png');
    $('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    $('.csdSingleListBtn').attr('src', 'img/list_down.png');
    $('.bu-single-list').hide();
    $('.csd-single-list').hide();
    
    $('#overdueSoon').hide();
	$('#expiredSoon').hide();
	$('#overdue').show();
	
	facility = "ALL";
    $(".Facility #" + facility).parent('.scrollmenu').find('.hover').removeClass('hover');
    $(".Facility #ALL").removeClass('disableHover');
    $(".Facility #ALL").addClass('hover');
}


/*****************************************************************/
$('#viewDetail').pagecontainer({
	create: function (event, ui) {
		
		window.OverdueDetail = function() {
			if(localStorage.getItem("overdueDetailData") === null){
				this.successCallback = function(data) {
					overdueDetailCallBackData = data["Content"];
					getOverdueDetailData();
					loadingMask("hide");
					
					localStorage.setItem("overdueDetailData", JSON.stringify([data, nowTime]));				
				};
				
				
				this.failCallback = function(data) {
					console.log("api misconnected");
				};
				
				var _construct = function(){
					CustomAPI("POST", true, "OverdueDetail", self.successCallback, self.failCallback, OverdueDetailQueryData, "");
				}();
				
			}
			else{
				overdueDetailData = JSON.parse(localStorage.getItem("overdueDetailData"))[0];
				overdueDetailCallBackData = overdueDetailData["Content"];
				getOverdueDetailData();
				loadingMask("hide");
				
				var lastTime = JSON.parse(localStorage.getItem("overdueDetailData"))[1];
				if (checkDataExpired(lastTime, expiredTime, 'dd')) {
                    localStorage.removeItem("overdueDetailData");
                    OverdueDetail();
                }
				
			}
			
		};
		
		window.OutstandDetail = function() {
			if(localStorage.getItem("outstandDetailData") === null){
				this.successCallback = function(data) {
					outstandDetailCallBackData = data["Content"];
					getOverdueSoonData(facility);
					
					localStorage.setItem("outstandDetailData", JSON.stringify([data, nowTime]));
				};
				
				this.failCallback = function(data) {
					console.log("api misconnected");
				};
				
				var _construct = function(){
					CustomAPI("POST", true, "OutstandDetail", self.successCallback, self.failCallback, OutstandDetailQueryData, "");
				}();
			}
			else{
				outstandDetailData = JSON.parse(localStorage.getItem("outstandDetailData"))[0];
				outstandDetailCallBackData = outstandDetailData["Content"];
				getOverdueSoonData(facility);
				
				var lastTime = JSON.parse(localStorage.getItem("outstandDetailData"))[1];
				if (checkDataExpired(lastTime, expiredTime, 'dd')) {
                    localStorage.removeItem("outstandDetailData");
                    OutstandDetail();
                }
			}
			
		};
		
		window.CreditExpiredSoon = function() {
			if(localStorage.getItem("creditExpiredSoonData") === null){
				this.successCallback = function(data) {
					creditExpiredSoonCallBackData = data["Content"];
					getExpiredSoonData(facility);
					
					localStorage.setItem("creditExpiredSoonData", JSON.stringify([data, nowTime]));
				};
				
				this.failCallback = function(data) {
					console.log("api misconnected");
				};
				
				var _construct = function(){
					CustomAPI("POST", true, "CreditExpiredSoon", self.successCallback, self.failCallback, CreditExpiredSoonQueryData, "");
				}();
			}
			else{
				creditExpiredSoonData = JSON.parse(localStorage.getItem("creditExpiredSoonData"))[0];
				creditExpiredSoonCallBackData = creditExpiredSoonData["Content"];
				getExpiredSoonData(facility);
				
				var lastTime = JSON.parse(localStorage.getItem("creditExpiredSoonData"))[1];
				if (checkDataExpired(lastTime, expiredTime, 'dd')) {
                    localStorage.removeItem("creditExpiredSoonData");
                    CreditExpiredSoon();
                }
			}
			
		};
		
		
		
		/********************************** page event *************************************/	
		$("#viewDetail").on("pagebeforeshow", function(event, ui){
			/* global PullToRefresh */
			
			
			
		});
		
		$('#viewDetail').on('pageshow', function(event, ui){
			if(viewDetailInit == false) {
				//设置BU数据
				setBuOverdueDetailData(facility);
				setBuAreaData();
				buSingleListBtn();
				//页面初始化
				changePageInitViewDetail();
				//API
				OutstandDetail();
				CreditExpiredSoon();
				//改变颜色
				changeColorByNum();
				viewDetailInit = true;
				//test
				console.log(overdueDetailCallBackData);
				console.log(buColumnSeries);
				//console.log(timeAxis);
			}
			loadingMask("hide");
			
			if(csdDataInit == false){
				setTimeout(function(){
					//设置CSD数据
					setCsdOverdueDetailData(facility);
					csdSingleListBtn();
				}, 300);
				csdDataInit = true;
			}
			
			
		});
		
		$(".page-tabs #viewDetail-tab-1").on("click", function(){
			$('#overdueSoon').hide();
			$('#expiredSoon').hide();
			$('#overdue').show();
			viewDetailTab = "overdue";
		});
		
		$(".page-tabs #viewDetail-tab-2").on("click", function(){
			if(overdueSoonInit == false){
				setOverdueSoonData();
				overdueSoonInit = true;
			}
			$('#overdue').hide();
			$('#expiredSoon').hide();
			$('#overdueSoon').show()
			viewDetailTab = "overdueSoon";
		});
		
		$(".page-tabs #viewDetail-tab-3").on("click", function(){
			if(expiredSoonInit == false){
				setExpiredSoonData();
				expiredSoonInit = true;
			}
			$('#overdue').hide();
			$('#overdueSoon').hide();
			$('#expiredSoon').show();
			viewDetailTab = "expiredSoon";
		});
		
		// scroll menu on click
        $(document).on('click', '#viewDetail .Facility > a', function(e) {
            e.preventDefault();
            facility = $(this).context.id;
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
			facilityInit = true;
			/*//切换facility时回到顶部,防止数据过多,返回到中间,数据不显示
			$('body,html').animate({scrollTop:0},300);*/
			
			buCountNum = 1;
			buPageEnd = buShowNum * buCountNum;
			buPageStart = buPageEnd - buShowNum;
			csdCountNum = 1;
			csdPageEnd = csdShowNum * csdCountNum;
			csdPageStart = csdPageEnd - csdShowNum;
			buColumnCount = 1;
			buColumnPageEnd = buColumnShow * buColumnCount;
			buColumnPageStart = buColumnPageEnd - buColumnShow;
			csdColumnCount = 1;
			csdColumnPageEnd = csdColumnShow * csdColumnCount;
			csdColumnPageStart = csdColumnPageEnd - csdColumnShow;
			
			setBuOverdueDetailData(facility);
			setBuAreaData();
			setBuPartOfColumnData();
			buSingleListBtn();
			setCsdOverdueDetailData(facility);
			setCsdAreaData();
			setCsdPartOfColumnData();
			csdSingleListBtn();
			
			overdueInit = false;
			
			getOverdueSoonData(facility);
			setOverdueSoonData();
			overdueSoonInit = false;
			
			getExpiredSoonData(facility);
			setExpiredSoonData();
			expiredSoonInit = false;
			
			buArrIndex = null;
    		csdArrIndex = null;
			buColumnCheckAll = false;
    		csdColumnCheckAll = false;
    		$('#buAllListBtn').attr('src', 'img/all_list_down.png');
    		$('#csdAllListBtn').attr('src', 'img/all_list_down.png');
    		
    		changeColorByNum();
    		
    		
        });
		
	}
});


