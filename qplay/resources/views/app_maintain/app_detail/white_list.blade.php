<div id="toolbarWhiteList">
    <div class="form-group">
        <button type="button" class="btn btn-danger" onclick="" id="btnDeleteParameter">
            {{trans("messages.DELETE")}}
        </button>
        <button type="button" class="btn btn-primary" onclick="addWhite()"" id="btnDeleteParameter">
            {{trans("messages.NEW")}}
        </button>
    </div>
</div>
<table id="gridWhiteList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarWhiteList"
       data-url="" data-height="398" data-pagination="true"
       data-show-refresh="true" data-row-style="rowStyle" data-search="true"
       data-show-toggle="true"  data-sortable="true"
       data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
       data-click-to-select="false" data-single-select="false">
    <thead>
    <tr>
        <th data-field="state" data-checkbox="true"></th>
        <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
        <th data-field="allow_url"  data-sortable="true">URL</th>
    </tr>
    </thead>
</table>

{{-- @section('dialog_content') --}}
    <div id="whiteListDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="whiteListDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>URL:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxUrl"
                                       id="tbxUrl" value=""/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
{{-- @endsection --}}


