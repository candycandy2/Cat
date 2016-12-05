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
<form id="whistListForm">
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
            <th data-field="allow_url"  data-sortable="true" data-formatter="allowUrlFormatter" data-search-formatter="false">URL</th>
        </tr>
        </thead>
    </table>
</form>

<script>
    function allowUrlFormatter(value, row){
         return '<a href="#" class="editWhiteList" data-rowid="'+ row.row_id  +'"> '+ value +'</a>';
    }

    var deleteWhite = function() {
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_WHITE")}}", "", function () {
            hideConfirmDialog();
            var $gridList = $("#gridWhiteList");
            var $toolbar  =  $($gridList.data('toolbar'));
            var selectedWhiteList = $gridList.bootstrapTable('getSelections');
            var currentData = $gridList.bootstrapTable('getData');
            $.each(selectedWhiteList, function(i, white) {
               var index = $gridList.find('input[name=btSelectItem]:checked').first().data('index');
               currentData.splice(index,1);
               $gridList.bootstrapTable('load', currentData);
            });
            $gridList.find('checkbox[name=btSelectItem]').each(function(){
                $(this).prop('check',false);
            });
            $toolbar.find('.btn-danger').fadeOut(300, function() {
                $toolbar.find('.btn-primary').fadeIn(300);
            });
        });
    };
    var addWhite = function() {
        $("#tbxAllowUrl").val("");
        $("#whiteListDialogTitle").text("{{trans("messages.MSG_NEW_WHITE")}}");
        $("#whiteListDialog").find('#saveWhiteList').attr('onclick','saveWhiteList("new")');
        $("#whiteListDialog").modal('show');
    };
    var updateWhiteList = function(index,whiteRowId) {
        var currentData = $("#gridWhiteList").bootstrapTable('getData');
        $("#tbxAllowUrl").val(currentData[index].allow_url);
        $("#whiteListDialogTitle").text("{{trans("messages.MSG_EDIT_WHITE")}}");
        $("#whiteListDialog").find('#saveWhiteList').attr('onclick','saveWhiteList("edit",'+index+')');
        $("#whiteListDialog").modal('show');
    };
    var saveWhiteList = function(action,index) {
        var allowUrl = $("#tbxAllowUrl").val();
        var require = ['tbxAllowUrl'];
        var errors = validRequired(require);
        $.each(errors,function(i, error){
            $('span[for='+error.field+']').html(error.msg);
        });
        if(errors.length > 0){
            return false;
        }
        var currentData = $("#gridWhiteList").bootstrapTable('getData');
        if(action == "new"){
            var newWhitList = new Object();
            newWhitList.allow_url  = allowUrl;
            currentData.push(newWhitList);  
        }else{ 
            currentData[index].allow_url = allowUrl;
        }
        $("#gridWhiteList").bootstrapTable('load', currentData);
        $("#whiteListDialog").modal('hide');
    };
 
 $(function () {
    $('body').on('click','.editWhiteList',function(e) {  
         $currentTarget = $(e.currentTarget);
         var index = $currentTarget.parent().parent().data('index');
         updateWhiteList(index, $currentTarget.data('rowid'));
    });
 });    
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
                                <span style="color: red;" class="error" for="tbxAllowUrl"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  id="saveWhiteList" class="btn btn-danger" onclick="saveWhiteList()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
