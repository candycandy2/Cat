@include("layouts.lang")
<?php
    use App\lib\ResultCode;

    $menu_name = "COMPANY_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    
    <div id="toolbar">
        <button id="btnDelete" type="button" class="btn btn-danger" onclick="deleteCompany()">
          {{trans("messages.DELETE")}}
        </button> 
        <button id="btnNew" type="button" class="btn btn-primary" onclick="newCompany()">
            {{trans("messages.NEW")}}
        </button>
    </div>
    <table id="gridCompanyList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
           data-url="companyMaintain/getCompanyList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="false"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="name" data-sortable="true" data-formatter="companyNameFormatter" data-search-formatter="false">{{trans("messages.COMPANY_NAME")}}</th>
            <th data-field="status" data-sortable="true" data-searchable="false" data-formatter="companyStatusFormatter" >{{trans("messages.STATUS")}}</th>
            <th data-field="user_domain" data-sortable="false" data-searchable="false" data-formatter="false" data-visible="false" ></th>
            <th data-field="login_type" data-sortable="false" data-searchable="false" data-formatter="false" data-visible="false" ></th>
            <th data-field="server_ip" data-sortable="false" data-searchable="false" data-formatter="false" data-visible="false" ></th>
            <th data-field="server_port" data-sortable="false" data-searchable="false" data-formatter="false" data-visible="false" ></th>
        </tr>
        </thead>
    </table>

    <script type="text/javascript">

        $(function() {

            var currentMaintainCompanyID = null;
            var isNewCompany = false;

            $delBtn = $("#btnDelete");
            $newBtn = $("#btnNew");
            $gridList = $('#gridCompanyList');
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

        function companyNameFormatter(value, row) {
            return '<a href="#" onclick="updateCompany(' + row.row_id + ')">' + htmlEscape(value) + '</a>';
        };

        function companyStatusFormatter(value, row) {
            if (value == "Y") {
                return "{{trans("messages.ENABLE")}}";
            } else if (value == "N") {
                return "{{trans("messages.DISABLE")}}";
            }
        };

        var newCompany = function() {

            $("#tbxCompanyName").val("");
            $("#tbxServerIP").val("");
            $("#tbxServerPort").val("");
            $('#hideCompanyID').val("");

            currentMaintainCompanyID = null;
            isNewCompany = true;

            $("#companyDetailMaintainDialogTitle").text("{{trans("messages.COMPANY_NEW_DATA")}}");
            $("#companyStatusSetting").hide();
            $("#companyDetailMaintainDialog").modal('show');

        };

        var updateCompany = function(companyID) {

            var allCompanyList = $gridList.bootstrapTable('getData');

            $.each(allCompanyList, function(i, company) {
                if (company.row_id == companyID) {
                    
                    $("#tbxCompanyName").val(company.name);
                    $("#tbxCompanyDomain").val(company.user_domain);
                    $("#tbxLoginType").val(company.login_type);
                    $("#tbxServerIP").val(company.server_ip);
                    $("#tbxServerPort").val(company.server_port);
                    $("#tbxCompanyStatus").val(company.status);
                    $("#hideCompanyID").val(companyID);

                    return false;
                }
            });

            currentMaintainCompanyID = companyID;
            isNewCompany = false;

            $("#companyDetailMaintainDialogTitle").text("{{trans("messages.COMPANY_EDIT_DATA")}}");
            $("#companyStatusSetting").show();
            $("#companyDetailMaintainDialog").modal('show');

        };

        var companyMaintain = function() {

            var rowID = $.trim($("#hideCompanyID").val());
            var companyName = $.trim($("#tbxCompanyName").val());
            var companyDomain = $.trim($("#tbxCompanyDomain").val());
            var loginType = $.trim($("#tbxLoginType").val());
            var serverIP = $.trim($("#tbxServerIP").val());
            var serverPort = $.trim($("#tbxServerPort").val());
            var status = $.trim($("#tbxCompanyStatus").val());

            var currentData = $gridList.bootstrapTable('getData');
            var duplicate = false;

            //Check Data Empty
            if (companyName.length == 0 || companyDomain.length == 0 || serverIP.length == 0) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            //Check Data has Exist
            if (isNewCompany) {

                $.each(currentData, function(i, company) {
                    if (company.name == companyName) {
                        duplicate = true;
                    }
                });

            }

            if (duplicate) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_DATA_HAS_EXIST")}}");
                return false;
            }

            //Call API
            if (isNewCompany) {

                showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {

                    hideConfirmDialog();

                    var mydata = {
                        companyName:    companyName,
                        companyDomain:  companyDomain,
                        loginType:      loginType,
                        serverIP:       serverIP,
                        serverPort:     serverPort
                    };

                    $.ajax({
                        url: "companyMaintain/newCompany",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: $.toJSON(mydata),
                        success: function (d, status, xhr) {

                            if (d.result_code != 1) {

                                //Error
                                if (d.result_code == {{ResultCode::_000920_companyExist}}) {
                                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_DATA_HAS_EXIST")}}");
                                    return false;
                                } else {
                                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_CREATE_COMPANY_FAILED")}}");
                                }

                            } else {

                                //Success
                                $("#gridCompanyList").bootstrapTable('refresh');
                                $("#companyDetailMaintainDialog").modal('hide');

                                showMessageDialog("{{trans("messages.MESSAGE")}}", "{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            }

                        },
                        error: function (e) {

                            if (handleAJAXError(this,e)) {
                                return false;
                            }

                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_CREATE_COMPANY_FAILED")}}", 
                                e.responseText);

                        }
                    });
                });

            } else if (!isNewCompany) {

                showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {

                    hideConfirmDialog();

                    var mydata = {
                        rowID:          rowID,
                        companyName:    companyName,
                        companyDomain:  companyDomain,
                        loginType:      loginType,
                        serverIP:       serverIP,
                        serverPort:     serverPort,
                        status:         status
                    };

                    $.ajax({
                        url: "companyMaintain/updateCompany",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: $.toJSON(mydata),
                        success: function (d, status, xhr) {

                            if (d.result_code != 1) {

                                //Error
                                if (d.result_code == {{ResultCode::_000920_companyExist}}) {
                                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_DATA_HAS_EXIST")}}");
                                    return false;
                                } else {
                                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_UPDATE_COMPANY_FAILED")}}");
                                }

                            } else {

                                //Success
                                $("#gridCompanyList").bootstrapTable('refresh');
                                $("#companyDetailMaintainDialog").modal('hide');

                                showMessageDialog("{{trans("messages.MESSAGE")}}", "{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            }

                        },
                        error: function (e) {

                            if (handleAJAXError(this,e)) {
                                return false;
                            }

                            showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.COMPANY_ERR_CREATE_COMPANY_FAILED")}}", 
                                e.responseText);

                        }
                    });
                });

            }

        }

    </script>

