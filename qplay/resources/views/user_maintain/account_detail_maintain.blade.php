@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "USER_ACCOUNT_MAINTAIN";
$input = Input::get();
$userLoginId = $input["login_id"];
$tempFlag = 0;
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
                <!--{{$tempFlag++}}-->
                @if(count($companyRoles->roles) > 0)
                    <table class="table table-bordered RoleTable" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca; width:60%;">
                        <tr>
                            <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;background-color:@if($tempFlag % 2 == 0) #d9edf7; @else #f9edf7; @endif">
                                <input class="cbxCompany" type="checkbox" data="{{$companyRoles->company}}" onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                            </td>
                            <td style="border:1px solid #d6caca;padding: 0px;">
                                <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                    @if(in_array($companyRoles->roles[0]->row_id, $userInfo->roleList))
                                        checked
                                    @endif
                                >{{$companyRoles->roles[0]->role_description}}</input>
                                </div>
                                @if(count($companyRoles->roles) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                               @if(in_array($companyRoles->roles[1]->row_id, $userInfo->roleList))
                                               checked
                                                @endif
                                        >{{$companyRoles->roles[1]->role_description}}</input>
                                    </div>
                                @endif
                            </td>
                        </tr>
                        @if(count($companyRoles->roles) > 2)
                        @for($i = 2; $i < (count($companyRoles->roles) + 1); $i = $i + 2)
                            <tr>
                                <td style="border:1px solid #d6caca;padding: 0px;">
                                    @if(count($companyRoles->roles) > $i)
                                        <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                            <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                                   @if(in_array($companyRoles->roles[$i]->row_id, $userInfo->roleList))
                                                   checked
                                                    @endif
                                            >{{$companyRoles->roles[$i]->role_description}}</input>
                                        </div>
                                    @endif
                                        @if(count($companyRoles->roles) > $i + 1)
                                            <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                                <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)"
                                                       @if(in_array($companyRoles->roles[$i + 1]->row_id, $userInfo->roleList))
                                                       checked
                                                        @endif
                                                >{{$companyRoles->roles[$i + 1]->role_description}}</input>
                                            </div>
                                        @endif
                                </td>
                            </tr>
                        @endfor
                        @endif
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
                    <option></option>
                @foreach($allGroupList as $group)
                    <option value="{{$group->row_id}}"
                    @if($userInfo->group_id != null && $group->row_id == $userInfo->group_id)
                        selected="selected"
                    @endif
                    >{{$group->group_name}}</option>
                @endforeach
            </select>
            &nbsp;<input type="checkbox" id="cbxBelongToGroup"
                         @if($userInfo->authority_by_group != null && $userInfo->authority_by_group == 'Y')
                         checked="checked"
                         @endif
                         onclick="ChangeBelongToGroup(this)">{{trans("messages.MSG_BELONG_TO_GROUP_RIGHT")}}</input>
            <br /><br />
            @foreach($allMenuList as $menu)
                <table class="table table-bordered MenuTable" style="width:60%;margin-bottom:-1px" id="MenuTable_{{$menu->Id}}" >
                    <tr>
                        <td rowspan="{{count($menu->subMenuList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="background-color:#e2dbdb;text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                            <input type="checkbox" data="{{$menu->Id}}"
                                   @if(in_array($menu->Id, $userInfo->menuList))
                                   checked
                                   @endif
                                   class="cbxMenu" onclick="MenuTableSelectedAll(this)" >{{$menu->sName}}</input>
                        </td>
                        <td style="border:1px solid #d6caca;padding: 0px;">
                            <div class="col-lg-12 col-xs-12">
                            @if(count($menu->subMenuList) > 0)
                                <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                    <input type="checkbox" data="{{$menu->subMenuList[0]->Id}}"
                                           @if(in_array($menu->subMenuList[0]->Id, $userInfo->menuList))
                                           checked
                                           @endif
                                           class="cbxSubMenu" onclick="MenuTableSelectedOne(this)" >{{$menu->subMenuList[0]->sName}}</input>
                                </div>
                            @endif
                                @if(count($menu->subMenuList) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" data="{{$menu->subMenuList[1]->Id}}"
                                               @if(in_array($menu->subMenuList[1]->Id, $userInfo->menuList))
                                               checked
                                               @endif
                                               class="cbxSubMenu" onclick="MenuTableSelectedOne(this)" >{{$menu->subMenuList[1]->sName}}</input>
                                    </div>
                                @endif
                            </div>
                        </td>
                    </tr>
                    @if(count($menu->subMenuList) > 2)
                    @for($i = 2; $i <= (count($menu->subMenuList) + 1)  ; $i = $i + 2)
                            @if(count($menu->subMenuList) > $i)
                        <tr>
                            <td style="border-right:1px solid #d6caca;border-bottom:1px solid #d6caca;padding: 0px;">
                                <div class="col-lg-12 col-xs-12">
                                @if(count($menu->subMenuList) > $i)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                <input type="checkbox" data="{{$menu->subMenuList[$i]->Id}}"
                                       @if(in_array($menu->subMenuList[$i]->Id, $userInfo->menuList))
                                       checked
                                       @endif
                                       class="cbxSubMenu" onclick="MenuTableSelectedOne(this)">{{$menu->subMenuList[$i]->sName}}</input>
                                    </div>
                                @endif
                                    @if(count($menu->subMenuList) > $i + 1)
                                        <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                            <input type="checkbox" data="{{$menu->subMenuList[$i + 1]->Id}}"
                                                   @if(in_array($menu->subMenuList[$i + 1]->Id, $userInfo->menuList))
                                                   checked
                                                   @endif
                                                   class="cbxSubMenu" onclick="MenuTableSelectedOne(this)">{{$menu->subMenuList[$i + 1]->sName}}</input>
                                        </div>
                                    @endif
                                </div>
                            </td>
                        </tr>
                            @endif
                    @endfor
                    @endif
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
            CheckRoleTableSelect();
        });

        var CheckRoleTableSelect = function () {
            $(".RoleTable").each(function(i, tb) {
                var $companyTable = $(tb);
                var allCheckd = true;
                $.each($companyTable.find(".cbxRole"), function(i, cbx) {
                    if(!$(cbx).is(":checked")) {
                        allCheckd = false;
                        return false;
                    }
                });
                if(allCheckd) {
                    $companyTable.find(".cbxCompany").prop("checked",true);
                } else {
                    $companyTable.find(".cbxCompany").prop("checked",false);
                }
            });
        };

        var hasChanged = false;
        var ChangeGroupProcess = function () {
            if(hasChanged) {
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
            } else {
                hasChanged = true;
            }
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

        var MenuTableSelectedOne = function (cbx) {
            var $menuTable = $(cbx).parents("table").first();
            var hasChecked = false;
            $.each($menuTable.find(".cbxSubMenu"), function(i, cbx) {
                if($(cbx).is(":checked")) {
                    hasChecked = true;
                    return false;
                }
            });
            if(hasChecked) {
                $menuTable.find(".cbxMenu").prop("checked",true);
            } else {
                $menuTable.find(".cbxMenu").prop("checked",false);
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

        var RoleTableSelectedOne = function (cbx) {
            var $companyTable = $(cbx).parents("table").first();
            var allCheckd = true;
            $.each($companyTable.find(".cbxRole"), function(i, cbx) {
                if(!$(cbx).is(":checked")) {
                    allCheckd = false;
                    return false;
                }
            });
            if(allCheckd) {
                $companyTable.find(".cbxCompany").prop("checked",true);
            } else {
                $companyTable.find(".cbxCompany").prop("checked",false);
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
            var groupID = $("#ddlGroup").val();

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
                    groupId: groupID,
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
                        if(handleAJAXError(this,e)){
                            return false;
                        }
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        }
    </script>
@endsection

