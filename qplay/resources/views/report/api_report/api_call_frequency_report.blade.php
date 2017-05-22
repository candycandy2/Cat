<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>API呼叫次數與人數</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>
<div class="row"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
       <div class="time_container">
            <div class='col-md-3'>
                <div class="form-group">
                    <div class='input-group date' id='datetimepicker6'>
                        <input type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
                </div>
            </div>
            <div class='col-md-3'>
                <div class="form-group">
                    <div class='input-group date' id='datetimepicker7'>
                        <input type='text' class="form-control" />
                        <span class="input-group-addon">
                            <span class="glyphicon glyphicon-calendar"></span>
                        </span>
                    </div>
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
</div>

<div class="row"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted">2017-03-03</label></div>
       @include('report.api_report.chart.basic_line')
    </div>
</div>

<div class="row"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted">2017-03-03</label></div>
        @include('report.api_report.chart.table')
    </div>
 
</div>

<div class="row"  style="margin:5% 0 5% 0">
     <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted">詳細資料</label></div>
        @include('report.api_report.chart.donut_chart')
    </div>

</div>

<script>
$(function () {

    $('#datetimepicker6').datetimepicker();
    $('#datetimepicker7').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });
    $("#datetimepicker6").on("dp.change", function (e) {
        $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
    });
    $("#datetimepicker7").on("dp.change", function (e) {
        $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
    });

 });
</script>