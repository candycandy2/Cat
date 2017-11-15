
/*global variable, function*/
var initialAppName = "QChat";
var appKeyOriginal = "appqchat";
var appKey = "appqchat";
var pageList = ["viewIndex", "viewChatroom", "viewNewChatroom", "viewAddFriend", "viewChatroomInfo"];
//var waterMarkPageList = ["viewChatroom"];
var appSecretKey = "9f48f50f233f6ec48ffc4ae93d52a335";

var prevPageID;
var jmessagePWD;
var QChatJPushAppKey;
var QChatJPushSecretKey;

window.initialSuccess = function() {

    $.get('img/component/img_qplay.svg', function(svg){
        $('body').append(svg);
    }, 'text');

    QChatJPushAppKey = "9f8e8736002966a1c4e8718e";
    QChatJPushSecretKey = "c338a15248dbe291916029a1";
    if (loginData["versionName"].indexOf("Staging") !== -1) {
        QChatJPushAppKey = "b9f11c162bdee47456d6d871";
        QChatJPushSecretKey = "e45d3e9174467faae5e3c5ca";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        QChatJPushAppKey = "f1007b6d14755a1e17e74195";
        QChatJPushSecretKey = "1c33fd43b7c962ebaf14893a";
    }

    $.mobile.changePage('#viewIndex');

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
                    var cutLength = 2;

                    if (memberCount > 9) {
                        cutLength = 3;
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
