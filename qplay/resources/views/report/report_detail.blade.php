@include("layouts.lang")
<?php
$menu_name = "REPORT";
?>
@extends('layouts.admin_template')
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
    <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#tab_content_summary_report" data-toggle="tab">總覽</a></li>
        <li role="presentation"><a href="#tab_content_pic" data-toggle="tab">註冊統計</a></li>
        <li role="presentation"><a href="#tab_content_version" data-toggle="tab">用戶使用資料</a></li>
        <li class="dropdown" id="api"><a class="dropdown-toggle" data-toggle="dropdown" href="#">API統計<span class="caret"></span></a>
            <ul class="dropdown-menu" id="api_report">
                <li><a data-tabid="api_call_frequency_report">Api呼叫次數與人數</a></li>
                <li><a data-tabid="api_operation_time_report">平均處理時間</a></li>
                <li><a data-tabid="api_crash_report">當機報告</a></li>
            </ul>
        </li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade" id="tab_content_summary_report">
            @include('report.summary_report.active_users_report')
        </div> 
        <div class="tab-pane fade" id="tab_content_pic">
            
        </div>
        <div class="tab-pane fade" id="tab_content_version">
            
        </div>
        <div class="tab-pane fade" id="api_call_frequency_report">
            @include('report.api_report.api_call_frequency_report')
        </div>
        <div class="tab-pane fade" id="api_operation_time_report">
            @include('report.api_report.api_operation_time_report')
        </div>
        <div class="tab-pane fade" id="api_crash_report">
            @include('report.api_report.api_crash_report')
        </div>
    </div>
<script>

$(function () {
    
    $('#goBack').click(function(){
        window.location='{{asset('report')}}';
    });

    $('.dropdown-menu > li > a').click(function(){
        
        $('.nav-tabs > li.active').removeClass('active');
        $('#api_report > li.active').removeClass('active');
        var openId = $(this).data('tabid');
        $(this).parents('li').addClass('active');
        $('.tab-content > div.active').removeClass('active').removeClass('in')
        $('#' + openId).addClass('active').addClass('in');
        
    });

    // var mydata = {app_row_id:getUrlVar('app_row_id')};
    // var mydataStr = $.toJSON(mydata);
    // $.ajax({
    //     url: "reportDetail/getApiReport",
    //     dataType: "json",
    //     type: "POST",
    //     contentType: "application/json",
    //     data: mydataStr,
    //     success: function (d, status, xhr) {
    //         if(d.icon_url!=""){
    //             $('#appInfo').prepend('<img id="app_icon" src="'+d.icon_url+'" class="img-rounded" width="60" height="60">');
    //         }
    //         $('#app_name').text(d.app_name);
    //         appKey = d.appKey;
    //     },
    //     error: function (e) {
    //         if(handleAJAXError(this,e)){
    //             return false;
    //         }
    //         showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
    //     }
    // });
});
</script>
@endsection