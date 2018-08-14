<?php
$tempFlag = 0;
?>
@foreach($allCompanyRoleList as $companyRoles)
<!--{{$tempFlag++}}-->
    @if(count($companyRoles->roles) > 0)
        <table class="table table-bordered RoleTable" id="RoleTable_{{trim(preg_replace('/[^a-zA-Z0-9]/','',$companyRoles->company))}}" style="border:1px solid #d6caca;width:100%;">
            <tr>
                <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;background-color:@if($tempFlag % 2 == 0) #d9edf7; @else #f9edf7; @endif">
                    <input class="cbxCompany" type="checkbox" data="{{$companyRoles->company}}" onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                </td>
                <td style="border:1px solid #d6caca;padding: 0px;">
                    <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                        <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)">{{$companyRoles->roles[0]->role_description}}</input>
                    </div>
                    @if(count($companyRoles->roles) > 1)
                        <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                            <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)">{{$companyRoles->roles[1]->role_description}}</input>
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
                                <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)">{{$companyRoles->roles[$i]->role_description}}</input>
                            </div>
                        @endif
                            @if(count($companyRoles->roles) > $i + 1)
                                <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                    <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}" class="cbxRole" onclick="RoleTableSelectedOne(this)">{{$companyRoles->roles[$i + 1]->role_description}}</input>
                                </div>
                            @endif
                    </td>
                </tr>
            @endfor
            @endif
        </table>
    @endif
@endforeach

<script type="text/javascript">
    $(function() {
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
</script>