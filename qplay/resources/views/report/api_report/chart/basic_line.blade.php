<div class="col-lg-12 col-md-12 col-xs-12" id="">
   <div class="time_container">
        <div class='col-md-3'>
            <div class="form-group">
                <div class="input-group date form_datetime" data-date="" data-date-format="yyyy-MM-dd" data-link-format="yyyy-mm-dd"
                     data-link-field="tbxScheduleDate" >
                    <input class="form-control" size="16" type="text" value="" readonly>
                    <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                </div>
                <input type="hidden" id="tbxScheduleDateTime" value="" /><br/>
            </div>
        </div>
        <div class='col-md-3'>
            <div class="form-group">
                <div class="input-group date form_datetime" data-date="" data-date-format="yyyy-MM-dd" data-link-format="yyyy-mm-dd"
                     data-link-field="tbxScheduleDate" >
                    <input class="form-control" size="16" type="text" value="{{$data['reportEndDate']}}" readonly>
                    <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                </div>
                <input type="hidden" id="tbxScheduleDateTime" value="" /><br/>
            </div>
        </div>
    </div>
    <div class="btn-group pull-right">
      <button type="button" class="btn btn-default">7 天</button>
      <button type="button" class="btn btn-default">3 個月</button>
      <button type="button" class="btn btn-default">6 個月</button>
      <button type="button" class="btn btn-default">不限</button>
    </div>
</div>
<div class="col-lg-12 col-md-12 col-xs-12">
    <div id="container" style="width:100%; height:400px;"></div>
</div>
<script>

var getApiLogBasicLine = function(){
    var mydata = {app_key:"{{$data['app_key']}}"};
    var mydataStr = $.toJSON(mydata);
    var totalCountArr = [];
    var distinctCountArr = [];
    var startDate = [];
    $.ajax({
      url:"reportDetail/getCallApiReportBasicLine",
      type:"POST",
      dataType:"json",
      contentType: "application/json",
      data:mydataStr,
      success: function(r){
            if(!$.isEmptyObject(r)){
                totalCountArr = r.totalCount;
                distinctCountArr = r.distinctCount;
                startDate = r.startDate.split('-');
                creatBasicLine(totalCountArr, distinctCountArr);
                getTableView();
            }
       }
    });
}


var creatBasicLine = function(totalCountArr,distinctCountArr){
    Highcharts.chart('container', {
        title: {
            text: 'Solar Employment Growth by Sector, 2010-2016'
        },

        subtitle: {
            text: 'Source: thesolarfoundation.com'
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title: {
                text: 'Number of Employees'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                //pointStart: Date.UTC(startDate[0], startDate[1]-1, startDate[2]),
                pointInterval: 24 * 3600 * 1000 // one day
            }
        },

        series: [{
            name: '呼叫次數',
            data: totalCountArr
        }, {
            name: '呼叫人數',
            data: distinctCountArr
        }]
    });

}


</script>