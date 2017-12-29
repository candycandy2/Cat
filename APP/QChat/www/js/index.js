
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

    window.JPush.init();

    //Bind JMessage Listener Event
    if (!bindJMEvent) {
        JM.bindEvent(receiveMessage, clickMessageNotification, syncOfflineMessage, loginStateChanged, syncRoamingMessage);
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

        if (JM.data.chatroom_user[userID].avator_download_time != 0) {
            $("#userInfoPopup svg.chatroom-info-photo").hide();
            $("#userInfoPopup img").prop("src", JM.data.chatroom_user[userID].avator_path);
            $("#userInfoPopup img").show();
        } else {
            $("#userInfoPopup img").hide();
            $("#userInfoPopup svg.chatroom-info-photo").show();
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
                var empNumberArray = [JM.data.chatroom_user[window.personalPopupUserID].emp_no];

                //Create chatroom
                loadingMask("show");
                window.newQChatroom(name, desc, empNumberArray);

            }

        }
    }, "#userInfoPopup .personal-popup-button");

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
function onPause() {
    console.log("======-------pause");

    //When APP in background, need to receive the Push Notification
    JM.Chatroom.exitConversation();
}

//Handle APP foreground event
function onResume() {
    console.log("======-------resume");

    //When APP in foreground, check if the view is chatroom, then stop receive the Push Notification
}

//JPush - for push from QPlay Server
document.addEventListener("jpush.openNotification", function (event) {
    if (device.platform == "Android") {
        console.log(event.extras.Parameter);
        var extras = event.extras.Parameter;
        var parameter = extras.split("=");

        if (parameter[1] === "acceptQInvitation") {
            prevPageID = "viewFriendInvite";
            window.getQFriend();
            $.mobile.changePage('#viewIndex');
        } else if (parameter[1] === "sendQInvitation") {
            window.getQFriend("receiveInvite");
        }
    } else {
        console.log(event.aps.alert);
    }
}, false);

document.addEventListener("jpush.receiveNotification", function (event) {
    if (device.platform == "Android") {
        console.log(event.extras.Parameter);
        var extras = event.extras.Parameter;
        var parameter = extras.split("=");

        if (parameter[1] === "sendQInvitation" || parameter[1] === "acceptQInvitation") {
            window.getQFriend();
        }
    } else {
        console.log(event.aps.alert);
    }
}, false);

//JMessage - Event Listener
document.addEventListener("jpush.receiveMessage", function (event) {
    if (device.platform == "Android") {
        console.log(event.extras.Parameter);
    } else {
        console.log(event.content);
    }
}, false);

window.receiveMessage = function(data) {
    console.log("----receiveMessage");
    console.log(data);

    //var doAction = true;
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
    var activePageID = activePage[0].id;

    if (!$.isEmptyObject(data.extras)) {

        if (data.extras.event === "false") {
            if (activePageID === "viewChatroom") {
                window.getConversation(data.extras.chatroom_id, true, true);
            } else {
                window.getConversation(data.extras.chatroom_id, false, true);
            }
        } else if (data.type === "text" && data.extras.event === "true") {

            window.getGroupIds("receiveMessage", data);
            /*
            if (data.extras.action === "newChatroom") {
                if (activePageID === "viewIndex") {
                    window.getGroupIds("receiveMessage", data);
                }
            } else if (data.extras.action === "memberEvent") {
                if (activePageID === "viewChatroom") {
                    window.getConversation(data.extras.chatroom_id, true, true);
                } else {
                    window.getConversation(data.extras.chatroom_id, false, true);
                }
            }
            */
        }
    }
};

window.clickMessageNotification = function(data) {
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

    window.getConversation(data.target.id, false, true);
};
