$("#viewAppSetting").pagecontainer({
    create: function (event, ui) {

        //注销
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
                    var messagecontent = window.localStorage.getItem('messagecontentEx');
                    var pushToken = window.localStorage.getItem("pushToken");
                    var appVersionRecord = window.localStorage.getItem("appVersionRecord");
                    var storeMsgDateFrom = false;

                    if (window.localStorage.getItem("msgDateFrom") !== null) {
                        var msgDateFrom = window.localStorage.getItem("msgDateFrom");
                        storeMsgDateFrom = true;
                    }

                    loginData = {
                        company: "",
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

                    window.localStorage.setItem('messagecontentEx', messagecontent);
                    window.localStorage.setItem("pushToken", pushToken);
                    window.localStorage.setItem("appVersionRecord", appVersionRecord);

                    if (storeMsgDateFrom) {
                        window.localStorage.setItem("msgDateFrom", msgDateFrom);
                    }

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

        //头像上传API
        function uploadFile(queryData) {
            var self = this;

            this.successCallback = function (data) {
                console.log(data);

                if (data['ResultCode'] == '1') {
                    loadingMask("hide");
                    //更新当前头像
                    checkPhotoUpload($('#myPhoto'));
                    //成功提示
                    $("#uploadSuccess").fadeIn(100).delay(2000).fadeOut(100);
                    //更新首页头像
                    $('.reserveWidget').reserve('refresh');

                } else {
                    loadingMask("hide");
                    $("#uploadFail").fadeIn(100).delay(2000).fadeOut(100);

                }

            };

            this.failCallback = function (data) {
                $("#uploadFail").fadeIn(100).delay(2000).fadeOut(100);
            };

            var __construct = function () {
                QStorageAPI("POST", true, "portrait", self.successCallback, self.failCallback, queryData, null);
            }();
        }

        //base64转file
        function dataURLtoFile(dataurl, filename) {
            filename = filename || 'photo.jpg';

            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        }

        //检查该用户是否能修改密码
        function checkUserChangePwd() {
            var function_list = JSON.parse(window.localStorage.getItem('FunctionData'))['function_list'];
            for (var i in function_list) {
                //1. 先找到News
                if (function_list[i].function_variable == 'ChangePassword') {
                    //2. 再检查是否可用
                    if (function_list[i].function_content.right == 'Y') {
                        $('.change-password').show();
                    } else {
                        $('.change-password').hide();
                    }
                    break;
                }
            }
        }

        //检查是否上传过头像
        function checkPhotoUpload($target) {
            //var url = 'https://bqgroupstoragedev.blob.core.windows.net/appqplaydev-portrait/1705055/1705055_1024.png';
            var env = '';

            if (loginData["versionName"].indexOf("Staging") !== -1) {
                env = 'test';
            } else if (loginData["versionName"].indexOf("Development") !== -1) {
                env = 'dev';
            }

            var dateTime = Date.now();
            var timeStamp = Math.floor(dateTime / 1000);

            var url = 'https://bqgroupstorage' + env + '.blob.core.windows.net/appqplay' + env +
                '-portrait/' + loginData.emp_no + '/' + loginData.emp_no + '_1024.png?v=' + timeStamp;

            $.get(url).success(function () {
                $target.attr('src', url);
            });
        }

        var clearSuccess = function (status) {
            console.log('Message: ' + status);

            //1. 成功提示
            $("#clearSuccess").fadeIn(100).delay(2000).fadeOut(100);

            //2. clear widget
            widget.clear();

            //3. remove localStorage
            window.localStorage.removeItem('FunctionList');

        }

        var clearError = function (status) {
            console.log('Error: ' + status);
        }

        /********************************** page event ***********************************/
        $("#viewAppSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewAppSetting").one("pageshow", function (event, ui) {
            //user name
            $('.name-user').text(loginData['loginid']);

            //check can use changepassword
            checkUserChangePwd();

            //check photo
            checkPhotoUpload($('#myPhoto'));
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
            window.sessionStorage.setItem('checkAPPKey', qplayAppKey);
            checkAppPage('viewVersionRecord');
        });

        //我要评论
        $('.want-comment').on('click', function () {
            checkAppPage('viewMyEvaluation');
        });

        //清理缓存
        $('.clear-cache').on('click', function () {
            window.CacheClear(clearSuccess, clearError);
        });

        //修改密码
        $('.change-password').on('click', function () {
            checkWidgetPage('viewShopChangePwd');
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
            $('.setting-mask').hide();

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                sourceType: Camera.PictureSourceType.Camera,
                //destinationType: Camera.DestinationType.FILE_URI,
                destinationType: Camera.DestinationType.DATA_URL,
                saveToPhotoAlbum: true,
                allowEdit: true,
                targetWidth: 500,
                targetHeight: 500
            });

            function onSuccess(imageURI) {
                //1. get base64
                var url = 'data:image/jpeg;base64,' + imageURI;

                //2. base64 to file
                var file = dataURLtoFile(url);

                //3. formData
                var formData = new FormData();
                formData.append('files', file);

                //4. QStorage API
                var upload = uploadFile(formData);

                loadingMask("show");
            }

            function onFail(message) {
                console.log('Failed because: ' + message);
                //$("#cameraFail").fadeIn(100).delay(2000).fadeOut(100);
            }
        });

        //图库
        $('.choose-picture').on('click', function () {
            $('.setting-mask').hide();

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                targetWidth: 500,
                targetHeight: 500
            });

            function onSuccess(imageURI) {
                //1. get base64
                var url = 'data:image/jpeg;base64,' + imageURI;

                //2. base64 to file
                var file = dataURLtoFile(url);

                //3. formData
                var formData = new FormData();
                formData.append('files', file);

                //4. QStorage API
                var upload = uploadFile(formData);

                loadingMask("show");
            }

            function onFail(message) {
                console.log('Failed because: ' + message);
                //$("#cameraFail").fadeIn(100).delay(2000).fadeOut(100);
            }
        });


    }
});