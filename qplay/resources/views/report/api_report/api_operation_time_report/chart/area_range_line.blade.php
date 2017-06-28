<div id="area_range_line_{{$REPORT_TYPE}}_1" class="col-lg-12 col-md-12 col-xs-12">
    <div><label class="text-muted">詳細資料</label></div>
    <div id="container_api_operation_time_area_range_line_1" style="height: 400px; min-width: 310px"></div>
</div>

<script>
var updateApiOperationTimeAreaRangeLineChart = function (date,actionName){

    var chart = $('#container_api_operation_time_area_range_line_1').highcharts();
    var ranges=[],
        averages=[];
    $('.loader').show();
    var mydata = {app_key:appKey, date:date, timeZone:timeZone, action:actionName},
        mydataStr = $.toJSON(mydata),
        res={};
        
    var storage = ExtSessionStorage(appKey);
    $.ajax({
          url:"reportDetail/getApiOperationTimeDetailReport",
          type:"POST",
          dataType:"json",
          contentType: "application/json",
          data:mydataStr,
            success: function(r){
                r = sortByInterval(r);
                $.each(r,function(i,data){
                    var tmpRange = [dateToUTC(data._id.interval), data.min * 1000, data.max * 1000];
                    ranges.push(tmpRange);
                    var tmpAverage = [dateToUTC(data._id.interval),  Math.round(data.avg * 1000 * 10) / 10 ];
                    averages.push(tmpAverage);
                });
                chart.series[0].setData(averages);
                chart.series[1].setData(ranges);
            },
            error: function (e) {
                showMessageDialog(Messages.Error,Messages.MSG_OPERATION_FAILED, e.responseText);
            }
        }).done(function() {
            $('.loader').hide();
        });
}
var createApiOperationTimeRangeLineChart = function(options){
    Highcharts.chart('container_api_operation_time_area_range_line_1',options);
}

function sortByInterval(obj){
    obj = obj.sort(function (a, b) {
     return a._id.interval < b._id.interval ? -1 : 1;
    });
    return obj;
}
</script>