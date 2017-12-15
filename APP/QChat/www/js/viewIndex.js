
$("#viewIndex").pagecontainer({
    create: function(event, ui) {

        window.getPWD = false;
        var timer;
        window.groupsArray = [];
        var bindJMEvent = false;
        var getQUserChatroomData = [];
        var getQUserChatroomDataTime = 0;
        var tabActiveID;
        var doSyncRoamingMessage = false;

        /********************************** function *************************************/
        window.getJmessagePassword = function() {

            var self = this;

            this.successCallback = function(data, status, xhr) {

                var resultcode = data['ResultCode'];

                if (resultcode === 1) {
                    getPWD = true;
                    jmessagePWD = data['Content'];
                    console.log(jmessagePWD);

                    JM.init(QChatJPushAppKey, sendPushToken);
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                $.ajax({
                    url: "http://qplaydev.benq.com/qmessage/public/v101/qmessage/pwd",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify({ "username": loginData["loginid"] }),
                    success: self.successCallback,
                    error: self.failCallback
                });
            }();

        };

        function sendPushToken() {
            (function() {

                //sendPushToken only do once
                if (JM.data.sendPushToken === undefined) {

                    window.JPush.getRegistrationID(function(registrationID) {
                        console.log("JPushPlugin:registrationID is " + registrationID);

                        var queryDataObj = {
                            emp_no: loginData["emp_no"],
                            device_type: device.platform.toLowerCase(),
                            push_token: registrationID
                        };

                        var queryDataParameter = createXMLDataString(queryDataObj);
                        var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                        var successCallback = function(data) {
                            var resultCode = data['ResultCode'];

                            if (resultCode === "1") {
                                JM.data.sendPushToken = true;
                                JM.updateLocalStorage();
                            }
                        };

                        var failCallback = function() {};
                        CustomAPI("POST", true, "sendPushToken", successCallback, failCallback, queryData, "");

                        window.getGroupIds();
                    });

                } else {
                    window.getGroupIds();
                }

                window.getQUserDetail("viewIndex", loginData["loginid"]);

            }());
        }

        window.getQUserDetail = function(action, empID, callback) {
            callback = callback || null;

            (function(action, empID, callback) {

                var callbackFunction = callback;

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_login_id: empID
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        if (action === "viewIndex" || action === "viewMyInfoEdit") {
                            $(".personal-content .personal-name").html(data['Content'][0].name);
                            $(".personal-content .personal-popup").data("userID", data['Content'][0].name);

                            if (data['Content'][0].memo == null) {
                                $(".personal-content .personal-name").addClass("user-name-only");
                                $(".personal-content .personal-status").addClass("hide");
                            } else {
                                $(".personal-content .personal-status").html(data['Content'][0].memo);
                            }

                            //check download time
                            var nowDateTime = new Date();
                            var nowTimestamp = nowDateTime.TimeStamp();

                            function callback() {
                                window.downloadOriginalUserAvatar("index", nowTimestamp, loginData["loginid"]);
                            }

                            window.processUserData(data['Content'][0], callback);

                            if (action === "viewIndex") {
                                window.getQFriend();
                            }
                        } else if (action === "downloadOriginalUserAvatar") {
                            window.processUserData(data['Content'][0], callbackFunction);
                        } else if (action === "inviteListView") {
                            window.processUserData(data['Content'][0], callbackFunction);
                        }
                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "getQUserDetail", successCallback, failCallback, queryData, "");

            }(action, empID, callback));
        };

        window.getQFriend = function(action) {
            action = action || null;

            (function(action) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"]
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        //check download time
                        var nowDateTime = new Date();
                        var nowTimestamp = nowDateTime.TimeStamp();

                        $(".friend-content .friend-list-content").html("");
                        $(".friend-content .invite-list-content").html("");

                        var friendDataListHTML = $("template#tplFriendDataList").html();

                        for (var i=0; i<data['Content'].friend.user_list.length; i++) {

                            var friendDataList = $(friendDataListHTML);

                            friendDataList.find(".personal-photo-content").prop("id", "friendList" + i);
                            friendDataList.find(".personal-name").html(data['Content'].friend.user_list[i].name);
                            friendDataList.find(".personal-popup").data("userID", data['Content'].friend.user_list[i].name);

                            if (data['Content'].friend.user_list[i].memo == null) {
                                friendDataList.find(".personal-name").addClass("user-name-only");
                                friendDataList.find(".personal-status").addClass("hide");
                            } else {
                                friendDataList.find(".personal-status").html(data['Content'].friend.user_list[i].memo);
                            }

                            $(".friend-content .friend-list-content").append(friendDataList);

                            function callback() {
                                window.downloadOriginalUserAvatar("friendListView", nowTimestamp, data['Content'].friend.user_list[i].name, i);
                            }

                            window.processUserData(data['Content'].friend.user_list[i], callback);
                        }

                        //only show request data when:
                        //1. Protect User
                        //2. the request count > 0
                        if (JM.data.chatroom_user[loginData["loginid"]].is_protect && data['Content'].inviter.user_list.length > 0) {
                            JM.data.chatroom_invite = [];
                            $("#viewIndexContent .friend-content .invite-list").show();

                            var inviteCount = data['Content'].inviter.user_list.length;
                            var inviteDataListHTML = $("template#tplInviteDataList").html();
                            var inviteDataList = $(inviteDataListHTML);

                            for (var i=0; i<data['Content'].inviter.user_list.length; i++) {
                                (function(user_list, i) {

                                    JM.data.chatroom_invite.push(user_list[i].name);

                                    function callback() {
                                        window.downloadOriginalUserAvatar("inviteListView", nowTimestamp, user_list[i].name, i);

                                        if (i == 0) {
                                            inviteDataList.find(".personal-photo-content").prop("id", "inviteList0");
                                            inviteDataList.find(".personal-name").html(user_list[0].name);
                                            inviteDataList.find(".personal-popup").data("userID", user_list[0].name);

                                            if (JM.data.chatroom_user[user_list[0].name].memo == null) {
                                                inviteDataList.find(".personal-name").addClass("user-name-only");
                                                inviteDataList.find(".personal-status").addClass("hide");
                                            } else {
                                                inviteDataList.find(".personal-status").html(JM.data.chatroom_user[user_list[0].name].memo);
                                            }

                                            $(".friend-content .invite-list-content").append(inviteDataList);
                                            $(".friend-content .invite-list-content #requestCount").html(user_list.length);
                                        }
                                    }

                                    window.getQUserDetail("inviteListView", user_list[i].name, callback);
                                }(data['Content'].inviter.user_list, i));
                            }

                            if (action === "receiveInvite") {
                                $.mobile.changePage('#viewFriendInvite');
                            }
                        } else {
                            $("#viewIndexContent .friend-content .invite-list").hide();
                        }

                        JM.updateLocalStorage();

                        loadingMask("hide");
                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "getQFriend", successCallback, failCallback, queryData, "");

            }(action));
        };

        window.removeQFriend = function() {
            (function() {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_emp_no: JM.data.chatroom_user[window.personalPopupUserID].emp_no
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        window.getQFriend();
                        $("#confirmDeleteFriendPopup").popup("close");
                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "removeQFriend", successCallback, failCallback, queryData, "");

            }());
        };

        window.getGroupIds = function(action, chatroom) {
            action = action || null;
            chatroom = chatroom || null;

            (function(action, chatroom) {

                var callback = function(status, data) {

                    if (status === "success") {
                        groupsArray = data;

                        //For Jmseeage, hide this action
                        //window.getConversations();

                        //Bind JMessage Listener Event
                        if (!bindJMEvent) {
                            JM.bindEvent(receiveMessage, clickMessageNotification, syncOfflineMessage, loginStateChanged, syncRoamingMessage);
                            bindJMEvent = true;
                        }

                        if (action === "receiveMessage") {

                            //Check if new chatroom
                            if (JM.data.chatroom[chatroom.extras.chatroom_id] !== undefined) {
                                window.processChatroomData(chatroom, "getConversations", false, true);
                            } else {
                                window.getConversation(chatroom.extras.chatroom_id, false, true);
                            }

                        } else if (action === "getConversation") {
                            window.processChatroomData(chatroom, "getConversations", true, false);
                        } else {
                            for (var i=0; i<JM.data.chatroom_sequence.length; i++) {
                                if (groupsArray.indexOf(JM.data.chatroom_sequence[i].toString()) != -1) {
                                    //window.processChatroomData(chatroomData, "getConversations", false, true);
                                    window.getGroupMembers(JM.data.chatroom_sequence[i], JM.data.chatroom[JM.data.chatroom_sequence[i]].is_group, "chatroomListView");
                                }
                            }
                        }
                    }

                };

                JM.Chatroom.getGroupIds(callback);

            }(action, chatroom));
        };

        window.getQUserChatroom = function(action, chatroomID, callback) {
            chatroomID = chatroomID || null;
            callback = callback || null;

            (function(action, chatroomID, callback) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"]
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];
                    getQUserChatroomData = data["Content"];

                    if (resultCode === "1") {

                        if (action === "conversation") {
                            if (data["Content"].length > 0) {
                                for (var i=0; i<data["Content"].length; i++) {
                                    if (data["Content"][i].gid == chatroomID) {
                                        callback(data["Content"][i].name, data["Content"][i].desc);
                                        break;
                                    }
                                }
                            }
                        }

                    }
                };

                var failCallback = function() {};

                //Check call API getQUserChatroom life cycle, 60sec
                var nowDateTime = new Date();
                var nowTimestamp = nowDateTime.TimeStamp();

                if (getQUserChatroomDataTime == 0) {
                    getQUserChatroomDataTime = nowTimestamp;
                }

                if (getQUserChatroomData.length == 0) {
                    CustomAPI("POST", true, "getQUserChatroom", successCallback, failCallback, queryData, "");
                } else {

                    if (parseInt(getQUserChatroomDataTime + 60, 10) < nowTimestamp) {
                        getQUserChatroomDataTime = nowTimestamp;
                        CustomAPI("POST", true, "getQUserChatroom", successCallback, failCallback, queryData, "");
                    } else {
                        for (var i=0; i<getQUserChatroomData.length; i++) {
                            if (getQUserChatroomData[i].gid == chatroomID) {
                                callback(getQUserChatroomData[i].name, getQUserChatroomData[i].desc);
                                break;
                            }
                        }
                    }

                }

            }(action, chatroomID, callback));
        };

        window.getConversations = function() {

            (function() {
                var callback = function(status, data) {

                    if (status === "success") {

                        $("#chatroomListContent .chatroom-list").remove();
                        $("#chatroomListContent .ui-hr-message").remove();

                        for (var i=0; i<data.length; i++) {

                            //For Alan, because he create a single chatroom,
                            //so need to check chatroom type, just for the only one data.
                            if (data[i].conversationType === "group") {
                                window.processChatroomData(data[i], "getConversations", false, true);
                            }

                        }

                        loadingMask("hide");

                        //If no chatroom, show message
                        if (data.length == 0) {
                            $("#noChatroom").show();
                        } else {
                            $("#noChatroom").hide();
                        }
                    }

                };

                JM.Chatroom.getConversations(callback);
            }());
        };

        window.checkChatroomAvatar = function(chatroomID, is_group) {

            if (JM.data.chatroom[chatroomID].avatar_path.length == 0) {
                //Never get chatroom avatar
                window.getGroupMembers(chatroomID, is_group);
            } else {
                //Check the avatar life cycle, 3 days
                /*
                var nowDateTime = new Date();
                var nowTimestamp = nowDateTime.TimeStamp();

                var avatarDownloadDataTime = new Date(JM.data.chatroom[chatroomID].avatar_download_time * 1000);
                var threeDaysTimeStamp = avatarDownloadDataTime.setDate(avatarDownloadDataTime.getDate() + 3) / 1000;

                if (nowTimestamp > threeDaysTimeStamp) {
                    //Update avatar
                    for (var i=0; i<JM.data.chatroom[chatroomID].member.length; i++) {
                        //[1 to 1] chatroom, show another member's avatar
                        if (JM.data.chatroom[chatroomID].member[i].username !== loginData["loginid"]) {
                            window.getUserInfo(chatroomID, JM.data.chatroom[chatroomID].member[i].username);
                        }
                    }
                } else {
                    $("#chatroomList" + chatroomID).find(".img-content img").prop("src", JM.data.chatroom[chatroomID].avatar_path);
                }
                */
                window.getGroupMembers(chatroomID, is_group);
            }

        };

        window.getGroupMembers = function(chatroomID, is_group, action) {
            action = action || null;

            (function(chatroomID, is_group, action) {

                var callback = function(status, data) {

                    if (status === "success") {

                        //Check if member changed
                        var memberChange = false;
                        var oldMemberData = [];

                        for (var i=0; i<JM.data.chatroom[chatroomID].member.length; i++) {
                            oldMemberData.push(JM.data.chatroom[chatroomID].member[i].username);
                        }

                        for (var i=0; i<data.length; i++) {
                            if (oldMemberData.indexOf(data[i].username) == -1) {
                                memberChange = true;
                            }
                        }

                        //Set new data
                        JM.data.chatroom[chatroomID].member = data;

                        JM.updateLocalStorage();

                        if (!is_group) {
                            //[1 to 1] chatroom, show another member's avatar
                            for (var i=0; i<data.length; i++) {
                                if (data[i].username !== loginData["loginid"]) {
                                    window.getUserInfo(chatroomID, data[i].username);
                                }
                            }
                        }

                        var need_history = "";
                        var group_message = "";
                        var name_changed = "";
                        var desc = "";

                        if (JM.data.chatroom[chatroomID].need_history) {
                            need_history = "Y";
                        } else {
                            need_history = "N";
                        }

                        if (is_group) {
                            group_message = "Y";
                        } else {
                            group_message = "N";
                        }

                        if (JM.data.chatroom[chatroomID].name_changed) {
                            name_changed = "Y";
                        } else {
                            name_changed = "N";
                        }

                        desc = "need_history=" + need_history + ";group_message=" + group_message + ";name_changed=" + name_changed;

                        if (name_changed != "Y" && memberChange) {
                            //If member changed, update chatroom name in:
                            //1. chatroom list
                            //2. local storage
                            //3. JMessage Server side
                            //4. QPlay Server side
                            var chatroomName = "";

                            for (var i=0; i<data.length; i++) {
                                var add = true;

                                if (!is_group && loginData["loginid"] == data[i].username) {
                                    add = false;
                                }

                                if (add) {
                                    chatroomName = chatroomName + data[i].username + ", ";
                                }
                            }

                            var oldDisplayName = chatroomName.substr(0, chatroomName.length - 2);
                            var newDisplayName = cutString(58.5, oldDisplayName, 4.18, "number", data.length);

                            window.setQChatroom(chatroomID, "name", oldDisplayName, "viewIndex");
                        }

                        if (action === "getConversation") {
                            //new create chatroom
                            window.chatroomTitle();
                        } else if (action === "chatroomInfo") {
                            //chatroomInfo
                            window.processChatroomInfo();
                        } else if (action === "chatroomListView") {
                            if (memberChange) {
                                window.chatroomListView(chatroomID, "sort");
                            } else {
                                //if ($("#chatroomListContent #chatroomList" + chatroomID).length == 0) {
                                    window.chatroomListView(chatroomID);
                                //}
                            }
                        }
                    }

                };

                JM.Chatroom.getGroupMembers(chatroomID, callback);

            }(chatroomID, is_group, action));
        };

        window.getUserInfo = function(chatroomID, userID) {
            chatroomID = chatroomID || null;

            (function(chatroomID, userID) {
                var callback = function(status, data) {

                    //Check if user's avatar exist
                    //If [1 to 1] chatroom, set is become chatroom's avatar
                    if (data.avatarThumbPath.length != 0) {
                        $("#chatroomList" + chatroomID).find(".img-content svg").hide();
                        $("#chatroomList" + chatroomID).find(".img-content img").prop("src", data.avatarThumbPath);
                        $("#chatroomList" + chatroomID).find(".img-content img").show();

                        JM.data.chatroom[chatroomID].avatar_path = data.avatarThumbPath;

                        var nowDateTime = new Date();
                        JM.data.chatroom[chatroomID].avatar_download_time = nowDateTime.TimeStamp();

                        JM.updateLocalStorage();
                    }
                };

                JM.User.getUserInfo(userID, callback);
            }(chatroomID, userID));
        };

        window.downloadOriginalUserAvatar = function(action, nowTimestamp, userID, listViewIndex) {
            userID = userID || null;
            listViewIndex = listViewIndex || null;

            //User Avatar will update after 3 days
            (function(action, nowTimestamp, userID, listViewIndex) {

                var getAvator = false;

                //If User data is null
                if (JM.data.chatroom_user[userID] == undefined) {
                    var callback = function(action, nowTimestamp, userID, listViewIndex) {
                        window.downloadOriginalUserAvatar(action, nowTimestamp, userID, listViewIndex);
                    };

                    window.getQUserDetail("downloadOriginalUserAvatar", userID, callback);

                    return;
                }

                //check download time
                var avator_download_time = JM.data.chatroom_user[userID].avator_download_time;
                var threeDaysTimeStamp = parseInt(avator_download_time + 60*60*24*3, 10);

                if (avator_download_time == 0) {
                    //never get avator
                    getAvator = true;
                } else if (nowTimestamp > threeDaysTimeStamp) {
                    //avator need update
                    getAvator = true;
                }

                var callback = function(status, data) {
                    if (status === "success") {
                        if (data.filePath.length > 0) {
                            JM.data.chatroom_user[userID].avator_path = data.filePath;
                            JM.data.chatroom_user[userID].avator_download_time = nowTimestamp;

                            JM.updateLocalStorage();

                            if (action === "userListView") {
                                userListViewAvatar(listViewIndex, data.filePath);
                            } else if (action === "index") {
                                indexUserAvatar(data.filePath);
                            } else if (action === "friendListView") {
                                friendListViewAvatar(listViewIndex, data.filePath);
                            } else if (action === "inviteListView") {
                                inviteListViewAvatar(listViewIndex, data.filePath);
                            } else if (action === "chatroomMemberListView") {
                                chatroomMemberListViewAvatar(listViewIndex, data.filePath);
                            } else if (action === "addMemberListView") {
                                addMemberListViewAvatar(listViewIndex, data.filePath);
                            }
                        }
                    }
                };

                if (getAvator) {
                    JM.User.downloadOriginalUserAvatar(userID, callback);
                } else {
                    if (JM.data.chatroom_user[userID].avator_path.length > 0) {
                        //display old avator which had be download before

                        if (action === "userListView") {
                            userListViewAvatar(listViewIndex, JM.data.chatroom_user[userID].avator_path);
                        } else if (action === "index") {
                            indexUserAvatar(JM.data.chatroom_user[userID].avator_path);
                        } else if (action === "friendListView") {
                            friendListViewAvatar(listViewIndex, JM.data.chatroom_user[userID].avator_path);
                        } else if (action === "inviteListView") {
                            inviteListViewAvatar(listViewIndex, JM.data.chatroom_user[userID].avator_path);
                        } else if (action === "chatroomMemberListView") {
                            chatroomMemberListViewAvatar(listViewIndex, JM.data.chatroom_user[userID].avator_path);
                        } else if (action === "addMemberListView") {
                            addMemberListViewAvatar(listViewIndex, JM.data.chatroom_user[userID].avator_path);
                        }
                    }
                }

            }(action, nowTimestamp, userID, listViewIndex));
        };

        window.updateGroupInfo = function(chatroomID, name, desc) {
            (function(chatroomID, name, desc) {

                var callback = function(status, data) {

                    if (status === "success") {
                        
                    }

                };

                JM.Chatroom.updateGroupInfo(chatroomID, name, desc, callback);

            }(chatroomID, name, desc));
        };

        function indexUserAvatar(avatarPath) {
            $(".personal-content .personal-photo-content svg").hide();
            $(".personal-content .personal-photo-content img").prop("src", avatarPath);
            $(".personal-content .personal-photo-content img").show();
        }

        function friendListViewAvatar(listViewIndex, avatarPath) {
            $("#friendList" + listViewIndex).find("svg").hide();
            $("#friendList" + listViewIndex).find("img").prop("src", avatarPath);
            $("#friendList" + listViewIndex).find("img").show();
        }

        function inviteListViewAvatar(listViewIndex, avatarPath) {
            $("#inviteList" + listViewIndex).find("svg").hide();
            $("#inviteList" + listViewIndex).find("img").prop("src", avatarPath);
            $("#inviteList" + listViewIndex).find("img").show();
        }

        window.chatroomListView = function(chatroomID, action) {
            action = action || null;

            (function(chatroomID, action) {

                var chatroomListHTML = $("template#tplChatroomList").html();

                $.each(JM.data.chatroom, function(chatroomDataID, chatroomData) {

                    if (chatroomDataID == chatroomID) {
                        var chatroomList = $(chatroomListHTML);
                        var createTime = new Date(chatroomData.last_message.create_time);

                        $("#chatroomListContent #chatroomList" + chatroomID).remove();
                        $("#chatroomListContent #chatroomHR" + chatroomID).remove();

                        chatroomList.siblings(".chatroom-list").prop("id", "chatroomList" + chatroomID);
                        chatroomList.siblings(".ui-hr").prop("id", "chatroomHR" + chatroomID);
                        chatroomList.find(".group-name").html(cutString(58.5, chatroomData.name, 4.18));
                        chatroomList.find(".date").html(createTime.yyyymmdd("/"));
                        chatroomList.find(".latest-message").html(cutString(58.5, chatroomData.last_message.text, 3.349));
                        chatroomList.find(".number").html(chatroomData.unread_count);

                        if (chatroomData.unread_count == 0) {
                            chatroomList.find(".number-circle").hide();
                        } else if (chatroomData.unread_count > 9) {
                            chatroomList.find(".number-circle").addClass("number-circle-big");
                        }

                        $("#noChatroom").hide();

                        $("#chatroomListContent").prepend(chatroomList);

                        if (!chatroomData.is_group) {
                            //If [1 to 1] chatroom, check the chatroom avatar exist or expired
                            window.checkChatroomAvatar(chatroomID, chatroomData.is_group);
                        } else {
                            //If multi-member chatroom, need to show count of member in chatroom's name
                            var newDisplayName = cutString(58.5, chatroomData.name, 4.18, "number", chatroomData.member.length)
                            $("#chatroomList" + chatroomID + " .group-name").html(newDisplayName);
                        }

                        return false;
                    }
                });

                //Remember Chatroom Sequence in veiwIndex
                if (action === "sort") {
                    JM.data.chatroom_sequence = [];

                    $("#chatroomListContent .chatroom-list").each(function(index, chatroom) {
                        var chatroomID = parseInt($(chatroom).prop("id").substr(12), 10);
                        JM.data.chatroom_sequence.push(chatroomID);
                    });

                    JM.data.chatroom_sequence.reverse();
                    JM.updateLocalStorage();
                }

            }(chatroomID, action));
        };

        window.chatroomSingleView = function(chatroomID) {
            var createTime = new Date(JM.data.chatroom[chatroomID].last_message.create_time);

            $("#chatroomList" + chatroomID).find(".date").html(createTime.yyyymmdd("/"));
            $("#chatroomList" + chatroomID).find(".latest-message").html(cutString(58.5, JM.data.chatroom[chatroomID].last_message.text, 3.349));
            $("#chatroomList" + chatroomID).find(".number").html(JM.data.chatroom[chatroomID].unread_count);

            if (JM.data.chatroom[chatroomID].unread_count == 0) {
                $("#chatroomList" + chatroomID).find(".number-circle").hide();
            } else if (JM.data.chatroom[chatroomID].unread_count > 0 && JM.data.chatroom[chatroomID].unread_count < 9) {
                $("#chatroomList" + chatroomID).find(".number-circle").show();
            } else if (JM.data.chatroom[chatroomID].unread_count > 9) {
                $("#chatroomList" + chatroomID).find(".number-circle").addClass("number-circle-big");
            }
        };

        function receiveMessage(data) {
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

                }
            }
        }

        function clickMessageNotification(data) {
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
        }

        function syncOfflineMessage(data) {
            console.log("----syncOfflineMessage");
            console.log(data);

            window.processChatroomData(data.conversation, "getConversations", false, true);
        }

        function loginStateChanged(data) {
            console.log("----loginStateChanged");
            console.log(data);
        }

        function syncRoamingMessage(data) {
            console.log("----syncRoamingMessage");
            console.log(data);

            window.processChatroomData(data.conversation, "getConversations", false, true);

            if (!doSyncRoamingMessage) {
                //window.getConversations();
                doSyncRoamingMessage = true;
            }
        }

        function recoverySearchUI() {
            $(".searchBar").val("");
            $(".search-user-clear-content").hide();
        }

        /********************************** page event *************************************/
        $("#viewIndex").one("pagebeforeshow", function(event, ui) {

            //UI Tab
            var tabData = {
                navbar: {
                    button: [{
                        href: "chatroomDiv",
                        text: "聊天"
                    }, {
                        href: "memberDiv",
                        text: "成員"
                    }]
                },
                content: [{
                    id: "chatroomDiv"
                }, {
                    id: "memberDiv"
                }],
                attr: {
                    id: "tabIndex",
                    class: "index-navbar"
                }
            };

            tplJS.Tab("viewIndex", "viewIndexContent", "prepend", tabData);

            //--------------------chatroom Div--------------------
            //search bar
            var searchBar = $($("template#tplSearchBar").html());
            searchBar.find("input").prop({
                "id": "searchChatroom",
                "placeholder": "搜尋聊天室"
            });
            $("#chatroomDiv").prepend(searchBar);

            //chatroomList Content
            $("#chatroomDiv").append('<div class="data-list-content chatroom-list-content" id="chatroomListContent"></div>');

            //no data
            var noData = $($("template#tplNoData").html());
            noData.prop("id", "noChatroom");
            noData.html("和同事聊聊吧!");
            $("#chatroomDiv").append(noData);

            //no data
            var noData = $($("template#tplNoData").html());
            noData.prop("id", "notFoundChatroom");
            noData.html("搜尋結果為0筆。");
            $("#chatroomDiv").append(noData);

            $("#noChatroom").show();

            //--------------------member Div--------------------
            //search bar
            var searchBar = $($("template#tplSearchBar").html());
            searchBar.find("input").prop({
                "id": "searchFriend",
                "placeholder": "搜尋成員"
            });
            $("#memberDiv").prepend(searchBar);

            //Friend Content
            var friendContent = $($("template#tplFriendContent").html());
            $("#memberDiv").append(friendContent);

            //---------------------Global UI---------------------
            //Full Screen Action Message
            var actionMsgFullScreen = $($("template#tplActionMsgFullScreen").html());
            $("body").append(actionMsgFullScreen);

            //Confirm Delete Friend
            var confirmDeleteFriendPopupData = {
                id: "confirmDeleteFriendPopup",
                content: $("template#tplConfirmDeleteFriend").html()
            };

            tplJS.Popup(null, null, "append", confirmDeleteFriendPopupData);

        });

        $("#viewIndex").on("pagebeforeshow", function(event, ui) {
            if (JM.data.sendPushToken !== undefined) {
                window.getQFriend();
            }

            recoverySearchUI();
        });

        $("#viewIndex").on("pageshow", function(event, ui) {

            //Set Active Tab
            if (prevPageID === "viewAddFriend" || prevPageID === "viewMyInfoEdit" || prevPageID === "viewFriendInvite") {
                $("#tabIndex a:eq(1)").addClass("ui-btn-active");
                $("#tabIndex").tabs({ active: 1 });
            } else {
                $("#tabIndex a:eq(0)").addClass("ui-btn-active");
                $("#tabIndex").tabs({ active: 0 });
            }

            if (!getPWD) {
                loadingMask("show");
                var jmessagePassword = new getJmessagePassword();
            } else {
                window.getGroupIds();
            }

            //When leave chatroom, need to receive the Push Notification
            JM.Chatroom.exitConversation();

            prevPageID = "viewIndex";
        });

        /********************************** dom event *************************************/

        //Tabs Change
        $(document).on({
            tabsactivate: function(event, ui) {
                tabActiveID = ui.newPanel.selector;

                if (ui.newPanel.selector === "#memberDiv") {
                    $(".index-footer").hide();
                } else {
                    $(".index-footer").show();
                }

                recoverySearchUI();
            }
        }, "#tabIndex");

        //New Chatroom
        $(document).on({
            click: function() {
                $.mobile.changePage('#viewNewChatroom');
            }
        }, "#newChatroom");

        //Search Chatroom
        $(document).on({
            keyup: function(event) {

                var text = $(this).val();

                if (timer !== null) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    $.each(JM.data.chatroom, function(chatroomID, chatroomData) {
                        if (chatroomData.name.toLowerCase().indexOf(text.toLowerCase()) == -1) {
                            $("#chatroomList" + chatroomID).hide();
                            $("#chatroomHR" + chatroomID).hide();
                        } else {
                            $("#chatroomList" + chatroomID).show();
                            $("#chatroomHR" + chatroomID).show();
                        }
                    });

                    if ($(".chatroom-list:visible").length == 0) {
                        $("#notFoundChatroom").show();
                    } else {
                        $("#notFoundChatroom").hide();
                    }

                }, 1000);

                if (text.length > 0) {
                    $(".search-user-clear-content").show();
                }

            }
        }, "#searchChatroom");

        //Click chatroom list
        $(document).on({
            click: function() {

                var id = $(this).prop("id");
                JM.chatroomID = id.substr(12, id.length);

                $.mobile.changePage('#viewChatroom');

            }
        }, "#chatroomDiv .chatroom-list");

        //Friend List / Invite List Switch btn
        $(document).on({
            click: function(event) {

                var clssName = "";
                var fadeSpeed = 0;
                var slideSpeed = 0;

                if ($(event.target).hasClass("friend")) {
                    clssName = "friend";
                    fadeSpeed = 300;
                    slideSpeed = 350;
                } else {
                    clssName = "invite";
                    fadeSpeed = 150;
                }

                $(".friend-content ." + clssName + " .list-down").toggleClass("hide");
                $(".friend-content ." + clssName + " .list-up").toggleClass("hide");

                if ($(".friend-content ." + clssName + " .list-down").hasClass("hide")) {
                    //open
                    $(".friend-content ." + clssName + "-list-content .data-list").not(".hide").fadeIn(fadeSpeed);
                    if (clssName === "friend") {
                        $(".friend-content ." + clssName + "-list-content").slideDown(slideSpeed);
                    }
                } else {
                    //close
                    $(".friend-content ." + clssName + "-list-content .data-list").not(".hide").fadeOut(fadeSpeed);
                    if (clssName === "friend") {
                        $(".friend-content ." + clssName + "-list-content").slideUp(slideSpeed);
                    }
                }

                $(".friend-content ." + clssName + "-list-content .data-list.hide").css("display", "");

            }
        }, ".friend-content .list-switch");

        //Invite List Button
        $(document).on({
            click: function(event) {
                $.mobile.changePage('#viewFriendInvite');
            }
        }, "#viewIndexContent .invite-list-content");

        //Search Friend
        $(document).on({
            keyup: function(event) {

                var text = $(this).val();

                if (timer !== null) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    $(".friend-content .friend-list-content .data-list").each(function(index, dom) {
                        var name = $(dom).find(".personal-name").html();

                        if (name.toLowerCase().indexOf(text.toLowerCase()) == -1) {
                            $(dom).addClass("hide");
                            $(dom).next("hr").addClass("hide");
                        } else {
                            $(dom).removeClass("hide");
                            $(dom).next("hr").removeClass("hide");
                        }
                    });

                    $(".friend-content .data-list.hide").css("display", "");

                }, 1000);

                if (text.length > 0) {
                    $(".search-user-clear-content").show();
                }

            }
        }, "#searchFriend");

        //Clear Search
        $(document).on({
            click: function() {
                $(".searchBar").val("");
                $(this).hide();

                if (tabActiveID === "#chatroomDiv") {
                    $.each(JM.data.chatroom, function(chatroomID, chatroomData) {
                        $("#chatroomList" + chatroomID).show();
                        $("#chatroomHR" + chatroomID).show();
                    });
                } else if (tabActiveID === "#memberDiv") {
                    $(".friend-content .friend-list-content .data-list").each(function(index, dom) {
                        $(dom).removeClass("hide");
                        $(dom).next("hr").removeClass("hide");
                    });
                }
            }
        }, ".search-user-clear-content");

        //Add Friend
        $(document).on({
            click: function() {
                $.mobile.changePage('#viewAddFriend');
            }
        }, ".friend-add-btn");

        //Confirm Delete Friend
        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("cancel") || $(event.target).parent().hasClass("cancel")) {
                    $("#confirmDeleteFriendPopup").popup("close");
                    $("#userInfoPopup").popup("open");
                } else if ($(event.target).hasClass("confirm") || $(event.target).parent().hasClass("confirm")) {
                    window.removeQFriend();
                }

            }
        }, "#confirmDeleteFriendPopup");

    }
});
