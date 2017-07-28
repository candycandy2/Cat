@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "PUSH_SERVER";
$input = Input::get();
$templateCount = 17;
$messageInfo = null;
$messageId = $input["message_id"];
$messageInfo = \App\lib\CommonUtil::getMessageInfo($messageId);
$needPushFlag = 'N';
if(count($messageInfo->send_list) == 0) {
    $needPushFlag = 'Y';
}

$msgTitle = str_replace(array("\r","\n"), ' ', $messageInfo->message_title);
$msgTitle = str_replace(array("\r","\n"), ' ', $msgTitle);

$pushSendRowId = -1;
foreach ($messageInfo->send_list as $sendItem) {
    if($sendItem->need_push == 0) {
        $needPushFlag = 'Y';
        $pushSendRowId = $sendItem->row_id;
    }
}
?>
@extends('layouts.admin_template')
@section('content')
<style>
label {
    font-weight: normal !important;
}       
</style>
    <div class="row">
        <div class="col-lg-4 col-xs-4"></div>
        <div class="col-lg-8 col-xs-8">
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
                            <a type="button" class="btn btn-primary" href="newMessage?copy_from={{$messageId}}">
                                {{trans("messages.COPY_MESSAGE")}}
                            </a>
                        </td>
                        <td style="padding: 5px;">
                            <a type="button" class="btn btn-default" href="push">
                                {{trans("messages.RETURN")}}
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
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
                        @for ($i = 0; $i <=$templateCount; $i++)
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
                    <option value="event"
                            @if($messageInfo->message_type=='news')
                            selected="news"
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
            <div class="form-group row">
              <label for="tbxMessageContent" class="col-xs-2">{{trans("messages.MESSAGE_CONTENT")}}:</label>
              <div class="col-xs-10" style="word-wrap:break-word;"><pre>{{$messageInfo->message_text}}</pre>
{{--                {{str_replace("\n", "<br/>",$messageInfo->message_text)}}--}}

              </div>
            </div>
        </div>
        <div class="col-lg-4 col-xs-4"></div>
    </div>
    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.MESSAGE_SEND_HISTORY")}}:
            <br/><br/>

            <table id="gridSendList" class="bootstrapTable" data-toggle="table"
                   data-url="push/getMessageSendList?message_id={{$messageId}}" data-height="298" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
                    <th data-field="created_at" data-sortable="true" data-formatter="pushDateFormatter" data-search-formatter="false">{{trans("messages.PUSH_DATE")}}</th>
                    <th data-field="source_user" data-sortable="true">{{trans("messages.PUSH_SOURCE_USER")}}</th>
                </tr>
                </thead>
            </table>

        </div>
    </div>

    <script>
        $(function() {
            $('#switchVisible').on('switch-change', SaveMessageVisible);
            @if($needPushFlag == 'Y')
                window.location.href = "updateMessage?message_id={{$messageId}}&push_send_row_id={{$pushSendRowId}}";
            @endif
        });

        var pushDateFormatter = function (value, row) {
            return '<a href="pushSendDetail?message_id=' + {{$messageId}} + '&push_send_row_id=' + row.row_id + '">' + convertUTCToLocalDateTime(value) + '</a>';
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
                    //$("#cbxVisible").prop("checked", true);
                } else {
                    //$("#cbxVisible").prop("checked", false);
                    $('#switchVisible').bootstrapSwitch('setState', false);
                }
                $('#switchVisible').on('switch-change', SaveMessageVisible);
//                $('.switch').bootstrapSwitch();
            });
        };
    </script>
@endsection

