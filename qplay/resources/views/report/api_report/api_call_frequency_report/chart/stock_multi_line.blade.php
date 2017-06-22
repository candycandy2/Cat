<div class="col-lg-12 col-md-12 col-xs-12" id="">
    <div id="container_stock_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
</div>
<script>

var createCallApiMultiLine = function (res){

    var callUsersData=[],
        callTimesData=[],
        seriesOptions = [],
        options = getMultiLineChartOpt();
   
    for (var k in res){
        if (typeof res[k] !== 'function') {
             var tmpTimesArr = [dateToUTC(k),res[k].times];
             var tmpUsersArr = [dateToUTC(k),res[k].users.length];
             callTimesData.push(tmpTimesArr);
             callUsersData.push(tmpUsersArr);
             callUsersData = sortObject(callUsersData);
             callTimesData = sortObject(callTimesData);
        }
    }

    options.series = [{
        name:"呼叫次數",
        data:[]
    },{
        name:"呼叫人數",
        data:[]
    }];

    options.plotOptions.series.point.events = {
        click: function (e) {
             createCallApiTableChart(res, Highcharts.dateFormat('%Y-%m-%d',this.x));
        }
    };
    createCallApiMultiLineChart(options);
    var chart = $('#container_stock_{{$REPORT_TYPE}}_1').highcharts();
    chart.series[0].setData(callTimesData);
    chart.series[1].setData(callUsersData);
}

function createCallApiMultiLineChart(options) {
    
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