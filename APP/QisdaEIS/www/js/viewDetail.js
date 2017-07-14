//get BU & CSD series
var companySeries1 = [20, 33, 53, 76];
var companySeries2 = [31, 26, 58, 43];
var companySeries3 = [46, 38, 21, 47];
var companySeries4 = [58, 37, 76, 51];
//area highcharts option
var areaOption = {
	chart: {
        type: 'area'
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






$('#viewDetail').pagecontainer({
	create: function (event, ui) {
		function getChartArea(){
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
			
		}
		
		
		/********************************** page event *************************************/
		$("#viewDetail").on("pagebeforeshow", function(event, ui){
			/* global PullToRefresh */

			
		});
		
		$('#viewDetail').on('pageshow', function(event, ui){
			getChartArea();
			
			
			$("label[for=viewDetail-tab-1]").addClass('ui-btn-active');
            $("label[for=viewDetail-tab-2]").removeClass('ui-btn-active');
            
			if (window.orientation === 90 || window.orientation === -90 ) {
                zoomInChart();
           	}
		});
		
	}
});


