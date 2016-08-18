@include("layouts.lang")
<?php
$menu_name = "USER_ACCOUNT_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    <div id="toolbar" class="btn-group">
        <button type="button" class="btn btn-danger" onclick="removeRight()">
            {{trans("messages.REMOVE_RIGHT")}}
        </button>
    </div>
    <table id="gridUserList" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="platform/getUserList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="login_id" data-sortable="true" data-formatter="nameFormatter">{{trans("messages.USER_LOGIN_ID")}}</th>
            <th data-field="emp_no" data-sortable="true">{{trans("messages.USER_EMP_NO")}}</th>
            <th data-field="emp_name" data-sortable="true">{{trans("messages.USER_EMP_NAME")}}</th>
            <th data-field="email" data-sortable="true">{{trans("messages.USER_EMAIL")}}</th>
            <th data-field="user_domain" data-sortable="true">{{trans("messages.USER_DOMAIN")}}</th>
            <th data-field="company" data-sortable="true">{{trans("messages.USER_COMPANY")}}</th>
            <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
            <th data-field="status" data-sortable="true">{{trans("messages.USER_STATUS")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function nameFormatter(value) {
            return '<a href="accountDetailMaintain?login_id=' + value + '">' + value + '</a>';
        };

        var removeRight = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_REMOVE_RIGHT")}}", "", function () {
                hideConfirmDialog();
                var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
                var userIdList = new Array();
                $.each(selectedUsers, function(i, user) {
                    userIdList.push(user.row_id);
                });
                var mydata = {user_id_list:userIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/removeUserRight",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REMOVE_RIGHT_FAILED")}}");
                        }  else {
                            $("#gridUserList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REMOVE_RIGHT_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        $(function() {
            $("#toolbar").hide();
            $('#gridUserList').on('check.bs.table', selectedChanged);
            $('#gridUserList').on('uncheck.bs.table', selectedChanged);
            $('#gridUserList').on('check-all.bs.table', selectedChanged);
            $('#gridUserList').on('uncheck-all.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
            if(selectedUsers.length > 0) {
                $("#toolbar").show();
            } else {
                $("#toolbar").hide();
            }
        }
    </script>
@endsection

