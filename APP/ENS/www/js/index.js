
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";
//var QMessageKey = "e343504d536ebce16b70167e";
//var QMessageSecretKey = "62f87cad6de67db6c968ba50";

var prevPageID;
var openEventFromQPlay = false;
var getEventListFinish = false;

//Set the result code which means [Unknown Error]
errorCodeArray = ["014999"];

window.initialSuccess = function() {

    loadingMask("show");

    processLocalData.initialData();
    checkEventTemplateData("check");

    $.mobile.changePage('#viewEventList');

    //QMessage
    var opts = {
        'username': loginData["loginid"],
        'eventHandler': chatRoom.eventHandler,
        'messageHandler': chatRoom.messageHandler,
        'message_key': QMessageKey,
        'message_secret': QMessageSecretKey,
        'message_api_url_prefix': serverURL.substr(8) + "/qmessage/public/"
    };

    message = function() {
        var self = this;
        this.checkTimeCount = 0;

        this.checkTimer = setInterval(function() {
            self.checkTimeCount++;
            if (self.isInited) {
                console.log("-------------isInited:true");
                self.stopCheck();
            } else {
                console.log("-------------isInited:false");
                if (self.checkTimeCount === 10) {
                    self.checkTimeCount = 0;
                    self.stopCheck();
                    initialMessage();
                }
            }
        }, 1000);

        this.stopCheck = function() {
            if (self.checkTimer != null) {
                clearInterval(self.checkTimer);
            }
        };
    };
    message.prototype = new window.QMessage(opts);
    message.prototype.constructor = message;

    initialMessage = function () {
        msgController = null;
        msgController = new message();
    };
    initialMessage();

}

var chatRoom = {
    newMsgChatRoomID: "",
    eventHandler: function(data) {
        console.log("------------eventHandler");
        console.log(data);
    },
    messageHandler: function(data) {
        console.log("------------messageHandler");
        console.log(data);
        //1. Every time when APP receive new message, stored it in local storage.
        //2. The old message won't be sent again.
        //3. Stored messages according to the chat room ID.
        for (var i=0; i<data["messages"].length; i++) {
            var createTime = new Date(data["messages"][i]["ctime"] * 1000);
            var objData = {
                msg_id: data["messages"][i]["msg_id"],
                ctime: data["messages"][i]["ctime"],
                ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                    padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                    padLeft(createTime.getMinutes(), 2),
                from_id: data["messages"][i]["content"]["from_id"],
                msg_type: data["messages"][i]["content"]["msg_type"],
                msg_body: data["messages"][i]["content"]["msg_body"]
            };

            chatRoom.newMsgChatRoomID = data["messages"][i]["from_gid"];
            chatRoom.storeMsg(data["messages"][i]["from_gid"], objData, chatRoom.refreshMsg);
        }
    },
    storeMsg: function(chatRoomID, data, callback) {
        callback = callback || null;

        if (window.localStorage.getItem("Messages") !== null) {
            var tempDate = window.localStorage.getItem("Messages");
            var Messages = JSON.parse(tempDate);
        } else {
            var Messages = {};
        }

        if (Messages[chatRoomID] === undefined) {
            Messages[chatRoomID] = [];
        }

        Messages[chatRoomID].push(data);
        window.localStorage.setItem("Messages", JSON.stringify(Messages));

        if (typeof callback === "function") {
            callback();
        }
    },
    getMsg: function(chatRoomID) {
        var chatRoomExist = false;

        if (window.localStorage.getItem("Messages") !== null) {
            var tempDate = window.localStorage.getItem("Messages");
            var Messages = JSON.parse(tempDate);

            if (Messages[chatRoomID] !== undefined) {
                chatRoomExist = true;
            }
        }

        if (chatRoomExist) {
            return Messages[chatRoomID];
        } else {
            return false;
        }
    },
    refreshMsg: function() {
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        var activePageID = activePage[0].id;

        if (activePageID === "viewEventContent") {
            if (chatroomID === chatRoom.newMsgChatRoomID.toString()) {
                chatRoomListView();
            }
        }
    }
};

