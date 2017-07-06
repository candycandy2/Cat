<?php
$REPORT_TYPE = 'register_cumulative';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>累計註冊設備/用戶數</b></h4>
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
        </div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
     <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
       <div id="{{$REPORT_TYPE}}_donutchart">
            <div><label class="text-muted"></label></div>
            <div class="col-lg-12 col-md-12 col-xs-12">
                <div id="container_donut_chart_{{$REPORT_TYPE}}_1"  style="height: 500px;"></div>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12">
                <div id="container_donut_chart_{{$REPORT_TYPE}}_2"  style="height: 500px;"></div>    
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12">
                <div id="container_donut_chart_{{$REPORT_TYPE}}_3"  style="height: 500px;"></div>    
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12">
                <div id="container_donut_chart_{{$REPORT_TYPE}}_4"  style="height: 500px;"></div>    
            </div>
        </div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
       <div id="table_{{$REPORT_TYPE}}_1">
    <div><label class="text-muted"></label></div>
    <div class="table-responsive">
            <table class="table table-bordered table-striped report-table">
               <thead>
                  <tr>
                     <th rowspan="2" data-field="_id.action" class="table-title">
                        <div class="th-inner ">系統 名稱</div>
                     </th>
                     <th rowspan="2" data-field="1" class="table-title bg-color-blue">
                        <div class="th-inner ">註冊設備數</div>
                     </th>
                     <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                        <div class="th-inner ">註冊用戶數</div>
                     </th>
                     <th class="js-data-title table-title bg-color-blue">
                        <div class="th-inner">註冊設備數_公司+地區</div>
                     </th>
                     <th class="js-data-title table-title bg-color-pink">
                        <div class="th-inner">註冊用戶數_公司+地區</div>
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