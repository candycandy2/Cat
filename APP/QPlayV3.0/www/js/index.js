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
    widgetUpdateMsg = false,
    listUpdateMsg = false,
    msgDateFromType = ""; //[month => 1 month] or [skip => skip all data]

//viewMain3

//viewAppList
var favoriteList = null,
    appCheckFinish = false,
    alreadyDownloadList = [],
    notDownloadList = [],
    tempVersionArrData,
    tempVersionData;

//viewMyCalendar
var reserveCalendar = null;

//viewMessageList
var messageFrom = 'viewMain3';

//viewVersionRecord
var versionFrom = true;

window.initialSuccess = function(data) {
    //1. widgetlist
    checkWidgetListOrder();

    //review by alan
    //Not OO, it assume applist widget exist
    //2. favorite app
    //checkFavoriteInstall();

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

//检查widgetlist顺序
function checkWidgetListOrder() {
    var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));

    if (widgetArr == null) {
        window.localStorage.setItem('widgetList', JSON.stringify(widget.list()));

    } else {
        //1. check add
        for (var i = 0; i < widget.list().length; i++) {
            var found = false;
            var obj = {};
            for (var j = 0; j < widgetArr.length; j++) {
                if (widget.list()[i].id == widgetArr[j].id) {
                    found = true;
                    obj = $.extend({}, widgetArr[j], widget.list()[i]);
                    break;
                }
            }

            if (found) {
                widgetArr.splice(j, 1, obj);
            } else {
                widgetArr.push(widget.list()[i]);
            }
        }

        //2. check delete
        for (var j = 0; j < widgetArr.length; j++) {
            var found = false;
            for (var i = 0; i < widget.list().length; i++) {
                if (widgetArr[j].id == widget.list()[i].id) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                widgetArr.splice(j, 1);
                j--;
            }
        }

        window.localStorage.setItem('widgetList', JSON.stringify(widgetArr));
    }
}

// //检查最爱列表里的app是否安装
// function checkFavoriteInstall() {
//     favoriteList = JSON.parse(localStorage.getItem('favoriteList'));

//     if (favoriteList !== null) {
//         for (var i in favoriteList) {
//             var packageName = favoriteList[i].package_name;
//             var index = favoriteList[i].app_code;
//             checkAllAppInstalled(favoriteCallback, packageName, index);
//         }
//     }
// }

//未安装表示卸载，不应出现在最爱列表当中
function favoriteCallback(download, appcode) {
    if (!download) {
        for (var i in favoriteList) {
            if (appcode == favoriteList[i].app_code) {
                favoriteList.splice(i, 1);
                localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
                break;
            }
        }
    }
}

//先按照开始时间排序，如果开始时间一致再用结束时间排序
function sortByBeginTime(prop1, prop2) {
    return function(obj1, obj2) {
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

    this.successCallback = function() {};

    this.failCallback = function() {};

    var __construct = function() {
        if (loginData.token !== null && loginData.token.length !== 0) {
            QPlayAPI("POST", "sendPushToken", self.successCallback, self.failCallback, null, queryStr);
        }
    }();
}

//re-new Token Valid
function reNewToken() {
    var self = this;

    this.successCallback = function(data) {
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

    this.failCallback = function(data) {};

    var __construct = function() {
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
        //checkAppPage('viewMessageList');
    } else {
        var messageList = new QueryMessageList();
    }
}

//获取版本记录
function getAppVersion(packageName, versionCode) {
    var self = this;
    var queryStr = "&package_name=" + packageName + "&device_type=" + loginData.deviceType + "&version_code=" + versionCode;

    this.successCallback = function(data) {
        console.log(data);
    };

    this.failCallback = function(data) {};

    var __construct = function() {
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

function checkAppCallback(downloaded, index) {
    //根据是否下载分组
    if (downloaded) {
        alreadyDownloadList.push(index);
    } else {
        notDownloadList.push(index);
    }

    if (index == applist.length - 1) {
        appCheckFinish = true;
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

//un-register [User with Mobile Device UUID]
function unregister() {

    var self = this;
    var queryStr = "&target_uuid=" + loginData.uuid;

    this.successCallback = function(data) {
        console.log(data);
    };

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("POST", "unregister", self.successCallback, self.failCallback, null, queryStr);
    }();
}

function addDownloadHit(appname) {
    var self = this;

    this.successCallback = function(data) {
        var resultcode = data['result_code'];

        if (resultcode == 1) {} else {}
    };

    this.failCallback = function(data) {
        var resultcode = data['result_code'];

        if (resultcode == 1) {} else {}
    };

    var __construct = function() {
        var queryStr = "&login_id=" + loginData.loginid + "&package_name=" + appname;
        QPlayAPI("GET", "addDownloadHit", self.successCallback, self.failCallback, null, queryStr);
    }();
}

Date.prototype.FormatReleaseDate = function() {
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
$(document).on("click", ".event-type", function() {
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

    this.successCallback = function(data) {
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

    this.failCallback = function(data) {};

    var __construct = function() {
        QPlayAPI("GET", "getVersionLog", self.successCallback, self.failCallback, null, queryStr);
    }();
}

function pageBeforeShow(pageID) {
    if (pageID == 'viewAppList') {

    }
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
    if (checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");
    } else if (activePageID === "viewAppDetail2-2") {
        if ($("#viewAppDetail2-2 .ui-btn-word").css("display") == "none") {
            checkAppPage('viewAppList');
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
        if (messageFrom == 'viewMain3') {
            $.mobile.changePage('#viewMain3');
        } else if (messageFrom == 'viewMessageList') {
            checkAppPage('viewMessageList');
        } else {
            $.mobile.changePage('#viewMain3');
        }
    } else if (activePageID === "viewAppList" || activePageID === "viewAppSetting" || activePageID === "viewFAQ" || activePageID === "viewMessageList" || activePageID === "viewMyCalendar") {
        checkAppPage('viewMain3');
    } else if (activePageID === "viewMyEvaluation" || activePageID === "viewGeneralSetting") {
        checkAppPage('viewAppSetting');
    } else if (activePageID === "viewVersionRecord") {
        if (versionFrom) {
            checkAppPage('viewAppSetting');
        } else {
            checkAppPage('viewAppDetail2-2');
        }
    } else if (activePageID === "viewNotSignedIn") {
        navigator.app.exitApp();
    } else {
        navigator.app.exitApp();
    }
}