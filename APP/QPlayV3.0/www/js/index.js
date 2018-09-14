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

//notification
var notification = {
    onOpenNotification: function(data) {
        //Plugin-QPush > 添加背景收到通知后需要執行的內容
        var messageList = new QueryMessageListEx(true);
        getMessageID(data); //messageRowId

        if (window.localStorage.getItem("loginid") === null) {
            //Donothing
        } else {
            //While open APP in iOS, when get new message, iOS will not show message dialog in status bar,
            //need to do it by Javscript
            if (device.platform === "iOS") {
                $("#newMessageTitle").html(data.aps["alert"]);
            } else {
                $("#newMessageTitle").html(data["alert"]);
            }

            $('#iOSGetNewMessage').popup();
            $('#iOSGetNewMessage').show();
            $('#iOSGetNewMessage').popup('open');

            $("#openNewMessage").one("click", function() {
                $('#iOSGetNewMessage').popup('close');
                $('#iOSGetNewMessage').hide();

                checkWidgetPage('viewWebNews2-3-1', pageVisitedList);
            });

            $("#cancelNewMessage").one("click", function() {
                $('#iOSGetNewMessage').popup('close');
                $('#iOSGetNewMessage').hide();

                window.localStorage.setItem("openMessage", "false");
            });
            
        }
    },
    onBackgoundNotification: function(data) {
        //Plugin-QPush > 添加後台收到通知后需要執行的內容
        if (window.localStorage.getItem("openMessage") === "false") {
            getMessageID(data);

            if (window.localStorage.getItem("loginid") === null) {
                //remember to open Message Detail Data
                loginData["openMessage"] = true;
                window.localStorage.setItem("openMessage", "true");
                window.localStorage.setItem("messageRowId", messageRowId);
            }
        }
    }
}

window.initialSuccess = function (data) {
    //1. widgetlist
    checkWidgetListOrder();

    //2. change page
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

    //3. addEventListener notification
    if (device.platform === "iOS") {
        //後台打开通知
        document.addEventListener('jpush.openNotification', notification.onOpenNotification, false);
        //後台收到通知
        document.addEventListener('jpush.backgoundNotification', notification.onBackgoundNotification, false);
        //前台收到通知
        document.addEventListener('jpush.receiveNotification', notification.onOpenNotification, false);
    } else {
        //後台打开通知
        document.addEventListener('qpush.openNotification', notification.onOpenNotification, false);
        //後台收到通知
        document.addEventListener('qpush.backgoundNotification', notification.onBackgoundNotification, false);
        //前台收到通知
        document.addEventListener('qpush.receiveNotification', notification.onOpenNotification, false);
    }
}

//检查widgetlist顺序
function checkWidgetListOrder() {
    var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
    var widget_list = JSON.parse(window.localStorage.getItem('FunctionData'));

    var checkFunctionList = setInterval(function () {
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

//header区域返回button
$(document).on('click', '.page-back', function () {
    onBackKeyDown();
})