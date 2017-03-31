<div>
    <div id="toolbarIOS">
        <div class="form-group">
            <button type="button" class="btn btn-danger" style="display: none" onclick="delAppVersion('gridIOSVersionList')" id="btnIOSVersion">
                {{trans("messages.DELETE")}}
            </button>
            <button type="button" class="btn btn-primary" onclick="newAppVersion('ios')" id="btnNewIOSVersion">
                {{trans('messages.UPLOAD_NEW_VERSION')}}
            </button>
            <button type="button" class="btn btn-primary" onclick="newExternalLink('ios')" id="btnNewIOSVersion">
                {{trans('messages.UPLOAD_NEW_EXTERNAL_LINK')}}
            </button>
        </div>
    </div>
    <table id="gridIOSVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarIOS"
           data-url="AppVersion/getAppNewVersion?app_row_id={{app('request')->input('app_row_id')}}&device_type=ios"
            data-show-refresh="true" data-row-style="rowStyle"
            data-show-toggle="true"  data-sortable="true"
            data-striped="true"
            data-click-to-select="false" data-single-select="false"
            data-sort-name="version_code" data-sort-order="desc">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
            <th data-field="external_app" data-sortable="false" data-visible="false">externalApp</th>
            <th data-field="version_name" data-sortable="true" data-formatter = "versionNameFormatter" data-search-formatter="false">{{trans('messages.VERSION_NAME')}}</th>
            <th data-field="version_code"  data-sortable="true">{{trans('messages.VERSION_NO')}}</th>
            <th data-field="version_log" data-sortable="false" data-visible="true" data-formatter="versionLogDateFormatter" data-search-formatter="false">{{trans('messages.VERSION_LOG')}}</th>
            <th data-field="download_url" data-sortable="true">{{trans('messages.VERSION_URL')}}</th>
            <th data-field="created_at" data-sortable="true" data-formatter="createdDateFormatter">{{trans('messages.UPLOAD_TIME')}}</th>
            <th data-field="size" data-formatter="fileSizeFormatter" data-sortable="true" data-searchable="false">{{trans('messages.FILE_SIZE')}}</th>
            <th data-field="status" data-formatter="switchFormatter" data-sortable="true">{{trans('messages.VERSION_STATUS')}}</th>
        </tr>
        </thead>
    </table>
</div>
<div>
    <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    <div id="toolbarIOSOnlineVersionList">
        <div class="form-group">
            <button type="button" class="btn btn-danger" style="display: none" onclick="delAppVersion('gridIOSOnlineVersionList')" id="btnIOSOnlineVersion">
                {{trans("messages.DELETE")}}
            </button>
        </div>
    </div>
    <table id="gridIOSOnlineVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarIOSOnlineVersionList"
           data-url="AppVersion/getAppOnlineVersion?app_row_id={{app('request')->input('app_row_id')}}&device_type=ios"
            data-show-refresh="true" data-row-style="rowStyle"
            data-show-toggle="true"  data-sortable="true"
            data-striped="true"
            data-click-to-select="false" data-single-select="false"
            data-sort-name="version_code" data-sort-order="desc">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
            <th data-field="external_app" data-sortable="false" data-visible="false">externalApp</th>
            <th data-field="version_name" data-sortable="true" data-formatter = "versionNameFormatter" data-search-formatter="false">{{trans('messages.VERSION_NAME')}}</th>
            <th data-field="version_code"  data-sortable="true">{{trans('messages.VERSION_NO')}}</th>
            <th data-field="version_log" data-sortable="false" data-visible="true" data-formatter="versionLogDateFormatter" data-search-formatter="false">{{trans('messages.VERSION_LOG')}}</th>
            <th data-field="download_url" data-sortable="true">{{trans('messages.VERSION_URL')}}</th>
            <th data-field="created_at" data-sortable="true" data-formatter="createdDateFormatter">{{trans('messages.UPLOAD_TIME')}}</th>
            <th data-field="size" data-formatter="fileSizeFormatter" data-sortable="true" data-searchable="false">{{trans('messages.FILE_SIZE')}}</th>
            <th data-field="status" data-formatter="switchFormatter" data-sortable="true">{{trans('messages.VERSION_STATUS')}}</th>
        </tr>
        </thead>
    </table>
</div>
<div>
    <hr class="primary" style="border-top: 1px solid #bbb1b1;">
    <div id="toolbarIOSHistoryVersionList">
        <div class="form-group">
            <button type="button" class="btn btn-danger" style="display: none" onclick="delAppVersion('gridIOSHistoryVersionList')" id="btnIOSHistoryVersion">
                {{trans("messages.DELETE")}}
            </button>
        </div>
    </div>
    <table id="gridIOSHistoryVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarIOSHistoryVersionList"
           data-url="AppVersion/getAppHistoryVersion?app_row_id={{app('request')->input('app_row_id')}}&device_type=ios" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false"
           data-sort-name="version_code" data-sort-order="desc">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
            <th data-field="external_app" data-sortable="false" data-visible="false">externalApp</th>
            <th data-field="version_name" data-sortable="true" data-formatter = "versionNameFormatter" data-search-formatter="false">{{trans('messages.VERSION_NAME')}}</th>
            <th data-field="version_code"  data-sortable="true">{{trans('messages.VERSION_NO')}}</th>
            <th data-field="version_log" data-sortable="false" data-visible="true" data-formatter="versionLogDateFormatter" data-search-formatter="false">{{trans('messages.VERSION_LOG')}}</th>
            <th data-field="download_url" data-sortable="true">{{trans('messages.VERSION_URL')}}</th>
            <th data-field="created_at" data-sortable="true" data-formatter="createdDateFormatter">{{trans('messages.UPLOAD_TIME')}}</th>
            <th data-field="size" data-formatter="fileSizeFormatter" data-sortable="true" data-searchable="false">{{trans('messages.FILE_SIZE')}}</th>
            <th data-field="status" data-formatter="switchFormatter" data-sortable="true">{{trans('messages.VERSION_STATUS')}}</th>
        </tr>
        </thead>
    </table>
</div>