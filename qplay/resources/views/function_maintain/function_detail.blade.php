@include("layouts.lang")
<?php
$menu_name = "FUNCTION_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-8 col-xs-8 col-md-8">
            <table style="width: 100%">
                <form id="functionForm" name="functionForm">
                    <tr>
                        <td>{{trans("messages.FUNCTION_NAME")}}:</td>
                        <td style="padding: 10px;">
                            <input type="text" data-clear-btn="true" name="tbxFunctionName" class="form-control"
                                   id="tbxFunctionName" value="{{$functionData['name']}}" disabled />
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.FUNCTION_VARIABLE_NAME")}}:</td>
                        <td style="padding: 10px;">
                            <table style="width: 100%;">
                                <tr>
                                    <td>
                                        <input type="text" data-clear-btn="true" name="tbxFunctionVariable" class="form-control"
                                               id="tbxFunctionVariable" value="{{$functionData['variable_name']}}"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.FUNCTION_DESCRIPTION")}}:</td>
                        <td style="padding: 10px;">
                            <textarea type="text" data-clear-btn="true" name="tbxFunctionDescription" class="form-control"
                                   id="tbxFunctionDescription">{{$functionData['description']}}</textarea>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.OWNER_APP")}}:</td>
                        <td style="padding: 10px;">
                        <select name="ddlOwnerApp" id="ddlOwnerApp" class="form-control" required="required">
                            <option value=""></option>
                            @foreach ($appList as $app)
                                <option value="{{ $app['row_id'] }}">{{ $app['app_name'] }}</option>
                            @endforeach
                        </select>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.FUNCTION_TYPE")}}:</td>
                        <td style="padding: 10px;">
                            <select name="ddlFunctionType" id="ddlFunctionType" class="form-control" required="required">
                                <option value="FUN">FUN</option>
                                <option value="APP">APP</option>
                            </select>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                     <tr class="toogle-app-type" style="display: none">
                        <td>{{trans("messages.APP_NAME")}}:</td>
                        <td style="padding: 10px;">
                        <select name="ddlApp" id="ddlApp" class="form-control" required="required">
                            <option value=""></option>
                            @foreach ($appList as $app)
                                <option value="{{ $app['row_id'] }}">{{ $app['app_name'] }}</option>
                            @endforeach
                        </select>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.QACCOUNT_AVAILABLE")}}:</td>
                        <td style="padding: 10px;">
                            <select name="ddlQAccountUse" id="ddlQAccountUse" class="form-control" required="required">
                                <option value="Y">Y</option>
                                <option value="N">N</option>
                            </select>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr class="toogle-qaccount-use"  style="display: none">
                        <td>{{trans("messages.RIGHT_LEVEL")}}:</td>
                        <td style="padding: 10px;">
                            <select name="ddlQAccountRightLevel" id="ddlQAccountRightLevel" class="form-control" required="required">
                                <option value="1">QAccount < 公司</option>
                                <option value="2">公司 < QAccount</option>
                            </select>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.STATUS")}}:</td>
                        <td style="padding: 10px;">
                            <select name="ddlFunctionStatus" id="ddlFunctionStatus" class="form-control" required="required">
                                <option value="Y">{{trans("messages.ENABLE")}}</option>
                                <option value="N">{{trans("messages.DISABLE")}}</option>
                            </select>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.USER_SETTING")}}:</td>
                        <td style="padding: 10px;">
                            <select name="ddlUserSetting" id="ddlUserSetting" class="form-control" required="required">
                                <option value="1">{{trans('messages.USER_SETTING_BY_COMPOANY')}}</option>
                                <option value="2">{{trans('messages.USER_SETTING_BY_ROLE')}}</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="col-md-8" id="companySetting" style="padding: 10px;">
                             @include("wideget.company_selection")
                        </td>
                        <td class="col-md-8" id="userRoleSetting" style="padding: 10px; display: none">
                             @include("wideget.role_selection")
                             @include("wideget.user_selection")
                        </td>
                    </tr>
                </form>
            </table>
        </div>
        <!-- save and return block-->
        <div class="col-lg-4 col-xs-4" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="Save()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="../functionMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

 <script type="text/javascript">
    $(function() {

        const byCompany = 1;
        const byUserRole = 2;

        var thisAppId = '{{$functionData['app_row_id']}}';
        var companyLabel = '{{$functionData['company_label']}}';
        var ownerAppId = '{{$functionData['owner_app_row_id']}}';
        var functionType = '{{$functionData['type']}}';
        var qAccountUse = '{{$functionData['qaccount_use']}}';
        var qAccounRightLevel = '{{$functionData['qaccount_right_level']}}';
        var functionType = '{{$functionData['type']}}';
        var functionStatus = '{{$functionData['status']}}';
        var roleList = '{{$functionData['roleList']}}';
        var appId = '{{$functionData['app_row_id']}}';

        var defSetting = byCompany;//default is by role
        if(companyLabel == null || companyLabel ==""){
            defSetting = byUserRole;
        }
        $('#ddlFunctionType option[value="' + functionType + '"]').attr("selected",true);
        $('#ddlQAccountUse option[value="' + qAccountUse + '"]').attr("selected",true);
        $('#ddlQAccountRightLevel option[value="' + qAccounRightLevel + '"]').attr("selected",true);
        $('#ddlUserSetting option[value="' + defSetting + '"]').attr("selected",true);
        $('#ddlFunctionStatus option[value="' + functionStatus + '"]').attr("selected",true);
        $('#ddlOwnerApp option[value="' + ownerAppId + '"]').attr("selected",true);
        $('#ddlApp option[value="' + appId + '"]').attr("selected",true);
        
        $("#ddlUserSetting").bind( "change",switchUserSetting);
        $("#ddlFunctionType").bind( "change", switchAppName);
        $("#ddlQAccountUse").bind( "change", switchQAccountRightLevel);
        
        switchAppName();
        switchQAccountRightLevel();
        switchUserSetting();
        setCompanyLabel(companyLabel);
        setRoleList(roleList);
        CheckCompanyTableSelect();
        CheckRoleTableSelect();
        initUserList();

      
    });

    var switchUserSetting = function(){
      
       var $companyBlock = $('#companySetting');
       var $userRoleBlobk = $('#userRoleSetting');

       if($("#ddlUserSetting").val() == 1){
            $userRoleBlobk.hide();
            $companyBlock.show();
       }else{
            $companyBlock.hide();
            $userRoleBlobk.show();
       }
    }

    var switchAppName = function(){
       if($("#ddlFunctionType").val() == 'APP'){
            $(".toogle-app-type").show();
       }else{
            $(".toogle-app-type").hide();
       }
    }

    var switchQAccountRightLevel = function(){
       if($("#ddlQAccountUse").val() == 'Y'){
            $(".toogle-qaccount-use").show();
       }else{
            $(".toogle-qaccount-use").hide();
       }
    }

    var setCompanyLabel =function(companyLabel){
       var companyList = companyLabel.split(";");
       $.each(companyList, function(i, v){
            $('#CompanyTable').find('input.cbxCompany[data="' + v + '"]').each(function(){
                $(this).prop("checked", true);
            });
       });
    }

    var setRoleList = function(roleList){
        var roles = roleList.split(";");
       $.each(roles, function(i, v){
            $('.RoleTable').find('input.cbxRole[data="' + v + '"]').each(function(){
                $(this).prop("checked", true);
            });
       });
    }

    var initUserList = function () {
        var $table = $('#gridUserList');
        $table.bootstrapTable({
            "url": "./getUserFunctionList?function_id=" + getUrlVar('function_id'),
            "dataType": "json"
        });
    };

    var Save = function(){

        var formData = {};
        var myData = $("form").serializeArray();
        $.map(myData, function(n, i){
            formData[n['name']] = n['value'];
        });

        if($('#ddlUserSetting').val() == 1){
            formData['companyList'] = [];
            $('#CompanyTable').find("input.cbxCompany:checked").each(function(){
                formData['companyList'].push($(this).attr('data'));
            });
        }else{
            formData['roleList'] = [];
            formData['userList'] = [];
             $('.RoleTable').find("input.cbxRole:checked").each(function(){
                formData['roleList'].push($(this).attr('data'));
            });
            var appUserData =  $("#gridUserList").bootstrapTable('getData');
            $.each(appUserData, function(i, user) {
                formData['userList'].push(user.row_id);
            });
        }
        $.ajax({
            url: "./updateFunction?function_id=" + getUrlVar('function_id'),
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            data: $.toJSON(formData),
            success: function (d, status, xhr) {

               if (d.result_code != 1) {
                                
                    //Error
                    showMessageDialog("{{trans("messages.ERROR")}}", d.message);
                    return false;

                } else {
                    $('#messageDialog').on('hidden.bs.modal', function () {
                        location.reload();
                    })
                    //Success
                    showMessageDialog("{{trans("messages.MESSAGE")}}", "{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                }

            },
            error: function (e) {

                if (handleAJAXError(this,e)) {
                    return false;
                }

                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.FUN_ERR_CREATE_FUN_FAILED")}}", 
                    e.responseText);

            }
        });
    }
 </script>
@endsection

