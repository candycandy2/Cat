
/*global variable, function*/
var initialAppName = "QChat";
var appKeyOriginal = "appqchat";
var appKey = "appqchat";
var pageList = ["viewIndex", "viewChatroom", "viewNewChatroom", "viewAddFriend", "viewChatroomInfo", "viewChatroomEdit", 
                "viewAddMember", "viewMyInfoEdit", "viewFriendInvite"];
//var waterMarkPageList = ["viewChatroom"];
var appSecretKey = "9f48f50f233f6ec48ffc4ae93d52a335";

var prevPageID;
var jmessagePWD;
var QChatJPushAppKey;
var QChatJPushSecretKey;
var getPWD = false;
var bindJMEvent = false;
var APIErrorRetryTime = 0;
var APIErrorName = "";

window.initialSuccess = function() {

    QChatJPushAppKey = "9f8e8736002966a1c4e8718e";
    QChatJPushSecretKey = "c338a15248dbe291916029a1";
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        QChatJPushAppKey = "b9f11c162bdee47456d6d871";
        QChatJPushSecretKey = "e45d3e9174467faae5e3c5ca";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        QChatJPushAppKey = "f1007b6d14755a1e17e74195";
        QChatJPushSecretKey = "1c33fd43b7c962ebaf14893a";
    }

    //QPush
    QPush.initial({
        "pushCallback": QPushCallback
    });

    //Bind JMessage Listener Event
    if (!bindJMEvent) {
        JM.bindEvent(receiveMessage, receiveChatroomMessage, clickMessageNotification, syncOfflineMessage, loginStateChanged, syncRoamingMessage);
        bindJMEvent = true;
    }

    if (!getPWD) {
        loadingMask("show");
        var jmessagePassword = new getJmessagePassword();
    } else {
        window.getGroupIds();
    }

    $.get('img/component/img_qplay.svg', function(svg){
        $('body').append(svg);
    }, 'text');

    $.mobile.changePage('#viewIndex');

    //Personal Popup
    $(document).on({
        click: function(event) {
            var userID = "";

            if ($(event.target)[0].nodeName === "use") {
                userID = $(event.target.parentElement).data("userID");
            } else {
                userID = $(event.target).data("userID")
            }

            window.personalPopup(userID);
        }
    }, ".personal-popup");

    window.personalPopup = function(userID) {
        //Check if User have not register
        if (!JM.data.chatroom_user[userID].is_register) {
            return;
        }

        //User Info Popup
        $("#userInfoPopup").popup("destroy").remove();

        var userInfoPopupData = {
            id: "userInfoPopup",
            content: $("template#tplUserInfoPopup").html()
        };

        tplJS.Popup(null, null, "append", userInfoPopupData);

        $("#userInfoPopup .button").hide();
        $("#userInfoPopup .footer").hide();
        $("#userInfoPopup .ui-hr-bottom").hide();
        $("#userInfoPopup .button-add-status").hide();

        if (JM.data.chatroom_user[userID].avatar_download_time != 0) {
            /*
            $("#userInfoPopup svg.chatroom-info-photo").hide();
            $("#userInfoPopup img").prop("src", JM.data.chatroom_user[userID].avatar_path);
            $("#userInfoPopup img").show();
            */
            window.checkImageExist(JM.data.chatroom_user[userID].avatar_path, "#userInfoPopup .personal-avatar");
        } else {
            $("#userInfoPopup .personal-avatar img").hide();
            $("#userInfoPopup .personal-avatar svg").css("display", "inline-block");
        }

        var memo = "&nbsp;";

        if (JM.data.chatroom_user[userID].memo != null && JM.data.chatroom_user[userID].memo.length > 0) {
            memo = JM.data.chatroom_user[userID].memo;
        }

        $("#userInfoPopup .personal-popup-name").html(userID);
        $("#userInfoPopup .personal-popup-memo").html(memo);
        $("#userInfoPopup .personal-popup-email").html(JM.data.chatroom_user[userID].email);
        $("#userInfoPopup .personal-popup-phone").html(JM.data.chatroom_user[userID].ext_no);

        if (loginData["loginid"] === userID) {
            //Yourself
            $("#userInfoPopup .button-edit").show();
        } else {
            //Other User
            var is_friend = JM.data.chatroom_user[userID].is_friend;
            var is_protect = JM.data.chatroom_user[userID].is_protect;
            var is_invite = JM.data.chatroom_user[userID].is_invite;

            $("#userInfoPopup .button-chat").show();

            if (is_friend) {
                $("#userInfoPopup .button-delete").show();
            } else {
                $("#userInfoPopup .button-add").show();
            }

            if (is_protect && !is_friend) {
                $("#userInfoPopup .button-chat").hide();

                if (is_invite) {
                    $("#userInfoPopup .status-b").show();
                    $("#userInfoPopup .button-add").addClass("personal-popup-button-disable");
                } else {
                    $("#userInfoPopup .status-a").show();
                }
            }

            if (prevPageID === "viewChatroom") {
                $("#userInfoPopup .button-chat").hide();
            }
        }

        window.personalPopupUserID = userID;
        $("#userInfoPopup").popup("open");
    };

    $(document).on({
        click: function(event) {
            $("#userInfoPopup").popup("close");
        }
    }, "#userInfoPopup .close-popup");

    $(document).on({
        click: function(event) {

            if ($(event.target).hasClass("button-edit") || $(event.target).parent().hasClass("button-edit")) {
                $.mobile.changePage('#viewMyInfoEdit');
            } else if ($(event.target).hasClass("button-delete") || $(event.target).parent().hasClass("button-delete")) {
                $("#userInfoPopup").popup("close");
                $("#confirmDeleteFriendPopup").popup("open");
            } else if ($(event.target).hasClass("button-add") || $(event.target).parent().hasClass("button-add")) {

                //Check if is Protect User
                if (JM.data.chatroom_user[window.personalPopupUserID].is_protect) {
                    //Check if send invite before
                    if (!JM.data.chatroom_user[window.personalPopupUserID].is_invite) {
                        window.sendQInvitation("popup", window.personalPopupUserID);
                    }
                } else {
                    window.setQFriend(window.personalPopupUserID);
                }

            } else if ($(event.target).hasClass("button-chat") || $(event.target).parent().hasClass("button-chat")) {

                var name = window.personalPopupUserID;
                var desc = "need_history=Y;group_message=N;name_changed=N";
                var empNameArray = [window.personalPopupUserID];

                //Create chatroom
                loadingMask("show");

                window.checkQPrivateChat(JM.data.chatroom_user[window.personalPopupUserID].emp_no, name, desc, empNameArray);

            }

        }
    }, "#userInfoPopup .personal-popup-button");

    //Handle APP background event
    document.addEventListener("pause", onAPPPause, false);

    //Handle APP foreground event
    document.addEventListener("resume", onAPPResume, false);

};

