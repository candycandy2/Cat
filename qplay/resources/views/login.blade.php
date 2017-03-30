@extends('app')

@section('content')
    <?php
    $csrf_token = csrf_token();

    ?>
    <div data-role="page" id="pageLogin">
        <div role="main" class="ui-content" style="text-align: center;">
            <img src="{{asset('/css/images/benq_logo.png')}}" style="width:25%; margin:20px;" />
            <h1>BenQ Qplay Login</h1>
            <div style="width:60%; margin: 0 auto; margin-top:40px;">
                <input type="text" data-clear-btn="true" name="tbxName"
                       id="tbxName" value="" placeholder="User Name" />
                <input type="password" data-clear-btn="true" name="tbxPassword"
                       id="tbxPassword" value="" placeholder="Password" />
                <select placeholder="Company" name="ddlCompany" id="ddlCompany">
                    <option value="BENQ" selected="selected">BenQ</option>
                    <option value="QGROUP">Qisda</option>
                </select>
                <button class="ui-btn ui-btn-corner-all" style="color:white;background-color: #3c3c75;font-family: Arial;"
                        onclick="tryLogin()">Log In</button>
            </div>
        </div>
        <div data-role="popup" id="dlgMessage"
             data-overlay-theme="b" data-theme="b" data-dismissible="true" style="max-width:400px;">
            <div data-role="header" data-theme="a">
                <h1>Error</h1>
            </div>
            <div role="main" class="ui-content">
                <p id="messageContainer"></p>
            </div>
        </div>
    </div>

    <div data-role="page" id="pageRegister">
        <div role="main" class="ui-content" style="text-align: center;">
            <img src="{{asset('/css/images/benq_logo.png')}}" style="width:25%; margin:20px;" />
            <h3>Your device has been verified</h3>
            <div style="width:60%; margin: 0 auto; margin-top:40px;">
                <img src="{{asset('/css/images/icon_ok.png')}}" style="200px; margin:20px;" />
                <h4>The cancellation of the device,
                    please contact with BenQ ITS</h4>
                <button class="ui-btn ui-btn-corner-all" style="color:white;background-color: #3c3c75;font-family: Arial;"
                        onclick="start()">OK, I Know</button>
            </div>
        </div>
    </div>
    <script>
        var showMessage = function (msg) {
            $("#messageContainer").text(msg);
            $("#dlgMessage").popup('open');
        }

        var getQueryString =function (name) {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        }

        var tryLogin = function () {
            var userName = $("#tbxName").val();
            var password = encodeURIComponent($("#tbxPassword").val());
            var company = $("#ddlCompany").val();
            if(!$.trim(userName) || !$.trim(password) || !$.trim(company)) {
                showMessage("user name / password / company can not empty!");
                return;
            }

            var uuid = getQueryString("uuid");//Math.uuid();//"CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20";
            if(!uuid) {
                showMessage("no uuid received!");
                return;
            }
            var device_type = getQueryString("device_type");
            if(!device_type) {
                showMessage("no device type received!");
                return;
            }

            $.ajax({
                url: "v101/qplay/isRegister?lang=en-us&uuid=" + uuid,//Math.uuid(),
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
                    if(d.result_code == 1) {
                        if(d.content.is_register == 1) {
                            login(userName, password, company, uuid);
                        } else {
                            registerAndLogin(userName, password, company, uuid, device_type);
                        }
                    } else {
                        showMessage(d.message);
                    }
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showMessage(e);
                }
            });
        }
        
        var login = function (loginId, password, domain, uuid) {
            $.ajax({
                url: "v101/qplay/login?lang=en-us&uuid=" +uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", domain);
                    request.setRequestHeader("loginid", loginId);
                    request.setRequestHeader("password", password);
                },
                success: function (d, status, xhr) {
                    showMessage(d.result_code + ": " + d.message);
                    LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                            + '"uuid" : "' + d.content.uuid + '", '
                            + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                            + '"token" : "' + d.content.token + '", '
                            + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                    callPlugin();
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showMessage(e);
                }
            });
        }
        
        var registerAndLogin = function (loginId, password, domain, uuid, device_type) {
            $.ajax({
                url: "v101/qplay/register?lang=en-us&device_type=" + device_type + "&uuid=" + uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "qplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", domain);
                    request.setRequestHeader("loginid", loginId);
                    request.setRequestHeader("password", password);
                },
                success: function (d, status, xhr) {
                    LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                            + '"uuid" : "' + d.content.uuid + '", '
                            + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                            + '"token" : "' + d.content.token + '", '
                            + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                    $.mobile.changePage("#pageRegister");
                },
                error: function (e) {
                    if(handleAJAXError(this,e)){
                        return false;
                    }
                    showMessage(e);
                }
            });
        }

        var start = function( ) {
            callPlugin();
        }

        var LoginMsg = null;
        var callPlugin = function () {
            if(LoginMsg) {
                if (browser.versions.iPhone || browser.versions.iPad || browser.versions.ios) {
                    window.webkit.messageHandlers.saveLoginResult.postMessage(LoginMsg);
                }else if (browser.versions.android) {
                    LoginWebview.loginResult(LoginMsg);
                } else {
                    showMessage(LoginMsg);
                }
            }
        };

        var browser = {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return { //移动终端浏览器版本信息
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                };
            }(),
        }
    </script>
@endsection