@endsection

@section('dialog_content')
    <div id="companyDetailMaintainDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="companyDetailMaintainDialogTitle"></h1>
                </div>
                <div class="modal-body">
                    <table  width="100%">
                        <tr>
                            <td>{{trans("messages.COMPANY_NAME")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxCompanyName" id="tbxCompanyName">
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.COMPANY_DOMAIN")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxCompanyDomain" id="tbxCompanyDomain">
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.COMPANY_LOGIN_TYPE")}}:</td>
                            <td style="padding: 10px;">
                                <select name="tbxLoginType" id="tbxLoginType" class="form-control" required="required">
                                    <option value="LDAP">LDAP</option>
                                    <option value="API">API</option>
                                </select>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.COMPANY_IP")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxServerIP" id="tbxServerIP">
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans("messages.COMPANY_PORT")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxServerPort" id="tbxServerPort">
                            </td>
                            <td></td>
                        </tr>
                        <tr id="companyStatusSetting">
                            <td>{{trans("messages.STATUS")}}:</td>
                            <td style="padding: 10px;">
                                <select name="tbxCompanyStatus" id="tbxCompanyStatus" class="form-control" required="required">
                                    <option value="Y">{{trans("messages.ENABLE")}}</option>
                                    <option value="N">{{trans("messages.DISABLE")}}</option>
                                </select>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <input type="hidden" id="hideCompanyID">
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="companyMaintain()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
