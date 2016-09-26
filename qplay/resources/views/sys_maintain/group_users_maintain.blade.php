@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SYS_GROUP_MAINTAIN";
$input = Input::get();
$groupId = $input["group_id"];
$allGroupList = \App\lib\CommonUtil::getAllGroupList();
$groupInfo = \App\lib\CommonUtil::getGroup($groupId);
?>
@extends('layouts.admin_template')
@section('content')

    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table>
                <tr>
                    <td>{{trans("messages.GROUP_NAME")}}:</td>
                    <td class="text-bold" style="padding: 10px;">{{$groupInfo->group_name}}</td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveGroupUsers()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="groupMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            <div id="toolbar">
                <button type="button" class="btn btn-danger" onclick="RemoveUser()" id="btnDeleteUser" style="display: none;">
                    {{trans("messages.REMOVE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="AddUser()" id="btnAddUser">
                    {{trans("messages.ADD_USER")}}
                </button>
            </div>

            <table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                   data-url="platform/getGroupUsers?group_id={{$groupId}}" data-height="398" data-pagination="true"
                   data-show-refresh="false" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
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
        </div>
    </div>


    <script>
        var CopyList = function () {
            var mydataStr = "";
            $.ajax({
                url: "platform/getGroupUsers?group_id=" + $("#ddlGroup").val(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    var currentData = $("#gridUserList").bootstrapTable('getData');
                    $.each(d, function(i, newUser) {
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
                    showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_COPY_LIST_SUCCESS")}}");
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });
        };

        $(function () {
            $('#gridUserList').on('check.bs.table', selectedChanged);
            $('#gridUserList').on('uncheck.bs.table', selectedChanged);
            $('#gridUserList').on('check-all.bs.table', selectedChanged);
            $('#gridUserList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridUserList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');

            if(selectedUsers.length > 0) {
                $("#btnAddUser").fadeOut(300, function() {
                    $("#btnDeleteUser").fadeIn(300);
                });
            } else {
                $("#btnDeleteUser").fadeOut(300, function() {
                    $("#btnAddUser").fadeIn(300);
                });
            }
        };

        var RemoveUser = function () {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_REMOVE_USER")}}", "", function () {
                hideConfirmDialog();
                var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
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
                selectedChanged();
            });
        };

        var AddUser = function() {
            selectUserDialog_Show();
        };

        var SaveGroupUsers = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var selectedUsers = $("#gridUserList").bootstrapTable('getData');
                var userIdList = new Array();
                $.each(selectedUsers, function(i, user) {
                    userIdList.push(user.row_id);
                });
                var mydata = {user_id_list:userIdList, group_id:{{$groupId}}};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/saveGroupUsers",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        }

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
        }
    </script>
@endsection

@section('dialog_content')
    <div id="selectUserDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="roleDetailMaintainDialogTitle">{{trans("messages.SELECT_USER")}}</h1>
                </div>
                <div class="modal-body">
                    <table id="gridAllUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id"
                           data-url="platform/getUserListWithoutGroup" data-height="298" data-pagination="true"
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
                            <th data-field="status" data-sortable="true">{{trans("messages.STATUS")}}</th>
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
            $("#gridAllUserList").bootstrapTable('refresh');
            $("#selectUserDialog").modal('show');
        };
    </script>
@endsection

