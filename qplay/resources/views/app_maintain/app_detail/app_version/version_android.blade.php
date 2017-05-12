<?php
$cookieRoot = str_replace('.','_',Auth::user()->login_id).'___'.str_replace(Config::get('app.url'),'',URL::to('/').'/'.Request::segment(1));
$gridHistoryList = '___gridAndroidHistoryVersionList';

$androidHistoryPageSizeCookie = $cookieRoot.$gridHistoryList.'___S';

$androidHistoryPageSize = 10;

if(isset($_COOKIE[$androidHistoryPageSizeCookie])){
    $androidHistoryPageSize = $_COOKIE[$androidHistoryPageSizeCookie];
}
?>
<div>
    <h4><strong>{{trans('messages.NEW_VERSION')}}</strong></h4>
    <small class="text-muted"> * {{trans('messages.NEW_VERSION_HINT')}}</small>
    <div id="toolbarAndroid">
        <div class="form-group">
            <button type="button" class="btn btn-danger" style="display: none" onclick="delAppVersion('gridAndroidVersionList')" id="btnDelAndroidVersion">
                {{trans("messages.DELETE")}}
            </button>
            <button type="button" class="btn btn-primary" onclick="newAppVersion('android')" id="btnNewAndroidVersion">
                {{trans('messages.UPLOAD_NEW_VERSION')}}
            </button>
            <button type="button" class="btn btn-primary" onclick="newExternalLink('android')" id="btnNewAndroidVersion">
                {{trans('messages.UPLOAD_NEW_EXTERNAL_LINK')}}
            </button>
        </div>
    </div>
    <table id="gridAndroidVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarAndroid"
           data-url="AppVersion/getAppNewVersion?app_row_id={{app('request')->input('app_row_id')}}&device_type=android"
           data-show-refresh="true" data-row-style="rowStyle"
           data-show-toggle="true"  data-sortable="false"
           data-striped="true"
           data-click-to-select="false" data-single-select="false"
           data-sort-name="version_code" data-sort-order="desc">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="false" data-visible="false">ID</th>
            <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
            <th data-field="external_app" data-sortable="false" data-visible="false">externalApp</th>
            <th data-field="version_name" data-sortable="false" data-formatter = "versionNameFormatter" data-search-formatter="false">{{trans('messages.VERSION_NAME')}}</th>
            <th data-field="version_code"  data-sortable="false" data-width="50px">{{trans('messages.VERSION_NO')}}</th>
            <th data-field="version_log" data-sortable="false" data-visible="true" data-formatter="versionLogDateFormatter" data-search-formatter="false" data-class="grid_warp_column">{{trans('messages.VERSION_LOG')}}</th>
            <th data-field="download_url" data-sortable="false" data-class="grid_warp_column">{{trans('messages.VERSION_URL')}}</th>
            <th data-field="created_at" data-sortable="false" data-formatter="createdDateFormatter" data-width="150px">{{trans('messages.UPLOAD_TIME')}}</th>
            <th data-field="size" data-formatter="fileSizeFormatter" data-sortable="false" data-searchable="false">{{trans('messages.FILE_SIZE')}}</th>
            <th data-field="status" data-formatter="switchFormatter"  data-sortable="false" data-width="150px">{{trans('messages.VERSION_STATUS')}}</th>
        </tr>
        </thead>
    </table>
</div>
<div>
    <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    <h4><strong>{{trans('messages.NOW_PUBLISH_VERSION')}}</strong></h4>
    <div id="toolbarAndroidOnlineVersionList">
        <div class="form-group">
            <button type="button" class="btn btn-danger" style="display: none" onclick="delAppVersion('gridAndroidOnlineVersionList')" id="btnDelAndroidOnlineVersion">
                {{trans("messages.DELETE")}}
        </div>
    </div>
    <table id="gridAndroidOnlineVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarAndroidOnlineVersionList"
           data-url="AppVersion/getAppOnlineVersion?app_row_id={{app('request')->input('app_row_id')}}&device_type=android"
           data-show-refresh="fasle" data-row-style="rowStyle"
           data-show-toggle="true"  data-sortable="fasle"
           data-striped="true" data-page-size="1" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false"
           data-sort-name="version_code" data-sort-order="desc">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="false" data-visible="false">ID</th>
            <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
            <th data-field="external_app" data-sortable="false" data-visible="false">externalApp</th>
            <th data-field="version_name" data-sortable="false" data-formatter = "versionNameFormatter" data-search-formatter="false">{{trans('messages.VERSION_NAME')}}</th>
            <th data-field="version_code"  data-sortable="false"  data-width="50px">{{trans('messages.VERSION_NO')}}</th>
            <th data-field="version_log" data-sortable="false" data-visible="true" data-formatter="versionLogDateFormatter" data-search-formatter="false" data-class="grid_warp_column">{{trans('messages.VERSION_LOG')}}</th>
            <th data-field="download_url" data-sortable="false" data-class="grid_warp_column">{{trans('messages.VERSION_URL')}}</th>
            <th data-field="created_at" data-sortable="false" data-formatter="createdDateFormatter"  data-width="150px">{{trans('messages.UPLOAD_TIME')}}</th>
            <th data-field="size" data-formatter="fileSizeFormatter" data-sortable="false" data-searchable="false">{{trans('messages.FILE_SIZE')}}</th>
            <th data-field="status" data-formatter="switchFormatter"  data-sortable="false"  data-width="150px">{{trans('messages.VERSION_STATUS')}}</th>
        </tr>
        </thead>
    </table>
</div>

<div>
    <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    <h4><strong>{{trans('messages.HISTORY_VERSION')}}</strong></h4>
    <div id="toolbarAndroidHistoryVersionList">
        <div class="form-group">
            <button type="button" class="btn btn-danger"  style="display: none" onclick="delAppVersion('gridAndroidHistoryVersionList')" id="btnDelAndroidHistoryVersion">
                {{trans("messages.DELETE")}}
            </button>
        </div>
    </div>
    <table id="gridAndroidHistoryVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarAndroidHistoryVersionList" data-url="AppVersion/getAppHistoryVersion?app_row_id={{app('request')->input('app_row_id')}}&device_type=android"
           data-height="398" data-pagination="true"  data-side-pagination="server"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="{{$androidHistoryPageSize}}" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false"
           data-sort-name="version_code" data-sort-order="desc">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
            <th data-field="external_app" data-sortable="false" data-visible="false">externalApp</th>
            <th data-field="version_name" data-sortable="true" data-formatter = "versionNameFormatter" data-search-formatter="false">{{trans('messages.VERSION_NAME')}}</th>
            <th data-field="version_code"  data-sortable="true"  data-width="50px">{{trans('messages.VERSION_NO')}}</th>
            <th data-field="version_log" data-sortable="true" data-visible="true" data-formatter="versionLogDateFormatter" data-search-formatter="false" data-class="grid_warp_column">{{trans('messages.VERSION_LOG')}}</th>
            <th data-field="download_url" data-sortable="false" data-class="grid_warp_column">{{trans('messages.VERSION_URL')}}</th>
            <th data-field="created_at" data-sortable="true" data-formatter="createdDateFormatter" data-width="150px">{{trans('messages.UPLOAD_TIME')}}</th>
            <th data-field="size" data-formatter="fileSizeFormatter" data-sortable="true" data-searchable="false">{{trans('messages.FILE_SIZE')}}</th>
            <th data-field="status" data-formatter="switchFormatter"  data-sortable="false" data-width="150px" >{{trans('messages.VERSION_STATUS')}}</th>
        </tr>
        </thead>
    </table>
</div>