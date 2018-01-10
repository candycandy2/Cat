
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var waterMarkPageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";

var prevPageID;
var openEventFromQPlay = false;
var setProjectNameFromQPlay = false;
var getEventListFinish = false;
//ITS or RM
var projectName = "ITS";

//Set the result code which means [Unknown Error]
errorCodeArray = ["014999"];

window.initialSuccess = function() {
    window.JPush.init();

    window.ENSJPushAppKey = "c96ae87b304de281b976d0ea";
    window.ENSJPushSecretKey = "5292cabae5da19de1b8c5b9c";
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        window.ENSJPushAppKey = "1c0c758b8329f982ce27c975";
        window.ENSJPushSecretKey = "ab1a8d5a25de73f260dad51f";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        window.ENSJPushAppKey = "6e51cf3c174910d247ac76f3";
        window.ENSJPushSecretKey = "335a12f8b4b9d71c9d813e7d";
    }

    loadingMask("show");

    changeProject("check");
    chatRoom.initialData();
    processLocalData.initialData();
    checkEventTemplateData("check");

    $.mobile.changePage('#viewEventList');

    JM.initial();
    chatRoom.resetBadge();
}

var chatRoom = {
    nowChatRoomID: "",
    Messages: {},
    sendNewMsg: false,
    localPhotoUrl: "",
    setChatroomID: function(ID) {
        this.nowChatRoomID = ID;
        JM.chatroomID = ID;

        JM.Chatroom.getGroupInfo();
    },
    initialData: function() {
        if (window.localStorage.getItem("Messages") !== null) {
            var tempDate = window.localStorage.getItem("Messages");
            chatRoom.Messages = JSON.parse(tempDate);
        }
    },
    updateLocalStorage: function() {
        window.localStorage.setItem("Messages", JSON.stringify(chatRoom.Messages));
    },
    messageHandler: function(type, data) {
        console.log("------------messageHandler");
        console.log(data);

        //For API getGroupConversationHistoryMessage
        //if (type === "group") {
            if (chatRoom.Messages[chatRoom.nowChatRoomID] === undefined) {
                chatRoom.Messages[chatRoom.nowChatRoomID] = [];
            }

            if (data.messages.length == 0) {
                loadingMask("hide");
                chatRoomListView();
                return;
            }

            for (var i=0; i<data.messages.length; i++) {

                /*
                if (device.platform === "iOS") {
                    var messageTimestamp = data.messages[i].create_time;
                } else if (device.platform === "Android") {
                    var messageTimestamp = data.messages[i].msg_ctime;
                }

                if (messageTimestamp.toString().length == 10) {
                    messageTimestamp = messageTimestamp.toString() + "000";
                }
                messageTimestamp = parseInt(messageTimestamp, 10);
                */
                var messageTimestamp = data.messages[i].msg_ctime;

                var createTime = new Date(messageTimestamp);
                var objData = {
                    msg_id: data.messages[i].msgid,
                    ctime: messageTimestamp,
                    ctimeText: createTime.getFullYear() + "/" + padLeft(parseInt(createTime.getMonth() + 1, 10), 2) + "/" +
                        padLeft(createTime.getUTCDate(), 2) + " " + padLeft(createTime.getHours(), 2) + ":" +
                        padLeft(createTime.getMinutes(), 2),
                    from_id: data.messages[i].from_id,
                    msg_type: data.messages[i].msg_type,
                    msg_body: data.messages[i].msg_body
                };

                if (chatRoom.Messages[chatRoom.nowChatRoomID].length == 0) {
                    chatRoom.Messages[chatRoom.nowChatRoomID].push(objData);
                } else {
                    var localDataLength = chatRoom.Messages[chatRoom.nowChatRoomID].length
                    var localDataLatestCTime = chatRoom.Messages[chatRoom.nowChatRoomID][localDataLength - 1]["ctime"];

                    if (messageTimestamp == localDataLatestCTime) {
                        chatRoom.Messages[chatRoom.nowChatRoomID].pop();
                        chatRoom.Messages[chatRoom.nowChatRoomID].push(objData);
                    } else if (messageTimestamp > localDataLatestCTime) {
                        chatRoom.Messages[chatRoom.nowChatRoomID].push(objData);
                    } else {

                        var dataIndex = 0;
                        var pushData = true;
                        var tempData = [];

                        for (var j=0; j<localDataLength; j++) {
                            var localCTime = chatRoom.Messages[chatRoom.nowChatRoomID][j]["ctime"];

                            if (localCTime < messageTimestamp) {
                                tempData.push(chatRoom.Messages[chatRoom.nowChatRoomID][j]);
                                dataIndex = j;
                            } else if (localCTime == messageTimestamp) {
                                pushData = false;
                                tempData.push(objData);
                            } else if (localCTime > messageTimestamp) {
                                if (j == 0) {
                                    tempData.push(objData);
                                    tempData.push(chatRoom.Messages[chatRoom.nowChatRoomID][j]);
                                }
                            }
                        }

                        if (pushData) {
                            dataIndex = dataIndex + 1;
                            tempData.splice(dataIndex, 0, objData);
                        }

                        chatRoom.Messages[chatRoom.nowChatRoomID] = tempData;
                    }

                }
            }

            chatRoom.updateLocalStorage();
        //}

        //For sendGroupTextMessage / sendGroupImageMessage
        /*
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
        */

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
    },
    loadImg: function() {
        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
        var activePageID = activePage[0].id;

        if (activePageID === "viewEventContent") {
            $("#messageContent .message-data-list .chat-img").each(function(index, el) {
                if ($(el).prop("src").length !== 0) {

                    var rect = el.getBoundingClientRect();
                    if (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
                    ) {
                        var ID = $(el).prop("id");
                        $("#" + ID).prop("src", photoData[ID]);
                    }

                }
            });
        }
    },
    resetBadge: function() {
        //For iOS
        window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function(data) {
            console.log(data)
        });

        window.plugins.jPushPlugin.resetBadge();
        window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
    }
};

