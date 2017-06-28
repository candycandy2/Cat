@include("layouts.lang")
<?php
$menu_name = "REPORT";
?>
@extends('layouts.admin_template')

@section('head')
    @parent
    <script src="{{asset('/js/report/basic_chart_option.js')}}"></script>
    <script src="{{asset('/js/report/report_detail.js')}}"></script>
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
        {{-- <li role="presentation" class="active"><a href="#tab_content_summary_report" data-toggle="tab">總覽</a></li> --}}
        @if ($data['project_code'] == '000')
        <li class="dropdown" id="regist"><a class="dropdown-toggle" data-toggle="dropdown" href="#">註冊統計<span class="caret"></span></a>
            <ul class="dropdown-menu" id="register_report">
                <li><a data-tabid="register_daily_report">每日註冊設備/用戶數</a></li>
                <li><a data-tabid="register_cumulative_report">累計註冊設備/用戶數</a></li>
            </ul>
        </li>
        @endif
        
        {{-- <li role="presentation"><a href="#tab_content_version" data-toggle="tab">用戶使用資料</a></li> --}}
        <li class="dropdown" id="api"><a class="dropdown-toggle" data-toggle="dropdown" href="#">API統計<span class="caret"></span></a>
            <ul class="dropdown-menu" id="api_report">
                <li><a data-tabid="api_call_frequency_report">Api呼叫次數與人數</a></li>
                <li><a data-tabid="api_operation_time_report">平均處理時間</a></li>
                {{-- <li><a data-tabid="api_crash_report">當機報告</a></li> --}}
            </ul>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade" id="tab_content_summary_report">
            @include('report.summary_report.active_users_report')
        </div> 
        <div class="tab-pane fade" id="register_report">
            
        </div>
        <div class="tab-pane fade" id="tab_content_version">
            
        </div>
        {{-- 註冊統計 --}}
        <div class="tab-pane fade" id="register_daily_report">
            @include('report.register_report.register_daily_report.report_layout')
        </div>
        <div class="tab-pane fade" id="register_cumulative_report">
            @include('report.register_report.register_cumulative_report.report_layout')
        </div>
        {{-- API統計 --}}
        <div class="tab-pane fade" id="api_call_frequency_report">
            @include('report.api_report.api_call_frequency_report.report_layout')
        </div>
        <div class="tab-pane fade" id="api_operation_time_report">
            @include('report.api_report.api_operation_time_report.report_layout')
        </div>
        <div class="tab-pane fade" id="api_crash_report">
            @include('report.api_report.api_crash_report.report_layout')
        </div>
    </div>

<script>
var d=new Date();
var appKey = "{{$data['app_key']}}"
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
</script>

@endsection