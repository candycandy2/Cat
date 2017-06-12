var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        
    },

    onDeviceReady: function() {        
        //back按钮的事件监听
        document.addEventListener('backbutton', this.onBackKeyDown, false);

    },
    
	//返回键事件
	onBackKeyDown: function (){
		//返回键关闭popup
		if(popupState == 1){
			$("#dialogMsg").popup("close");
			popupState = 0;
			return false;
		}
		//返回键关闭panel
		if(panelState == 1){
			$("#panel").panel("close");
			panelState = 0;
			return false;
		}
		//返回键改变图表显示
		if($("#pageMain").css("display") == "block"){
			if(chartState == 3){
				$("#container1").hide();
				$("#container2").show();
				$("#container3").hide();
				$('#chart3').removeClass('ui-btn-active');
				$('#chart2').addClass('ui-btn-active');
				chartState = 2;			
				return false;
			} else if(chartState == 2){
				$("#container1").show();
				$("#container2").hide();
				$("#container3").hide();
				$('#chart2').removeClass('ui-btn-active');
				$('#chart1').addClass('ui-btn-active');
				chartState = 1;
				return false;
			}
		} else {
			if(chartState == 3){
				$("#container4").html("");
				landscapeLastMonth();
				$('#chart3').removeClass('ui-btn-active');
				$('#chart2').addClass('ui-btn-active');
				chartState = 2;	
				return false;
			} else if(chartState == 2){
				$("#container4").html("");
				landscapeThisMonthChart();
				$('#chart2').removeClass('ui-btn-active');
				$('#chart1').addClass('ui-btn-active');
				chartState = 1;
				return false;
			}
		}
		navigator.app.exitApp();
	}
};

app.initialize();

$(function () {
   	//横屏进入
   	if(landscapeWidth > landscapeHeight){
   		temp = landscapeHeight;
   		landscapeHeight = landscapeWidth;
   		landscapeWidth = temp;
   		$("#container4").css({"width":landscapeHeight, "height":landscapeWidth});
   		landscapeThisMonthChart();
   		$("#pageMain").hide();
		$("#pageChart").show();	
   	} else {
   		//设置图表宽高
   		var chartHeight=landscapeWidth * 0.8;
   		$('#container1').css('height', chartHeight);
   		$('#container2').css('height', chartHeight);
   		$('#container3').css('height', chartHeight);
   		$("#pageMain").show();
		$("#pageChart").hide();
   	}	
   	
   	thisMonthChart();
   	lastMonthChart();
   	ytdChart();
   	changeColorByNum();
});

/*******************全局变量***********************/
//保存竖屏时显示的图表内容，默认显示第一张
var chartState = 1;
//popup状态
var popupState = 0;
//panel状态
var panelState = 0;
//获取屏幕宽高
var landscapeWidth = screen.width;
var landscapeHeight = screen.height;
var temp = 0;


//thisMonth图表
var thisMonthChart = function(){
	$('#container1').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Dec.2016',
            style: {
            	fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: [
                'BQA',
                'BQC',
                'BQE',
                'BQL',
                'BQP',
            ],
            crosshair: true,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            min: 0,
            title: {
                text: '(USD$M)',
                align: 'high',
                offset: 0,
                rotation: 0,
                y: -10
            },
            gridLineDashStyle: 'Dash'        
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}= </td>' +
            '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
		series: [{
            name: 'Budget AMT',
            color: '#00B0B2',
            data: [2100,800,1400,1400,1900]
        }, 
        {
            name: 'Actual AMT',
            color: '#F6A030',
            data: [1700,400,2200,1200,1100]
        }],
        credits: {
        	enabled: false
        },
        legend: {
        	align: 'left'
        }
   	});
};

//lastMonth图表
var lastMonthChart=function(){
	$('#container2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Nov.2016',
            style: {
            	fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: [
                'BQA',
                'BQC',
                'BQE',
                'BQL',
                'BQP',
            ],
            crosshair: true,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            min: 0,
            title: {
                text: '(USD$M)',
                align: 'high',
                offset: 0,
                rotation: 0,
                y: -10	
            },
            gridLineDashStyle: 'Dash'   
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}= </td>' +
            '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
		series: [{
            name: 'Budget AMT',
            color: '#00B0B2',
            data: [2400,1200,1600,2200,2100]
        }, 
        {
            name: 'Actual AMT',
            color: '#F6A030',
            data: [2100,800,1900,1700,1600]
        }],
        credits: {
        	enabled: false
        },
        legend: {
        	align: 'left'
        }
   	});
};

//YTD图表
var ytdChart=function(){
	$('#container3').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'YTD',
            style: {
            	fontWeight: 'bold'
            }
        },
        xAxis: {
            categories: [
                'BQA',
                'BQC',
                'BQE',
                'BQL',
                'BQP',
            ],
            crosshair: true,
            tickmarkPlacement: 'on'
        },
        yAxis: {
            min: 0,
            title: {
                text: '(USD$M)',
                align: 'high',
                offset: 0,
                rotation: 0,
                y: -10
            },
            gridLineDashStyle: 'Dash'    
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}= </td>' +
            '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
		series: [{
            name: 'Budget AMT',
            color: '#00B0B2',
            data: [3600,2500,3000,2600,3500]
        }, 
        {
            name: 'Actual AMT',
            color: '#F6A030',
            data: [3500,2800,3200,2200,1900]
        }],
        credits: {
        	enabled: false
        },
        legend: {
        	align: 'left'
        }
   	});
};

