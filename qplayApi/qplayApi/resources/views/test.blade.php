@extends('app')

@section('content')
    <?php
    $csrf_token = csrf_token();
    $form = <<<FORM
        <head>
            <title>Test</title>
        </head>
        <body>
        <form action="v101/qplay/getSecturityList" method="POST">
            <input type="hidden" name="_token" value="{$csrf_token}">
            <input type="button" value="js Test" onclick="Send()">
            <input type="submit" value="Test">
        </form>
        <script>
            var Send = function() {
                alert();
            }
        </script>
        </body>
FORM;
    //echo $form;
            ?>
    <form action="v101/qplay/getSecturityList" method="POST">
        <input type="hidden" name="_token" value="{{$csrf_token}}">
        <input type="button" value="js Test" onclick="Send()">
        <input type="submit" value="Test">
        Secture Level: <div id="security_level"></div>
        <div id="result_content"></div>
    </form>
    <script>
        var Send = function() {
            $.ajax({
                url: "v101/qplay/getSecturityList",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#security_level").text(d.security_level);
                    $("#result_content").text(d.content);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
    </script>
@endsection


