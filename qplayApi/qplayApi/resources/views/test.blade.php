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
    {{--<script src="http://crypto-js.googlecode.com/svn/tags/3.0.2/build/rollups/hmac-sha256.js"></script>--}}
    {{--<script src="http://crypto-js.googlecode.com/svn/tags/3.0.2/build/components/enc-base64-min.js"></script>--}}
    <form action="v101/qplay/getSecturityList" method="POST">
        <input type="hidden" name="_token" value="{{$csrf_token}}">
        <input type="button" value="getSecturityList" onclick="getSecturityList()">
        <input type="button" value="register" onclick="register()">
        <input type="button" value="isRegister" onclick="isRegister()">
        <input type="button" value="login" onclick="login()">
        <input type="button" value="logout" onclick="logout()">
        <br/><br/>
        <input type="button" value="checkAppVersion" onclick="checkAppVersion()">
        <input type="button" value="getAppList" onclick="getAppList()">
        <br/><br/>
        <input type="button" value="getMessageList" onclick="getMessageList()">
        <input type="button" value="getMessageDetail" onclick="getMessageDetail()">
        <input type="button" value="updateMessage" onclick="updateMessage()">
        <br/><br/>
        <input type="button" value="sendPushToken" onclick="sendPushToken()">
        <input type="button" value="renewToken" onclick="renewToken()">

        <input type="submit" value="Test">

        <div id="result_content"></div>
    </form>
    <script>
        var sectoryKey = 'swexuc453refebraXecujeruBraqAc4e';

        var getSecturityList = function() {
            $.ajax({
                url: "v101/qplay/getSecturityList",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");Moses824
                    request.setRequestHeader("signature", "Moses824");
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
                url: "v101/qplay/register?device_type=android&uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
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
                    request.setRequestHeader("signature", "Moses824");
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
                    request.setRequestHeader("signature", "Moses824");
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
                    request.setRequestHeader("signature", "Moses824");
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
        
        var checkAppVersion = function () {
            //var t = Math.round(new Date().getTime()/1000);
            //var hash = CryptoJS.HmacSHA256(t, "swexuc453refebraXecujeruBraqAc4e");
            //var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
            $.ajax({
                url: "v101/qplay/checkAppVersion?package_name=benq.qplay&device_type=android&version_code=101",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");//request.setRequestHeader("signature", "IR3bipdmUxPsGFCg94CWunAdVineHFBXiRQJdN3HcrQ=");
                    request.setRequestHeader("signature-time", "1467699291");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
        
        var getAppList = function () {
            $.ajax({
                url: "v101/qplay/getAppList?uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "5779f5cc97cf9");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var getMessageList = function () {
            $.ajax({
                url: "v101/qplay/getMessageList?uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "5779f5cc97cf9");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var getMessageDetail = function () {
            $.ajax({
                url: "v101/qplay/getMessageDetail?uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20&message_row_id=1",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "5779f5cc97cf9");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var updateMessage = function () {
            $.ajax({
                url: "v101/qplay/updateMessage?uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20&message_row_id=1&message_type=news&status=read",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "5779f5cc97cf9");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var sendPushToken = function () {
            $.ajax({
                url: "v101/qplay/sendPushToken?uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20&app_key=qplay&device_type=android",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "5779f5cc97cf9");
                    request.setRequestHeader("push-token", "test_token");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var renewToken = function () {
            $.ajax({
                url: "v101/qplay/renewToken?uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "577ca0d79cf67");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("version_code:" + d.content.version_code + "</br>"
                            + "download_url" + d.content.download_url);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

    </script>
@endsection


