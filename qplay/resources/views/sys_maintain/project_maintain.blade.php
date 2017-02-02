@include("layouts.lang")
<?php
$menu_name = "SYS_PROJECT_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    <div id="toolbar">
        <button type="button" class="btn btn-danger" style="display: none;" onclick="deleteProject()" id="btnDeleteProject">
            {{trans("messages.DELETE")}}
        </button>
        <a class="btn btn-primary" onclick="newProject()" id="btnNewProject">
            {{trans("messages.NEW")}}
        </a>
    </div>
    <table id="gridProjectList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
           data-url="platform/getProjectList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
            <th data-field="row_id" data-visible="false" data-searchable="false">ID</th>
            <th data-field="with_app" data-visible="false">WithApp</th>
            <th data-field="app_key" data-sortable="true" data-width="20%">{{trans("messages.APP_KEY")}}</th>
            <th data-field="project_code" data-sortable="true" data-formatter="projectCodeFormatter" data-width="10%" data-search-formatter="false">{{trans("messages.PROJECT_CODE")}}</th>
            <th data-field="secret_key" data-sortable="true">Secret Key</th>
            <th data-field="project_pm" data-sortable="true">{{trans("messages.PROJECT_PM")}}</th>
            <th data-field="app_row_id" data-sortable="false" data-formatter="appMaintainFormatter" >{{trans("messages.APP_MAINTAIN")}}</th>
            <th data-field="row_id" data-sortable="false"   data-width="10%" data-formatter="sendAgainFormatter" >{{trans("messages.SEND_TO_ME")}}</th>
        </tr>
        </thead>
    </table>

@section('dialog_content')
    <div id="newProjectDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newProjectDialogTitle">New App Key</h1>
                </div>
                <div class="modal-body">
                    <form id="projectForm" name="projectForm">
                        <table  width="100%">
                            <tr>
                                <td>{{trans("messages.APP_KEY")}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" data-clear-btn="true" class="form-control" name="txbAppKey"
                                           id="txbAppKey" value="" onchange="toLower(this)"/>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans("messages.PROJECT_PM")}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" data-clear-btn="true" class="form-control" name="tbxProjectPM"
                                           id="tbxProjectPM" value=""/>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans("messages.PROJECT_DESCRIPTION")}}:</td>
                                <td style="padding: 10px;">
                                    <textarea class="form-control" name="tbxProjectDescription"
                                           id="tbxProjectDescription" value=""></textarea>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td colspan = "2">
                                    <p>Please input the project name you want to applied.</br>
                                    1.Only allowed to fill in the English alphabet.</br>
                                    2.The character is non-sentitive, Capital letters will be
                                    converted to lowercase English letters.</p>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveNewProject()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection

    <script>
        function appMaintainFormatter(value, row) {
            return '<a class="btn btn-default" href="appDetailMaintain?source=develop&app_row_id=' + row.app_row_id + '">{{trans("messages.ACTION_MAINTAIN")}}</a>';
        };

        function sendAgainFormatter(value, row) {
            return '<a class="btn btn-success" href="appDetailMaintain?app_row_id=' + row.app_row_id + '">{{trans("messages.ACTION_SEND")}}</a>';
        };
        function projectCodeFormatter(value, row) {
            return '<a href="projectDetailMaintain?project_id=' + row.row_id + '">' + value + '</a>';
        };

        var toLower = function (c) {
            $(c).val($(c).val().toLowerCase());
        };

        var saveNewProject = function(){
            $form = $("#projectForm");
            $form.submit();
        };

        var newProject = function() {
            $("#txbAppKey").val("");
            $("#tbxProjectPM").val("");
            $("#tbxProjectDescription").val("");
            $("#newProjectDialog").find('label.error').hide();
            $("#newProjectDialog").modal('show');
        };

        var deleteProject = function() {
            var selectProjects = $("#gridProjectList").bootstrapTable('getSelections');
            var check = true;
            $.each(selectProjects, function (i, project) {
                if(project.with_app == 'Y') {
                    check = false;
                    return false;
                }
            });
            if(!check) {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.ERR_PROJECT_EXIST_APP")}}");
                return false;
            }

            var confirmStr = "";
            $.each(selectProjects, function(i, project) {
                confirmStr += project.project_code + "&nbsp;&nbsp;&nbsp;" + project.app_key + "<br/>";
            });
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_PROJECT")}}", confirmStr, function () {
                hideConfirmDialog();

                var projectIdList = new Array();
                $.each(selectProjects, function(i, project) {
                    projectIdList.push(project.row_id);
                });
                var mydata = {project_id_list:projectIdList};
                var mydataStr = $.toJSON(mydata);
                $.ajax({
                    url: "platform/deleteProject",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                        }  else {
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                            $("#gridProjectList").bootstrapTable('refresh');
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        var selectedChanged = function (row, $element) {
            var selectedProjects = $("#gridProjectList").bootstrapTable('getSelections');
            if(selectedProjects.length > 0) {
                $("#btnNewProject").fadeOut(300, function() {
                    $("#btnDeleteProject").fadeIn(300);
                });
            } else {
                $("#btnDeleteProject").fadeOut(300, function() {
                    $("#btnNewProject").fadeIn(300);
                });
            }
        }


        $(function() {
            $('#gridProjectList').on('check.bs.table', selectedChanged);
            $('#gridProjectList').on('uncheck.bs.table', selectedChanged);
            $('#gridProjectList').on('check-all.bs.table', selectedChanged);
            $('#gridProjectList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridProjectList').on('load-success.bs.table', selectedChanged);


            $("#projectForm").validate({
                rules:{
                    txbAppKey:{
                        required:true
                    },
                    tbxProjectPM:{
                        required:true
                    }
                },
                submitHandler: function(form) {
                    var mydata =
                    {
                        txbAppKey: $("#txbAppKey").val(),
                        tbxProjectPM: $("#tbxProjectPM").val(),
                        tbxProjectDescription: $("#tbxProjectDescription").val(),
                    };
                    var mydataStr = $.toJSON(mydata);
                  $("#gridProjectList").bootstrapTable('refresh');
                    $.ajax({
                        url: "platform/newProject",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: mydataStr,
                        success: function (d, status, xhr) {
                            if(d.result_code != 1) {
                                $('label.error').remove();
                                if(d.result_code == '999001'){
                                    for(var key in d.message){
                                            $('#' + key).after('<label for="' + key + '" generated="true" class="error" style="display: inline-block;">' + d.message[key] + '</label>');
                                    }
                                }else{
                                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                                }
                                return false;
                            }  else {
                                $("#newProjectDialog").modal('hide');
                                showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                                $("#gridProjectList").bootstrapTable('refresh');
                            }
                        },
                        error: function (e) {
                              showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                        }
                    });
                }
            });

        });

        

    </script>
@endsection

