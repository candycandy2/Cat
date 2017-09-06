//get BU & CSD series
var viewMainTab = "bu";
var facilityList = "";
/*var facility = "ALL";*/
var facility;
var firstFacility;
var viewMainInit = false;
var mainQisdaEisData = {};
var userAuthority = [];
var arSummaryData = {};
var buByType = [];
var csdByType = [];
var buSimplify = [];
var csdSimplify = [];
var buBubbleData = [];
var buBubbleObj = {};
var csdBubbleData = [];
var csdBubbleObj = {};
var buTreemap = [];
var csdTreemap = [];
var buBubbleToTreemap = [];
var csdBubbleToTreemap = [];

var buBubbleSeries = [
	{ x: 60, y: 2586476, facility: 'TE' },
    { x: 61, y: 6135463, facility: 'TF' },
    { x: 74, y: 4351101, facility: 'TN' },			            
    { x: 78, y: 1364644, facility: 'FL' },
    { x: 82, y: 5037846, facility: 'FS' },
    { x: 88, y: 7345442, facility: 'TY' }
];

var treemapSeries1 = [
	{ customer: '66588 东森电视股份有限公司', value: 10, colorValue: 10, day1: 2256, day16: 876, day46: 432, day76: 1258 }, 
	{ customer: '60324 飞利浦股份有限公司', value: 9, colorValue: 30, day1: 738, day16: 456, day46: 1024, day76: 2586 }, 
	{ customer: '67498 AAAAAA股份有限公司', value: 8, colorValue: 40, day1: 1443, day16: 563, day46: 2254, day76: 896 }, 
	{ customer: '62406 BBBB股份有限公司', value: 6, colorValue: 50, day1: 207, day16: 1078, day46: 567, day76: 2963 }, 
	{ customer: '63201 CCCC股份有限公司', value: 4, colorValue: 60, day1: 985, day16: 2246, day46: 409, day76: 4587 }, 
	{ customer: '64885 DDDD股份有限公司', value: 4, colorValue: 70, day1: 441, day16: 798, day46: 1059, day76: 3062 }
];

