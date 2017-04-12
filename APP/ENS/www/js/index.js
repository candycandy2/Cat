
/*global variable, function*/
var initialAppName = "ENS";
var appKeyOriginal = "appens";
var appKey = "appens";
var pageList = ["viewEventList", "viewEventAdd", "viewEventContent"];
var appSecretKey = "dd88f6e1eea34e77a9ab75439d327363";
var QMessageKey = "e343504d536ebce16b70167e";
var QMessageSecretKey = "62f87cad6de67db6c968ba50";

var prevPageID;
var openEventFromQPlay = false;

//Set the result code which means [Unknown Error]
errorCodeArray = ["014999"];

window.initialSuccess = function() {

    loadingMask("show");

    processLocalData.initialData();
    checkEventTemplateData("check");

    $.mobile.changePage('#viewEventList');

    //QMessage
    var api_url = serverURL.substr(8);
    var opts = {
        'username': loginData["loginid"],
        'eventHandler': chatRoom.eventHandler,
        'messageHandler': chatRoom.messageHandler,
        'message_key': QMessageKey,
        'message_secret': QMessageSecretKey,
        'message_api_url_prefix': api_url + "/qmessage/public/"
    };
    msgController = window.QMessage(opts);

    window.checkTimer = setInterval(function() {

        if (msgController.isInited) {
            console.log("-------------isInited:true");
            stopCheck();
        } else {
            console.log("-------------isInited:false");
        }

    }, 1000);

    window.stopCheck = function() {
        if (window.checkTimer != null) {
            clearInterval(window.checkTimer);
        }
    };

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
                msg_body: data["messages"][i]["content"]["msg_body"]["text"]
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
function checkEventTemplateData(action, data) {
    data = data || null;

    if (window.localStorage.getItem("template") !== null) {
        var tempDate = window.localStorage.getItem("template");
        templateData = JSON.parse(tempDate);

        if (action === "update") {
            if (templateData.length < 20) {
                var value = templateData.length+1;
                var text = data;
                var tempObj = {
                    value: value,
                    text: text
                };

                templateData.push(tempObj);
            } else {

                var templateUpdateIndex = 1;

                if (window.localStorage.getItem("templateUpdateIndex") !== null) {
                    templateUpdateIndex = window.localStorage.getItem("templateUpdateIndex");
                }

                for (var i=0; i<templateData.length; i++) {
                    if (templateUpdateIndex == parseInt(i+1, 10)) {
                        var value = templateUpdateIndex;
                        var text = data;
                        var tempObj = {
                            value: value,
                            text: text
                        };

                        templateData[i] = tempObj;
                    }
                }
                templateUpdateIndex++;
                window.localStorage.setItem("templateUpdateIndex", templateUpdateIndex);
            }

            window.localStorage.setItem("template", JSON.stringify(templateData));
        }
    } else {
        templateData = [{
            value: "1",
            text: "罐頭範本-1"
        }, {
            value: "2",
            text: "罐頭範本-2"
        }, {
            value: "3",
            text: "罐頭範本-3"
        }];

        window.localStorage.setItem("template", JSON.stringify(templateData));
    }
}

function footerFixed() {
    $(".ui-footer").removeClass("ui-fixed-hidden");
}

//[Android]Handle the back button
function onBackKeyDown() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewEventList") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewEventList');
        } else {
            navigator.app.exitApp();
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
            if (prevPageID === "viewEventList") {
                $.mobile.changePage('#viewEventList');
            } else if (prevPageID === "viewEventContent") {
                $("#eventEditCancelConfirm").popup("open");
            }
        }

    }
}

//Open By Other APP
function handleOpenByScheme(queryData) {
    if (queryData["callbackApp"] === qplayAppKey && queryData["action"] === "openevent") {
        openEventFromQPlay = true;
        eventRowID = queryData["eventID"];
    }
}