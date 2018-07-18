$("#viewMain3").pagecontainer({
    create: function (event, ui) {

        var loadAndRunScript = function (index, enabled) {
            //1. 条件判断
            if (index >= widgetList.length) {
                return;
            } else if (!enabled) {
                loadAndRunScript(index + 1, widgetList[index + 1] != undefined ? widgetList[index + 1].enabled : false);
            }

            //2. widget
            var widgetItem = widgetList[index].name + "Widget";

            //3. container
            var contentItem = $('<div class="' + widgetItem + '"></div>');
            $('#widgetList').append(contentItem);

            //4. localStorage
            sessionStorage.setItem('widgetItem', widgetItem);

            //5. load js
            //$.getScript("http://qplaydev.benq.com/widgetDemo/" + widgetList[index].name + "/" + widgetList[index].name + ".js")
            $.getScript(serverURL + "/widget/" + widgetList[index].name + "/" + widgetList[index].name + ".js")
                .done(function (script, textStatus) {
                    loadAndRunScript(index + 1, widgetList[index + 1] != undefined ? widgetList[index + 1].enabled : false);
                })
                .fail(function (jqxhr, settings, exception) {
                    console.log("Triggered ajaxError handler.");
                });
        };


        function doLogOut() {
            var self = this;

            //need User AD Account
            var queryStr = "&domain=" + loginData.domain + "&loginid=" + loginData.loginid;

            this.successCallback = function(data) {
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

            this.failCallback = function(data) {};

            var __construct = function() {
                QPlayAPI("POST", "logout", self.successCallback, self.failCallback, null, queryStr);
            }();
        }

        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function (event, ui) {
            var eventLogoutConfirmPopupData = {
                id: "logoutConfirm",
                content: $("template#tplContactUserPopup").html()
            };
            tplJS.Popup("viewMain3", "widgetListContent", "append", eventLogoutConfirmPopupData);
        });

        $("#viewMain3").on("pagebeforeshow", function (event, ui) {
            if (viewMainInitial) {
                //1. load widget
                loadAndRunScript(0, widgetList[0].enabled);

                //2. get message
                if (!callGetMessageList && loginData["msgDateFrom"] === null) {
                    msgDateFromType = 'month';
                    var clientTimestamp = getTimestamp();
                    loginData["msgDateFrom"] = parseInt(clientTimestamp - 60 * 60 * 24 * 30, 10);
                    var messageList = new QueryMessageList();
                }

                viewMainInitial = false;
            }
        });

        $("#viewMain3").on("pageshow", function (event, ui) {

        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转到行事历
        $('#widgetList').on('click', '.personal-res', function () {
            $.mobile.changePage('#viewMyCalendar');
            //checkAppPage('viewMyCalendar');
        });

        //最爱列表打开APP
        $('#widgetList').on('click', '.applist-item', function () {
            var schemeURL = $(this).attr('data-name') + createAPPSchemeURL();
            openAPP(schemeURL);
        });

        //点击添加按钮跳转到APPList
        $('#widgetList').on('click', '.add-favorite-list', function () {
            $.mobile.changePage('#viewAppList');
            //checkAppPage('viewAppList');
        });

        //点击Link跳转到APPList
        $('.applist-link').on('click', function () {
            $.mobile.changePage('#viewAppList');
            //checkAppPage('viewAppList');
        });

        //点击widget内message，跳转到message详情页
        $('#widgetList').on('click', '.widget-msg-list', function () {
            massageFrom = 'viewMain3';
            messageRowId = $(this).attr('data-rowid');
            $.mobile.changePage('#viewWebNews2-3-1');
        });

        //跳转到MessageList
        $('.message-link').on('click', function () {
            //$.mobile.changePage('#viewMessageList');
            checkAppPage('viewMessageList');
        });

        //跳转到FAQ
        $('.faq-link').on('click', function () {
            //$.mobile.changePage('#viewFAQ');
            checkAppPage('viewFAQ');
        });

        //Test
        $('.scroll-test-link').on('click', function () {
            //$.mobile.changePage('#viewScrollTest');
            checkAppPage('viewScrollTest');
        });

        //注销
        $("#logout").on("click", function () {
            $('#logoutConfirm').popup('open');
        });

        $(document).on("click", "#logoutConfirm #confirm", function () {
            $('#logoutConfirm').popup('close');
            loadingMask("show");
            var logout = new doLogOut();
        });

        $(document).on("click", "#logoutConfirm #cancel", function () {
            $('#logoutConfirm').popup('close');
        });





    }

});