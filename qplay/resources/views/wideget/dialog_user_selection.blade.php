<div id="selectUserDialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h1 class="modal-title" id="roleDetailMaintainDialogTitle">{{trans("messages.SELECT_USER")}}</h1>
            </div>
            <div class="modal-body">
                <table id="gridAllUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id"
                       data-height="298" data-pagination="true"
                       data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                       data-show-toggle="true"  data-sortable="true"
                       data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                       data-click-to-select="false" data-single-select="false">
                    <thead>
                    <tr>
                        <th data-field="state" data-checkbox="true"></th>
                        <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                        <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
                        <th data-field="emp_no" data-sortable="true">{{trans("messages.USER_EMP_NO")}}</th>
                        <th data-field="login_id" data-sortable="true" >{{trans("messages.USER_LOGIN_ID")}}</th>
                        <th data-field="emp_name" data-sortable="true">{{trans("messages.USER_EMP_NAME")}}</th>
                        <th data-field="status" data-sortable="true" data-formatter="userStatusFormatter">{{trans("messages.STATUS")}}</th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div class="modal-footer">
                <button type="button"  class="btn btn-danger" onclick="selectUserDialog_SelectUser()">{{trans("messages.SELECT")}}</button>
                <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
            </div>
        </div>
    </div>
</div>
<script>
    function userStatusFormatter(value, row) {
        if(value.toUpperCase() == "Y") {
            return "{{trans("messages.STATUS_HAS_RIGHT")}}";
        } else {
            return "{{trans("messages.STATUS_HAS_NO_RIGHT")}}";
        }
    };
    var selectUserDialog_SelectUser = function() {
        try {
            var selectedUserList = $("#gridAllUserList").bootstrapTable('getSelections');
            $.each(selectedUserList, function(i, user) {
                user.state = false;
            });
            afterSelectedUser(selectedUserList);
        } catch (err) {}
        $("#selectUserDialog").modal('hide');
    };

    var selectUserDialog_Show = function () {
        $("#gridAllUserList").bootstrapTable('uncheckAll');
        //$("#gridAllUserList").bootstrapTable('refresh');
        $("#selectUserDialog").modal('show');
    };

    $(function() {
        var $table = $('#gridAllUserList');
        $table.bootstrapTable({
            "url": "platform/getUserList",
            "dataType": "json",
            "sidePagination": "server" //服务端处理分页
        });
    });
</script>