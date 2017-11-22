<?php
$REPORT_TYPE = 'message_read_rate';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>{{trans('messages.TAB_MESSAGE_READ_RATE')}}</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>
<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted"></label></div>
        <div class="col-lg-12 col-xs-12" id="">
            <img class="loader" id="loading-indicator" style="display:" />
            <div id="container_stock_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
        </div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div id="table_{{$REPORT_TYPE}}_1">
    <div><label class="text-muted">2017-03-03</label></div>
        <img class="loader" id="loading-indicator" style="display:" />
        <div class="table-responsive">
                <table class="table table-bordered table-striped report-table">
                   <thead>
                      <tr>
                         <th rowspan="2" data-field="_id.action" class="table-title">
                            <div class="th-inner ">{{trans('messages.MESSAGE_SOURCE')}}</div>
                         </th>
                         <th rowspan="2" data-field="1" class="table-title bg-color-blue">
                            <div class="th-inner ">{{trans('messages.PUSH_SEND_COUNT')}}</div>
                         </th>
                         <th rowspan="2" data-field="2" class="table-title bg-color-pink">
                            <div class="th-inner ">{{trans('messages.PUSH_READ_COUNT')}}</div>
                         </th>
                         <th class="js-data-title table-title bg-color-blue">
                            <div class="th-inner">{{trans('messages.PUSH_SEND_COUNT')}}</div>
                         </th>
                         <th class="js-data-title table-title bg-color-pink">
                            <div class="th-inner">{{trans('messages.PUSH_READ_COUNT')}}</div>
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
        <div><label class="text-muted"></label></div>
        <div class="col-lg-12 col-xs-12" id="">
            <img class="loader" id="loading-indicator" style="display:" />
            <div id="container_column_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
        </div>
    </div>
</div>
