
//$(document).one("pagecreate", "#viewMain2-1", function(){

    $("#viewMain2-1").pagecontainer({
        create: function(event, ui) {

            var tempVersionArrData;
            var tempVersionData;
            
            /********************************** function *************************************/
              //Event List No Data Popup  
            function FillAppList(responsecontent) {

                appcategorylist = responsecontent.app_category_list;
                applist = responsecontent.app_list;
                appmultilang = responsecontent.multi_lang;

                $('#appcontent').html("");

                for (var categoryindex=0; categoryindex<appcategorylist.length; categoryindex++) {
                    var catetoryName = appcategorylist[categoryindex].app_category;
                    var catetoryID = appcategorylist[categoryindex].category_id;
                    var content = "";
                    var catetoryAPPCount = 0;

                    if (categoryindex > 0) {
                        content += '<hr class="app-list-hr">';
                    }
                    content += '<span class="app-list-category">' + catetoryName + '</span>';
                    content += '<div id="qplayapplist' + categoryindex + '" class="app-list-scroll-area"><div id="qplayapplistContent' + categoryindex + '" style="width:auto;">';

                    for (var appindex=0; appindex<applist.length; appindex++) {

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

                            for (var multilangIndex=0; multilangIndex < appmultilang.length; multilangIndex++) {
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

                    var QueryAppListData = JSON.parse(window.localStorage.getItem('QueryAppListData'));
                    if (QueryAppListData === null || checkDataExpired(QueryAppListData['lastUpdateTime'], 1, 'dd')) {
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
                            versionName:         "",
                            versionCode:         "",
                            deviceType:          "",
                            pushToken:           "",
                            token:               "",
                            token_valid:         "",
                            uuid:                "",
                            checksum:            "",
                            domain:              "",
                            emp_no:              "",
                            loginid:             "",
                            messagecontent:      null,
                            msgDateFrom:         null,
                            doLoginDataCallBack: false,
                            openMessage:         false
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
                            $('.main-updateAppVersion').css('top', (screen.height-$('.main-updateAppVersion').height())/4);

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
                    for (var appindex=0; appindex<applist.length; appindex++) {
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
                var eventLogoutConfirmPopupData = {
                    id: "logoutConfirm",
                    content: $("template#tplContactUserPopup").html()
                };
                tplJS.Popup("viewMain2-1", "appcontent", "append", eventLogoutConfirmPopupData);
            });

            $("#viewMain2-1").on("pageshow", function(event, ui) {
                loadingMask("show");
                var appList = new QueryAppList();
                PullToRefresh.init({
                    mainElement: '#appcontent',
                    onRefresh: function() {
                        //do something for refresh
                        window.localStorage.removeItem('QueryAppListData');//enforce to refresh
                        var appList = new QueryAppList();
                    }
                });
            });
            /********************************** dom event *************************************/
            $("#logout").on("click", function() {
                $('#logoutConfirm').popup('open');
            });

            $(document).on("click", "#logoutConfirm #confirm", function() {
                $('#logoutConfirm').popup('close');
                loadingMask("show");
                var logout = new doLogOut();
            });

            $(document).on("click", "#logoutConfirm #cancel", function() {
                $('#logoutConfirm').popup('close');
             });

            $("#newseventspage").on("click", function() {
                $.mobile.changePage('#viewNewsEvents2-3');
            });
        }
    });

