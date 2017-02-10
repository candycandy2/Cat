@include("layouts.lang")
<?php
$menu_name = "SYNC_JPUSH_TAGS_TOOL";

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

    <a class="btn btn-primary" href="#" id="btnSync" onclick="return doSync();">Sync</a>
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

        var doSync = function() {
            $("#apiResult").html();

            var mydata =
            {
            };

            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "tool/syncJpushTags",
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

    </script>
@endsection