//bubble highcharts option
var bubbleOption = {
	chart: {
        type: 'bubble',
        animation: false,
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
        }
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
        endOnTick: false
    },
    tooltip: {
        useHTML: true,
        animation: false,
        hideDelay: 0,
        shadow: false,       
        borderColor: '#FDC24F',
        backgroundColor: 'rgba(247,247,247,0.85)',
       	formatter: function () {
	        var s = '<b>' + this.point.facility + '</b><br/>' + 
	        		'<font>Total Overdue AR Amt.:USD$' + formatNumber(this.y.toFixed(2)) + '</font><br/>' +
	        		'<font>Max Overdue Days:' + this.x +'days</font>';
	        return s;
	    },
        followTouchMove: false
    },
    plotOptions: {
        series: {
        	maxSize: 35,
        	minSize: 35,
            dataLabels: {
                enabled: true,
                allowOverlap: true,
                format: '{point.facility}',
                style: { 
                	"color": "#ffffff",
                	"fontSize": "12px", 
                	"textOutline": "-2px -2px contrast"
                }
            },
            point: {
            	events: {
            		click: function(event){
            			var facility = this.facility;
            			getTreemapSeriesByFacility(facility);
            			
            			//销毁原来的facility-treemap
            			if(chartTreemap !== null){
            				chartTreemap.destroy();
            				chartTreemap = null;
            			}
            			
            			showTreemap();
            			
            			if(viewMainTab == "bu"){
            				chartRect.series[0].setData(buTreemap, true, true, false);
            				chartLandscapeRect.series[0].setData(buTreemap, true, true, false);
            			}
            			else{
            				chartRect.series[0].setData(csdTreemap, true, true, false);
            				chartLandscapeRect.series[0].setData(csdTreemap, true, true, false);
            			}
            			
            			//show diff chart by orientation
            			if(window.orientation === 180 || window.orientation === 0){
            				$('#overview-hc-rectangle').show();
            				
            			}
            			if(window.orientation === 90 || window.orientation === -90){
            				zoomInChartByTreemap();
            				chartLandscapeRect.update({
            					chart: {
            						backgroundColor: '#FFFFFF',
            						marginTop: 0
            					}
            				});
            				$('#backBtn').show();
            				$('#overview-hc-bubble-landscape').hide();
            				$('#overview-hc-rectangle-landscape').show();
            				treemapState = true;   					
            			}       			      			
            		}
            	}
            }
        }
    },
    series: [{		    	
        //data: buBubbleSeries
        data: buBubbleData
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
		animation: false,
		marginTop: 40,
		marginBottom: 70,
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
        	enabled: true,
        	align: 'left',
        	overflow: 'justify',
        	formatter: function(){
        		if(this.value == 75){
        			var s = this.value + '(Days)';
        		}
        		else{
        			var s = this.value;
        		}
        		return s;
        	},
        	style: {
        		"color": "#323232",
        		"fontSize": "11px"
        	}
        }
   	},
   	tooltip: {
        useHTML: true,
        animation: false,
        hideDelay: 0,
        shadow: false,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor:　'#ffffff',
        formatter: function () {
	        var s = '<b>' + this.point.customer + '</b><br/>' + 
	        		'<span>1-15 Days:USD$' + formatNumber(this.point.day1.toFixed(2)) + '</span><br/>' +
	        		'<span>16-45 Days:USD$' + formatNumber(this.point.day16.toFixed(2)) + '</span><br/>' +
	        		'<span>46-75 Days:USD$' + formatNumber(this.point.day46.toFixed(2)) + '</span><br/>' +
	        		'<span>Over 75 Days:USD$' + formatNumber(this.point.day76.toFixed(2)) + '</span><br/>';
	        return s;
	    },
        followPointer: false,
        followTouchMove: false
    },
    plotOptions: {
    	series: {
	        layoutAlgorithm: 'squarified',
	        dataLabels: {
	            enabled: true,  
	            useHTML: true,
	            crop: true,
	            overflow: 'justify',
	            inside: true,
	            /*zIndex: 2,*/
	            style: {
	            	"color": "#ffffff",
	            	"fontSize": "11px",
	            	"fontWeight": "bold",
	            	"textOutline": "2px 2px black"
	            },
	            format: '<div class="font-companyName">{point.customer}</div>'
	            /*format: '{point.facility}'*/
	        }
    	}
    },
    series: [{
    	data: buTreemap
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

var treemapOption = {
	chart: {
		type: "treemap",
		animation: false,
		marginTop: 40,
		marginBottom: 70,
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
        	enabled: true,
        	align: 'left',
        	overflow: 'justify',
        	formatter: function(){
        		if(this.value == 75){
        			var s = this.value + '(Days)';
        		}
        		else{
        			var s = this.value;
        		}
        		return s;
        	},
        	style: {
        		"color": "#323232",
        		"fontSize": "11px"
        	}
        }
   	},
   	tooltip: {
   		/*enabled: false,*/
        useHTML: true,
        animation: false,
        hideDelay: 0,
        shadow: false,
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor:　'#ffffff',
        formatter: function () {
	        var s = '<b>' + this.point.facility + '</b><br/>' + 
	        		'<span>1-15 Days:USD$' + formatNumber(this.point.day1.toFixed(2)) + '</span><br/>' +
	        		'<span>16-45 Days:USD$' + formatNumber(this.point.day16.toFixed(2)) + '</span><br/>' +
	        		'<span>46-75 Days:USD$' + formatNumber(this.point.day46.toFixed(2)) + '</span><br/>' +
	        		'<span>Over 75 Days:USD$' + formatNumber(this.point.day76.toFixed(2)) + '</span><br/>';
	        return s;
	    },
        followPointer: false,
        followTouchMove: false
    },
    plotOptions: {
    	series: {
	        layoutAlgorithm: 'squarified',
	        dataLabels: {
	            enabled: true,  
	            useHTML: true,
	            crop: true,
	            overflow: 'justify',
	            inside: true,
	            /*zIndex: 2,*/
	            style: {
	            	"color": "#ffffff",
	            	"fontSize": "11px",
	            	"fontWeight": "bold",
	            	"textOutline": "2px 2px black"
	            },
	            /*format: '<div class="font-companyName">{point.facility}</div>'*/
	            format: '{point.facility}'
	        }
    	}
    },
    series: [{
    	data: buBubbleToTreemap
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


function showTreemap(){
	rectOption.chart.renderTo = 'overview-hc-rectangle';
	chartRect = new Highcharts.Chart(rectOption);
	
	rectOption.chart.renderTo = 'overview-hc-rectangle-landscape';
	chartLandscapeRect = new Highcharts.Chart(rectOption);
}


function hideTooltip(){
	chartbubble.tooltip.hide();
    chartRect.tooltip.hide();  
}

function sortDataByType(){
	buByType = [];
	csdByType = [];
	
	for(var i = 0; i < arSummaryCallBackData.length; i++){
		for(var j = 0; j < araUserAuthorityCallBackData.length; j++){
			if(arSummaryCallBackData[i]["FACILITY"] == araUserAuthorityCallBackData[j]["FACILITY"]){
				if(arSummaryCallBackData[i]["TYPE"] == "BU"){
					buByType.push(arSummaryCallBackData[i]);
				}
				else if(arSummaryCallBackData[i]["TYPE"] == "CSD"){
					csdByType.push(arSummaryCallBackData[i]);
				}
			}
		}
	}
	
	//console.log(buByType);
}

function simplifyData(){
	buSimplify = [];
	csdSimplify = [];
	
	$.each(buByType, function(i, item) {
		buSimplify.push({
			"day": parseInt(item.MAX_DUE_DAYS_INV),
			"total": parseFloat(item.OVER_1_15_INV) + parseFloat(item.OVER_16_45_INV) + 
					 parseFloat(item.OVER_46_75_INV) + parseFloat(item.OVER_76_INV),
			"day1": parseFloat(item.OVER_1_15_INV),
			"day16": parseFloat(item.OVER_16_45_INV),
			"day46": parseFloat(item.OVER_46_75_INV),
			"day76": parseFloat(item.OVER_76_INV),
			"customer": item.CUSTOMER,
			"facility": item.FACILITY,
			"type": item.TYPE,
			"group": item.BUSINESS_GROUP
		});
	});
	
	$.each(csdByType, function(i, item) {
		csdSimplify.push({
			"day": parseInt(item.MAX_DUE_DAYS_INV),
			"total": parseFloat(item.OVER_1_15_INV) + parseFloat(item.OVER_16_45_INV) + 
					 parseFloat(item.OVER_46_75_INV) + parseFloat(item.OVER_76_INV),
			"day1": parseFloat(item.OVER_1_15_INV),
			"day16": parseFloat(item.OVER_16_45_INV),
			"day46": parseFloat(item.OVER_46_75_INV),
			"day76": parseFloat(item.OVER_76_INV),
			"customer": item.CUSTOMER,
			"facility": item.FACILITY,
			"type": item.TYPE,
			"group": item.BUSINESS_GROUP
		});
	});
	
	//console.log(buSimplify);
}

function mergeDataByFacility(){
	buBubbleData = []
	csdBubbleData = [];
	buBubbleObj = {};
	csdBubbleObj = {};
	
	$.each(buSimplify, function(i, item) {
		var fac = item.facility;
		var total = item.total;
		var day = item.day;
		var grp = item.group;
		var over1 = item.day1;
		var over16 = item.day16;
		var over46 = item.day46;
		var over76 = item.day76;
		if(buBubbleObj[fac]) {
			buBubbleObj[fac].y += total;
			buBubbleObj[fac].day1 += over1;
			buBubbleObj[fac].day16 += over16;
			buBubbleObj[fac].day46 += over46;
			buBubbleObj[fac].day76 += over76;
			
			if(day > buBubbleObj[fac].x) {
				buBubbleObj[fac].x = day;
			}
		} 
		else {
			buBubbleObj[fac] = {
				"x" : day,
				"y" : total,
				"facility": fac,
				"group": grp,
				"day1": over1,
				"day16": over16,
				"day46": over46,
				"day76": over76
			};
			if(item.group == "BBS"){
				buBubbleObj[fac].color = "#99CC33";
			}
			else if(item.group == "CIG"){
				buBubbleObj[fac].color = "#40C1C7";
			}
			else if(item.group == "ITG"){
				buBubbleObj[fac].color = "#FFCC66";
			}
			else if(item.group == "MDG"){
				buBubbleObj[fac].color = "#5AAEE1";
			}
			else if(item.group == "MPG"){
				buBubbleObj[fac].color = "#948078";
			}
			else if(item.group == "VIO"){
				buBubbleObj[fac].color = "#AC8BC0";
			}
			buBubbleData.push(buBubbleObj[fac]);
		}
	});
	
	$.each(csdSimplify, function(i, item) {
		var fac = item.facility;
		var total = item.total;
		var day = item.day;
		var grp = item.group;
		var over1 = item.day1;
		var over16 = item.day16;
		var over46 = item.day46;
		var over76 = item.day76;
		if(csdBubbleObj[fac]) {
			csdBubbleObj[fac].y += total;
			csdBubbleObj[fac].day1 += over1;
			csdBubbleObj[fac].day16 += over16;
			csdBubbleObj[fac].day46 += over46;
			csdBubbleObj[fac].day76 += over76;
			
			if(day > csdBubbleObj[fac].x) {
				csdBubbleObj[fac].x = day;
			}
		} 
		else {
			csdBubbleObj[fac] = {
				"x" : day,
				"y" : total,
				"facility": fac,
				"group": grp,
				"day1": over1,
				"day16": over16,
				"day46": over46,
				"day76": over76
			};
			if(item.group == "BBS"){
				csdBubbleObj[fac].color = "#99CC33";
			}
			else if(item.group == "CIG"){
				csdBubbleObj[fac].color = "#40C1C7";
			}
			else if(item.group == "ITG"){
				csdBubbleObj[fac].color = "#FFCC66";
			}
			else if(item.group == "MDG"){
				csdBubbleObj[fac].color = "#5AAEE1";
			}
			else if(item.group == "MPG"){
				csdBubbleObj[fac].color = "#948078";
			}
			else if(item.group == "VIO"){
				csdBubbleObj[fac].color = "#AC8BC0";
			}
			csdBubbleData.push(csdBubbleObj[fac]);
		}
	});
	
	//console.log(buBubbleData);
}

function getTreemapFromBubble(){
	buBubbleToTreemap = [];
	csdBubbleToTreemap = [];
	
	$.each(buBubbleData, function(i, item) {
		buBubbleToTreemap.push({
			"facility": item["facility"],
			"colorValue": item["x"],
			"value": item["y"],
			"day1": item["day1"],
			"day16": item["day16"],
			"day46": item["day46"],
			"day76": item["day76"]
		});
	});
	
	$.each(csdBubbleData, function(i, item) {
		csdBubbleToTreemap.push({
			"facility": item["facility"],
			"colorValue": item["x"],
			"value": item["y"],
			"day1": item["day1"],
			"day16": item["day16"],
			"day46": item["day46"],
			"day76": item["day76"]
		});
	});
	
	//console.log(buBubbleToTreemap);
}

function getTreemapSeriesByFacility(fac) {
	buTreemap = [];
    csdTreemap = [];
	
	$.each(buSimplify, function(i, item) {
		if(item.facility == fac){
			buTreemap.push({
				"customer": item.customer,
				"value": item.total,
				"colorValue": item.day,
				"day1": item.day1,
				"day16": item.day16,
				"day46": item.day46,
				"day76": item.day76
			});
		}
	});

	$.each(csdSimplify, function(i, item) {
		if(item.facility == fac){
			csdTreemap.push({
				"customer": item.customer,
				"value": item.total,
				"colorValue": item.day,
				"day1": item.day1,
				"day16": item.day16,
				"day46": item.day46,
				"day76": item.day76
			});
		}
	});
}


/*****************************************************************/
$('#viewMain').pagecontainer({
	create: function (event, ui){	
		
		window.ARSummary = function() {
			if(localStorage.getItem("arSummaryData") == null){
				this.successCallback = function(data) {
					arSummaryCallBackData = data["Content"];
		    		sortDataByType();	
		    		simplifyData();
		    		mergeDataByFacility();
		    		getTreemapFromBubble();
		    		OverdueDetail();
		    		switch(viewMainTab) {
                        case "bu" :
                            $("input[id=viewMain-tab-1]").trigger('click');   
                            break;
                        case "csd" :
                            $("input[id=viewMain-tab-2]").trigger('click');   
                            break;
                    }
					loadingMask("hide");
		    		
		    		localStorage.setItem("arSummaryData", JSON.stringify([data, nowTime]));
				};
				
				this.failCallback = function(data) {
		    		console.log("api misconnected");
		    	};
		    	
		    	var _construct = function() {
					CustomAPI("POST", true, "ARSummary", self.successCallback, self.failCallback, ARSummaryQueryData, "");
				}();
			}
			else{
				arSummaryData = JSON.parse(localStorage.getItem("arSummaryData"))[0];
				arSummaryCallBackData = arSummaryData["Content"];
				sortDataByType();
				simplifyData();
				mergeDataByFacility();
				getTreemapFromBubble();
				OverdueDetail();
				loadingMask("hide");
				
				var lastTime = JSON.parse(localStorage.getItem("arSummaryData"))[1];
				if (checkDataExpired(lastTime, expiredTime, 'dd')) {
                    localStorage.removeItem("arSummaryData");
                    ARSummary();
                }
			}
			
		};
		
		window.AraUserAuthority = function() {
			if(localStorage.getItem("araUserAuthorityData") === null){
				this.successCallback = function(data) {
					araUserAuthorityCallBackData = data["Content"];
					
					//facilityList = '<a id="ALL">ALL</a>';
					var firstFacilityFlag = true;
					for(var i = 0; i < araUserAuthorityCallBackData.length; i++){
						facilityList += '<a id="' + araUserAuthorityCallBackData[i]["FACILITY"] + '">' + araUserAuthorityCallBackData[i]["FACILITY"] + '</a>';
						if(firstFacilityFlag){
							firstFacility = araUserAuthorityCallBackData[i]["FACILITY"];
							facility = firstFacility;
							firstFacilityFlag = false;
						}
					}
					$(".Facility").html("");
	                $(".Facility").append(facilityList).enhanceWithin();
	                /*$(".Facility #ALL").addClass('hover');*/
	               	$(".Facility #" + firstFacility).addClass('hover');
	                ARSummary();
	                loadingMask("hide");
	                
	                localStorage.setItem("araUserAuthorityData", JSON.stringify([data, nowTime]));
				};
				
				this.failCallback = function(data) {
		    		console.log("api misconnected");
		    	};
		    	
		    	var _construct = function() {
					CustomAPI("POST", true, "AraUserAuthority", self.successCallback, self.failCallback, AraUserAuthorityQueryData, "");
				}();
			}
			else{
				araUserAuthorityData = JSON.parse(localStorage.getItem("araUserAuthorityData"))[0];
				araUserAuthorityCallBackData = araUserAuthorityData["Content"];
				
				/*facilityList = '<a id="ALL">ALL</a>';*/
				var firstFacilityFlag = true;
				for(var i = 0; i < araUserAuthorityCallBackData.length; i++){
					facilityList += '<a id="' + araUserAuthorityCallBackData[i]["FACILITY"] + '">' + araUserAuthorityCallBackData[i]["FACILITY"] + '</a>';
					if(firstFacilityFlag){
						firstFacility = araUserAuthorityCallBackData[i]["FACILITY"];
						facility = firstFacility;
						firstFacilityFlag = false;
					}
				}
				$(".Facility").html("");
                $(".Facility").append(facilityList).enhanceWithin();
                $(".Facility #" + firstFacility).addClass('hover');
                ARSummary();
                loadingMask("hide");
                
                var lastTime = JSON.parse(localStorage.getItem("araUserAuthorityData"))[1];
                if (checkDataExpired(lastTime, expiredTime, 'dd')) {
                    localStorage.removeItem("araUserAuthorityData");
                    AraUserAuthority();
                }
				
			}
		};
		
		
		
		function showBubble(){
			bubbleOption.chart.renderTo = 'overview-hc-bubble';
			chartbubble = new Highcharts.Chart(bubbleOption);
			
			bubbleOption.chart.renderTo = 'overview-hc-bubble-landscape';
			chartLandscapebubble = new Highcharts.Chart(bubbleOption);
						
		}
		
		
		/********************************** page event *************************************/
		$("#viewMain").on("pagebeforeshow", function(event, ui){
			/* global PullToRefresh */
			PullToRefresh.init({
                mainElement: '.page-date',
                onRefresh: function() {
                    if($.mobile.pageContainer.pagecontainer("getActivePage")[0].id == "viewMain") {
                       	//销毁hc
                       	chartbubble.destroy();
                        chartLandscapebubble.destroy();
                        if(chartTreemap !== null){
                        	chartTreemap.destroy();
                        	chartTreemap = null;
                        } 
                        if(chartRect !== null){
                        	chartRect.destroy();
                        	chartRect = null;
                        }
                        if(chartLandscapeRect !== null){
                        	chartLandscapeRect.destroy();
                        	chartLandscapeRect = null;
                        }
                       	
                       	//重新调用API
                       	window.localStorage.removeItem("arSummaryData");
                        ARSummary();
                        
                        //viewDetail API
                        window.localStorage.removeItem("overdueDetailData");
                    	OverdueDetail();
                    	window.localStorage.removeItem("outstandDetailData");
                   		OutstandDetail();
                   		window.localStorage.removeItem("creditExpiredSoonData");
                    	CreditExpiredSoon();
                    	
                    	//恢复初始状态
                    	switchState = false;
                    	facility = firstFacility;
                    	viewMainInit = false;
                        viewDetailInit = false;
                       	
                        showBubble();
                        
    					if(viewMainTab == "bu"){
            				chartbubble.series[0].setData(buBubbleData, true, true, false);         
            				chartLandscapebubble.series[0].setData(buBubbleData, true, true, false);
            				
                        }
                        else{
            				chartbubble.series[0].setData(csdBubbleData, true, true, false);         
            				chartLandscapebubble.series[0].setData(csdBubbleData, true, true, false);
            				
                        }
        				  
                        
                    }
                }
            });
			
		});
		
		$('#viewMain').on('pageshow', function(event, ui){
			if(chartRect !== null){
            	chartRect.destroy();
            	chartRect = null;
            }
            if(chartLandscapeRect !== null){
            	chartLandscapeRect.destroy();
            	chartLandscapeRect = null;
            }           
			
			if(viewMainInit == false) {
				$("label[for=viewMain-tab-1]").addClass('ui-btn-active');
			    $("label[for=viewMain-tab-2]").removeClass('ui-btn-active');
			    
				showBubble();
				chartbubble.series[0].setData(buBubbleData, true, true, false);
				chartLandscapebubble.series[0].setData(buBubbleData, true, true, false);
				
				chartTreemap = new Highcharts.Chart('overview-hc-rectangle', treemapOption);
				chartTreemap.series[0].setData(buBubbleToTreemap, true, true, false);
			    
				if (window.orientation === 90 || window.orientation === -90 ) {
	                zoomInChart();
	           	}
				
				viewMainInit = true;
			}
			loadingMask("hide");
		});
		
		$(".page-tabs #viewMain-tab-1").on("click", function() {
			if(chartRect !== null){
            	chartRect.destroy();
            	chartRect = null;
            }
            if(chartLandscapeRect !== null){
            	chartLandscapeRect.destroy();
            	chartLandscapeRect = null;
            }
            
			chartbubble.tooltip.hide();
			chartbubble.series[0].setData(buBubbleData, true, true, false);         
            chartLandscapebubble.series[0].setData(buBubbleData, true, true, false);
            
            chartTreemap = new Highcharts.Chart('overview-hc-rectangle', treemapOption);
            chartTreemap.series[0].setData(buBubbleToTreemap, true, true, false); 
            
            viewMainTab = 'bu';
        });
        
        $(".page-tabs #viewMain-tab-2").on("click", function() {
        	if(chartRect !== null){
            	chartRect.destroy();
            	chartRect = null;
            }
            if(chartLandscapeRect !== null){
            	chartLandscapeRect.destroy();
            	chartLandscapeRect = null;
            }
            
        	chartbubble.tooltip.hide();
			chartbubble.series[0].setData(csdBubbleData, true, true, false);          
            chartLandscapebubble.series[0].setData(csdBubbleData, true, true, false);
            
            chartTreemap = new Highcharts.Chart('overview-hc-rectangle', treemapOption);
            chartTreemap.series[0].setData(csdBubbleToTreemap, true, true, false); 
            
            viewMainTab = 'csd';
        });
		
	}
});










