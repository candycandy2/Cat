$("#viewAppDetail2-2").pagecontainer({
    create: function(event, ui) {

        var pageHeight = null,
            offsetArr = [],
            imgItemLength;

        /********************************** function *************************************/

        function displayAppDetailStep1() {

            $("#appDetailIcon").attr("src", applist[selectAppIndex].icon_url);

            //Check if APP is installed
            var packageName = applist[selectAppIndex].package_name;
            var packageNameArr = packageName.split(".");
            window.sessionStorage.setItem('checkAPPKey', packageNameArr[2]); //for viewVersionRecord
            appDetailInstalled(appDetailCallback, packageNameArr[2]);

            //Find the specific language to display,
            //if can not find the language to match the browser language,
            //display the default language of APP, which set in QPlay Website
            var languageIndex;
            var defaultLangIndex;

            for (var multilangIndex = 0; multilangIndex < appmultilang.length; multilangIndex++) {
                if (applist[selectAppIndex].app_code == appmultilang[multilangIndex].project_code) {
                    //match browser language
                    if (appmultilang[multilangIndex].lang == browserLanguage) {
                        languageIndex = multilangIndex;
                    }
                    //match default language of APP
                    if (appmultilang[multilangIndex].lang == applist[selectAppIndex].default_lang) {
                        defaultLangIndex = multilangIndex;
                    }
                }
            }

            if (languageIndex == null) {
                languageIndex = defaultLangIndex;
            }

            $("#appDetailAppName").html(appmultilang[languageIndex].app_name);
            $("#appDetailAppSummary").html(appmultilang[languageIndex].app_summary);
            $("#appDetailAppVersion").html(applist[selectAppIndex].app_version_name);
            var appSize = new Number(applist[selectAppIndex].size / 1024.0 / 1024.0);
            $("#appDetailAppSize").html(appSize.toFixed(2) + " M");

            var appranking = applist[selectAppIndex].avg_score;

            var platform = device.platform.toLowerCase();
            var content = "";
            var fullContent = "";
            var piclist = appmultilang[languageIndex].pic_list;
            var indexNow = 0;

            $('#appDetailPicListContent').html("");

            for (var listIndex = 0; listIndex < piclist.length; listIndex++) {
                if (piclist[listIndex].pic_type === platform + "_screenshot") {
                    content += "<div class='detail-img-style' data-index=" + listIndex + "><img src=" + piclist[listIndex].pic_url + " width='100%' height='100%'></div>";
                    fullContent += "<div class='detail-img-style-full-screen' data-index=" + listIndex + "><img src=" + piclist[listIndex].pic_url + " width='100%' height='100%'></div>";
                }
            }

            $('#appDetailPicListContent').append(content);
            $("#appDetailPicListFullScreen").html('').append(fullContent);

            //Auto resize appDetailPicListContent
            var pageWidth = $("#viewAppDetail2-2").width();
            var tempIMG = $(".detail-img-style")[0];
            var tempIMGFull = $(".detail-img-style-full-screen")[0];
            var imgWidth = tempIMG.clientWidth;
            var imgWidthFull = $(tempIMGFull).width();
            var picListContentWidth = (imgWidth + 2 + pageWidth * 0.037) * piclist.length;
            var picListContentWidthFull = (imgWidthFull + 2 + pageWidth * 0.037) * piclist.length;
            $("#appDetailPicListContent").css("width", picListContentWidth + "px");
            $("#appDetailPicListFullScreen").css("width", picListContentWidthFull + "px");

            //detail-description, the text content can't over 3 lines,
            //if text content is too long, show/hide open button
            var appDescription = appmultilang[languageIndex].app_description.replace(/\n/g, "<br>");
            $("#appDetailAppDescription").css("height", "auto");
            $("#appDetailAppDescription").html(appDescription);

            var descriptionHeight = $("#appDetailAppDescription").height();
            var textHeight = parseInt(window.screen.height * 0.024, 10);
            var adjustHeight = textHeight * 3 - descriptionHeight;

            if (descriptionHeight >= (textHeight * 3)) {
                $("#appDetailAppDescription").addClass("detail-description-ellipsis");
                $("#appDetailAppDescription").css({
                    "max-height": "3.4em",
                    "line-height": "1.2em"
                });
                $(".detail-description-open").show();
            } else {
                $("#appDetailAppDescription").removeClass("detail-description-ellipsis");
                $("#appDetailAppDescription").css({
                    "max-height": "none",
                    "line-height": "3.4vh"
                });
                $(".detail-description-open").hide();

                $("#appDetailAppDescription").css("height", parseInt(descriptionHeight + adjustHeight, 10) + "px");
            }

            //add by allen -- initial data
            offsetArr = [];
            imgItemLength = piclist.length;
        }

        function appDetailInstalled(callback, key) {
            callback = callback || null;

            var scheme;
            if (device.platform === 'iOS') {
                scheme = key + '://';
            } else if (device.platform === 'Android') {
                scheme = 'com.qplay.' + key;
            }

            var testInstalled = function() {
                appAvailability.check(
                    scheme,
                    function() {
                        callback(true);
                    },
                    function() {
                        callback(false);
                    }
                );
            }();
        }

        function appDetailCallback(install) {
            window.sessionStorage.setItem('checkAPPInstall', install);
        }

        /********************************** page event *************************************/
        $("#viewAppDetail2-2").on("pagebeforeshow", function(event, ui) {
            //loadingMask("show");
        });

        $("#viewAppDetail2-2").one("pageshow", function(event, ui) {
            //fix定位top
            var headHeight = $('#viewAppDetail2-2 .page-header').height();
            if (device.platform === "iOS") {
                $("#viewAppDetail2-2 .fix").css('top', (headHeight + iOSFixedTopPX()).toString() + 'px');
            } else {
                $("#viewAppDetail2-2 .fix").css('top', headHeight.toString() + 'px');
            }
        })

        $("#viewAppDetail2-2").on("pageshow", function(event, ui) {
            displayAppDetailStep1();

            var checkInstall = setInterval(function() {
                var btnLength = $('#InstallApp').length;
                var appInstall = window.sessionStorage.getItem('checkAPPInstall');

                if (btnLength > 0 && appInstall !== null) {
                    clearInterval(checkInstall);
                    window.sessionStorage.removeItem('checkAPPInstall');
                    $("#InstallApp .InstallAppStr").hide();

                    if (appInstall == 'true') {
                        $("#InstallApp #InstallAppStr03").show();
                    } else {
                        $("#InstallApp #InstallAppStr01").show();
                    }
                }

            }, 500);
        });

        /********************************** dom event *************************************/
        $("#InstallApp #InstallAppStr01").on("click", function() { //下載
            var pathArray = applist[selectAppIndex].url.split('/');
            var protocol = pathArray[0];

            if (device.platform === "iOS") {

                if (selectAppIndex != null) {
                    addDownloadHit(applist[selectAppIndex].package_name);
                    window.open(applist[selectAppIndex].url, '_system'); //download app
                }
            } else { //android

                if (protocol == "market:") {
                    addDownloadHit(applist[selectAppIndex].package_name);
                    window.open(applist[selectAppIndex].url, '_system'); //open url

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
        });

        $("#InstallApp #InstallAppStr02").on("click", function() { //開啟
            var schemeURL = APPKey + createAPPSchemeURL();
            openAPP(schemeURL);
        });

        $("#InstallApp #InstallAppStr03").on("click", function() { //更新
            //1. Open Other APP, do checkAppVersion, need to update, then click button to open QPlay
            //2. In this case, show [update] in button
            if (device.platform === "iOS") {

                if (selectAppIndex != null) {
                    window.open(applist[selectAppIndex].url, '_system'); //download app
                }
            } else {

                var permissions = cordova.plugins.permissions;
                permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function(status) {
                    if (status.hasPermission) {
                        var updateUrl = applist[selectAppIndex].url;
                        window.AppUpdate.AppUpdateNow(onSuccess, onFail, updateUrl);

                        function onFail() {}

                        function onSuccess() {}
                    } else {
                        console.warn("No :( ");
                        permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);

                        function error() {
                            console.warn('WRITE_EXTERNAL_STORAGE permission is not turned on');
                        }

                        function success(status) {
                            if (status.hasPermission) {
                                var updateUrl = applist[selectAppIndex].url;
                                window.AppUpdate.AppUpdateNow(onSuccess, onFail, updateUrl);

                                function onFail() {}

                                function onSuccess() {}
                            }
                        }
                    }
                });
            }
        });

        //展开更多
        $("#openDescription").on("click", function() {
            $("#appDetailAppDescription").removeClass("detail-description-ellipsis");
            $("#appDetailAppDescription").css({
                "max-height": "none",
                "line-height": "3.4vh"
            });
            $(".detail-description-open").hide();
        });

        //放大图片
        $("#appDetailPicListContent").on("click", ".detail-img-style", function() {
            var currentIndex = $(this).attr("data-index");

            $(".ui-btn-word").show();
            $("#viewAppDetail2-2 .q-btn-header").hide();
            $("#viewAppDetail2-2 .fix").fadeIn(500);

            //偏移时先归零，回到初始位置
            $("#appDetailPicListFullScreen").parent().scrollLeft(0);
            if (offsetArr.length == 0) {
                for (var i = 0; i < imgItemLength; i++) {
                    var x = $(".detail-img-style-full-screen[data-index=" + i + "]").offset().left;
                    offsetArr.push(x);
                }
            }
            $("#appDetailPicListFullScreen").parent().scrollLeft(offsetArr[currentIndex] - scrollLeftOffset(3.71));

        });

        //取消放大
        $(".ui-btn-word").on("click", function() {
            $(".ui-btn-word").hide();
            $("#viewAppDetail2-2 .q-btn-header").show();
            $("#viewAppDetail2-2 .fix").fadeOut(500);
        });

        //版本记录
        $(".version").on("click", function() {
            checkWidgetPage('viewVersionRecord', pageVisitedList);
        });


    }
});