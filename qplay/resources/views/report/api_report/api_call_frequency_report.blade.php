<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>API呼叫次數與人數</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>
<div class="row"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted"></label></div>
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
 // $('.form_datetime').datetimepicker("setDate", new Date());
  $(".form_datetime").datetimepicker({
        autoclose: true,
        todayBtn: true,
        minView: "month"
    });
 });
</script>