@include("layouts.lang")
<?php
$menu_name = "REPORT";
?>
@extends('layouts.admin_template')

@section('head')
    @parent
    <script src="{{asset('/js/report/basic_chart_option.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/report_detail.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/summary/summary_report.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/api_report/api_call_frequency.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/api_report/api_operation_time.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/register_report/register_cumulative.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/register_report/register_daily.js?v='.config('app.static_version'))}}"></script>
    <script src="{{asset('/js/report/usage_report/push_service_hours.js?v='.config('app.static_version'))}}"></script>
@stop


@section('content')

    <div class="col-lg-12 col-xs-12">
        <span id="appInfo" style="padding-right: 30px;  line-height: 100px; font-size: 20px;">
            @if($data['icon_url']!="")
            <img id="app_icon" src="{{$data['icon_url']}}" class="img-rounded" width="60" height="60">
            @endif
            <b id="app_name" style="margin-left: 10px">{{$data['app_name']}}</b>
        </span>
        <div class="btn-toolbar" role="toolbar" style="float: right;">
            <a type="button" class="btn btn-default" id="goBack">
                {{trans("messages.RETURN")}}
            </a>
        </div>
    </div>
    <ul class="nav nav-tabs" id="navReport">
        @if ($data['project_code'] == '000')
        <li role="presentation" class="signle-page"><a href="#tab_content_summary_report" data-toggle="tab" data-tabid="summary_report">{{trans('messages.TAB_SUMMARY')}}</a></li>
        <li class="dropdown" id="regist"><a class="dropdown-toggle" data-toggle="dropdown" href="#">{{trans("messages.TAB_REGISTER_REPORT")}}<span class="caret"></span></a>
            <ul class="dropdown-menu" id="register_report">
                <li><a data-tabid="register_daily">{{trans("messages.TAB_REGISTER_DAILY")}}</a></li>
                <li><a data-tabid="register_cumulative">{{trans("messages.TAB_REGISTER_CUMULATIVE")}}</a></li>
            </ul>
        </li>
        <li class="dropdown" id="api"><a class="dropdown-toggle" data-toggle="dropdown" href="#">用戶使用資料<span class="caret"></span></a>
            <ul class="dropdown-menu" id="usage_report">
                <li><a data-tabid="push_service_hours">推播服務時段</a></li>
            </ul>
        </li>
         @endif
        <li class="dropdown" id="api"><a class="dropdown-toggle" data-toggle="dropdown" href="#">{{trans("messages.TAB_API_REPORT")}}<span class="caret"></span></a>
            <ul class="dropdown-menu" id="api_report">
                <li><a data-tabid="api_call_frequency">{{trans("messages.TAB_API_CALL_FREQUENCY")}}</a></li>
                <li><a data-tabid="api_operation_time">{{trans("messages.TAB_OPERATION_TIME")}}</a></li>
            </ul>
        </li>
    </ul>
    <div class="tab-content">
        {{-- 總覽 --}}
        <div class="tab-pane fade" id="summary_report">
            @include('report.summary.summary_report')
        </div> 
        <div class="tab-pane fade" id="register_report">
            
        </div>
        <div class="tab-pane fade" id="tab_content_version">
            
        </div>
        {{-- 註冊統計 --}}
        <div class="tab-pane fade" id="register_daily">
            @include('report.register_report.register_daily')
        </div>
        <div class="tab-pane fade" id="register_cumulative">
            @include('report.register_report.register_cumulative')
        </div>
        {{-- 用戶使用資料 --}}
         <div class="tab-pane fade" id="push_service_hours">
            @include('report.usage_report.push_service_hours')
        </div>
        {{-- API統計 --}}
        <div class="tab-pane fade" id="api_call_frequency">
            @include('report.api_report.api_call_frequency')
        </div>
        <div class="tab-pane fade" id="api_operation_time">
            @include('report.api_report.api_operation_time')
        </div>
    </div>

<script>
var appKey = "{{$data['app_key']}}",
    t = new Date(),
    timeOffset = t.getTimezoneOffset() * 60 * 1000 * -1;
</script>

@endsection