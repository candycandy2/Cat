/*Multi Line*/
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
    var chart = $('#container_stock_api_operation_time_1').highcharts();
    chart.series[0].setData(OperationTimeData);
}


function createApiOperationTimeMultiLineChart(options) {
    
    Highcharts.stockChart('container_stock_api_operation_time_1', options,
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

/*Table*/

var createOperationTimeTableChart = function(res,date){
    $tableChartDiv = $('#table_api_operation_time_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('tbody').empty();
    createOperationTimeTable(res,date);
    sortTable('table_api_operation_time_1');
    updateApiOperationTimeAreaRangeLineChart(date,$.trim($tableChartDiv.find('table u').eq(0).text()));
}

var createOperationTimeTable = function(res,date){
    $tableChartDiv = $('#table_api_operation_time_1');
    if(typeof res[date] == 'undefined'){
        $tableChartDiv.find('tbody').html('<tr><td colspan="5">沒有匹配的紀錄</td></tr>');
        return false;
    }
    var res = res[date];
    var sumCount = 0;
    var sumAvg = 0; 
    var actionCount=0;
    $.each(res, function(actionName, data){
      var td = '<td class="js-v-t text-blod">' + data.count + '</td><td class="js-v-d text-blod">' +  Math.round(data.avg * 100) / 100  + '</td><td>' +data.min+ '</td><td>' + data.max + '</td>';
      var tr = '<tr class="js-' + actionName + '" style="cursor:pointer"><th scope="row"><u>' + actionName + '</u></th>' + td + '</tr>';
      $tableChartDiv.find('.js-row').append(tr);
      sumCount = sumCount + data.count;
      sumAvg = sumAvg + data.avg;
      actionCount ++;
    });
    
    //add last total row
    $tableChartDiv.find('.js-row').append('<tr class="js-total"><th scope="row"></th><td>' + sumCount + '</td><td>(平均)' +  Math.round((sumAvg/actionCount) * 100) / 100 + '</td><td></td><td></td></tr>');
    
    $tableChartDiv.find('table u').click(function(){
       updateApiOperationTimeAreaRangeLineChart(date,$.trim($(this).text()));
     });

}

/*Area Range*/

var updateApiOperationTimeAreaRangeLineChart = function (date,actionName){

    var chart = $('#container_api_operation_time_area_range_line_1').highcharts();
    var ranges=[],
        averages=[];
    $('.loader').show();
    var mydata = {app_key:appKey, date:date, timeOffset:timeOffset, action:actionName},
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