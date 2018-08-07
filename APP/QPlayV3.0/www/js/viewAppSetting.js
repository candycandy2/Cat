$("#viewAppSetting").pagecontainer({
    create: function (event, ui) {


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


        function uploadFile(queryData) {
            var self = this;

            this.successCallback = function (data) {
                console.log(data);
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                QStorageAPI("POST", true, "portrait", self.successCallback, self.failCallback, queryData, null);
            }();
        }

        /********************************** page event ***********************************/
        $("#viewAppSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewAppSetting").one("pageshow", function (event, ui) {
            //language string
            $('.name-user').text(loginData['loginid']);
            $('#viewAppSetting .ui-title div').text(langStr['str_082']);
            $('.normal-setting-name').text(langStr['str_083']);
            $('.qplay-version-name').text(langStr['str_081']);
            $('.want-comment-name').text(langStr['str_088']);
            $('.logout-fixed-btn').text(langStr['str_084']);

        });

        $("#viewAppSetting").on("pageshow", function (event, ui) {

        });

        $("#viewAppSetting").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //头像选择
        $('.photo-default').on('click', function () {
            $('.setting-mask').show();
        });

        //一般设定
        $('.normal-setting').on('click', function () {
            checkAppPage('viewGeneralSetting');
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
            $('#confirmLogout').popup('open');
        });

        //确定注销
        $("#logoutConfirm").on("click", function () {
            $('#confirmLogout').popup('close');
            loadingMask("show");
            var logout = new doLogOut();
        });

        //取消注销
        $("#logoutCancel").on("click", function () {
            $('#confirmLogout').popup('close');
        });

        //取消头像
        $('.cancel-choose').on('click', function () {
            $('.setting-mask').hide();
        });

        //相机
        $('.choose-camera').on('click', function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                sourceType: Camera.PictureSourceType.Camera,
                destinationType: Camera.DestinationType.FILE_URI
            });

            function onSuccess(imageURI) {
                console.log(imageURI);
                var myPhoto = document.getElementById('myPhoto');
                myPhoto.src = imageURI;
                $('.setting-mask').hide();

            }

            function onFail(message) {
                console.log('Failed because: ' + message);
            }
        });

        //图库
        $('.choose-picture').on('click', function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: Camera.DestinationType.DATA_URL
            });

            function onSuccess(imageData) {
                console.log(imageData);
                var myPhoto = document.getElementById('myPhoto');
                myPhoto.src = "data:image/jpeg;base64," + imageData;
                $('.setting-mask').hide();

                //Base64
                var formData = new FormData();
                formData.append('files', myPhoto.src);
                //uploadFile(formData);
            }

            function onFail(message) {
                console.log('Failed because: ' + message);
            }
        });

        //test
        $('#uploadBtn').on('click', function () {
            var file = $('#photoFile').get(0).files[0];
            var formData = new FormData();
            var img = 'file:///storage/emulated/0/Android/data/com.qplay.appqplaydev/cache/1533630978023.jpg'
            formData.append('files', img);
            
            console.log(file);

            //Call API
            //uploadFile(formData);

        });

    }
});