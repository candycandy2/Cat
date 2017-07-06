<?php
$REPORT_TYPE = 'api_operation_time';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>平均處理時間</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>
<img class="loader" id="loading-indicator" style="display:" />

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted"></label></div>
        <div class="col-lg-12 col-md-12 col-xs-12" id="">
            <div id="container_stock_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
            <div id="report" style="font: 0.8em sans-serif"></div>
        </div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
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
    </div>
 
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
     <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div id="area_range_line_{{$REPORT_TYPE}}_1" class="col-lg-12 col-md-12 col-xs-12">
            <div><label class="text-muted">詳細資料</label></div>
            <div id="container_api_operation_time_area_range_line_1" style="height: 400px; min-width: 310px"></div>
        </div>
    </div>
</div>