@include("layouts.lang")
<?php
$menu_name = "JPUSH_TEST";

?>
@extends('layouts.admin_template')
@section('content')
    <style>
        input { margin: 10px; }
        fieldset { margin: 20px; }
        .resultSuccess { color: green; }
        .resultError { color: red; }
        .radioButtonsHolder { padding: 10px; }
    </style>

    <fieldset>
        <legend>Device API</legend>

        <input type="text" data-clear-btn="true"  name="tbxDeviceApiRegistrationId" class="form-control" placeholder="Registration ID"
               id="tbxDeviceApiRegistrationId" value=""  />
        <input type="text" data-clear-btn="true" name="tbxDeviceApiTag" class="form-control" placeholder="Tag"
               id="tbxDeviceApiTag" value=""  />
        <div class="radioButtonsHolder">
            <input type="radio" name="rgDeviceApis" id="rdoGetDevices"
                   value="GetDevices" checked />Get Devices &nbsp;&nbsp;
            <input type="radio" name="rgDeviceApis" id="rdoGetTags"
                   value="GetTags" />Get Tags &nbsp;&nbsp;
            <input type="radio" name="rgDeviceApis" id="rdoIsDeviceInTag"
                   value="IsDeviceInTag" />Is Device In Tag &nbsp;&nbsp;
            <input type="radio" name="rgDeviceApis" id="rdoAddDevicesToTag"
                   value="AddDevicesToTag" />Add Devices To Tag &nbsp;&nbsp;
            <a class="btn btn-primary" href="#" id="btnTestDeviceApi" onclick="return doTestDeviceApi();">Test</a>
        </div>

    </fieldset>

    <fieldset>
        <legend>Schedule API</legend>

        <div class="input-group date form_datetime" data-date="" data-date-format="yyyy-MM-dd hh:ii" data-link-format="yyyy-mm-dd hh:ii"
             data-link-field="tbxScheduleDate" >
            <input class="form-control" size="16" type="text" value="" readonly placeholder="Schedule Time">
            <span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>
        </div>

        <input type="hidden" id="tbxScheduleDateTime" value="" /><br/>
        <input type="text" data-clear-btn="true"  name="tbxScheduleApiScheduleName" class="form-control" placeholder="Schedule Name"
               id="tbxScheduleApiScheduleName" value=""  />
        <input type="text" data-clear-btn="true" name="tbxScheduleApiRegistrationId" class="form-control" placeholder="Registration Id"
               id="tbxScheduleApiRegistrationId" value=""  />
        <input type="text" data-clear-btn="true" name="tbxScheduleApiMessage" class="form-control" placeholder="Message"
               id="tbxScheduleApiMessage" value=""  />
        <input type="text" data-clear-btn="true" name="tbxScheduleApiScheduleId" class="form-control" placeholder="Schedule Id"
               id="tbxScheduleApiScheduleId" value=""  />
        <div class="radioButtonsHolder">
            <input type="radio" name="rgScheduleApis" id="rdoCreateSingleSchedule"
                   value="CreateSingleSchedule" checked />Create Single Schedule &nbsp;&nbsp;
            <input type="radio" name="rgScheduleApis" id="rdoGetSchedules"
                   value="GetSchedules" />Get Schedules &nbsp;&nbsp;
            <a class="btn btn-primary" href="#" id="btnTestScheduleApi" onclick="return doTestScheduleApi();">Test</a>
        </div>

    </fieldset>

    <fieldset>
        <legend>Result</legend>
        <div id="apiResult">

        </div>
    </fieldset>

    <script>
        var showResult = function (result, content) {
            var resultClass = "resultError";
            if(result == "Success") {
                resultClass = "resultSuccess";
            }
            $("#apiResult").removeClass("resultSuccess resultError").addClass(resultClass).html("<h3>" + result + "</h3>" + $.toJSON(content));
        }

        var doTestDeviceApi = function() {
            $("#apiResult").html();

            var mydata =
            {
                Api:$('input[name="rgDeviceApis"]:checked').val(),
                RegistrationId: $("#tbxDeviceApiRegistrationId").val(),
                Tag: $("#tbxDeviceApiTag").val()
            };

            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "test/jpushTest",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showResult("Error",d.content);
                    }  else {
                        showResult("Success",d.content);
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showResult("Failed", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });

            return false;
        }

        var doTestScheduleApi = function() {
            $("#apiResult").html();

            var mydata =
            {
                Api:$('input[name="rgScheduleApis"]:checked').val(),
                ScheduleName: $("#tbxScheduleApiScheduleName").val(),
                ScheduleTime: $('.form_datetime').datetimepicker("getDate").getTime(),
                Message: $("#tbxScheduleApiMessage").val(),
                RegistrationId: $("#tbxScheduleApiRegistrationId").val(),
                ScheduleId: $("#tbxScheduleApiScheduleId").val()
            };

            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "test/jpushTest",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showResult("Error",d.content);
                    }  else {
                        showResult("Success",d.content);
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showResult("Failed", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });

            return false;
        }

        $(function() {
            $('.form_datetime').datetimepicker({
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                showMeridian: 1,
                format: "yyyy-mm-dd hh:ii"
            });
        });

    </script>
@endsection

