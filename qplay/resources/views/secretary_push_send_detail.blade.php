@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SECRETARY_PUSH";
$input = Input::get();
$push_send_row_id = $input["push_send_row_id"];
$messageId = $input["message_id"];
$tempFlag = 0;
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();
for($i = 0; $i < count($allCompanyRoleList); $i++) {
    $allCompanyRoleList[$i]->company = strtolower($allCompanyRoleList[$i]->company);
}
$sendInfo = \App\lib\CommonUtil::getSecretaryMessageSendInfo($push_send_row_id);
for($i = 0; $i < count($sendInfo->company_list); $i++) {
    $sendInfo->company_list[$i] = strtolower($sendInfo->company_list[$i]);
}
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
                        <option value="1" @if($messageInfo->template_id == 1) selected="selected" @endif>1</option>
                        <option value="2" @if($messageInfo->template_id == 2) selected="selected" @endif>2</option>
                        <option value="3" @if($messageInfo->template_id == 3) selected="selected" @endif>3</option>
                        <option value="4" @if($messageInfo->template_id == 4) selected="selected" @endif>4</option>
                        <option value="5" @if($messageInfo->template_id == 5) selected="selected" @endif>5</option>
                        <option value="6" @if($messageInfo->template_id == 6) selected="selected" @endif>6</option>
                        <option value="7" @if($messageInfo->template_id == 7) selected="selected" @endif>7</option>
                        <option value="8" @if($messageInfo->template_id == 8) selected="selected" @endif>8</option>
                    </select>
                </div>
            </div>
            <div class="form-group row">
              <label for="ddlType" class="col-xs-2">{{trans("messages.PUSH_TYPE")}}:</label>
              <div class="col-xs-10">
                  <select class="select2-close-mask form-control" name="ddlType" id="ddlType" disabled="disabled" >
                      <option value="company"
                              @if($sendInfo->send_type=='company')
                              selected="selected"
                              @endif
                      >{{trans("messages.USER_COMPANY")}}</option>
                      <option value="designated"
                              @if($sendInfo->send_type=='designated')
                              selected="selected"
                              @endif
                      >{{trans("messages.DESIGNATED")}}</option>
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
                <a type="button" class="btn btn-default" href="secretaryPushHistory?message_id={{$messageId}}">
                    {{trans("messages.CANCEL")}}
                </a>
            </div>
        </div>
    </div>

    @if($sendInfo->send_type=='company')
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
    @else
        <div class="row" id="regionTypeEvent">
            <div class="col-lg-12 col-xs-12">
                <hr class="primary" style="border-top: 1px solid #bbb1b1;">
                {{trans("messages.MESSAGE_RECEIVER")}}:
                <br/><br/>

                <table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                       data-url="platform/getSecretaryMessageDesignatedReceiver?message_send_row_id={{$push_send_row_id}}" data-height="398" data-pagination="true"
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
    @endif
    <script>
        $(function() {
            CheckRoleTableSelect();
            var sendDate = $('#js-sendDate').text();
            $('#js-sendDate').text(convertUTCToLocalDateTime(sendDate));
        });

        var msgVisible = '{{$messageInfo->visible}}';

        var SendAgain = function () {
            if(msgVisible.toUpperCase() != 'Y') {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_MESSAGE_INVISIBLE")}}");
                return false;
            }

            var msgType = $("#ddlType").val();
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_PUSH_AGAIN")}}".replace("%s", msgType), "", function () {
                hideConfirmDialog();

                var mydata =
                {
                    message_send_id: {{$push_send_row_id}},
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/pushSecretaryMessageAgain",
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
    </script>
@endsection


