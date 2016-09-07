@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "PUSH_SERVER";
$input = Input::get();
$isCopy = false;
$copyFromMessageInfo = null;
if(array_key_exists("copy_from",$input)) {
    $isCopy = true;
    $copyFromMessageInfo = \App\lib\CommonUtil::getMessageInfo($input["copy_from"]);
}
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-8 col-xs-8">
            <table style="width: 100%">
                <tr>
                    <td>{{trans("messages.PUSH_TO")}}:</td>
                    <td style="padding: 10px;">
                        <select class="select2-close-mask form-control" name="ddlPushTo" id="ddlPushTo" disabled="disabled">
                            <option value="qplay" selected="selected">QPlay</option>
                        </select>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.PUSH_TYPE")}}:</td>
                    <td style="padding: 10px;">
                        <select class="select2-close-mask form-control" name="ddlType" id="ddlType" onchange="ChangeType()">
                            <option value="event" @if($isCopy && $copyFromMessageInfo->message_type == "event") selected="selected" @endif >event</option>
                            <option value="news" @if($isCopy && $copyFromMessageInfo->message_type == "news") selected="selected" @endif>news</option>
                        </select>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_TITLE")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxTitle" class="form-control"
                               id="tbxTitle" value="@if($isCopy){{$copyFromMessageInfo->message_title}}@endif"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_CONTENT")}}:</td>
                    <td style="padding: 10px;">
                        <textarea data-clear-btn="true" name="tbxContent" class="form-control col-lg-6 col-xs-6"
                               id="tbxContent" value="" rows="3">@if($isCopy)
                                {{$copyFromMessageInfo->message_text}}
                            @endif</textarea>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
            </table>
        </div>

        <div class="col-lg-4 col-xs-4" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-warning" onclick="SendMessage()">
                    {{trans("messages.PUSH_IMMEDIATELY")}}
                </button>
                <a type="button" class="btn btn-default" href="push">
                    {{trans("messages.CANCEL")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row" style="display:none;" id="regionTypeEvent">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_RECEIVER")}}:
            <br/><br/>

            @foreach($allCompanyRoleList as $companyRoles)
                @if(count($companyRoles->roles > 0))
                    <table class="table table-bordered" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca;">
                        <tr>
                            <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                                <input type="checkbox" data="{{$companyRoles->company}}" onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                            </td>
                            <td style="border:1px solid #d6caca;">
                                <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                    <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" class="cbxRole">{{$companyRoles->roles[0]->role_description}}</input>
                                </div>
                                @if(count($companyRoles->roles) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                        <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}" class="cbxRole">{{$companyRoles->roles[1]->role_description}}</input>
                                    </div>
                                @endif
                            </td>
                        </tr>
                        @if(count($companyRoles->roles) > 2)
                        @for($i = 2; $i < (count($companyRoles->roles) + 1) / 2; $i = $i + 2)
                            <tr>
                                <td style="border:1px solid #d6caca;">
                                    @if(count($companyRoles->roles) > $i)
                                        <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                            <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" class="cbxRole">{{$companyRoles->roles[$i]->role_description}}</input>
                                        </div>
                                    @endif
                                        @if(count($companyRoles->roles) > $i + 1)
                                            <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                                <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}" class="cbxRole">{{$companyRoles->roles[$i + 1]->role_description}}</input>
                                            </div>
                                        @endif
                                </td>
                            </tr>
                        @endfor
                        @endif
                    </table>
                @endif
            @endforeach

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

    <div class="row" style="display:none;" id="regionTypeNews">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_RECEIVER")}}:
            <br/><br/>
            <table class="table table-bordered" id="CompanyTable" style="border:1px solid #d6caca;">
                <tr>
                    <td rowspan="{{count($allCompanyRoleList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                        <input type="checkbox" data="All_Company" onclick="CompanyTableSelectedAll(this)">ALL</input>
                    </td>
                    <td style="border:1px solid #d6caca;">
                        @if(count($allCompanyRoleList) > 0)
                        <div class="col-lg-6 col-xs-6" style="text-align: center;">
                            <input type="checkbox" data="{{$allCompanyRoleList[0]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[0]->company}}</input>
                        </div>
                        @endif
                            @if(count($allCompanyRoleList) > 1)
                                <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                    <input type="checkbox" data="{{$allCompanyRoleList[1]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[1]->company}}</input>
                                </div>
                            @endif
                    </td>
                </tr>
                @if(count($allCompanyRoleList) > 2)
                @for($i = 2; $i < (count($allCompanyRoleList) + 1) / 2; $i = $i + 2)
                    <tr>
                        <td style="border:1px solid #d6caca;">
                            @if(count($allCompanyRoleList) > $i)
                                <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                    <input type="checkbox" data="{{$allCompanyRoleList[$i]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[$i]->company}}</input>
                                </div>
                            @endif
                                @if(count($allCompanyRoleList) > $i + 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                        <input type="checkbox" data="{{$allCompanyRoleList[$i + 1]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[$i + 1]->company}}</input>
                                    </div>
                                @endif
                        </td>
                    </tr>
                @endfor
                @endif
            </table>
        </div>
    </div>

    <script>
        var ChangeType = function () {
            var currentType = $("#ddlType").val();
            if(currentType == "event") {
                $("#regionTypeNews").fadeOut(500, function() {
                    $("#regionTypeEvent").fadeIn(500);
                });
            } else if(currentType == "news") {
                $("#regionTypeEvent").fadeOut(500, function() {
                    $("#regionTypeNews").fadeIn(500);
                });
            }
        };

        $(function() {
            ChangeType();
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
                selectedUserChanged();
            });
        };

        var AddUser = function() {
            $("#gridAllUserList").bootstrapTable('uncheckAll');
            $("#gridAllUserList").bootstrapTable('refresh');
            $("#selectUserDialog").modal('show');
        };

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

        var RoleTableSelectedAll = function (cbx) {
            var companyId = $(cbx).attr("data");
            if($(cbx).is(':checked')) {
                $("#RoleTable_" + companyId).find(".cbxRole").prop("checked",true);
            } else {
                $("#RoleTable_" + companyId).find(".cbxRole").prop("checked", false);
            }
        };

        var CompanyTableSelectedAll = function(cbx) {
            if($(cbx).is(':checked')) {
                $("#CompanyTable").find("input[type='checkbox']").prop("checked",true);
            } else {
                $("#CompanyTable").find("input[type='checkbox']").prop("checked", false);
            }
        };
        
        var SendMessage = function () {
            var msgSourcer = $("#ddlPushTo").val();
            var msgType = $("#ddlType").val();
            var msgTitle = $("#tbxTitle").val();
            var msgContent = $("#tbxContent").val();
            var msgReceiver = new Object();
            if(msgTitle == "" || msgContent == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            if(msgType == "news") {
                msgReceiver.type = "news";
                msgReceiver.company_list = new Array();
                $(".cbxNewsCompany").each(function(i, cbx) {
                    if($(cbx).is(':checked')) {
                        msgReceiver.company_list.push($(cbx).attr("data"));
                    }
                });
                if(msgReceiver.company_list.length <= 0) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_MUST_CHOOSE_RECEIVER")}}");
                    return false;
                }
            } else {
                msgReceiver.type = "event";
                msgReceiver.role_list = new Array();
                msgReceiver.user_list = new Array();

                $(".cbxRole").each(function(i, cbx) {
                    if($(cbx).is(':checked')) {
                        msgReceiver.role_list.push($(cbx).attr("data"));
                    }
                });
                var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
                $.each(selectedUsers, function(i, user) {
                    msgReceiver.user_list.push(user.row_id);
                });

                if(msgReceiver.role_list.length <= 0 && msgReceiver.user_list.length <= 0) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_MUST_CHOOSE_RECEIVER")}}");
                    return false;
                }
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_PUSH_IMMEDIATELY")}}", "", function () {
                hideConfirmDialog();

                var mydata =
                {
                    sourcer: msgSourcer,
                    type: msgType,
                    title: msgTitle,
                    content: msgContent,
                    receiver: msgReceiver
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/pushMessageImmediately",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            //TODO redirect to parent page and show message
                            //showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            window.location.href = "push";
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        };


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

