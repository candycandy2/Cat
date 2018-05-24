$("#viewAppList").pagecontainer({
    create: function (event, ui) {
        

        function GetAppList() {
            var self = this;

            this.successCallback = function (data) {

                console.log(data);

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
                    downloadGroup(responsecontent);
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
                    downloadGroup(responsecontent);
                }

            }();
        }

        function downloadGroup(responsecontent) {
            applist = responsecontent.app_list;
            appmultilang = responsecontent.multi_lang;

            var content = "";
            for (var i = 0; i < applist.length; i++) {

                var appName = applist[i].package_name;
                var appNameArr = appName.split(".");
                var checkKey = appNameArr[2];
                checkInstalled(checkApp, checkKey);

                var packagename = null;
                var defaultAPPName = null;
                for (var j = 0; j < appmultilang.length; j++) {
                    if (applist[i].app_code == appmultilang[j].project_code) {
                        //match browser language
                        if (appmultilang[j].lang == browserLanguage) {
                            packagename = appmultilang[j].app_name;
                        }
                        //match default language: zh-tw
                        if (appmultilang[j].lang == applist[i].default_lang) {
                            defaultAPPName = appmultilang[j].app_name;
                        }
                    }
                }

                if (packagename == null) {
                    packagename = defaultAPPName;
                }

                var appurl = applist[i].url;
                var appurlicon = applist[i].icon_url;

                content += '<div class="applist-bottom-line"><img src="' + appurlicon + '" style="width:10vw;"><span>' + packagename + '</span></div>';
            }

            $('.all-download-list').append(content);
        }

        window.checkApp = function (downloaded) {
            
            console.log(downloaded);
            
        };

        /********************************** page event ***********************************/
        $("#viewAppList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewAppList").scroll(function () {

        });

        $("#viewAppList").on("pageshow", function (event, ui) {
            var applist = new GetAppList();
        });

        $("#viewAppList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/


    }
});