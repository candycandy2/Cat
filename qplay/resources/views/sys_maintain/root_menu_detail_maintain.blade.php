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
            <table style="width: 100%">
                <tr>
                    <td>{{trans("messages.MENU_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxMenuName" class="form-control"
                               id="tbxMenuName" value="{{$menuInfo->menu_name}}"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.LINK")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxLink" class="form-control"
                               id="tbxLink" value="{{$menuInfo->path}}"/>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.ENGLISH_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxEnglishName" class="form-control"
                               id="tbxEnglishName" value="{{$menuInfo->english_name}}"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.SIMPLE_CHINESE_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxSimpleChineseName" class="form-control"
                               id="tbxSimpleChineseName" value="{{$menuInfo->simple_chinese_name}}"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.TRADITIONAL_CHINESE_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxTraditionalChineseName" class="form-control"
                               id="tbxTraditionalChineseName" value="{{$menuInfo->traditional_chinese_name}}"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.STATUS")}}:</td>
                    <td style="padding: 10px;">
                        <div class="switch" data-on="success" data-on-label="Y" data-off-label="N">
                            <input type="checkbox" id="cbxVisible"
                            @if($menuInfo->visible == "Y")
                                checked
                            @endif
                            />
                        </div>
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
                <button type="button" class="btn btn-danger" onclick="deleteSubMenu()" id="btnDeleteSubMenu" style="display: none;">
                    {{trans("messages.DELETE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="newSubMenu()" id="btnNewSubMenu">
                    {{trans("messages.NEW")}}
                </button>
            </div>

            <table id="gridSubMenuList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                   data-url="platform/getSubMenuList?menu_id={{$menuId}}" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="false"
                   data-show-toggle="true"  data-sortable="false"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-visible="false">ID</th>
                    <th data-field="number_submenu" data-visible="false">Sub Count</th>
                    <th data-field="sequence" data-sortable="false">{{trans("messages.SEQUENCE")}}</th>
                    <th data-field="menu_name" data-sortable="false" data-formatter="menuNameFormatter" data-search-formatter="false">{{trans("messages.MENU_NAME")}}</th>
                    <th data-field="path" data-sortable="false">{{trans("messages.LINK")}}</th>
                    <th data-field="english_name" data-sortable="false" >{{trans("messages.ENGLISH_NAME")}}</th>
                    <th data-field="simple_chinese_name" data-sortable="false" >{{trans("messages.SIMPLE_CHINESE_NAME")}}</th>
                    <th data-field="traditional_chinese_name" data-sortable="false" >{{trans("messages.TRADITIONAL_CHINESE_NAME")}}</th>
                    <th data-field="visible" data-sortable="false">{{trans("messages.STATUS")}}</th>
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
            $("#cbxSubVisible").prop("checked", false);
            $('#switchSubVisible').bootstrapSwitch('setState', true);

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
                    if(menu.visible == "Y") {
                        $("#cbxSubVisible").prop("checked", true);
                        $('#switchSubVisible').bootstrapSwitch('setState', true);
                    } else {
                        $("#cbxSubVisible").prop("checked", false);
                        $('#switchSubVisible').bootstrapSwitch('setState', false);
                    }

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
            var visible = "Y";
            if(!$("#cbxSubVisible").is(":checked")) {
                visible = "N";
            }

            if(menuName == "" || englishName == "" || simpleChineseName == "" || traditionChineseName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            if(isNewSubMenu) {
                var currentData = $("#gridSubMenuList").bootstrapTable('getData');
                var menu = new Object();
                menu.row_id = "temp_id_" + Math.round(new Date().getTime() / 1000);
                menu.parent_id = {{$menuId}};
                menu.menu_name = $("#tbxSubMenuName").val();
                menu.path = $("#tbxSubLink").val();
                menu.english_name = $("#tbxSubEnglishName").val();
                menu.simple_chinese_name = $("#tbxSubSimpleChineseName").val();
                menu.traditional_chinese_name = $("#tbxSubTraditionalChineseName").val();
                menu.visible = visible;
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
                        menu.visible = visible;
                        return false;
                    }
                });
                $("#gridSubMenuList").bootstrapTable('load', currentData);
                $("#subMenuMaintainDialog").modal('hide');
            }
        };

        $(function () {
            $('#gridSubMenuList').on('check.bs.table', selectedChanged);
            $('#gridSubMenuList').on('uncheck.bs.table', selectedChanged);
            $('#gridSubMenuList').on('check-all.bs.table', selectedChanged);
            $('#gridSubMenuList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridSubMenuList').on('load-success.bs.table', selectedChanged);
        });

        var selectedChanged = function (row, $element) {
            var selectedSubMenu = $("#gridSubMenuList").bootstrapTable('getSelections');

            if(selectedSubMenu.length > 0) {
                $("#btnNewSubMenu").fadeOut(300, function() {
                    $("#btnDeleteSubMenu").fadeIn(300);
                });
            } else {
                $("#btnDeleteSubMenu").fadeOut(300, function() {
                    $("#btnNewSubMenu").fadeIn(300);
                });
            }
        };

        var SaveMenu = function() {
            var menuName = $("#tbxMenuName").val();
            var link = $("#tbxLink").val();
            var englishName = $("#tbxEnglishName").val();
            var simpleChineseName = $("#tbxSimpleChineseName").val();
            var traditionChineseName = $("#tbxTraditionalChineseName").val();
            var visible = "Y";
            if(!$("#cbxVisible").is(":checked")) {
                visible = "N";
            }
            if(menuName == "" || englishName == "" || simpleChineseName == "" || traditionChineseName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }


            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var allSubMenus = $("#gridSubMenuList").bootstrapTable('getData');

                var mydata = {
                    menu_id:{{$menuId}},
                    sub_menu_list: allSubMenus,
                    menu_name: menuName,
                    link: link,
                    english_name: englishName,
                    simple_chinese_name: simpleChineseName,
                    tradition_chinese_name: traditionChineseName,
                    visible: visible
                };
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/saveRootMenu",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}" + "<br/>" + d.message);
                        }  else {
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        }

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
                    <table width="100%">
                        <tr>
                            <td>{{trans("messages.MENU_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubMenuName"
                                       id="tbxSubMenuName" value="" class="form-control"/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.LINK")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubLink"
                                       id="tbxSubLink" value="" class="form-control"/>
                            </td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.ENGLISH_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubEnglishName"
                                       id="tbxSubEnglishName" value="" class="form-control"/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.SIMPLE_CHINESE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubSimpleChineseName"
                                       id="tbxSubSimpleChineseName" value="" class="form-control"/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.TRADITIONAL_CHINESE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxSubTraditionalChineseName"
                                       id="tbxSubTraditionalChineseName" value="" class="form-control"/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.STATUS")}}:</td>
                            <td style="padding: 10px;">
                                <div id="switchSubVisible" class="switch" data-on="success" data-on-label="Y" data-off-label="N">
                                    <input type="checkbox" id="cbxSubVisible" checked />
                                </div>
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

