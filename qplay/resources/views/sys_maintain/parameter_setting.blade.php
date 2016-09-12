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
                <button type="button" class="btn btn-danger" onclick="deleteType()" id="btnDeleteType">
                    {{trans("messages.DELETE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="newType()" id="btnNewType">
                    {{trans("messages.NEW")}}
                </button>
            </div>
            <table id="gridTypeList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarType"
                   data-url="platform/getParameterTypeList" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                    <th data-field="parameter_type_name" data-sortable="true" data-formatter="typeNameFormatter">{{trans("messages.PARAMETER_TYPE_NAME")}}</th>
                    <th data-field="parameter_type_desc" data-sortable="true">{{trans("messages.DESCRIPTION")}}</th>
                </tr>
                </thead>
            </table>
        </div>
        <div class="tab-pane fade" id="tab_content_parameter">
            <!--Parameter-->
            <div id="toolbarParameter">
                <button type="button" class="btn btn-danger" onclick="deleteParameter()" id="btnDeleteParameter">
                    {{trans("messages.DELETE")}}
                </button>
                <button type="button" class="btn btn-primary" onclick="newParameter()" id="btnNewParameter">
                    {{trans("messages.NEW")}}
                </button>
            </div>
            <table id="gridParameterList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarParameter"
                   data-url="platform/getParameterList" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                    <th data-field="parameter_type_name" data-sortable="true">{{trans("messages.PARAMETER_TYPE_NAME")}}</th>
                    <th data-field="parameter_name" data-formatter="parameterNameFormatter" data-sortable="true">{{trans("messages.PARAMETER_NAME")}}</th>
                    <th data-field="parameter_value" data-sortable="true">{{trans("messages.PARAMETER_VALUE")}}</th>
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
            $("#btnDeleteType").hide();
            $('#gridTypeList').on('check.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('uncheck.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('check-all.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('uncheck-all.bs.table', selectedTypeChanged);
            $('#gridTypeList').on('load-success.bs.table', typeDataLoadSuccessed);

            $("#btnDeleteParameter").hide();
            $('#gridParameterList').on('check.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('uncheck.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('check-all.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('uncheck-all.bs.table', selectedParameterChanged);
            $('#gridParameterList').on('load-success.bs.table', selectedParameterChanged);
        });

        var selectedTypeChanged = function (row, $element) {
            var selectedType = $("#gridTypeList").bootstrapTable('getSelections');
            if(selectedType.length > 0) {
                $("#btnDeleteType").show();
                $("#btnNewType").hide();
            } else {
                $("#btnDeleteType").hide();
                $("#btnNewType").show();
            }
        }

        var selectedParameterChanged = function (row, $element) {
            var selectedParameter = $("#gridParameterList").bootstrapTable('getSelections');
            if(selectedParameter.length > 0) {
                $("#btnDeleteParameter").show();
                $("#btnNewParameter").hide();
            } else {
                $("#btnDeleteParameter").hide();
                $("#btnNewParameter").show();
            }
        }
        
        var typeDataLoadSuccessed = function (row, $element) {
            selectedTypeChanged(row, $element);
            RefreshTypeList();
        }

        var deleteType = function() {
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_TYPE")}}", "", function () {
                hideConfirmDialog();
                var selectedType = $("#gridTypeList").bootstrapTable('getSelections');

                var typeIdList = new Array();
                $.each(selectedType, function(i, type) {
                    typeIdList.push(type.row_id);
                });
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
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            $("#gridTypeList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
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
                    if(existType.parameter_type_name == typeName) {
                        nameCheck = false;
                        return false;
                    }
                } else {
                    if(existType.parameter_type_name == typeName && existType.row_id != currentMaintainTypeId) {
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

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
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
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
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
            currentMaintainParameterId = typeId;
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

            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
                hideConfirmDialog();
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
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            $("#gridParameterList").bootstrapTable('refresh');
                            $("#parameterDetailMaintainDialog").modal('hide');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
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

