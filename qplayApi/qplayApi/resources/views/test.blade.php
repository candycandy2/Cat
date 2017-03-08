@extends('testapp')

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
        <input type="text" id="tbxDateTime" /><br />
        yyyy-MM-dd hh:mm:ss<br/>
        <input type="button" value="Get Timestamp(Null for Now)" onclick="getTimeStamp()" />
        <input type="button" value="Get Date(Null for Now)" onclick="getDate()" />
        <input type="button" value="Url Decode" onclick="urlDecode()">

        <div id="timestampResult"></div>

    <br/>
    <br/>
    <textarea id="base64encode" onkeyup="base64encode()"></textarea>
    <textarea id="base64decode" ></textarea>
    <input type="button" value="decode" onclick="base64decode()">

    <br/><br/>
        <script>
            var keyStr = "ABCDEFGHIJKLMNOP" +
                    "QRSTUVWXYZabcdef" +
                    "ghijklmnopqrstuv" +
                    "wxyz0123456789+/" +
                    "=";
            var base64encode = function () {

                var b = $("#base64encode").val();
                $("#base64decode").val($.base64.btoa(escape(b)));
            };

            var base64decode = function () {
                var a = $("#base64decode").val();
                $("#base64encode").val($.base64.atob(a));
            };

            var encode64 = function (input)
            {
                input = escape(input);
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
                do
                {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2))
                    {
                        enc3 = enc4 = 64;
                    }
                    else if (isNaN(chr3))
                    {
                        enc4 = 64;
                    }
                    output = output +
                            keyStr.charAt(enc1) +
                            keyStr.charAt(enc2) +
                            keyStr.charAt(enc3) +
                            keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            }
            
            var urlDecode = function() {
                var s = $("#tbxDateTime").val();
                $("#timestampResult").text(decodeURIComponent(s));
            };

            var getTimeStamp = function() {
                var s = $("#tbxDateTime").val();
                if(s.length == 0) {
                    $("#timestampResult").text(Math.round(new Date().getTime() / 1000));
                } else {
                    $("#timestampResult").text(Math.round(new Date(s).getTime() / 1000));
                }
            };

            var getDate = function() {
                var s = $("#tbxDateTime").val();
                if(s.length == 0) {
                    $("#timestampResult").text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
                } else {
                    var d = new Date();
                    d.setTime(s * 1000);
                    $("#timestampResult").text(d.Format("yyyy-MM-dd hh:mm:ss"));
                }
            };

            Date.prototype.Format = function(fmt) { //author: meizz
                var o = {
                    "M+" : this.getMonth()+1,                 //月份
                    "d+" : this.getDate(),                    //日
                    "h+" : this.getHours(),                   //小时
                    "m+" : this.getMinutes(),                 //分
                    "s+" : this.getSeconds(),                 //秒
                    "q+" : Math.floor((this.getMonth()+3)/3), //季度
                    "S"  : this.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt))
                    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)
                    if(new RegExp("("+ k +")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                return fmt;
            }
        </script>


        <input type="hidden" name="_token" value="{{$csrf_token}}">

        <input type="button" value="isRegister" onclick="isRegister()" />
        <input type="button" value="register" onclick="register()" />
        <input type="button" value="isLogin" onclick="isLogin()" />
        <br/><br/>

        <input type="button" value="login" onclick="login()">
        <input type="button" value="logout" onclick="logout()">
        <input type="button" value="getSecturityList" onclick="getSecturityList()">
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
        <br/><br/>

        <input type="button" value="sendPushMessage" onclick="sendPushMessage()">

        <input type="button" value="sendPushMessageWithHPushWebAPI" onclick="sendPushMessageWithJPushWebAPI()">

        <input type="button" value="updateLastMessageTime" onclick="updateLastMessageTime()">
        <br/><br/>

        <a href="qplayauth_register" >Login</a>

        <form action="v101/qplay/sendPushMessage?lang=en-us&app_key=qplay&need_push=Y" method="POST">
            <input type="text" name="name" id="name" />
            <input type="submit" value="Test">

            <div id="result_content"></div>
        </form>

    <input type="text" id="tbxIP" />
    <input type="button" value="getIpInfo" onclick="getIpInfo()">
    <br/><br/>
    <script>
        var registerUUID = "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20";
        var appSecretKey = <?php echo '"'.Config::get("app.Secret_key").'"' ?>;
        function getSignature(action, signatureTime) {
                if (action === "getTime") {
                    return Math.round(new Date().getTime()/1000);
                } else if (action === "getInBase64") {
                    var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
                    return CryptoJS.enc.Base64.stringify(hash);
                }
        }

        var mosesAndroidUuid = "A000004E11012A9";
        var isLogin = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/isLogin?lang=en-us&uuid=" + mosesAndroidUuid,
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("is_login:" +  d.is_login + "<br/>"
                            + "login_id: " + d.login_id + "<br/>");
                },
                error: function (e) {
                    alert(e);
                }
            });
        };

        var isRegister = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/isRegister?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("is_register: " + d.content.is_register);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };

        var getIpInfo = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/getIpInfo?ip=" + $("#tbxIP").val(),//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("ip info: " + d.content);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
        
        var register = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/register?lang=en-us&device_type=android&uuid=" + "chaosTest3",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", "QGROUP");
                    request.setRequestHeader("loginid", "Moses.Zhu");
                    request.setRequestHeader("password", "Qcs.2012");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    if(d.result_code == 1) {
                        $("#result_content").html("token_valid:" +  d.token_valid + "<br/>"
                                + "content: <br/> uuid: " + d.content.uuid + "<br/>"
                                + "redirect-uri: " + d.content.redirect_uri + "<br/>"
                                + "domain: " + d.content.domain + "<br/>"
                                + "emp_no: " + d.content.emp_no + "<br/>"
                                + "checksum: " + d.content.checksum + "<br/>"
                                + "token: " + d.content.token);
                    }
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var login = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/login?lang=en-us&uuid=" + "chaosTest",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", "QGROUP");
                    request.setRequestHeader("loginid", "Moses.Zhu");
                    request.setRequestHeader("password", "Qcs.2012");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    if(d.result_code == 1) {
                        $("#result_content").html("token_valid:" +  d.token_valid + "<br/>"
                                + "content: <br/> uuid: " + d.content.uuid + "<br/>"
                                + "redirect-uri: " + d.content.redirect_uri + "<br/>"
                                + "token: " + d.content.token + "<br/>"
                                + "domain: " + d.content.domain + "<br/>"
                                + "emp_no: " + d.content.emp_no + "<br/>"
                                + "checksum: " + d.content.checksum + "<br/>"
                                + "security_updated_at: " + d.content.security_updated_at);
                    }
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
        
        var logout = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/logout?lang=en-us&loginid=Moses.Zhu&domain=QCS&uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
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
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/checkAppVersion?lang=en-us&package_name=benq.qplay&device_type=android&version_code=100",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);//request.setRequestHeader("signature", "IR3bipdmUxPsGFCg94CWunAdVineHFBXiRQJdN3HcrQ=");
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
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/getAppList?lang=en-us&uuid=chaosTest",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "580da532d3894");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    var htmlStr = "app_category_list:<br/>";
                    $.each(d.content.app_category_list, function(i, c) {
                        htmlStr += "category_id:[" + c.category_id + "], ";
                        htmlStr += "app_category:[" + c.app_category + "], ";
                        htmlStr += "sequence:[" + c.sequence + "]<br/>";
                    });
                    htmlStr += "app_list:<br/>";
                    $.each(d.content.app_list, function(i, a) {
                        htmlStr += "app_code:[" + a.app_code + "], ";
                        htmlStr += "package_name:[" + a.package_name + "], ";
                        htmlStr += "app_category:[" + a.app_category + "], ";
                        htmlStr += "version:[" + a.version + "], ";
                        htmlStr += "version_name:[" + a.version_name + "], ";
                        htmlStr += "security_level:[" + a.security_level + "], ";
                        htmlStr += "avg_score:[" + a.avg_score + "], ";
                        htmlStr += "user_score:[" + a.user_score + "], ";
                        htmlStr += "sequence:[" + a.sequence + "], ";
                        htmlStr += "url:[" + a.url + "], ";
                        htmlStr += "icon_url:[" + a.icon_url + "]<br/>";
                    });
                    htmlStr += "multi_lang:<br/>";
                    $.each(d.content.multi_lang, function(i, m) {
                        htmlStr += "lang:[" + m.lang + "], ";
                        htmlStr += "app_name:[" + m.app_name + "], ";
                        htmlStr += "app_summary:[" + m.app_summary + "], ";
                        htmlStr += "app_description:[" + m.app_description + "], <br/>";
                        htmlStr += "pic_list:<br/>";
                        $.each(m.pic_list, function(j, p) {
                            htmlStr += "pic_type:[" + p.pic_type + "], ";
                            htmlStr += "pic_url:[" + p.pic_url + "], ";
                            htmlStr += "sequence_by_type:[" + p.sequence_by_type + "]<br/> ";
                        });
                    });
                    $("#result_content").html(htmlStr);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var getSecturityList = function() {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/getSecurityList?lang=en-us&uuid=A1234567890A1234567890&app_key=appqplay",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "579ec219ddc92");
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

        var getMessageList = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/getMessageList?lang=en-us&uuid=chaosTest&overwrite_timestamp=0",
                //url: "v101/qplay/getMessageList?lang=en-us&uuid=chaosTest",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "585d30e887808");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    var htmlStr = "token_valid: " + d.token_valid + "<br/>";
                    htmlStr += "message_count:" + d.content.message_count + "<br/>";
                    htmlStr += "message_list:<br/>";
                    $.each(d.content.message_list, function(i, m) {
                        htmlStr += "message_row_id:[" + m.message_row_id + "], <br/>";
                        htmlStr += "message_title:[" + m.message_title + "], <br/>";
                        htmlStr += "message_type:[" + m.message_type + "], <br/>";
                        htmlStr += "message_text:[" + m.message_text + "], <br/>";
                        htmlStr += "message_html:[" + m.message_html + "], <br/>";
                        htmlStr += "message_url:[" + m.message_url + "], <br/>";
                        htmlStr += "read:[" + m.read + "], <br/>";
                        htmlStr += "message_source:[" + m.message_source + "], <br/>";
                        htmlStr += "source_user:[" + m.source_user + "], <br/>";
                        htmlStr += "read_time:[" + m.read_time + "], <br/>";
                        htmlStr += "create_user:[" + m.create_user + "], <br/>";
                        htmlStr += "create_time:[" + m.create_time + "]<br/><br/>";
                    });
                    $("#result_content").html(htmlStr);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var getMessageDetail = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/getMessageDetail?lang=en-us&uuid=chaosTest&message_send_row_id=262",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "585d30e887808");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    var htmlStr = "token_valid: " + d.token_valid + "<br/>";
                    htmlStr += "message_row_id:[" + d.content.message_row_id + "], <br/>";
                    htmlStr += "message_title:[" + d.content.message_title + "], <br/>";
                    htmlStr += "message_type:[" + d.content.message_type + "], <br/>";
                    htmlStr += "message_text:[" + d.content.message_text + "], <br/>";
                    htmlStr += "message_html:[" + d.content.message_html + "], <br/>";
                    htmlStr += "message_url:[" + d.content.message_url + "], <br/>";
                    htmlStr += "read:[" + d.content.read + "], <br/>";
                    htmlStr += "message_source:[" + d.content.message_source + "], <br/>";
                    htmlStr += "source_user:[" + d.content.source_user + "], <br/>";
                    htmlStr += "read_time:[" + d.content.read_time + "], <br/>";
                    htmlStr += "create_user:[" + d.content.create_user + "], <br/>";
                    htmlStr += "create_time:[" + d.content.create_time + "]<br/><br/>";
                    $("#result_content").html(htmlStr);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var updateMessage = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/updateMessage?lang=en-us&uuid=chaosTest&message_send_row_id=19,257,261&message_type=event&status=read",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "585d30e887808");
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
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/sendPushToken?lang=en-us&uuid=chaosTest&app_key=qplay&device_type=android",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
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
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/renewToken?lang=en-us&uuid=aaaaadasdasdasd",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "5784945d01e24");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("uuid: " + d.content.uuid + "</br>"
                            + "token: " + d.content.token);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var updateLastMessageTime = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/updateLastMessageTime?lang=en-us&uuid=chaosTest&last_update_time=1470100946",
                dataType: "json",
                type: "GET",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("uuid: " + d.content.uuid + "</br>"
                            + "token_valid: " + d.token_valid);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var sendPushMessage = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