function cutString(maxViewWidth, string, fontSize, type, memberCount) {

    //type:number > only for chatroom name in chatroom list
    type = type || null;
    memberCount = memberCount || null;

    var tempID = "cutString" + Math.floor((Math.random() * 1000) + 1);
    $("body").append('<span id="' + tempID + '" style="display:none; font-size: ' + fontSize + 'vw;"></span>');

    var maxWidthPX = parseInt(document.documentElement.clientWidth * maxViewWidth / 100, 10);
    var fontSizePX = parseInt(document.documentElement.clientWidth * fontSize / 100, 10);
    var maxStringLength = parseInt(maxWidthPX / fontSizePX, 10);

    if (type === "number" && memberCount > 2) {
        string = string + "(" + memberCount + ")";
    }

    $("#" + tempID).html(string);
    var stringWidthPX = $("#" + tempID).width();
    var displayString = string;

    if (stringWidthPX > maxWidthPX) {
        //Even though get the fontSize, but the real px of [i] and [W] are diff,
        //need to check the real width of all string.
        for (var i=maxStringLength; i<string.length; i++) {

            var tempString = "";

            if (type === "number") {
                //remove [..]
                tempString = string.substr(0, string.length-2);
                //add (2)
                tempString = string.substr(0, i) + "(" + memberCount + ")";
            } else {
                tempString = string.substr(0, i);
            }

            $("#" + tempID).html(tempString);
            stringWidthPX = $("#" + tempID).width();

            if (stringWidthPX > maxWidthPX) {

                if (type === "number") {
                    var cutLength = 3;

                    if (memberCount > 9) {
                        cutLength = 4;
                    }

                    displayString = string.substr(0, i-cutLength) + ".." + "(" + memberCount + ")";
                } else {
                    displayString = string.substr(0, i-2) + "..";
                }

                $("#" + tempID).remove();
                break;
            }
        }
    } else {
        $("#" + tempID).remove();
    }

    return displayString;

}

