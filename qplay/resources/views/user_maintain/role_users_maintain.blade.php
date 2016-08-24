@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "USER_ROLE_MAINTAIN";
$input = Input::get();
$roleId = $input["role_id"];
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();
$roleInfo = null;
foreach ($allCompanyRoleList as $companyRoles) {
    foreach ($companyRoles->roles as $role) {
        if($role->row_id == $roleId) {
            $roleInfo = $role;
            break;
        }
    }
}
?>
@extends('layouts.admin_template')
@section('content')

    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table>
                <tr>
                    <td>{{trans("messages.COMPANY_NAME")}}:</td>
                    <td class="text-bold" style="padding: 10px;">{{$roleInfo->company}}</td>
                </tr>
                <tr>
                    <td>{{trans("messages.ROLE_NAME")}}:</td>
                    <td class="text-bold" style="padding: 10px;">{{$roleInfo->role_description}}</td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveRoleUsers()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="roleMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.ROLE_LIST")}}:&nbsp; {{trans("messages.FROM")}} &nbsp;
            <select name="ddlCompany" id="ddlCompany" onchange="BindRoleList()">
                @foreach($allCompanyRoleList as $company)
                    <option value="{{$company->company}}">{{$company->company}}</option>
                @endforeach
            </select>
            <select name="ddlRole" id="ddlRole">

            </select>

            <button type="button" class="btn btn-primary" onclick="CopyList()" id="btnCopyList">
                {{trans("messages.COPY_LIST")}}
            </button>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            <div id="toolbar">
                <button type="button" class="btn btn-danger" onclick="RemoveUser()" id="btnDeleteUser">
                    {{trans("messages.REMOVE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="AddUser()" id="btnAddUser">
                    {{trans("messages.ADD_USER")}}
                </button>
            </div>

            <table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                   data-url="platform/getRoleUsers?role_id={{$roleId}}" data-height="398" data-pagination="true"
                   data-show-refresh="false" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                    <th data-field="login_id" data-sortable="true">{{trans("messages.USER_LOGIN_ID")}}</th>
                    <th data-field="company" data-sortable="true">{{trans("messages.USER_COMPANY")}}</th>
                    <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>


    <script>
        var companyRoleList = new Array();
        @for($i = 0; $i < count($allCompanyRoleList); $i++)
            var companyRole{{$i}} = new Object();
            companyRole{{$i}}.company = "{{$allCompanyRoleList[$i]->company}}";
            companyRole{{$i}}.roles = new Array();
            @for($j = 0; $j < count($allCompanyRoleList[$i]->roles); $j++)
                    var role = new Object();
                    role.row_id = "{{$allCompanyRoleList[$i]->roles[$j]->row_id}}";
                    role.role_description = "{{$allCompanyRoleList[$i]->roles[$j]->role_description}}";
                    companyRole{{$i}}.roles.push(role);
            @endfor
            companyRoleList.push(companyRole{{$i}});
        @endfor

        var BindRoleList = function () {
            $("#ddlRole").find("option").remove();
            var currentSelectedCompanyName = $("#ddlCompany").val();
            $.each(companyRoleList, function(i, companyRoles) {
                if(companyRoles.company == currentSelectedCompanyName) {
                    var optionStrs = "";
                    $.each(companyRoles.roles, function (j, role) {
                        optionStrs += "<option value='" + role.row_id + "'>" + role.role_description + "</option>";
                    });
                    $("#ddlRole").html(optionStrs);
                    return false;
                }
            });
        };

        var CopyList = function () {
            var mydataStr = "";
            $.ajax({
                url: "platform/getRoleUsers?role_id=" + $("#ddlRole").val(),
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
            BindRoleList();
            $("#btnDeleteUser").hide();
            $('#gridUserList').on('check.bs.table', selectedChanged);
            $('#gridUserList').on('uncheck.bs.table', selectedChanged);
            $('#gridUserList').on('check-all.bs.table', selectedChanged);
            $('#gridUserList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridUserList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
            if(selectedUsers.length > 0) {
                $("#btnDeleteUser").show();
                $("#btnAddUser").hide();
            } else {
                $("#btnDeleteUser").hide();
                $("#btnAddUser").show();
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
                            done = true;
                            break;
                        }
                    }
                });
                $("#gridUserList").bootstrapTable('load', currentData);
                selectedChanged();
            });
        };

        var AddUser = function() {
            $("#gridAllUserList").bootstrapTable('uncheckAll');
            $("#gridAllUserList").bootstrapTable('refresh');
            $("#selectUserDialog").modal('show');
        };

        var SaveRoleUsers = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var selectedUsers = $("#gridUserList").bootstrapTable('getData');
                var userIdList = new Array();
                $.each(selectedUsers, function(i, user) {
                    userIdList.push(user.row_id);
                });
                var mydata = {user_id_list:userIdList, role_id:{{$roleId}}};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/saveRoleUsers",
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

        var SelectUser = function() {
            var currentData = $("#gridUserList").bootstrapTable('getData');
            var selectedUsers = $("#gridAllUserList").bootstrapTable('getSelections');
            $.each(selectedUsers, function(i, newUser) {
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
            $("#selectUserDialog").modal('hide');
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
                           data-url="platform/getUserList" data-height="298" data-pagination="true"
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
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SelectUser()">{{trans("messages.SELECT")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection

