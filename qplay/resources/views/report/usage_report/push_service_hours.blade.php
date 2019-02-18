<?php
$REPORT_TYPE = 'push_service_hours';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>{{trans('messages.TAB_PUSH_SERVICE_HOURS')}}</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>
<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted"></label></div>
        <div class="col-lg-12 col-xs-12" id="">
            {{-- <div class="btn-group blocks pull-right report-input">
                <span>From</span>
                <input id="push_date_from" type="" name="">
                <span>To</span>
                <input id="push_date_to" type="" name="">
            </div> --}}
        </div>
        <div class="col-lg-12 col-md-12 col-xs-12" id="">
            <img class="loader" id="loading-indicator" style="display:" />
            <div id="container_column_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
        </div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id=""> 
        <img class="loader" id="loading-indicator" style="display:" />
        <div id="table_{{$REPORT_TYPE}}_1" >
            <div><label class="text-muted js-table_date sub-title"></label></div>
            <div class="table-responsive">
                <table class="table report-table">
                  <thead>
                    <tr>
                      <th class="table-title">{{trans('messages.TOTAL_RANKING')}}</th>
                      <th class="table-title">{{trans('messages.POPULAR_TIMES')}}</th>
                      <th class="table-title">{{trans('messages.USAGE_COUNT')}}</th>
                    </tr>
                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
        </div>
    </div>
 
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <img class="loader" id="loading-indicator" style="display:" />
        <div class="table-responsive" id="table_{{$REPORT_TYPE}}_2" >
            <table class="table table-bordered table-striped report-table">
              <thead>
                <tr>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
        </div>
    </div>
</div>