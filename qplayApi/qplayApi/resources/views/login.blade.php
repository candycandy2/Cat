@extends('app')

@section('content')
    <?php
    $csrf_token = csrf_token();

    ?>
    <div data-role="page" id="pageLogin">
        <div role="main" class="ui-content" style="text-align: center;">
            <img src="{{asset('/css/images/login_logo.png')}}" style="width:16%;" />
            <table id="main_table">
                <tr>
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/domain.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td class="control_title">Domain</td>
                            </tr>
                            <tr>
                                <td>
                                    <select class="login_control" placeholder="Company" name="ddlCompany" id="ddlCompany" data-mini="true" data-inline='false'>
                                        <option value="BENQ" selected="selected">BenQ</option>
                                        <option value="QGROUP">Qisda</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/username.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td class="control_title">UserName</td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="login_control" type="text" data-clear-btn="false" name="tbxName" data-mini="true"
                                           id="tbxName" value="" placeholder="帳號" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/password.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td class="control_title">Password</td>
                            </tr>
                            <tr>
                                <td>
                                    <input class="login_control" type="password" data-clear-btn="false" name="tbxPassword" data-mini="true"
                                           id="tbxPassword" value="" placeholder="密碼" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <div id="info_cell">if you've forgotten your password please contact with ITS</div>
            <div id="button_cell">
                <button class="ui-btn ui-btn-corner-all login_button" style="color:white;background-color: #3c3c75;font-family: Arial;"
                        onclick="tryLogin()">Log in</button>
                <button id="btnOriLogin" class="ui-btn ui-btn-corner-all login_button" style="display:none;color:white;background-color: #3c3c75;font-family: Arial;"
                        onclick="oriLogin()">Origin Log in</button>
            </div>
        </div>
        <div data-role="popup" id="dlgMessage"
             data-overlay-theme="b" data-theme="b" data-dismissible="true" style="max-width:400px;">
            <div data-role="header" data-theme="a">
                <h1>錯誤</h1>
            </div>
            <div role="main" class="ui-content">
                <p id="messageContainer"></p>
            </div>
        </div>
    </div>

    <div data-role="page" id="pageRegister">
        <div role="main" class="ui-content" style="text-align: center;">
            <table style="margin:auto;">
                <tr>
                    <td>
                        <img src="{{asset('/css/images/benq_logo.png')}}" />
                    </td>
                    <td>
                        <img src="{{asset('/css/images/qisda_logo.png')}}" />
                    </td>
                </tr>
            </table>
            <h3>帳號與設備驗證成功</h3>
            <div style="width:60%; margin: 0 auto; margin-top:40px;">
                <img src="{{asset('/css/images/icon_ok.png')}}" style="200px; margin:20px;" />
                <h4>若要註銷設備，請聯絡 BenQ ITS</h4>
                <button class="ui-btn ui-btn-corner-all" style="color:white;background-color: #3c3c75;font-family: Arial;"
                        onclick="start()">好，我知道了</button>
            </div>
        </div>
    </div>
    <script>
        $(function () {
            $("#main_table div").removeClass("ui-shadow").removeClass("ui-shadow-inset");

            var showOriLogin = getQueryString("show_origin_login");
            if(showOriLogin && showOriLogin == "Y") {
                $("#btnOriLogin").show();
            }
        });

        var oriLogin = function() {
            if(window.smartfactoryapp) {
                window.smartfactoryapp.OriLogin();
            }
        };

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
            var password = $("#tbxPassword").val();
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
            ShowLoading();
            $.ajax({
                url: "v101/qplay/isRegister?lang=en-us&uuid=" + uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
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
                        HideLoading();
                        showMessage(d.message);
                    }
                },
                error: function (e) {
                    HideLoading();
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
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", domain);
                    request.setRequestHeader("loginid", loginId);
                    request.setRequestHeader("password", password);
                },
                success: function (d, status, xhr) {
                    HideLoading();
                    if(d.result_code && d.result_code == 1) {
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"checksum" : "' + d.content.checksum + '",'
                                + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                        callPlugin();
                    } else {
                        showMessage(d.result_code + ": " + d.message);
                    }
                },
                error: function (e) {
                    HideLoading();
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
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("redirect-uri", "http://www.moses.com/test");
                    request.setRequestHeader("domain", domain);
                    request.setRequestHeader("loginid", loginId);
                    request.setRequestHeader("password", password);
                },
                success: function (d, status, xhr) {
                    HideLoading();
                    if(d.result_code && d.result_code == 1) {
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"checksum" : "' + d.content.checksum + '",'
                                + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                        $.mobile.changePage("#pageRegister");
                    } else {
                        showMessage(d.result_code + ": " + d.message);
                    }

                },
                error: function (e) {
                    HideLoading();
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
                if(window.smartfactoryapp) {
                    window.smartfactoryapp.EndLogin(LoginMsg);
                }
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