//            var mydata = '{"message_title":"System Announcement",' +
//                    '"message_type":"event",' +
//                    '"message_text":"system is down",' +
//                    '"message_html":"",' +
//                    '"message_url":"",' +
//                    '"message_source":"Oracle ERP",' +
//                    '"source_user_id":"QGROUP\\\\Moses.Zhu",' +
//                    '"destination_user_id":["QGROUP\\\\Moses.Zhu","QGROUP\\\\Tim.Zhang"]' +
//                    '}';
            var mydata = {
                need_push: "Y",
                message_title: "JXU1NTRBJXU1NTRB",//"System Announcement",
                template_id:3,
                message_type: "news",
                message_text: "c3lzdGVtIGlzIGRvd24=", //"system is down",
                message_html: "",
                message_url:"",
                message_source:"Oracle ERP",
                source_user_id:"Qgroup\\Moses.Zhu",
                //destination_user_id:["Qgroup\\Moses.Zhu","Qgroup\\Sammi.Yao"],
                destination_user_id:["qisda","benq"],
//                destination_role_id:["Qisda/staff"],
                };
            var mydata = {
                need_push: "Y",
                message_title: "JXU0RjYwJXU0RUVDJXU1OTdEJTBBJXU2MjExJXU1Rjg4JXU1OTdE",//"System Announcement",
                template_id:3,
                message_type: "NEWS",
                message_text: "JTNDYm9keSUyMGxhbmclM0RaSC1UVyUyMGxpbmslM0RibHVlJTIwdmxpbmslM0RwdXJwbGUlMjBzdHlsZSUzRCUyN3RleHQtanVzdGlmeS10cmltJTNBcHVuY3R1YXRpb24lMjclM0UlM0NkaXYlMjBjbGFzcyUzRFdvcmRTZWN0aW9uMSUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tJTBBJTBBVVMlM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMHN0eWxlJTNEJTI3bXNvLW1hcmdpbi10b3AtYWx0JTNBMGNtJTNCbWFyZ2luLXJpZ2h0JTNBMGNtJTNCbWFyZ2luLWJvdHRvbSUzQTEyLjBwdCUzQm1hcmdpbi1sZWZ0JTNBMGNtJTI3JTNFJTNDc3Ryb25nJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMCUwQSUwQXN0eWxlJTNEJTI3Zm9udC1zaXplJTNBMTguMHB0JTNCZm9udC1mYW1pbHklM0ElMjJBcmlhbCUyMiUyQyUyMnNhbnMtc2VyaWYlMjIlM0Jjb2xvciUzQSUyMzY2NjY2NiUyNyUzRTIwMTYlM0Mvc3BhbiUzRSUzQy9zdHJvbmclM0UlM0NzdHJvbmclM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExOC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSUwQSUwQSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjM2NjY2NjYlMjclM0UldTVFNzQldTMwMDIldTMwMTAldTUwOTEldTUyMjkldTVFMzYldThERUYldTMwMTEldTdFN0MldTdFOEMldTU4MDUldTYzMDEldTMwMEMldTZERjEldTVFQTYldTMwMDEldTgxRUEldTc1MzEldTMwMDEldTZCNjEldTZBMDIldTMwMEQldTc2ODQldTY1QzUldTg4NEMldTRFM0IldTVGMzUlM0Mvc3BhbiUzRSUzQy9zdHJvbmclM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LSUwQSUwQWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy1zZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNDYnIlM0UlM0NiciUzRSUzQy9zcGFuJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1zaXplJTNBMTMuNXB0JTNCY29sb3IlM0FyZWQlMjclM0UldTMwMTAldTUwOTEldTUyMjkldTVFMzYldThERUYldTMwMTEldTZERjEldTVFQTYldTY1QzUldTkwNEEldTMwMDEldTRFM0IldTk4NEMldTY1QzUldTkwNEEldTU3MTgldTkwODEldTU0MTEldTdCMkMlM0Mvc3BhbiUzRSUzQ3NwYW4lMjAlMEElMEFsYW5nJTNERU4tVVMlMjBzdHlsZSUzRCUyN2ZvbnQtc2l6ZSUzQTEzLjVwdCUzQmZvbnQtZmFtaWx5JTNBJTIyQXJpYWwlMjIlMkMlMjJzYW5zLXNlcmlmJTIyJTNCY29sb3IlM0FyZWQlMjclM0U3JTNDL3NwYW4lM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMy41cHQlM0Jjb2xvciUzQXJlZCUyNyUzRSV1NUU3NCV1NEU4NiV1RkYwMSUzQy9zcGFuJTNFJTNDc3BhbiUyMCUwQSUwQWxhbmclM0RFTi1VUyUyMHN0eWxlJTNEJTI3Zm9udC1zaXplJTNBMTAuMHB0JTNCZm9udC1mYW1pbHklM0ElMjJBcmlhbCUyMiUyQyUyMnNhbnMtc2VyaWYlMjIlM0Jjb2xvciUzQSUyMzY2NjY2NiUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjBzdHlsZSUzRCUyN21zby1tYXJnaW4tdG9wLWFsdCUzQTBjbSUzQm1hcmdpbi0lMEElMEFyaWdodCUzQTBjbSUzQm1hcmdpbi1ib3R0b20lM0ExMi4wcHQlM0JtYXJnaW4tbGVmdCUzQTBjbSUzQmZvbnQtdmFyaWFudC1saWdhdHVyZXMlM0ElMjBub3JtYWwlM0Jmb250LXZhcmlhbnQtY2FwcyUzQSUyMG5vcm1hbCUzQm9ycGhhbnMlM0ElMjAyJTNCdGV4dC1hbGlnbiUzQXN0YXJ0JTNCd2lkb3dzJTNBJTIwMiUzQi13ZWJraXQtJTBBJTBBdGV4dC1zdHJva2Utd2lkdGglM0ElMjAwcHglM0J3b3JkLXNwYWNpbmclM0EwcHglMjclM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy1zZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFMjAxNiUyMCUzQy9zcGFuJTNFJTNDc3BhbiUyMCUwQSUwQXN0eWxlJTNEJTI3Zm9udC1zaXplJTNBMTAuMHB0JTNCY29sb3IlM0ElMjM2NjY2NjYlMjclM0UldTVFNzQldTMwMTAldTUwOTEldTUyMjkldTVFMzYldThERUYldTMwMTEldTY3MDkldTUxNjgldTY1QjAldTc2ODQldTdEQjIldTdBRDkldTMwMDElM0NzdHJvbmclM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTI3JTNFJXU1ODA1JXU2MzAxJXUzMDBDJXU2REYxJXU1RUE2JXUzMDAxJXU4MUVBJXU3NTMxJXUzMDAxJXU2QjYxJXU2QTAyJXUzMDBEJXU3Njg0JXU2NUM1JXU4ODRDJXU0RTNCJXU1RjM1JTBBJTBBJTNDL3NwYW4lM0UlM0Mvc3Ryb25nJTNFJXVGRjBDJXU1M0M4JXU5NThCJXU3NjdDJXU1MUZBJXU2NkY0JXU1OTFBJXU3Njg0JXU4ODRDJXU3QTBCJXUzMDAxJXU2NkY0JXU1OTFBJXU1MTQzJXU3Njg0JXU1NzE4JXUzMDAxJXU2NkY0JXU1OTFBJXU0RTBEJXU0RTAwJXU2QTIzJXU3Njg0JXU3M0E5JXU2Q0Q1JXUzMDAyJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy0lMEElMEFzZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMHN0eWxlJTNEJTI3bXNvLW1hcmdpbi10b3AtYWx0JTNBMGNtJTNCbWFyZ2luLXJpZ2h0JTNBMGNtJTNCbWFyZ2luLWJvdHRvbSUzQTEyLjBwdCUzQm1hcmdpbi1sZWZ0JTNBMGNtJTNCZm9udC12YXJpYW50LWxpZ2F0dXJlcyUzQSUyMCUwQSUwQW5vcm1hbCUzQmZvbnQtdmFyaWFudC1jYXBzJTNBJTIwbm9ybWFsJTNCb3JwaGFucyUzQSUyMDIlM0J0ZXh0LWFsaWduJTNBc3RhcnQlM0J3aWRvd3MlM0ElMjAyJTNCLXdlYmtpdC10ZXh0LXN0cm9rZS13aWR0aCUzQSUyMDBweCUzQndvcmQtc3BhY2luZyUzQTBweCUyNyUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2ZvbnQtJTBBJTBBc2l6ZSUzQTEwLjBwdCUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJXU1M0FEJXU1MDI2JXU0RTg2JXU0RTAwJXU4MjJDJXU2NUM1JXU4ODRDJXU1NzE4JXUzMDAxJXU1MjM2JXU1RjBGJXUzMDAxJXU2QkVCJXU3MTIxJXU4QjhBJXU1MzE2JXU4MjA3JXU1RjQ4JXU2MDI3JXU3Njg0JXU4ODRDJXU3QTBCJXU0RTg2JXU1NUNFJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy0lMEElMEFzZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNGJTIwJTNDL3NwYW4lM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jjb2xvciUzQSUyMzY2NjY2NiUyNyUzRSV1NTNBRCV1NTAyNiV1NEUwMCV1NTAwQiV1NEVCQSV1ODFFQSV1NURGMSV1NjVDNSV1ODg0QyV1MzAwMSV1OEY5QiV1ODJFNiV1NjI3RSV1OENDNyV1NjU5OSV1MzAwMSV1NTM3QiV1OTA4NCV1NjYyRiV1NzEyMSV1NkNENSV1OUFENCV1OUE1NyV1NzU3NiV1NTczMCV1NEVCQSV1NjU4NyV1OThBOCV1NTE0OSV1NjIxNiV1N0Y4RSV1OThERiV1NTVDRSUzQy9zcGFuJTNFJTNDc3BhbiUyMCUwQSUwQWxhbmclM0RFTi1VUyUyMHN0eWxlJTNEJTI3Zm9udC1zaXplJTNBMTAuMHB0JTNCZm9udC1mYW1pbHklM0ElMjJBcmlhbCUyMiUyQyUyMnNhbnMtc2VyaWYlMjIlM0Jjb2xvciUzQSUyMzY2NjY2NiUyNyUzRSUzRiUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjBzdHlsZSUzRCUyN21zby1tYXJnaW4tdG9wLWFsdCUzQTBjbSUzQm1hcmdpbi0lMEElMEFyaWdodCUzQTBjbSUzQm1hcmdpbi1ib3R0b20lM0ExMi4wcHQlM0JtYXJnaW4tbGVmdCUzQTBjbSUzQmZvbnQtdmFyaWFudC1saWdhdHVyZXMlM0ElMjBub3JtYWwlM0Jmb250LXZhcmlhbnQtY2FwcyUzQSUyMG5vcm1hbCUzQm9ycGhhbnMlM0ElMjAyJTNCdGV4dC1hbGlnbiUzQXN0YXJ0JTNCd2lkb3dzJTNBJTIwMiUzQi13ZWJraXQtJTBBJTBBdGV4dC1zdHJva2Utd2lkdGglM0ElMjAwcHglM0J3b3JkLXNwYWNpbmclM0EwcHglMjclM0UlM0NzdHJvbmclM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjM2NjY2NjYlMjclM0UldTZCNjEldThGQ0UldThEREYldTg0NTcldTMwMTAldTUwOTEldTUyMjkldTVFMzYldThERUYldTMwMTEldUZGMEMldTkwMzIldTUxNjUldTMwMEMldTUzNEEldTgxRUEldTUyQTkldTRFNEIldTY1QzUldTMwMEQldTMwMEMldTZERjEldTVFQTYlMEElMEEldTRFNEIldTY1QzUldTMwMEQldTMwMEMldTRFM0IldTk4NEMldTRFNEIldTY1QzUldTMwMEQldTMwMEMldTVCOUEldTlFREUldTRFNEIldTY1QzUldTMwMEQldTMwMEMldTgxRUEldTRFM0IldTYwMjcldTY1QzUldTg4NEMldTMwMEQldTc2ODQldTRFMTYldTc1NEMldUZGMDElM0Mvc3BhbiUzRSUzQy9zdHJvbmclM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy0lMEElMEFzZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMHN0eWxlJTNEJTI3bXNvLW1hcmdpbi10b3AtYWx0JTNBMGNtJTNCbWFyZ2luLXJpZ2h0JTNBMGNtJTNCbWFyZ2luLWJvdHRvbSUzQTEyLjBwdCUzQm1hcmdpbi1sZWZ0JTNBMGNtJTNCZm9udC12YXJpYW50LWxpZ2F0dXJlcyUzQSUyMCUwQSUwQW5vcm1hbCUzQmZvbnQtdmFyaWFudC1jYXBzJTNBJTIwbm9ybWFsJTNCb3JwaGFucyUzQSUyMDIlM0J0ZXh0LWFsaWduJTNBc3RhcnQlM0J3aWRvd3MlM0ElMjAyJTNCLXdlYmtpdC10ZXh0LXN0cm9rZS13aWR0aCUzQSUyMDBweCUzQndvcmQtc3BhY2luZyUzQTBweCUyNyUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2ZvbnQtJTBBJTBBc2l6ZSUzQTEwLjBwdCUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJXU4MUVBJXU1REYxJXU2QzdBJXU1QjlBJXU5MDY5JXU1NDA4JXU4MUVBJXU1REYxJXU3Njg0JXU3M0E5JXU2Q0Q1JXUzMDAxJXU4MUVBJXU1REYxJXU5MDc4JXU2NEM3JXU1NTlDJXU2QjYxJXU3Njg0JXU4REVGJXU3RERBJXUzMDAyJXU1NzE4JXU1NEUxJXU2NzA5JXU2NkY0JXU1OTFBJXU3Njg0JXU1RjQ4JXU2MDI3JXU4MjA3JXU4MUVBJXU3NTMxJXU2NjQyJXU5NTkzJXVGRjBDJXU5MDc4JXU2NEM3JXU4OTgxJXU4RERGJXU4NDU3JXU1NzE4JXUzMDAxJXU5MDg0JXU2NjJGJXU0RTJEJXU5MDE0JXU4MTJCJXU5NjhBJXVGRjFCJXU2MjExJXU2MEYzJXU4QjkzJXU0RjYwJXU2NzA5JXU0RTBEJXU0RTAwJXU2QTIzJXU3Njg0JXU2NUM1JXU4ODRDJXUzMDAxJXU0RTBEJTBBJTBBJXU0RTAwJXU2QTIzJXU3Njg0JXU3RjhFJXU1OTdEJXU1NkRFJXU2MUI2JXU4MjA3JXU5QTVBJXU1NTlDJXVGRjBDJXU4QjkzJXU0RjYwJXU0RkREJXU2NzA5JXU2REYxJXU1RUE2JXUzMDAxJXU4MUVBJXU3NTMxJXU3Njg0JXU0RUFCJXU1M0Q3JXVGRjBDJXU1M0M4JXU4MEZEJXU2NEMxJXU2NzA5JXU2NkY0JXU1OTFBJXU2QjYxJXU2QTAyJXU3Njg0JXU2NUM1JXU4ODRDJXU3RDkzJXU5QTU3JXUzMDAyJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy0lMEElMEFzZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMHN0eWxlJTNEJTI3bXNvLW1hcmdpbi10b3AtYWx0JTNBMGNtJTNCbWFyZ2luLXJpZ2h0JTNBMGNtJTNCbWFyZ2luLWJvdHRvbSUzQTEyLjBwdCUzQm1hcmdpbi1sZWZ0JTNBMGNtJTNCZm9udC12YXJpYW50LWxpZ2F0dXJlcyUzQSUyMCUwQSUwQW5vcm1hbCUzQmZvbnQtdmFyaWFudC1jYXBzJTNBJTIwbm9ybWFsJTNCb3JwaGFucyUzQSUyMDIlM0J0ZXh0LWFsaWduJTNBc3RhcnQlM0J3aWRvd3MlM0ElMjAyJTNCLXdlYmtpdC10ZXh0LXN0cm9rZS13aWR0aCUzQSUyMDBweCUzQndvcmQtc3BhY2luZyUzQTBweCUyNyUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2NvbG9yJTNBcmVkJTI3JTNFJXUzMDBDJXU2NUM1JXU4ODRDJXU0RTJEJXU2NzAwJTBBJTBBJXU1OTI3JXU3Njg0JXU2QTAyJXU4REEzJXVGRjBDJXU1NzI4JXU2NUJDJXU2MTBGJXU2MEYzJXU0RTBEJXU1MjMwJXU3Njg0JXU5QTVBJXU1NTlDJXU4MjA3JXU2MTFGJXU1MkQ1JXVGRjAxJXUzMDBEJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy0lMEElMEFzZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMHN0eWxlJTNEJTI3bXNvLW1hcmdpbi10b3AtYWx0JTNBMGNtJTNCbWFyZ2luLXJpZ2h0JTNBMGNtJTNCbWFyZ2luLWJvdHRvbSUzQTEyLjBwdCUzQm1hcmdpbi1sZWZ0JTNBMGNtJTNCZm9udC12YXJpYW50LWxpZ2F0dXJlcyUzQSUyMCUwQSUwQW5vcm1hbCUzQmZvbnQtdmFyaWFudC1jYXBzJTNBJTIwbm9ybWFsJTNCb3JwaGFucyUzQSUyMDIlM0J0ZXh0LWFsaWduJTNBc3RhcnQlM0J3aWRvd3MlM0ElMjAyJTNCLXdlYmtpdC10ZXh0LXN0cm9rZS13aWR0aCUzQSUyMDBweCUzQndvcmQtc3BhY2luZyUzQTBweCUyNyUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2ZvbnQtJTBBJTBBc2l6ZSUzQTEwLjBwdCUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJXU3NTI4JXU4RDg1JXU5MDRFJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy1zZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFMjAlM0Mvc3BhbiUzRSUzQ3NwYW4lMjAlMEElMEFzdHlsZSUzRCUyN2ZvbnQtc2l6ZSUzQTEwLjBwdCUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJXU1RTc0JXU3Njg0JXU2NUM1JXU5MDRBJXU0RUJBJXU3NTFGJXUzMDAxJXU5MDgxJXU1MTY1JXU3QjJDJXU0RTAzJXU1RTc0JXU3Njg0JXU5ODE4JXU5NjhBJXU1QkU2JXU1MkQ5JXU1RTM2JXU1NzE4JXU3RDkzJXU5QTU3JXVGRjBDJXUzMDEwJXU1MDkxJXU1MjI5JXU1RTM2JXU4REVGJXUzMDExJXU2MEYzJXU4QjkzJXU0RjYwJXU1QzBEJXU2NUM1JXU4ODRDJXU1M0M4JXU2NzA5JXU2NUIwJXU3Njg0JXU5QUQ0JXU5QTU3JXU4MjA3JXU2MTFGJXU1MkQ1JXVGRjAxJXU1MThEJXU2QjIxJXU3NjdDJXU3M0ZFJXU2NUM1JXU4ODRDJXU3Njg0JXU2QTAyJXU4REEzJXUzMDAxJXU3MUIxJXU2MEM1JXU4MjA3JTBBJTBBJXU1MkQ1JXU1MjlCJXVGRjAxJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdmb250LXNpemUlM0ExMC4wcHQlM0Jmb250LWZhbWlseSUzQSUyMkFyaWFsJTIyJTJDJTIyc2Fucy1zZXJpZiUyMiUzQmNvbG9yJTNBJTIzNjY2NjY2JTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMCUwQSUwQWxhbmclM0RFTi1VUyUzRSUzQ2ElMjAlMEElMEFocmVmJTNEJTIyaHR0cHMlM0EvL2Zhcm0yLnN0YXRpY2ZsaWNrci5jb20vMTQ4NC8yNDA4MDg1MDI0M182MmRkNzE4MWE1X3ouanBnJTIyJTNFaHR0cHMlM0EvL2Zhcm0yLnN0YXRpY2ZsaWNrci5jb20vMTQ4NC8yNDA4MDg1MDI0M182MmRkNzE4MWE1X3ouanBnJTNDL2ElM0UlM0NvJTNBcCUzRSUzQy9vJTNBcCUzRSUzQy9zJTBBJTBBcGFuJTNFJTNDL3AlM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTNFJTNDbyUzQXAlM0UlMjZuYnNwJTNCJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3RhYmxlJTIwY2xhc3MlM0RNc29UYWJsZUxpZ2h0U2hhZGluZ0FjY2VudDElMjBib3JkZXIlM0QxJTIwY2VsbHNwYWNpbmclM0QwJTIwY2VsbHBhZGRpbmclM0QwJTIwJTBBJTBBc3R5bGUlM0QlMjdib3JkZXItY29sbGFwc2UlM0Fjb2xsYXBzZSUzQmJvcmRlciUzQW5vbmUlMjclM0UlM0N0ciUzRSUzQ3RkJTIwd2lkdGglM0QxNDElMjB2YWxpZ24lM0R0b3AlMjBzdHlsZSUzRCUyN3dpZHRoJTNBMTA1Ljk1cHQlM0Jib3JkZXItdG9wJTNBc29saWQlMjAlMjM0RjgxQkQlMjAxLjBwdCUzQmJvcmRlci1sZWZ0JTNBbm9uZSUzQmJvcmRlci0lMEElMEFib3R0b20lM0Fzb2xpZCUyMCUyMzRGODFCRCUyMDEuMHB0JTNCYm9yZGVyLXJpZ2h0JTNBbm9uZSUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDYiUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2ZvbnQtZmFtaWx5JTNBJTIyJXU2NUIwJXU3RDMwJXU2NjBFJTBBJTBBJXU5QUQ0JTIyJTJDJTIyc2VyaWYlMjIlM0Jjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSV1ODg2OCV1NjgzQyV1NEUwMCV1NTgwNiUzQy9zcGFuJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMHN0eWxlJTNEJTI3Y29sb3IlM0ElMjMzNjVGOTElMjclM0UlM0NvJTNBcCUzRSUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL2IlM0UlM0MvcCUzRSUzQy90ZCUzRSUzQ3RkJTIwd2lkdGglM0QxNDIlMjB2YWxpZ24lM0R0b3AlMjAlMEElMEFzdHlsZSUzRCUyN3dpZHRoJTNBMTA2LjNwdCUzQmJvcmRlci10b3AlM0Fzb2xpZCUyMCUyMzRGODFCRCUyMDEuMHB0JTNCYm9yZGVyLWxlZnQlM0Fub25lJTNCYm9yZGVyLWJvdHRvbSUzQXNvbGlkJTIwJTIzNEY4MUJEJTIwMS4wcHQlM0Jib3JkZXItcmlnaHQlM0Fub25lJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwNS40cHQlMjclM0UlM0NwJTIwJTBBJTBBY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NiJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMHN0eWxlJTNEJTI3Y29sb3IlM0ElMjMzNjVGOTElMjclM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9iJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMTgwJTIwdmFsaWduJTNEdG9wJTIwc3R5bGUlM0QlMjd3aWR0aCUzQTEzNC42NXB0JTNCYm9yZGVyLSUwQSUwQXRvcCUzQXNvbGlkJTIwJTIzNEY4MUJEJTIwMS4wcHQlM0Jib3JkZXItbGVmdCUzQW5vbmUlM0Jib3JkZXItYm90dG9tJTNBc29saWQlMjAlMjM0RjgxQkQlMjAxLjBwdCUzQmJvcmRlci1yaWdodCUzQW5vbmUlM0JwYWRkaW5nJTNBMGNtJTIwNS40cHQlMjAwY20lMjA1LjRwdCUyNyUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ2IlM0UlM0NzcGFuJTIwJTBBJTBBc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjBzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9iJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMTgwJTIwJTBBJTBBdmFsaWduJTNEdG9wJTIwc3R5bGUlM0QlMjd3aWR0aCUzQTEzNC42NXB0JTNCYm9yZGVyLXRvcCUzQXNvbGlkJTIwJTIzNEY4MUJEJTIwMS4wcHQlM0Jib3JkZXItbGVmdCUzQW5vbmUlM0Jib3JkZXItYm90dG9tJTNBc29saWQlMjAlMjM0RjgxQkQlMjAxLjBwdCUzQmJvcmRlci1yaWdodCUzQW5vbmUlM0JwYWRkaW5nJTNBMGNtJTIwNS40cHQlMjAwY20lMjAlMEElMEE1LjRwdCUyNyUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ2IlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL2IlM0UlM0MvcCUzRSUzQy90ZCUzRSUzQ3RkJTIwd2lkdGglM0QzODclMjB2YWxpZ24lM0R0b3AlMjAlMEElMEFzdHlsZSUzRCUyN3dpZHRoJTNBMjkwLjZwdCUzQmJvcmRlci10b3AlM0Fzb2xpZCUyMCUyMzRGODFCRCUyMDEuMHB0JTNCYm9yZGVyLWxlZnQlM0Fub25lJTNCYm9yZGVyLWJvdHRvbSUzQXNvbGlkJTIwJTIzNEY4MUJEJTIwMS4wcHQlM0Jib3JkZXItcmlnaHQlM0Fub25lJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwNS40cHQlMjclM0UlM0NwJTIwJTBBJTBBY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NiJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwJTBBJTBBc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvYiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDL3RyJTNFJTNDdHIlM0UlM0N0ZCUyMHdpZHRoJTNEMTQxJTIwdmFsaWduJTNEdG9wJTIwc3R5bGUlM0QlMjd3aWR0aCUzQTEwNS45NXB0JTNCYm9yZGVyJTNBbm9uZSUzQmJhY2tncm91bmQlM0ElMjNEM0RGRUUlM0JwYWRkaW5nJTNBMGNtJTIwJTBBJTBBNS40cHQlMjAwY20lMjA1LjRwdCUyNyUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ2IlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjAlMEElMEFzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9iJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMTQyJTIwdmFsaWduJTNEdG9wJTIwc3R5bGUlM0QlMjd3aWR0aCUzQTEwNi4zcHQlM0Jib3JkZXIlM0Fub25lJTNCYmFja2dyb3VuZCUzQSUyM0QzREZFRSUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMCUwQSUwQTUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMHN0eWxlJTNEJTI3Y29sb3IlM0ElMjMzNjVGOTElMjclM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDdGQlMjB3aWR0aCUzRDE4MCUyMHZhbGlnbiUzRHRvcCUyMCUwQSUwQXN0eWxlJTNEJTI3d2lkdGglM0ExMzQuNjVwdCUzQmJvcmRlciUzQW5vbmUlM0JiYWNrZ3JvdW5kJTNBJTIzRDNERkVFJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwNS40cHQlMjclM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSUwQSUwQSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjBzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDdGQlMjB3aWR0aCUzRDE4MCUyMHZhbGlnbiUzRHRvcCUyMCUwQSUwQXN0eWxlJTNEJTI3d2lkdGglM0ExMzQuNjVwdCUzQmJvcmRlciUzQW5vbmUlM0JiYWNrZ3JvdW5kJTNBJTIzRDNERkVFJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwNS40cHQlMjclM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwJTBBJTBBc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMzg3JTIwdmFsaWduJTNEdG9wJTIwc3R5bGUlM0QlMjd3aWR0aCUzQTI5MC42cHQlM0Jib3JkZXIlM0Fub25lJTNCYmFja2dyb3VuZCUzQSUyM0QzREZFRSUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMCUwQSUwQTUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwJTBBJTBBc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQy90ZCUzRSUzQy90ciUzRSUzQ3RyJTNFJTNDdGQlMjB3aWR0aCUzRDE0MSUyMHZhbGlnbiUzRHRvcCUyMHN0eWxlJTNEJTI3d2lkdGglM0ExMDUuOTVwdCUzQmJvcmRlciUzQW5vbmUlM0JwYWRkaW5nJTNBMGNtJTIwNS40cHQlMjAwY20lMjA1LjRwdCUyNyUzRSUzQ3AlMjAlMEElMEFjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ2IlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjAlMEElMEFzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9iJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMTQyJTIwdmFsaWduJTNEdG9wJTIwc3R5bGUlM0QlMjd3aWR0aCUzQTEwNi4zcHQlM0Jib3JkZXIlM0Fub25lJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwNS40cHQlMjclM0UlM0NwJTIwJTBBJTBBY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMTgwJTIwdmFsaWduJTNEdG9wJTIwJTBBJTBBc3R5bGUlM0QlMjd3aWR0aCUzQTEzNC42NXB0JTNCYm9yZGVyJTNBbm9uZSUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTBBJTBBJTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQy90ZCUzRSUzQ3RkJTIwd2lkdGglM0QxODAlMjB2YWxpZ24lM0R0b3AlMjBzdHlsZSUzRCUyN3dpZHRoJTNBMTM0LjY1cHQlM0Jib3JkZXIlM0Fub25lJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwJTBBJTBBNS40cHQlMjclM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMzg3JTIwdmFsaWduJTNEdG9wJTIwJTBBJTBBc3R5bGUlM0QlMjd3aWR0aCUzQTI5MC42cHQlM0Jib3JkZXIlM0Fub25lJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwNS40cHQlMjclM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlMEElMEElM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjBzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDL3RyJTNFJTNDdHIlM0UlM0N0ZCUyMHdpZHRoJTNEMTQxJTIwdmFsaWduJTNEdG9wJTIwJTBBJTBBc3R5bGUlM0QlMjd3aWR0aCUzQTEwNS45NXB0JTNCYm9yZGVyJTNBbm9uZSUzQmJhY2tncm91bmQlM0ElMjNEM0RGRUUlM0JwYWRkaW5nJTNBMGNtJTIwNS40cHQlMjAwY20lMjA1LjRwdCUyNyUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ2IlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSUwQSUwQSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjBzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9iJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMTQyJTIwdmFsaWduJTNEdG9wJTIwJTBBJTBBc3R5bGUlM0QlMjd3aWR0aCUzQTEwNi4zcHQlM0Jib3JkZXIlM0Fub25lJTNCYmFja2dyb3VuZCUzQSUyM0QzREZFRSUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMCUwQSUwQXN0eWxlJTNEJTI3Y29sb3IlM0ElMjMzNjVGOTElMjclM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDdGQlMjB3aWR0aCUzRDE4MCUyMHZhbGlnbiUzRHRvcCUyMHN0eWxlJTNEJTI3d2lkdGglM0ExMzQuNjVwdCUzQmJvcmRlciUzQW5vbmUlM0JiYWNrZ3JvdW5kJTNBJTIzRDNERkVFJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwJTBBJTBBNS40cHQlMjclM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTNCY29sb3IlM0ElMjMzNjVGOTElMjclM0UldTg4NjgldTY4M0MldTRFMDAldTU4MDYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjAlMEElMEFzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDdGQlMjB3aWR0aCUzRDE4MCUyMHZhbGlnbiUzRHRvcCUyMHN0eWxlJTNEJTI3d2lkdGglM0ExMzQuNjVwdCUzQmJvcmRlciUzQW5vbmUlM0JiYWNrZ3JvdW5kJTNBJTIzRDNERkVFJTNCcGFkZGluZyUzQTBjbSUyMDUuNHB0JTIwMGNtJTIwJTBBJTBBNS40cHQlMjclM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0MvdGQlM0UlM0N0ZCUyMHdpZHRoJTNEMzg3JTIwdmFsaWduJTNEdG9wJTIwJTBBJTBBc3R5bGUlM0QlMjd3aWR0aCUzQTI5MC42cHQlM0Jib3JkZXIlM0Fub25lJTNCYmFja2dyb3VuZCUzQSUyM0QzREZFRSUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUlMEElMEEldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQy90ZCUzRSUzQy90ciUzRSUzQ3RyJTNFJTNDdGQlMjB3aWR0aCUzRDE0MSUyMHZhbGlnbiUzRHRvcCUyMCUwQSUwQXN0eWxlJTNEJTI3d2lkdGglM0ExMDUuOTVwdCUzQmJvcmRlciUzQW5vbmUlM0Jib3JkZXItYm90dG9tJTNBc29saWQlMjAlMjM0RjgxQkQlMjAxLjBwdCUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDYiUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2ZvbnQtZmFtaWx5JTNBJTIyJXU2NUIwJXU3RDMwJXU2NjBFJTBBJTBBJXU5QUQ0JTIyJTJDJTIyc2VyaWYlMjIlM0Jjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSV1ODg2OCV1NjgzQyV1NEUwMCV1NTgwNiUzQy9zcGFuJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMHN0eWxlJTNEJTI3Y29sb3IlM0ElMjMzNjVGOTElMjclM0UlM0NvJTNBcCUzRSUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL2IlM0UlM0MvcCUzRSUzQy90ZCUzRSUzQ3RkJTIwd2lkdGglM0QxNDIlMjB2YWxpZ24lM0R0b3AlMjAlMEElMEFzdHlsZSUzRCUyN3dpZHRoJTNBMTA2LjNwdCUzQmJvcmRlciUzQW5vbmUlM0Jib3JkZXItYm90dG9tJTNBc29saWQlMjAlMjM0RjgxQkQlMjAxLjBwdCUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUyMCUwQSUwQXN0eWxlJTNEJTI3Y29sb3IlM0ElMjMzNjVGOTElMjclM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDL3RkJTNFJTNDdGQlMjB3aWR0aCUzRDE4MCUyMHZhbGlnbiUzRHRvcCUyMHN0eWxlJTNEJTI3d2lkdGglM0ExMzQuNjVwdCUzQmJvcmRlciUzQW5vbmUlM0Jib3JkZXItYm90dG9tJTNBc29saWQlMjAlMjM0RjgxQkQlMjAlMEElMEExLjBwdCUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTBBJTBBJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQy90ZCUzRSUzQ3RkJTIwd2lkdGglM0QxODAlMjB2YWxpZ24lM0R0b3AlMjAlMEElMEFzdHlsZSUzRCUyN3dpZHRoJTNBMTM0LjY1cHQlM0Jib3JkZXIlM0Fub25lJTNCYm9yZGVyLWJvdHRvbSUzQXNvbGlkJTIwJTIzNEY4MUJEJTIwMS4wcHQlM0JwYWRkaW5nJTNBMGNtJTIwNS40cHQlMjAwY20lMjA1LjRwdCUyNyUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjAlMEElMEFzdHlsZSUzRCUyN2NvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJTNDbyUzQXAlM0UlMjZuYnNwJTNCJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQy90ZCUzRSUzQ3RkJTIwd2lkdGglM0QzODclMjB2YWxpZ24lM0R0b3AlMjBzdHlsZSUzRCUyN3dpZHRoJTNBMjkwLjZwdCUzQmJvcmRlciUzQW5vbmUlM0Jib3JkZXItYm90dG9tJTNBc29saWQlMjAlMjM0RjgxQkQlMjAlMEElMEExLjBwdCUzQnBhZGRpbmclM0EwY20lMjA1LjRwdCUyMDBjbSUyMDUuNHB0JTI3JTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMHN0eWxlJTNEJTI3Zm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBJTIzMzY1RjkxJTI3JTNFJXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JXU4ODY4JXU2ODNDJXU0RTAwJXU1ODA2JTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTIwJTBBJTBBc3R5bGUlM0QlMjdjb2xvciUzQSUyMzM2NUY5MSUyNyUzRSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQy90ZCUzRSUzQy90ciUzRSUzQy90YWJsZSUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMCUwQSUwQWxhbmclM0RFTi1VUyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwc3R5bGUlM0QlMjdmb250LWZhbWlseSUzQSUyMiV1NjVCMCV1N0QzMCV1NjYwRSV1OUFENCUyMiUyQyUyMnNlcmlmJTIyJTI3JTNFJXU2NTg3JXU1M0JCJXU3RTVFJXU0RTg2JXU1NzE2JTNDL3NwYW4lM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTNFJTNDaW1nJTIwYm9yZGVyJTNEMCUyMCUwQSUwQXdpZHRoJTNEMTIxMiUyMGhlaWdodCUzRDkwOSUyMGlkJTNEJTIyJXU1NzE2JXU3MjQ3X3gwMDIwXzElMjIlMjBzcmMlM0QlMjJodHRwcyUzQS8vZmFybTIuc3RhdGljZmxpY2tyLmNvbS8xNzE1LzI0MjA4NDUzNDMyX2UwZjhlMjEwNmVfei5qcGclMjIlM0UlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBzdHlsZSUzRCUyN2ZvbnQtZmFtaWx5JTNBJTIyJXU2NUIwJXU3RDMwJXU2NjBFJTBBJTBBJXU5QUQ0JTIyJTJDJTIyc2VyaWYlMjIlMjclM0UldTY1ODcldTUzQkIldTdFNUUldTRFODYldTU3MTYlM0Mvc3BhbiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlM0UlM0NvJTNBcCUzRSUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTNFJTNDbyUzQXAlM0UlMjZuYnNwJTNCJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjAlMEElMEFjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NiJTNFJTNDc3BhbiUyMCUwQSUwQXN0eWxlJTNEJTI3Zm9udC1zaXplJTNBNDguMHB0JTNCZm9udC1mYW1pbHklM0ElMjIldTY1QjAldTdEMzAldTY2MEUldTlBRDQlMjIlMkMlMjJzZXJpZiUyMiUzQmNvbG9yJTNBcmVkJTNCYmFja2dyb3VuZCUzQXllbGxvdyUzQm1zby1oaWdobGlnaHQlM0F5ZWxsb3clMjclM0UldTUzQzgldTYzRDIldTUxNjUldTU5MjcldTU3MTYldTcyNDclM0Mvc3BhbiUzRSUzQy9iJTNFJTNDYiUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlMjAlMEElMEFzdHlsZSUzRCUyN2ZvbnQtc2l6ZSUzQTQ4LjBwdCUzQmNvbG9yJTNBcmVkJTI3JTNFJTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9iJTNFJTNDL3AlM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLVVTJTNFJTNDbyUzQXAlM0UlMjZuYnNwJTNCJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjAlMEElMEFsYW5nJTNERU4tVVMlM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0NwJTIwY2xhc3MlM0RNc29Ob3JtYWwlM0UlM0NzcGFuJTIwbGFuZyUzREVOLSUwQSUwQVVTJTNFJTNDbyUzQXAlM0UlMjZuYnNwJTNCJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi0lMEElMEFVUyUzRVRoYW5rcyUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlM0UlM0NvJTNBcCUzRSUyNm5ic3AlM0IlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi1VUyUzRVN0ZXZlbiUyMFlhbiUyMCUwQSUwQSUzQ28lM0FwJTNFJTNDL28lM0FwJTNFJTNDL3NwYW4lM0UlM0MvcCUzRSUzQ3AlMjBjbGFzcyUzRE1zb05vcm1hbCUzRSUzQ3NwYW4lMjBsYW5nJTNERU4tVVMlM0VleHQlM0E3NzU4JTNDbyUzQXAlM0UlM0MvbyUzQXAlM0UlM0Mvc3BhbiUzRSUzQy9wJTNFJTNDcCUyMGNsYXNzJTNETXNvTm9ybWFsJTNFJTNDc3BhbiUyMGxhbmclM0RFTi0lMEElMEFVUyUzRSUzQ28lM0FwJTNFJTI2bmJzcCUzQiUzQy9vJTNBcCUzRSUzQy9zcGFuJTNFJTNDL3AlM0UlM0MvZGl2JTNFJTNDL2JvZHklM0UlMEE=", //"system is down",
                message_html: "Mi4lMjBIVE1MJXU2ODNDJXU1RjBGJXU3Njg0JXU4Q0M3JXU2NTk5JXU4OTgxJXU2NTNFJXU1MTY1ZXNjYXBlJXU3REU4JXU3OEJDJXU1MjREJTJDJTIwJXU4OTgxJXU1MTQ4JXU4NjU1JXU3NDA2JXU3Mjc5JXU2QjhBJXU1QjU3JXU3QjI2JTBBJTI2JTIwJXU1ODZCJXU1MTY1JTI2YW1wJTBBJXUyMDFDJTIwJXU1ODZCJXU1MTY1JTI2cXVvdCUwQSV1MjAxOCUyMCV1NTg2QiV1NTE2NSUyNmFwb3MlM0IlMEElM0MlMjAldTU4NkIldTUxNjUlMjZsdCUwQSUzRSUyMCV1NTg2QiV1NTE2NSUyNmd0JTBB",
                message_url:"JTIyJTVDJXUyMDFDJXVGRjBDJTIyLyUyMiUyQyUyMiUyNiV1MjAxQyV1RkYwQyV1MjAxRCUzQ2JyJTNFMTIzJTNDL2JyJTNFJXVGRjBDQSUyNkIlMkMlMjIldTRGNjAldTU5N0QldTIwMUQldUZGMENNeSUyN3MlMjAlMjBMeW5jLg==",
                message_source:"Oracle ERP",
                source_user_id:"Qgroup\\Sammi.Yao",
                destination_user_id:["qisda","benq"],
                destination_role_id:["benq/Supply Chain Management","benq/ITS"],
            };

            var mydataStr = $.toJSON(mydata);
