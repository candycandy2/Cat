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
        /*
        function locationSuccess(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var APPID = 'MaoUYU6k';

            var geoAPI = 'http://where.yahooapis.com/geocode?location='+lat+','+lon+'&flags=J&gflags=R&appid='+APPID;

            var city = "Taipei";
            var searchtext = "select item.condition from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + city + "') and u='c'"

            //change city variable dynamically as required
            $.getJSON(geoAPI, function(data) {
                if(data.ResultSet.Found == 1) {
                    results = data.ResultSet.Results;
                    city = results[0].city;
                    code = results[0].statecode || results[0].countrycode;
                    // This is the city identifier for the weather API
                    woeid = results[0].woeid;
                    $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json").success(function(data){
                        console.log(data);
                        $('#temp').html( city + ", " + data.query.results.channel.item.condition.text + ", " + data.query.results.channel.item.condition.temp + "°C");
                    });
                }
            });
        }

        function locationError(error){
            switch(error.code) {
                case error.TIMEOUT:
                    showError("A timeout occured! Please try again!");
                    break;
                case error.POSITION_UNAVAILABLE:
                    showError('We can\'t detect your location. Sorry!');
                    break;
                case error.PERMISSION_DENIED:
                    showError('Please allow geolocation access for this to work.');
                    break;
                case error.UNKNOWN_ERROR:
                    showError('An unknown error occured!');
                    break;
            }
        }

        function success(pos) {
          var crd = pos.coords;
          console.log('Your current position is:');
          console.log('Latitude : ' + crd.latitude);
          console.log('Longitude: ' + crd.longitude);
          console.log('More or less ' + crd.accuracy + ' meters.');
        }

        function error(err) {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        }*/
        /********************************** page event *************************************/
        $("#viewMain2-1").one("pagebeforeshow", function(event, ui) {
            var eventLogoutConfirmPopupData = {
                id: "logoutConfirm",
                content: $("template#tplContactUserPopup").html()
            };
            tplJS.Popup("viewMain2-1", "appcontent", "append", eventLogoutConfirmPopupData);

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
                        var heightPanel = heightView - 20;

                        $("#eventTypeSelect").css({
                            'min-height': heightPanel + 'px',
                            'max-height': heightPanel + 'px',
                            'margin-top': '20px'
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
                    if (activePageID === "viewMain2-1") {
                        $.mobile.changePage('#viewNewsEvents2-3');
                    } else {
                        QueryPortalList(eventType);
                    }
                }
            });

            /*$(document).ready(function(){
                if (navigator.geolocation) {
                    //navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
                    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, { enableHighAccuracy: true });
                }              
            });*/
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
    }
});