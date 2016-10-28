@include("layouts.lang")
<?php
$menu_name = "APP_MAINTAIN";
$detail_path    = "app_maintain.app_detail";
$pic_path       = $detail_path.'.app_pic';
$version_path   = $detail_path.'.app_version';
$appStatus =  \App\lib\CommonUtil::getAppVersionStatus(app('request')->input('app_row_id'));
$tempFlag = 0;
$lang = array();
$appBasic = $data['appBasic'];
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

foreach ($appBasic as $key => $appData){
    $allowLangList[$appData->lang_row_id]=$appData->lang_desc.' '.$appData->lang_code;
    $defaultLang = $appData->default_lang_row_id;
    $categoryId = $appData->app_category_row_id;
    $securityLevel = $appData->security_level;
    $appKey =  $appData->app_key;
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
                @if ($appStatus['android'] != 'UnPublish')
                    style="font-weight:bold;"
                @endif
            > Android-{{$appStatus['android']}}</span>
             |
            <span data-toggle='gridIOSVersionList'
                @if ($appStatus['ios'] != 'UnPublish')
                    style="font-weight:bold;"
                @endif
            > IOS-{{$appStatus['ios']}}</span>
        </span>
        <div class="btn-toolbar" role="toolbar" style="float: right;">
            <button type="button" id="saveAppDetail" class="btn btn-primary" onclick="SaveAppDetail()" style="display: none">
                {{trans("messages.SAVE")}}
            </button>
            <a type="button" class="btn btn-default" href="AppMaintain">
                {{trans("messages.RETURN")}}
            </a>
        </div>
    </div>
    <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#tab_content_info" data-toggle="tab">應用程式資訊</a></li>
        <li role="presentation"><a href="#tab_content_pic" data-toggle="tab">圖示資訊</a></li>
        <li role="presentation"><a href="#tab_content_version" data-toggle="tab">版本控制</a></li>
        <li role="presentation"><a href="#tab_content_white_list" data-toggle="tab">白名單設定</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab_content_info">
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
var jsOriAndroidStatus = '{{$appStatus['android']}}';
var jsOriIOSStatus = '{{$appStatus['ios']}}';
var delPicArr = new Array();
var delVersionArr = new Array();
var selectedChanged = function (row, $element) {
    if(typeof(row)!='undefined'){
        var $currentTarget = $(row.currentTarget);
        var $currentToolBar = $($currentTarget.data('toolbar'));
        $currentToolBar.find('.btn-danger').hide();
        var selectedItems = $currentTarget.bootstrapTable('getSelections');
        if(selectedItems.length > 0) {
             $currentToolBar.find('.btn-primary').fadeOut(300, function() {
                $currentToolBar.find('.btn-danger').fadeIn(300);
            });
        } else {
            $currentToolBar.find('.btn-danger').fadeOut(300, function() {
                $currentToolBar.find('.btn-primary').fadeIn(300);
            });
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

$(function () {
    $('.bootstrapTable').on('check.bs.table', selectedChanged);
    $('.bootstrapTable').on('uncheck.bs.table', selectedChanged);
    $('.bootstrapTable').on('check-all.bs.table', selectedChanged);
    $('.bootstrapTable').on('uncheck-all.bs.table', selectedChanged);
    $('.bootstrapTable').on('load-success.bs.table', selectedChanged);
    $('#saveAppDetail').show(); 
});
</script>
<script src="{{ asset('/js/appMaintain/switch_lang_tool.js') }}"></script>
<script src="{{ asset('/js/appMaintain/app_pic.js') }}"></script>
<script src="{{ asset('/js/appMaintain/app_maintain.js') }}"></script>
@endsection