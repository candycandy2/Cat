@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "USER_ACCOUNT_MAINTAIN";
$input = Input::get();
$userLoginId = $input["login_id"];
$userInfo = \App\lib\CommonUtil::getUserEnableInfoByUserID($userLoginId);
$allCompanyRoleList = \App\lib\CommonUtil::getAllCompanyRoleList();
$allGroupList = \App\lib\CommonUtil::getAllGroupList();
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
            <table>
                <tr>
                    <td>{{trans("messages.USER_LOGIN_ID")}}:</td>
                    <td class="text-bold" style="padding: 10px;">{{$userLoginId}}</td>
                </tr>
                <tr>
                    <td>{{trans("messages.USER_COMPANY")}}:</td>
                    <td class="text-bold" style="padding: 10px;">{{$userInfo->company}}</td>
                </tr>
                <tr>
                    <td>{{trans("messages.USER_DEPARTMENT")}}:</td>
                    <td class="text-bold" style="padding: 10px;">{{$userInfo->department}}</td>
                </tr>
                <tr>
                    <td>{{trans("messages.USER_STATUS")}}:</td>
                    <td style="padding: 10px;">
                        <div class="switch" data-on="success" data-on-label="Y" data-off-label="N">
                            <input type="checkbox" id="cbxUserStatus"
                                    @if($userInfo->status == 'Y')
                                        checked
                                    @endif
                            />
                        </div>
                        <h6 class="inline">&nbsp;N:{{trans("messages.REMOVE_RIGHT")}}</h6>
                    </td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveUser()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="accountMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.ROLE")}}:<br /><br />
            @foreach($allCompanyRoleList as $companyRoles)
                @if(count($companyRoles->roles > 0))
                    <table class="table table-bordered" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca;">
                        <tr>
                            <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                                <input type="checkbox" data="{{$companyRoles->company}}" onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                            </td>
                            <td style="border:1px solid #d6caca;">
                                <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" class="cbxRole"
                                    @if(in_array($companyRoles->roles[0]->row_id, $userInfo->roleList))
                                        checked
                                    @endif
                                >{{$companyRoles->roles[0]->role_description}}</input>
                            </td>
                        </tr>
                        @for($i = 1; $i < count($companyRoles->roles); $i++)
                            <tr>
                                <td style="border:1px solid #d6caca;">
                                    <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" class="cbxRole"
                                           @if(in_array($companyRoles->roles[$i]->row_id, $userInfo->roleList))
                                                checked
                                           @endif
                                    >{{$companyRoles->roles[$i]->role_description}}</input>
                                </td>
                            </tr>
                        @endfor
                    </table>
                @endif
            @endforeach
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 col-xs-12">
            <hr class="primary" style="border-top: 1px solid #bbb1b1;">
            {{trans("messages.SYSTEM_GROUP")}}:
            &nbsp;
            <select class="select2-close-mask" name="ddlGroup" id="ddlGroup" onchange="ChangeGroup();">
                @foreach($allGroupList as $group)
                    <option value="{{$group->row_id}}">{{$group->group_name}}</option>
                @endforeach
            </select>
            &nbsp;<input type="checkbox" id="cbxBelongToGroup" checked="checked" onclick="ChangeBelongToGroup(this)">{{trans("messages.MSG_BELONG_TO_GROUP_RIGHT")}}</input>
            <br /><br />
            @foreach($allMenuList as $menu)
                <table class="table table-bordered MenuTable" style="border:1px solid #d6caca;" id="MenuTable_{{$menu->Id}}" >
                    <tr>
                        <td rowspan="{{count($menu->subMenuList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                            <input type="checkbox" data="{{$menu->Id}}" class="cbxMenu" onclick="MenuTableSelectedAll(this)" >{{$menu->sName}}</input>
                        </td>
                        <td style="border:1px solid #d6caca;">
                            @if(count($menu->subMenuList) > 0)
                                <input type="checkbox" data="{{$menu->subMenuList[0]->Id}}" class="cbxSubMenu" >{{$menu->subMenuList[0]->sName}}</input>
                            @endif
                        </td>
                    </tr>
                    @for($i = 1; $i < count($menu->subMenuList); $i++)
                        <tr>
                            <td style="border:1px solid #d6caca;">
                                <input type="checkbox" data="{{$menu->subMenuList[$i]->Id}}" class="cbxSubMenu">{{$menu->subMenuList[$i]->sName}}</input>
                            </td>
                        </tr>
                    @endfor
                </table>
            @endforeach
        </div>
    </div>

    <script>
        var groupMenuList = new Array();
        @for($i = 0; $i < count($allGroupList); $i++)
                var group{{$i}} = new Object();
                group{{$i}}.Id = {{$allGroupList[$i]->row_id}};
                group{{$i}}.MenuIdList = new Array();
                @for($j = 0; $j < count($allGroupList[$i]->menuList); $j++)
                        group{{$i}}.MenuIdList.push({{$allGroupList[$i]->menuList[$j]->menu_row_id}});
                @endfor
                groupMenuList.push(group{{$i}});
        @endfor

        $(function () {
            ChangeGroupProcess();
            ChangeBelongToGroup();
        });

        var ChangeGroupProcess = function () {
            $(".cbxMenu").prop("checked", false);
            $(".cbxSubMenu").prop("checked", false);
            var groupId = $("#ddlGroup").val();
            $.each(groupMenuList, function (i, group) {
                if(group.Id == groupId) {
                    $.each(group.MenuIdList, function (j, menuId) {
                        $(".MenuTable").find("[data=" + menuId +  "]").prop("checked", true);
                    });
                    return false;
                }
            });
        };

        var ChangeGroup = function () {
            ChangeGroupProcess();
        };

        var MenuTableSelectedAll = function (cbx) {
            var menuId = $(cbx).attr("data");
            if($(cbx).is(':checked')) {
                $("#MenuTable_" + menuId).find(".cbxSubMenu").prop("checked",true);
            } else {
                $("#MenuTable_" + menuId).find(".cbxSubMenu").prop("checked", false);
            }
        };

        var RoleTableSelectedAll = function (cbx) {
            var companyId = $(cbx).attr("data");
            if($(cbx).is(':checked')) {
                $("#RoleTable_" + companyId).find(".cbxRole").prop("checked",true);
            } else {
                $("#RoleTable_" + companyId).find(".cbxRole").prop("checked", false);
            }
        };

        var ChangeBelongToGroup = function () {
            if($("#cbxBelongToGroup").is(':checked')) {
                $(".MenuTable").find("input").prop("disabled", true);
            } else {
                $(".MenuTable").find("input").prop("disabled", false);
            }
        };

        var SaveUser = function () {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                var userStatus = "N";
                if($('#cbxUserStatus').is(':checked')) {
                    userStatus = "Y";
                }
                var belongToGroup = "N";
                if($('#cbxBelongToGroup').is(':checked')) {
                    belongToGroup = "Y";
                }

                var mydata =
                {
                    user_id: {{$userInfo->row_id}},
                    status: userStatus,
                    role_list: new Array(),
                    groupId: $("#ddlGroup").val(),
                    menuBelongToGroup: belongToGroup,
                    menu_list: new Array()
                };

                $(".cbxRole").each(function() {
                    if($(this).is(':checked')) {
                        mydata.role_list.push($(this).attr("data"));
                    }
                });

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
                    url: "platform/saveUser",
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
        }
    </script>
@endsection

