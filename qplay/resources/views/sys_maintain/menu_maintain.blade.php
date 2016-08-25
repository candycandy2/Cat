@include("layouts.lang")
<?php
$menu_name = "SYS_MENU_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')

    <div id="toolbar">
        <button type="button" class="btn btn-danger" onclick="deleteRootMenu()" id="btnDeleteRootMenu">
            {{trans("messages.DELETE")}}
        </button>
        <button type="button" class="btn btn-primary" onclick="newRootMenu()" id="btnNewRootMenu">
            {{trans("messages.NEW")}}
        </button>
    </div>
    <table id="gridRootMenuList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="platform/getRootMenuList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-visible="false">ID</th>
            <th data-field="number_submenu" data-visible="false">Sub Count</th>
            <th data-field="sequence" data-sortable="true">{{trans("messages.SEQUENCE")}}</th>
            <th data-field="menu_name" data-sortable="true" data-formatter="menuNameFormatter">{{trans("messages.MENU_NAME")}}</th>
            <th data-field="path" data-sortable="true">{{trans("messages.LINK")}}</th>
            <th data-field="english_name" data-sortable="true" >{{trans("messages.ENGLISH_NAME")}}</th>
            <th data-field="simple_chinese_name" data-sortable="true" >{{trans("messages.SIMPLE_CHINESE_NAME")}}</th>
            <th data-field="traditional_chinese_name" data-sortable="true" >{{trans("messages.TRADITIONAL_CHINESE_NAME")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function menuNameFormatter(value, row) {
            return '<a href="rootMenuDetailMaintain?menu_id=' + row.row_id + '">' + value + '</a>';
        };

        var deleteRootMenu = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_MENU")}}", "", function () {
                hideConfirmDialog();
                var selectedRootMenus = $("#gridRootMenuList").bootstrapTable('getSelections');
                var check = true;
                $.each(selectedRootMenus, function (i, menu) {
                    if(menu.number_submenu > 0) {
                        check = false;
                        return false;
                    }
                });
                if(!check) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_EXIST_SUBMENU")}}");
                    return false;
                }

                var menuIdList = new Array();
                $.each(selectedRootMenus, function(i, menu) {
                    menuIdList.push(menu.row_id);
                });
                var mydata = {menu_id_list:menuIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/deleteMenu",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_MENU_FAILED")}}");
                        }  else {
                            $("#gridRootMenuList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_MENU_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        var currentMaintainRoleId = null;
        var isNewRole = false;
        var newRootMenu = function() {
            $("#tbxMenuName").val("");
            $("#tbxLink").val("");
            $("#tbxEnglishName").val("");
            $("#tbxSimpleChineseName").val("");
            $("#tbxTraditionalChineseName").val("");
            $("#newRootMenuDialog").modal('show');
            currentMaintainRoleId = null;
            isNewRole = true;
        };

        var SaveNewRootMenu = function() {
            var menuName = $("#tbxMenuName").val();
            var link = $("#tbxLink").val();
            var englishName = $("#tbxEnglishName").val();
            var simpleChineseName = $("#tbxSimpleChineseName").val();
            var traditionChineseName = $("#tbxTraditionalChineseName").val();
            if(menuName == "" || englishName == "" || simpleChineseName == "" || traditionChineseName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var mydata = {
                    parentId: 0,
                    menuName: menuName,
                    link: link,
                    englishName: englishName,
                    simpleChineseName: simpleChineseName,
                    traditionChineseName: traditionChineseName
                };

                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/newMenu",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            $("#gridRootMenuList").bootstrapTable('refresh');
                            $("#newRootMenuDialog").modal('hide');
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
            $("#btnDeleteRootMenu").hide();
            $('#gridRootMenuList').on('check.bs.table', selectedChanged);
            $('#gridRootMenuList').on('uncheck.bs.table', selectedChanged);
            $('#gridRootMenuList').on('check-all.bs.table', selectedChanged);
            $('#gridRootMenuList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridRootMenuList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedMenu = $("#gridRootMenuList").bootstrapTable('getSelections');
            if(selectedMenu.length > 0) {
                $("#btnDeleteRootMenu").show();
                $("#btnNewRootMenu").hide();
            } else {
                $("#btnDeleteRootMenu").hide();
                $("#btnNewRootMenu").show();
            }
        }

    </script>

@endsection

@section('dialog_content')
    <div id="newRootMenuDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newRootMenuDialogTitle">{{trans("messages.NEW_ROOT_MENU")}}</h1>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>{{trans("messages.MENU_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxMenuName"
                                       id="tbxMenuName" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.LINK")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxLink"
                                       id="tbxLink" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.ENGLISH_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxEnglishName"
                                       id="tbxEnglishName" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.SIMPLE_CHINESE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSimpleChineseName"
                                       id="tbxSimpleChineseName" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.TRADITIONAL_CHINESE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxTraditionalChineseName"
                                       id="tbxTraditionalChineseName" value=""/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SaveNewRootMenu()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection

