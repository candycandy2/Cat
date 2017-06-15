<?php
$REPORT_TYPE = 'api_operation_time_report';
$CHART_BLADE_PATH = 'report.api_report.'. $REPORT_TYPE .'.chart.';
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
       @include($CHART_BLADE_PATH . 'stock_multi_line')
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        @include($CHART_BLADE_PATH . 'table')
    </div>
 
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
     <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        @include($CHART_BLADE_PATH . 'area_range_line')
    </div>
</div>