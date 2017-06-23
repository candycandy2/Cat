<div class="col-lg-12 col-md-12 col-xs-12" id="">
    <div id="container_stock_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
</div>
<script>

var createDailyRegisterMultiLine = function (res){

    var registerDeviceData=[],
        registerUSerData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt();
    for (var k in res){
        if (typeof res[k] !== 'function') {
             var tmpDeviceArr = [dateToUTC(k),res[k].count];
             var tmpUsersArr = [dateToUTC(k),res[k].users.length];
             registerDeviceData.push(tmpDeviceArr);
             registerUSerData.push(tmpUsersArr);
        }
    }
    options.series = [{
        name:"每日註冊設備數",
        data:[]
    },{
        name:"每日註冊用戶數",
        data:[]
    }];

    options.plotOptions.series.point.events = {
        click: function (e) {
             createDailyRegisterTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
             updateDailyRegisterDonutChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
        }
    };
    createDailyRegisterMultiLineChart(options);
    var chart = $('#container_stock_{{$REPORT_TYPE}}_1').highcharts();
    chart.series[0].setData(registerDeviceData);
    chart.series[1].setData(registerUSerData);
}

function createDailyRegisterMultiLineChart(options) {
    
    Highcharts.stockChart('container_stock_{{$REPORT_TYPE}}_1', options,
    function (chart) {
            // apply the date pickers
            setTimeout(function () {
                $('input.highcharts-range-selector', $(chart.container).parent())
                    .datepicker();
            }, 0);       
        }
    );

    // Set the datepicker's date format
    $.datepicker.setDefaults({
        dateFormat: 'yy-mm-dd',
        onSelect: function () {
            this.onchange();
            this.onblur();
        }
    });
}
</script>