//横屏thisMonth图表
var landscapeThisMonthChart=function(){
	$('#container4').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: [
                'BQA',
                'BQC',
                'BQE',
                'BQL',
                'BQP',
            ],
            crosshair: true,
            tickmarkPlacement: 'on',
            tickWidth: 0,
            labels: {
            	style: {
            		'fontWeight': 'bold',
            		'fontSize': '15px',
            		'fontFamily': 'arial'
            	}
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            gridLineDashStyle: 'Dash',
            labels: {
            	formatter: function(){
            		return "$" + this.value + "M";
            	}
            }     
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}= </td>' +
            '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
		series: [{
            name: 'Budget AMT',
            color: '#00B0B2',
            data: [2100,800,1400,1400,1900]
        }, 
        {
            name: 'Actual AMT',
            color: '#F6A030',
            data: [1700,400,2200,1200,1100]
        }],
        credits: {
        	enabled: false
        },
        legend: {
        	verticalAlign: 'top'
        }
   	});
};

//横屏lastMonth图表
var landscapeLastMonth=function(){
	$('#container4').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: null          
        },
        xAxis: {
            categories: [
                'BQA',
                'BQC',
                'BQE',
                'BQL',
                'BQP',
            ],
            crosshair: true,
            tickmarkPlacement: 'on',
            tickWidth: 0,
            labels: {
            	style: {
            		'fontWeight': 'bold',
            		'fontSize': '15px',
            		'fontFamily': 'arial'
            	}
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            gridLineDashStyle: 'Dash',
            labels: {
            	formatter: function(){
            		return "$" + this.value + "M";
            	}
            }     
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}= </td>' +
            '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
		series: [{
            name: 'Budget AMT',
            color: '#00B0B2',
            data: [2400,1200,1600,2200,2100]
        }, 
        {
            name: 'Actual AMT',
            color: '#F6A030',
            data: [2100,800,1900,1700,1600]
        }],
        credits: {
        	enabled: false
        },
        legend: {
        	verticalAlign: 'top'
        }
   	});
};

//横屏YTD图表
var landscapeYtdChart=function(){
	$('#container4').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        xAxis: {
            categories: [
                'BQA',
                'BQC',
                'BQE',
                'BQL',
                'BQP',
            ],
            crosshair: true,
            tickmarkPlacement: 'on',
            tickWidth: 0,
            labels: {
            	style: {
            		'fontWeight': 'bold',
            		'fontSize': '15px',
            		'fontFamily': 'arial'
            	}
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            gridLineDashStyle: 'Dash',
            labels: {
            	formatter: function(){
            		return "$" + this.value + "M";
            	}
            }     
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}= </td>' +
            '<td style="padding:0"><b>${point.y:.1f}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0
            }
        },
		series: [{
            name: 'Budget AMT',
            color: '#00B0B2',
            data: [3600,2500,3000,2600,3500]
        }, 
        {
            name: 'Actual AMT',
            color: '#F6A030',
            data: [3500,2800,3200,2200,1900]
        }],
        credits: {
        	enabled: false
        },
        legend: {
        	verticalAlign: 'top'
        }
   	});
};

//根据表格内数值改变数据color
var changeColorByNum=function(){
	var span=document.getElementsByClassName('span-block');
	for(var i=0; i<span.length; i++){
		var str=span[i].innerText.substr(0,span[i].innerText.length-1);
		var num=parseInt(str);
		if(num >= 100){
			span[i].style.backgroundColor='#44A753';
		}
		else if(num < 100 && num >= 80){
			span[i].style.backgroundColor='gold';
		}
		else{
			span[i].style.backgroundColor='#E82D27';
		}	
	}	
};

//jquery mobile页面创建前事件监听
$(document).on("pagecreate",function(){
	//监听屏幕方向改变事件
	$(window).on("orientationchange",function(event){
		//竖屏（默认）
		if(event.orientation == "portrait") {
			$("#pageMain").show();
			$("#pageChart").hide();
		}
		//横屏
		else if(event.orientation == 'landscape'){
			//将竖屏时的宽赋给横屏时的高，竖屏时的高赋给横屏时的宽
			$("#container4").css({"width":landscapeHeight, "height":landscapeWidth});
			if(chartState == 1){
				$("#container4").html("");
				landscapeThisMonthChart();
			}
			else if(chartState == 2){
				$("#container4").html("");
				landscapeLastMonth();
			}
			else{
				$("#container4").html("");
				landscapeYtdChart();
			}
			$("#pageMain").hide();
			$("#pageChart").show();
		}	
	});
	
	//长按显示popup
	$("#btnTitle").on("taphold", function(){
		$("#dialogMsg").popup("open");
		$("#dialogMsg").css("z-index",100);
		popupState = 1;
	});
	
	//点击关闭popup
	$("#dialogClose").on("tap", function(){
		$("#dialogMsg").popup("close");
		$("#dialogMsg").css("z-index","auto");
		popupState = 0;
	});
	
	//点击显示panel
	$("#openPanel").on("tap", function(){
		$("#panel").panel("open");
		panelState = 1;
	});				
	
	//显示图表thisMonth
	$("#chart1").on("tap",function(){
		$("#container1").show();
		$("#container2").hide();
		$("#container3").hide();
		chartState = 1;
	});
	
	//显示图表lastMonth
	$("#chart2").on("tap",function(){
		$("#container1").hide();
		$("#container2").show();
		$("#container3").hide();
		chartState = 2;
	});
	
	//显示图表YTD
	$("#chart3").on("tap",function(){
		$("#container1").hide();
		$("#container2").hide();
		$("#container3").show();
		chartState = 3;
	});
	
	
});










