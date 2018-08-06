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
var messagecontent,
    selectAppIndex = 0,
    messageArrIndex = null,
    messageRowId = null,
    callGetMessageList = false,
    messagePageShow = false,
    delMsgActive = false,
    msgDateFromType = ""; //[month => 1 month] or [skip => skip all data]

//viewMain3
var carouselFinish = false,
    weatherFinish = false,
    reserveFinish = false,
    messageFinish = false,
    applistFinish = false,
    addAppToList = true;

//viewAppList
var favoriteList = JSON.parse(localStorage.getItem('favoriteList'));
var alreadyDownloadList = [],
    notDownloadList = [],
    tempVersionArrData,
    tempVersionData;

//viewMyCalendar
var reserveCalendar = null,
    reserveList = [],
    reserveDirty = false;

//viewMessageList
var messageFrom;

//viewVersionRecord
var versionFrom = true;

//viewGeneralSetting
var generalSetting = {
    'en-us': ['Weather', 'My Reserver', 'My QPlay', 'Latest News'],
    'zh-cn': ['天气', '我的预约', '我的QPlay', '最新消息'],
    'zh-tw': ['天氣', '我的預約', '我的QPlay', '最新消息']
}

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

    //general setting
    getGeneralSetting();
}


//获取一般设定
function getGeneralSetting() {
    //hard code
    window.localStorage.removeItem('defaultSetting');

    var settingArr = JSON.parse(window.localStorage.getItem('generalSetting'));
    var updateTime = window.localStorage.getItem('updateGeneral');

    if (settingArr == null) {
        window.localStorage.setItem('generalSetting', JSON.stringify(generalSetting));
        window.localStorage.setItem('updateGeneral', new Date().toISOString());

    } else {
        var limitSeconds = 7;   //7 day
        if (checkDataExpired(updateTime, limitSeconds, 'dd')) {

            //同步，且已generalSetting为主，local为辅
            for (var i in generalSetting) {
                var arr = compareArrayByFirst(generalSetting[i], settingArr[i]);
                settingArr[i] = arr;
            }

            window.localStorage.setItem('generalSetting', JSON.stringify(settingArr));
            window.localStorage.setItem('updateGeneral', new Date().toISOString());
        }
    }
}


//比较2个数组，以第一个数组为准
function compareArrayByFirst(arr1, arr2) {
    //add
    for (var i = 0; i < arr1.length; i++) {
        var current = arr1[i];
        var status = false;
        for (var j = 0; j < arr2.length; j++) {
            var tag = arr2[j];
            if (current == tag) {
                status = true;
                break;
            }
        }
        if (!status) {
            arr2.push(current);
        }
    }

    //remove
    var arr = [];
    for (var i = 0; i < arr2.length; i++) {
        var current = arr2[i];
        var status = false;
        for (var j = 0; j < arr1.length; j++) {
            var tag = arr1[j];
            if (current == tag) {
                status = true;
                break;
            }
        }
        if (!status) {
            arr2.splice(i, 1);
            i--;
        }
    }

    return arr2;
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

function getAppVersion(packageName, versionCode) {
    var self = this;
    var queryStr = "&package_name=" + packageName + "&device_type=" + loginData.deviceType + "&version_code=" + versionCode;

    this.successCallback = function (data) {
        console.log(data);
    };

    this.failCallback = function (data) { };

    var __construct = function () {
        QPlayAPI("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr);
    }();
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
    //根据是否下载分组
    if (downloaded) {
        alreadyDownloadList.push(index);
    } else {
        notDownloadList.push(index);
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
            appGroupByDownload(responsecontent);
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
            appGroupByDownload(responsecontent);
        }

    }();
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


//获取版本记录
function getVersionRecord(key) {
    key = key || null;

    var self = this;

    if (key == null) {
        key = qplayAppKey;
    }

    var queryStr = "&app_key=" + key + "&device_type=" + device.platform;
    //var queryStr = "&app_key=appqplaydev&device_type=android";

    this.successCallback = function (data) {
        console.log(data);

        if (data['result_code'] == "1") {
            var versionLogList = data['content'].version_list;
            var content = '';

            for (var i in versionLogList) {
                content += '<div class="version-record-list"><div class="font-style12">' +
                    versionLogList[i].version_name +
                    '</div><div class="font-style11">' +
                    new Date(versionLogList[i].online_date * 1000).FormatReleaseDate() +
                    '</div><div class="font-style11">' +
                    versionLogList[i].version_log.replace(new RegExp('\r?\n', 'g'), '<br />') +
                    '</div></div>';
            }

            $(".version-scroll > div").html('').append(content);

            //set language
            $('#viewVersionRecord .ui-title div').text(langStr['str_081']);

            //set height
            var contentHeight = $('.version-scroll > div').height();
            var headerHeight = $('#viewVersionRecord .page-header').height();
            var totalHeight;
            if (device.platform === "iOS") {
                totalHeight = (contentHeight + headerHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (contentHeight + headerHeight).toString();
            }
            $(".version-scroll > div").css('height', totalHeight + 'px');

        }
    };

    this.failCallback = function (data) { };

    var __construct = function () {
        QPlayAPI("GET", "getVersionLog", self.successCallback, self.failCallback, null, queryStr);

    }();
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
                $('#' + pageID).on('pagebeforeshow', pageBeforeShow(pageID));
                pageList.push(pageID);
            }, 200);

        }, 'html');
    }
}

