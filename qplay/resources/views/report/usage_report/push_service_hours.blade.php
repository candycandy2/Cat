<?php
$REPORT_TYPE = 'push_service_hours';
?>
<div class="row">
    <div class="col-lg-12 col-xs-12" id="">
        <h4><b>推播服務時段</b></h4>
        <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    </div>
</div>
<!-- <img class="loader" id="loading-indicator" style="display:" /> -->

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
        <div><label class="text-muted"></label></div>
        <div class="col-lg-12 col-md-12 col-xs-12" id="">
            <div id="container_column_{{$REPORT_TYPE}}_1" style="height: 400px; min-width: 310px"></div>
            <div id="report" style="font: 0.8em sans-serif"></div>
        </div>
    </div>
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id=""> 
        <div id="table_{{$REPORT_TYPE}}_1">
            <div><label class="text-muted js-table_date sub-title">2017-03-03~2017-03-10 熱門時段</label></div>
            <div class="table-responsive">
                <table class="table report-table">
                  <thead>
                    <tr>
                      <th class="table-title">總排名</th>
                      <th class="table-title">熱門時段</th>
                      <th class="table-title">使用次數</th>
                    </tr>
                  </thead>
                  <tbody>
                   {{--  <tr>
                      <th scope="row">TOP 1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                    </tr>
                    <tr>
                      <th scope="row">TOP 2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                    </tr>
                    <tr>
                      <th scope="row">TOP 3</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                    </tr> --}}
                  </tbody>
                </table>
            </div>
        </div>
    </div>
 
</div>

<div class="row js-report-block"  style="margin:5% 0 5% 0">
    <div class="col-lg-1" id=""></div>
    <div class="col-lg-10 col-xs-12" id="">
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