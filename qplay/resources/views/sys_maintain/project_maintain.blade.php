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
        <a class="btn btn-primary" href="projectDetailMaintain?action=N" id="btnNewProject">
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
            <th data-field="state" data-checkbox="true"></th>
            <th data-field="row_id" data-visible="false" data-searchable="false">ID</th>
            <th data-field="with_app" data-visible="false">WithApp</th>
            <th data-field="project_code" data-sortable="true" data-formatter="projectCodeFormatter" data-search-formatter="false">{{trans("messages.PROJECT_CODE")}}</th>
            <th data-field="app_key" data-sortable="true">{{trans("messages.APP_KEY")}}</th>
            <th data-field="project_description" data-sortable="true" data-width="600px" data-class="grid_long_column">{{trans("messages.PROJECT_DESCRIPTION")}}</th>
            <th data-field="project_pm" data-sortable="true" >{{trans("messages.PROJECT_PM")}}</th>
        </tr>
        </thead>
    </table>

    <script>
        function projectCodeFormatter(value, row) {
            return '<a href="projectDetailMaintain?action=U&project_id=' + row.row_id + '">' + value + '</a>';
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
                            $("#gridProjectList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                    }
                });
            });
        };

        $(function() {
            $('#gridProjectList').on('check.bs.table', selectedChanged);
            $('#gridProjectList').on('uncheck.bs.table', selectedChanged);
            $('#gridProjectList').on('check-all.bs.table', selectedChanged);
            $('#gridProjectList').on('uncheck-all.bs.table', selectedChanged);
            $('#gridProjectList').on('load-success.bs.table', selectedChanged);
        });

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

    </script>
@endsection

