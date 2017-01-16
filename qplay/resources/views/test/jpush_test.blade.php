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
    </style>
    <div id="toolbar">
        <a class="btn btn-primary" href="#" id="btnNewMessage" onclick="return doTest();">
            Test
        </a>
    </div>

    <input type="text" data-clear-btn="true"  name="tbxRegistrationId" class="form-control" placeholder="Registration ID"
           id="tbxRegistrationId" value=""  />
    <input type="text" data-clear-btn="true" name="tbxTag" class="form-control" placeholder="Tag"
           id="tbxTag" value=""  />

    <fieldset>
        <legend>Device API</legend>
        <input type="radio" name="radioGroupApis" id="rdoGetDevices"
               value="GetDevices" checked />Get Devices &nbsp;&nbsp;
        <input type="radio" name="radioGroupApis" id="rdoGetTags"
               value="GetTags" />Get Tags &nbsp;&nbsp;
        <input type="radio" name="radioGroupApis" id="rdoIsDeviceInTag"
               value="IsDeviceInTag" />Is Device In Tag &nbsp;&nbsp;
        <input type="radio" name="radioGroupApis" id="rdoAddDevicesToTag"
               value="AddDevicesToTag" />Add Devices To Tag &nbsp;&nbsp;

    </fieldset>

    <fieldset>
        <legend>Result</legend>
        <div id="apiResult">

        </div>
    </fieldset>

    <script>
        var doTest = function() {
            $("#apiResult").html();

            var mydata =
            {
                Api:$('input[name="radioGroupApis"]:checked').val(),
                RegistrationId: $("#tbxRegistrationId").val(),
                Tag: $("#tbxTag").val()
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
                    showResult("Failed", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });

            return false;
        }
        
        var showResult = function (result, content) {
            var resultClass = "resultError";
            if(result == "Success") {
                resultClass = "resultSuccess";
            }
            $("#apiResult").removeClass("resultSuccess resultError").addClass(resultClass).html("<h3>" + result + "</h3>" + $.toJSON(content));
        }

    </script>
@endsection

