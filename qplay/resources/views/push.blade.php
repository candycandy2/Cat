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
           data-url="platform/getMessageList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
            <th data-field="message_type" data-sortable="true">{{trans("messages.MESSAGE_TYPE")}}</th>
            <th data-field="message_title" data-sortable="true" data-formatter="messageTitleFormatter">{{trans("messages.MESSAGE_TITLE")}}</th>
            <th data-field="created_at" data-sortable="true">{{trans("messages.CREATED_DATE")}}</th>
            <th data-field="created_user" data-sortable="true">{{trans("messages.MESSAGE_CREATED_USER")}}</th>
            <th data-field="visible" data-sortable="true">{{trans("messages.STATUS")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function messageTitleFormatter(value, row) {
            return '<a href="messagePushHistory?message_id=' + row.row_id + '">' + value + '</a>';
        };



    </script>
@endsection

