@include("layouts.lang")
<?php
$menu_name = "SYS_PARAMETER_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    <style>
        .tab-content {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            background-color: #fff;
            padding:20px;
        }
    </style>
    <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#tab_content_parameter_type" data-toggle="tab">{{trans("messages.PARAMETER_TYPE")}}</a></li>
        <li role="presentation"><a href="#tab_content_parameter" data-toggle="tab">{{trans("messages.PARAMETER")}}</a></li>
    </ul>

    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab_content_parameter_type">
            <!--Parameter Type-->
            <div id="toolbarType">
                <button type="button" class="btn btn-danger" onclick="deleteType()" id="btnDeleteType" style="display: none;">
                    {{trans("messages.DELETE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="newType()" id="btnNewType">
                    {{trans("messages.NEW")}}
                </button>
            </div>
            <table id="gridTypeList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbarType"
                   data-url="platform/getParameterTypeList" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
                    <th data-field="parameter_type_name" data-sortable="true" data-formatter="typeNameFormatter" data-search-formatter="false">{{trans("messages.PARAMETER_TYPE_NAME")}}</th>
                    <th data-field="parameter_type_desc" data-sortable="true" data-width="700px" data-class="grid_long_column">{{trans("messages.DESCRIPTION")}}</th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="tab-pane fade" id="tab_content_parameter">
            <!--Parameter-->
            <div id="toolbarParameter">
                <button type="button" class="btn btn-danger" onclick="deleteParameter()" id="btnDeleteParameter" style="display: none;">
                    {{trans("messages.DELETE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="newParameter()" id="btnNewParameter">
                    {{trans("messages.NEW")}}
                </button>
            </div>
            <table id="gridParameterList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbarParameter"
                   data-url="platform/getParameterList" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false" data-searchable="false">ID</th>
                    <th data-field="parameter_type_row_id" data-sortable="false" data-visible="false" data-searchable="false">TypeID</th>
                    <th data-field="parameter_type_name" data-sortable="true">{{trans("messages.PARAMETER_TYPE_NAME")}}</th>
                    <th data-field="parameter_name" data-formatter="parameterNameFormatter" data-sortable="true" data-search-formatter="false">{{trans("messages.PARAMETER_NAME")}}</th>
                    <th data-field="parameter_value" data-sortable="true" data-width="600px" data-class="grid_long_column">{{trans("messages.PARAMETER_VALUE")}}</th>
                </tr>
                </thead>
            </table>
        </div>
    </div>

    <script>
        function typeNameFormatter(value, row) {
            return '<a href="#" onclick="updateType(' + row.row_id + ')">' + value + '</a>';
        };

        function parameterNameFormatter(value, row) {
            return '<a href="#" onclick="updateParameter(' + row.row_id + ')">' + value + '</a>';
        };

        $(function() {
            try {
                if(!tableSelectChangedFunctionList) {
                    tableSelectChangedFunctionList = new Array();
                }
            } catch(e){
                tableSelectChangedFunctionList = new Array();
            }


            $('#gridTypeList').on('check.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('uncheck.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('check-all.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('uncheck-all.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('load-success.bs.table', typeDataLoadSuccessed);
            $('#gridTypeList').on('page-change.bs.table', selectedTypeChanged);

            $('#gridParameterList').on('check.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('uncheck.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('check-all.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('uncheck-all.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('load-success.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('page-change.bs.table', selectedParameterChanged);

            tableSelectChangedFunctionList.push(selectedTypeChanged);
            tableSelectChangedFunctionList.push(selectedParameterChanged);
        });

        var selectedTypeChanged = function (row, $element) {
            var selectedType = $("#gridTypeList").bootstrapTable('getSelections');

            if(selectedType.length > 0) {
                $("#btnNewType").fadeOut(300, function() {
                    $("#btnDeleteType").fadeIn(300);
                });
            } else {
                $("#btnDeleteType").fadeOut(300, function() {
                    $("#btnNewType").fadeIn(300);
                });
            }
        }

        var selectedParameterChanged = function (row, $element) {
            var selectedParameter = $("#gridParameterList").bootstrapTable('getSelections');

            if(selectedParameter.length > 0) {
                $("#btnNewParameter").fadeOut(300, function() {
                    $("#btnDeleteParameter").fadeIn(300);
                });
            } else {
                $("#btnDeleteParameter").fadeOut(300, function() {
                    $("#btnNewParameter").fadeIn(300);
                });
            }
        }
        
        var typeDataLoadSuccessed = function (row, $element) {
            selectedTypeChanged(row, $element);
            RefreshTypeList();
        }

        var deleteType = function() {
            var selectedType = $("#gridTypeList").bootstrapTable('getSelections');
            var paramList = $("#gridParameterList").bootstrapTable('getData');
            var typeIdList = new Array();
            var check = true;
            $.each(selectedType, function(i, type) {
                typeIdList.push(type.row_id);
                $.each(paramList, function(j, p) {
                    if(p.parameter_type_name == type.parameter_type_name) {
                        check = false;
                        return false;
                    }
                });
            });
            if(!check) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_EXIST_PARAMETER_IN_TYPE")}}");
                return;
            }
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_TYPE")}}", "", function () {
                hideConfirmDialog();
                var mydata = {type_id_list:typeIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/deleteParameterType",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                        }  else {
                            $("#gridTypeList").bootstrapTable('refresh');
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
        };

        var deleteParameter = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_PARAMETER")}}", "", function () {
                hideConfirmDialog();
                var selectedParameter = $("#gridParameterList").bootstrapTable('getSelections');

                var parameterIdList = new Array();
                $.each(selectedParameter, function(i, para) {
                    parameterIdList.push(para.row_id);
                });
                var mydata = {para_id_list:parameterIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/deleteParameter",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            $("#gridParameterList").bootstrapTable('refresh');
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
        };

        var currentMaintainTypeId = null;
        var isNewType = false;
        var newType = function() {
            $("#tbxTypeName").val("");
            $("#tbxTypeDescription").val("");
            $("#typeDetailMaintainDialogTitle").text("{{trans("messages.MSG_NEW_TYPE")}}");
            $("#typeDetailMaintainDialog").modal('show');
            currentMaintainTypeId = null;
            isNewType = true;
        };

        var updateType = function(typeId) {
            var allTypeList = $("#gridTypeList").bootstrapTable('getData');
            $.each(allTypeList, function(i, type) {
                if(type.row_id == typeId) {
                    $("#tbxTypeName").val(type.parameter_type_name);
                    $("#tbxTypeDescription").val(type.parameter_type_desc);
                    return false;
                }
            });

            $("#typeDetailMaintainDialogTitle").text("{{trans("messages.MSG_EDIT_TYPE")}}");
            $("#typeDetailMaintainDialog").modal('show');
            currentMaintainTypeId = typeId;
            isNewType = false;
        };

        var SaveTypeMaintain = function() {
            var typeName = $("#tbxTypeName").val();

            var typeList = $("#gridTypeList").bootstrapTable('getData');
            var nameCheck = true;
            $.each(typeList, function(i, existType) {
                if(isNewType) {
                    if(existType.parameter_type_name.toUpperCase() == typeName.toUpperCase()) {
                        nameCheck = false;
                        return false;
                    }
                } else {
                    if(existType.parameter_type_name.toUpperCase() == typeName.toUpperCase() && existType.row_id != currentMaintainTypeId) {
                        nameCheck = false;
                        return false;
                    }
                }
            });
            if(!nameCheck) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_TYPE_NAME_EXIST")}}");
                return false;
            }


            var typeDesc = $("#tbxTypeDescription").val();
            if(typeName == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var mydata = {
                isNew:'Y',
                typeId:-1,
                type_name:typeName,
                type_desc:typeDesc
            };
            if(!isNewType) {
                mydata.isNew = 'N';
                mydata.typeId = currentMaintainTypeId;
            }
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "platform/saveParameterType",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                    }  else {
                        $("#gridTypeList").bootstrapTable('refresh');
                        $("#gridParameterList").bootstrapTable('refresh');
                        $("#typeDetailMaintainDialog").modal('hide');
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
        };

        var currentMaintainParameterId = null;
        var isNewParameter = false;
        var newParameter = function() {
            $("#tbxParameterName").val("");
            $("#tbxParameterValue").val("");
            $("#parameterDetailMaintainDialogTitle").text("{{trans("messages.MSG_NEW_PARAMETER")}}");
            $("#parameterDetailMaintainDialog").modal('show');
            currentMaintainParameterId = null;
            isNewParameter = true;
        };

        var updateParameter = function(paraId) {
            var allParameterList = $("#gridParameterList").bootstrapTable('getData');
            $.each(allParameterList, function(i, para) {
                if(para.row_id == paraId) {
                    $("#ddlParameterTypeList").val(para.parameter_type_row_id);
                    $("#tbxParameterName").val(para.parameter_name);
                    $("#tbxParameterValue").val(para.parameter_value);
                    return false;
                }
            });

            $("#parameterDetailMaintainDialogTitle").text("{{trans("messages.MSG_EDIT_PARAMETER")}}");
            $("#parameterDetailMaintainDialog").modal('show');
            currentMaintainParameterId = paraId;
            isNewParameter = false;
        };

        var SaveParameterMaintain = function() {
            var paraTypeId = $("#ddlParameterTypeList").val();
            var paraName = $("#tbxParameterName").val();
            var paraValue = $("#tbxParameterValue").val();
            if(paraName == "" || paraTypeId == "" || paraValue == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var parameterList = $("#gridParameterList").bootstrapTable('getData');
            var nameCheck = true;
            $.each(parameterList, function(i, existParam) {
                if(existParam.parameter_type_row_id == paraTypeId) {
                    if(isNewParameter) {
                        if(existParam.parameter_name.toUpperCase() == paraName.toUpperCase()) {
                            nameCheck = false;
                            return false;
                        }
                    } else {
                        if(existParam.parameter_name.toUpperCase() == paraName.toUpperCase() && existParam.row_id != currentMaintainParameterId) {
                            nameCheck = false;
                            return false;
                        }
                    }
                }
            });
            if(!nameCheck) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_PARAMETER_NAME_EXIST_IN_TYPE")}}");
                return false;
            }

            var mydata = {
                isNew:'Y',
                paraId:-1,
                type_id:paraTypeId,
                para_name:paraName,
                para_value:paraValue
            };
            if(!isNewParameter) {
                mydata.isNew = 'N';
                mydata.paraId = currentMaintainParameterId;
            }
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "platform/saveParameter",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                    }  else {
                        $("#gridParameterList").bootstrapTable('refresh');
                        $("#parameterDetailMaintainDialog").modal('hide');
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
        };

        var RefreshTypeList = function () {
            var allTypeList = $("#gridTypeList").bootstrapTable('getData');
            var htmlStr = "";
            $.each(allTypeList, function (j, type) {
                htmlStr += "<option value='" + type.row_id + "'>" + type.parameter_type_name + "</option>";
            });
            $("#ddlParameterTypeList").html(htmlStr);
        };

    </script>
@endsection

@section('dialog_content')
    <div id="typeDetailMaintainDialog" class="modal fade" >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="typeDetailMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table style="width: 100%">
                        <tr>
                            <td>{{trans("messages.PARAMETER_TYPE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxTypeName"
                                       id="tbxTypeName" value="" class="form-control"/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.DESCRIPTION")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxTypeDescription"
                                       id="tbxTypeDescription" value="" class="form-control"/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SaveTypeMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="parameterDetailMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="parameterDetailMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table style="width: 100%">
                        <tr>
                            <td>{{trans("messages.PARAMETER_TYPE_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <select id="ddlParameterTypeList" name="ddlParameterTypeList" class="form-control">

                                </select>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.PARAMETER_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxParameterName" class="form-control"
                                       id="tbxParameterName" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.PARAMETER_VALUE")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxParameterValue" class="form-control"
                                       id="tbxParameterValue" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SaveParameterMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection

