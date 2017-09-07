/********************/
var viewDetailTab = "overdue";
var viewDetailInit = false;
var csdDataInit = false;
var overdueInit = false;
var overdueSoonInit = false;
var expiredSoonInit = false;
var facilityInit = false;
var customerName;
//get BU & CSD series
var companySeriesInit = [10, 20, 30, 40, 50, 60];
var columnDataInit = [0, 0, 0, 0, 0, 0];
var companyName = ['66558 东森电视股份有限公司', '67326 飞利浦股份有限公司', '69410 AAAA股份有限公司'];
var startDate, endDate;
var buColumnCheckAll = false;
var csdColumnCheckAll = false;
var buOutstandDetailTotal = 0;
var csdOutstandDetailTotal = 0;
var buTotalINV = [];
var buTotalCM = [];
var csdTotalINV = [];
var csdTotalCM = [];
var timeAxis = [];
var otherBuOverdueDetail = [];
var otherCsdOverdueDetail = [];
var buCustomer = [];
var csdCustomer = [];
var buAreaSeriesINV = [];
var buAreaSeriesCM = [];
var buColumnSeries = []
var csdAreaSeriesINV = [];
var csdAreaSeriesCM = [];
var csdColumnSeries = [];
var overdueDetailData = {};
var outstandDetailData = {};
var creditExpiredSoonData = {};
var buOverdueArr = [];
var csdOverdueArr = [];
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
        data: companySeriesInit
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
        data: columnDataInit
    }, {
        name: '16-45 Days',
        color: '#F79620',
        data: columnDataInit
    }, {
        name: '46-75 Days',
        color: '#F36D21',
        data: columnDataInit
    }, {
        name: 'Over 75 Days',
        color: '#ED3824',
        data: columnDataInit
    }]	
};

function changeSeriesBySwitch(){
	if(switchState == true){
		chartColumnLandscape.addSeries({
			name: '1-15 Days',
	        color: '#81B4E1',
	        data: columnDataInit
		}, false, false, false);
		chartColumnLandscape.addSeries({
			name: '16-45 Days',
	        color: '#F79620',
	        data: columnDataInit
		}, false, false, false);
		chartColumnLandscape.addSeries({
			name: '46-75 Days',
	        color: '#F36D21',
	        data: columnDataInit
		}, false, false, false);
		chartColumnLandscape.addSeries({
			name: 'Over 75 Days',
	        color: '#ED3824',
	        data: columnDataInit
		}, false, false, false);
	}
	//删除series,由8组变为4组
	else{
		for(var i = 0; i < 4; i++){
			chartColumnLandscape.series[4].remove();
		}
	}
}


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
							text: buCustomer[buArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + buCustomer[buArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[buArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
						        return s;
						    }
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
							text: buCustomer[buArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + buCustomer[buArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[buArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
						        return s;
						    }
						}
					});
					chartColumnLandscape.redraw(false);
				}
				
			}
			else{
				if(facility == "ALL"){
					chartColumnLandscape.series[0].setData(buColumnSeries[buArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(buColumnSeries[buArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(buColumnSeries[buArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(buColumnSeries[buArrIndex][3], false, false, false);
					chartColumnLandscape.series[4].setData(buColumnSeries[buArrIndex][4], false, false, false);
					chartColumnLandscape.series[5].setData(buColumnSeries[buArrIndex][5], false, false, false);
					chartColumnLandscape.series[6].setData(buColumnSeries[buArrIndex][6], false, false, false);
					chartColumnLandscape.series[7].setData(buColumnSeries[buArrIndex][7], false, false, false);	
					chartColumnLandscape.update({
						chart: {
							marginTop: 90
						},
						title: {
							text: 'Overdue Trend in Last 6 weeks',
							style: {
								fontWidth: 'bold'
							}
						},
						subtitle: {
							text: buCustomer[buArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + buCustomer[buArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[buArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
						        return s;
						    }
						}
					});
					chartColumnLandscape.redraw(false);
					
				}
				else{
					chartColumnLandscape.series[0].setData(buColumnSeries[buArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(buColumnSeries[buArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(buColumnSeries[buArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(buColumnSeries[buArrIndex][3], false, false, false);
					chartColumnLandscape.series[4].setData(buColumnSeries[buArrIndex][4], false, false, false);
					chartColumnLandscape.series[5].setData(buColumnSeries[buArrIndex][5], false, false, false);
					chartColumnLandscape.series[6].setData(buColumnSeries[buArrIndex][6], false, false, false);
					chartColumnLandscape.series[7].setData(buColumnSeries[buArrIndex][7], false, false, false);
					chartColumnLandscape.update({
						chart: {
							marginTop: 90
						},
						title: {
							text: 'Overdue Trend in Last 6 weeks',
							style: {
								fontWidth: 'bold'
							}
						},
						subtitle: {
							text: buCustomer[buArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + buCustomer[buArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[buArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
						        return s;
						    }
						}
					});
					chartColumnLandscape.redraw(false);
				}
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
							text: csdCustomer[csdArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + csdCustomer[csdArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[csdArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
						        return s;
						    }
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
							text: csdCustomer[csdArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + csdCustomer[csdArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[csdArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
						        return s;
						    }
						}
					});
					chartColumnLandscape.redraw(false);
				}	
			}
			else{
				if(facility == "ALL"){
					chartColumnLandscape.series[0].setData(csdColumnSeries[csdArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(csdColumnSeries[csdArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(csdColumnSeries[csdArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(csdColumnSeries[csdArrIndex][3], false, false, false);
					chartColumnLandscape.series[4].setData(csdColumnSeries[csdArrIndex][4], false, false, false);
					chartColumnLandscape.series[5].setData(csdColumnSeries[csdArrIndex][5], false, false, false);
					chartColumnLandscape.series[6].setData(csdColumnSeries[csdArrIndex][6], false, false, false);
					chartColumnLandscape.series[7].setData(csdColumnSeries[csdArrIndex][7], false, false, false);
					chartColumnLandscape.update({
						chart: {
							marginTop: 90
						},
						title: {
							text: 'Overdue Trend in Last 6 weeks',
							style: {
								fontWidth: 'bold'
							}
						},
						subtitle: {
							text: csdCustomer[csdArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + csdCustomer[csdArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[csdArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
						        return s;
						    }
						}
					});
					chartColumnLandscape.redraw(false);
				}
				else{
					chartColumnLandscape.series[0].setData(csdColumnSeries[csdArrIndex][0], false, false, false);
					chartColumnLandscape.series[1].setData(csdColumnSeries[csdArrIndex][1], false, false, false);
					chartColumnLandscape.series[2].setData(csdColumnSeries[csdArrIndex][2], false, false, false);
					chartColumnLandscape.series[3].setData(csdColumnSeries[csdArrIndex][3], false, false, false);
					chartColumnLandscape.series[4].setData(csdColumnSeries[csdArrIndex][4], false, false, false);
					chartColumnLandscape.series[5].setData(csdColumnSeries[csdArrIndex][5], false, false, false);
					chartColumnLandscape.series[6].setData(csdColumnSeries[csdArrIndex][6], false, false, false);
					chartColumnLandscape.series[7].setData(csdColumnSeries[csdArrIndex][7], false, false, false);
					chartColumnLandscape.update({
						chart: {
							marginTop: 90
						},
						title: {
							text: 'Overdue Trend in Last 6 weeks',
							style: {
								fontWidth: 'bold'
							}
						},
						subtitle: {
							text: csdCustomer[csdArrIndex]["CUSTOMER"] + '<br>' + 'Owner:' + csdCustomer[csdArrIndex]["OWNER"] + ' ' +  'Date:' + startDate + '-' + endDate
						},
						tooltip: {
							formatter: function () {
						        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[csdArrIndex]["CUSTOMER"] +
						        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
						        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
						        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
						        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
						        return s;
						    }
						}
					});
					chartColumnLandscape.redraw(false);
				}
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
			if(facility == "ALL"){
				buOverdueDetail[index]["Header"]["SPREAD"] = 1;
			}
			else{
				otherBuOverdueDetail[index]["Header"]["SPREAD"] = 1;
			}
			buArrIndex = index;
			buIndexMarginTop = $('#buShowList'+buArrIndex).offset().top;
			
			setSingleColumnData(index, 'bu');
			
			
		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
			self.parent().parent().parent().css('border-bottom', '1px solid #D6D6D6');
			if(facility == "ALL"){
				buOverdueDetail[index]["Header"]["SPREAD"] = 0;
			}
			else{
				otherBuOverdueDetail[index]["Header"]["SPREAD"] = 0;
			}
			buArrIndex = null;
			
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
			if(facility == "ALL"){
				csdOverdueDetail[index]["Header"]["SPREAD"] = 1;
			}
			else{
				otherCsdOverdueDetail[index]["Header"]["SPREAD"] = 1;
			}
			csdArrIndex = index;
			csdIndexMarginTop = $('#csdShowList'+csdArrIndex).offset().top;
			
			setSingleColumnData(index, 'csd');
			
			
		}else{
			self.attr('src', 'img/list_down.png');
			self.parent().parent().parent().next().hide();
			self.parent().parent().parent().css('border-bottom', '1px solid #D6D6D6');
			if(facility == "ALL"){
				csdOverdueDetail[index]["Header"]["SPREAD"] = 0;
			}
			else{
				otherCsdOverdueDetail[index]["Header"]["SPREAD"] = 0;
			}
			csdArrIndex = null;
			
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
	timeAxis.splice(0, timeAxis.length);
	buOverdueDetail = [];
	csdOverdueDetail = [];
	
	//get week timeAxis
	for(var i in overdueDetailCallBackData){
		if(overdueDetailCallBackData[i]["Detail"] !== null){
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
	}
	//get startDate and endDate
	startDate = startDay.substring(5, 10);
	endDate = endDay.substring(5, 10);
	
	$.each(overdueDetailCallBackData, function(i, item) {
		for(var j = 0; j < araUserAuthorityCallBackData.length; j++){
			if(item["Header"]["FACILITY"] == araUserAuthorityCallBackData[j]["FACILITY"]){
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
												 
				for(var k in item["Detail"]){
					item["Detail"][k]["TOTAL_INV"] = Number(item["Detail"][k]["OVER_1_15_INV"]) +
													Number(item["Detail"][k]["OVER_16_45_INV"]) +
													Number(item["Detail"][k]["OVER_46_75_INV"]) +
													Number(item["Detail"][k]["OVER_76_INV"]);
					item["Detail"][k]["TOTAL_CM"] = Number(item["Detail"][k]["OVER_1_15_INV"]) +
													Number(item["Detail"][k]["OVER_16_45_INV"]) +
													Number(item["Detail"][k]["OVER_46_75_INV"]) +
													Number(item["Detail"][k]["OVER_76_INV"]) +
													Number(item["Detail"][k]["OVER_1_15_CM"]) +
													Number(item["Detail"][k]["OVER_16_45_CM"]) +
													Number(item["Detail"][k]["OVER_46_75_CM"]) +
													Number(item["Detail"][k]["OVER_76_CM"]);
				}
				
				if(item["Header"]["TYPE"] == "BU"){
					buOverdueDetail.push(item);
				}
				else{
					csdOverdueDetail.push(item);
				}
			}
		}
	});
	
	
	//默认按total降序排序
	buOverdueDetail.sort(compareLargeOverdue("Header", "TOTAL_INV"));
	csdOverdueDetail.sort(compareLargeOverdue("Header", "TOTAL_INV"));
	
}

//review by alan
function setBuOverdueDetailData(fac){
	$('.overdueDetail-bu').html("");
	buAreaSeriesINV = [];
	buAreaSeriesCM = [];
	buColumnSeries = [];
	buCustomer = [];
	var buOverdueDetailTotalINV = 0;
	var buOverdueDetailTotalCM = 0;
	
	if(fac == "ALL"){
		$.each(buOverdueDetail, function(i, item) {
			//获取detail有几周数据
			var detailLength = item["Detail"].length;
			//获取横屏图表相关信息
			buCustomer.push({
				"CUSTOMER": item["Header"]["CUSTOMER"], 
				"OWNER": item["Header"]["OWNER"],
				"TOTAL_INV": item["Header"]["TOTAL_INV"],
				"TOTAL_CM": item["Header"]["TOTAL_CM"]
			});
			/********** switchOff data **********/
			//table
			for(var k in item["Detail"]){
				var foundSwitchOff = false;
				for(var j in timeAxis){
					if(item["Detail"][k]["WEEK"] == timeAxis[j]){
						var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
						var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
						var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
						var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
						foundSwitchOff = true;
						break;
					}
				}
				if(foundSwitchOff == false){
					var inv1 = parseFloat("0");
					var inv16 = parseFloat("0");
					var inv46 = parseFloat("0");
					var inv76 = parseFloat("0");
				}
			}
			var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
			
			//bu总数total-inv
			buOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
			
			//area-inv hc
			var areaArrINV = getAreaDataSwitchOff(item);
			buAreaSeriesINV.push(areaArrINV);
			
			
			/********** switchOn data **********/
			//table
			for(var k in item["Detail"]){
				var foundSwitchOn = false;
				for(var j in timeAxis){
					if(item["Detail"][k]["WEEK"] == timeAxis[j]){
						var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
						var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
						var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
						var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
						foundSwitchOn = true;
						break;
					}
				}
				if(foundSwitchOn == false){
					var cm1 = parseFloat("0");
					var cm16 = parseFloat("0");
					var cm46 = parseFloat("0");
					var cm76 = parseFloat("0");
				}
			}
			var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
			
			//bu总数total-cm
			buOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
			
			//area-cm hc
			var areaArrCM = getAreaDataSwitchOn(item);
			buAreaSeriesCM.push(areaArrCM);

			//column-hc
			var columnArr = getColumnData(item);
			buColumnSeries.push(columnArr);
			
			
			/**************** append html ****************/
			if(switchState == false){
				if(overdueDetailTotalINV !== 0){
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
												'<li class="bu-single-list" data-bu="show" id="buHideList' + i + '">' +
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
					var overdueDetailContent = '<li class="bu-data-list overdue-list-hide" id="buShowList' + i + '">' +
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
												'<li class="bu-single-list" data-bu="hide" id="buHideList' + i + '">' +
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
				
				
			}
			else if(switchState == true){
				if(overdueDetailTotalCM !== 0){
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
												'<li class="bu-single-list" data-bu="show" id="buHideList' + i + '">' +
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
				else{
					var overdueDetailContent = '<li class="bu-data-list overdue-list-hide" id="buShowList' + i + '">' +
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
												'<li class="bu-single-list" data-bu="hide" id="buHideList' + i + '">' +
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
			$('#buTitle').text("BU Overdue A/R");
			$('.bu-main').show();
			$('.bu-header').show();
			$.each(otherBuOverdueDetail, function(i, item) {
				//获取detail有几周数据
				var detailLength = item["Detail"].length;
				//获取横屏图表相关信息
				buCustomer.push({
					"CUSTOMER": item["Header"]["CUSTOMER"], 
					"OWNER": item["Header"]["OWNER"],
					"TOTAL_INV": item["Header"]["TOTAL_INV"],
					"TOTAL_CM": item["Header"]["TOTAL_CM"]
				});
				/********** switchOff data **********/
				//table
				for(var k in item["Detail"]){
					var foundSwitchOff = false;
					for(var j in timeAxis){
						if(item["Detail"][k]["WEEK"] == timeAxis[j]){
							var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
							var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
							var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
							var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
							foundSwitchOff = true;
							break;
						}
					}
					if(foundSwitchOff == false){
						var inv1 = parseFloat("0");
						var inv16 = parseFloat("0");
						var inv46 = parseFloat("0");
						var inv76 = parseFloat("0");
					}
				}
				var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
				
				//total-inv
				buOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
				
				//area hc	
				var areaArrINV = getAreaDataSwitchOff(item);
				buAreaSeriesINV.push(areaArrINV);
				
				
				/********** switchOn data **********/
				//table
				for(var k in item["Detail"]){
					var foundSwitchOn = false;
					for(var j in timeAxis){
						if(item["Detail"][k]["WEEK"] == timeAxis[j]){
							var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
							var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
							var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
							var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
							foundSwitchOn = true;
							break;
						}
					}
					if(foundSwitchOn == false){
						var cm1 = parseFloat("0");
						var cm16 = parseFloat("0");
						var cm46 = parseFloat("0");
						var cm76 = parseFloat("0");
					}
				}
				var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
				
				//total-cm
				buOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
				
				//area highchart
				var areaArrCM = getAreaDataSwitchOn(item);
				buAreaSeriesCM.push(areaArrCM);
				
				
				//column-hc
				var columnArr = getColumnData(item);
				buColumnSeries.push(columnArr);
				
				/**************** append html ****************/
				if(switchState == false){
					if(overdueDetailTotalINV !== 0){
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
													'<li class="bu-single-list" data-bu="show" id="buHideList' + i + '">' +
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
						var overdueDetailContent = '<li class="bu-data-list overdue-list-hide" id="buShowList' + i + '">' +
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
													'<li class="bu-single-list" data-bu="hide" id="buHideList' + i + '">' +
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
												
				}
				else if(switchState == true){
					if(overdueDetailTotalCM !== 0){
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
													'<li class="bu-single-list" data-bu="show" id="buHideList' + i + '">' +
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
					else{
						var overdueDetailContent = '<li class="bu-data-list overdue-list-hide" id="buShowList' + i + '">' +
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
													'<li class="bu-single-list" data-bu="hide" id="buHideList' + i + '">' +
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
													
				}
				
				$('.overdueDetail-bu').append(overdueDetailContent);
					
			});
			
			//BU total HTML
			setTotalHtml("bu", buOverdueDetailTotalINV, buOverdueDetailTotalCM);
		}
		else if(otherBuOverdueDetail.length == 0){
			$('#buTitle').text("No BU Overdue A/R Exists.");
			$('.bu-main').hide();
			$('.bu-header').hide();
		}	
	}
	
	changeColorByNum();
}

function setCsdOverdueDetailData(fac){
	$('.overdueDetail-csd').html("");
	csdAreaSeriesINV = [];
	csdAreaSeriesCM = [];
	csdColumnSeries = [];
	csdCustomer = [];
	var csdOverdueDetailTotalINV = 0;
	var csdOverdueDetailTotalCM = 0;
	
	if(fac == "ALL"){
		$.each(csdOverdueDetail, function(i, item) {
			//获取detail有几周数据
			var detailLength = item["Detail"].length;
			//获取横屏图表数据
			csdCustomer.push({
				"CUSTOMER": item["Header"]["CUSTOMER"], 
				"OWNER": item["Header"]["OWNER"],
				"TOTAL_INV": item["Header"]["TOTAL_INV"],
				"TOTAL_CM": item["Header"]["TOTAL_CM"]
			});
			/********** switchOff data **********/
			//table
			for(var k in item["Detail"]){
				var foundSwitchOff = false;
				for(var j in timeAxis){
					if(item["Detail"][k]["WEEK"] == timeAxis[j]){
						var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
						var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
						var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
						var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
						foundSwitchOff = true;
						break;
					}
				}
				if(foundSwitchOff == false){
					var inv1 = parseFloat("0");
					var inv16 = parseFloat("0");
					var inv46 = parseFloat("0");
					var inv76 = parseFloat("0");
				}
			}
			var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
			
			//total-inv
			csdOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
			
			//area hc	
			var areaArrINV = getAreaDataSwitchOff(item);
			csdAreaSeriesINV.push(areaArrINV);
			
			
			/********** switchOn data **********/
			//table
			for(var k in item["Detail"]){
				var foundSwitchOn = false;
				for(var j in timeAxis){
					if(item["Detail"][k]["WEEK"] == timeAxis[j]){
						var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
						var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
						var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
						var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
						foundSwitchOn = true;
						break;
					}
				}
				if(foundSwitchOn == false){
					var cm1 = parseFloat("0");
					var cm16 = parseFloat("0");
					var cm46 = parseFloat("0");
					var cm76 = parseFloat("0");
				}
			}		
			var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
			
			//total-cm
			csdOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
			
			//area highchart	
			var areaArrCM = getAreaDataSwitchOn(item);
			csdAreaSeriesCM.push(areaArrCM);
			
			//column hc			
			var columnArr = getColumnData(item);
			csdColumnSeries.push(columnArr);
			
			
			/**************** append html ****************/
			if(switchState == false){
				if(overdueDetailTotalINV !== 0){
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
												'<li class="csd-single-list" data-csd="show" id="csdHideList' + i + '">' +
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
					var overdueDetailContent = '<li class="csd-data-list overdue-list-hide" id="csdShowList' + i + '">' +
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
												'<li class="csd-single-list" data-csd="hide" id="csdHideList' + i + '">' +
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
				
				
			}
			else if(switchState == true){
				if(overdueDetailTotalCM !== 0){
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
												'<li class="csd-single-list" data-csd="show" id="csdHideList' + i + '">' +
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
				else{
					var overdueDetailContent = '<li class="csd-data-list overdue-list-hide" id="csdShowList' + i + '">' +
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
												'<li class="csd-single-list" data-csd="hide" id="csdHideList' + i + '">' +
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
			$('#csdTitle').text("CSD Overdue A/R");
			$('.csd-main').show();
			$('.csd-header').show();
			$.each(otherCsdOverdueDetail, function(i, item) {
				//获取detail有几周数据
				var detailLength = item["Detail"].length;
				//获取横屏图表数据
				csdCustomer.push({
					"CUSTOMER": item["Header"]["CUSTOMER"], 
					"OWNER": item["Header"]["OWNER"],
					"TOTAL_INV": item["Header"]["TOTAL_INV"],
					"TOTAL_CM": item["Header"]["TOTAL_CM"]
				});
				/********** switchOff data **********/
				//table
				for(var k in item["Detail"]){
					var foundSwitchOff = false;
					for(var j in timeAxis){
						if(item["Detail"][k]["WEEK"] == timeAxis[j]){
							var inv1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]);
							var inv16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]);
							var inv46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]);
							var inv76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]);
							foundSwitchOff = true;
							break;
						}
					}
					if(foundSwitchOff == false){
						var inv1 = parseFloat("0");
						var inv16 = parseFloat("0");
						var inv46 = parseFloat("0");
						var inv76 = parseFloat("0");
					}
				}
				var overdueDetailTotalINV = inv1 + inv16 + inv46 + inv76;
				
				//total number
				csdOverdueDetailTotalINV += parseFloat(overdueDetailTotalINV);
				
				//area hc		
				var areaArrINV = getAreaDataSwitchOff(item);
				csdAreaSeriesINV.push(areaArrINV);
				
				
				/********** switchOn data **********/
				//table
				for(var k in item["Detail"]){
					var foundSwitchOn = false;
					for(var j in timeAxis){
						if(item["Detail"][k]["WEEK"] == timeAxis[j]){
							var cm1 = parseFloat(item["Detail"][detailLength-1]["OVER_1_15_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_1_15_CM"]);
							var cm16 = parseFloat(item["Detail"][detailLength-1]["OVER_16_45_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_16_45_CM"]);
							var cm46 = parseFloat(item["Detail"][detailLength-1]["OVER_46_75_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_46_75_CM"]);
							var cm76 = parseFloat(item["Detail"][detailLength-1]["OVER_76_INV"]) + parseFloat(item["Detail"][detailLength-1]["OVER_76_CM"]);
							foundSwitchOn = true;
							break;
						}
					}
					if(foundSwitchOn == false){
						var cm1 = parseFloat("0");
						var cm16 = parseFloat("0");
						var cm46 = parseFloat("0");
						var cm76 = parseFloat("0");
					}
				}
				var overdueDetailTotalCM = cm1 + cm16 + cm46 + cm76;
				
				//total
				csdOverdueDetailTotalCM += parseFloat(overdueDetailTotalCM);
				
				//area highchart		
				var areaArrCM = getAreaDataSwitchOn(item);
				csdAreaSeriesCM.push(areaArrCM);
				
				//column hc			
				var columnArr = getColumnData(item);
				csdColumnSeries.push(columnArr);
				
				
				/**************** append html ****************/
				if(switchState == false){
					if(overdueDetailTotalINV !== 0){
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
													'<li class="csd-single-list" data-csd="show" id="csdHideList' + i + '">' +
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
						var overdueDetailContent = '<li class="csd-data-list overdue-list-hide" id="csdShowList' + i + '">' +
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
													'<li class="csd-single-list" data-csd="hide" id="csdHideList' + i + '">' +
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
												
					
				}
				else if(switchState == true){
					if(overdueDetailTotalCM !== 0){
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
													'<li class="csd-single-list" data-csd="show" id="csdHideList' + i + '">' +
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
					else{
						var overdueDetailContent = '<li class="csd-data-list overdue-list-hide" id="csdShowList' + i + '">' +
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
													'<li class="csd-single-list" data-csd="hide" id="csdHideList' + i + '">' +
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
													
				}
				
				$('.overdueDetail-csd').append(overdueDetailContent);
					
			});
			
			//CSD total HTML
			setTotalHtml("csd", csdOverdueDetailTotalINV, csdOverdueDetailTotalCM);
			
		}
		else if(otherCsdOverdueDetail.length == 0){
			$('#csdTitle').text("No CSD Overdue A/R Exists.");
			$('.csd-main').hide();
			$('.csd-header').hide();
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

//review by alan
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
				        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[i]["CUSTOMER"] +
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
				        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[i]["CUSTOMER"] +
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
				        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[i]["CUSTOMER"] +
				        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
				        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
				        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
				        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
				        return s;
				    }
				}
			});
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
				        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[i]["CUSTOMER"] +
				        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
				        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
				        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
				        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
				        return s;
				    }
				}
			});
			
		}
		
	}	
}


function setBuPartOfColumnData(){
	if(switchState == false){
		if(buColumnSeries.length > buColumnShow){
			for(var i = buColumnPageStart; i < buColumnPageEnd; i ++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				customerName = buCustomer[i]["CUSTOMER"];
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + customerName +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
		else if(buColumnSeries.length > 0 && buColumnSeries.length <= buColumnShow){
			for(var i = buColumnPageStart; i < buColumnSeries.length; i++){
				var buColumn = new Highcharts.Chart('buColumn' + i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
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
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
		else if(buColumnSeries.length > 0 && buColumnSeries.length <= buColumnShow){
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
					        var s = '<b>' + this.x + '</b><br/><b>' + buCustomer[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
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
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[i]["CUSTOMER"] +
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
		else if(csdColumnSeries.length > 0 && csdColumnSeries.length <= csdColumnShow){
			for(var i = csdColumnPageStart; i < csdColumnSeries.length; i++){
				var csdColumn = new Highcharts.Chart('csdColumn' + i, columnOption);
				csdColumn.series[0].setData(csdColumnSeries[i][0], false, false, false);
				csdColumn.series[1].setData(csdColumnSeries[i][1], false, false, false);
				csdColumn.series[2].setData(csdColumnSeries[i][2], false, false, false);
				csdColumn.series[3].setData(csdColumnSeries[i][3], false, false, false);
				csdColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
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
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
		else if(csdColumnSeries.length > 0 && csdColumnSeries.length <= csdColumnShow){
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
					        var s = '<b>' + this.x + '</b><br/><b>' + csdCustomer[i]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
	}
}

function setAllBuColumnData() {
	if(facility == "ALL"){
		if(switchState == false){
			for(var i in buOverdueDetail){
				var buColumn = new Highcharts.Chart('buColumn'+i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + buOverdueDetail[i]["Header"]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
		else{
			for(var i in buOverdueDetail){
				var buColumn = new Highcharts.Chart('buColumn'+i, columnOption);
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
					        var s = '<b>' + this.x + '</b><br/><b>' + buOverdueDetail[i]["Header"]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
			}
			
		}
		
	}
	else{
		if(switchState == false){
			for(var i in otherBuOverdueDetail){
				var buColumn = new Highcharts.Chart('buColumn'+i, columnOption);
				buColumn.series[0].setData(buColumnSeries[i][0], false, false, false);
				buColumn.series[1].setData(buColumnSeries[i][1], false, false, false);
				buColumn.series[2].setData(buColumnSeries[i][2], false, false, false);
				buColumn.series[3].setData(buColumnSeries[i][3], false, false, false);
				buColumn.update({
					tooltip: {
						formatter: function () {
					        var s = '<b>' + this.x + '</b><br/><b>' + otherBuOverdueDetail[i]["Header"]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber(this.points[0].y.toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber(this.points[1].y.toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber(this.points[2].y.toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber(this.points[3].y.toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
		else{
			for(var i in otherBuOverdueDetail){
				var buColumn = new Highcharts.Chart('buColumn'+i, columnOption);
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
					        var s = '<b>' + this.x + '</b><br/><b>' + otherBuOverdueDetail[i]["Header"]["CUSTOMER"] +
					        		'</b><br/>1-15 Days:USD$' + formatNumber((this.points[0].y + this.points[4].y).toFixed(2)) +
					        	 	'<br/>16-45 Days:USD$' + formatNumber((this.points[1].y + this.points[5].y).toFixed(2)) +
					        	 	'<br/>46-75 Days:USD$' + formatNumber((this.points[2].y + this.points[6].y).toFixed(2)) +
					        	 	'<br/>Over 75 Days:USD$' + formatNumber((this.points[3].y + this.points[7].y).toFixed(2));
					        return s;
					    }
					}
				});
			}
		}
	}
}


function setTotalHtml(type, inv, cm){
	if(type == "bu"){
		if(switchState == false){
			if(inv !== 0){
				var buOverdueDetailContentTotal = '<li class="bu-data-list bu-overdue-total">' +
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
				$('.overdueDetail-bu').prepend(buOverdueDetailContentTotal);
				
				//total area hc
				/*var buArea = new Highcharts.Chart('buArea', areaOption);
				buArea.series[0].setData(buTotalINV, true, true, false);
				buArea.redraw();*/
			}
			else{
				$('#buTitle').text("No BU Overdue A/R Exists.");
				$('.bu-main').hide();
				$('.bu-header').hide();
			}
		}
		else{
			if(cm !== 0){
				var buOverdueDetailContentTotal = '<li class="bu-data-list bu-overdue-total">' +
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
				$('.overdueDetail-bu').prepend(buOverdueDetailContentTotal);
				
				//total area hc
				/*var buArea = new Highcharts.Chart('buArea', areaOption);
				buArea.series[0].setData(buTotalCM, true, true, false);
				buArea.redraw();*/
				
			}
			else{
				$('#buTitle').text("No BU Overdue A/R Exists.");
				$('.bu-main').hide();
				$('.bu-header').hide();
			}	
		}		
	}
	else if(type == "csd"){
		if(switchState == false){
			if(inv !== 0){
				var csdOverdueDetailContentTotal = '<li class="csd-data-list csd-overdue-total">' +
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
				$('.overdueDetail-csd').prepend(csdOverdueDetailContentTotal);
				
				//total area hc
				/*var csdArea = new Highcharts.Chart('csdArea', areaOption);
				csdArea.series[0].setData(csdTotalINV, true, true, false);
				csdArea.redraw();*/
				
			}
			else{
				$('#csdTitle').text("No CSD Overdue A/R Exists.");
				$('.csd-main').hide();
				$('.csd-header').hide();
			}
			
		}
		else{
			if(cm !== 0){
				var csdOverdueDetailContentTotal = '<li class="csd-data-list csd-overdue-total">' +
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
				$('.overdueDetail-csd').prepend(csdOverdueDetailContentTotal);
				
				//total area hc
				/*var csdArea = new Highcharts.Chart('csdArea', areaOption);
				csdArea.series[0].setData(csdTotalCM, true, true, false);
				csdArea.redraw();*/
				
			}
			else{
				$('#csdTitle').text("No CSD Overdue A/R Exists.");
				$('.csd-main').hide();
				$('.csd-header').hide();
			}
		}	
	}
	
}

function getOverdueSoonData(fac){
	buOutstand = [];
	csdOutstand = [];
	
	if(fac == "ALL"){
		for(var i in outstandDetailCallBackData){
			for(var j in araUserAuthorityCallBackData){
				if(outstandDetailCallBackData[i]["FACILITY"] == araUserAuthorityCallBackData[j]["FACILITY"]){
					if(outstandDetailCallBackData[i]["TYPE"] == "BU"){
						buOutstand.push(outstandDetailCallBackData[i]);
					}
					else if(outstandDetailCallBackData[i]["TYPE"] == "CSD"){
						csdOutstand.push(outstandDetailCallBackData[i]);
					}
				}
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

function setBuOverdueSoonData(){
	buOutstandDetailTotal = 0;
	$('.overduesoon-bu').html("");
	
	if(buOutstand.length > 0){
		for(var i in buOutstand){
			var total = Number(buOutstand[i]["DUE_SOON_INV"]);
			if(total !== 0){
				var buOutstandDetailContent = '<li class="data-list-overduesoon">' +
											'<div>' +
												'<div class="font-style7">' +
													'<span>' + buOutstand[i]["CUSTOMER"] + '</span>' +
												'</div>' +
											'</div>' +
											'<div class="font-style7 font-color-blue">' +
												'<span>' + formatNumber(parseFloat(buOutstand[i]["DUE_SOON_INV"]).toFixed(2)) + '</span>' +
											'</div>' +
										'</li>';
				$('.overduesoon-bu').append(buOutstandDetailContent);
				
			}
			
			buOutstandDetailTotal +=  parseFloat(buOutstand[i]["DUE_SOON_INV"]);
			
		}
		
		if(buOutstandDetailTotal !== 0){
			$('#buOutstand').text("BU Outstanding A/R");
			$('.overduesoon-bu-header').show();
			$('.overduesoon-bu-main').show();
			
			var buOutstandDetailContentTotal = '<li class="overduesoon-total">' +
												'<div class="font-style7">' +
													'<span>Total</span>' +
												'</div>' +
												'<div class="font-style7 font-color-blue">' +
													'<span>' + formatNumber(buOutstandDetailTotal.toFixed(2)) + '</span>' +
												'</div>' +
											'</li>';
		
			$('.overduesoon-bu').prepend(buOutstandDetailContentTotal);
		}
		else{
			$('#buOutstand').text("No BU Outstanding A/R Exists.");
			$('.overduesoon-bu-header').hide();
			$('.overduesoon-bu-main').hide();
		}
	}
	else{
		$('#buOutstand').text("No BU Outstanding A/R Exists.");
		$('.overduesoon-bu-header').hide();
		$('.overduesoon-bu-main').hide();

	}
}

function setCsdOverdueSoonData(){
	csdOutstandDetailTotal = 0;
	$('.overduesoon-csd').html("");
	
	if(csdOutstand.length > 0){
		for(var i in csdOutstand){
			var total = Number(csdOutstand[i]["DUE_SOON_INV"]);
			if(total !== 0){
				var csdOutstandDetailContent = '<li class="data-list-overduesoon">' +
											'<div>' +
												'<div class="font-style7">' +
													'<span>' + csdOutstand[i]["CUSTOMER"] + '</span>' +
												'</div>' +
											'</div>' +
											'<div class="font-style7 font-color-blue">' +
												'<span>' + formatNumber(parseFloat(csdOutstand[i]["DUE_SOON_INV"]).toFixed(2)) + '</span>' +
											'</div>' +
										'</li>';
				$('.overduesoon-csd').append(csdOutstandDetailContent);
				
			}
						
			csdOutstandDetailTotal += parseFloat(csdOutstand[i]["DUE_SOON_INV"]);
			
		}
		
		if(csdOutstandDetailTotal !== 0){
			$('#csdOutstand').text("CSD Outstanding A/R");
			$('.overduesoon-csd-header').show();
			$('.overduesoon-csd-main').show();
			
			var csdOutstandDetailContentTotal = '<li class="overduesoon-total">' +
												'<div class="font-style7">' +
													'<span>Total</span>' +
												'</div>' +
												'<div class="font-style7 font-color-blue">' +
													'<span>' + formatNumber(csdOutstandDetailTotal.toFixed(2)) + '</span>' +
												'</div>' +
											'</li>';
		
			$('.overduesoon-csd').prepend(csdOutstandDetailContentTotal);
		}
		else{
			$('#csdOutstand').text("No CSD Outstanding A/R Exists.");
			$('.overduesoon-csd-header').hide();
			$('.overduesoon-csd-main').hide();
		}
		
	}
	else{
		$('#csdOutstand').text("No CSD Outstanding A/R Exists.");
		$('.overduesoon-csd-header').hide();
		$('.overduesoon-csd-main').hide();

	}
}


function getExpiredSoonData(fac) {
	expiredSoon = [];
	
	if(fac == "ALL"){
		for(var i in creditExpiredSoonCallBackData){
			for(var j in araUserAuthorityCallBackData){
				if(creditExpiredSoonCallBackData[i]["FACILITY"] ==araUserAuthorityCallBackData[j]["FACILITY"]){
					expiredSoon.push(creditExpiredSoonCallBackData[i]);
				}
			}
		}	
	}
	else{
		for(var i in creditExpiredSoonCallBackData){
			if(creditExpiredSoonCallBackData[i]["FACILITY"] == fac){
				expiredSoon.push(creditExpiredSoonCallBackData[i]);
			}
		}
	}
	
	//默认按day升序排序
	expiredSoon.sort(compareSmallOverdueSoon("EXPIRED_DATE"));
}

function setExpiredSoonData(){
	$('.expiredsoon').html("");
	
	if(expiredSoon.length > 0){
		$('#creditExpired').text("Expired Soon");
		$('.expiredsoon-bu-header').show();
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
		$('#creditExpired').text("No Credit Expired Soon.");
		$('.expiredsoon-bu-header').hide();
	}
}

function getBuTotalSeriesByWeek(){
	buTotalINV = [];
	buTotalCM = [];
	var weekTotalINV0 = 0;
	var weekTotalCM0 = 0;
	var weekTotalINV1 = 0;
	var weekTotalCM1 = 0;
	var weekTotalINV2 = 0;
	var weekTotalCM2 = 0;
	var weekTotalINV3 = 0;
	var weekTotalCM3 = 0;
	var weekTotalINV4 = 0;
	var weekTotalCM4 = 0;
	var weekTotalINV5 = 0;
	var weekTotalCM5 = 0;
	var weekINV0 = 0;
	var weekCM0 = 0;
	var weekINV1 = 0;
	var weekCM1 = 0;
	var weekINV2 = 0;
	var weekCM2 = 0;
	var weekINV3 = 0;
	var weekCM3 = 0;
	var weekINV4 = 0;
	var weekCM4 = 0;
	var weekINV5 = 0;
	var weekCM5 = 0;
	for(var i in otherBuOverdueDetail){
		for(var j in otherBuOverdueDetail[i]["Detail"]){
			if(otherBuOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[0]){
				weekINV0 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM0 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV0 = 0;
				weekCM0 = 0;
			}
			
			if(otherBuOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[1]){
				weekINV1 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM1 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV1 = 0;
				weekCM1 = 0;
			}
			
			if(otherBuOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[2]){
				weekINV2 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM2 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV2 = 0;
				weekCM2 = 0;
			}
			
			if(otherBuOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[3]){
				weekINV3 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM3 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV3 = 0;
				weekCM3 = 0;
			}
			
			if(otherBuOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[4]){
				weekINV4 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM4 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV4 = 0;
				weekCM4 = 0;
			}
			
			if(otherBuOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[5]){
				weekINV5 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM5 = Number(otherBuOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV5 = 0;
				weekCM5 = 0;
			}
			
		}
		
		weekTotalINV0 += weekINV0;
		weekTotalCM0 += weekCM0;
		
		weekTotalINV1 += weekINV1;
		weekTotalCM1 += weekCM1;
		
		weekTotalINV2 += weekINV2;
		weekTotalCM2 += weekCM2;
		
		weekTotalINV3 += weekINV3;
		weekTotalCM3 += weekCM3;
		
		weekTotalINV4 += weekINV4;
		weekTotalCM4 += weekCM4;
		
		weekTotalINV5 += weekINV5;
		weekTotalCM5 += weekCM5;
	}
	
	buTotalINV.push(weekTotalINV0);
	buTotalINV.push(weekTotalINV1);
	buTotalINV.push(weekTotalINV2);
	buTotalINV.push(weekTotalINV3);
	buTotalINV.push(weekTotalINV4);
	buTotalINV.push(weekTotalINV5);
	
	buTotalCM.push(weekTotalCM0);
	buTotalCM.push(weekTotalCM1);
	buTotalCM.push(weekTotalCM2);
	buTotalCM.push(weekTotalCM3);
	buTotalCM.push(weekTotalCM4);
	buTotalCM.push(weekTotalCM5);
	
	//console.log(buTotalINV+"   **   "+buTotalCM);
}

function getCsdTotalSeriesByWeek(){
	csdTotalINV = [];
	csdTotalCM = [];
	var weekTotalINV0 = 0;
	var weekTotalCM0 = 0;
	var weekTotalINV1 = 0;
	var weekTotalCM1 = 0;
	var weekTotalINV2 = 0;
	var weekTotalCM2 = 0;
	var weekTotalINV3 = 0;
	var weekTotalCM3 = 0;
	var weekTotalINV4 = 0;
	var weekTotalCM4 = 0;
	var weekTotalINV5 = 0;
	var weekTotalCM5 = 0;
	var weekINV0 = 0;
	var weekCM0 = 0;
	var weekINV1 = 0;
	var weekCM1 = 0;
	var weekINV2 = 0;
	var weekCM2 = 0;
	var weekINV3 = 0;
	var weekCM3 = 0;
	var weekINV4 = 0;
	var weekCM4 = 0;
	var weekINV5 = 0;
	var weekCM5 = 0;
	for(var i in otherCsdOverdueDetail){
		for(var j in otherCsdOverdueDetail[i]["Detail"]){
			if(otherCsdOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[0]){
				weekINV0 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM0 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV0 = 0;
				weekCM0 = 0;
			}
			
			if(otherCsdOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[1]){
				weekINV1 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM1 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV1 = 0;
				weekCM1 = 0;
			}
			
			if(otherCsdOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[2]){
				weekINV2 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM2 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV2 = 0;
				weekCM2 = 0;
			}
			
			if(otherCsdOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[3]){
				weekINV3 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM3 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV3 = 0;
				weekCM3 = 0;
			}
			
			if(otherCsdOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[4]){
				weekINV4 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM4 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV4 = 0;
				weekCM4 = 0;
			}
			
			if(otherCsdOverdueDetail[i]["Detail"][j]["WEEK"] == timeAxis[5]){
				weekINV5 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_INV"]);
				weekCM5 = Number(otherCsdOverdueDetail[i]["Detail"][j]["TOTAL_CM"]);
			}else{
				weekINV5 = 0;
				weekCM5 = 0;
			}
			
		}
		
		weekTotalINV0 += weekINV0;
		weekTotalCM0 += weekCM0;
		
		weekTotalINV1 += weekINV1;
		weekTotalCM1 += weekCM1;
		
		weekTotalINV2 += weekINV2;
		weekTotalCM2 += weekCM2;
		
		weekTotalINV3 += weekINV3;
		weekTotalCM3 += weekCM3;
		
		weekTotalINV4 += weekINV4;
		weekTotalCM4 += weekCM4;
		
		weekTotalINV5 += weekINV5;
		weekTotalCM5 += weekCM5;
	}
	
	csdTotalINV.push(weekTotalINV0);
	csdTotalINV.push(weekTotalINV1);
	csdTotalINV.push(weekTotalINV2);
	csdTotalINV.push(weekTotalINV3);
	csdTotalINV.push(weekTotalINV4);
	csdTotalINV.push(weekTotalINV5);
	
	csdTotalCM.push(weekTotalCM0);
	csdTotalCM.push(weekTotalCM1);
	csdTotalCM.push(weekTotalCM2);
	csdTotalCM.push(weekTotalCM3);
	csdTotalCM.push(weekTotalCM4);
	csdTotalCM.push(weekTotalCM5);
	
	//console.log(csdTotalINV+"   **   "+csdTotalCM);
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
	
	switchState = false;
	/*facility = "ALL";
    $(".Facility #" + facility).parent('.scrollmenu').find('.hover').removeClass('hover');
    $(".Facility #ALL").removeClass('disableHover');
    $(".Facility #ALL").addClass('hover');*/
    
    $(".Facility #" + facility).parent('.scrollmenu').find('.hover').removeClass('hover');
    $(".Facility #" + firstFacility).removeClass('disableHover');
    $(".Facility #" + firstFacility).addClass('hover');
    facility = firstFacility;
    
    buArrIndex = null;
	csdArrIndex = null;
	buColumnCheckAll = false;
	csdColumnCheckAll = false;
    
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
     
    //console.log("init");
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
				//设置CSD数据
				setCsdOverdueDetailData(facility);
				setCsdAreaData();
				csdSingleListBtn();
				//页面初始化
				changePageInitViewDetail();
				//API
				OutstandDetail();
				CreditExpiredSoon();
				//Highchart
				getLandscapeColumn(true, "");
    			zoomInChartByColumn();
				viewDetailInit = true;
				//test
				getBuTotalSeriesByWeek();
			}
			viewMainInit = false;
			loadingMask("hide");
					
		});
		
		$(".page-tabs #viewDetail-tab-1").on("click", function(){
			$('#overdueSoon').hide();
			$('#expiredSoon').hide();
			$('#overdue').show();
			viewDetailTab = "overdue";
		});
		
		$(".page-tabs #viewDetail-tab-2").on("click", function(){
			if(overdueSoonInit == false){
				setBuOverdueSoonData();
				setCsdOverdueSoonData();
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
			
			//overdue切换facility恢复默认排序
			buOverdueDetail.sort(compareLargeOverdue("Header", "TOTAL_INV"));
			csdOverdueDetail.sort(compareLargeOverdue("Header", "TOTAL_INV"));
			//overdueSoon切换facility恢复默认排序
			buOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
			csdOutstand.sort(compareLargeOverdueSoon("DUE_SOON_INV"));
			//expiredSoon切换facility恢复默认排序
			expiredSoon.sort(compareSmallOverdueSoon("EXPIRED_DATE"));
			
			setBuOverdueDetailData(facility);
			setBuAreaData();
			buSingleListBtn();
			setCsdOverdueDetailData(facility);
			setCsdAreaData();
			csdSingleListBtn();
			
			overdueInit = false;
			
			getOverdueSoonData(facility);
			setBuOverdueSoonData();
			setCsdOverdueSoonData();
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
    		if(facility == "ALL"){
    			if(buOverdueDetail.length > 0){
    				$('.bu-header .detail-customer .priority-img').attr('src', 'img/priority_up.png');
    				$('.bu-header .detail-total .priority-img').attr('src', 'img/priority_down.png');
    			}
    			else{
    				$('.bu-header .priority-img').attr('src', 'img/priority_dis.png');
    			}
    		}
    		else{
    			if(otherBuOverdueDetail.length > 0){
    				$('.bu-header .detail-customer .priority-img').attr('src', 'img/priority_up.png');
    				$('.bu-header .detail-total .priority-img').attr('src', 'img/priority_down.png');
    			}
    			else{
    				$('.bu-header .priority-img').attr('src', 'img/priority_dis.png');
    			}
    		}
    		
    		if(facility == "ALL"){
    			if(csdOverdueDetail.length > 0){
    				$('.csd-header .detail-customer .priority-img').attr('src', 'img/priority_up.png');
    				$('.csd-header .detail-total .priority-img').attr('src', 'img/priority_down.png');
    			}
    			else{
    				$('.csd-header .priority-img').attr('src', 'img/priority_dis.png');
    			}
    		}
    		else{
    			if(otherCsdOverdueDetail.length > 0){
    				$('.csd-header .detail-customer .priority-img').attr('src', 'img/priority_up.png');
    				$('.csd-header .detail-total .priority-img').attr('src', 'img/priority_down.png');
    			}
    			else{
    				$('.csd-header .priority-img').attr('src', 'img/priority_dis.png');
    			}
    		}
    		
    		if(buOutstand.length > 0){
    			$('.overduesoon-bu-header .bu-customer .priority-img').attr('src', 'img/priority_up.png');
				$('.overduesoon-bu-header .bu-totaloverdue .priority-img').attr('src', 'img/priority_down.png');
    		}
    		else{
    			$('.overduesoon-bu-header .bu-customer .priority-img').attr('src', 'img/priority_dis.png');
				$('.overduesoon-bu-header .bu-totaloverdue .priority-img').attr('src', 'img/priority_dis.png');
    		}
    		
    		if(csdOutstand.length > 0){
    			$('.overduesoon-csd-header .csd-customer .priority-img').attr('src', 'img/priority_up.png');
				$('.overduesoon-csd-header .csd-totaloverdue .priority-img').attr('src', 'img/priority_down.png');
    		}
    		else{
    			$('.overduesoon-csd-header .csd-customer .priority-img').attr('src', 'img/priority_dis.png');
				$('.overduesoon-csd-header .csd-totaloverdue .priority-img').attr('src', 'img/priority_dis.png');
    		}
    		
			if(expiredSoon.length > 0){
				$('.expiredsoon-bu-header .priority-img').attr('src', 'img/priority_up.png');
			}
			else{
				$('.expiredsoon-bu-header .priority-img').attr('src', 'img/priority_dis.png');
			}
			
			//test
			getBuTotalSeriesByWeek();
			
        });
		
	}
});


