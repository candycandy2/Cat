<div id="toolbarIOS">
    <div class="form-group">
        <button type="button" class="btn btn-danger" onclick="" id="btnDeleteParameter">
            {{trans("messages.DELETE")}}
        </button>
        <span class="btn btn-primary btn-file">
            上傳新版本<input type="file" id="file">
        </span>
    </div>
</div>
<table id="gridIOSVersionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarIOS"
       data-url="" data-height="398" data-pagination="true"
       data-show-refresh="true" data-row-style="rowStyle" data-search="true"
       data-show-toggle="true"  data-sortable="true"
       data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
       data-click-to-select="false" data-single-select="false">
    <thead>
    <tr>
        <th data-field="state" data-checkbox="true"></th>
        <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
        <th data-field="version_name" data-sortable="true">版本名稱</th>
        <th data-field="version_no"  data-sortable="true">版本號</th>
        <th data-field="version_path" data-sortable="true">版本路徑</th>
        <th data-field="upload_time" data-sortable="true">上傳時間</th>
        <th data-field="status" data-formatter="switchFormatter">狀態</th>
    </tr>
    </thead>
</table>


<script>
    function switchFormatter(value, row) {
            return '<div class="switch switch-mini"><input type="checkbox"></div>';
        };
    $(function () {
        $('#gridIOSVersionList').bootstrapTable({
            data: [{"row_id":1,"version_name":"1.0.0.0","version_no":"100","version_path":"http://qplay.benq.com/qplay/storage/ios/","upload_time":"2016-09-22","status":"Unpublish"},{"row_id":3,"version_name":"1.0.0.1","version_no":"101","version_path":"http://qplay.benq.com/qplay/storage/ios/","upload_time":"2016-10-30","status":"android-v0.1"}]
        });
    });

</script>