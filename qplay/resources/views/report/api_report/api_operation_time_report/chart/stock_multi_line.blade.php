<div class="col-lg-12 col-md-12 col-xs-12" id="">
    <div id="container_stock_2" style="height: 400px; min-width: 310px"></div>
</div>

<script>
var createApiOperationTimeMultiLine = function (res){
    var OperationTimeData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt();
    for (var k in res){
        if (typeof res[k] !== 'function') {
            for (var j in res[k]){
                var tmpTimeArr = [dateToUTC(k),res[k][j].avg];
                OperationTimeData.push(tmpTimeArr);
                OperationTimeData = sortObject(OperationTimeData);
            }
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
    var chart = $('#container_stock_2').highcharts();
    chart.series[0].setData(OperationTimeData);
}


function createApiOperationTimeMultiLineChart(options) {
    
    Highcharts.stockChart('container_stock_2', options,
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