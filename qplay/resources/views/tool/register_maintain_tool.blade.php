@include("layouts.lang")
<?php
$menu_name = "REGISTER_MAINTAIN_TOOL";
?>
@extends('layouts.admin_template')
@section('content')
<div id="toolbar">
    <div class="form-group">
        <button type="button" class="btn btn-danger" onclick="removeDeviceRegistedData()" id="btnDeleteWhite">
            {{trans("messages.DELETE")}}
        </button>
    </div>
</div>
<form id="clearDeviceForm">
    <table id="gridDeviceList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
           data-url="tool/getRegisterList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="login_id" data-sortable="true" data-visible="true">Ori User</th>
            <th data-field="device_type" data-sortable="true" data-visible="true">Device Type</th>
            <th data-field="uuid" data-sortable="true" data-visible="true">Device uuid</th>
            <th data-field="emp_name" data-sortable="true" data-visible="true">Emp Name</th>
            <th data-field="register_date" data-sortable="true" data-visible="true">Register Date</th>
        </tr>
        </thead>
    </table>
</form>

<script>
    $(function() {
        $("#toolbar").hide();
        $('#gridDeviceList').on('check.bs.table', selectedChanged);
        $('#gridDeviceList').on('uncheck.bs.table', selectedChanged);
        $('#gridDeviceList').on('check-all.bs.table', selectedChanged);
        $('#gridDeviceList').on('uncheck-all.bs.table', selectedChanged);
        $('#gridDeviceList').on('page-change.bs.table', selectedChanged);
    });

    var selectedChanged = function (row, $element) {
        var selectedUsers = $("#gridDeviceList").bootstrapTable('getSelections');
        if(selectedUsers.length > 0) {
            $("#toolbar").fadeIn(300);
        } else {
            $("#toolbar").fadeOut(300);
        }
    }

    var removeDeviceRegistedData = function() {
            var selectedUsers = $("#gridDeviceList").bootstrapTable('getSelections');
            var confirmHtml = "";
            $.each(selectedUsers, function(i, device) {
                confirmHtml += device.login_id + " : " + device.uuid + "<br/>";
            });
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "移除此註冊裝置註冊紀錄", confirmHtml, function () {
                hideConfirmDialog();
                var uuidList = new Array();
                $.each(selectedUsers, function(i, device) {
                    uuidList.push(device.uuid);
                });
                var mydata = {uuid_list:uuidList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "tool/removeDeviceRegistedData",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","移除註冊資料失敗");
                        }  else {
                            $("#gridDeviceList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "移除註冊資料失敗", e.responseText);
                    }
                }).done(function() {
                    $('#toolbar').hide();
                });
            });
        };
</script>
@endsection