function createXMLDataString(data) {
    var XMLDataString = "";

    $.each(data, function(key, value) {
        XMLDataString += "<" + key + ">" + htmlspecialchars(value) + "</" + key + ">";
    });

    return XMLDataString;
}

function checkImageExist(path, domLevel1, domLevel2) {
    domLevel2 = domLevel2 || null;

    (function(path, domLevel1, domLevel2) {

        var img = new Image();

        var callback = function(exist) {

            if (domLevel1.indexOf("userInfoPopup") == -1) {
                var display = "block";
            } else {
                var display = "inline-block";
            }

            if (exist) {
                var showSVG = "none";
                var showIMG = display;
            } else {
                var showSVG = display;
                var showIMG = "none";
            }

            if (domLevel2 == null) {
                $(domLevel1 + " svg").css("display", showSVG);
                $(domLevel1 + " img").prop("src", path);
                $(domLevel1 + " img").css("display", showIMG);
            } else {
                $(domLevel1).find(domLevel2 + " svg").css("display", showSVG);
                $(domLevel1).find(domLevel2 + " img").prop("src", path);
                $(domLevel1).find(domLevel2 + " img").css("display", showIMG);
            }

        };

        img.onload = function() {
            callback(true);
        };

        img.onerror = function() {
            callback(false);
        };

        img.src = path;

    }(path, domLevel1, domLevel2));
}

function handleAPIError(APIName, resultCode, callback, parameter) {

    if (window.APIErrorRetryTime === 0) {
        window.APIErrorName = APIName;
    }

    if (window.APIErrorName == APIName) {
        if (window.APIErrorRetryTime <= 3) {

            //025930: JMessage > QPlay timeout
            if (resultCode === "025930") {

                //Now, only retry 3 times.
                if (window.APIErrorRetryTime === 3) {
                    window.APIErrorRetryTime = 0;
                    window.APIErrorName = "";

                    $.mobile.changePage('#viewIndex');
                    return;
                }

                if (typeof callback === "function") {
                    callback(parameter);
                    APIErrorRetryTime++;
                }

            }

        }
    }

}

//[Android]Handle the back button
function onBackKeyDown() {

    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (activePageID === "viewIndex") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewIndex');
        } else {
            navigator.app.exitApp();
        }

    } else if (activePageID === "viewNewChatroom") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewNewChatroom');
        } else {
            $.mobile.changePage('#viewIndex');
        }

    } else if (activePageID === "viewChatroom") {

        if (checkPopupShown()) {
            $.mobile.changePage('#viewChatroom');
        } else {
            window.removeEventListener("scroll", msgListViewScroll);
            $.mobile.changePage('#viewIndex');
        }

    } else if (activePageID === "viewAddFriend") {

        $.mobile.changePage('#viewIndex');

    } else if (activePageID === "viewChatroomInfo") {

        $.mobile.changePage('#viewChatroom');

    }

}

//Handle APP background event
function onAPPPause() {
    console.log("======-------pause");

    //When APP in background, need to receive the Push Notification
    JM.Chatroom.exitConversation(JM.chatroomID);
}

//Handle APP foreground event
function onAPPResume() {
    console.log("======-------resume");

    //When APP in foreground, check if the view is chatroom, then stop receive the Push Notification
}

//QPush callback function - for push from QPlay Server (Friend Invite / Accept)
function QPushCallback(action, pushData) {
    console.log("--QPushCallback");
    console.log(pushData);

    if (action === "open") {
        if (device.platform == "Android") {
            var parameter = pushData.split("=");

            if (parameter[1] === "acceptQInvitation") {
                prevPageID = "viewFriendInvite";
                window.getQFriend();
                $.mobile.changePage('#viewIndex');
            } else if (parameter[1] === "sendQInvitation") {
                window.getQFriend("receiveInvite");
            }
        } else {

            //iOS
            if (!$.isEmptyObject(pushData)) {
                //Data from JMessage
                JM.chatroomID = pushData.chatroom_id;

                if (prevPageID === "viewChatroom") {
                    $.mobile.changePage('#viewChatroom', {
                        reloadPage: true
                    });
                }

                $.mobile.changePage('#viewChatroom');
            } else {
                //Data from QPlay Server
                var parameter = pushData.split("=");

                if (parameter[1] === "acceptQInvitation") {
                    prevPageID = "viewFriendInvite";
                    window.getQFriend();
                    $.mobile.changePage('#viewIndex');
                } else if (parameter[1] === "sendQInvitation") {
                    window.getQFriend("receiveInvite");
                }
            }

        }
    } else if (action === "receive") {
        if (device.platform == "Android") {
            var parameter = pushData.split("=");

            if (parameter[1] === "sendQInvitation" || parameter[1] === "acceptQInvitation") {
                window.getQFriend();
            }
        } else {

            //iOS - Receive Event in JPush, only listener from QPlay Server, ignore JMessage
            if (typeof pushData !== "object") {
                var parameter = pushData.split("=");

                if (parameter[1] === "sendQInvitation" || parameter[1] === "acceptQInvitation") {
                    window.getQFriend();
                }
            }

        }
    }
}

