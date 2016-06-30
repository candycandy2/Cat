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
        <input type="button" value="getSecturityList" onclick="getSecturityList()">
        <input type="button" value="register" onclick="register()">
        <input type="button" value="isRegister" onclick="isRegister()">
        <input type="button" value="login" onclick="login()">
        <input type="button" value="logout" onclick="logout()">
        <input type="submit" value="Test">

        <div id="result_content"></div>
    </form>
    <script>
        var getSecturityList = function() {
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
                    $("#result_content").html("security_level:" +  d.security_level + "<br/>"
                            + "content: " + d.content);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };
        
        var register = function () {
            $.ajax({
                url: "v101/qplay/register?uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "99999");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", "Qisda");
                    request.setRequestHeader("loginid", "Moses.Zhu");
                    request.setRequestHeader("password", "111");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("token_valid:" +  d.token_valid + "<br/>"
                            + "content: <br/> uuid: " + d.content.uuid + "<br/>"
                            + "redirect-uri: " + d.content.redirect_uri + "<br/>"
                            + "token: " + d.content.token);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
        
        var isRegister = function () {
            $.ajax({
                url: "v101/qplay/isRegister?uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "9999999");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("is_register: " + d.content.is_register);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var login = function () {
            $.ajax({
                url: "v101/qplay/login?uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "99999");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", "Qisda");
                    request.setRequestHeader("loginid", "Moses.Zhu");
                    request.setRequestHeader("password", "111");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("token_valid:" +  d.token_valid + "<br/>"
                            + "content: <br/> uuid: " + d.content.uuid + "<br/>"
                            + "redirect-uri: " + d.content.redirect_uri + "<br/>"
                            + "token: " + d.content.token + "<br/>"
                            + "security_updated_at: " + d.content.security_updated_at);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
        
        var logout = function () {
            $.ajax({
                url: "v101/qplay/logout?loginid=Moses.Zhu&domain=Qisda&uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "99999");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("uuid:" + d.content.uuid);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
    </script>
@endsection


