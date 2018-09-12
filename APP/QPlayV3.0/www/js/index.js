/*global variable*/
var appKeyOriginal = "appqplay";
var appKey = "appqplay";
var pageList = ["viewMain3"];
var pageVisitedList = ["viewMain3"];
var appSecretKey = "swexuc453refebraXecujeruBraqAc4e";

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

//viewMessageList
var portalURL = "",
    messageFrom = 'viewMain3';

window.initialSuccess = function(data) {
    //1. widgetlist
    checkWidgetListOrder();

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
            $.mobile.changePage('#viewMain3');

        }
    }

    appInitialFinish = true;
    //For test
    //var unregisterTest = new unregister();
}

//检查widgetlist顺序
function checkWidgetListOrder() {
    var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
    var widget_list = JSON.parse(window.localStorage.getItem('FunctionData'));

    var checkFunctionList = setInterval(function() {
        if (widget_list != null) {
            clearInterval(checkFunctionList);

            if (widgetArr == null) {
                //1. 如果local没有数据，直接获取widget.js
                var widget_arr = widget.list();

                //2. 以widget.js为主遍历FunctionList，如果任何一个为不可用，则enabled为false
                var widgetObj = compareWidgetAndFunction(widget_arr, widget_list['widget_list']);

                //3. 数据存到local
                window.localStorage.setItem('widgetList', JSON.stringify(widgetObj['list']));
                window.sessionStorage.setItem('widgetLength', widgetObj['count']);

            } else {
                //1. check widget.js add
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

                //2. check widget.js delete
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

                //3. check FunctionList
                var widgetObj = compareWidgetAndFunction(widgetArr, widget_list['widget_list']);
                window.localStorage.setItem('widgetList', JSON.stringify(widgetObj['list']));
                window.sessionStorage.setItem('widgetLength', widgetObj['count']);
            }
        }

    }, 500);

}

//比较widget.js和FunctionList
function compareWidgetAndFunction(wdgArr, funArr) {
    var count = 0;
    for (var i = 0; i < wdgArr.length; i++) {

        if (wdgArr[i].enabled) {
            count++;
        }

        var found = false;
        //再寻找相同的FunctionList是否可用
        for (var j = 0; j < funArr.length; j++) {
            if ('widget_' + wdgArr[i].name == funArr[j].function_variable) {
                found = true;
                if (funArr[j].function_content.right == 'Y') {
                    wdgArr[i].enabled = true;
                }
                if (funArr[j].function_content.right == 'N') {
                    wdgArr[i].enabled = false;
                }
                break;
            }
        }
    }

    var obj = {};
    obj['list'] = wdgArr;
    obj['count'] = count;
    return obj;
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
// function getAppVersion(packageName, versionCode) {
//     var self = this;
//     var queryStr = "&package_name=" + packageName + "&device_type=" + loginData.deviceType + "&version_code=" + versionCode;

//     this.successCallback = function(data) {
//         console.log(data);
//     };

//     this.failCallback = function(data) {};

//     var __construct = function() {
//         QPlayAPI("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr);
//     }();
// }

// function checkAppVersionCallback(oldVersionExist) {
//     checkAPPVersionRecord("updateFromAPI");
// }

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
// $(document).on("click", ".event-type", function() {
//     $("#eventTypeSelect").panel("open");
// });

//[Android]Handle the back button
function onBackKeyDown() {
    // var activePageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    var activePageID = pageVisitedList[pageVisitedList.length - 1];
    var prevPageID = pageVisitedList[pageVisitedList.length - 2];

    if (checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");

    } else if (activePageID == 'viewUserTradeResult') {
        backToSomePage('viewMain3');
    } else if (pageVisitedList.length == 1) {
        navigator.app.exitApp();
    } else {
        pageVisitedList.pop();
        $.mobile.changePage('#' + pageVisitedList[pageVisitedList.length - 1]);
    }
}

//header区域返回button
$(document).on('click', '.page-back', function() {
    onBackKeyDown();
})

//退回到某一特定页面
function backToSomePage(pageID) {
    var index = 0;
    for (var i = pageVisitedList.length - 1; i > -1; i--) {
        if (pageVisitedList[i] == pageID) {
            index = i;
        }
    }

    var arr = [];
    for (var i = 0; i < index + 2; i++) {
        arr.push(pageVisitedList[i]);
    }
    pageVisitedList = arr;

    //执行back逻辑
    onBackKeyDown();
}