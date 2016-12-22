@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SECRETARY_PUSH";
$input = Input::get();
$push_send_row_id = -1;
$tempFlag = 0;
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();
$isCopy = false;
$messageId = -1;
$copyFromMessageInfo = null;
if(array_key_exists("copy_from",$input)) {
    $isCopy = true;
    $copyFromMessageInfo = \App\lib\CommonUtil::getMessageInfo($input["copy_from"]);
    $messageId = $copyFromMessageInfo->row_id;
    //$push_send_row_id = $input["push_send_row_id"];
    if(array_key_exists('from_history', $input) && $input["from_history"] == "Y") {
        $fromHistory = true;
    }
}
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
                    <td>{{trans("messages.TEMPLATE_ID")}}:</td>
                    <td style="padding: 10px;">
                        <select class="select2-close-mask form-control" name="ddlTemplateID" id="ddlTemplateID" disabled="disabled" >
                            <option value="1" @if($isCopy && $copyFromMessageInfo->template_id == 1) selected="selected" @endif>1</option>
                            <option value="2" @if($isCopy && $copyFromMessageInfo->template_id == 2) selected="selected" @endif>2</option>
                            <option value="3" @if($isCopy && $copyFromMessageInfo->template_id == 3) selected="selected" @endif>3</option>
                            <option value="4" @if($isCopy && $copyFromMessageInfo->template_id == 4) selected="selected" @endif>4</option>
                            <option value="5" @if($isCopy && $copyFromMessageInfo->template_id == 5) selected="selected" @endif>5</option>
                            <option value="6" @if($isCopy && $copyFromMessageInfo->template_id == 6) selected="selected" @endif>6</option>
                            <option value="7" @if($isCopy && $copyFromMessageInfo->template_id == 7) selected="selected" @endif>7</option>
                            <option value="8" @if($isCopy && $copyFromMessageInfo->template_id == 8) selected="selected" @endif>8</option>
                        </select>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.PUSH_TYPE")}}:</td>
                    <td style="padding: 10px;">
                        <select class="select2-close-mask form-control" name="ddlType" id="ddlType" onchange="ChangeType()" >
                            <option value="company" >{{trans("messages.USER_COMPANY")}}</option>
                            <option value="designated" >{{trans("messages.DESIGNATED")}}</option>
                        </select>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_TITLE")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxTitle" class="form-control" placeholder="{{trans("messages.MSG_PUSH_TITLE_PLACEHOLDER")}}"
                               id="tbxTitle" value="@if($isCopy){{$copyFromMessageInfo->message_title}}@endif" />
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_CONTENT")}}:</td>
                    <td style="padding: 10px;">
                        <textarea data-clear-btn="true" name="tbxContent" class="form-control col-lg-6 col-xs-6"
                               id="tbxContent" value="" rows="3">@if($isCopy){{$copyFromMessageInfo->message_text}}@endif</textarea>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
            </table>
        </div>

        <div class="col-lg-4 col-xs-4" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-success" onclick="PushMessage()">
                    {{trans("messages.PUSH_IMMEDIATELY")}}
                </button>
                <a type="button" class="btn btn-default" href="secretaryPush">
                    {{trans("messages.CANCEL")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row" style="display:none;" id="regionTypeCompany">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            <table class="table table-bordered" id="CompanyTable" style="border:1px solid #d6caca;width:60%;">
                <tr>
                    <td rowspan="{{count($allCompanyRoleList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                        <input type="checkbox" data="All_Company" onclick="CompanyTableSelectedAll(this)">ALL</input>
                    </td>
                    <td style="border:1px solid #d6caca;padding: 0px;">
                        @if(count($allCompanyRoleList) > 0)
                            <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                <input type="checkbox" data="{{$allCompanyRoleList[0]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[0]->company}}</input>
                            </div>
                        @endif
                        @if(count($allCompanyRoleList) > 1)
                            <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                <input type="checkbox" data="{{$allCompanyRoleList[1]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[1]->company}}</input>
                            </div>
                        @endif
                    </td>
                </tr>
                @if(count($allCompanyRoleList) > 2)
                    @for($i = 2; $i < (count($allCompanyRoleList) + 1); $i = $i + 2)
                        <tr>
                            <td style="border:1px solid #d6caca;padding: 0px;">
                                @if(count($allCompanyRoleList) > $i)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                        <input type="checkbox" data="{{$allCompanyRoleList[$i]->company}}" class="cbxNewsCompany">{{$allCompanyRoleList[$i]->company}}</input>
                                    </div>
                                @endif
                                @if(count($allCompanyRoleList) > $i + 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
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

    <div class="row" style="display:none;" id="regionTypeDesignated">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">

            <div id="toolbar">
                <button type="button" class="btn btn-danger" style="display: none;" onclick="RemoveUser()" id="btnDeleteUser">
                    {{trans("messages.REMOVE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="AddUser()" id="btnAddUser">
                    {{trans("messages.ADD_RECEIVER")}}
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
        </div>
    </div>

    <script>
        var ChangeType = function () {
            var currentType = $("#ddlType").val();
            if(currentType == "company") {
                $("#regionTypeDesignated").fadeOut(500, function() {
                    $("#regionTypeCompany").fadeIn(500);
                });
            } else if(currentType == "designated") {
                $("#regionTypeCompany").fadeOut(500, function() {
                    $("#regionTypeDesignated").fadeIn(500);
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
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
            var confirmDetailStr = "";

            $.each(selectedUsers, function(i, user) {
                confirmDetailStr += user.login_id + "<br/>";
            });
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_REMOVE_RECEIVER")}}", confirmDetailStr, function () {
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

        var CompanyTableSelectedAll = function(cbx) {
            if($(cbx).is(':checked')) {
                $("#CompanyTable").find("input[type='checkbox']").prop("checked",true);
            } else {
                $("#CompanyTable").find("input[type='checkbox']").prop("checked", false);
            }
        };

        var PushMessage = function () {
            var msgSourcer = $("#ddlPushTo").val();
            var msgType = $("#ddlType").val();
            var msgTitle = $("#tbxTitle").val();
            var msgContent = $("#tbxContent").val();
            var msgTemplateId = $("#ddlTemplateID").val();
            var msgReceiver = new Object();
            if(msgTitle == "" || msgContent == "" || msgTemplateId == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            if(getByteLength(msgTitle) > 99) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_OUT_OF_LENGTH")}}".replace("%s", "{{trans("messages.MESSAGE_TITLE")}}").replace("%l", "99"));
                return false;
            }

            if(msgType == "company") {
                msgReceiver.type = "company";
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
                msgReceiver.type = "designated";
                msgReceiver.user_list = new Array();

                var selectedUsers = $("#gridUserList").bootstrapTable('getData');
                $.each(selectedUsers, function(i, user) {
                    msgReceiver.user_list.push(user.row_id);
                });

                if(msgReceiver.user_list.length <= 0) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_MUST_CHOOSE_RECEIVER")}}");
                    return false;
                }
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_PUSH_IMMEDIATELY")}}".replace("%s", "news"), "", function () {
                hideConfirmDialog();

                var mydata =
                {
                    message_id: {{$messageId}},
                    message_send_id: {{$push_send_row_id}},
                    sourcer: msgSourcer,
                    template_id: msgTemplateId,
                    type: 'news',
                    title: msgTitle,
                    content: msgContent,
                    receiver: msgReceiver
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/pushSecretaryMessage",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            window.location.href = "secretaryPush?with_msg_id=MSG_PUSH_SUCCESS";
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
    @include('layouts.dialog_user_selection')
@endsection

