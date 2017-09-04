//get BU & CSD series
var viewMainTab = "bu";
var facilityList,firstFacility;
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
	            style: {
	            	"color": "#ffffff",
	            	"fontSize": "11px",
	            	"fontWeight": "bold",
	            	"textOutline": "2px 2px black"
	            },
	            format: '<div class="font-companyName">{point.customer}</div>'
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
		if(buBubbleObj[fac]) {
			buBubbleObj[fac].y += total;
			if(day > buBubbleObj[fac].x) {
				buBubbleObj[fac].x = day;
			}
		} else {
			buBubbleObj[fac] = {
				"x" : day,
				"y" : total,
				"facility": fac,
				"group": grp
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
		if(csdBubbleObj[fac]) {
			csdBubbleObj[fac].y += total;
			if(day > csdBubbleObj[fac].x) {
				csdBubbleObj[fac].x = day;
			}
		} else {
			csdBubbleObj[fac] = {
				"x" : day,
				"y" : total,
				"facility": fac,
				"group": grp
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
		    		//先按TYPE分组,分成BU和CSD
		    		sortDataByType();	
		    		//简化数据
		    		simplifyData();
		    		//相同facility合并
		    		mergeDataByFacility();
		    		/*switch(viewMainTab) {
                        case "bu" :
                            $("input[id=viewMain-tab-1]").trigger('click');   
                            break;
                        case "csd" :
                            $("input[id=viewMain-tab-2]").trigger('click');   
                            break;
                    }*/
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
					
					facilityList = '<a id="ALL">ALL</a>';
					var firstFacilityFlag = true;
					for(var i = 0; i < araUserAuthorityCallBackData.length; i++){
						facilityList += '<a id="' + araUserAuthorityCallBackData[i]["FACILITY"] + '">' + araUserAuthorityCallBackData[i]["FACILITY"] + '</a>';
						if(firstFacilityFlag){
							//firstFacility = araUserAuthorityCallBackData[i]["FACILITY"];
							firstFacilityFlag = false;
						}
					}
					$(".Facility").html("");
	                $(".Facility").append(facilityList).enhanceWithin();
	                $(".Facility #ALL").addClass('hover');
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
				
				facilityList = '<a id="ALL">ALL</a>';
				var firstFacilityFlag = true;
				for(var i = 0; i < araUserAuthorityCallBackData.length; i++){
					facilityList += '<a id="' + araUserAuthorityCallBackData[i]["FACILITY"] + '">' + araUserAuthorityCallBackData[i]["FACILITY"] + '</a>';
					if(firstFacilityFlag){
						//firstFacility = araUserAuthorityCallBackData[i]["FACILITY"];
						firstFacilityFlag = false;
					}
				}
				$(".Facility").html("");
                $(".Facility").append(facilityList).enhanceWithin();
                $(".Facility #ALL").addClass('hover');
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
                       	window.localStorage.removeItem("arSummaryData");
                        ARSummary(); 
                        showBubble();
                        
    					if(viewMainTab == "bu"){
            				chartbubble.series[0].setData(buBubbleData, true, true, false);         
            				chartLandscapebubble.series[0].setData(buBubbleData, true, true, false);
            				
                        }
                        else{
            				chartbubble.series[0].setData(csdBubbleData, true, true, false);         
            				chartLandscapebubble.series[0].setData(csdBubbleData, true, true, false);
            				
                        }
        				
                        chartbubble.redraw();
                		chartLandscapebubble.redraw();
                        
                        //viewDetail API
                        window.localStorage.removeItem("overdueDetailData");
                    	OverdueDetail();
                    	window.localStorage.removeItem("outstandDetailData");
                   		OutstandDetail();
                   		window.localStorage.removeItem("creditExpiredSoonData");
                    	CreditExpiredSoon();
                        
                    }
                }
            });
			
		});
		
		$('#viewMain').on('pageshow', function(event, ui){
			if(viewMainInit == false) {
				viewMainInit = true;
				showBubble();
				
				$("label[for=viewMain-tab-1]").addClass('ui-btn-active');
			    $("label[for=viewMain-tab-2]").removeClass('ui-btn-active');
			    
			    $('#overview-hc-rectangle').hide();
			        
		    	chartbubble.series[0].setData(buBubbleData, false, false, false);
			    chartbubble.redraw(true);
				chartLandscapebubble.series[0].setData(buBubbleData, false, false, false);
				chartLandscapebubble.redraw(true);
			    
				if (window.orientation === 90 || window.orientation === -90 ) {
	                zoomInChart();
	           	}
				
				//调用第二页API
				OverdueDetail();
			}
			loadingMask("hide");
		});
		
		
		$(".page-tabs #viewMain-tab-1").on("click", function() {
			chartbubble.tooltip.hide();
			chartbubble.series[0].setData(buBubbleData, true, true, false);         
            chartLandscapebubble.series[0].setData(buBubbleData, true, true, false);
            
            $('#overview-hc-rectangle').hide();
            viewMainTab = 'bu';
        });
        
        $(".page-tabs #viewMain-tab-2").on("click", function() {
        	chartbubble.tooltip.hide();
			chartbubble.series[0].setData(csdBubbleData, true, true, false);          
            chartLandscapebubble.series[0].setData(csdBubbleData, true, true, false);
            
            $('#overview-hc-rectangle').hide();
            viewMainTab = 'csd';
        });
		
	}
});










