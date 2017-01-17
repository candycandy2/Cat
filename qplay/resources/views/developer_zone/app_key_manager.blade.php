@include("layouts.lang")
<?php
$menu_name = "APP_KEY_MANAGER";
?>
@extends('layouts.admin_template')
@section('content')
    <div id="toolbar">
        <button type="button" class="btn btn-danger" style="display: none;" onclick="deleteProject()" id="btnDeleteProject">
            {{trans("messages.DELETE")}}
        </button>
        <a class="btn btn-primary" id="btnNewProject" onclick="newProject()">
            {{trans("messages.NEW")}}
        </a>
    </div>
    <table id="gridProjectList" class="bootstrapTable" data-toggle="table" data-toolbar="#toolbar"
           data-url="developer/getProjectList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true"  data-sortable="true"
           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
           data-click-to-select="false" data-single-select="false">
        <thead>
        <tr>
           {{--  <th data-field="state" data-checkbox="true"></th> --}}
            <th data-field="row_id" data-visible="false" data-searchable="false">ID</th>
            {{-- <th data-field="with_app" data-visible="false">WithApp</th> --}}
            <th data-field="project_code" data-sortable="true" data-search-formatter="false">{{trans("messages.PROJECT_CODE")}}</th>
            <th data-field="app_key" data-sortable="true">{{trans("messages.APP_KEY")}}</th>
            <th data-field="secret_key" data-sortable="true">{{trans("messages.SECRET_KEY")}}</th>
            <th data-field="app_row_id" data-sortable="false"  data-width="100px" data-formatter="customApiFormatter" >Custom Api</th>
            <th data-field="row_id" data-sortable="false"  data-width="100px" data-formatter="sendAgainFormatter" >Send To Me</th>
           {{--  <th data-field="project_description" data-visible="false" data-sortable="true" data-width="600px" data-class="grid_long_column">{{trans("messages.PROJECT_DESCRIPTION")}}</th>
            <th data-field="project_pm" data-visible="false" data-sortable="true" >{{trans("messages.PROJECT_PM")}}</th> --}}
        </tr>
        </thead>
    </table>

    <script>
        function customApiFormatter(value, row) {
            return '<a class="btn btn-default" href="customApiMaintain?app_row_id=' + row.app_row_id + '">Maintain</a>';
        };

        function sendAgainFormatter(value, row) {
            return '<a class="btn btn-success" href="customApiMaintain?app_row_id=' + row.app_row_id + '">Send Again</a>';
        };

        var newProject = function() {
            $("#tbxAppKey").val("");
            $("#newProjectDialog").modal('show');
        };
        var saveNewProject = function(){

        };
    </script>
@endsection

@section('dialog_content')
    <div id="newProjectDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newProjectDialogTitle">New App Key</h1>
                </div>
                <div class="modal-body">
                    <table  width="100%">
                        <tr>
                            <td>{{trans("messages.APP_KEY")}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxAppKey"
                                       id="tbxAppKey" value=""/>
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
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveNewProject()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection