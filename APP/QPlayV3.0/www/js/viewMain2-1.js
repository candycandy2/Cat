$("#viewMain2-1").pagecontainer({
    create: function(event, ui) {

        // var tempVersionArrData;
        // var tempVersionData;

        /********************************** function *************************************/
        //Event List No Data Popup  
        function FillAppList(responsecontent) {

            appcategorylist = responsecontent.app_category_list;
            applist = responsecontent.app_list;
            appmultilang = responsecontent.multi_lang;

            $('#appcontent').html("");

            for (var categoryindex = 0; categoryindex < appcategorylist.length; categoryindex++) {
                var catetoryName = appcategorylist[categoryindex].app_category;
                var catetoryID = appcategorylist[categoryindex].category_id;
                var content = "";
                var catetoryAPPCount = 0;

                if (categoryindex > 0) {
                    content += '<hr class="app-list-hr">';
                }
                content += '<span class="app-list-category">' + catetoryName + '</span>';
                content += '<div id="qplayapplist' + categoryindex + '" class="app-list-scroll-area"><div id="qplayapplistContent' + categoryindex + '" style="width:auto;">';

                for (var appindex = 0; appindex < applist.length; appindex++) {

                    var appcategory = applist[appindex].app_category_id;

                    if (appcategory == catetoryID) {

                        //APP version record
                        if (appVersionRecord[applist[appindex].package_name] === undefined) {
                            appVersionRecord[applist[appindex].package_name] = {};

                            //For old APP Version
                            var packageName = applist[appindex].package_name;
                            var packageNameArr = packageName.split(".");
                            checkAPPKey = packageNameArr[2];

                            checkAPPInstalled(checkAPPOldVersion, "appList");
                            tempVersionArrData = appVersionRecord[applist[appindex].package_name]["installed_version"];
                            tempVersionData = applist[appindex].app_version.toString();
                        }
                        appVersionRecord[applist[appindex].package_name]["latest_version"] = applist[appindex].app_version.toString();

                        catetoryAPPCount++;

                        //Find the specific language of APP Name to display,
                        //if can not find the language to match the browser language,
                        //display the default language of APP, which set in QPlay Website
                        var packagename = null;
                        var defaultAPPName = null;

                        for (var multilangIndex = 0; multilangIndex < appmultilang.length; multilangIndex++) {
                            if (applist[appindex].app_code == appmultilang[multilangIndex].project_code) {
                                //match browser language
                                if (appmultilang[multilangIndex].lang == browserLanguage) {
                                    packagename = appmultilang[multilangIndex].app_name;
                                }
                                //match default language: zh-tw
                                if (appmultilang[multilangIndex].lang == applist[appindex].default_lang) {
                                    defaultAPPName = appmultilang[multilangIndex].app_name;
                                }
                            }
                        }

                        if (packagename == null) {
                            packagename = defaultAPPName;
                        }

                        var appurl = applist[appindex].url;
                        var appurlicon = applist[appindex].icon_url;

                        content += "<div class='app-list-item'><a value=" + appindex.toString() + " id='application" + appindex.toString() + "'  href='#appdetail2-2'>";
                        content += "<img src='" + applist[appindex].icon_url + "' style='width:25vw;'></a>";
                        content += "<p class='app-list-name'>" + packagename + "</p></div>";
                    }

                    if (parseInt(appindex + 1, 10) == applist.length) {
                        content += '</div></div>';
                        $('#appcontent').append(content);
                    }
                }

                //auto set with of qplayapplistContent
                var pageWidth = $("#viewMain2-1").width();
                //Add (APP width) and (Margin width)
                var catetoryAPPWidth = (catetoryAPPCount * pageWidth * 0.25) + (catetoryAPPCount * (pageWidth * 0.04));
                $("#qplayapplistContent" + categoryindex).css("width", catetoryAPPWidth + "px");
            }

            checkAPPVersionRecord("updateFromAPI");

            $('a[id^="application"]').click(function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();

                selectAppIndex = this.getAttribute('value');
                $.mobile.changePage('#viewAppDetail2-2');
            });

            loadingMask("hide");
            $("#appcontent").show();

            //for jump to detail page
            openAppDetailCheck();
        }

        function QueryAppList() {
            var self = this;

            this.successCallback = function(data) {
                var resultcode = data['result_code'];

                if (resultcode == 1) {

                    //save to local data
                    window.localStorage.removeItem('QueryAppListData');
                    var jsonData = {};
                    jsonData = {
                        lastUpdateTime: new Date(),
                        content: data['content']
                    };
                    window.localStorage.setItem('QueryAppListData', JSON.stringify(jsonData));

                    //record APP all data
                    var responsecontent = data['content'];
                    FillAppList(responsecontent);

                } else {

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {

                var limitSeconds = 1 * 60 * 60 * 24;
                var QueryAppListData = JSON.parse(window.localStorage.getItem('QueryAppListData'));
                if (loginData["versionName"].indexOf("Staging") !== -1) {
                    limitSeconds = 1;
                } else if (loginData["versionName"].indexOf("Development") !== -1) {
                    limitSeconds = 1;
                }
                if (QueryAppListData === null || checkDataExpired(QueryAppListData['lastUpdateTime'], limitSeconds, 'ss')) {
                    QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
                } else {
                    var responsecontent = JSON.parse(window.localStorage.getItem('QueryAppListData'))['content'];
                    FillAppList(responsecontent);
                }

            }();

        }

        window.checkAPPOldVersion = function(oldVersionExist) {
            if (oldVersionExist) {
                tempVersionArrData = "1";
            } else {
                tempVersionArrData = tempVersionData;
            }

            checkAPPVersionRecord("updateFromAPI");
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
                    $("#viewMain2-1").removeClass("ui-page-active");
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

        function openAppDetailCheck() {
            //For other APP doing update
            if (loginData['openAppDetailPage'] === true) {
                for (var appindex = 0; appindex < applist.length; appindex++) {
                    if (applist[appindex].package_name == "com.qplay." + openAppName) {
                        selectAppIndex = appindex;
                        $.mobile.changePage('#viewAppDetail2-2');
                        loginData['openAppDetailPage'] = false;
                        break;
                    }
                }
            }
        }


        /********************************** page event *************************************/
        $("#viewMain2-1").one("pagebeforeshow", function(event, ui) {
            //Append Event Type Panel
            var eventTypePanelHTML = $("template#tplEventTypePanel").html();
            var eventTypePanel = $(eventTypePanelHTML);
            $("body").append(eventTypePanel);

            $("#eventTypeSelect").panel({
                display: "overlay",
                swipeClose: false,
                dismissible: true,
                beforeopen: function() {
                    $("<div class='ui-panel-background'></div>").appendTo("body");

                    $(".ui-panel").css({
                        "min-height": "100vh",
                        "max-height": "100vh",
                        "touch-action": "none"
                    });

                    if (device.platform === "iOS") {
                        var heightView = parseInt(document.documentElement.clientHeight * 100 / 100, 10);
                        var heightPanel = heightView - iOSFixedTopPX();

                        $("#eventTypeSelect").css({
                            'min-height': heightPanel + 'px',
                            'max-height': heightPanel + 'px',
                            'margin-top': iOSFixedTopPX() + 'px'
                        });
                    }
                },
                open: function() {
                    tplJS.preventPageScroll();
                },
                close: function() {
                    $(".ui-panel-background").remove();
                    tplJS.recoveryPageScroll();
                }
            });

            //Event Type click event
            $(document).on("click", "#eventTypeSelect .item", function() {
                $("#eventTypeSelect").panel("close");
            });

            $(document).on("click", "#eventTypeSelect #home", function() {
                $.mobile.changePage('#viewMain2-1');
            });

            $(document).on("click", "#eventTypeSelect #qplay3", function() {
                $.mobile.changePage('#viewMain3');
            });

            $(document).on("click", "#eventTypeSelect .option", function() {
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
                var activePageID = activePage[0].id;

                eventType = $(this).prop("id");

                if (eventType === "Event" || eventType === "News") {
                    if (activePageID === "viewMain2-1") {
                        $.mobile.changePage('#viewNewsEvents2-3');
                    } else {
                        var messageList = new QueryMessageList();
                    }
                } else {
                    if (activePageID === "viewMain2-1" || activePageID === "viewMain3") {
                        $.mobile.changePage('#viewNewsEvents2-3');
                    } else {
                        QueryPortalList(eventType);
                    }
                }
            });

        });

        $("#viewMain2-1").scroll(function() {
            if ($('#appcontent').offset().top < 50) {
                if (pullControl != null) {
                    pullControl.destroy();
                    pullControl = null;
                }
            } else {
                if (pullControl == null) {

                    pullControl = PullToRefresh.init({
                        mainElement: '#appcontent',
                        onRefresh: function() {
                            //do something for refresh
                            window.localStorage.removeItem('QueryAppListData'); //enforce to refresh
                            var appList = new QueryAppList();
                        }
                    });
                }
            }
        });

        var pullControl = null;
        $("#viewMain2-1").on("pageshow", function(event, ui) {
            loadingMask("show");
            var appList = new QueryAppList();
            pullControl = PullToRefresh.init({
                mainElement: '#appcontent',
                onRefresh: function() {
                    //do something for refresh
                    window.localStorage.removeItem('QueryAppListData'); //enforce to refresh
                    var appList = new QueryAppList();
                }
            });
        });

        $("#viewMain2-1").on("pagehide", function(event, ui) {
            if (pullControl != null) {
                pullControl.destroy();
                pullControl = null;
            }
        });


    }
});