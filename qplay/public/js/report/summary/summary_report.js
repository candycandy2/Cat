$(function() {
    var defaultOpt = getSemiDonutChartOpt();
    Highcharts.chart('container_semi_circle_chart_summary_report_1', defaultOpt);
    Highcharts.chart('container_semi_circle_chart_summary_report_2', defaultOpt);
    Highcharts.chart('container_semi_circle_chart_summary_report_3', defaultOpt);
    Highcharts.chart('container_semi_circle_chart_summary_report_4', defaultOpt);

    $( window ).resize(function() {
        var container = $('.responsive_container');
        $.each(container, function(i,chart){
            var charObj = $(chart).highcharts();
            charObj.redraw();
            charObj.reflow();
        });
    });

});

var createSmmaryRegistedDeviceChart = function(res){
    var chart =  $('#container_semi_circle_chart_summary_report_1').highcharts(),
        title = "累計註冊<br>設備比例<br>( 依系統 ) ",
        seriesName = "Reigisted Device",
        $sumContainer = $('#registed_device_count');
    _createSummaryDeviceChart(res, chart, title, seriesName, $sumContainer);
};

var createSmmaryRegistedUserChart = function(res){
    var chart =  $('#container_semi_circle_chart_summary_report_2').highcharts(),
        title = "累計註冊<br>用戶比例<br>( 依公司+地區 ) ",
        seriesName = "Reigisted User",
        $sumContainer = $('#registed_user_count');
    _createSummaryUserChart(res, chart, title, seriesName, $sumContainer);
};

var createSmmaryActiveDeviceChart = function(res){
    var chart =  $('#container_semi_circle_chart_summary_report_3').highcharts(),
        title = "Token有效<br>設備比例<br>( 依系統 ) ",
        seriesName = "Active Device",
        $sumContainer = $('#active_device_count');
    _createSummaryDeviceChart(res, chart, title, seriesName, $sumContainer);
};
var createSmmaryActiveUserChart = function(res){
    var chart =  $('#container_semi_circle_chart_summary_report_4').highcharts(),
        title = "Token有效<br>用戶比例<br>( 依公司+地區 ) ",
        seriesName = "Active User",
        $sumContainer = $('#active_user_count');
    _createSummaryUserChart(res, chart, title, seriesName, $sumContainer);
};

var _createSummaryDeviceChart = function(res, chart, title, seriesName, $sumContainer){
    var data = [];
    var sum = 0;
    $.each(res, function(i,d){
        data.push([i,d]);
        sum = sum + d;
    });
    chart.setTitle({text: title});
    chart.series[0].setData(data);
    chart.series[0].update({name: seriesName});
    $sumContainer.text(sum);
};

var _createSummaryUserChart = function(res, chart, title, seriesName, $sumContainer){
    var data = [];
    var sum = 0;
    $.each(res, function(i,d){
        data.push([i,d.length]);
        sum = sum + d.length;
    });
    chart.setTitle({text: title});
    chart.series[0].setData(data);
    chart.series[0].update({name: seriesName});
    $sumContainer.text(sum);
};