window.addEventListener("scroll", function() {
    chatRoom.loadImg();
});

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
    if (loginData["RoleList"][projectName].indexOf(level) != -1) {
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

        var RMTitleData = window.localStorage.getItem("RMTitle");
        RMTitle = JSON.parse(RMTitleData);

        var RMContentData = window.localStorage.getItem("RMContent");
        RMContent = JSON.parse(RMContentData);

        if (eventType === "1") {
            //ITS - urgent
            tempTitleData = urgentTitle;
            tempContentData = urgentContent;
        } else if (eventType === "2") {
            //ITS - normal
            tempTitleData = normalTitle;
            tempContentData = normalContent;
        } else {
            //RM - A Class / B Class / C Class / Prevent Event / Info Share
            tempTitleData = RMTitle;
            tempContentData = RMContent;
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

                if (eventType === "1") {
                    if (window.localStorage.getItem("templateNormalUpdateIndex") !== null) {
                        templateUpdateIndex = window.localStorage.getItem("templateNormalUpdateIndex");
                    }
                } else if (eventType === "2") {
                    if (window.localStorage.getItem("templateUrgentUpdateIndex") !== null) {
                        templateUpdateIndex = window.localStorage.getItem("templateUrgentUpdateIndex");
                    }
                } else {
                    if (window.localStorage.getItem("templateRMUpdateIndex") !== null) {
                        templateUpdateIndex = window.localStorage.getItem("templateRMUpdateIndex");
                    }
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

                if (eventType === "1") {
                    window.localStorage.setItem("templateNormalUpdateIndex", templateUpdateIndex);
                } else if (eventType === "2") {
                    window.localStorage.setItem("templateUrgentUpdateIndex", templateUpdateIndex);
                } else {
                    window.localStorage.setItem("templateRMUpdateIndex", templateUpdateIndex);
                }
            }

            if (eventType === "1") {
                //ITS - urgent
                urgentTitle = tempTitleData;
                window.localStorage.setItem("urgentTitle", JSON.stringify(urgentTitle));

                urgentContent = tempContentData;
                window.localStorage.setItem("urgentContent", JSON.stringify(urgentContent));
            } else if (eventType === "2") {
                //ITS - normal
                normalTitle = tempTitleData;
                window.localStorage.setItem("normalTitle", JSON.stringify(normalTitle));

                normalContent = tempContentData;
                window.localStorage.setItem("normalContent", JSON.stringify(normalContent));
            } else {
                //RM - A Class / B Class / C Class / Prevent Event / Info Share
                RMTitle = tempTitleData;
                window.localStorage.setItem("RMTitle", JSON.stringify(RMTitle));

                RMContent = tempContentData;
                window.localStorage.setItem("RMContent", JSON.stringify(RMContent));
            }
        }
    } else {

        normalTitle = [{
            value: "1",
            text: langStr["str_043"] // "[電力維護公告] XX機房將進行電力保養及維護，請協助關機"
        }, {
            value: "2",
            text: langStr["str_044"] // "[空調維護公告] XX機房將進行空調保養及維護，請協助關機"
        }, {
            value: "3",
            text: langStr["str_045"] // "[維護公告] 2017/MM/DD(星期X) [台北]辦公室網路維護工程，辦公室網路將無法使用"
        }, {
            value: "4",
            text: langStr["str_046"] // "[電力/空調維護公告] XX機房[電力/空調]保養及維護已經完成，請協助開機"
        }];

        normalContent = [{
            value: "1",
            text: langStr["str_047"] // "XX機房將於YYYY/MM/DD 9:00AM進行電力保養及維護，請機房系統管理員於當日8:00AM以前完成關機作業及回報"
        }, {
            value: "2",
            text: langStr["str_048"] // "XX機房將於YYYY/MM/DD 9:00AM進行空調保養及維護，請機房系統管理員於當日8:00AM以前完成關機作業及回報"
        }, {
            value: "3",
            text: langStr["str_049"] // "[台北]辦公室將於2017/MM/DD 9:00AM - 5:00PM進行網路維修工程,辦公室網路將無法使用,請通知相關IT系統使用人員"
        }, {
            value: "4",
            text: langStr["str_050"] // "XX機房[電力/空調]在下午4:00PM已經完成保養及維護,請協助開機及回報"
        }];

        urgentTitle = [{
            value: "1",
            text: langStr["str_051"] // "[機房電力異常] 目前(2:30PM) XX機房因供電異常，請協助緊急關機"
        }, {
            value: "2",
            text: langStr["str_052"] // "[機房空調異常] 目前(2:30PM) XX機房因空調系統故障，請協助緊急關機"
        }, {
            value: "3",
            text: langStr["str_053"] // "[機房電力／空調正常]目前(4:30PM)  XX機房[電力/空調]已經恢復正常，請協助開機"
        }];

        urgentContent = [{
            value: "1",
            text: langStr["str_054"] // "目前(2:30PM) XX機房因市電供電異常影響機房電力系統. 請機房系統管理員於30分鐘內(3:00PM以前)完成關機作業"
        }, {
            value: "2",
            text: langStr["str_055"] // "目前(2:30PM) XX機房因空調系統故障. 機房溫度過高，請機房系統管理員於30分鐘內(3:00PM以前)完成關機作業"
        }, {
            value: "3",
            text: langStr["str_056"] // "目前(4:30PM)XX機房[電力/空調]已經恢復正常,請機房系統管理員協助開機及回報"
        }];

        RMTitle = [{
            value: "1",
            text: langStr["str_057"] // "工傷"
        }, {
            value: "2",
            text: langStr["str_058"] // "火災、爆炸"
        }, {
            value: "3",
            text: langStr["str_059"] // "傳染病"
        }, {
            value: "4",
            text: langStr["str_060"] // "營業中斷"
        }, {
            value: "5",
            text: langStr["str_061"] // "SCM斷料"
        }, {
            value: "6",
            text: langStr["str_062"] // "貨物損失"
        }, {
            value: "7",
            text: langStr["str_063"] // "客戶倒閉"
        }, {
            value: "8",
            text: langStr["str_064"] // "產品品質"
        }, {
            value: "9",
            text: langStr["str_065"] // "IT中斷"
        }, {
            value: "10",
            text: langStr["str_106"] // "其他"
        }];

        RMContent = [{
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
        window.localStorage.setItem("RMTitle", JSON.stringify(RMTitle));
        window.localStorage.setItem("RMContent", JSON.stringify(RMContent));
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
        projectName = queryData["project"];
        setProjectNameFromQPlay = true;

        if (getEventListFinish) {
            $.mobile.changePage('#viewEventContent');
            var eventDetail = new getEventDetail(eventRowID);
        } else {
            openEventFromQPlay = true;
        }
    }
}