//            mydata = '{"first name":"moseszhu",' +
//                    '"age":"31"}';

            $.ajax({
                url: "v101/qplay/sendPushMessage?lang=en-us&app_key=appqplay&need_push=N",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "58169b8a895eb");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("content: " + d.content.content + "<br/>"
                            + "jsonContent: " + d.content.jsonContent);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }

        var sendPushMessageWithJPushWebAPI = function () {
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            var mydata = {message_title: "SlB1c2ggV2ViIEFQSSBUZXN0",//"JPush Web API Test",
                template_id:3,
                message_type: "event",
                message_text: "SlB1c2ggV2ViIEFQSSBUZXN0IE5ld3MgQm9keQ==", //"JPush Web API Test News Body",
                message_html: "",
                message_url:"",
                message_source:"Oracle ERP",
                source_user_id:"Qgroup\\Moses.Zhu",
                destination_user_id:["Qgroup\\Moses.Zhu","Qgroup\\Sammi.Yao"],
                destination_role_id:["Qisda/AIC0 RD"]
            };
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "v101/qplay/sendPushMessage?lang=en-us&app_key=appqplay&need_push=Y",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplaytest");
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
                    request.setRequestHeader("token", "58169b8a895eb");
                },
                success: function (d, status, xhr) {
                    alert(d.result_code + ": " + d.message);
                    $("#result_content").html("content: " + d.content.content + "<br/>"
                        + "jsonContent: " + d.content.jsonContent);
                },
                error: function (e) {
                    alert(e);
                }
            });
        }
    </script>
@endsection


