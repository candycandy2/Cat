@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "PUSH_SERVER";
$input = Input::get();
$messageInfo = null;
$messageId = $input["message_id"];
$messageInfo = \App\lib\CommonUtil::getMessageInfo($messageId);
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
                </tr>
                <tr>
                    <td>{{trans("messages.PUSH_TYPE")}}:</td>
                    <td style="padding: 10px;">
                        <select class="select2-close-mask form-control" name="ddlType" id="ddlType" disabled="disabled">
                            <option value="event"
                                    @if($messageInfo->message_type=='event')
                                    selected="selected"
                                    @endif>event</option>
                            <option value="event"
                                    @if($messageInfo->message_type=='news')
                                    selected="news"
                                    @endif>news</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_TITLE")}}:</td>
                    <td style="padding: 10px;">
                        {{$messageInfo->message_title}}
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.MESSAGE_CONTENT")}}:</td>
                    <td style="padding: 10px;">
                        {{$messageInfo->message_text}}
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.STATUS")}}:</td>
                    <td style="padding: 10px;">
                        <div class="switch" data-on="success" data-on-label="Y" data-off-label="N">
                            <input type="checkbox" id="cbxVisible"
                                   @if($messageInfo->visible == 'Y')
                                   checked
                                    @endif
                            />
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="col-lg-4 col-xs-4" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveMessageVisible()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-primary" href="newMessage?copy_from={{$messageId}}">
                    {{trans("messages.COPY_MESSAGE")}}
                </a>
                <a type="button" class="btn btn-default" href="push">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_SEND_HISTORY")}}:
            <br/><br/>

            <table id="gridSendList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id"
                   data-url="platform/getMessageSendList?message_id={{$messageId}}" data-height="298" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                    <th data-field="created_at" data-sortable="true" data-formatter="pushDateFormatter">{{trans("messages.PUSH_DATE")}}</th>
                    <th data-field="source_user" data-sortable="true">{{trans("messages.PUSH_SOURCE_USER")}}</th>
                </tr>
                </thead>
            </table>

        </div>
    </div>

    <script>
        var pushDateFormatter = function (value, row) {
            return '<a href="pushSendDetail?push_send_row_id=' + row.row_id + '">' + value + '</a>';
        };

        var SaveMessageVisible = function () {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var visible = "N";
                if($('#cbxVisible').is(':checked')) {
                    visible = "Y";
                }

                var mydata =
                {
                    message_id: {{$messageId}},
                    visible: visible
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/saveMessageVisible",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            $("#gridUserList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
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

