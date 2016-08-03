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

        <div id="timestampResult"></div>

    <br/><br/>
        <script>
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

        <input type="button" value="isRegister" onclick="isRegister()">
        <input type="button" value="register" onclick="register()">
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
        <br/><br/>

        <a href="qplayauth_register" >Login</a>

        <form action="v101/qplay/sendPushMessage?lang=en-us&app_key=qplay&need_push=Y" method="POST">
            <input type="text" name="name" id="name" />
            <input type="submit" value="Test">

            <div id="result_content"></div>
        </form>
    <script>
        var sectoryKey = 'swexuc453refebraXecujeruBraqAc4e';
        var registerUUID = "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20";

        var isRegister = function () {
            $.ajax({
                url: "v101/qplay/isRegister?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
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
        
        var register = function () {
            $.ajax({
                url: "v101/qplay/register?lang=en-us&device_type=android&uuid=" + "mosesmosesmosesmoses",//Math.uuid(),
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

        var login = function () {
            $.ajax({
                url: "v101/qplay/login?lang=en-us&uuid=" + "A1234567890A1234567890",//Math.uuid(),
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
                    request.setRequestHeader("loginid", "Sammi.Yao");
                    request.setRequestHeader("password", "QCS@2012");
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
                url: "v101/qplay/logout?lang=en-us&loginid=Moses.Zhu&domain=QCS&uuid=" + "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",//Math.uuid(),
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
            $.ajax({
                url: "v101/qplay/checkAppVersion?lang=en-us&package_name=benq.qplay&device_type=android&version_code=100",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "aplay1");
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
                url: "v101/qplay/getAppList?lang=en-us&uuid=A1234567890A1234567890",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a197580a154");
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
            $.ajax({
                url: "v101/qplay/getSecturityList?lang=en-us&uuid=A1234567890A1234567890&app_key=qplay",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
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
            $.ajax({
                url: "v101/qplay/getMessageList?lang=en-us&uuid=A1234567890A1234567890&date_from=1451577600&date_to=1469980800&count_from=1&count_to=200",  //&date_from=1451627340&date_to=1470030584
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "579ec219ddc92");
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
            $.ajax({
                url: "v101/qplay/getMessageDetail?lang=en-us&uuid=A1234567890A1234567890&message_row_id=19",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "579ec219ddc92");
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
            $.ajax({
                url: "v101/qplay/updateMessage?lang=en-us&uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20&message_row_id=1&message_type=event&status=read",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "578451c6819f5");
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
                url: "v101/qplay/sendPushToken?lang=en-us&uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20&app_key=qplay&device_type=android",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
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
                url: "v101/qplay/renewToken?lang=en-us&uuid=CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
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

        var sendPushMessage = function () {
//            var mydata = '{"message_title":"System Announcement",' +
//                    '"message_type":"event",' +
//                    '"message_text":"system is down",' +
//                    '"message_html":"",' +
//                    '"message_url":"",' +
//                    '"message_source":"Oracle ERP",' +
//                    '"source_user_id":"QGROUP\\\\Moses.Zhu",' +
//                    '"destination_user_id":["QGROUP\\\\Moses.Zhu","QGROUP\\\\Tim.Zhang"]' +
//                    '}';
            var mydata = {message_title: "System Announcement",
                        message_type: "event",
                message_text: "system is down",
                message_html: "",
                message_url:"",
                message_source:"Oracle ERP",
                source_user_id:"Moses.Zhu",
                destination_user_id:["Moses.Zhu","Tim.Zhang"]};
            var mydataStr = $.toJSON(mydata);
//            mydata = '{"first name":"moseszhu",' +
//                    '"age":"31"}';

            $.ajax({
                url: "v101/qplay/sendPushMessage?lang=en-us&app_key=qplay&need_push=Y",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "5784945d01e24");
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