//1. Each data has its own life-cycle.
//2. Every time before call API, check the life-cycle timestamp first.
//3. If life-cycle was expired, call API to get data again.
//4. If life-cycle was not expired, don't call API.
var processLocalData = {
    initialData: function() {
        if (window.localStorage.getItem("localData") !== null) {
            var tempDate = window.localStorage.getItem("localData");
            localData = JSON.parse(tempDate);
        } else {
            localData = {};
        }
    },
    updateLocalStorage: function() {
        window.localStorage.setItem("localData", JSON.stringify(localData));
    },
    checkLifeCycle: function(dataName, callAPI, dataExistCallBack) {
        callAPI = callAPI || null;
        dataExistCallBack = dataExistCallBack || null;

        if (localData[dataName] !== undefined) {
            //data exist, check expired-timestamp & latest-update-timestamp
            var lifeCycle = parseInt(localData[dataName]["lifeCycle"]);
            var expiredTimeStamp = parseInt(localData[dataName]["expiredTimeStamp"]);
            var latestUpdateTimeStamp = parseInt(localData[dataName]["latestUpdateTimeStamp"]);

            if (latestUpdateTimeStamp >= expiredTimeStamp) {
                //data expired, call API again
                callAPI();
            } else {
                //data not expired, just update latestUpdateTimeStamp
                var nowTime = new Date();
                var nowTimeStamp = nowTime.TimeStamp();
                localData[dataName]["latestUpdateTimeStamp"] = nowTimeStamp;

                dataExistCallBack(localData[dataName]["data"], true);
            }

        } else {
            //data not exist
            callAPI();
        }
    },
    storeData: function(dataName, lifeCycle, data) {
        var nowTime = new Date();
        var nowTimeStamp = nowTime.TimeStamp();
        var expiredTimeStamp = parseInt(nowTimeStamp + lifeCycle, 10);

        localData[dataName] = {
            lifeCycle: lifeCycle,
            expiredTimeStamp: expiredTimeStamp,
            latestUpdateTimeStamp: nowTimeStamp,
            data: data
        };

        this.updateLocalStorage();
    },
    createXMLDataString: function(data) {
        var XMLDataString = "";

        $.each(data, function(key, value) {
            XMLDataString += "<" + key + ">" + htmlspecialchars(value) + "</" + key + ">";
        });

        return XMLDataString;
    }
};

//Cehck User Authority
function checkAuthority(level) {
    // admin / supervisor / common
    if (loginData["RoleList"].indexOf(level) != -1) {
        return true;
    } else {
        return false;
    }
}

