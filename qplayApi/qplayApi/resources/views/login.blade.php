@extends('app')

@section('content')
    <?php
    $csrf_token = csrf_token();

    ?>
    <style>
        td{
            padding:0;
        }
        .ui-icon-dropdown {
            background:url({{asset('/css/images/dropdown_n.png')}}) no-repeat 0 0;
            background-position: 98% 50%;
            background-size: 4vw 1.2vh ;
        }
        .ui-content {
            padding: 0;
        }
        .control_icon {
            max-height: 6.8vw !important;       
            max-width: 6.8vw !important;
            margin-right: 6.6vw;
            display: inherit;
        }
        #main_table input {
            font-size:2.9vh;
        }
        #button_cell {
            width: 100%
        }
        #main_table {
            margin: 17vh 0 1.8vh 0;
            border-collapse: collapse;
            width: 100%;
        }
        #main_table tr
        {
            border-bottom: 1px solid #333333;
        }
        #button_cell {
            padding-top: 3vh;
        }
        #main_table > td {
            height: 1.2em;
        }
        .control_title_text
        {
            font:2.6vh "Gill Sans MT";
            color: #0f0f0f;
        }
        .login_control{
            font:2.9vh "Arial";
        }
        ::-webkit-input-placeholder {
            font:2.9vh "Gill Sans MT";
            color: #989898;
            text-overflow: ellipsis;
        }
        :-moz-placeholder {
            font:1em "Gill Sans MT";
            color: #989898;!important;
            text-overflow: ellipsis;
        }
        ::-moz-placeholder {
            font:1em "Gill Sans MT";
            color: #989898;!important;
            text-overflow: ellipsis;
        }
        :-ms-input-placeholder {
            font:1em "Gill Sans MT";
            color: #989898;!important;
            text-overflow: ellipsis;
        }
    </style>
    <div data-role="page" id="pageLogin" style="font-family: 'Gill Sans MT';">
        <div role="main" class="ui-content" style="text-align: center;margin: 13vh 8vw 0 8vw;">
            <img src="{{asset('/css/images/login_logo.png')}}" style="height:18vh;" />
            @if (Config::get('app.env')!='production')
                <div style="color: red; font-size:5vh">● {{Config::get('app.env')}} ●</div>
            @endif
            <table id="main_table">
                <tr>
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/domain.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <!--<tr>
                                <td class="control_title control_title_text">公司</td>
                            </tr>-->
                            <tr>
                                <td>
                                    <select class="login_control" placeholder="Company" name="ddlCompany" id="ddlCompany" data-mini="true" data-inline='false' data-icon="dropdown" data-iconpos="nocontext" style="border-color: #1f1f1f;">
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
                        <!--<tr>
                                <td class="control_title control_title_text">帳號</td>
                            </tr>-->
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
                        <!--<tr>
                                <td class="control_title control_title_text">密碼</td>
                            </tr>-->
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
            <div style="margin-top: 1.8vh;">
                <div id="info_cell" style="color: #0f0f0f;font: 2.3vh 'Arial';width: 80%;margin: 0 auto;text-align: center;padding-top: 0;">忘記密碼請聯絡 <a href="mailto:QPlay@BenQ.com">ITS</a></div>
                <div id="button_cell">
                    <button class="ui-btn ui-btn-corner-all login_button" style="color:white;background-color: #3c3c75;font:2.8vh 'Gill Sans MT';text-transform: none;line-height: 1em;width: 64vw;text-shadow: none;"
                            onclick="tryLogin()">登入</button>
                    <button id="btnOriLogin" class="ui-btn ui-btn-corner-all login_button" style="display:none;color:white;background-color: #3c3c75;font:2.8vh 'Gill Sans MT';text-transform: none;line-height: 1em;width: 64vw;text-shadow: none;"
                            onclick="oriLogin()">登入</button>
                </div>
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

    <div data-role="page" id="pageRegister" style="background: linear-gradient(to bottom, #f2f2f3, #ffffff 50%, #f2f2f3);">
        <div role="main" class="ui-content" style="text-align: center;">
            <div style="margin: 24vh auto 0 auto;">
                <img src="{{asset('/css/images/verified_img.png')}}" style="height:12vh; margin:0vh 2vh 4vh 4.5vh;" />
                <h3 style="color: #0f0f0f;font:3.3vh 'Gill Sans MT';margin-top:0;">帳號與設備驗證成功</h3>
                
        </div>
        </div>
        <div style="position:fixed;bottom: 0;padding:1em 1em 6.6vh 1em;left: 0;right: 0;">
            <h4 style="color: #0f0f0f;font: 2.3vh 'Gill Sans MT';margin: 0 auto;text-align: center;">若要註銷設備，請聯絡<a href="mailto:QPlay@BenQ.com">ITS</a></h4>
            <div style="margin: 2vh auto 0 auto;">
                <!--background-image:url({{asset('/css/images/action_n_big_btn.png')}});background-size: cover;background-repeat: no-repeat;border-color: #fff;-->
                <button class="ui-btn ui-btn-corner-all login_button" style="background-color: #3c3c75;font:2.8vh 'Gill Sans MT';color: #fff;line-height: 1em;width: 64vw;text-shadow: none;"
                    onclick="start()">好，我知道了</button>
            </div>
        </div>
    </div>
    <script>
        $(function () {
            $("#main_table div").removeClass("ui-shadow").removeClass("ui-shadow-inset");
            $("#tbxName").parent().css("background-color","transparent");
            $("#tbxPassword").parent().css("background-color","transparent");
            $("#ddlCompany").parent().css("background-color","transparent");
            
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
                showMessage("帳號 / 密碼 / 公司 不能為空 !");
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
                    request.setRequestHeader("app-key",<?php echo '"'.\App\lib\CommonUtil::getContextAppKey().'"' ?>);
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
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    showMessage(thrownError);
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
                    request.setRequestHeader("app-key",<?php echo '"'.\App\lib\CommonUtil::getContextAppKey().'"' ?>);
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
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    showMessage(thrownError);
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
                    request.setRequestHeader("app-key", <?php echo '"'.\App\lib\CommonUtil::getContextAppKey().'"' ?>);
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
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    showMessage(thrownError);
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


