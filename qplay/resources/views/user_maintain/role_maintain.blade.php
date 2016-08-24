@include("layouts.lang")
<?php
$menu_name = "USER_ROLE_MAINTAIN";
$allCompanyList = \App\lib\CommonUtil::getAllCompanyRoleList();
?>
@extends('layouts.admin_template')
@section('content')

    <div id="toolbar">
        <button type="button" class="btn btn-danger" onclick="deleteRole()" id="btnDeleteRole">
            {{trans("messages.DELETE")}}
        </button>
        <button type="button" class="btn btn-primary" onclick="newRole()" id="btnNewRole">
            {{trans("messages.NEW")}}
        </button>
    </div>
    <table id="gridRoleList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="platform/getRoleList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="company" data-sortable="true">{{trans("messages.COMPANY_NAME")}}</th>
            <th data-field="role_description" data-sortable="true" data-formatter="roleNameFormatter">{{trans("messages.ROLE_NAME")}}</th>
            <th data-field="user_count" data-sortable="true" data-formatter="userCountFormatter">{{trans("messages.USERS")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function roleNameFormatter(value, row) {
            return '<a href="#" onclick="updateRole(' + row.row_id + ')">' + value + '</a>';
        };

        function userCountFormatter(value, row) {
            return '<a href="roleUsersMaintain?role_id=' + row.row_id + '">' + value + '</a>';
        };

        var deleteRole = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_ROLE")}}", "", function () {
                hideConfirmDialog();
                var selectedRoles = $("#gridRoleList").bootstrapTable('getSelections');
                var check = true;
                $.each(selectedRoles, function (i, role) {
                    if(role.user_count > 0) {
                        check = false;
                        return false;
                    }
                });
                if(!check) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_ROLE_EXIST_USERS")}}");
                    return false;
                }
                
                var roleIdList = new Array();
                $.each(selectedRoles, function(i, role) {
                    roleIdList.push(role.row_id);
                });
                var mydata = {role_id_list:roleIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/deleteRole",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_ROLE_FAILED")}}");
                        }  else {
                            $("#gridRoleList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_ROLE_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        var currentMaintainRoleId = null;
        var isNewRole = false;
        var newRole = function() {
            $("#tbxRoleName").val("");
            $("#roleDetailMaintainDialogTitle").text("{{trans("messages.MSG_NEW_ROLE")}}");
            $("#roleDetailMaintainDialog").modal('show');
            currentMaintainRoleId = null;
            isNewRole = true;
        };

        var updateRole = function(roleId) {
            var allRoleList = $("#gridRoleList").bootstrapTable('getData');
            $.each(allRoleList, function(i, role) {
                if(role.row_id == roleId) {
                    $("#ddlCompany").val(role.company);
                    $("#tbxRoleName").val(role.role_description);
                    return false;
                }
            });

            $("#roleDetailMaintainDialogTitle").text("{{trans("messages.MSG_EDIT_ROLE")}}");
            $("#roleDetailMaintainDialog").modal('show');
            currentMaintainRoleId = roleId;
            isNewRole = false;
        };

        var SaveRoleMaintain = function() {
            var company = $("#ddlCompany").val();
            var roleDesc = $("#tbxRoleName").val();
            if(company == "" || roleDesc == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var mydata = {
                    isNew:'Y',
                    roleId:-1,
                    company:company,
                    roleDesc:roleDesc
                };
                if(!isNewRole) {
                    mydata.isNew = 'N';
                    mydata.roleId = currentMaintainRoleId;
                }
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/saveRole",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_ROLE_FAILED")}}");
                        }  else {
                            $("#gridRoleList").bootstrapTable('refresh');
                            $("#roleDetailMaintainDialog").modal('hide');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_ROLE_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        $(function() {
            $("#btnDeleteRole").hide();
            $('#gridRoleList').on('check.bs.table', selectedChanged);
            $('#gridRoleList').on('uncheck.bs.table', selectedChanged);
            $('#gridRoleList').on('check-all.bs.table', selectedChanged);
            $('#gridRoleList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridRoleList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedUsers = $("#gridRoleList").bootstrapTable('getSelections');
            if(selectedUsers.length > 0) {
                $("#btnDeleteRole").show();
                $("#btnNewRole").hide();
            } else {
                $("#btnDeleteRole").hide();
                $("#btnNewRole").show();
            }
        }

    </script>

@endsection

@section('dialog_content')
    <div id="roleDetailMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="roleDetailMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>{{trans("messages.USER_COMPANY")}}:</td>
                            <td style="padding: 10px;">
                                <select placeholder="Company" name="ddlCompany" id="ddlCompany">
                                    @foreach($allCompanyList as $company)
                                        <option value="{{$company->company}}">{{$company->company}}</option>
                                    @endforeach
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.ROLE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxRoleName"
                                       id="tbxRoleName" value=""/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SaveRoleMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
