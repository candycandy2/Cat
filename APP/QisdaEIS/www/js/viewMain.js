//get BU & CSD series
var viewMainTab = "bu";
var mainQisdaEisData = {};
var buBubbleSeries = [
	/*{ x: 60, y: 201346476, facility: 'TE' },*/
    { x: 61, y: 6135463, facility: 'TF' },
    { x: 74, y: 4351101, facility: 'TN' },			            
    { x: 78, y: 1364644, facility: 'FL' },
    { x: 82, y: 1361325, facility: 'FS' },
    { x: 88, y: 7345442, facility: 'TY' }
];
var csdBubbleSeries = [
	{ x: 74, y: 36, name: 'TE',  color: '#99CC33' },
    { x: 82, y: 45, name: 'TF',  color: '#40C1C7' },
    { x: 66, y: 60, name: 'TN',  color: '#FFCC66' },			            
    { x: 88, y: 73, name: 'FL',  color: '#5AAEE1' },
    { x: 63, y: 28, name: 'FS',  color: '#948078' },
    { x: 91, y: 57, name: 'TY',  color: '#AC8BC0' }
];
var treemapSeries1 = [
	{ name: '东森电视股份有限公司', code: '66588', value: 10, colorValue: 10, day1: 2256, day16: 876, day46: 432, day76: 1258 }, 
	{ name: '飞利浦股份有限公司', code: '60324', value: 9, colorValue: 30, day1: 738, day16: 456, day46: 1024, day76: 2586 }, 
	{ name: 'AAAAAA股份有限公司', code: '67498', value: 8, colorValue: 40, day1: 1443, day16: 563, day46: 2254, day76: 896 }, 
	{ name: 'BBBB股份有限公司', code: '62406', value: 6, colorValue: 50, day1: 207, day16: 1078, day46: 567, day76: 2963 }, 
	{ name: 'CCCC股份有限公司', code: '63201', value: 4, colorValue: 60, day1: 985, day16: 2246, day46: 409, day76: 4587 }, 
	{ name: 'DDDD股份有限公司', code: '64885', value: 4, colorValue: 70, day1: 441, day16: 798, day46: 1059, day76: 3062 }
];
var treemapSeries2 = [
	{ name: 'EEEE股份有限公司', code: '60586', value: 7, colorValue: 10, day1: 785, day16: 464, day46: 3560, day76: 2557 }, 
	{ name: 'FFFF股份有限公司', code: '61273', value: 10, colorValue: 20, day1: 524, day16: 1674, day46: 897, day76: 1356 }, 
	{ name: 'GGGG股份有限公司', code: '65792', value: 5, colorValue: 45, day1: 747, day16: 1654, day46: 5647, day76: 2441 }, 
	{ name: 'HHHH股份有限公司', code: '63496', value: 5, colorValue: 55, day1: 1242, day16: 344, day46: 3684, day76: 687 }, 
	{ name: 'IIII股份有限公司', code: '65068', value: 8, colorValue: 65, day1: 2364, day16: 841, day46: 653, day76: 457 }, 
	{ name: 'JJJJ股份有限公司', code: '69876', value: 8, colorValue: 75, day1: 1254, day16: 2503, day46: 486, day76: 698 }
];

