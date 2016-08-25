@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SYS_MENU_MAINTAIN";
$input = Input::get();
$menuId = $input["menu_id"];
$menuInfo = \App\lib\CommonUtil::getMenuInfo($menuId);

?>
@extends('layouts.admin_template')
@section('content')

    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table>
                <tr>
                    <td>{{trans("messages.MENU_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxMenuName"
                               id="tbxMenuName" value="{{$menuInfo->menu_name}}"/>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.LINK")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxLink"
                               id="tbxLink" value="{{$menuInfo->path}}"/>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.ENGLISH_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxEnglishName"
                               id="tbxEnglishName" value="{{$menuInfo->english_name}}"/>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.SIMPLE_CHINESE_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxSimpleChineseName"
                               id="tbxSimpleChineseName" value="{{$menuInfo->simple_chinese_name}}"/>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.TRADITIONAL_CHINESE_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxTraditionalChineseName"
                               id="tbxTraditionalChineseName" value="{{$menuInfo->traditional_chinese_name}}"/>
                    </td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveMenu()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="menuMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.SUB_MENU")}}
            <div id="toolbar">
                <button type="button" class="btn btn-danger" onclick="deleteSubMenu()" id="btnDeleteSubMenu">
                    {{trans("messages.DELETE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="newSubMenu()" id="btnNewSubMenu">
                    {{trans("messages.NEW")}}
                </button>
            </div>

            <table id="gridSubMenuList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                   data-url="platform/getSubMenuList?menu_id={{$menuId}}" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-visible="false">ID</th>
                    <th data-field="number_submenu" data-visible="false">Sub Count</th>
                    <th data-field="sequence" data-sortable="false">{{trans("messages.SEQUENCE")}}</th>
                    <th data-field="menu_name" data-sortable="false" data-formatter="menuNameFormatter">{{trans("messages.MENU_NAME")}}</th>
                    <th data-field="path" data-sortable="false">{{trans("messages.LINK")}}</th>
                    <th data-field="english_name" data-sortable="false" >{{trans("messages.ENGLISH_NAME")}}</th>
                    <th data-field="simple_chinese_name" data-sortable="false" >{{trans("messages.SIMPLE_CHINESE_NAME")}}</th>
                    <th data-field="traditional_chinese_name" data-sortable="false" >{{trans("messages.TRADITIONAL_CHINESE_NAME")}}</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>


    <script>
        function menuNameFormatter(value, row) {
            return '<a href="#" onclick="updateSubMenu(\'' + row.row_id + '\')">' + value + '</a>';
        };

        var deleteSubMenu = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_MENU")}}", "", function () {
                hideConfirmDialog();
                var selectedRootMenus = $("#gridSubMenuList").bootstrapTable('getSelections');
                var currentData = $("#gridSubMenuList").bootstrapTable('getData');
                $.each(selectedRootMenus, function(i, menu) {
                    for(var j = 0; j < currentData.length; j++) {
                        if(currentData[j].row_id == menu.row_id) {
                            currentData.splice(j,1);
                            break;
                        }
                    }
                });
                $("#gridSubMenuList").bootstrapTable('load', currentData);
                selectedChanged();
            });
        };

        var currentMaintainSubMenuId = null;
        var isNewSubMenu = false;

        var newSubMenu = function() {
            $("#subMenuMaintainDialogTitle").text("{{trans("messages.NEW_SUB_MENU")}}");
            $("#tbxSubMenuName").val("");
            $("#tbxSubLink").val("");
            $("#tbxSubEnglishName").val("");
            $("#tbxSubSimpleChineseName").val("");
            $("#tbxSubTraditionalChineseName").val("");

            currentMaintainSubMenuId = null;
            isNewSubMenu = true;

            $("#subMenuMaintainDialog").modal('show');
        };

        var updateSubMenu = function(menuId) {
            var allSubMenuList = $("#gridSubMenuList").bootstrapTable('getData');
            $.each(allSubMenuList, function(i, menu) {
                if(menu.row_id == menuId) {
                    $("#tbxSubMenuName").val(menu.menu_name);
                    $("#tbxSubLink").val(menu.path);
                    $("#tbxSubEnglishName").val(menu.english_name);
                    $("#tbxSubSimpleChineseName").val(menu.simple_chinese_name);
                    $("#tbxSubTraditionalChineseName").val(menu.traditional_chinese_name);
                    return false;
                }
            });

            currentMaintainSubMenuId = menuId;
            isNewSubMenu = false;

            $("#subMenuMaintainDialogTitle").text("{{trans("messages.EDIT_SUB_MENU")}}");
            $("#subMenuMaintainDialog").modal('show');
        };

        var ConfirmSubMenuMaintain = function () {
            var menuName = $("#tbxSubMenuName").val();
            var link = $("#tbxSubLink").val();
            var englishName = $("#tbxSubEnglishName").val();
            var simpleChineseName = $("#tbxSubSimpleChineseName").val();
            var traditionChineseName = $("#tbxSubTraditionalChineseName").val();

            if(menuName == "" || englishName == "" || simpleChineseName == "" || traditionChineseName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }


            if(isNewSubMenu) {
                var currentData = $("#gridSubMenuList").bootstrapTable('getData');
                var menu = new Object();
                menu.row_id = "temp_id_" + currentData.length + 1;
                menu.parent_id = {{$menuId}};
                menu.menu_name = $("#tbxSubMenuName").val();
                menu.path = $("#tbxSubLink").val();
                menu.english_name = $("#tbxSubEnglishName").val();
                menu.simple_chinese_name = $("#tbxSubSimpleChineseName").val();
                menu.traditional_chinese_name = $("#tbxSubTraditionalChineseName").val();
                currentData.push(menu);
                $("#gridSubMenuList").bootstrapTable('load', currentData);
                $("#subMenuMaintainDialog").modal('hide');
            } else {
                var currentData = $("#gridSubMenuList").bootstrapTable('getData');
                $.each(currentData, function(i, menu) {
                    if(menu.row_id == currentMaintainSubMenuId) {
                        menu.menu_name = $("#tbxSubMenuName").val();
                        menu.path = $("#tbxSubLink").val();
                        menu.english_name = $("#tbxSubEnglishName").val();
                        menu.simple_chinese_name = $("#tbxSubSimpleChineseName").val();
                        menu.traditional_chinese_name = $("#tbxSubTraditionalChineseName").val();
                        return false;
                    }
                });
                $("#gridSubMenuList").bootstrapTable('load', currentData);
                $("#subMenuMaintainDialog").modal('hide');
            }
        };

        $(function () {
            $("#btnDeleteSubMenu").hide();
            $('#gridSubMenuList').on('check.bs.table', selectedChanged);
            $('#gridSubMenuList').on('uncheck.bs.table', selectedChanged);
            $('#gridSubMenuList').on('check-all.bs.table', selectedChanged);
            $('#gridSubMenuList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridSubMenuList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedSubMenu = $("#gridSubMenuList").bootstrapTable('getSelections');
            if(selectedSubMenu.length > 0) {
                $("#btnDeleteSubMenu").show();
                $("#btnNewSubMenu").hide();
            } else {
                $("#btnDeleteSubMenu").hide();
                $("#btnNewSubMenu").show();
            }
        };

    </script>
@endsection

@section('dialog_content')
    <div id="subMenuMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="subMenuMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table>
                        <tr>
                            <td>{{trans("messages.MENU_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubMenuName"
                                       id="tbxSubMenuName" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.LINK")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubLink"
                                       id="tbxSubLink" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.ENGLISH_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubEnglishName"
                                       id="tbxSubEnglishName" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.SIMPLE_CHINESE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubSimpleChineseName"
                                       id="tbxSubSimpleChineseName" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.TRADITIONAL_CHINESE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubTraditionalChineseName"
                                       id="tbxSubTraditionalChineseName" value=""/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="ConfirmSubMenuMaintain()">{{trans("messages.CONFIRM")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection

