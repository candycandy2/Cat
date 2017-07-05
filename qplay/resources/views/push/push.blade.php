@include("layouts.lang")
<?php
$menu_name = "PUSH_SERVER";

?>
@extends('layouts.admin_template')
@section('content')
    <div id="toolbar">
        <a class="btn btn-primary" href="newMessage" id="btnNewMessage">
            {{trans("messages.NEW_MESSAGE")}}
        </a>
    </div>

    <table id="gridMessageList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
           data-url="push/getMessageList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
            <th data-field="message_type" data-sortable="true" data-formatter="messageTypeFormatter">{{trans("messages.MESSAGE_TYPE")}}</th>
            <th data-field="message_title" data-sortable="true" data-formatter="messageTitleFormatter" data-search-formatter="false" data-width="600px" data-class="grid_long_column">{{trans("messages.MESSAGE_TITLE")}}</th>
            <th data-field="created_at" data-sortable="true" data-formatter="createdDateFormatter" >{{trans("messages.CREATED_DATE")}}</th>
            <th data-field="site_code" data-sortable="true">{{trans("messages.MESSAGE_SITE_CODE")}}</th>
            <th data-field="department" data-sortable="true">{{trans("messages.MESSAGE_DEPARTMENT")}}</th>
            <th data-field="created_user" data-sortable="true">{{trans("messages.MESSAGE_CREATED_USER")}}</th>
            <th data-field="visible" data-sortable="true">{{trans("messages.PUBLISH_STATUS")}}</th>
            <th data-field="need_push" data-sortable="true" data-formatter="needPushFormatter">{{trans("messages.PUSH_STATUS")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function createdDateFormatter(value, row){
            return convertUTCToLocalDateTime(value);
        };

        function messageTitleFormatter(value, row) {
            return '<a href="messagePushHistory?message_id=' + row.row_id + '">' + value + '</a>';
        };
        
        function messageTypeFormatter(value, row) {
            if(value == "news") {
                return 'News';
            }

            if(value == "event") {
                return "Event";
            }

            return value;
        };

        function needPushFormatter(value, row){
            if(value > 0){
                return 'Y';
            }else{
                return 'N';
            }
        };
    </script>
@endsection