//bubble highcharts option
var bubbleOption = {
	chart: {
        type: 'bubble',
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
        headerFormat: '<table class="fontTooltip">',
        pointFormat: '<tr><td><strong>{point.facility}</strong></td></tr>' +
        '<tr><td>Total Overdue AR Amt.:USD${point.y}</td></tr>' +
        '<tr><td>Max Overdue Days:{point.x}days</td></tr>',
        footerFormat: '</table>',
       	/*formatter: function () {
	        var s = '<b>' + {this.facility} + '</b><br/><font>Total Overdue AR Amt.:USD$' + this.y + '</font><br/><font>Max Overdue Days:' + this.x +'days</font>';
	        $.each(this.points, function () {
	           s += '<br/> ' + this.series.name + ':USD$' + this.y;
	        });
	        return s;
	    },*/
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
            			
            			//simulate click diff bubble show diff treemap
            			if(this.facility === 'TE' || this.facility === 'TN' || this.facility === 'FS'){
            				showTreemap();
            				chartRect.series[0].setData(treemapSeries1, true, true, false);
            				
            				showTreemapLandscape();
            				chartLandscapeRect.series[0].setData(treemapSeries1, true, true, false);
            				
            			}else{
            				showTreemap();
            				chartRect.series[0].setData(treemapSeries2, true, true, false);
            				
            				showTreemapLandscape();
            				chartLandscapeRect.series[0].setData(treemapSeries2, true, true, false);
            						
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
        data: buBubbleArr
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
        		if(this.value === 75){
        			return this.value + '(Days)';
        		}
        		else{
        			return this.value;
        		}
        	},
        	style: {
        		color: '#323232'
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
        headerFormat: '<table class="fontTooltip">',
        pointFormat: '<tr><td><strong>{point.code} {point.name}</strong></td></tr>' +
        '<tr><td>1-15 Days:USD${point.day1}</td></tr>' +
        '<tr><td>16-45 Days:USD${point.day16}</td></tr>' +
        '<tr><td>46-75 Days:USD${point.day46}</td></tr>' +
        '<tr><td>Over 75 Days:USD${point.day76}</td></tr>' ,
        footerFormat: '</table>',
        followPointer: false,
        followTouchMove: false
    },
    plotOptions: {
    	series: {
	        layoutAlgorithm: 'squarified',
	        dataLabels: {
	            enabled: true,  
	            useHTML: true,
	            crop: false,
	            overflow: 'none',
	            inside: true,
	            style: {
	            	"color": "#ffffff",
	            	"fontSize": "11px",
	            	"fontWeight": "bold",
	            	"textOutline": "2px 2px black"
	            },
	            format: '<div class="font-companyCode">{point.code}</div>' + '<div class="font-companyName">{point.name}</div>'
	        }
    	}
    },
    series: [{
    	data: buBubbleSeries  
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
}

function showTreemapLandscape(){
	rectOption.chart.renderTo = 'overview-hc-rectangle-landscape';
	chartLandscapeRect = new Highcharts.Chart(rectOption);
}

function hideTooltip(){
	chartbubble.tooltip.hide();
    chartRect.tooltip.hide();  
}


var buByType = [];
var csdByType = [];
var buSimplify = [];
var buBubbleArr = [];
var buBubbleData = {};
/*****************************************************************/
$('#viewMain').pagecontainer({
	create: function (event, ui){	
		
		window.ARSummary = function() {
			this.successCallback = function(data) {
				arSummaryCallBackData = data["Content"];
	    		/*length = arSummaryCallBackData.length;
	    		thisYear = arSummaryCallBackData[length-1]["YEAR"];
	    		thisMonth = arSummaryCallBackData[length-1]["MONTH"];*/
	    		
	    		
	    		//先按TYPE分组,分成BU和CSD
	    		for(var i in arSummaryCallBackData){
	    			if(arSummaryCallBackData[i]["TYPE"] == "BU"){
	    				buByType.push(arSummaryCallBackData[i]);
	    			}
	    			else{
	    				csdByType.push(arSummaryCallBackData[i]);
	    			}
	    		}
	    		//console.log(buByType);
	    		
	    		
	    		//简化成所需BU和CSD
	    		
	    		$.each(buByType, function(i, item) {
	    			buSimplify.push({
	    				"day": parseInt(item.MAX_DUE_DAYS_INV),
	    				"total": parseFloat(item.OVER_1_15_INV) + parseFloat(item.OVER_16_45_INV) + 
	    						 parseFloat(item.OVER_46_75_INV) + parseFloat(item.OVER_76_INV),
	    				"customer": item.CUSTOMER,
	    				"facility": item.FACILITY,
	    				"type": item.TYPE
	    			});
	    		});
	    		
	    		console.log(buSimplify);
	    		
	    		
	    		//相同facility合并
	    		
	    		
	    		$.each(buSimplify, function(i, item) {
	    			var fac = item.facility;
	    			var total = item.total;
	    			var day = item.day;
	    			if(buBubbleData[fac]) {
	    				buBubbleData[fac].y += total;
	    				if(day > buBubbleData[fac].x) {
	    					buBubbleData[fac].x = day;
	    				}
	    			} else {
	    				buBubbleData[fac] = {
	    					x : day,
	    					y : total,
	    					"facility": fac
	    				};
	    				buBubbleArr.push(buBubbleData[fac]);
	    			}
	    			
	    			
	    		});
	    		
	    		console.log(buBubbleArr);
	    			    		
	    			
			};
			
			this.failCallback = function(data) {
	    		console.log("api misconnected");
	    	};
	    	
	    	var _construct = function() {
				CustomAPI("POST", true, "ARSummary", self.successCallback, self.failCallback, ARSummaryQueryData, "");
			}();
		};
		
		window.AraUserAuthority = function() {
			this.successCallback = function(data) {
				
			};
			
			this.failCallback = function(data) {
	    		console.log("api misconnected");
	    	};
	    	
	    	var _construct = function() {
				CustomAPI("POST", true, "AraUserAuthority", self.successCallback, self.failCallback, AraUserAuthorityQueryData, "");
			}();
			
			
		};
		
		window.getTreemapSeriesByFacility = function(facility){
			
			
			
		}
		
		function showBubble(){
			bubbleOption.chart.renderTo = 'overview-hc-bubble';
			chartbubble = new Highcharts.Chart(bubbleOption);
			
			bubbleOption.chart.renderTo = 'overview-hc-bubble-landscape';
			chartLandscapebubble = new Highcharts.Chart(bubbleOption);
						
		}
		
		
		/********************************** page event *************************************/
		$("#viewMain").on("pagebeforeshow", function(event, ui){
			/* global PullToRefresh */
			
			
		});
		
		$('#viewMain').on('pageshow', function(event, ui){
			showBubble();
			
			$("label[for=viewMain-tab-1]").addClass('ui-btn-active');
		    $("label[for=viewMain-tab-2]").removeClass('ui-btn-active');
		    
		    $('#overview-hc-rectangle').hide();
		    //chartbubble.series[0].setData(buBubbleSeries, true, true, false);
		    chartbubble.series[0].setData(buBubbleArr, true, true, false);
			chartLandscapebubble.series[0].setData(buBubbleSeries, true, true, false);
            
			if (window.orientation === 90 || window.orientation === -90 ) {
                zoomInChart();
           	}
		});
		
		
		$(".page-tabs #viewMain-tab-1").on("click", function() {
			chartbubble.tooltip.hide();
			chartbubble.series[0].setData(buBubbleSeries, true, true, false);         
            
            chartLandscapebubble.series[0].setData(buBubbleSeries, true, true, false);
            
            $('#overview-hc-rectangle').hide();
            viewMainTab = 'bu';
        });
        
        $(".page-tabs #viewMain-tab-2").on("click", function() {
        	chartbubble.tooltip.hide();
			chartbubble.series[0].setData(csdBubbleSeries, true, true, false);          
            
            chartLandscapebubble.series[0].setData(csdBubbleSeries, true, true, false);
            
            $('#overview-hc-rectangle').hide();
            viewMainTab = 'csd';
        });
		
	}
});










