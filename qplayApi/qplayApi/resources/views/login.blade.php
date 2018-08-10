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
            margin: 15vh 0 3.6vw 0;
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
            font:3.2vw "Arial";
            color: #666666; 
        }
        #info_cell{
         color: #0f0f0f;
         font: 3.2vw 'Arial';
         width: 80%;
         margin: 3vh auto auto auto;
         text-alig: center;
         padding-top: 0;   
        }
        #env_info {
            color: red;
            font-size:6.8vw;
            position:absolute;
            z-index: 2;
            margin-left: auto;
            margin-right: auto;
            left:0;
            right:0;
        }
        @media screen and (orientation: portrait) {
          img.logo{
            height:20vh;
          }
          img.logo_register{
            height:13vh;
          }
        }
        @media screen and (orientation: landscape) {
          img.logo{
            height:36vw;
          }
          img.logo_register{
            height:24vw;
          }
        }
    </style>
    <div data-role="page" id="pageLogin" style="font-family: 'Arial';">
        <div role="main" class="ui-content" style="text-align: center;margin: 10vh 3.71vw 0 3.71vw;">
            <img src="{{asset('/css/images/login_logo.png')}}" class="logo"/>
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
                <tr id="loginTypeData">
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
            <div style="margin-top: 6vh;">
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
    <div data-role="page" id="pageRegister" style="font-family: 'Arial';">
        <div role="main" class="ui-content" style="text-align: center;margin: 27vh 3.71vw 0 3.71vw;">
            <img src="{{asset('/css/images/verified_img.png')}}" class="logo_register"/>
            <h3 id="info_cell_verify" style="color: #0f0f0f;font:6.6vw 'Arial';margin-top:3vh;">帳號與設備驗證成功</h3> 
            <table id="main_table" style="height: 10vh">
               
            </table>
            <div style="margin-top: 6vh;">
                <div id="button_cell">
                    <button id="btnOK" class="ui-btn ui-btn-corner-all login_button" style="color:white;background-color: #492e80;font:4vw 'Arial';text-transform: none;line-height: 1em;width: 64vw;text-shadow: none;"
                            onclick="start()">好，我知道了</button>
                </div>
                <div id="info_cell">
                    <span id="info_cell_logout" >若要註銷設備，請聯絡 </span><a class="linkITS" href="mailto:QPlay@BenQ.com">ITS</a>
                </div>
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

                $("#ddlCompany-button").css("padding-left","3vw");
                var showOriLogin = getQueryString("show_origin_login");
                if(showOriLogin && showOriLogin == "Y") {
                    $("#btnOriLogin").show();
                }
            };

            $("#ddlCompany").on("change", function() {
                var selectedValue = $(this).val();

                if (selectedValue.length == 0) {
                    $("#loginTypeData").hide();
                } else {
                    $("#loginTypeData").show();

                    if (selectedValue === "shop") {
                        $("#ddlLoginType").attr("disabled", true);
                        $("#ddlLoginType").parent().css("background-color", "#ededed");

                        $("#ddlLoginType").val("QAccount");
                        $("#ddlLoginType option:eq(2)").attr("selected", true);
                        $("#ddlLoginType").parent().find("span[class='login_control']").html($("#ddlLoginType option:eq(2)").text());
                    } else {
                        $("#ddlLoginType").attr("disabled", false);
                        $("#ddlLoginType").parent().css("background-color", "transparent");

                        $("#ddlLoginType").val("none");
                        $("#ddlLoginType option:eq(0)").attr("selected", true);
                        $("#ddlLoginType").parent().find("span[class='login_control']").html($("#ddlLoginType option:eq(0)").text());
                    }
                }
            });
        });

        function InitUI(){
            if(!login_lang_list){
                return;
            }
            $("#ddlCompany option:selected").attr('selected', false);
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
            if(window.localStorage){
                if(window.localStorage.getItem("userName") !== null){
                     $("#tbxName").val(window.localStorage.getItem("userName"));
                }
                if(window.localStorage.getItem("company") !== null){  
                    var $selectCompany =  $("#ddlCompany option[value='" + window.localStorage.getItem("company") + "']");
                    $selectCompany.attr('selected', true);
                    $("#ddlCompany-button > span").text($selectCompany.text());

                    //set login_type in default
                    $("#ddlLoginType option[value='none']").attr("selected", true);
                    setTimeout(function() {
                        $("#ddlLoginType-button > span").text($("#ddlLoginType option:eq(0)").text());
                    }, 500);
                } else {
                    $("#loginTypeData").hide();
                }
            } else {
                $("#loginTypeData").hide();
            }

            //set login_type option text
            $("#ddlLoginType option:eq(0)").text(login_lang_list["LOGIN_TYPE_OPTION_0"]);
            $("#ddlLoginType option:eq(1)").text(login_lang_list["LOGIN_TYPE_OPTION_1"]);
            $("#ddlLoginType option:eq(2)").text(login_lang_list["LOGIN_TYPE_OPTION_2"]);
            $("#ddlCompany option[value='shop']").text(login_lang_list["VENDOR"]);
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
                        saveLoginInfo(loginId, domain);
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"company" : "' + d.content.company + '",'
                                + '"ad_flag" : "' + d.content.ad_flag + '",'
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
                        saveLoginInfo(loginId, domain);
                        LoginMsg = '{"token_valid" : "' +  d.token_valid + '", '
                                + '"uuid" : "' + d.content.uuid + '", '
                                + '"redirect-uri" : "' + d.content.redirect_uri + '", '
                                + '"token" : "' + d.content.token + '", '
                                + '"loginid" : "' + d.content.loginid + '", '
                                + '"emp_no" : "' + d.content.emp_no + '",'
                                + '"domain" : "' + d.content.domain + '",'
                                + '"company" : "' + d.content.company + '",'
                                + '"ad_flag" : "' + d.content.ad_flag + '",'
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

        var saveLoginInfo = function(userName, company){
            if(window.localStorage){
                if(window.localStorage.getItem("userName") === null|| window.localStorage.getItem("userName") != userName){
                    window.localStorage.setItem("userName", userName);            
                }
                if(window.localStorage.getItem("company") === null || window.localStorage.getItem("company") != company){
                    window.localStorage.setItem("company", company);
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


    </script>
@endsection