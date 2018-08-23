$("#viewAppList").pagecontainer({
    create: function(event, ui) {

        var checkAppInstallInterval = null,
            intervalCount = 0;

        //已知app分组，生成html
        function createAppListContent() {
            //1. 已下载
            var alreadydownloadContent = '';
            for (var i = 0; i < alreadyDownloadList.length; i++) {
                var packagename = null;
                var defaultAPPName = null;
                var appSummary = null;
                var defaultSummary = null;

                for (var j = 0; j < appmultilang.length; j++) {
                    if (applist[alreadyDownloadList[i]].app_code == appmultilang[j].project_code) {
                        //match browser language
                        if (appmultilang[j].lang == browserLanguage) {
                            packagename = appmultilang[j].app_name;
                            appSummary = appmultilang[j].app_summary;
                        }
                        //match default language: zh-tw
                        if (appmultilang[j].lang == applist[alreadyDownloadList[i]].default_lang) {
                            defaultAPPName = appmultilang[j].app_name;
                            defaultSummary = appmultilang[j].app_summary;
                        }
                    }
                }

                if (packagename == null) {
                    packagename = defaultAPPName;
                    appSummary = defaultSummary;
                }

                var appurlicon = applist[alreadyDownloadList[i]].icon_url;
                var appcode = applist[alreadyDownloadList[i]].app_code;

                alreadydownloadContent += '<div class="download-list"><div class="download-link" data-code="' +
                    appcode +
                    '"><div class="download-icon"><img src="' +
                    appurlicon +
                    '"></div><div class="download-name"><div class="font-style10">' +
                    packagename +
                    '</div><div class="font-style7">' +
                    appSummary +
                    '</div></div></div><div><img src="img/favorite_blank.png" class="favorite-btn" data-src="favorite_blank"></div></div>';
            }

            $('.already-download-list').html('').append(alreadydownloadContent);

            //2. 未下载
            var notdownloadContent = '';
            for (var i = 0; i < notDownloadList.length; i++) {
                var packagename = null;
                var defaultAPPName = null;
                var appSummary = null;
                var defaultSummary = null;

                for (var j = 0; j < appmultilang.length; j++) {
                    if (applist[notDownloadList[i]].app_code == appmultilang[j].project_code) {
                        //match browser language
                        if (appmultilang[j].lang == browserLanguage) {
                            packagename = appmultilang[j].app_name;
                            appSummary = appmultilang[j].app_summary;
                        }
                        //match default language: zh-tw
                        if (appmultilang[j].lang == applist[notDownloadList[i]].default_lang) {
                            defaultAPPName = appmultilang[j].app_name;
                            defaultSummary = appmultilang[j].app_summary;
                        }
                    }
                }

                if (packagename == null) {
                    packagename = defaultAPPName;
                    appSummary = defaultSummary;
                }

                var appurlicon = applist[notDownloadList[i]].icon_url;
                var appcode = applist[notDownloadList[i]].app_code;

                notdownloadContent += '<div class="download-list"><div class="download-link" data-code="' +
                    appcode +
                    '"><div class="download-icon"><img src="' +
                    appurlicon +
                    '"></div><div class="download-name"><div class="font-style10">' +
                    packagename +
                    '</div><div class="font-style7">' +
                    appSummary +
                    '</div></div></div><div><img src="img/download_icon.png" class="download-btn" data-src="download_icon"></div></div>';
            }

            $('.not-download-list').html('').append(notdownloadContent);

            //3. change favorite icon
            if (favoriteList != null) {
                changeFavoriteIcon();
            }

        }

        //change favorite icon after create content
        function changeFavoriteIcon() {
            $.each($('.favorite-btn'), function(index, item) {
                for (var i in favoriteList) {
                    if (favoriteList[i].app_code == $(item).parent().prev().attr('data-code')) {
                        $(item).attr('data-src', 'favorite_full');
                        $(item).attr('src', 'img/favorite_full.png');
                    }
                }
            });
        }

        //添加到最爱
        function setFavoriteList(code, name, status) {
            if (status) {
                for (var i in applist) {
                    if (code == applist[i].app_code) {
                        var appobj = {};
                        appobj = {
                            app_code: applist[i].app_code,
                            icon_url: applist[i].icon_url,
                            app_name: name,
                            package_name: applist[i].package_name.split('.')[2],
                        }
                        favoriteList.push(appobj);
                        break;
                    }
                }

                localStorage.setItem('favoriteList', JSON.stringify(favoriteList));

            } else {
                for (var i in favoriteList) {
                    if (code == favoriteList[i].app_code) {
                        favoriteList.splice(i, 1);
                        break;
                    }
                }

                localStorage.setItem('favoriteList', JSON.stringify(favoriteList));

            }

            //refresh applist
            $('.applistWidget').applist('refresh');
        }

        //get app index in applist
        function getIndexByCode(code) {
            for (var i in applist) {
                if (code == applist[i].app_code) {
                    return i;
                }
            }
        }

        //Check if APP is installed
        function checkAPPInstalled(callback, page) {

            callback = callback || null;

            var scheme;

            if (device.platform === 'iOS') {
                scheme = checkAPPKey + '://';
            } else if (device.platform === 'Android') {
                scheme = 'com.qplay.' + checkAPPKey;
            }

            window.testAPPInstalledCount = 0;

            window.testAPPInstalled = setInterval(function() {
                appAvailability.check(
                    scheme, //URI Scheme or Package Name
                    function() { //Success callback

                        if (page === "appDetail") {
                            var latest_version = appVersionRecord["com.qplay." + checkAPPKey]["latest_version"];
                            var installed_version = appVersionRecord["com.qplay." + checkAPPKey]["installed_version"];

                            if (latest_version === installed_version) {
                                loginData['updateApp'] = false;
                            } else {
                                loginData['updateApp'] = true;
                            }

                            callback(true);
                        } else if (page === "appList") {
                            callback(true);
                        }

                        checkAPPKeyInstalled = true;
                        stopTestAPPInstalled();
                    },
                    function() { //Error callback

                        if (page === "appDetail") {
                            callback(false);
                        } else if (page === "appList") {
                            callback(false);
                        }

                        checkAPPKeyInstalled = false;
                        stopTestAPPInstalled();
                    }
                );

                testAPPInstalledCount++;

                if (testAPPInstalledCount === 3) {
                    stopTestAPPInstalled();
                    location.reload();
                }
            }, 1000);

            window.stopTestAPPInstalled = function() {
                if (window.testAPPInstalled != null) {
                    clearInterval(window.testAPPInstalled);
                }
            };
        }

        //applist group by downloaded status
        function appGroupByDownload(responsecontent) {
            alreadyDownloadList = [], notDownloadList = [];
            applist = responsecontent.app_list;
            appmultilang = responsecontent.multi_lang;

            for (var i = 0; i < applist.length; i++) {
                //APP version record
                if (typeof appVersionRecord[applist[i].package_name] === 'undefined') {
                    appVersionRecord[applist[i].package_name] = {};
                    var packageName = applist[i].package_name;
                    var packageNameArr = packageName.split(".");
                    checkAPPKey = packageNameArr[2];

                    checkAPPInstalled(checkAppVersionCallback, "appList");
                    tempVersionArrData = appVersionRecord[applist[i].package_name]["installed_version"];
                    tempVersionData = applist[i].app_version.toString();
                }
                appVersionRecord[applist[i].package_name]["latest_version"] = applist[i].app_version.toString();

                //check app install，icon diff
                var appName = applist[i].package_name;
                var appNameArr = appName.split(".");
                var checkKey = appNameArr[2];
                checkAllAppInstalled(checkAppCallback, checkKey, i);
            }
        }

        function checkAllAppInstalled(callback, key, index) {

            //var thisAppKey = checkAPPKey;
            callback = callback || null;

            var scheme;

            if (device.platform === 'iOS') {
                scheme = key + '://';
            } else if (device.platform === 'Android') {
                scheme = 'com.qplay.' + key;
            }

            var testInstalled = function(i) {
                appAvailability.check(
                    scheme, //URI Scheme or Package Name
                    function() { //Success callback
                        callback(true, i);
                        //console.log(i);
                    },
                    function() { //Error callback
                        callback(false, i);
                    }
                );
            }(index);
        }

        function checkAppInstallAfterDownload(install, index) {
            //console.log(install + ',' + intervalCount);

            if (install) {
                //1. 清除定时器
                clearInterval(checkAppInstallInterval);
                intervalCount = 0;

                //2. 获取分組，async
                var responsecontent = JSON.parse(window.localStorage.getItem('QueryAppListData'))['content'];
                appGroupByDownload(responsecontent);

                //3. 重新生成html
                setTimeout(createAppListContent, 2000);

            } else if (!install && intervalCount == 100) {
                clearInterval(checkAppInstallInterval);
                intervalCount = 0;
            } else {
                intervalCount++;
            }
        }

        function setAppListHeight() {
            var mainHeight = $('.app-scroll > div').height();
            var headHeight = $('#viewAppList .page-header').height();
            var totalHeight;
            if (device.platform === "iOS") {
                totalHeight = (mainHeight + headHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (mainHeight + headHeight).toString();
            }
            $('.app-scroll > div').css('height', totalHeight + 'px');
        }

        /********************************** page event ***********************************/
        $("#viewAppList").on("pagebeforeshow", function(event, ui) {
        });

        $("#viewAppList").one("pageshow", function(event, ui) {
            loadingMask("show");

            var applist = new getAppList();
            window.appCheckTimer = setInterval(function() {
                var appList = window.localStorage.getItem('QueryAppListData');
                if (appList != null) {
                    clearInterval(window.appCheckTimer);
                    window.appCheckTimer = null;

                    var responsecontent = JSON.parse(appList)['content'];
                    appGroupByDownload(responsecontent);

                    var checkAppListData = setInterval(function() {
                        if (appCheckFinish) {
                            //clear interval
                            clearInterval(checkAppListData);
                            //create content
                            createAppListContent();
                            //set hieght
                            setAppListHeight();
                            loadingMask("hide");
                        }
                    }, 1000);
                    loadingMask("hide");
                }
            }, 500);

        });

        $("#viewAppList").on("pageshow", function(event, ui) {

        });

        $("#viewAppList").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //add or remove favorite app
        $('#viewAppList').on('click', '.favorite-btn', function() {
            var self = this;
            var src = $(self).attr('data-src');
            var appcode = $(self).parent().prev().attr('data-code');
            var appname = $(self).parent().prev().children().find('.font-style10').text();
            //console.log(appname);

            if (src == 'favorite_blank') {
                //1. change src
                $(self).attr('data-src', 'favorite_full');
                $(self).attr('src', 'img/favorite_full.png');

                //2. save local
                if (favoriteList == null) {
                    //review by alan
                    favoriteList = [];
                    setFavoriteList(appcode, appname, true);

                } else {
                    setFavoriteList(appcode, appname, true);
                }

            } else {
                //1. change src
                $(self).attr('data-src', 'favorite_blank');
                $(self).attr('src', 'img/favorite_blank.png');

                //2. remove local
                setFavoriteList(appcode, appname, false);
            }

        });

        //change page by app index
        $('#viewAppList').on('click', '.download-link', function() {
            var self = this;
            var appcode = $(self).attr('data-code');
            selectAppIndex = getIndexByCode(appcode);
            $.mobile.changePage('#viewAppDetail2-2');
        });

        //download app
        $('#viewAppList').on('click', '.download-btn', function() {
            var self = this;
            var appcode = $(self).parent().prev().attr('data-code');
            selectAppIndex = getIndexByCode(appcode);

            //copy from appdetail
            if (device.platform === "iOS") {

                if (selectAppIndex != null) {
                    addDownloadHit(applist[selectAppIndex].package_name);
                    window.open(applist[selectAppIndex].url, '_system'); //download app
                }
            } else { //android

                var pathArray = applist[selectAppIndex].url.split('/');
                var protocol = pathArray[0];
                if (protocol == "market:") {
                    addDownloadHit(applist[selectAppIndex].package_name);
                    window.open(applist[selectAppIndex].url, '_system'); //open url
                    //cordova.InAppBrowser.open(applist[selectAppIndex].url, '_system', 'location=yes');

                } else {

                    var permissions = cordova.plugins.permissions;
                    permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
                        if (status.hasPermission) {
                            addDownloadHit(applist[selectAppIndex].package_name);
                            var updateUrl = applist[selectAppIndex].url;
                            window.AppUpdate.AppUpdateNow(onSuccess, onFail, updateUrl);

                            function onFail() {}

                            function onSuccess() {}
                        } else {
                            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

                            function error() {
                                console.warn('WRITE_EXTERNAL_STORAGE permission is not turned on');
                            }

                            function success(status) {
                                if (status.hasPermission) {

                                    addDownloadHit(applist[selectAppIndex].package_name);
                                    var updateUrl = applist[selectAppIndex].url;
                                    window.AppUpdate.AppUpdateNow(onSuccess, onFail, updateUrl);

                                    function onFail() {}

                                    function onSuccess() {}
                                }
                            }
                        }
                    });
                }

            }

            //check app install setInterval
            var packageName = applist[selectAppIndex].package_name;
            var packageNameArr = packageName.split(".");
            checkAPPKey = packageNameArr[2];
            intervalCount = 0;

            checkAppInstallInterval = setInterval(function() {
                checkAllAppInstalled(checkAppInstallAfterDownload, checkAPPKey, selectAppIndex);
            }, 2000);

        });


    }
});