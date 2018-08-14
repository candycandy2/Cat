<div id="toolbar">
    <button type="button" class="btn btn-danger" style="display: none;" onclick="RemoveUser()" id="btnDeleteUser">
        {{trans("messages.REMOVE")}}
    </button>
    <button type="button" class="btn btn-primary" onclick="AddUser()" id="btnAddUser">
        {{trans("messages.ADD_USER")}}
    </button>
</div>

<table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
       data-url="" data-height="398" data-pagination="true"
       data-show-refresh="false" data-row-style="rowStyle" data-search="false"
       data-show-toggle="false"  data-sortable="true"
       data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
       data-click-to-select="false" data-single-select="false">
    <thead>
    <tr>
        <th data-field="state" data-checkbox="true"></th>
        <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
        <th data-field="login_id" data-sortable="true">{{trans("messages.USER_LOGIN_ID")}}</th>
        <th data-field="company" data-sortable="true">{{trans("messages.USER_COMPANY")}}</th>
        <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
    </tr>
    </thead>
</table>

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

<script type="text/javascript">

    $(function() {
        var $table = $('#gridAllUserList');
        $table.bootstrapTable({
            "url": "../platform/getUserList",
            "dataType": "json",
            "sidePagination": "server" //服务端处理分页
        });
        $('#gridUserList').on('check.bs.table', selectedUserChanged);
        $('#gridUserList').on('uncheck.bs.table', selectedUserChanged);
        $('#gridUserList').on('check-all.bs.table', selectedUserChanged);
        $('#gridUserList').on('uncheck-all.bs.table', selectedUserChanged);
        $('#gridUserList').on('load-success.bs.table', selectedUserChanged);
    });
    
    var selectedUserChanged = function () {
        var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
        if(selectedUsers.length > 0) {
            $("#btnAddUser").fadeOut(500, function () {
                $("#btnDeleteUser").fadeIn(500);
            });
        } else {
            $("#btnDeleteUser").fadeOut(500, function () {
                $("#btnAddUser").fadeIn(500);
            });
        }
    };
    
    var userStatusFormatter = function(value, row) {
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
    var RemoveUser = function () {
        var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
        var confirmDetailStr = "";

        $.each(selectedUsers, function(i, user) {
            confirmDetailStr += user.login_id + "<br/>";
        });
    
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_REMOVE_USER")}}", confirmDetailStr, function () {
            hideConfirmDialog();
            var currentData = $("#gridUserList").bootstrapTable('getData');
            $.each(selectedUsers, function(i, user) {
                for(var j = 0; j < currentData.length; j++) {
                    if(currentData[j].row_id == user.row_id) {
                        currentData.splice(j,1);
                        break;
                    }
                }
            });

            $("#gridUserList").bootstrapTable('load', currentData);
            selectedUserChanged();
        });
    };

    var AddUser = function() {
        $("#gridAllUserList").bootstrapTable('uncheckAll');
        $("#gridAllUserList").bootstrapTable('resetSearch', "");
        $("#gridAllUserList").bootstrapTable('refresh');
        selectUserDialog_Show();
    };

    var afterSelectedUser = function(selectedUserList) {
        var currentData = $("#gridUserList").bootstrapTable('getData');
        $.each(selectedUserList, function(i, newUser) {
            var exist = false;
            $.each(currentData, function(j, cUser) {
                if(cUser.row_id == newUser.row_id) {
                    exist = true;
                    return false;
                }
            });
            if(!exist) {
                currentData.push(newUser);
            }
        });
        $("#gridUserList").bootstrapTable('load', currentData);
    };
</script>