<div id="toolbarIOS">
    <div class="form-group">
        <button type="button" class="btn btn-danger" style="display: none" onclick="delAppVersion('ios')" id="btnIOSVersion">
            {{trans("messages.DELETE")}}
        </button>
        <button type="button" class="btn btn-primary" onclick="newAppVersion('ios')" id="btnNewIOSVersion">
            上傳新版本
        </button>
    </div>
</div>
<table id="gridIOSVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarIOS"
       data-url="AppMaintain/getAppVersionList?app_row_id={{app('request')->input('app_row_id')}}&device_type=ios" data-height="398" data-pagination="true"
       data-show-refresh="true" data-row-style="rowStyle" data-search="true"
       data-show-toggle="true"  data-sortable="true"
       data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
       data-click-to-select="false" data-single-select="false"
       data-sort-name="updated_at" data-sort-order="desc">
    <thead>
    <tr>
        <th data-field="state" data-checkbox="true"></th>
        <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
        <th data-field="device_type" data-sortable="false" data-visible="false">deviceType</th>
        <th data-field="version_name" data-sortable="true" data-formatter = "versionNameFormatter">版本名稱</th>
        <th data-field="version_code"  data-sortable="true">版本號</th>
        <th data-field="download_url" data-sortable="true">版本路徑</th>
        <th data-field="updated_at" data-sortable="true">上傳時間</th>
        <th data-field="status" data-formatter="switchFormatter">狀態</th>
    </tr>
    </thead>
</table>
