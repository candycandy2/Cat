/*global variable*/
var appKeyOriginal = "appqplay";
var appKey = "appqplay";
var pageList = ["viewMain2-1", "viewAppDetail2-2", "viewNewsEvents2-3", "viewWebNews2-3-1", "viewMain3"];
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";

//viewMain2
var appcategorylist;
var applist;
var appmultilang;
var appVersionRecord = {};
checkAPPVersionRecord("initial");

//viewAppDetail2-2
var checkAPPKey;
var checkAPPKeyInstalled = false;

//viewNewsEvents
var messagecontent;
var selectAppIndex = 0;
var messageArrIndex = null;
var messageRowId = null;
var msgDateFromType = ""; //[month => 1 month] or [skip => skip all data]
var callGetMessageList = false;
var messagePageShow = false;
var delMsgActive = false;

//viewMain
var viewMainInitial = true;

//viewAppList
var favoriteList = JSON.parse(localStorage.getItem('favoriteList'));
var downloadedIndexArr = [], alreadyDownloadList = [], notDownloadList = [];
var tempVersionArrData, tempVersionData;

//viewMyCalendar
var reserveCalendar = null,
    reserveList = [],
    reserveDirty = false;

//viewMessageList
var massageFrom;


window.initialSuccess = function (data) {
    if (data !== undefined) {

        getDataFromServer = false;
        processStorageData("setLocalStorage", data);

        if (loginData['doLoginDataCallBack'] === false) {
            $.mobile.changePage('#viewMain3', {
                reloadPage: true
            });
            $.mobile.changePage('#viewMain3');
        }
    } else {

        if (loginData['doLoginDataCallBack'] === true) {
            getLoginDataCallBack();
        } else {

            //If simulator, don't do sendPushToken
            if (!device.isVirtual) {
                var doPushToken = new sendPushToken();
            }

            //If User first time to use QPlay, never get message data from server,
            //don't call QueryMessageList() in background.
            if (loginData["msgDateFrom"] !== null) {
                var messageList = new QueryMessageList("auto");
            }

            //review by alan
            if (window.localStorage.getItem("openMessage") !== "true") {
                $.mobile.changePage('#viewMain3', {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: false,
                    reloadPage: true
                });
                $.mobile.changePage('#viewMain3');
            } else {
                //If onOpenNotification, but not login.
                //Atfer login, do onOpenNotification again.
                openNewMessage(); //refectory
            }

        }
    }

    appInitialFinish = true;
    //For test
    //var unregisterTest = new unregister();
}

function getMyReserve(key, secret) {
    var self = this;
    var today = new Date();
    var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + today.yyyymmdd('') + '</NowDate></LayoutHeader>';
    var rrsStr = langStr["str_063"],    //预约
        relieveStr = langStr["str_064"],    //物理治疗
        parkingStr = langStr["str_065"],    //车位预约
        massageStr = langStr["str_066"];    //按摩预约

    var versionKey = "";
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        versionKey = key + "test";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        versionKey = key + "dev";
    } else {
        versionKey = key + "";
    }

    this.successCallback = function (data) {
        //console.log(data);

        if (data['ResultCode'] === "1") {
            var resultArr = data['Content'];

            if (key == "apprrs") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "預約" + resultArr[i].MeetingRoomName;
                        resultArr[i].item = rrsStr + resultArr[i].MeetingRoomName;
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            } else if (key == "apprelieve") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "物理治療";
                        resultArr[i].item = relieveStr;
                        resultArr[i].ReserveBeginTime = new Date(resultArr[i].ReserveBeginTime).hhmm();
                        resultArr[i].ReserveEndTime = new Date(resultArr[i].ReserveEndTime).hhmm();
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            } else if (key == "appparking") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "車位預約";
                        resultArr[i].item = parkingStr;
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            } else if (key == "appmassage") {
                for (var i in resultArr) {

                    if (localStorage.getItem(versionKey) == null) {
                        resultArr[i].type = key;
                        //resultArr[i].item = "按摩預約";
                        resultArr[i].item = massageStr;
                        resultArr[i].ReserveBeginTime = new Date(resultArr[i].ReserveBeginTime).hhmm();
                        resultArr[i].ReserveEndTime = new Date(resultArr[i].ReserveEndTime).hhmm();
                        resultArr[i].ReserveDate = formatReserveDate(resultArr[i].ReserveDate);
                    }

                    reserveList.push(resultArr[i]);
                }

                reserveDirty = true;

            }

        } else if (data['ResultCode'] === "002901") { }

        if (key == "appmassage") {
            formatReserveList();
        }

        if (reserveDirty && reserveCalendar != null) {
            formatReserveList();
            reserveCalendar.reserveData = reserveList;
            reserveCalendar.refreshReserve(reserveList);
            reserveDirty = false;
        }
    };

    var __construct = function () {
        CustomAPIByKey("POST", false, key, secret, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "", 3600, "low");
    }();
}

