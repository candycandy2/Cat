<?php
$menu_name = "REPORT";
?>
@include("layouts.lang")
@extends('layouts.admin_template')
@section('content')
    <div>
        <span style="font-size: 20px"><b>{{trans("messages.APPS_LIST")}}</b></span>
    </div>
    <div>
    <table id="gridReportAppList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="report/reportAppList/getReportAppList" data-height="600" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"   data-sort-name="project_code" data-sort-order="asc"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="project_code" data-sortable="true" data-visible="false" data-searchable="false">Project Code</th>
            <th data-field="app_name" data-sortable="false" data-formatter="iconFormatter" data-search-formatter="false">{{trans("messages.APPLICATION_NAME")}}</th>
            <th data-field="android_release" data-formatter="deviceSupportFormatter" data-search-formatter="true">{{trans("messages.SUPPORT_DEVICE_TYPE")}}</th>
            <th data-field="register_rate" data-searchable="false">{{trans("messages.REGISTER_USER_COUNT")}}/{{trans("messages.REGISTER_DEVICE_COUNT")}}</th>
            <th data-field="release_status" data-formatter="releaseFormatter" data-align="center" data-sortable="true" data-search-formatter="true" >{{trans("messages.RELEASED")}}</th>
        </tr>
        </thead>
    </table>
    </div>


<script>
     function iconFormatter(value, row) {
        var src = ""
        if(row.icon_url != ""){
            src = '<img src="' +'app/'+row.row_id+'/icon/'+row.icon_url + '" class="img-rounded"  width="50" height="50">';
            return src + '<span style="padding:10px">'+ row.app_name + '</span>';
        }else{
            return '<span style="padding:10 10 10 60">'+ row.app_name + '</span>';
        }
        
    };

    function appEditFormatter(value, row){
        var path = '{{asset('appDetailMaintain?source=admin&app_row_id=')}}' + row.row_id;
        return '<a href="' + path + '" </a>' + value;
    }

    function releaseFormatter(value, row){
        var status = '<label class="label-unpublished">{{trans("messages.RELEASED_STATUS_UNBLISH")}}</label>';
        if(row.release_status == 1){
                status = '<label class="label-published">{{trans("messages.RELEASED_STATUS_PUBLISH")}}</label>';
        }
        return status;
    }

    function deviceSupportFormatter(value, row){
        var supportDevice = new Array();
        if(row.android_release != 'Unpublish' ){
            supportDevice.push('Android');
        }
        if(row.ios_release != 'Unpublish'){
            supportDevice.push('IOS');
        }
        var supportStr = supportDevice.toString().replace(',','/');
        if(supportDevice.length == 0){
                supportStr = "-";      
        }
        return supportStr;
    }
     $(function () {
        $('#gridReportAppList').on('click-cell.bs.table', function(e, value, row, $element){
                $(location).attr('href', '{{asset('report/reportDetail')}}' + '?app_row_id=' + $element.row_id);
        });
    });
</script>
@endsection