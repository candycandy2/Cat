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
        .ui-icon-dropdown {
            background:url({{asset('/css/images/218_btn_dropdown.png')}}) no-repeat 0 0;
            background-position: 98% 50%;
            background-size: 4.186vw 4.186vw;
        }
        .ui-content {
            padding: 0;
        }
        .control_icon {
            max-height: 7vw !important;
            max-width: 7vw !important;
            margin-left: 3vw;
            display: inherit;
        }
        #main_table input {
            font-size: 3.768vw;
        }
        #button_cell {
            width: 100%
        }
        #main_table {
            margin: 19.11vh 0 3.6vw 0;
            border-collapse: collapse;
            width: 100%;
        }
        #main_table tr
        {
            border-bottom: 1px solid #D6D6D6;
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
            font: 3.768vw "Arial";
        }
        ::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
            color: #999999;
            font-size: 3.768vw "Arial";
            text-overflow: ellipsis;
            opacity: 1; /* Firefox */
        }

        :-ms-input-placeholder { /* Internet Explorer 10-11 */
            color: #999999;
            font-size: 3.768vw "Arial";
            text-overflow: ellipsis;
        }

        ::-ms-input-placeholder { /* Microsoft Edge */
            color: #999999;
            font-size: 3.768vw "Arial";
            text-overflow: ellipsis;
        }
        .linkITS{
            margin-left: .3em;
            font:3.2vw "Arial";
            color: #666666;
        }
        #info_cell{
            color: #0f0f0f;
            font: 3.2vw 'Arial';
            width: 80%;
            margin: 3vh auto auto auto;
            text-align: center;
            padding-top: 0;
        }
        #env_info {
            color: red;
            font-size: 6.8vw;
            position: absolute;
            z-index: 2;
            margin-left: auto;
            margin-right: auto;
            left: 0;
            right: 0;
        }
        @media screen and (orientation: portrait) {
            img.logo {
                height: 9.67vw;
            }
            img.logo_register {
                height: 19.65vw;
            }
        }
        @media screen and (orientation: landscape) {
            img.logo {
                height: 9.67vw;
            }
            img.logo_register {
                height: 19.65vw;
            }
        }
        #pageLogin {
            background-color: #fcfcfc;
            font-family: 'Arial';
        }
        #pageLogin .ui-content {
            text-align: center;
            margin: 12.87vh 3.71vw 0 3.71vw;
        }
        .btn-login {
            position: absolute;
            background-color: #009587;
            color: #FFFFFF;
            font-size: 4.18vw;
            left: 0;
            width: 100vw;
            height: 11.36vw;
            margin-top: 12.8vh;
        }
        .btn-text {
            margin-top: 3.59vw;
        }
        .forget-text-content {
            position: absolute;
            color: #666666;
            font-size: 3.14vw;
            left: 0;
            width: 100vw;
        }
        #dlgMessage {
            border-radius: .8em;
            border: 0;
            box-shadow: 0 0 0 rgba(0,0,0,0);
            -webkit-box-shadow: 0 0 0 rgba(0,0,0,0);
            font-size: 3.8vw; !important;
        }
        #dlgMessage .ui-header {
            background-color: #fff;
            padding: 15px;
        }
        #dlgMessage .ui-content {
            background-color: #fff;
            padding: 15px;
            color: #492e80;
            text-shadow: 0 0;
            margin: 0;
        }
        #pageRegister {
            font-family: 'Arial';
        }
        #pageRegister .ui-content {
            text-align: center;
            margin: 39vw 3.71vw 0 3.71vw;
        }
        #info_cell_verify {
            color: #263238;
            font: 4.18vw 'Arial';
            margin: 0;
            margin-top: 8.57vw;
        }
        .forget-text {
            display: inline-block;
        }
    </style>
    <div data-role="page" id="pageLogin">
        <div role="main" class="ui-content">
            <img src="{{asset('/css/images/128_logo.png')}}" class="logo"/>
            @if (Config::get('app.env')!='production')
                <div id="env_info">● {{Config::get('app.env')}} ●</div>
            @endif
            <table id="main_table">
                <tr id="ddlCompanyData">
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/company.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td>
                                    <select class="login_control" name="ddlCompany" id="ddlCompany" data-mini="true" data-inline='false' data-icon="dropdown" data-iconpos="nocontext" style="border-color: #1f1f1f; padding: .4em">
                                        <option value="" selected></option>
                                        @foreach($data as $company)
                                            <option value="{{$company->user_domain}}">{{$company->name}}</option>
                                        @endforeach
                                        <option value="shop"><!--協力廠商--></option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr id="ddlLoginTypeData">
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/login_type.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td>
                                    <select class="login_control" name="ddlLoginType" id="ddlLoginType" data-mini="true" data-inline='false' data-icon="dropdown" data-iconpos="nocontext" style="border-color: #1f1f1f; padding: .4em">
                                        <option value="none"><!--請選擇登入類型--></option>
                                        <option value="AD"><!--使用桌機帳號--></option>
                                        <option value="QAccount"><!--其他--></option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr id="tbxNameData">
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/126_icon_login_account.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td>
                                    <input class="login_control" type="text" data-clear-btn="false" name="tbxName" data-mini="true"
                                           id="tbxName" value="" placeholder="" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr id="tbxPasswordData">
                    <td class="control_icon_cell">
                        <img src="{{asset('/css/images/127_icon_login_password.png')}}" class="control_icon" />
                    </td>
                    <td class="control_cell">
                        <table>
                            <tr>
                                <td>
                                    <input class="login_control" type="password" data-clear-btn="false" name="tbxPassword" data-mini="true"
                                           id="tbxPassword" value="" placeholder="" />
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <div class="forget-text-content">
                *<div class="forget-text" id="info_cell_forget">忘記密碼請聯絡 </div>ITS*
            </div>
            <div class="btn-login" id="btnLogin" onclick="tryLogin()">
                <div class="btn-text">登入</div>
            </div>
            <div class="btn-login" id="btnOriLogin" onclick="oriLogin()" style="display:none;">
                <div class="btn-text">登入</div>
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
    <div data-role="page" id="pageRegister">
        <div role="main" class="ui-content">
            <img src="{{asset('/css/images/157_icon_success.png')}}" class="logo_register"/>
            <h3 id="info_cell_verify">帳號與設備驗證成功</h3>
            <div class="forget-text-content">
                *<div class="forget-text" id="info_cell_logout">若要註銷設備，請聯絡 </div>ITS*
            </div>
            <div class="btn-login" id="btnOK" onclick="start()">
                <div class="btn-text">好，我知道了</div>
            </div>
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
                $(".login_control").parent().css("background-color", "transparent");

                var showOriLogin = getQueryString("show_origin_login");
                if(showOriLogin && showOriLogin == "Y") {
                    $("#btnOriLogin").show();
                }
            };

            $("#ddlCompany").on("change", function() {
                var selectedValue = $(this).val();

                if (selectedValue.length == 0) {
                    $("#ddlLoginTypeData").hide();
                    loginBtnUI();
                    setTextForLoginType("none");

                    setTimeout(function() {
                        $("#ddlCompany-button > span").addClass("login_control_none");
                    }, 500);
                } else {
                    $("#ddlLoginTypeData").show();
                    loginBtnUI();

                    setTimeout(function() {
                        $("#ddlCompany-button > span").removeClass("login_control_none");
                    }, 500);

                    if (selectedValue === "shop") {
                        $("#ddlLoginType").attr("disabled", true);
                        $("#ddlLoginType").hide();
                        $("#ddlLoginType").parent().css("background-color", "#ededed");
                        $("#ddlLoginType-button").css("background", "rgb(237,237,237)");

                        $("#ddlLoginType").val("QAccount");
                        $("#ddlLoginType option:eq(2)").attr("selected", true);
                        $("#ddlLoginType").parent().find("span[class='login_control']").html($("#ddlLoginType option:eq(2)").text());
                    } else {
                        $("#ddlLoginType").attr("disabled", false);
                        $("#ddlLoginType").show();
                        $("#ddlLoginType").parent().css("background-color", "transparent");
                        $("#ddlLoginType-button").css("background", $("#ddlCompany-button").css("background"));

                        $("#ddlLoginType").val("AD");
                        $("#ddlLoginType option:eq(1)").attr("selected", true);
                        $("#ddlLoginType").parent().find("span[class='login_control']").html($("#ddlLoginType option:eq(1)").text());
                    }

                    $("#ddlLoginType").trigger("change");
                }
            });

            $("#ddlLoginType").on("change", function() {
                var selectedValue = $(this).val();
                setTextForLoginType(selectedValue);
            });

            //Handle bottom line
            $(".login_control").on("blur", function() {
                $("#main_table tr").css({
                    "border-bottom": "1px solid #D6D6D6"
                });
            });

            $(".login_control").on("focus", function() {
                var ID = $(this).attr("id");

                $("#main_table tr").css({
                    "border-bottom": "1px solid #D6D6D6"
                });

                $("#" + ID + "Data").css({
                    "border-bottom": "1px solid #009587"
                });
            });

            //Button [Enter] trigger Login
            $("#tbxName, #tbxPassword").on("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    tryLogin();
                }
            });

            //Page Event
            $("#pageRegister").one("pagebeforeshow", function(event, ui) {
                pageRegisterUI();
            });
        });

        function InitUI(){
            if(!login_lang_list){
                return;
            }
            $("#ddlCompany option:selected").attr('selected', false);
            $("#ddlCompany option").eq(0).text(login_lang_list["COMPANY"]);
            $("#ddlCompany-button > span").text(login_lang_list["COMPANY"]);
            //$("#tbxName").attr("placeholder",login_lang_list["NAME"]);
            //$("#tbxPassword").attr("placeholder",login_lang_list["PASSWORD"]);
            $("#btnLogin div").text(login_lang_list["LOGIN"]);
            $("#btnOriLogin div").text(login_lang_list["LOGIN"]);
            $("#btnOK div").text(login_lang_list["OK_IKNOW"]);
            $("#info_cell_forget").text(login_lang_list["FORGET_PWD"]);
            $("#messageContainer").text(login_lang_list["ERROR"]);
            $("#info_cell_verify").text(login_lang_list["VERIFY_SUCCESS"]);
            $("#info_cell_logout").text(login_lang_list["LOGOUT"]);

            if (window.localStorage) {
                if (window.localStorage.getItem("company") !== null) {
                    var $selectCompany =  $("#ddlCompany option[value='" + window.localStorage.getItem("company") + "']");
                    $selectCompany.attr('selected', true);

                    //set login_type by localStorage or by default
                    var logintTypeVal;
                    var loginTypeImdex;

                    if (window.localStorage.getItem("loginType") !== null){
                        if (window.localStorage.getItem("loginType") === "AD") {
                            logintTypeVal = "AD";
                            loginTypeImdex = 1;
                        } else {
                            logintTypeVal = "QAccount";
                            loginTypeImdex = 2;
                        }
                    } else {
                        logintTypeVal = "AD";
                        loginTypeImdex = 1;
                    }

                    $("#ddlLoginType option[value='" + logintTypeVal + "']").attr("selected", true);
                    setTimeout(function() {
                        $("#ddlCompany-button > span").text($selectCompany.text());
                        $("#ddlLoginType-button > span").text($("#ddlLoginType option:eq(" + loginTypeImdex + ")").text());
                    }, 500);

                    //set placeholder of Name & Password according to login_type
                    setTextForLoginType(logintTypeVal);

                    setTimeout(function() {
                        $("#ddlCompany-button > span").removeClass("login_control_none");
                    }, 500);
                } else {
                    $("#ddlLoginTypeData").hide();
                    setTextForLoginType("none");

                    setTimeout(function() {
                        $("#ddlCompany-button > span").addClass("login_control_none");
                    }, 500);
                }

                if (window.localStorage.getItem("userName") !== null) {
                    $("#tbxName").val(window.localStorage.getItem("userName"));
                }
            } else {
                $("#ddlLoginTypeData").hide();

                setTimeout(function() {
                    $("#ddlCompany-button > span").addClass("login_control_none");
                }, 500);
            }

            //set login_type option text
            $("#ddlLoginType option:eq(0)").text(login_lang_list["LOGIN_TYPE_OPTION_0"]);
            $("#ddlLoginType option:eq(1)").text(login_lang_list["LOGIN_TYPE_OPTION_1"]);
            $("#ddlLoginType option:eq(2)").text(login_lang_list["LOGIN_TYPE_OPTION_2"]);
            $("#ddlCompany option[value='shop']").text(login_lang_list["VENDOR"]);

            loginBtnUI();
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
            var loginType = $("#ddlLoginType").val();

            if( !$.trim(userName) || !$.trim(password) || !$.trim(company) || (loginType === "none") ) {

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
                            login(userName, password, company, uuid, loginType);
                        } else {
                            registerAndLogin(userName, password, company, uuid, device_type, loginType);
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
        
        var login = function (loginId, password, domain, uuid, loginType) {
            
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
                    request.setRequestHeader("loginType", loginType);
                },
                success: function (d, status, xhr) {
                    HideLoading();
                    if(d.result_code && d.result_code == 1) {
                        saveLoginInfo(loginId, domain, loginType);
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"company" : "' + d.content.company + '",'
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
        
        var registerAndLogin = function (loginId, password, domain, uuid, device_type, loginType) {
            
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
                    request.setRequestHeader("loginType", loginType);
                },
                success: function (d, status, xhr) {
                    HideLoading();
                    if(d.result_code && d.result_code == 1) {
                        saveLoginInfo(loginId, domain, loginType);
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"company" : "' + d.content.company + '",'
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

        var saveLoginInfo = function(userName, company, loginType){
            if(window.localStorage){
                if(window.localStorage.getItem("userName") === null|| window.localStorage.getItem("userName") != userName){
                    window.localStorage.setItem("userName", userName);            
                }
                if(window.localStorage.getItem("company") === null || window.localStorage.getItem("company") != company){
                    window.localStorage.setItem("company", company);
                }
                if(window.localStorage.getItem("loginType") === null || window.localStorage.getItem("loginType") != loginType){
                    window.localStorage.setItem("loginType", loginType);
                }
            }
        }

        function getSignature(action, signatureTime) {
            if (action === "getTime") {
                return Math.round(new Date().getTime()/1000);
            } else if (action === "getInBase64") {
                var hash = CryptoJS.HmacSHA256(signatureTime.toString(), appSecretKey);
                return CryptoJS.enc.Base64.stringify(hash);
            }
        }

        function setTextForLoginType(loginType) {
            var placeholderName;
            var placeholderPwd;

            $(".adaccount, .qaccount, #info_cell_forget, #info_cell_logout, .forget-text-content").hide();

            if (loginType === "none") {
                placeholderName = "";
                placeholderPwd = "";

                $("#tbxName").val("");
                setTimeout(function() {
                    $("#ddlLoginType-button > span").addClass("login_control_none");
                }, 500);
            } else if (loginType === "AD") {
                placeholderName = login_lang_list["NAME"];
                placeholderPwd = login_lang_list["PASSWORD"];

                $(".adaccount, #info_cell_forget, #info_cell_logout, .forget-text-content").show();
                setTimeout(function() {
                    $("#ddlLoginType-button > span").removeClass("login_control_none");
                }, 500);
            } else if (loginType === "QAccount") {
                placeholderName = login_lang_list["QACCOUNT_NAME"];
                placeholderPwd = login_lang_list["QACCOUNT_PASSWORD"];

                $(".qaccount, #info_cell_forget, #info_cell_logout, .forget-text-content").show();
                setTimeout(function() {
                    $("#ddlLoginType-button > span").removeClass("login_control_none");
                }, 500);
            }

            $("#tbxName").attr("placeholder", placeholderName);
            $("#tbxPassword").attr("placeholder", placeholderPwd);

            loginBtnUI();
        }

        function loginBtnUI() {
            var iconMarginTop = parseInt(document.documentElement.clientHeight * 12.87 / 100, 10);
            var iconHeight = parseInt(document.documentElement.clientWidth * 9.67 / 100, 10);
            var tableHeight = $("#main_table").height()
            var tableTop = parseInt($("#main_table").position().top, 10);
            var tableMarginTop = parseInt(document.documentElement.clientHeight * 19.11 / 100, 10);
            var tableMarginBottom = parseInt(document.documentElement.clientWidth * 3.6 / 100, 10);
            var textInfoMarginBottom = parseInt(document.documentElement.clientWidth * 5.39 / 100, 10);
            var textInfoHeight = parseInt(document.documentElement.clientWidth * 3.14 / 100, 10);
            var btnHeight = $("#btnLogin").height();

            var textContentMarginTop = document.documentElement.clientHeight - iconMarginTop - iconHeight - tableMarginTop - tableHeight -
                tableMarginBottom - textInfoMarginBottom*1.6 - textInfoHeight - btnHeight;
            var btnMarginTop = document.documentElement.clientHeight - tableHeight - tableTop - tableMarginTop - tableMarginBottom - btnHeight;

            $("#pageLogin .forget-text-content").css("margin-top", textContentMarginTop + "px");
            $(".btn-login").css("margin-top", btnMarginTop + "px");
        }

        function pageRegisterUI() {
            var iconMarginTop = parseInt(document.documentElement.clientWidth * 39 / 100, 10);
            var iconHeight = parseInt(document.documentElement.clientWidth * 19.65 / 100, 10);
            var textVerifyMarginTop = parseInt(document.documentElement.clientWidth * 8.57 / 100, 10);
            var textVerifyHeight = parseInt(document.documentElement.clientWidth * 4.18 / 100, 10);
            var btnHeight = parseInt(document.documentElement.clientWidth * 11.36 / 100, 10);
            var textInfoMarginBottom = parseInt(document.documentElement.clientWidth * 5.39 / 100, 10);
            var textInfoHeight = parseInt(document.documentElement.clientWidth * 3.14 / 100, 10);
            var btnTextMarginTop = parseInt(document.documentElement.clientWidth * 3.59 / 100, 10);

            var textContentMarginTop = document.documentElement.clientHeight - iconMarginTop - iconHeight - textVerifyMarginTop - textVerifyHeight
                - textInfoMarginBottom*2 - btnHeight - textInfoHeight;
            var btnMarginTop = document.documentElement.clientHeight - iconMarginTop - iconHeight - textVerifyMarginTop - textVerifyHeight - btnHeight
                - btnTextMarginTop;

            $("#pageRegister .forget-text-content").css("margin-top", textContentMarginTop + "px");
            $("#pageRegister .forget-text-content, #info_cell_logout").show();
            $("#pageRegister #btnOK").css("margin-top", btnMarginTop + "px");
        }

    </script>
@endsection