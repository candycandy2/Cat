<div id="toolbarWhiteList">
    <div class="form-group">
        <button type="button" class="btn btn-danger" onclick="deleteWhite()" id="btnDeleteWhite">
            {{trans("messages.DELETE")}}
        </button>
        <button type="button" class="btn btn-primary" onclick="addWhite()"" id="btnNewWhite">
            {{trans("messages.NEW")}}
        </button>
    </div>
</div>
<table id="gridWhiteList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbarWhiteList"
       data-url="AppMaintain/getWhiteList?app_row_id={{ app('request')->input('app_row_id') }}" data-height="398" data-pagination="true"
       data-show-refresh="true" data-row-style="rowStyle" data-search="true"
       data-show-toggle="true"  data-sortable="true"
       data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
       data-click-to-select="false" data-single-select="false">
    <thead>
    <tr>
        <th data-field="state" data-checkbox="true"></th>
        <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
        <th data-field="allow_url"  data-sortable="true" data-formatter="allowUrlFormatter">URL</th>
    </tr>
    </thead>
</table>

<script>
    function allowUrlFormatter(value, row){
        return '<a href="#" onclick="updateWhite(' + row.row_id + ')">' + value + '</a>';
    }

    var deleteWhite = function() {
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_WHITE")}}", "", function () {
            hideConfirmDialog();
            var selectedBlocks = $("#gridWhiteList").bootstrapTable('getSelections');
            var check = true;
            var whiteIdList = new Array();
            $.each(selectedBlocks, function(i, white) {
                whiteIdList.push(white.row_id);
            });
            var mydata = {whiteIdList:whiteIdList};
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "AppMaintain/deleteWhiteList",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_WHITE_FAILED")}}");
                    }  else {
                        $("#gridWhiteList").bootstrapTable('refresh');
                        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_WHITE_FAILED")}}", e.responseText);
                }
            });
        });
    };

    var currentWhiteId = null;
    var isNewWhite = false;
    var addWhite = function() {
        $("#tbxAllowUrl").val("");
        $("#whiteListDialogTitle").text("{{trans("messages.MSG_NEW_WHITE")}}");
        $("#whiteListDialog").modal('show');
        currentWhiteId = null;
        isNewWhite = true;
    };

    var updateWhite = function(whiteRowId) {
        var allWhiteList = $("#gridWhiteList").bootstrapTable('getData');
        $.each(allWhiteList, function(i, white) {
            if(white.row_id == whiteRowId) {
                $("#tbxAllowUrl").val(white.allow_url);
                return false;
            }
        });

        $("#whiteListDialogTitle").text("{{trans("messages.MSG_EDIT_WHITE")}}");
        $("#whiteListDialog").modal('show');
        currentWhiteId = whiteRowId;
        isNewWhite = false;
    };

    var saveWhiteList = function() {
        var allowUrl = $("#tbxAllowUrl").val();
        if(allowUrl == "") {
            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
            return false;
        }

        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
            hideConfirmDialog();
            var mydata = {
                isNewWhite:'Y',
                whiteRowId:-1,
                allowUrl:allowUrl,
                appRowId:{{ app('request')->input('app_row_id') }}
            };
            if(!isNewWhite) {
                mydata.isNewWhite = 'N';
                mydata.whiteRowId = currentWhiteId;
            }
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "AppMaintain/saveWhiteList",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_WHITE_FAILED")}}");
                    }  else {
                        $("#gridWhiteList").bootstrapTable('refresh');
                        $("#whiteListDialog").modal('hide');
                        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_WHITE_FAILED")}}", e.responseText);
                }
            });
        });
    };
</script>

    <div id="whiteListDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="whiteListDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table style="width: 100%">
                        <tr>
                            <td>URL:</td>
                            <td style="padding: 10px;">
                                <input  class="form-control" type="text" data-clear-btn="true" name="tbxAllowUrl"
                                       id="tbxAllowUrl" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveWhiteList()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
