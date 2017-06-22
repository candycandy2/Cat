<div id="table_{{$REPORT_TYPE}}_1">
    <div><label class="text-muted js-table_date">2017-03-03</label></div>
    <div class="table-responsive">
        <table class="table table-bordered table-striped report-table">
           <thead>
              <tr>
                 <th rowspan="2" data-field="_id.action" class="table-title">
                    <div class="th-inner ">API 名稱</div>
                 </th>
                 <th rowspan="2" data-field="1" class="table-title">
                    <div class="th-inner ">API 呼叫次數</div>
                 </th>
                 <th rowspan="2" data-field="2" class="table-title bg-color-blue">
                    <div class="th-inner ">平均處理時間<br>(毫秒)</div>
                 </th>
                 <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                    <div class="th-inner ">最快處理時間<br>(毫秒)</div>
                 </th>
                 <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                    <div class="th-inner ">最慢處理時間<br>(毫秒)</div>
                 </th>
              </tr>
              <tr class="js-sub-title">
              </tr>
           </thead>
           <tbody class="js-row">
           </tbody>
        </table>
    </div>
</div>
<script>

var createOperationTimeTableChart = function(res,date){
    $tableChartDiv = $('#table_{{$REPORT_TYPE}}_1');
    $tableChartDiv.find('.text-muted').text(date);
    $tableChartDiv.find('tbody').empty();
    createOperationTimeTable(res,date);
    sortTable('table_{{$REPORT_TYPE}}_1');
    updateApiOperationTimeAreaRangeLineChart(date,$.trim($tableChartDiv.find('table u').eq(0).text()));
}

var createOperationTimeTable = function(res,date){
    $tableChartDiv = $('#table_{{$REPORT_TYPE}}_1');
    if(typeof res[date] == 'undefined'){
        return false;
    }
    var res = res[date];
    var sumCount = 0;
    var sumAvg = 0; 
    $.each(res, function(actionName, data){
      var td = '<td class="js-v-t text-blod">' + data.count + '</td><td class="js-v-d text-blod">' +  Math.round(data.avg * 10) / 10  + '</td><td>' +data.min+ '</td><td>' + data.max + '</td>';
      var tr = '<tr class="js-' + actionName + '" style="cursor:pointer"><th scope="row"><u>' + actionName + '</u></th>' + td + '</tr>';
      $tableChartDiv.find('.js-row').append(tr);
      sumCount = sumCount + data.count;
      sumAvg = sumAvg + data.avg;
    });
    
    //add last total row
    $tableChartDiv.find('.js-row').append('<tr class="js-total"><th scope="row"></th><td>' + sumCount + '</td><td>(平均)' +  Math.round(sumAvg * 10) / 10 + '</td><td></td><td></td></tr>');
    
    $tableChartDiv.find('table u').click(function(){
       updateApiOperationTimeAreaRangeLineChart(date,$.trim($(this).text()));
     });

}
</script>