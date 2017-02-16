@include("layouts.lang")
<?php
use Illuminate\Support\Facades\Input;
$menu_name = "SYS_PROJECT_MAINTAIN";
$input = Input::get();
$projectId = "";
$projectInfo = null;
$projectId = $input["project_id"];
$projectInfo = \App\lib\CommonUtil::getProjectInfoById($projectId);
?>
@extends('layouts.admin_template')
@section('content')
    <div class="row">
        <div class="col-lg-6 col-xs-6">
            <table style="width: 100%">
                <form id="projectForm" name="projectForm">
                    <tr>
                        <td>{{trans("messages.PROJECT_CODE")}}:</td>
                        <td style="padding: 10px;">
                            <input type="text" data-clear-btn="true" name="tbxProjectCode" class="form-control"
                                   id="tbxProjectCode" value="{{$projectInfo->project_code}}" disabled />
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.APP_KEY")}}:</td>
                        <td style="padding: 10px;">
                            <table style="width: 100%;">
                                <tr>
                                    <td>
                                        <input type="text" data-clear-btn="true" name="tbxAppKey" class="form-control"
                                               id="tbxAppKey" value="{{$projectInfo->app_key}}" disabled/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.PROJECT_DESCRIPTION")}}:</td>
                        <td style="padding: 10px;">
                            <textarea type="text" data-clear-btn="true" name="tbxProjectDescription" class="form-control"
                                   id="tbxProjectDescription">{{$projectInfo->project_description}}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.PROJECT_MEMO")}}:</td>
                        <td style="padding: 10px;">
                            <textarea type="text" data-clear-btn="true" name="tbxProjectMemo" class="form-control"
                                      id="tbxProjectMemo">{{$projectInfo->project_memo}}</textarea>
                        </td>
                    </tr>
                    <tr>
                        <td>{{trans("messages.PROJECT_PM")}}:</td>
                        <td style="padding: 10px;">
                            <input type="text" data-clear-btn="true" name="tbxProjectPM" class="form-control"
                                   id="tbxProjectPM" value="{{$projectInfo->project_pm}}"/>
                        </td>
                        <td><span style="color: red;">*</span></td>
                    </tr>
                </form>
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
        var projectId = '{{$projectId}}';
        var SaveProject = function() {
             $form = $("#projectForm");
             $form.submit();
        };

         $(function() {

             $("#projectForm").validate({
                rules:{
                    tbxProjectPM:{
                        required:true
                    }
                },
                submitHandler: function(form) {
                    var projectCode = $("#tbxProjectCode").val();
                    var appKey = $("#tbxAppKey").val();
                    var projectPM = $("#tbxProjectPM").val();
                    var mydata =
                    {
                        projectId:projectId,
                        projectCode:projectCode,
                        txbAppKey: appKey,
                        tbxProjectPM: projectPM,
                        tbxProjectDescription: $("#tbxProjectDescription").val(),
                        tbxProjectMemo:  $("#tbxProjectMemo").val()
                    };

                    var mydataStr = $.toJSON(mydata);
                    $.ajax({
                        url: "platform/updateProject",
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
                                projectId = d.new_project_id;
                                showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
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

