<?php
$REPORT_TYPE = 'api_call_frequency';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>{{trans('messages.TAB_API_CALL_FREQUENCY')}}</b></h4>
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
        <div id="table_{{$REPORT_TYPE}}_1">
    <div><label class="text-muted">2017-03-03</label></div>
        <div class="table-responsive">
                <table class="table table-bordered table-striped report-table">
                   <thead>
                      <tr>
                         <th rowspan="2" data-field="_id.action" class="table-title">
                            <div class="th-inner ">API {{trans('messages.NAME')}}</div>
                         </th>
                         <th rowspan="2" data-field="1" class="table-title bg-color-blue">
                            <div class="th-inner ">API {{trans('messages.API_CALL_TIMES')}}</div>
                         </th>
                         <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                            <div class="th-inner ">API {{trans('messages.API_CALL_USERS')}}</div>
                         </th>
                         <th class="js-data-title table-title bg-color-blue">
                            <div class="th-inner">API {{trans('messages.API_CALL_TIMES')}}_{{trans('messages.COMPANY')}}+{{trans('messages.SITE')}}</div>
                         </th>
                         <th class="js-data-title table-title bg-color-pink">
                            <div class="th-inner">API {{trans('messages.API_CALL_USERS')}}_{{trans('messages.COMPANY')}}+{{trans('messages.SITE')}}</div>
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
        <div id="{{$REPORT_TYPE}}_donutchart">
            <div><label class="text-muted">{{trans('messages.DETAILS')}}</label></div>
            <div class="col-lg-12 col-md-12 col-xs-12">
                <div id="container_donut_chart_{{$REPORT_TYPE}}_t"  style="height: 500px;"></div>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12">
                <div id="container_donut_chart_{{$REPORT_TYPE}}_d"  style="height: 500px;"></div>    
            </div>
        </div>
    </div>
</div>