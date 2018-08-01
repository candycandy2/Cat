@include("layouts.lang")
<?php
    use App\lib\ResultCode;

    $menu_name = "FUNCTION_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    
    <div id="toolbar">
        <button id="btnDelete" type="button" class="btn btn-danger" onclick="deleteFunction()">
          {{trans("messages.DELETE")}}
        </button> 
        <button id="btnNew" type="button" class="btn btn-primary" onclick="newFunction()">
            {{trans("messages.NEW")}}
        </button>
    </div>
    <table id="gridFunctionList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="functionMaintain/getFunctionList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="false"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="fun_name" data-sortable="true" data-formatter="functionNameFormatter">{{trans("messages.FUNCTION_NAME")}}</th>
            <th data-field="fun_variable" data-sortable="true">{{trans("messages.FUNCTION_VARIABLE_NAME")}}</th>
            <th data-field="owner_app_name" data-sortable="true">{{trans("messages.OWNER_APP")}}</th>
            <th data-field="fun_type" data-sortable="true">{{trans("messages.FUNCTION_TYPE")}}</th>
            <th data-field="fun_app_name" data-sortable="true">{{trans("messages.APP_NAME")}}</th>
            <th data-field="fun_status" data-sortable="true" data-formatter="functionStatusFormatter" >{{trans("messages.STATUS")}}</th>
           
        </tr>
        </thead>
    </table>

    <script type="text/javascript">

        $(function() {

            var currentMaintainFunctionID = null;
            var isNewFunction = false;

            $delBtn = $("#btnDelete");
            $newBtn = $("#btnNew");
            $gridList = $('#gridFunctionList');
            $delBtn.hide();
            $gridList.on('check.bs.table', selectedChanged);
            $gridList.on('uncheck.bs.table', selectedChanged);
            $gridList.on('check-all.bs.table', selectedChanged);
            $gridList.on('uncheck-all.bs.table', selectedChanged);
            $gridList.on('load-success.bs.table', selectedChanged);

            var selectedChanged = function (row, $element) {
                var selectedApps = $gridList.bootstrapTable('getSelections');

                if (selectedApps.length > 0) {
                    $delBtn.show();
                    $newBtn.hide();
                } else {
                    $delBtn.hide();
                    $newBtn.show();
                }
            }

        });

        function functionNameFormatter(value, row) {
            return '<a href="#" onclick="updateFunction(' + row.row_id + ')">' + htmlEscape(value) + '</a>';
        };

        function functionStatusFormatter(value, row) {
            if (value == "Y") {
                return "{{trans("messages.ENABLE")}}";
            } else if (value == "N") {
                return "{{trans("messages.DISABLE")}}";
            }
        };

        var newFunction = function() {
            var $dialogObj = $("#functionDetailMaintainDialog");
            var $toogleAppType = $dialogObj.find(".toogle-app-type");

            $dialogObj.find(".modal-title").text("{{trans("messages.FUNCTION_NEW_DATA")}}");
            $dialogObj.find("input[type=text]").val("");
            $dialogObj.find("textarea").val("");
            $("#ddlOwnerApp option[value='']").prop("selected",true);
            $("#ddlApp option[value='']").prop("selected",true);
            $("#ddlFunctionType option[value='FUN']").prop("selected",true);
            $("#ddlFunctionStatus option[value='Y']").prop("selected",true);

            $toogleAppType.hide();
            $("#ddlFunctionType").bind( "change", function() {
               if($(this).val() == 'APP'){
                $toogleAppType.fadeIn("1500");
               }else{
                $toogleAppType.fadeOut("1500");
               }
            });
            
            currentMaintainFunctionID = null;
            isNewFunction = true;
            $("#functionDetailMaintainDialog").modal('show');

        };

        var updateFunction = function(functionID) {

            var allFunctionList = $gridList.bootstrapTable('getData');

            $.each(allFunctionList, function(i, fun) {
                if (fun.row_id == functionID) {
                    
                    $("#tbxFunctionName").val(fun.fun_name);
                    $("#ddlApp").val(fun.fun_app_name);
                    $("#tbxFunctionVariable").val(fun.login_type);
                    $("#tbxFunctionDescription").val(fun.server_ip);
                    $("#tbxOwnerApp").val(fun.server_port);
                    $("#ddlFunctionStatus").val(fun.status);

                    return false;
                }
            });

            currentMaintainFunctionID = FunctionID;
            isNewFunction = false;

            $("#functionDetailMaintainDialogTitle").text("{{trans("messages.FUNCTION_EDIT_DATA")}}");
            $("#functionDetailMaintainDialog").modal('show');

        };

        var functionMaintain = function() {

            var funName = $.trim($("#tbxFunctionName").val());
            var funVariable = $.trim($("#tbxFunctionVariable").val());
            var funDescription = $.trim($("#tbxFunctionDescription").val());
            var ownerApp = $.trim($("#ddlOwnerApp").val());
            var funType = $.trim($("#ddlFunctionType").val());
            var app = $.trim($("#ddlApp").val());
            var funStatus = $.trim($("#ddlFunctionStatus").val());
            
            //Check Data Empty
            if (funName.length == 0 || funVariable.length == 0 || funDescription.length == 0 
                || ownerApp.length == 0  || funType.length == 0 || funStatus.length == 0 ) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }
            if(funType == 'APP'){
                if(funType.length == 0){
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                    return false;
                }
            }
            
            var currentData = $gridList.bootstrapTable('getData');
            var duplicate = false;

            //Check Data has Exist
            if (isNewFunction) {
                $.each(currentData, function(i, fun) {
                    if (funVariable == fun.fun_variable) {
                        duplicate = true;
                        return false;
                    }
                });
            }
            if (duplicate) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.ERR_FUNCTION_VARIABLE_EXIST")}}");
                return false;
            }
            //Call API
            if (isNewFunction) {

                showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                    hideConfirmDialog();
                    var mydata = {
                        funName: funName,
                        funVariable: funVariable,
                        funDescription: funDescription,
                        ownerApp: ownerApp,
                        funType: funType,
                        app: app,
                        funStatus: funStatus
                    };

                    $.ajax({
                        url: "functionMaintain/newFunction",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: $.toJSON(mydata),
                        success: function (d, status, xhr) {

                            if (d.result_code != 1) {
                                
                                //Error
                                showMessageDialog("{{trans("messages.ERROR")}}", d.message);
                                return false; 

                            } else {

                                //Success
                                $("#gridFunctionList").bootstrapTable('refresh');
                                $("#functionDetailMaintainDialog").modal('hide');

                                showMessageDialog("{{trans("messages.MESSAGE")}}", "{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            }

                        },
                        error: function (e) {

                            if (handleAJAXError(this,e)) {
                                return false;
                            }

                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.ERR_CREATE_FUNCTION_FAILED")}}", 
                                e.responseText);

                        }
                    });
                });

            } else if (!isNewFunction) {

                showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {

                    hideConfirmDialog();

                    var mydata = {
                        funName: funName,
                        funVariable: funVariable,
                        funDescription: funDescription,
                        ownerApp: ownerApp,
                        funType: funType,
                        app: app,
                        funStatus: funStatus
                    };

                    $.ajax({
                        url: "functionMaintain/updateFunction",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: $.toJSON(mydata),
                        success: function (d, status, xhr) {

                            if (d.result_code != 1) {

                                //Error
                                if (d.result_code == {{ResultCode::_000920_companyExist}}) {
                                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.FUN_ERR_DATA_HAS_EXIST")}}");
                                    return false;
                                } else {
                                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.ERR_UPDATE_FUNCTION_FAILED")}}");
                                }

                            } else {

                                //Success
                                $("#gridFunctionList").bootstrapTable('refresh');
                                $("#functionDetailMaintainDialog").modal('hide');

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
                });

            }

        }

    </script>

@endsection

@section('dialog_content')
    <div id="functionDetailMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="functionDetailMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table  width="100%">
                        <tr>
                            <td>{{trans("messages.FUNCTION_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxFunctionName" id="tbxFunctionName">
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.FUNCTION_VARIABLE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                 <input type="text" data-clear-btn="true" class="form-control" name="tbxFunctionVariable" id="tbxFunctionVariable">
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.FUNCTION_DESCRIPTION")}}:</td>
                            <td style="padding: 10px;">
                                  <textarea data-clear-btn="true" class="form-control" name="tbxFunctionDescription"
                               id="tbxFunctionDescription" value="" style="height: 100px;"/></textarea>
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
                        <tr class="toogle-app-type">
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
                            <td>{{trans("messages.STATUS")}}:</td>
                            <td style="padding: 10px;">
                                <select name="ddlFunctionStatus" id="ddlFunctionStatus" class="form-control" required="required">
                                    <option value="Y">{{trans("messages.ENABLE")}}</option>
                                    <option value="N">{{trans("messages.DISABLE")}}</option>
                                </select>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="functionMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
