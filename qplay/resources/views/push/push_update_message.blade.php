@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "PUSH_SERVER";
$input = Input::get();
$templateCount = 16;
$push_send_row_id = $input["push_send_row_id"];
$messageId = $input["message_id"];
$tempFlag = 0;
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();

$sendInfo = \App\lib\CommonUtil::getMessageSendInfo($push_send_row_id);

$messageInfo = $sendInfo->message_info;
$messageType = $sendInfo->message_info->message_type;

$msgTitle = str_replace(array("\r","\n"), ' ', $messageInfo->message_title);
$msgTitle = str_replace(array("\r","\n"), ' ', $msgTitle);

?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-5 col-xs-5"></div>
        <div class="col-lg-7 col-xs-7" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <table>
                    <tr>
                        <td style="padding: 5px;">
                            {{trans("messages.PUBLISH_STATUS")}}:
                        </td>
                        <td style="padding: 5px;">
                            <div class="switch" id="switchVisible" data-on="success" data-on-label="Y" data-off-label="N">
                                <input type="checkbox" id="cbxVisible"
                                       @if($messageInfo->visible == 'Y')
                                       checked
                                        @endif
                                />
                            </div>
                        </td>
                        <td style="padding: 5px;">
                            <button type="button" class="btn btn-warning" onclick="SaveMessage()">
                                {{trans("messages.SAVE")}}
                            </button>
                        </td>
                        <td style="padding: 5px;">
                            <button type="button" class="btn btn-success" onclick="PushMessage()">
                                {{trans("messages.PUSH_IMMEDIATELY")}}
                            </button>
                        </td>
                        <td style="padding: 5px;">
                            <a type="button" class="btn btn-default" href="push">
                                {{trans("messages.CANCEL")}}
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
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
                        <select class="select2-close-mask form-control" name="ddlTemplateID" id="ddlTemplateID">
                            @for ($i = 1; $i <= $templateCount; $i++)
                            <option value="{{$i}}" @if($messageInfo->template_id == $i) selected="selected" @endif>{{$i}}</option>
                            @endfor
                        </select>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.PUSH_TYPE")}}:</td>
                    <td style="padding: 10px;">
                        <select class="select2-close-mask form-control" name="ddlType" id="ddlType" onchange="return ChangeType()" >
                            <option value="event"
                                    @if($messageInfo->message_type=='event')
                                    selected="selected"
                                    @endif>Event</option>
                            <option value="news"
                                    @if($messageInfo->message_type=='news')
                                    selected="selected"
                                    @endif>News</option>
                        </select>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_TITLE")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxTitle" class="form-control" placeholder="{{trans("messages.MSG_PUSH_TITLE_PLACEHOLDER")}}"
                               id="tbxTitle" value="{{$messageInfo->message_title}}" />
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_CONTENT")}}:</td>
                    <td style="padding: 10px;">
                        <textarea data-clear-btn="true" name="tbxContent" class="form-control col-lg-6 col-xs-6"
                               id="tbxContent" value="" rows="3">{{$messageInfo->message_text}}</textarea>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td style="width: 120px;">{{trans("messages.MESSAGE_SCHEDULE_PUSH")}}:</td>
                    <td style="padding: 10px;">
                        <input type="checkbox" id="cbxSchedule" onchange="return ChangeIsSchedule();"/>
                    </td>
                    <td></td>
                </tr>
                <tr id="rowScheduleDatetime" style="display: none;">
                    <td></td>
                    <td style="padding-left: 10px;">
                        <div class="input-group date form_datetime" data-date="" data-date-format="yyyy-MM-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii"
                             data-link-field="tbxScheduleDate" >
                            <input class="form-control" size="16" type="text" value="" readonly>
                            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                        </div>
                        <input type="hidden" id="tbxScheduleDateTime" value="" /><br/>
                    </td>
                    <td></td>
                </tr>
            </table>
        </div>

        <div class="col-lg-4 col-xs-4" >

        </div>
    </div>

    <div class="row" style="display:none;" id="regionTypeEvent">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_RECEIVER")}}:&nbsp;&nbsp;{{trans("messages.MSG_EVENT_INFORMATION")}}
            <br/><br/>

            @foreach($allCompanyRoleList as $companyRoles)
            <!--{{$tempFlag++}}-->
                @if(count($companyRoles->roles > 0))
                    <table class="table table-bordered RoleTable" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca;width:60%;">
                        <tr>
                            <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;background-color:@if($tempFlag % 2 == 0) #d9edf7; @else #f9edf7; @endif">
                                <input class="cbxCompany" type="checkbox" data="{{$companyRoles->company}}" onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                            </td>
                            <td style="border:1px solid #d6caca;padding: 0px;">
                                <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                    <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}"
                                           class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                           @if(in_array($companyRoles->roles[0]->row_id, $sendInfo->role_list)) checked="checked" @endif >{{$companyRoles->roles[0]->role_description}}</input>
                                </div>
                                @if(count($companyRoles->roles) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}"
                                               class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                               @if(in_array($companyRoles->roles[1]->row_id, $sendInfo->role_list)) checked="checked" @endif>{{$companyRoles->roles[1]->role_description}}</input>
                                    </div>
                                @endif
                            </td>
                        </tr>
                        @if(count($companyRoles->roles) > 2)
                        @for($i = 2; $i < (count($companyRoles->roles) + 1); $i = $i + 2)
                            <tr>
                                <td style="border:1px solid #d6caca;padding: 0px;">
                                    @if(count($companyRoles->roles) > $i)
                                        <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                            <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}"
                                                   class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                                   @if(in_array($companyRoles->roles[$i]->row_id, $sendInfo->role_list)) checked="checked" @endif>{{$companyRoles->roles[$i]->role_description}}</input>
                                        </div>
                                    @endif
                                        @if(count($companyRoles->roles) > $i + 1)
                                            <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                                <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}"
                                                       class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                                       @if(in_array($companyRoles->roles[$i + 1]->row_id, $sendInfo->role_list)) checked="checked" @endif>{{$companyRoles->roles[$i + 1]->role_description}}</input>
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
                    {{trans("messages.ADD_RECEIVER")}}
                </button>
            </div>

            <table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                   data-url="push/getSingleEventMessageReceiver?message_send_row_id={{$push_send_row_id}}" data-height="398" data-pagination="true"
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

    <div class="row" style="display:none;" id="regionTypeNews">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_RECEIVER")}}:&nbsp;&nbsp;{{trans("messages.MSG_NEWS_INFORMATION")}}
            <br/><br/>
            <table class="table table-bordered" id="CompanyTable" style="border:1px solid #d6caca;width:60%;">
                <tr>
                    <td rowspan="{{count($allCompanyRoleList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                        <input type="checkbox" data="All_Company" onclick="CompanyTableSelectedAll(this)">ALL</input>
                    </td>
                    <td style="border:1px solid #d6caca;padding: 0px;">
                        @if(count($allCompanyRoleList) > 0)
                        <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                            <input type="checkbox" data="{{$allCompanyRoleList[0]->company}}" class="cbxNewsCompany"
                                   @if(in_array($allCompanyRoleList[0]->company, $sendInfo->company_list)) checked="checked" @endif>{{$allCompanyRoleList[0]->company}}</input>
                        </div>
                        @endif
                            @if(count($allCompanyRoleList) > 1)
                                <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                    <input type="checkbox" data="{{$allCompanyRoleList[1]->company}}" class="cbxNewsCompany"
                                           @if(in_array($allCompanyRoleList[1]->company, $sendInfo->company_list)) checked="checked" @endif>{{$allCompanyRoleList[1]->company}}</input>
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
                                    <input type="checkbox" data="{{$allCompanyRoleList[$i]->company}}" class="cbxNewsCompany"
                                           @if(in_array($allCompanyRoleList[$i]->company, $sendInfo->company_list)) checked="checked" @endif>{{$allCompanyRoleList[$i]->company}}</input>
                                </div>
                            @endif
                                @if(count($allCompanyRoleList) > $i + 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" data="{{$allCompanyRoleList[$i + 1]->company}}" class="cbxNewsCompany"
                                               @if(in_array($allCompanyRoleList[$i + 1]->company, $sendInfo->company_list)) checked="checked" @endif>{{$allCompanyRoleList[$i + 1]->company}}</input>
                                    </div>
                                @endif
                        </td>
                    </tr>
                @endfor
                @endif
            </table>
        </div>
    </div>

    <style>
    </style>
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
            return false;
        };

        var ChangeIsSchedule = function () {
            if($("#cbxSchedule").is(":checked")) {
                $("#rowScheduleDatetime").fadeIn();
                $('.form_datetime').datetimepicker("setDate", new Date());
            } else {
                $("#rowScheduleDatetime").fadeOut();
            }
        };

        $(function() {
            $('#switchVisible').on('switch-change', SaveMessageVisible);
            ChangeType();
            $('#gridUserList').on('check.bs.table', selectedUserChanged);
            $('#gridUserList').on('uncheck.bs.table', selectedUserChanged);
            $('#gridUserList').on('check-all.bs.table', selectedUserChanged);
            $('#gridUserList').on('uncheck-all.bs.table', selectedUserChanged);
            $('#gridUserList').on('load-success.bs.table', selectedUserChanged);

            CheckRoleTableSelect();

            $('.form_datetime').datetimepicker({
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                showMeridian: 1,
                format: "yyyy-mm-dd hh:ii"
            });
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

        var CheckRoleTableSelect = function () {
            $(".RoleTable").each(function(i, tb) {
                var $companyTable = $(tb);
                var allCheckd = true;
                $.each($companyTable.find(".cbxRole"), function(i, cbx) {
                    if(!$(cbx).is(":checked")) {
                        allCheckd = false;
                        return false;
                    }
                });
                if(allCheckd) {
                    $companyTable.find(".cbxCompany").prop("checked",true);
                } else {
                    $companyTable.find(".cbxCompany").prop("checked",false);
                }
            });
        };

        var RoleTableSelectedAll = function (cbx) {
            var companyId = $(cbx).attr("data");
            if($(cbx).is(':checked')) {
                $("#RoleTable_" + companyId).find(".cbxRole").prop("checked",true);
            } else {
                $("#RoleTable_" + companyId).find(".cbxRole").prop("checked", false);
            }
        };

        var RoleTableSelectedOne = function (cbx) {
            var $companyTable = $(cbx).parents("table").first();
            var allCheckd = true;
            $.each($companyTable.find(".cbxRole"), function(i, cbx) {
                if(!$(cbx).is(":checked")) {
                    allCheckd = false;
                    return false;
                }
            });
            if(allCheckd) {
                $companyTable.find(".cbxCompany").prop("checked",true);
            } else {
                $companyTable.find(".cbxCompany").prop("checked",false);
            }
        };

        var CompanyTableSelectedAll = function(cbx) {
            if($(cbx).is(':checked')) {
                $("#CompanyTable").find("input[type='checkbox']").prop("checked",true);
            } else {
                $("#CompanyTable").find("input[type='checkbox']").prop("checked", false);
            }
        };

        var SaveMessage = function () {
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

            if(msgType == "news") {
                msgReceiver.type = "news";
                msgReceiver.company_list = new Array();
                $(".cbxNewsCompany").each(function(i, cbx) {
                    if($(cbx).is(':checked')) {
                        msgReceiver.company_list.push($(cbx).attr("data"));
                    }
                });
            } else {
                msgReceiver.type = "event";
                msgReceiver.company_list = new Array();
                msgReceiver.role_list = new Array();
                msgReceiver.user_list = new Array();

                $(".cbxRole").each(function(i, cbx) {
                    if($(cbx).is(':checked')) {
                        msgReceiver.role_list.push($(cbx).attr("data"));
                    }
                });
                var selectedUsers = $("#gridUserList").bootstrapTable('getData');
                $.each(selectedUsers, function(i, user) {
                    msgReceiver.user_list.push(user.row_id);
                });
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE_IMMEDIATELY")}}".replace("%s", msgType), "", function () {
                hideConfirmDialog();
                var mydata =
                {
                    message_id: {{$messageId}},
                    message_send_id: {{$push_send_row_id}},
                    sourcer: msgSourcer,
                    template_id: msgTemplateId,
                    type: msgType,
                    title: msgTitle,
                    content: msgContent,
                    receiver: msgReceiver
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "push/saveUpdateMessage",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            var sendId = d.send_id;
                            var msgId = d.message_id;
                            window.location.href = "updateMessage?with_msg_id=MSG_OPERATION_SUCCESS&push_send_row_id=" + sendId + "&message_id=" + msgId;//"push";
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
        };

        var PushMessage = function () {
            var msgSourcer = $("#ddlPushTo").val();
            var msgType = $("#ddlType").val();
            var msgTitle = $("#tbxTitle").val();
            var msgContent = $("#tbxContent").val();
            var msgTemplateId = $("#ddlTemplateID").val();
            var msgReceiver = new Object();
            var msgIsSchedule = $("#cbxSchedule").is(":checked");
            var msgScheduleDate = $('.form_datetime').datetimepicker("getDate");

            if(msgTitle == "" || msgContent == "" || msgTemplateId == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            if(msgIsSchedule && msgScheduleDate < (new Date())) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_RESERVE_PUSH_TIME_MUST_BE_SOMETIME_IN_THE_FUTURE")}}");
                return false;
            }

            if(getByteLength(msgTitle) > 99) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_OUT_OF_LENGTH")}}".replace("%s", "{{trans("messages.MESSAGE_TITLE")}}").replace("%l", "99"));
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
                msgReceiver.company_list = new Array();
                msgReceiver.role_list = new Array();
                msgReceiver.user_list = new Array();

                $(".cbxRole").each(function(i, cbx) {
                    if($(cbx).is(':checked')) {
                        msgReceiver.role_list.push($(cbx).attr("data"));
                    }
                });
                var selectedUsers = $("#gridUserList").bootstrapTable('getData');
                $.each(selectedUsers, function(i, user) {
                    msgReceiver.user_list.push(user.row_id);
                });

                if(msgReceiver.role_list.length <= 0 && msgReceiver.user_list.length <= 0) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_MUST_CHOOSE_RECEIVER")}}");
                    return false;
                }
            }

            var messageVisible = false;
            if($('#cbxVisible').is(':checked')) {
                messageVisible = true;
            }

            if(!messageVisible) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_MESSAGE_INVISIBLE")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_PUSH_IMMEDIATELY")}}".replace("%s", msgType), "", function () {
                hideConfirmDialog();
                var mydata =
                {
                    message_id: {{$messageId}},
                    message_send_id: {{$push_send_row_id}},
                    sourcer: msgSourcer,
                    template_id: msgTemplateId,
                    type: msgType,
                    title: msgTitle,
                    content: msgContent,
                    receiver: msgReceiver,
                    is_schedule: msgIsSchedule,
                    schedule_datetime: msgScheduleDate.getTime()
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "push/saveUpdateAndPushMessage",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            //TODO redirect to parent page and show message
                            var sendId = d.send_id;
                            var msgId = d.message_id;
                            //showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            //window.location.href = "pushSendDetail?with_msg_id=MSG_PUSH_SUCCESS&push_send_row_id=" + sendId + "&message_id=" + msgId;//"push";
                            //window.location.href = "updateMessage?with_msg_id=MSG_OPERATION_SUCCESS&push_send_row_id=" + sendId + "&message_id=" + msgId;//"push";
                            window.location.href = "messagePushHistory?with_msg_id=MSG_PUSH_SUCCESS&message_id=" + msgId;//"push";
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
        };

        var oriVisible = '{{$messageInfo->visible}}';
        var msgY = "{{trans("messages.MSG_CONFIRM_SAVE_PUSH_STATUS_Y")}}".replace("%s", "{{$msgTitle}}");
        var msgN = "{{trans("messages.MSG_CONFIRM_SAVE_PUSH_STATUS_N")}}".replace("%s", "{{$msgTitle}}");
        var SaveMessageVisible = function () {
            var visible = "N";
            var msg = msgN;
            if($('#cbxVisible').is(':checked')) {
                visible = "Y";
                msg = msgY;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", msg, "", function () {
                $('#confirmDialog').unbind();
                hideConfirmDialog();

                var mydata =
                {
                    message_id: {{$messageId}},
                    visible: visible
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "push/saveMessageVisible",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            oriVisible = visible;
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
            }, function () {
                $('#switchVisible').unbind();
                if(oriVisible == "Y") {
                    $('#switchVisible').bootstrapSwitch('setState', true);
                } else {
                    $('#switchVisible').bootstrapSwitch('setState', false);
                }
                $('#switchVisible').on('switch-change', SaveMessageVisible);
            });
        };
    </script>
@endsection

@section('dialog_content')
    @include('layouts.dialog_user_selection')
@endsection

