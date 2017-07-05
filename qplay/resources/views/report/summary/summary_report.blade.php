<?php
$REPORT_TYPE = 'summary_report';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>總覽</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>

<!-- <img class="loader" id="loading-indicator" style="display:" /> -->

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-5 col-xs-12" id="">
        <div><label class="text-muted">註冊總設備數</label></div>
        <div><label class="text-primary" id="registed_device_count" style="font-size:35px;"></label></div>
        <div id="container_semi_circle_chart_{{$REPORT_TYPE}}_1" class="responsive_container"></div>
    </div>
     <div class="col-lg-5 col-xs-12" id="">
        <div><label class="text-muted">註冊總用戶數</label></div>
        <div><label class="text-primary" id="registed_user_count" style="font-size:35px;"></label></div>
        <div id="container_semi_circle_chart_{{$REPORT_TYPE}}_2" class="responsive_container"></div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-5 col-xs-12" id="">
        <div><label class="text-muted">活躍設備數</label></div>
        <div><label class="text-primary" id="active_device_count" style="font-size:35px;"></label></div>
        <div id="container_semi_circle_chart_{{$REPORT_TYPE}}_3" class="responsive_container"></div>
    </div>
    <div class="col-lg-5 col-xs-12" id="">
        <div><label class="text-muted">活躍用戶數</label></div>
        <div><label class="text-primary" id="active_user_count" style="font-size:35px;"></label></div>
        <div id="container_semi_circle_chart_{{$REPORT_TYPE}}_4" class="responsive_container"></div>
    </div>
</div>