//数组合并并排序
function formatReserveList() {
    //1. 先按照日期合併同一天預約
    var tempArr = [];
    $.each(reserveList, function (index, item) {
        var key = item.ReserveDate;
        if (typeof tempArr[key] == "undefined") {
            tempArr[key] = [];
            tempArr[key].push(item);

        } else {
            tempArr[key].push(item);
        }
    });

    //2. 再按照時間將同一天內的預約進行排序
    for (var i in tempArr) {
        tempArr[i].sort(sortByBeginTime("ReserveBeginTime", "ReserveEndTime"));
    }

    reserveList = tempArr;
}

//先按照开始时间排序，如果开始时间一致再用结束时间排序
function sortByBeginTime(prop1, prop2) {
    return function (obj1, obj2) {
        var val1 = obj1[prop1].replace(':', '');
        var val2 = obj2[prop1].replace(':', '');
        var value1 = obj1[prop2].replace(':', '');
        var value2 = obj2[prop2].replace(':', '');
        if (val1 > val2) {
            return 1;
        } else if (val1 < val2) {
            return -1;
        } else {
            if (value1 > value2) {
                return 1;
            } else if (value1 < value2) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

//Plugin-QPush, Now only QPLay need to set push-toekn
function sendPushToken() {
    var self = this;
    var queryStr = "&app_key=" + qplayAppKey + "&device_type=" + loginData.deviceType;

    this.successCallback = function () { };

    this.failCallback = function () { };

    var __construct = function () {
        if (loginData.token !== null && loginData.token.length !== 0) {
            QPlayAPI("POST", "sendPushToken", self.successCallback, self.failCallback, null, queryStr);
        }
    }();
}

//re-new Token Valid
function reNewToken() {
    var self = this;

    this.successCallback = function (data) {
        var resultcode = data['result_code'];
        var newToken = data['content'].token;
        var newTokenValid = data['token_valid'];

        if (resultcode == 1) {
            loginData["token"] = newToken;
            loginData["token_valid"] = newTokenValid;

            window.localStorage.setItem("token", newToken);
            window.localStorage.setItem("token_valid", newTokenValid);
        } else {
            //other case
        }

        //if (doInitialSuccess) {
        doInitialSuccess = false;
        hideInitialPage();
        //}
    };

    this.failCallback = function (data) { };

    var __construct = function () {
        QPlayAPI("POST", "renewToken", self.successCallback, self.failCallback, null, null);
    }();
}

function getTimestamp() {
    var clientTimestamp = new Date().getTime();
    return clientTimestamp = clientTimestamp.toString().substr(0, 10);
}

function addZero(number) {
    if (number < 10) {
        number = "0" + number;
    }
    return number;
}

//review by alan
function openNewMessage() {
    messageRowId = window.localStorage.getItem("messageRowId");

    //Before open Message Detail Data, update Message List
    if (window.localStorage.getItem("msgDateFrom") === null) {
        //$.mobile.changePage('#viewNewsEvents2-3');
        checkAppPage('viewMessageList');
    } else {
        var messageList = new QueryMessageList();
    }
}

//Check APP version record
function checkAPPVersionRecord(action) {
    if (action === "initial") {

        if (window.localStorage.getItem("appVersionRecord") !== null) {
            var tempData = window.localStorage.getItem("appVersionRecord");
            appVersionRecord = JSON.parse(tempData);
        }

    } else if (action === "updateFromAPI") {

        window.localStorage.setItem("appVersionRecord", JSON.stringify(appVersionRecord));

    } else if (action === "updateFromScheme") {

        var tempData = window.localStorage.getItem("appVersionRecord");
        appVersionRecord = JSON.parse(tempData);

        //For old APP Version
        if (appVersionRecord["com.qplay." + queryData["callbackApp"]] !== undefined) {
            if (queryData["versionCode"] !== undefined) {
                appVersionRecord["com.qplay." + queryData["callbackApp"]]["installed_version"] = queryData["versionCode"];
            } else {
                appVersionRecord["com.qplay." + queryData["callbackApp"]]["installed_version"] = "1";
            }
        }

        window.localStorage.setItem("appVersionRecord", JSON.stringify(appVersionRecord));

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

    window.testAPPInstalled = setInterval(function () {
        appAvailability.check(
            scheme, //URI Scheme or Package Name
            function () { //Success callback

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
            function () { //Error callback

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

    window.stopTestAPPInstalled = function () {
        if (window.testAPPInstalled != null) {
            clearInterval(window.testAPPInstalled);
        }
    };
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

    var testInstalled = function (i) {
        appAvailability.check(
            scheme, //URI Scheme or Package Name
            function () { //Success callback
                callback(true, i);
                //console.log(i);
            },
            function () { //Error callback
                callback(false, i);
            }
        );
    }(index);
}

function checkAppCallback(downloaded, index) {

    //如果已下载，保存applist的index
    if (downloaded) {
        downloadedIndexArr.push(index);
    }

    //当所有APP都check完毕
    if (index == applist.length - 1) {

        //如果有已下载app就分组
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
}

function checkAppVersionCallback(oldVersionExist) {
    if (oldVersionExist) {
        tempVersionArrData = "1";
    } else {
        tempVersionArrData = tempVersionData;
    }

    checkAPPVersionRecord("updateFromAPI");
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
            '</div><div class="font-style7">' +
            appSummary +
            '</div></div></div><div><img src="img/' +
            (status == true ? 'favorite_blank.png' : 'download_icon.png') +
            '" class="' +
            (status == true ? 'favorite-btn' : 'download-btn') +
            '" data-src="' +
            (status == true ? 'favorite_blank' : 'download_icon') +
            '"></div></div>';
    }
    return content;
}

function changeFavoriteIcon() {
    $.each($('.favorite-btn'), function (index, item) {
        for (var i in favoriteList) {
            if (favoriteList[i].app_code == $(item).parent().prev().attr('data-code')) {
                $(item).attr('data-src', 'favorite_full');
                $(item).attr('src', 'img/favorite_full.png');
            }
        }
    });
}

//CallAPI get applist
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
            appGroup(responsecontent);
        }

    }();
}

//applist group by downloaded status
function appGroup(responsecontent) {
    downloadedIndexArr = [], alreadyDownloadList = [], notDownloadList = [];
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

//un-register [User with Mobile Device UUID]
function unregister() {

    var self = this;
    var queryStr = "&target_uuid=" + loginData.uuid;

    this.successCallback = function (data) {
        console.log(data);
    };

    this.failCallback = function (data) { };

    var __construct = function () {
        QPlayAPI("POST", "unregister", self.successCallback, self.failCallback, null, queryStr);
    }();
}

function addDownloadHit(appname) {
    var self = this;

    this.successCallback = function (data) {
        var resultcode = data['result_code'];

        if (resultcode == 1) { } else { }
    };

    this.failCallback = function (data) {
        var resultcode = data['result_code'];

        if (resultcode == 1) { } else { }
    };

    var __construct = function () {
        var queryStr = "&login_id=" + loginData.loginid + "&package_name=" + appname;
        QPlayAPI("GET", "addDownloadHit", self.successCallback, self.failCallback, null, queryStr);

    }();
}

function formatReserveDate(str) {
    return str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2);
}

Date.prototype.FormatReleaseDate = function () {
    return this.getFullYear() + "年" + (parseInt(this.getMonth()) + 1) + "月" + this.getDate() + "日";
}

//获取移动偏移量
//margin表示单边距，所以需要*2，
//screenwidth / ? = 100vw / (margin*2)
//返回px
function scrollLeftOffset(margin) {
    margin = Number(margin);
    var screenWidth = window.screen.width;
    return screenWidth * margin * 2 / 100;
}

//Change event type
$(document).on("click", ".event-type", function () {
    $("#eventTypeSelect").panel("open");
});

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
    if (activePageID === "viewMain3") {
        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
        } else {
            navigator.app.exitApp();
        }
    } else if (activePageID === "viewMain3" || activePageID === "viewAppDetail2-2") {
        if ($("#viewAppDetail2-2 .ui-btn-word").css("display") == "none") {
            $.mobile.changePage('#viewMain3');
        } else {
            $("#viewAppDetail2-2 .ui-btn-word").trigger("click");
        }
    } else if (activePageID === "viewNewsEvents2-3") {
        if (delMsgActive) {
            editModeChange();
        } else {
            $.mobile.changePage('#viewMain3');
        }
    } else if (activePageID === "viewWebNews2-3-1") {
        //goBack("goList");
        if (massageFrom == 'viewMain3') {
            $.mobile.changePage('#viewMain3');
        } else if (massageFrom == 'viewMessageList') {
            //$.mobile.changePage('#viewMessageList');
            checkAppPage('viewMessageList');
        }
    } else if (activePageID === "viewNotSignedIn") {
        navigator.app.exitApp();
    } else {
        navigator.app.exitApp();
    }
}

//检查APP-page
function checkAppPage(pageID) {
    var appStatus = false;

    for (var i in pageList) {
        if (pageID == pageList[i]) {
            appStatus = true;
            break;
        }
    }
    console.log(pageID + (appStatus == true ? ' has' : ' has not') + ' been in the app');

    if (appStatus) {
        $.mobile.changePage('#' + pageID);
    } else {
        $.get('View/' + pageID + '.html', function (data) {
            $.mobile.pageContainer.append(data);
            $('#' + pageID).page().enhanceWithin();

            //Show Water Mark
            //According to the data [waterMarkPageList] which set in index.js
            if (!(typeof waterMarkPageList === 'undefined')) {
                if (waterMarkPageList.indexOf(pageID) !== -1) {
                    $('#' + pageID).css('background-color', 'transparent');
                }
            }

            setTimeout(function () {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'js/' + pageID + '.js';
                document.head.appendChild(script);

                $.mobile.changePage('#' + pageID);
                pageList.push(pageID);
            }, 100);

        }, 'html');
    }
}