//JMessage - Event Listener
window.receiveMessage = function(data) {
    console.log("----receiveMessage");
    console.log(data);

    //var doAction = true;
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;
    var getHistory = false;

    if (!$.isEmptyObject(data.extras)) {

        if (activePageID === "viewChatroom") {
            getHistory = true;
        }

        if (data.extras.event === "false") {
            window.getConversation(data.extras.chatroom_id, getHistory, true);
        } else if (data.type === "text" && data.extras.event === "true") {

            var refreshGroupMember = false;

            if (data.extras.action === "newChatroom") {
                window.getGroupIds("receiveMessage", data);
            } else if (data.extras.action === "memberAdd") {

                refreshGroupMember = true;
                window.getGroupIds("memberAdd", data);

            } else if (data.extras.action === "memberRemove") {

                refreshGroupMember = true;
                window.getGroupIds("memberRemove", data);

            } else if (data.extras.action === "memberLeave") {

                //Wait for JMessage.Event["group_member_exit"],
                //then call getGroupMembers to refresh member list.
                refreshGroupMember = false;
                window.getGroupIds("memberLeave", data);

            }

            //Update Chatroom title
            if (refreshGroupMember) {
                if (activePageID === "viewChatroom") {
                    window.getGroupMembers(data.extras.chatroom_id, true, "getConversation");
                } else if (activePageID === "viewIndex") {
                    window.getGroupMembers(data.extras.chatroom_id, true, "chatroomListView");
                }
            }
        }
    } else if (data.type === "event") {

        if (data.eventType === "group_member_removed") {
            //JMessage Event Message - Current User has been removed
            if (data.usernames[0] === loginData["loginid"]) {
                delete JM.data.chatroom[data.target.id];
                delete JM.data.chatroom_message_history[data.target.id];
                JM.updateLocalStorage();

                $("#chatroomListContent #chatroomList" + data.target.id).remove();
                $("#chatroomListContent #chatroomHR" + data.target.id).remove();

                //If User in viewChatroom / viewChatroomInfo / viewChatroomEdit / viewAddMember, redirect to viewIndex
                if (activePageID === "viewChatroom" || activePageID === "viewChatroomInfo" || activePageID === "viewChatroomEdit" || 
                    activePageID === "viewAddMember") {
                    $.mobile.changePage('#viewIndex');
                }
            }
        } else if (data.eventType === "group_member_exit") {
            //JMessage Event Message - Chatroom member leave.
            if (activePageID === "viewChatroom") {
                window.getGroupMembers(data.target.id, true, "getConversation");
            } else if (activePageID === "viewIndex") {
                window.getGroupMembers(data.target.id, true, "chatroomListView");
            }
        }

    }
};

window.receiveChatroomMessage = function(data) {
    console.log("----receiveChatroomMessage");
    console.log(data);
};

window.clickMessageNotification = function(data) {
    //iOS will not trigger this event!!
    console.log("----clickMessageNotification");
    console.log(data);

    if (!$.isEmptyObject(data.extras)) {
        JM.chatroomID = data.extras.chatroom_id;

        if (prevPageID === "viewChatroom") {
            $.mobile.changePage('#viewChatroom', {
                reloadPage: true
            });
        }

        $.mobile.changePage('#viewChatroom');
    }

};

window.syncOfflineMessage = function(data) {
    console.log("----syncOfflineMessage");
    console.log(data);

    window.processChatroomData(data.conversation, "getConversations", false, true);
};

window.loginStateChanged = function(data) {
    console.log("----loginStateChanged");
    console.log(data);
};

window.syncRoamingMessage = function(data) {
    console.log("----syncRoamingMessage");
    console.log(data);

    if (device.platform === "iOS") {
        window.getConversation(data.target.id, false, true);
    } else {
        window.getConversation(data.conversation.target.id, false, true);
    }
};
