$("#viewAppList").pagecontainer({
    create: function (event, ui) {
        var downloadedIndexArr = [], alreadyDownloadList = [], notDownloadList = [];

        function GetAppList() {
            var self = this;

            this.successCallback = function (data) {

                //console.log(data);

                if (data['result_code'] == '1') {

                    window.localStorage.removeItem('QueryAppListData');
                    var jsonData = {};
                    jsonData = {
                        lastUpdateTime: new Date(),
                        content: data['content']
                    };
                    window.localStorage.setItem('QueryAppListData', JSON.stringify(jsonData));

                    var responsecontent = data['content'];
                    //FillAppList(responsecontent);
                    appGroup(responsecontent);
                }

            };

            this.failCallback = function (data) { };

            var __construct = function () {

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
                    //FillAppList(responsecontent);
                    appGroup(responsecontent);
                }

            }();
        }

        function appGroup(responsecontent) {
            downloadedIndexArr = [], alreadyDownloadList = [], notDownloadList = [];
            applist = responsecontent.app_list;
            appmultilang = responsecontent.multi_lang;

            for (var i = 0; i < applist.length; i++) {

                var appName = applist[i].package_name;
                var appNameArr = appName.split(".");
                var checkKey = appNameArr[2];
                checkAllAppInstalled(allAppCallback, checkKey, i);
            }
        }

        function createContent(arr, status) {
            var content = "";
            for (var i = 0; i < arr.length; i++) {

                var packagename = null;
                var defaultAPPName = null;
                var appSummary = null;
                var defaultSummary = null;
                for (var j = 0; j < appmultilang.length; j++) {
                    if (arr[i].app_code == appmultilang[j].project_code) {
                        //match browser language
                        if (appmultilang[j].lang == browserLanguage) {
                            packagename = appmultilang[j].app_name;
                            appSummary = appmultilang[j].app_summary;
                        }
                        //match default language: zh-tw
                        if (appmultilang[j].lang == arr[i].default_lang) {
                            defaultAPPName = appmultilang[j].app_name;
                            defaultSummary = appmultilang[j].app_summary;
                        }
                    }
                }

                if (packagename == null) {
                    packagename = defaultAPPName;
                    appSummary = defaultSummary;
                }

                var appurl = arr[i].url;
                var appurlicon = arr[i].icon_url;
                var appcode = arr[i].app_code;

                content += '<div class="download-list"><div class="download-link" data-code="' +
                    appcode +
                    '"><div class="download-icon"><img src="' +
                    appurlicon +
                    '"></div><div class="download-name"><div class="font-style10">' +
                    packagename +
                    '</div><div class="font-style14">' +
                    appSummary +
                    '</div></div></div><div data-code="' +
                    appcode +
                    '"><img src="img/' +
                    (status == true ? 'favorite_blank.png' : 'download_icon.png') +
                    '" class="' +
                    (status == true ? 'favorite-btn' : 'download-btn') +
                    '" data-src="' +
                    (status == true ? 'favorite_blank' : 'download_icon') +
                    '"></div></div>';
            }
            return content;
        }

        window.allAppCallback = function (downloaded, index) {
            if (downloaded) {
                downloadedIndexArr.push(index);
            }

            //当所有APP都check完毕
            if (index == applist.length - 1) {

                if (downloadedIndexArr.length != 0) {
                    for (var i = 0; i < applist.length;) {
                        for (var j = 0; j < downloadedIndexArr.length; j++) {
                            if (i == downloadedIndexArr[j]) {
                                alreadyDownloadList.push(applist[i]);
                                i++;
                            } else if (j == downloadedIndexArr.length - 1) {
                                notDownloadList.push(applist[i]);
                                i++;
                            }
                        }
                    }

                    var alreadydownloadContent = createContent(alreadyDownloadList, true);
                    $('.already-download-list').html('').append(alreadydownloadContent);
                    $('.already-download-list > div:last').css('border', '0');

                    var notdownloadContent = createContent(notDownloadList, false);
                    $('.not-download-list').html('').append(notdownloadContent);
                    $('.not-download-list > div:last').css('border', '0');

                } else {
                    notDownloadList = applist;
                    var notdownloadContent = createContent(notDownloadList, false);
                    $('.not-download-list').html('').append(notdownloadContent);
                    $('.not-download-list > div:last').css('border', '0');
                }

                //change favorite icon
                if (favoriteList != null) {
                    changeFavoriteIcon();
                }
            }
        };


        /*
        *param:code app_code
        *status:add or remove
        */
        function setFavoriteList(code, name, status) {
            if (status == true) {
                for (var i in applist) {
                    if (code == applist[i].app_code) {
                        var appobj = {};
                        appobj = {
                            app_code: applist[i].app_code,
                            icon_url: applist[i].icon_url,
                            app_name: name
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
        }

        //动态生成downloadlist后，改变最爱APP的icon
        function changeFavoriteIcon() {
            $.each($('.favorite-btn'), function (index, item) {
                for (var i in favoriteList) {
                    if (favoriteList[i].app_code == $(item).parent().attr('data-code')) {
                        $(item).attr('data-src', 'favorite_full');
                        $(item).attr('src', 'img/favorite_full.png');
                    }
                }
            });
        }

        function getIndexByCode(code) {
            for (var i in applist) {
                if (code == applist[i].app_code) {
                    return i;
                }
            }
        }

        /********************************** page event ***********************************/
        $("#viewAppList").on("pagebeforeshow", function (event, ui) {
            //get applist
            var applist = new GetAppList();

        });

        $("#viewAppList").scroll(function () {

        });

        $("#viewAppList").on("pageshow", function (event, ui) {

        });

        $("#viewAppList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //添加或移除最爱APP
        $('#viewAppList').on('click', '.favorite-btn', function () {
            var self = this;
            var src = $(self).attr('data-src');
            var appcode = $(self).parent().attr('data-code');
            var appname = $(self).parent().prev().children().find('.font-style10').text();
            //console.log(appname);

            if (src == 'favorite_blank') {
                //1. change src
                $(self).attr('data-src', 'favorite_full');
                $(self).attr('src', 'img/favorite_full.png');

                //2. save local
                if (favoriteList == null) {
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

        //跳转到APP说明页
        $('#viewAppList').on('click', '.download-link', function () {
            var self = this;
            var appcode = $(self).attr('data-code');
            selectAppIndex = getIndexByCode(appcode);
            $.mobile.changePage('#viewAppDetail2-2');
        });

    }
});