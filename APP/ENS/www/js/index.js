
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";

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

    JM.initial();
}

var chatRoom = {
    nowChatRoomID: "",
    Messages: {},
    sendNewMsg: false,
    localPhotoUrl: "",
    setChatroomID: function(ID) {
        this.nowChatRoomID = ID;
        JM.chatroomID = ID;
    },
    messageHandler: function(type, data) {
        console.log("------------messageHandler");
        console.log(data);

        //For API getGroupConversationHistoryMessage
        if (type === "group") {
            if (chatRoom.Messages[chatRoom.nowChatRoomID] === undefined) {
                chatRoom.Messages[chatRoom.nowChatRoomID] = [];
            }

            if (data.messages.length == 0) {
                loadingMask("hide");
                chatRoomListView();
                return;
            }

            for (var i=0; i<data.messages.length; i++) {
                var createTime = new Date(data.messages[i].msg_ctime);
                var objData = {
                    msg_id: data.messages[i].msgid,
                    ctime: data.messages[i].msg_ctime,
                    ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                        padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                        padLeft(createTime.getMinutes(), 2),
                    from_id: data.messages[i].from_id,
                    msg_type: data.messages[i].msg_type,
                    msg_body: data.messages[i].msg_body
                };console.log(objData);

                if (i == 0) {
                    chatRoom.Messages[chatRoom.nowChatRoomID] = [];
                }

                chatRoom.Messages[chatRoom.nowChatRoomID].push(objData);
            }
        }

        //For sendGroupTextMessage / sendGroupImageMessage
        if (type === "single") {
            if (chatRoom.Messages[chatRoom.nowChatRoomID] === undefined) {
                chatRoom.Messages[chatRoom.nowChatRoomID] = [];
            }

            var parseData = JSON.parse(data);

            if (device.platform === "iOS") {
                var createTime = new Date(parseData.create_time);
                var objData = {
                    msg_id: "",
                    ctime: parseData.create_time,
                    ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                        padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                        padLeft(createTime.getMinutes(), 2),
                    from_id: parseData.from_id,
                    msg_type: parseData.msg_type,
                    msg_body: parseData.msg_body
                };

                if (parseData.msg_type === "image") {
                    objData["msg_body"]["media_id"] = chatRoom.localPhotoUrl;
                }
            }

            if (device.platform === "Android") {
                var createTime = new Date(parseData.createTimeInMillis);
                var objData = {
                    msg_id: "",
                    ctime: parseData.createTimeInMillis,
                    ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                        padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                        padLeft(createTime.getMinutes(), 2),
                    from_id: parseData.fromID,
                    msg_type: parseData.msgTypeString,
                    msg_body: parseData.content
                };

                if (parseData.msgTypeString === "image") {
                    objData["msg_body"]["media_id"] = chatRoom.localPhotoUrl;
                }
            }

            chatRoom.Messages[chatRoom.nowChatRoomID].push(objData);
        }

        chatRoom.refreshMsg();
    },
    refreshMsg: function() {
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        var activePageID = activePage[0].id;

        if (activePageID === "viewEventContent") {
            if (chatRoom.sendNewMsg) {
                chatRoomListView("showPreview");
                chatRoom.sendNewMsg = false;
            } else {
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
            text: "工傷"
        }, {
            value: "2",
            text: "火災、爆炸"
        }, {
            value: "3",
            text: "傳染病"
        }, {
            value: "4",
            text: "營業中斷"
        }, {
            value: "5",
            text: "SCM斷料"
        }, {
            value: "6",
            text: "貨物損失"
        }, {
            value: "7",
            text: "客戶倒閉"
        }, {
            value: "8",
            text: "產品品質"
        }, {
            value: "9",
            text: "IT中斷"
        }, {
            value: "10",
            text: "其他"
        }];

        normalContent = [{
            value: "1",
            text: ""
        }, {
            value: "2",
            text: ""
        }, {
            value: "3",
            text: ""
        }, {
            value: "4",
            text: ""
        }, {
            value: "5",
            text: ""
        }, {
            value: "6",
            text: ""
        }, {
            value: "7",
            text: ""
        }, {
            value: "8",
            text: ""
        }, {
            value: "9",
            text: ""
        }, {
            value: "10",
            text: ""
        }];

        urgentTitle = [{
                       value: "1",
                       text: "工傷"
                       }, {
                       value: "2",
                       text: "火災、爆炸"
                       }, {
                       value: "3",
                       text: "傳染病"
                       }, {
                       value: "4",
                       text: "營業中斷"
                       }, {
                       value: "5",
                       text: "SCM斷料"
                       }, {
                       value: "6",
                       text: "貨物損失"
                       }, {
                       value: "7",
                       text: "客戶倒閉"
                       }, {
                       value: "8",
                       text: "產品品質"
                       }, {
                       value: "9",
                       text: "IT中斷"
                       }, {
                       value: "10",
                       text: "其他"
                       }];

        urgentContent = [{
                         value: "1",
                         text: ""
                         }, {
                         value: "2",
                         text: ""
                         }, {
                         value: "3",
                         text: ""
                         }, {
                         value: "4",
                         text: ""
                         }, {
                         value: "5",
                         text: ""
                         }, {
                         value: "6",
                         text: ""
                         }, {
                         value: "7",
                         text: ""
                         }, {
                         value: "8",
                         text: ""
                         }, {
                         value: "9",
                         text: ""
                         }, {
                         value: "10",
                         text: ""
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
