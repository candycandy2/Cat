@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SYS_GROUP_MAINTAIN";
$input = Input::get();
$action = $input["action"];
$groupId = "";
$groupInfo = null;
if($action == "U") {
    $groupId = $input["group_id"];
    $groupInfo = \App\lib\CommonUtil::getGroup($groupId);
}
$oriMenuList = \App\lib\CommonUtil::getAllMenuList();
$allMenuList = array();
foreach ($oriMenuList as $menu) {
    if($menu->pId == 0) {
        $menu->subMenuList = array();
        array_push($allMenuList, $menu);
        foreach ($oriMenuList as $submenu) {
            if($submenu->pId == $menu->Id) {
                array_push($menu->subMenuList, $submenu);
            }
        }
    }
}
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table style="width: 100%">
                <tr>
                    <td>{{trans("messages.GROUP_NAME")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxGroupName" class="form-control"
                               id="tbxGroupName" value="@if($action == "U"){{$groupInfo->group_name}}@endif"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveGroup()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="groupMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.SYSTEM_GROUP")}}:
            <br/><br/>

            @foreach($allMenuList as $menu)
                <table class="table table-bordered MenuTable" style="border:1px solid #d6caca;" id="MenuTable_{{$menu->Id}}" >
                    <tr>
                        <td rowspan="{{count($menu->subMenuList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                            <input type="checkbox" data="{{$menu->Id}}"
                                   @if($action == "U" && in_array($menu->Id, $groupInfo->menuList))
                                   checked
                                   @endif
                                   class="cbxMenu" onclick="MenuTableSelectedAll(this)" >{{$menu->sName}}</input>
                        </td>
                        <td style="border:1px solid #d6caca;">
                            @if(count($menu->subMenuList) > 0)
                                <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                <input type="checkbox" data="{{$menu->subMenuList[0]->Id}}"
                                       @if($action == "U" && in_array($menu->subMenuList[0]->Id, $groupInfo->menuList))
                                       checked
                                       @endif
                                       class="cbxSubMenu" >{{$menu->subMenuList[0]->sName}}</input>
                                </div>
                            @endif
                                @if(count($menu->subMenuList) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                        <input type="checkbox" data="{{$menu->subMenuList[1]->Id}}"
                                               @if($action == "U" && in_array($menu->subMenuList[1]->Id, $groupInfo->menuList))
                                               checked
                                               @endif
                                               class="cbxSubMenu" >{{$menu->subMenuList[1]->sName}}</input>
                                    </div>
                                @endif
                        </td>
                    </tr>
                    @if(count($menu->subMenuList) > 2)
                    @for($i = 2; $i < (count($menu->subMenuList) + 1) / 2; $i = $i + 2)
                        <tr>
                            <td style="border:1px solid #d6caca;">
                                @if(count($menu->subMenuList) > $i)
                                    <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                <input type="checkbox" data="{{$menu->subMenuList[$i]->Id}}"
                                       @if($action == "U" && in_array($menu->subMenuList[$i]->Id, $groupInfo->menuList))
                                       checked
                                       @endif
                                       class="cbxSubMenu">{{$menu->subMenuList[$i]->sName}}</input>
                                    </div>
                                @endif
                                    @if(count($menu->subMenuList) > $i + 1)
                                        <div class="col-lg-6 col-xs-6" style="text-align: center;">
                                        <input type="checkbox" data="{{$menu->subMenuList[$i + 1]->Id}}"
                                               @if($action == "U" && in_array($menu->subMenuList[$i + 1]->Id, $groupInfo->menuList))
                                               checked
                                               @endif
                                               class="cbxSubMenu">{{$menu->subMenuList[$i + 1]->sName}}</input>
                                        </div>
                                    @endif
                            </td>
                        </tr>
                    @endfor
                    @endif
                </table>
            @endforeach
        </div>
    </div>

    <script>
        var MenuTableSelectedAll = function (cbx) {
            var menuId = $(cbx).attr("data");
            if($(cbx).is(':checked')) {
                $("#MenuTable_" + menuId).find(".cbxSubMenu").prop("checked",true);
            } else {
                $("#MenuTable_" + menuId).find(".cbxSubMenu").prop("checked", false);
            }
        };

        var pageAction = '{{$action}}';
        var groupId = '{{$groupId}}';
        var SaveGroup = function() {
            var groupName = $("#tbxGroupName").val();
            if(groupName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var mydata =
            {
                action: pageAction,
                group_id: groupId,
                group_name:groupName,
                menu_list: new Array()
            };

            $(".cbxMenu").each(function() {
                if($(this).is(':checked')) {
                    mydata.menu_list.push($(this).attr("data"));
                }
            });
            $(".cbxSubMenu").each(function() {
                if($(this).is(':checked')) {
                    mydata.menu_list.push($(this).attr("data"));
                }
            });

            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "platform/saveGroup",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                    }  else {
                        if(pageAction == "N") {
                            pageAction = "U";
                            groupId = d.new_group_id;
                        }
                        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });
        };
    </script>
@endsection

