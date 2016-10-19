@include("layouts.lang")
<?php
$menu_name = "SYS_GROUP_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')

    <div id="toolbar">
        <button type="button" class="btn btn-danger" onclick="deleteGroup()" id="btnDeleteGroup" style="display: none;">
            {{trans("messages.DELETE")}}
        </button>
        <a class="btn btn-primary" href="groupDetailMaintain?action=N" id="btnNewGroup">
            {{trans("messages.NEW")}}
        </a>
    </div>
    <table id="gridGroupList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
           data-url="platform/getGroupList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-searchable="false" data-checkbox="true"></th>
            <th data-field="row_id" data-searchable="false" data-sortable="false" data-visible="false">ID</th>
            <th data-field="group_name" data-searchable="true" data-search-formatter="false" data-sortable="true" data-formatter="groupNameFormatter" data-width="600px" data-class="grid_long_column">{{trans("messages.GROUP_NAME")}}</th>
            <th data-field="user_count" data-searchable="false"  data-sortable="true" data-formatter="userCountFormatter">{{trans("messages.USERS")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function groupNameFormatter(value, row) {
            return '<a href="groupDetailMaintain?action=U&group_id=' + row.row_id + '">' + value + '</a>';
        };

        function userCountFormatter(value, row) {
            return '<a href="groupUsersMaintain?group_id=' + row.row_id + '">' + value + '</a>';
        };

        var deleteGroup = function() {
            var confirmStr = "";
            var selectedGroups = $("#gridGroupList").bootstrapTable('getSelections');
            var checkHasUser = true;
            var checkHasAdmin = true;
            $.each(selectedGroups, function (i, group) {
                if(group.group_name.toUpperCase() == "ADMINISTRATOR") {
                    checkHasAdmin = false;
                    return false;
                }
                confirmStr += group.group_name + "<br/>";
                if(group.user_count > 0) {
                    checkHasUser = false;
                    return false;
                }
            });
            if(!checkHasAdmin) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_ADMIN_GROUP_CAN_NOT_DELETE")}}");
                return false;
            }

            if(!checkHasUser) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_GROUP_EXIST_USERS")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_GROUP")}}", confirmStr, function () {
                hideConfirmDialog();

                var groupIdList = new Array();
                $.each(selectedGroups, function(i, group) {
                    groupIdList.push(group.row_id);
                });
                var mydata = {group_id_list:groupIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/deleteGroup",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            $("#gridGroupList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        $(function() {
            $('#gridGroupList').on('check.bs.table', selectedChanged);
            $('#gridGroupList').on('uncheck.bs.table', selectedChanged);
            $('#gridGroupList').on('check-all.bs.table', selectedChanged);
            $('#gridGroupList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridGroupList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedGroups = $("#gridGroupList").bootstrapTable('getSelections');

            if(selectedGroups.length > 0) {
                $("#btnNewGroup").fadeOut(300, function() {
                    $("#btnDeleteGroup").fadeIn(300);
                });
            } else {
                $("#btnDeleteGroup").fadeOut(300, function() {
                    $("#btnNewGroup").fadeIn(300);
                });
            }
        }

    </script>

@endsection

