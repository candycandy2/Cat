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
            <th data-field="created_user_email" data-visible="false">createdUserEmail</th>
            <th data-field="pm_email" data-visible="false">pmEmail</th>
            <th data-field="project_code" data-align="center" data-sortable="true" data-width="50px" data-formatter="editProjectFormatter" data-search-formatter="false">{{trans("messages.PROJECT_CODE")}}</th>
            <th data-field="app_key" data-sortable="true">{{trans("messages.APP_KEY")}}</th>
            <th data-field="secret_key" data-sortable="true" data-class="grid_warp_column">Secret Key</th>
            <th data-field="project_pm" data-sortable="true">{{trans("messages.PROJECT_PM")}}</th>
            <th data-field="app_row_id" data-sortable="false" data-searchable="false" data-width="200px" data-formatter="appMaintainFormatter" >{{trans("messages.APP_MAINTAIN")}}</th>
            <th data-field="row_id" data-sortable="false" data-width="200px" data-searchable="false" data-formatter="sendAgainFormatter" >{{trans("messages.SEND_EMAIL")}}</th>
        </tr>
        </thead>
    </table>

@section('dialog_content')
    <div id="newProjectDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newProjectDialogTitle">{{trans('messages.APPLY_APP_KEY')}}</h1>
                </div>
                <div class="modal-body">
                    <form id="projectForm" name="projectForm">
                        <table  width="100%">
                            <tr>
                                <td>{{trans("messages.APP_ENG_NAME")}}:</td>

                                <td style="padding: 10px;">
                                    <input type="text" data-clear-btn="true" class="form-control" name="txbAppKey"
                                           id="txbAppKey" value=""  maxlength="50" onchange="toLower(this)" placeholder="{{trans('messages.HINT_APP_KEY')}}" />
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans("messages.PROJECT_PM")}}:</td>
                                <td style="padding: 10px;">
                                    <input type="text" data-clear-btn="true" class="form-control" name="tbxProjectPM"
                                           id="tbxProjectPM" value="" placeholder="{{trans('messages.HINT_PROJECT_PM')}}" />
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                                <td>{{trans("messages.PROJECT_DESCRIPTION")}}:</td>
                                <td style="padding: 10px;">
                                    <textarea class="form-control" name="tbxProjectDescription"
                                           id="tbxProjectDescription" value="" placeholder="{{trans('messages.HINT_PROJECT_DESC')}}"></textarea>
                                </td>
                                <td><span style="color: red;">*</span></td>
                            </tr>
                            <tr>
                             
                            </tr>
                        </table>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button"  id="saveNewProjectBtn" class="btn btn-danger" onclick="saveNewProject()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection

    <script>
        function appMaintainFormatter(value, row) {
            if(typeof(row.app_row_id) == 'undefined' ){
                return '<span class="text-muted" title="{{trans("messages.MSG_NO_CREATED_APP")}}"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span>{{trans("messages.ACTION_MAINTAIN")}}</span>'; 
            }
            else{
                return '<a href="appDetailMaintain?source=develop&app_row_id=' + row.app_row_id + '" title=" {{trans("messages.ACTION_MAINTAIN")}}"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span> {{trans("messages.ACTION_MAINTAIN")}}</a>';
            }
        };

        function sendAgainFormatter(value, row) {
            if(typeof(row.app_row_id) == 'undefined' ){
                return '<span class="text-muted" title="{{trans("messages.MSG_NO_CREATED_APP")}}"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>{{trans("messages.SEND_EMAIL")}}</span>'; 
            }else{
            return '<a href="#" title=" {{trans("messages.SEND_EMAIL")}}"onclick="sendProjectInformation(\''+row.app_key+'\',\''+row.pm_email+'\',\''+row.created_user_email+'\')"><span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> {{trans("messages.SEND_EMAIL")}}</a>';
            }
        };
        function editProjectFormatter(value, row) {
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
                        if(handleAJAXError(this,e)){
                            return false;
                        }
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

        var sendProjectInformation = function(appKey,pmEmail,CreateUserEmail){
            
            var receiver = new Array();
            receiver.push(pmEmail);
            if(pmEmail.toLowerCase() != CreateUserEmail.toLowerCase()){
                    receiver.push(CreateUserEmail);
            }
            
            showConfirmDialog("{{trans('messages.MSG_CONFIRM_SEND_EMAIL')}}", "{{trans('messages.MSG_COMFIRM_SEND_TO_RECIVER')}}", receiver.join('<br>'), function () {
                hideConfirmDialog();
                var mydata =
                    {
                        appKey:appKey,
                        receiver:receiver 
                    };
                var mydataStr = $.toJSON(mydata);
                 $.ajax({
                        url: "platform/sendProjectInformation",
                        dataType: "json",
                        type: "POST",
                        contentType: "application/json",
                        data: mydataStr,
                        success: function (d, status, xhr) {
                            if(d.result_code != 1) {
                                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                                return false;
                            }  else {
                                $("#newProjectDialog").modal('hide');
                                showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                                $("#gridProjectList").bootstrapTable('refresh');
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
        $(function() {
            $('#gridProjectList').on('check.bs.table', selectedChanged);
            $('#gridProjectList').on('uncheck.bs.table', selectedChanged);
            $('#gridProjectList').on('check-all.bs.table', selectedChanged);
            $('#gridProjectList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridProjectList').on('load-success.bs.table', selectedChanged);
            
           
            jQuery.validator.addMethod("appKeyFormat",function(value, element, regexpr) {
                    return regexpr.test(value);
            });

            $("#projectForm").validate({
                rules:{
                    txbAppKey:{
                        required:true,
                        maxlength: 50,
                        appKeyFormat:/^[a-z]+$/,
                    },
                    tbxProjectPM:{
                        required:true
                    },
                    tbxProjectDescription:{
                        required:true
                    }
                },
                submitHandler: function(form) {
                    $("#saveNewProjectBtn").addClass('disabled');
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
                            $("#saveNewProjectBtn").removeClass('disabled');
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
                            if(handleAJAXError(this,e)){
                                return false;
                            }
                              $("#saveNewProjectBtn").removeClass('disabled');
                              showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                        }
                    });
                }
            });
        });

        

    </script>
@endsection