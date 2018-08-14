<table class="table table-bordered CompanyTable" id="CompanyTable" style="border:1px solid #d6caca;width:100%;">
    <tr>
        <td rowspan="{{count($allCompanyRoleList)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
            <input type="checkbox" data="All_Company" class="allCompany" onclick="CompanyTableSelectedAll(this)">ALL</input>
        </td>
        <td style="border:1px solid #d6caca;padding: 0px;">
            @if(count($allCompanyRoleList) > 0)
            <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                <input type="checkbox" data="{{$allCompanyRoleList[0]->company}}" class="cbxCompany">{{$allCompanyRoleList[0]->company}}</input>
            </div>
            @endif
                @if(count($allCompanyRoleList) > 1)
                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                        <input type="checkbox" data="{{$allCompanyRoleList[1]->company}}" class="cbxCompany">{{$allCompanyRoleList[1]->company}}</input>
                    </div>
                @endif
        </td>
    </tr>
    @if(count($allCompanyRoleList) > 2)
    @for($i = 2; $i < (count($allCompanyRoleList) + 1); $i = $i + 2)
        <tr>
            <td style="border:1px solid #d6caca;padding: 0px;">
                @if(count($allCompanyRoleList) > $i)
                    <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                        <input type="checkbox" data="{{$allCompanyRoleList[$i]->company}}" class="cbxCompany">{{$allCompanyRoleList[$i]->company}}</input>
                    </div>
                @endif
                    @if(count($allCompanyRoleList) > $i + 1)
                        <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                            <input type="checkbox" data="{{$allCompanyRoleList[$i + 1]->company}}" class="cbxCompany">{{$allCompanyRoleList[$i + 1]->company}}</input>
                        </div>
                    @endif
            </td>
        </tr>
    @endfor
    @endif
</table>

<script type="text/javascript">

$(function() {
       $(".CompanyTable").find(".cbxCompany").bind( "click", CompanyTableSelectedOne);
        CheckCompanyTableSelect();
    });
    var CheckCompanyTableSelect = function () {
        $(".CompanyTable").each(function(i, tb) {
            var $companyTable = $(tb);
            var allCheckd = true;
            $.each($companyTable.find(".cbxCompany"), function(i, cbx) {
                if(!$(cbx).is(":checked")) {
                    allCheckd = false;
                    return false;
                }
            });
            if(allCheckd) {
                $companyTable.find(".allCompany").prop("checked",true);
            } else {
                $companyTable.find(".allCompany").prop("checked",false);
            }
        });
    };

    var CompanyTableSelectedAll = function(cbx) {
        if($(cbx).is(':checked')) {
            $(".CompanyTable").find(".cbxCompany").prop("checked",true);
        } else {
            $(".CompanyTable").find(".cbxCompany").prop("checked", false);
        }
    };

    var CompanyTableSelectedOne = function (cbx) {
        var $companyTable = $("#CompanyTable");
        var allCheckd = true;
        $.each($companyTable.find(".cbxCompany"), function(i, cbx) {
            if(!$(cbx).is(":checked")) {
                allCheckd = false;
                return false;
            }
        });
        if(allCheckd) {
            $companyTable.find(".allCompany").prop("checked",true);
        } else {
            $companyTable.find(".allCompany").prop("checked",false);
        }
    };

</script>