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

var iniSummaryReport = function(){
     var mydata = {timeOffset:timeOffset},
         mydataStr = $.toJSON(mydata),
         registedDeviceRes={};
         registedUserRes={};
         activeDeviceRes = {};
         activeUserRes = {};
     /* 註冊設備/用戶數 */

     $('.loader').show();
     $('.responsive_container').hide();

     $.ajax({
      url:"reportDetail/getRegisterDailyReport",
      type:"POST",
      dataType:"json",
      data:mydataStr,
      contentType: "application/json",
        success: function(r){
            $.each(r,function(i,d){
                if(!registedDeviceRes.hasOwnProperty(d.device_type)){
                    registedDeviceRes[d.device_type] = 0;
                }
                var companySite = d.company +'_'+ d.site_code;
                if(!registedUserRes.hasOwnProperty(companySite)){
                    registedUserRes[companySite] = [];
                }
                if($.inArray(d.user_row_id, registedUserRes[companySite]) == -1){
                    registedUserRes[companySite].push(d.user_row_id);
                }
                registedDeviceRes[d.device_type] = registedDeviceRes[d.device_type]  + d.count;
            });
           
            createSmmaryRegistedDeviceChart(sortObjectByKey(registedDeviceRes));
            createSmmaryRegistedUserChart(sortObjectByKey(registedUserRes));
        },
        error: function (e) {
            showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
        }
    }).done(function() {
        $('#registed_device_block .loader').hide();
        $('#registed_user_block .loader').hide();
        $('#registed_device_block .responsive_container').show();
        $('#registed_user_block .responsive_container').show();
    });
    /* 活躍設備/用戶數 */
    $.ajax({
      url:"reportDetail/getActiveRegisterReport",
      type:"POST",
      dataType:"json",
      contentType: "application/json",
        success: function(r){
            $.each(r,function(i,d){
                if(!activeDeviceRes.hasOwnProperty(d.device_type)){
                    activeDeviceRes[d.device_type] = 0;
                }
                var companySite = d.company +'_'+ d.site_code;
                if(!activeUserRes.hasOwnProperty(companySite)){
                    activeUserRes[companySite] = [];
                }
                if($.inArray(d.user_row_id, activeUserRes[companySite]) == -1){
                    activeUserRes[companySite].push(d.user_row_id);
                }
                activeDeviceRes[d.device_type] = activeDeviceRes[d.device_type]  + d.count;
            });
            createSmmaryActiveDeviceChart(sortObjectByKey(activeDeviceRes));
            createSmmaryActiveUserChart(sortObjectByKey(activeUserRes));
        },
        error: function (e) {
            showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
        }
    }).done(function() {
        $('#active_device_block .loader').hide();
        $('#active_user_block .loader').hide();
        $('#active_device_block .responsive_container').show();
        $('#active_user_block .responsive_container').show();
    });
};

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