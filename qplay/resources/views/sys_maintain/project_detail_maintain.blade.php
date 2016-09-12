@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SYS_PROJECT_MAINTAIN";
$input = Input::get();
$action = $input["action"];
$projectId = "";
$projectInfo = null;
if($action == "U") {
    $projectId = $input["project_id"];
    $projectInfo = \App\lib\CommonUtil::getProjectInfoById($projectId);
}
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table style="width: 100%">
                <tr>
                    <td>{{trans("messages.PROJECT_CODE")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxProjectCode" class="form-control"
                               id="tbxProjectCode" value="@if($action == "U"){{$projectInfo->project_code}}@endif"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.APP_KEY")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxAppKey" class="form-control"
                               id="tbxAppKey" value="@if($action == "U"){{$projectInfo->app_key}}@endif"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
                <tr>
                    <td>{{trans("messages.PROJECT_DESCRIPTION")}}:</td>
                    <td style="padding: 10px;">
                        <textarea type="text" data-clear-btn="true" name="tbxProjectDescription" class="form-control"
                               id="tbxProjectDescription">@if($action == "U"){{$projectInfo->project_description}}@endif</textarea>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.PROJECT_MEMO")}}:</td>
                    <td style="padding: 10px;">
                        <textarea type="text" data-clear-btn="true" name="tbxProjectMemo" class="form-control"
                                  id="tbxProjectMemo">@if($action == "U"){{$projectInfo->project_memo}}@endif</textarea>
                    </td>
                </tr>
                <tr>
                    <td>{{trans("messages.PROJECT_PM")}}:</td>
                    <td style="padding: 10px;">
                        <input type="text" data-clear-btn="true" name="tbxProjectPM" class="form-control"
                               id="tbxProjectPM" value="@if($action == "U"){{$projectInfo->project_pm}}@endif"/>
                    </td>
                    <td><span style="color: red;">*</span></td>
                </tr>
            </table>
        </div>

        <div class="col-lg-6 col-xs-6" >
            <div class="btn-toolbar" role="toolbar" style="float: right;">
                <button type="button" class="btn btn-primary" onclick="SaveProject()">
                    {{trans("messages.SAVE")}}
                </button>
                <a type="button" class="btn btn-default" href="projectMaintain">
                    {{trans("messages.RETURN")}}
                </a>
            </div>
        </div>
    </div>

    <script>
        var pageAction = '{{$action}}';
        var projectId = '{{$projectId}}';
        var SaveProject = function() {
            var projectCode = $("#tbxProjectCode").val();
            var appKey = $("#tbxAppKey").val();
            var projectPM = $("#tbxProjectPM").val();
            if(projectCode == "" || appKey == "" || projectPM == "") {
                showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
                return false;
            }

            var mydata =
            {
                action: pageAction,
                project_id: projectId,
                project_code: projectCode,
                app_key: appKey,
                project_pm: projectPM,
                project_description: $("#tbxProjectDescription").val(),
                project_memo: $("#tbxProjectMemo").val()
            };

            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "platform/saveProject",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}", d.message);
                    }  else {
                        if(pageAction == "N") {
                            pageAction = "U";
                            projectId = d.new_project_id;
                        }
                        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });
        };
    </script>
@endsection