function pageBeforeShow(pageID) {
    if (pageID == 'viewAppSetting') {

    } if (pageID == 'viewAppList') {
        appListPageBeforShow();
    }
}

function appListPageBeforShow() {
    if (addAppToList && alreadyDownloadList.length == 0) {
        $('#viewAppList .q-btn-header img').attr('src', 'img/close.png');
        $('.app-no-download').show();
        $('.app-scroll').hide();
    } else {
        $('#viewAppList .q-btn-header img').attr('src', 'img/component/back_nav.png');
        $('.app-scroll').show();
        $('.app-no-download').hide();
    }
}

function QStorageAPI(requestType, requestAction, successCallback, failCallback, queryData, queryStr) {
    //API [checkAppVersion] [getSecurityList]
    //even though these 2 API were from QPlay, the API path is [/public/v101/qplay/],
    //but, when other APP call these 2 API,
    //need to set the specific [App-Key] and [appSecretKey] by the APP, not by QPlay.

    //queryStr: start with [&], ex: &account=test&pwd=123

    failCallback = failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";

    function requestSuccess(data) {
        checkTokenValid(data['result_code'], data['token_valid'], successCallback, data);

        var dataArr = [
            "Call API",
            requestAction,
            data['result_code']
        ];
        LogFile.createAndWriteFile(dataArr);
    }

    // review
    function requestError(data) {
        console.log(data);
        errorHandler(data, requestAction);
        if (failCallback) {
            failCallback();
        }
    }

    var signatureTime = getSignature("getTime");
    var signatureInBase64 = getSignature("getInBase64", signatureTime);
    console.log(serverURL + "/qstorage/public/v101/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr);
    console.log(queryData.get('filename'));

    $.ajax({
        type: requestType,
        headers: {
            'Content-Type': 'multipart/form-data',
            'App-Key': appKey,
            'Signature-Time': signatureTime,
            'Signature': signatureInBase64,
            'Account': loginData["emp_no"]
        },
        url: serverURL + "/qstorage/public/v101/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
        dataType: "json",
        data: JSON.stringify(queryData),
        cache: false,
        timeout: 30000,
        success: requestSuccess,
        error: requestError
    });
}

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
        if (messageFrom == 'viewMain3') {
            $.mobile.changePage('#viewMain3');
        } else if (messageFrom == 'viewMessageList') {
            //$.mobile.changePage('#viewMessageList');
            checkAppPage('viewMessageList');
        }
    } else if (activePageID === "viewNotSignedIn") {
        navigator.app.exitApp();
    } else {
        navigator.app.exitApp();
    }
}