//Check Event Template Data
function checkEventTemplateData(action, eventType, titleData, contentData) {
    eventType = eventType || null;
    titleData = titleData || null;
    contentData = contentData || null;

    if (window.localStorage.getItem("urgentTitle") !== null) {
        var dataExist = false;
        var templateDataMaxLength = 20;
        var tempTitleData;
        var tempContentData;

        var urgentTitleData = window.localStorage.getItem("urgentTitle");
        urgentTitle = JSON.parse(urgentTitleData);

        var urgentContentData = window.localStorage.getItem("urgentContent");
        urgentContent = JSON.parse(urgentContentData);

        var normalTitleData = window.localStorage.getItem("normalTitle");
        normalTitle = JSON.parse(normalTitleData);

        var normalContentData = window.localStorage.getItem("normalContent");
        normalContent = JSON.parse(normalContentData);

        if (eventType === "1") {
            //urgent
            tempTitleData = urgentTitle;
            tempContentData = urgentContent;
        } else {
            //normal
            tempTitleData = normalTitle;
            tempContentData = normalContent;
        }

        if (action === "update") {

            //Check if title data has exist
            for (var i=0; i<tempTitleData.length; i++) {
                if (titleData === tempTitleData[i]["text"]) {
                    dataExist = true;
                }
            }

            if (tempTitleData.length < templateDataMaxLength) {
                if (!dataExist) {
                    var tempObj = {
                        value: tempTitleData.length+1,
                        text: titleData
                    };
                    tempTitleData.push(tempObj);

                    var tempObj = {
                        value: tempTitleData.length+1,
                        text: contentData
                    };
                    tempContentData.push(tempObj);
                }
            } else {
                var dataIndex;
                var templateUpdateIndex = 1;

                if (window.localStorage.getItem("templateUpdateIndex") !== null) {
                    templateUpdateIndex = window.localStorage.getItem("templateUpdateIndex");
                }

                if (!dataExist) {
                    dataIndex = parseInt(templateUpdateIndex - 1, 10);

                    var tempObj = {
                        value: templateUpdateIndex,
                        text: titleData
                    };
                    tempTitleData[dataIndex] = tempObj;

                    var tempObj = {
                        value: templateUpdateIndex,
                        text: contentData
                    };
                    tempContentData[dataIndex] = tempObj;

                    templateUpdateIndex++;
                }

                if (templateUpdateIndex > templateDataMaxLength) {
                    templateUpdateIndex = 1;
                }

                window.localStorage.setItem("templateUpdateIndex", templateUpdateIndex);
            }

            if (eventType === "1") {
                //urgent
                urgentTitle = tempTitleData;
                window.localStorage.setItem("urgentTitle", JSON.stringify(urgentTitle));

                urgentContent = tempContentData;
                window.localStorage.setItem("urgentContent", JSON.stringify(urgentContent));
            } else {
                //normal
                normalTitle = tempTitleData;
                window.localStorage.setItem("normalTitle", JSON.stringify(normalTitle));

                normalContent = tempContentData;
                window.localStorage.setItem("normalContent", JSON.stringify(normalContent));
            }
        }
    } else {
        normalTitle = [{
            value: "1",
            text: "[電力維護公告] XX機房將進行電力保養及維護，請協助關機"
        }, {
            value: "2",
            text: "[空調維護公告] XX機房將進行空調保養及維護，請協助關機"
        }, {
            value: "3",
            text: "[維護公告] 2017/MM/DD(星期X) [台北]辦公室網路維護工程，辦公室網路將無法使用"
        }, {
            value: "4",
            text: "[電力/空調維護公告] XX機房[電力/空調]保養及維護已經完成，請協助開機"
        }];

        normalContent = [{
            value: "1",
            text: "XX機房將於YYYY/MM/DD 9:00AM進行電力保養及維護，請機房系統管理員於當日8:00AM以前完成關機作業及回報"
        }, {
            value: "2",
            text: "XX機房將於YYYY/MM/DD 9:00AM進行空調保養及維護，請機房系統管理員於當日8:00AM以前完成關機作業及回報"
        }, {
            value: "3",
            text: "[台北]辦公室將於2017/MM/DD 9:00AM - 5:00PM進行網路維修工程,辦公室網路將無法使用,請通知相關IT系統使用人員"
        }, {
            value: "4",
            text: "XX機房[電力/空調]在下午4:00PM已經完成保養及維護,請協助開機及回報"
        }];

        urgentTitle = [{
            value: "1",
            text: "[機房電力異常] 目前(2:30PM) XX機房因供電異常，請協助緊急關機"
        }, {
            value: "2",
            text: "[機房空調異常] 目前(2:30PM) XX機房因空調系統故障，請協助緊急關機"
        }, {
            value: "3",
            text: "[機房電力／空調正常]目前(4:30PM)  XX機房[電力/空調]已經恢復正常，請協助開機"
        }];

        urgentContent = [{
            value: "1",
            text: "目前(2:30PM) XX機房因市電供電異常影響機房電力系統. 請機房系統管理員於30分鐘內(3:00PM以前)完成關機作業"
        }, {
            value: "2",
            text: "目前(2:30PM) XX機房因空調系統故障. 機房溫度過高，請機房系統管理員於30分鐘內(3:00PM以前)完成關機作業"
        }, {
            value: "3",
            text: "目前(4:30PM)XX機房[電力/空調]已經恢復正常,請機房系統管理員協助開機及回報"
        }];

        window.localStorage.setItem("normalTitle", JSON.stringify(normalTitle));
        window.localStorage.setItem("normalContent", JSON.stringify(normalContent));
        window.localStorage.setItem("urgentTitle", JSON.stringify(urgentTitle));
        window.localStorage.setItem("urgentContent", JSON.stringify(urgentContent));
    }
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewEventList") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewEventList');
        } else {
            if (tabActiveID === "#memberDiv") {
                changeTabToEventList();
            } else {
                navigator.app.exitApp();
            }
        }

    } else if (activePageID === "viewEventContent") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
            footerFixed();
        } else {
            $.mobile.changePage('#viewEventList');
        }

    } else if (activePageID === "viewEventAdd") {

        if (checkPopupShown()) {
            $('#' + popupID).popup('close');
            footerFixed();
        } else {
            $("#eventAddEditCancelConfirm").popup("open");
        }

    }
}

//Open By Other APP
function handleOpenByScheme(queryData) {
    if (queryData["callbackApp"] === qplayAppKey && queryData["action"] === "openevent") {
        eventRowID = queryData["eventID"];

        if (getEventListFinish) {
            $.mobile.changePage('#viewEventContent');
            var eventDetail = new getEventDetail(eventRowID);
        } else {
            openEventFromQPlay = true;
        }
    }
}
