$("#viewAppSetting").pagecontainer({
    create: function(event, ui) {


        function doLogOut() {
            var self = this;

            //need User AD Account
            var queryStr = "&domain=" + loginData.domain + "&loginid=" + loginData.loginid;

            this.successCallback = function (data) {
                var resultcode = data['result_code'];

                if (resultcode == 1) {

                    //clear data
                    appApiPath = "qplayApi";
                    qplayAppKey = "appqplay";

                    //logout can not clear messagecontent / pushToken / msgDateFrom / appVersionRecord
                    var messagecontent = window.localStorage.getItem("messagecontent");
                    var pushToken = window.localStorage.getItem("pushToken");
                    var appVersionRecord = window.localStorage.getItem("appVersionRecord");
                    var storeMsgDateFrom = false;

                    if (window.localStorage.getItem("msgDateFrom") !== null) {
                        var msgDateFrom = window.localStorage.getItem("msgDateFrom");
                        storeMsgDateFrom = true;
                    }

                    loginData = {
                        versionName: "",
                        versionCode: "",
                        deviceType: "",
                        pushToken: "",
                        token: "",
                        token_valid: "",
                        uuid: "",
                        checksum: "",
                        domain: "",
                        emp_no: "",
                        loginid: "",
                        messagecontent: null,
                        msgDateFrom: null,
                        doLoginDataCallBack: false,
                        openMessage: false
                    };

                    window.localStorage.clear();

                    window.localStorage.setItem("messagecontent", messagecontent);
                    window.localStorage.setItem("pushToken", pushToken);
                    window.localStorage.setItem("appVersionRecord", appVersionRecord);

                    if (storeMsgDateFrom) {
                        window.localStorage.setItem("msgDateFrom", msgDateFrom);
                    }

                    $.mobile.changePage('#viewNotSignedIn');
                    //$("#viewMain2-1").removeClass("ui-page-active");
                    $("#viewMain3").removeClass("ui-page-active");
                    $("#viewNotSignedIn").addClass("ui-page-active");

                    // set need to login's layout when landscape
                    if (window.orientation === 90 || window.orientation === -90)
                        $('.main-updateAppVersion').css('top', (screen.height - $('.main-updateAppVersion').height()) / 4);

                    loadingMask("hide");
                    app.initialize();
                }
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                QPlayAPI("POST", "logout", self.successCallback, self.failCallback, null, queryStr);
            }();
        }


        /********************************** page event ***********************************/
        $("#viewAppSetting").on("pagebeforeshow", function(event, ui) {
            console.log("pagebeforeshow");
        });

        $("#viewAppSetting").one("pageshow", function(event, ui) {
            //language string
            $('.name-user').text(loginData['loginid']);
            $('#viewAppSetting .ui-title div').text(langStr['str_082']);
            $('.normal-setting-name').text(langStr['str_083']);
            $('.qplay-version-name').text(langStr['str_081']);
            $('.want-comment-name').text(langStr['str_088']);
            $('.logout-fixed-btn').text(langStr['str_084']);

            //logout popup
            var eventLogoutConfirmPopupData = {
                id: "logoutPopup",
                content: $("template#tplContactUserPopup").html()
            };
            tplJS.Popup("viewAppSetting", "settingContent", "append", eventLogoutConfirmPopupData);
        });

        $("#viewAppSetting").on("pageshow", function(event, ui) {

        });

        $("#viewAppSetting").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //一般设定
        $('.normal-setting').on('click', function () {
            checkAppPage('viewDefaultSetting');
        });

        //QPlay版本记录
        $('.qplay-version').on('click', function () {
            versionFrom = true;
            checkAppPage('viewVersionRecord');
        });

        //我要评论
        $('.want-comment').on('click', function () {
            checkAppPage('viewMyEvaluation');
        });

        //注销
        $("#logout").on("click", function () {
            $('#logoutPopup').popup('open');
        });

        $(document).on("click", "#logoutPopup #logoutConfirm", function () {
            $('#logoutPopup').popup('close');
            loadingMask("show");
            var logout = new doLogOut();
        });

        $(document).on("click", "#logoutPopup #logoutCancel", function () {
            $('#logoutPopup').popup('close');
        });



    }
});