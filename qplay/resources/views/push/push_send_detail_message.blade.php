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
?>
@extends('layouts.admin_template')
@section('content')
    <style>
        label {
            font-weight: normal !important;
        }       
    </style>
    <div class="row">
        <div class="col-lg-8 col-xs-8">
            <div class="form-group row">
              <label for="ddlPushTo" class="col-xs-2">{{trans("messages.PUSH_TO")}}:</label>
              <div class="col-xs-10">
                <select class="select2-close-mask form-control" name="ddlPushTo" id="ddlPushTo" disabled="disabled">
                    <option value="qplay" selected="selected">QPlay</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
                <label for="ddlPushTo" class="col-xs-2">{{trans("messages.TEMPLATE_ID")}}:</label>
                <div class="col-xs-10">
                    <select class="select2-close-mask form-control" name="ddlTemplateID" id="ddlTemplateID" disabled="disabled">
                        @for ($i = 1; $i <= $templateCount; $i++)
                            <option value="{{$i}}" @if($messageInfo->template_id == $i) selected="selected" @endif>{{$i}}</option>
                        @endfor
                    </select>
                </div>
            </div>
            <div class="form-group row">
              <label for="ddlType" class="col-xs-2">{{trans("messages.PUSH_TYPE")}}:</label>
              <div class="col-xs-10">
               <select class="select2-close-mask form-control" name="ddlType" id="ddlType" disabled="disabled">
                    <option value="event"
                            @if($messageInfo->message_type=='event')
                            selected="selected"
                            @endif>Event</option>
                    <option value="news"
                            @if($messageInfo->message_type=='news')
                            selected="selected"
                            @endif>News</option>
                </select>
              </div>
            </div>
            <div class="form-group row">
              <label for="tbxMessageTitle" class="col-xs-2">{{trans("messages.MESSAGE_TITLE")}}:</label>
              <div class="col-xs-10">
                {{$messageInfo->message_title}}
              </div>
            </div>
            <div class="form-group row" style="word-wrap:break-word;">
              <label for="tbxMessageContent" class="col-xs-2">{{trans("messages.MESSAGE_CONTENT")}}:</label>
              <div class="col-xs-10">
                  <pre>{{$messageInfo->message_text}}</pre>
              </div>
            </div>

            <div class="form-group row">
                <label for="tbxMessageTitle" class="col-xs-2">{{trans("messages.MESSAGE_SCHEDULE_PUSH")}}:</label>
                <div class="col-xs-10">
                    <input type="checkbox" id="cbxSchedule" onchange="return ChangeIsSchedule();"/>
                </div>
            </div>
            <div class="form-group row">
                <label for="tbxMessageTitle" class="col-xs-2"> </label>
                <div class="col-xs-10" id="rowScheduleDatetime" style="display: none;">
                    <div class="input-group date form_datetime" data-date="" data-date-format="yyyy-MM-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii"
                         data-link-field="tbxScheduleDate" >
                        <input class="form-control" size="16" type="text" value="" readonly>
                        <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
                    </div>
                    <input type="hidden" id="tbxScheduleDateTime" value="" /><br/>
                </div>
            </div>

            <div class="form-group row" style="word-wrap:break-word;">
                <label for="tbxMessageContent" class="col-xs-2">{{trans("messages.MESSAGE_SEND_HISTORY")}}:</label>
                <div class="col-xs-10">
                    <span id="js-sendDate">{{$sendInfo->created_at}}</span> &nbsp;&nbsp;&nbsp; {{$sendInfo->source_user}}
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-xs-4" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-warning" onclick="SendAgain()">
                    {{trans("messages.PUSH_AGAIN")}}
                </button>
                <a type="button" class="btn btn-default" href="messagePushHistory?message_id={{$messageId}}">
                    {{trans("messages.CANCEL")}}
                </a>
            </div>
        </div>
    </div>

    @if($messageType == "event")
    <div class="row" id="regionTypeEvent">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_RECEIVER")}}:
            <br/><br/>
            @foreach($allCompanyRoleList as $companyRoles)
            <!--{{$tempFlag++}}-->
                @if(count($companyRoles->roles > 0))
                    <table class="table table-bordered RoleTable" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca;width:60%;">
                        <tr>
                            <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;background-color:@if($tempFlag % 2 == 0) #d9edf7; @else #f9edf7; @endif">
                                <input class="cbxCompany" type="checkbox" data="{{$companyRoles->company}}" disabled="disabled"
                                       onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                            </td>
                            <td style="border:1px solid #d6caca;padding: 0px;">
                                <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                    <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" class="cbxRole" disabled="disabled"
                                           @if(in_array($companyRoles->roles[0]->row_id, $sendInfo->role_list)) checked="checked" @endif
                                    >{{$companyRoles->roles[0]->role_description}}</input>
                                </div>
                                    @if(count($companyRoles->roles) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}" class="cbxRole" disabled="disabled"
                                               @if(in_array($companyRoles->roles[1]->row_id, $sendInfo->role_list)) checked="checked" @endif
                                        >{{$companyRoles->roles[1]->role_description}}</input>
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
                                            <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" class="cbxRole" disabled="disabled"
                                                   @if(in_array($companyRoles->roles[$i]->row_id, $sendInfo->role_list)) checked="checked" @endif
                                            >{{$companyRoles->roles[$i]->role_description}}</input>
                                        </div>
                                    @endif
                                    @if(count($companyRoles->roles) > $i + 1)
                                            <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                                <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}" class="cbxRole" disabled="disabled"
                                                       @if(in_array($companyRoles->roles[$i + 1]->row_id, $sendInfo->role_list)) checked="checked" @endif
                                                >{{$companyRoles->roles[$i + 1]->role_description}}</input>
                                            </div>
                                    @endif
                                </td>
                            </tr>
                        @endfor
                        @endif
                    </table>
                @endif
            @endforeach

            <table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                   data-url="push/getSingleEventMessageReceiver?message_send_row_id={{$push_send_row_id}}" data-height="398" data-pagination="true"
                   data-show-refresh="false" data-row-style="rowStyle" data-search="false"
                   data-show-toggle="false"  data-sortable="false"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
                    <th data-field="login_id" data-sortable="true">{{trans("messages.USER_LOGIN_ID")}}</th>
                    <th data-field="company" data-sortable="true">{{trans("messages.USER_COMPANY")}}</th>
                    <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>
    @elseif($messageType == "news")
    <div class="row" id="regionTypeNews">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_RECEIVER")}}:
            <br/><br/>
            <table class="table table-bordered" id="CompanyTable" style="border:1px solid #d6caca;width:60%;">
                <tr>
                    <td rowspan="{{count($allCompanyRoleList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                        <input type="checkbox" data="All_Company" disabled="disabled" onclick="CompanyTableSelectedAll(this)">ALL</input>
                    </td>
                    <td style="border:1px solid #d6caca;padding: 0px;">
                        <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                        <input type="checkbox" disabled="disabled" data="{{$allCompanyRoleList[0]->company}}"
                               @if(in_array($allCompanyRoleList[0]->company, $sendInfo->company_list)) checked="checked" @endif
                               class="cbxNewsCompany">{{$allCompanyRoleList[0]->company}}</input>
                        </div>
                        @if(count($allCompanyRoleList) > 1)
                            <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                <input type="checkbox" disabled="disabled" data="{{$allCompanyRoleList[1]->company}}"
                                       @if(in_array($allCompanyRoleList[1]->company, $sendInfo->company_list)) checked="checked" @endif
                                       class="cbxNewsCompany">{{$allCompanyRoleList[1]->company}}</input>
                            </div>
                        @endif
                    </td>
                </tr>
                @if(count($allCompanyRoleList) > 2)
                @for($i = 2; $i < (count($allCompanyRoleList) + 1) ; $i = $i + 2)
                    <tr>
                        <td style="border:1px solid #d6caca;padding: 0px;">
                            @if(count($allCompanyRoleList) > $i)
                            <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                <input type="checkbox" disabled="disabled" data="{{$allCompanyRoleList[$i]->company}}"
                                       @if(in_array($allCompanyRoleList[$i]->company, $sendInfo->company_list)) checked="checked" @endif
                                       class="cbxNewsCompany">{{$allCompanyRoleList[$i]->company}}</input>
                            </div>
                            @endif
                                @if(count($allCompanyRoleList) > $i + 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" disabled="disabled" data="{{$allCompanyRoleList[$i + 1]->company}}"
                                               @if(in_array($allCompanyRoleList[$i + 1]->company, $sendInfo->company_list)) checked="checked" @endif
                                               class="cbxNewsCompany">{{$allCompanyRoleList[$i + 1]->company}}</input>
                                    </div>
                                @endif
                        </td>
                    </tr>
                @endfor
                @endif
            </table>
        </div>
    </div>
    @endif
    <script>
        $(function() {
            CheckRoleTableSelect();
            var sendDate = $('#js-sendDate').text();
            $('#js-sendDate').text(convertUTCToLocalDateTime(sendDate));

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

        var msgVisible = '{{$messageInfo->visible}}';

        var SendAgain = function () {
            if(msgVisible.toUpperCase() != 'Y') {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_MESSAGE_INVISIBLE")}}");
                return false;
            }

            var msgIsSchedule = $("#cbxSchedule").is(":checked");
            var msgScheduleDate = $('.form_datetime').datetimepicker("getDate");
            if(msgIsSchedule && msgScheduleDate < (new Date())) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_RESERVE_PUSH_TIME_MUST_BE_SOMETIME_IN_THE_FUTURE")}}");
                return false;
            }

            var msgType = $("#ddlType").val();
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_PUSH_AGAIN")}}".replace("%s", msgType), "", function () {
                hideConfirmDialog();

                var msgSourcer = $("#ddlPushTo").val();
                var msgTitle = $("#tbxTitle").text();
                var msgContent = $("#tbxContent").text();
                var msgReceiver = new Object();

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

                if(getByteLength(msgTitle) > 99) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_OUT_OF_LENGTH")}}".replace("%s", "{{trans("messages.MESSAGE_TITLE")}}").replace("%l", "99"));
                    return false;
                }

                var mydata =
                {
                    message_id: {{$messageInfo->row_id}},
                    receiver: msgReceiver,
                    is_schedule: msgIsSchedule,
                    schedule_datetime: msgScheduleDate.getTime()
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "push/pushMessageImmediatelyAgain",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            //TODO redirect to parent page and show message
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_PUSH_SUCCESS")}}");
                            //window.location.href = "push?with_msg_id=MSG_PUSH_SUCCESS";
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

        var ChangeIsSchedule = function () {
            if($("#cbxSchedule").is(":checked")) {
                $("#rowScheduleDatetime").fadeIn();
                $('.form_datetime').datetimepicker("setDate", new Date());
            } else {
                $("#rowScheduleDatetime").fadeOut();
            }
        };
    </script>
@endsection


