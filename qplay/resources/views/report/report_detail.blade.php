@include("layouts.lang")
<?php
$menu_name = "REPORT";
?>
@extends('layouts.admin_template')

@section('head')
    @parent
    <script src="{{asset('/js/report/basic_chart_option.js')}}"></script>
    <script src="{{asset('/js/report/report_detail.js')}}"></script>
    <script src="{{asset('/js/report/summary/summary_report.js')}}"></script>
    <script src="{{asset('/js/report/api_report/api_call_frequency.js')}}"></script>
    <script src="{{asset('/js/report/api_report/api_operation_time.js')}}"></script>
    <script src="{{asset('/js/report/register_report/register_cumulative.js')}}"></script>
    <script src="{{asset('/js/report/register_report/register_daily.js')}}"></script>
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
        <li role="presentation" class="signle-page"><a href="#tab_content_summary_report" data-toggle="tab" data-tabid="summary_report">總覽</a></li>
        <li class="dropdown" id="regist"><a class="dropdown-toggle" data-toggle="dropdown" href="#">註冊統計<span class="caret"></span></a>
            <ul class="dropdown-menu" id="register_report">
                <li><a data-tabid="register_daily">每日註冊設備/用戶數</a></li>
                <li><a data-tabid="register_cumulative">累計註冊設備/用戶數</a></li>
            </ul>
        </li>
        @endif
        
        {{-- <li role="presentation"><a href="#tab_content_version" data-toggle="tab">用戶使用資料</a></li> --}}
        <li class="dropdown" id="api"><a class="dropdown-toggle" data-toggle="dropdown" href="#">API統計<span class="caret"></span></a>
            <ul class="dropdown-menu" id="api_report">
                <li><a data-tabid="api_call_frequency">Api呼叫次數與人數</a></li>
                <li><a data-tabid="api_operation_time">平均處理時間</a></li>
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