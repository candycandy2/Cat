@include("layouts.lang")
@section('head')
    @parent
    <script src="{{ asset('/js/appMaintain/switch_lang_tool.js?v='.config('app.static_version')) }}"></script>
    <script src="{{ asset('/js/appMaintain/app_pic.js?v='.config('app.static_version')) }}"></script>
    <script src="{{ asset('/js/appMaintain/app_maintain.js?v='.config('app.static_version')) }}"></script>
@stop
<?php
$menu_name = "APP_MAINTAIN";
$detail_path    = "app_maintain.app_detail";
$pic_path       = $detail_path.'.app_pic';
$version_path   = $detail_path.'.app_version';
$appStatus =  \App\lib\CommonUtil::getAppVersionStatus(app('request')->input('app_row_id'));
$tempFlag = 0;
$lang = array();

$appMain = $data['appMain'];
$appLine = $data['appLine'];
$langList = $data['langList'];
$categoryList = $data['categoryList'];
$picData =  $data['picData'];
$errorCode = $data['errorCode'];
$companyLabel =  $data['company_label'];
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();
$enableRole = \App\lib\CommonUtil::getAppRoleByAppId(app('request')->input('app_row_id'));
$enableRoleArray = array();
$defaultLang = 0;
$categoryId = 0;
$securityLevel = 3;
$default = 0;
$allowLangList=[];

$defaultLang = $appMain->default_lang_row_id;
$categoryId = $appMain->app_category_row_id;
$securityLevel = $appMain->security_level;
$projectCode = $appMain->project_code;
$appKey =  $appMain->app_key;

foreach ($appLine as $key => $appData){
    $allowLangList[$appData->lang_row_id]=$appData->lang_desc.' '.$appData->lang_code;
}
foreach ($enableRole as $role){
    $enableRoleArray[] = $role->role_row_id;
}
?>
@extends('layouts.admin_template')
@section('content')
 <link href="{{ asset('/css/appMaintain/app_maintain.css') }}" rel="stylesheet">
    <div id="appMaintainAlert" class="alert alert-danger" style="display: none">
        <strong>Danger!</strong>
    </div>
    <div class="col-lg-12 col-xs-12 text-right">
        <span class="text-success"  id="appVersionStatus" style="padding-right: 8px;  line-height: 50px; font-size: 20px;">
            <span  data-toggle='gridAndroidVersionList'
                @if ($appStatus['android']['str'] != 'Unpublish')
                    style="font-weight:bold;"
                @endif
            > Android-{{$appStatus['android']['str']}}</span>
             |
            <span data-toggle='gridIOSVersionList'
                @if ($appStatus['ios']['str'] != 'Unpublish')
                    style="font-weight:bold;"
                @endif
            > IOS-{{$appStatus['ios']['str']}}</span>
        </span>
        <div class="btn-toolbar" role="toolbar" style="float: right;">
            <button type="button" id="saveAppDetail" class="btn btn-primary" onclick="SaveAppDetail()" style="display: none">
                {{trans("messages.SAVE")}}
            </button>
            <a type="button" class="btn btn-default" id="goBack">
                {{trans("messages.RETURN")}}
            </a>
        </div>
    </div>
    <ul class="nav nav-tabs">
        <li role="presentation"><a href="#tab_content_info" data-toggle="tab">{{trans('messages.TAB_INFORMATION')}}</a></li>
        <li role="presentation"><a href="#tab_content_pic" data-toggle="tab">{{trans('messages.TAB_PIC_INFORMATION')}}</a></li>
        <li role="presentation"><a href="#tab_content_version" data-toggle="tab">{{trans('messages.TAB_VERSION_CONTROLL')}}</a></li>
        <li role="presentation"><a href="#tab_content_white_list" data-toggle="tab">{{trans('messages.TAB_WHITE_LIST_SETTING')}}</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade" id="tab_content_info">
            @include($detail_path .'.info')
        </div> 
        <div class="tab-pane fade" id="tab_content_pic">
            @include($detail_path .'.app_pic.pic_main')
        </div>
        <div class="tab-pane fade" id="tab_content_version">
            @include($detail_path .'.app_version.version_main')
        </div>
        <div class="tab-pane fade" id="tab_content_white_list">
            @include($detail_path .'.white_list')
        </div>
    </div>

<script>
var jsDefaultLang = {{$defaultLang}};
var jsDefaultLangStr = '{{$allowLangList[$defaultLang]}}';
var jsAppRowId = {{app('request')->input('app_row_id')}};
var jsAppKey =  '{{$appKey}}';
var jsOriAndroidStatus = '{{$appStatus['android']['str']}}';
var jsOriIOSStatus = '{{$appStatus['ios']['str']}}';
var delPicArr = new Array();
var delVersionArr = new Array();
var projectCode = '{{$projectCode}}';

var selectedChanged = function (row, $element) {
    if(typeof(row)!='undefined'){
        var $currentTarget = $(row.currentTarget);
        var $currentToolBar = $($currentTarget.data('toolbar'));
        $currentToolBar.find('.btn-danger').hide();
        var selectedItems = $currentTarget.bootstrapTable('getSelections');
        if(selectedItems.length > 0) {
            if($currentToolBar.find('.btn-primary').length > 0){
                 $currentToolBar.find('.btn-primary').fadeOut(300, function() {
                    $currentToolBar.find('.btn-danger').fadeIn(300);
                });
            }else{
                 $currentToolBar.find('.btn-danger').fadeIn(300);
            }
        } else {
            if($currentToolBar.find('.btn-primary').length > 0){
                $currentToolBar.find('.btn-danger').fadeOut(300, function() {
                    $currentToolBar.find('.btn-primary').fadeIn(300);
                });
            }else{
                 $currentToolBar.find('.btn-primary').fadeIn(300);
            }
        }
    }
}

var showUploadFileName = function($target){
    var fileName;
    fileName = $target.val();
    $target.parent().next('.file-input-name').remove();
    if (!!$target.prop('files') && $target.prop('files').length > 1) {
        fileName =$target[0].files.length+' files';
    }
    else {
        fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
    }
    if (!fileName) {
        return;
    }
    $target.parent().after('<span class="file-input-name">'+fileName+'</span>');  
}

function validRequired(errors, fieldList){
    
    $.each(fieldList, function(i, item) {
        var value = $('input[name='+item+']').val();
        if(typeof value == "undefined"){
            value = $('#' + item).val();
        }
        if($.trim(value) == "" || typeof value == "undefined"){
            var error = new Error;
            error.field = item;
            error.msg = '{{trans('messages.MSG_REQUIRED_FIELD')}}';
            errors.push(error);
        }
   });
    return errors;
}

$(function () {
    $('#goBack').click(function(){
        if(getUrlVar('source') == 'develop'){
            window.location='{{asset('projectMaintain')}}';
        }else{
            window.location='{{asset('AppMaintain')}}';
        }
    });
    $('.bootstrapTable').on('check.bs.table', selectedChanged);
    $('.bootstrapTable').on('uncheck.bs.table', selectedChanged);
    $('.bootstrapTable').on('check-all.bs.table', selectedChanged);
    $('.bootstrapTable').on('uncheck-all.bs.table', selectedChanged);
    $('.bootstrapTable').on('load-success.bs.table', selectedChanged);
    $('body').on('page-change.bs.table','.bootstrapTable',selectedChanged);
    
    $('#saveAppDetail').show(); 
});
</script>
@endsection