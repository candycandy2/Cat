<div class="col-lg-12 col-md-12 col-xs-12" id="">
    <div id="container_stock_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
    <div id="report" style="font: 0.8em sans-serif"></div>
</div>

<script>
var createApiOperationTimeMultiLine = function (res){
    var OperationTimeData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt()
       
    for (var k in res){
        if (typeof res[k] !== 'function') {
            i=0;
            var tmpAvgTotal = 0,
                i=0;
            for (var j in res[k]){
                 tmpAvgTotal = tmpAvgTotal + res[k][j].avg;
                 i++;
            }
            var tmpTimeArr = [dateToUTC(k),tmpAvgTotal/i];
            OperationTimeData.push(tmpTimeArr);
            OperationTimeData = sortObject(OperationTimeData);
        }
    }
    options.series = [{
        name:"平均處理時間",
        data:[]
    }];
    options.plotOptions.series.point.events = {
        click: function (e) {
             createOperationTimeTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
        }
    }
    createApiOperationTimeMultiLineChart(options);
    var chart = $('#container_stock_{{$REPORT_TYPE}}_1').highcharts();
    chart.series[0].setData(OperationTimeData);
}


function createApiOperationTimeMultiLineChart(options) {
    
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