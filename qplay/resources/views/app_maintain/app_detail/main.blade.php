@include("layouts.lang")
<?php
$menu_name = "APP_MAINTAIN";
$detail_path    = "app_maintain.app_detail";
$pic_path       = $detail_path.'.app_pic';
$version_path   = $detail_path.'.app_version';
$appStatus =  \App\lib\CommonUtil::getAppVersionStatus(app('request')->input('app_row_id'));

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
}

foreach ($enableRole as $role){
    $enableRoleArray[] = $role->role_row_id;
}
?>
@extends('layouts.admin_template')
@section('content')
    <style>
        .tab-content {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            background-color: #fff;
            padding:20px;
        }
        .label-hint {
            color: #fff;
            background-color: #333;
            border-radius: 3px;
            padding: 6px 12px;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            border: 1px solid transparent;
        }
        table.costum-table { 
            border-collapse: separate;
            width: 100%;
            max-width: 100%;
            margin-bottom: 20px;
            text-align: center;
        }
        .icon-upl-btn{
            background: url() no-repeat center 50% #FFFAD9;
            border-width:3px;
            border-style:dashed;
            border-color:#FFAC55;
            cursor: pointer;
            text-align:center;
            padding-top:40px;
            width: 120px; 
            height: 120px;
        }
        .icon-preview{
            width: 120px; 
            height: 120px;
        }
        .screen-upl-btn{
            background: url() no-repeat center 50% #FFFAD9;
            border-width:3px;
            border-style:dashed;
            border-color:#FFAC55;
            cursor: pointer;
            text-align:center;
            padding-top:140px;
            width: 200px; 
            height: 320px;
        }
        .screen-preview{
            width: 200px; 
            height: 320px;
        }
        .screen-preview:hover, .icon-preview:hover, .screen-upl-btn:hover, .icon-upl-btn:hover{
            opacity: .3;
            cursor:move;
        }
        .sortable { list-style-type: none; margin: 0; padding: 0;  }
        .sortable li { margin: 10px 10px 10px 10px; float: left }
        
        .imgLi{
            display : inline-block;
            position : relative;
        }
        .imgLi .delete{
            position : absolute;
            top : -15px;
            right : -15px;
            width : 30px;
            height : 30px;
            box-shadow:2px 2px 2px 0px #cccccc;
        }
        .imgLi .delete:hover{
            top : -16px;
        }
        .imgLi .delete:active{
            top : -15px;
        }

        table.costum-table td { border: 1px solid #ddd; padding: 8px; }
        table.costum-table tr:first-child{font-weight:bold;}
        table.costum-table tr:last-child{background-color: #f9f9f9;}
        table.costum-table tr:first-child td:first-child { border-top-left-radius: 3px;}
        table.costum-table tr:first-child td:last-child { border-top-right-radius: 3px;}
        table.costum-table tr:last-child td:first-child { border-bottom-left-radius: 3px;}
        table.costum-table tr:last-child td:last-child { border-bottom-right-radius: 3px; }
        
    </style>
    <div id="appMaintainAlert" class="alert alert-danger" style="display: none">
        <strong>Danger!</strong>
    </div>
    <div class="col-lg-12 col-xs-12 text-right">
        <span class="text-success"  id="appVersionStatus" style="padding-right: 8px;  line-height: 50px; font-size: 20px;">
            <span  data-toggle='gridAndroidVersionList'
                @if ($appStatus['android'] != 'UnPlished')
                    style="font-weight:bold;"
                @endif
            > Android-{{$appStatus['android']}}</span>
             |
            <span data-toggle='gridIOSVersionList'
                @if ($appStatus['ios'] != 'UnPlished')
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
var oriDefaultLang = {{$defaultLang}};
var jsDefaultLang = {{$defaultLang}};
var jsDefaultLangStr = '{{$allowLangList[$defaultLang]}}';
var jsAppRowId = {{app('request')->input('app_row_id')}};
var delPicArr = new Array();
var selectedChanged = function (row, $element) {
    if(typeof(row)!='undefined'){
        var $currentTarget = $(row.currentTarget);
        var $currentToolBar = $($currentTarget.data('toolbar'));
        $currentToolBar.find('.btn-danger').hide();
        var selectedItems = $currentTarget.bootstrapTable('getSelections');
        if(selectedItems.length > 0) {
            $currentToolBar.find('.btn-danger').show();
            $currentToolBar.find('.btn-primary').hide();
        } else {
            $currentToolBar.find('.btn-danger').hide();
            $currentToolBar.find('.btn-primary').show();
        }
    }
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