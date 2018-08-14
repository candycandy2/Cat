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
            <th data-field="fun_name" data-sortable="true" data-formatter="functionNameFormatter">{{trans("messages.FUNCTION_NAME")}}</th>
            <th data-field="fun_variable" data-sortable="true" data-formatter="functionVariableFormatter">{{trans("messages.FUNCTION_VARIABLE_NAME")}}</th>
            <th data-field="owner_app_name" data-sortable="true">{{trans("messages.OWNER_APP")}}</th>
            <th data-field="fun_type" data-sortable="true">{{trans("messages.FUNCTION_TYPE")}}</th>
            <th data-field="fun_app" data-sortable="true">{{trans("messages.APP_NAME")}}</th>
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
            return '<a href="#" onclick="editFunction(' + row.row_id + ')">' + htmlEscape(value) + '</a>';
        };

        function functionVariableFormatter(value, row){
            return htmlEscape(value);
        }

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

        var editFunction = function(functionID) {
            location.href = "{{asset('functionMaintain/editFunction')}}" + "?function_id=" + functionID;
        };

        var functionMaintain = function() {
            var myData = getFormData($("form"));
            //Check Data Empty
            if (myData.tbxFunctionName.length == 0 
                || myData.tbxFunctionVariable.length == 0 
                || myData.tbxFunctionDescription.length == 0 
                || myData.ddlOwnerApp.length == 0  
                || myData.ddlFunctionType.length == 0 
                || myData.ddlFunctionStatus.length == 0 ) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }
            if(myData.ddlFunctionType == 'APP'){
                if(myData.ddlApp.length == 0){
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                    return false;
                }
            }
            
            var currentData = $gridList.bootstrapTable('getData');
            var duplicate = false;

            $.each(currentData, function(i, fun) {
                if ( myData.tbxFunctionVariable == fun.fun_variable) {
                    duplicate = true;
                    return false;
                }
            });
            if (duplicate) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.ERR_FUNCTION_VARIABLE_EXIST")}}");
                return false;
            }

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
                $.ajax({
                    url: "functionMaintain/newFunction",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: $.toJSON(myData),
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
                    <form>
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
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="functionMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
