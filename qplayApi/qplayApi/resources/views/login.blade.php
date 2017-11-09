@extends('app')

@section('content')
    <?php
    use App\lib\CommonUtil;$csrf_token = csrf_token();

    ?>
    <style>
        td{
            padding:0;
        }
        ui-btn:active{
            background-color: yellow;
        }
        a{
            text-decoration:none;
            color: #2A8ABD;
        }
        a:visited{
            color:#2A8ABD;!important;
        }
        td.control_icon_cell{
            width: 4.2vw;!important;
        }
        .ui-icon-dropdown {
            background:url({{asset('/css/images/dropdown_n.png')}}) no-repeat 0 0;
            background-position: 98% 50%;
            background-size: 4vw 2.4vw ;
        }
        .ui-content {
            padding: 0;
        }
        .control_icon {
            max-height: 6.8vw !important;       
            max-width: 6.8vw !important;
            margin-right: 3vw;
            margin-left: 3vw;
            display: inherit;
        }
        #main_table input {
            font-size:4.2vw;
        }
        #button_cell {
            width: 100%
        }
        #main_table {
            margin: 25vw 0 3.6vw 0;
            border-collapse: collapse;
            width: 100%;
        }
        #main_table tr
        {
            border-bottom: 1px solid #e6e6e6;
        }
        #button_cell {
            padding-top: 3vw;
        }
        #main_table > td {
            height: 1.2em;
        }
        .control_title_text
        {
            font:3.8vw "Arial";
            color: #0f0f0f;
        }
        .login_control{
            font:3.8vw "Arial";
        }
        ::-webkit-input-placeholder {
            font:3.8vw "Arial";
            color: #999999;
            text-overflow: ellipsis;
        }
        :-moz-placeholder {
            font:1em "Arial";
            color: #999999;!important;
            text-overflow: ellipsis;
        }
        ::-moz-placeholder {
            font:1em "Arial";
            color: #999999;!important;
            text-overflow: ellipsis;
        }
        :-ms-input-placeholder {
            font:1em "Arial";
            color: #999999;!important;
            text-overflow: ellipsis;
        }

        #dlgMessage {
            border-radius: .8em;
            border: 0;
            box-shadow: 0 0 0 rgba(0,0,0,0);
            -webkit-box-shadow: 0 0 0 rgba(0,0,0,0);
            font-size: 3.8vw;!important;
        }

        #dlgMessage .ui-header {
            background-color: #fff;
            padding:15px;
        }

        #dlgMessage .ui-content {
            background-color: #fff;
            padding:15px;
            color: #492e80;
            text-shadow:0 0;
        }
        #info_cell_forget {
            font:3.2vw "Arial";
            color: #666666;
        }
        .linkITS{
            margin-left: .3em; 
        }
        #info_cell_logout + .linkITS{
            font:1em "Arial";
        }
        #info_cell{
         color: #0f0f0f;
         font: 3.2vw 'Arial';
         width: 80%;
         margin: 6vw auto auto auto;
         text-align: center;
         padding-top: 0;   
        }
        #env_info {
            color: red;
            font-size:10vw;
            position:absolute;
            z-index: 2;
            margin-left: auto;
            margin-right: auto;
            left:0;
            right:0;
        }

    </style>
    <div data-role="page" id="pageLogin" style="font-family: 'Arial';">
        <div role="main" class="ui-content" style="text-align: center;margin: 22vw 3.71vw 0 3.71vw;">
            <img src="{{asset('/css/images/login_logo.png')}}" style="height:36vw;" />
            @if (Config::get('app.env')!='production')
                <div id="env_info">● {{Config::get('app.env')}} ●</div>
            @endif
            <table id="main_table">
                <tr>
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/domain.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td>
                                    <select class="login_control" name="ddlCompany" id="ddlCompany" data-mini="true" data-inline='false' data-icon="dropdown" data-iconpos="nocontext" style="border-color: #1f1f1f; padding: .4em">
                                        <option value="" selected disabled></option>
                                        <option value="BENQ">BenQ</option>
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
                                <td>
                                    <input class="login_control" type="text" data-clear-btn="false" name="tbxName" data-mini="true"
                                           id="tbxName" value="" placeholder="" style="padding-top:.7em "/>
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
                                <td>
                                    <input class="login_control" type="password" data-clear-btn="false" name="tbxPassword" data-mini="true"
                                           id="tbxPassword" value="" placeholder="" style="padding-top:.7em " />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <div style="margin-top: 10vw;">
                <div id="button_cell">
                    <button id="btnLogin" class="ui-btn ui-btn-corner-all login_button" style="color:white;background-color: #492e80;font:4vw 'Arial';text-transform: none;line-height: 1em;width: 64vw;text-shadow: none;"
                            onclick="tryLogin()">登入</button>
                    <button id="btnOriLogin" class="ui-btn ui-btn-corner-all login_button" style="display:none;color:white;background-color: #492e80;font:4vw 'Arial';text-transform: none;line-height: 1em;width: 64vw;text-shadow: none;"
                            onclick="oriLogin()">登入</button>
                </div>
                <div id="info_cell"><span id="info_cell_forget" >忘記密碼請聯絡 </span><a class="linkITS" href="mailto:QPlay@BenQ.com">ITS</a></div>
            </div>
        </div>

        <div data-role="popup" id="dlgMessage"
             data-overlay-theme="b" data-theme="b" data-dismissible="true" style="max-width:400px;">
            <div data-role="header" data-theme="a">
                <h1 id="messageContainer" style="margin: 0px;">錯誤</h1>
            </div>
            <div role="main" class="ui-content" style="text-align: center;font-family:Arial;" onclick="return hideMessage();">
                <strong>OK</strong>
            </div>
        </div>
    </div>

    <div data-role="page" id="pageRegister" style="background: linear-gradient(to bottom, #f2f2f3, #ffffff 50%, #f2f2f3);">
        <div role="main" class="ui-content" style="text-align: center;">
            <div style="margin: 48vw auto 0 auto;">
                <img src="{{asset('/css/images/verified_img.png')}}" style="height:24vw; margin:0 2vw 4vw 9vw;" />
                <h3 id="info_cell_verify" style="color: #0f0f0f;font:6.6vw 'Arial';margin-top:0;">帳號與設備驗證成功</h3>
                
        </div>
        </div>
        <div style="position:fixed;bottom: 0;padding:1em 1em 13.2vw 1em;left: 0;right: 0;">
           
            <div style="margin: 4vw auto 0 auto;">
                <!--background-image:url({{asset('/css/images/action_n_big_btn.png')}});background-size: cover;background-repeat: no-repeat;border-color: #fff;-->
                <button id="btnOK" class="ui-btn ui-btn-corner-all login_button" style="background-color: #492e80;font:4vw 'Arial';color: #fff;line-height: 1em;width: 64vw;text-shadow: none;"
                    onclick="start()">好，我知道了</button>
            </div>
             {{-- <h4 style="color: #0f0f0f;font: 4.6vw 'Arial';margin: 0 auto;text-align: center;"><span id="info_cell_logout">若要註銷設備，請聯絡</span><a class="linkITS" href="mailto:QPlay@BenQ.com">ITS</a></h4> --}}
             <div id="info_cell"><span id="info_cell_logout" >若要註銷設備，請聯絡 </span><a class="linkITS" href="mailto:QPlay@BenQ.com">ITS</a></div>
        </div>
    </div>
    <script>
        var loginIdPattern = /\w+([-+.]\w+)*$/;
        var chinesePattern = /[^\x00-\xff]/;
        var appKey = "<?php echo CommonUtil::getContextAppKey()?>";
        var appSecretKey = "<?php echo Config::get("app.App_Secret_key")?>";
        var lang = "en-us";
        $(function () {
            lang = getLanguage();
            var url = "{{asset('js/lang')}}" + "/login-" + lang + ".js";
            $.getScript(url,Init);
            function Init(){
                InitUI();
                $("#main_table div").removeClass("ui-shadow").removeClass("ui-shadow-inset");
                $("#tbxName").parent().css("background-color","transparent");
                $("#tbxPassword").parent().css("background-color","transparent");
                $("#ddlCompany").parent().css("background-color","transparent");
                $("#ddlCompany-button").css("padding-left","3vw");
                var showOriLogin = getQueryString("show_origin_login");
                if(showOriLogin && showOriLogin == "Y") {
                    $("#btnOriLogin").show();
                }
            };
        });

        function InitUI(){
            if(!login_lang_list){
                return;
            }
            $("#ddlCompany option").eq(0).text(login_lang_list["COMPANY"]);
            $("#ddlCompany-button > span").text(login_lang_list["COMPANY"]);
            $("#tbxName").attr("placeholder",login_lang_list["NAME"]);
            $("#tbxPassword").attr("placeholder",login_lang_list["PASSWORD"]);
            $("#btnLogin").text(login_lang_list["LOGIN"]);
            $("#btnOriLogin").text(login_lang_list["LOGIN"]);
            $("#btnOK").text(login_lang_list["OK_IKNOW"]);
            $("#info_cell_forget").text(login_lang_list["FORGET_PWD"]);
            $("#messageContainer").text(login_lang_list["ERROR"]);
            $("#info_cell_verify").text(login_lang_list["VERIFY_SUCCESS"]);
            $("#info_cell_logout").text(login_lang_list["LOGOUT"]);
        }

        var getLanguage = function(){
            var browserLanguage = navigator.language.toLowerCase();
            if (browserLanguage === "zh-tw") {
                browserLanguage = "zh-tw";
            }else if (browserLanguage === "zh-cn") {
                browserLanguage = "zh-cn";
            }else if(browserLanguage.substr(0,2)==="en"){
                browserLanguage = "en-us";
            }else {
                browserLanguage = "<?php echo Config::get("app.locale")?>";
            }
            return browserLanguage;
        };

        var oriLogin = function() {
            if(window.smartfactoryapp) {
                window.smartfactoryapp.OriLogin();
            }
        };

        var showMessage = function (msg,isMessage) {
            if(login_lang_list && !isMessage){
                msg = login_lang_list[msg];
            }
            $("#messageContainer").text(msg);
            $("#dlgMessage").popup('open');
        }

        var hideMessage = function() {
            $("#dlgMessage").popup('close');
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
                showMessage("MSG_INFO_ERROR");
                return;
            }

            var uuid = getQueryString("uuid");//Math.uuid();//"CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20";
            if(!uuid) {
                showMessage("MSG_NO_UUID");
                return;
            }
            var device_type = getQueryString("device_type");
            if(!device_type) {
                showMessage("MSG_NO_DEVICE_TYPE");
                return;
            }

           
            if(!loginIdPattern.test(userName))
　　　　　　{
　　　　　　　showMessage("MSG_ACCOUNT_ERROR");
　　　　　　　return;
　　　　　　}
           
            if(chinesePattern.test(password))
　　　　　　{
　　　　　　　showMessage("MSG_PASSWORD_ERROR");
　　　　　　　return;
　　　　　　}

            ShowLoading();
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/isRegister?lang="+lang+"&uuid=" + uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key",appKey);
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
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
                        showMessage(d.message,"Y");
                    }
                },
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    if($.trim(e.responseText) == '' && e.statusText == 'error'){
                        showMessage("MSG_NETWORK_ERROR");
                        return;
                    }
                    showMessage(thrownError,"Y");
                }
            });
        }
        
        var login = function (loginId, password, domain, uuid) {
            
            if(!loginIdPattern.test(loginId))
　　　　　　{
　　　　　　　showMessage("MSG_ACCOUNT_ERROR");
　　　　　　　return;
　　　　　　}
            
            if(chinesePattern.test(password))
　　　　　　{
　　　　　　　showMessage("MSG_PASSWORD_ERROR");
　　　　　　　return;
　　　　　　}
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/login?lang="+lang+"&uuid=" +uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key",appKey);
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
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
                                + '"site_code" : "' + d.content.site_code + '",'
                                + '"checksum" : "' + d.content.checksum + '",'
                                + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                        callPlugin();
                    } else {
                        showMessage(d.result_code + ": " + d.message,"Y");
                    }
                },
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    if($.trim(e.responseText) == '' && e.statusText == 'error'){
                        showMessage("MSG_NETWORK_ERROR");
                        return;
                    }
                    showMessage(thrownError,"Y");
                }
            });
        }
        
        var registerAndLogin = function (loginId, password, domain, uuid, device_type) {
            
            if(!loginIdPattern.test(loginId))
　　　　　　{
　　　　　　　showMessage("MSG_ACCOUNT_ERROR");
　　　　　　　return;
　　　　　　}
            
            if(chinesePattern.test(password))
　　　　　　{
　　　　　　　showMessage("MSG_PASSWORD_ERROR");
　　　　　　　return;
　　　　　　}
            var signatureTime = getSignature("getTime");
            var signatureInBase64 = getSignature("getInBase64", signatureTime);
            $.ajax({
                url: "v101/qplay/register?lang="+lang+"&device_type=" + device_type + "&uuid=" + uuid,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:{},
                beforeSend:function (request) {
                    request.setRequestHeader("app-key",appKey);
                    request.setRequestHeader("signature", signatureInBase64);
                    request.setRequestHeader("signature-time", signatureTime);
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
                                + '"site_code" : "' + d.content.site_code + '",'
                                + '"checksum" : "' + d.content.checksum + '",'
                                + '"security_updated_at" : "' + d.content.security_updated_at + '"}';
                        $.mobile.changePage("#pageRegister");
                    } else {
                        showMessage(d.result_code + ": " + d.message,"Y");
                    }

                },
                error: function (e, ajaxOptions, thrownError) {
                    HideLoading();
                    if($.trim(e.responseText) == '' && e.statusText == 'error'){
                        showMessage("MSG_NETWORK_ERROR");
                        return;
                    }
                    showMessage(thrownError,"Y");
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
                    showMessage(LoginMsg,"Y");
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

        function getSignature(action, signatureTime) {
            if (action === "getTime") {
                return Math.round(new Date().getTime()/1000);
            } else if (action === "getInBase64") {
                var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
                return CryptoJS.enc.Base64.stringify(hash);
            }
        }


    </script>
@endsection


