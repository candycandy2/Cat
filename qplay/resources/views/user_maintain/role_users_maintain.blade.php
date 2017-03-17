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
            <table>
                <tr>
                    <td>{{trans("messages.ROLE_LIST")}}:&nbsp; {{trans("messages.FROM")}} &nbsp;</td>
                    <td>
                        <select name="ddlCompany" id="ddlCompany" onchange="BindRoleList()" class="form-control">
                            @foreach($allCompanyRoleList as $company)
                                <option value="{{$company->company}}"
                                @if($roleInfo->company == $company->company)
                                    selected = "selected"
                                @endif
                                >{{$company->company}}</option>
                            @endforeach
                        </select>
                    </td>
                    <td>
                        <select name="ddlRole" id="ddlRole" class="form-control">
                            <button type="button" class="btn btn-primary" onclick="CopyList()" id="btnCopyList">
                                {{trans("messages.COPY_LIST")}}
                            </button>
                        </select>
                    </td>
                    <td> &nbsp;
                        <button type="button" class="btn btn-primary" onclick="CopyList()" id="btnCopyList">
                            {{trans("messages.COPY_LIST")}}
                        </button>
                    </td>
                </tr>
            </table>
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
                   data-url="platform/getRoleUsers?role_id={{$roleId}}" data-height="398" data-pagination="true"
                   data-show-refresh="false" data-row-style="rowStyle" data-search="false"
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
                        if(role.row_id != '{{$roleId}}') {
                            optionStrs += "<option value='" + role.row_id + "'>" + role.role_description + "</option>";
                        }
                    });
                    $("#ddlRole").html(optionStrs);
                    return false;
                }
            });
        };

        var CopyList = function () {
            var selectedCompanyTxt = $("#ddlCompany").find("option:selected").text();
            var selectedRoleTxt = $("#ddlRole").find("option:selected").text();
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_COPY")}}", selectedCompanyTxt + "-" + selectedRoleTxt, function () {
                hideConfirmDialog();

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
                        if(handleAJAXError(this,e)){
                            return false;
                        }
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        $(function () {
            BindRoleList();
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
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
            var confirmStr = "";
            $.each(selectedUsers, function(i, user) {
                confirmStr += user.login_id + "<br/>";
            });
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_REMOVE_USER")}}", confirmStr, function () {
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
                selectedChanged();
            });
        };

        var AddUser = function() {
            $("#gridAllUserList").bootstrapTable('uncheckAll');
            $("#gridAllUserList").bootstrapTable('resetSearch', "");
            $("#gridAllUserList").bootstrapTable('refresh');
            selectUserDialog_Show();
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
                        if(handleAJAXError(this,e)){
                            return false;
                        }
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        }

        var afterSelectedUser = function (selectedUserList) {
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
@endsection

@section('dialog_content')
    @include('layouts.dialog_user_selection')
@endsection

