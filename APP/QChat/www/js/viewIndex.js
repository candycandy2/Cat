
$("#viewIndex").pagecontainer({
    create: function(event, ui) {

        window.getPWD = false;
        var timer;
        var groupsArray = [];
        var tabActiveID;

        /********************************** function *************************************/
        window.getJmessagePassword = function() {

            var self = this;

            this.successCallback = function(data, status, xhr) {

                var resultcode = data['ResultCode'];

                if (resultcode === 1) {
                    getPWD = true;
                    jmessagePWD = data['Content'];
                    console.log(jmessagePWD);

                    JM.init(QChatJPushAppKey, sendPushToken, receiveMessage, clickMessageNotification, syncOfflineMessage, loginStateChanged, syncRoamingMessage);
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

                getQUserDetail("viewIndex", loginData["loginid"]);

            }());
        }

        function getQUserDetail(action, empID, callback) {
            callback = callback || null;

            (function(action, empID, callback) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_login_id: empID
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        if (action === "viewIndex") {
                            $(".personal-content .personal-name").html(data['Content'][0].name);

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

                            getQFriend();
                        } else if (action === "downloadOriginalUserAvatar") {
                            window.processUserData(data['Content'][0], callback);
                        }
                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "getQUserDetail", successCallback, failCallback, queryData, "");

            }(action, empID, callback));
        }

        function getQFriend() {
            (function() {

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

                        $(".friend-content .friend-list .data-list").remove();
                        $(".friend-content .friend-list .ui-hr-friend-list").remove();

                        for (var i=0; i<data['Content'].friend.user_list.length; i++) {
                            var friendDataListHTML = $("template#tplFriendDataList").html();
                            var friendDataList = $(friendDataListHTML);

                            friendDataList.find(".personal-photo-content").prop("id", "friendList" + i);
                            friendDataList.find(".personal-name").html(data['Content'].friend.user_list[i].name);

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

                        //only show request data when the request count > 0
                        if (data['Content'].inviter.user_list.length > 0) {

                        }

                        JM.updateLocalStorage();
                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "getQFriend", successCallback, failCallback, queryData, "");

            }());
        }

        window.getGroupIds = function() {
            (function() {

                var callback = function(status, data) {

                    if (status === "success") {
                        groupsArray = data;

                        window.getConversations();
                    }

                };

                JM.Chatroom.getGroupIds(callback);

            }());
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

                CustomAPI("POST", true, "getQUserChatroom", successCallback, failCallback, queryData, "");

            }(action, chatroomID, callback));
        };

        window.getConversations = function() {

            (function() {
                var callback = function(status, data) {

                    if (status === "success") {
                        for (var i=0; i<data.length; i++) {

                            //For Alan, because he create a single chatroom,
                            //so need to check chatroom type, just for the only one data.
                            if (data[i].conversationType === "group") {
                                //Check if User is still in this chatroom,
                                //if not, ignore the chatroom data, and don't show it.
                                if (groupsArray.indexOf(data[i].target.id.toString()) != -1) {
                                    window.processChatroomData(data[i], "getConversations", false);
                                }
                            }

                        }

                        loadingMask("hide");
                        window.chatroomListView();
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

                            //chatroom list view
                            $("#chatroomList" + chatroomID + " .group-name").html(newDisplayName);

                            window.setQChatroom(chatroomID, "name", oldDisplayName, "viewIndex");
                        }

                        if (action === "getConversation") {
                            //new create chatroom
                            window.chatroomTitle();
                        } else if (action === "chatroomInfo") {
                            //chatroomInfo
                            window.processChatroomInfo();
                        } else if (action === "chatroomListView") {
                            window.chatroomListView();
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

                    getQUserDetail("downloadOriginalUserAvatar", userID, callback);

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
            $(".personal-content .personal-photo-content svg").prop("src", avatarPath);
            $(".personal-content .personal-photo-content img").show();
        }

        function friendListViewAvatar(listViewIndex, avatarPath) {
            $("#friendList" + listViewIndex).find("svg").hide();
            $("#friendList" + listViewIndex).find("img").prop("src", avatarPath);
            $("#friendList" + listViewIndex).find("img").show();
        }

        window.chatroomListView = function() {

            //Refresh Chatroom List
            var chatrooomCount = 0;

            $("#chatroomListContent .chatroom-list").remove();
            $("#chatroomListContent .ui-hr-message").remove();
            var chatroomListHTML = $("template#tplChatroomList").html();

            $.each(JM.data.chatroom, function(chatroomID, chatroomData) {

                chatrooomCount++;

                var chatroomList = $(chatroomListHTML);
                var createTime = new Date(chatroomData.last_message.create_time);

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

                $("#chatroomListContent").append(chatroomList);
                
                if (!chatroomData.is_group) {
                    //If [1 to 1] chatroom, check the chatroom avatar exist or expired
                    window.checkChatroomAvatar(chatroomID, chatroomData.is_group);
                } else {
                    //If multi-member chatroom, need to show count of member in chatroom's name
                    window.getGroupMembers(chatroomID, chatroomData.is_group);
                }
            });

            //If no chatroom, show message
            if (chatrooomCount == 0) {
                $("#noChatroom").show();
            } else {
                $("#noChatroom").hide();
            }

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
                JM.chatroomID = data.extras.chatroom_id;

                if (data.extras.event === "false") {
                    if (activePageID === "viewChatroom") {
                        window.getConversation(true, true);
                    } else {
                        window.getConversation(false, true);
                    }
                } else if (data.type === "text" && data.extras.event === "true") {

                    if (data.extras.action === "newChatroom") {
                        if (activePageID === "viewIndex") {
                            window.getGroupIds();
                        }
                    } else if (data.extras.action === "memberEvent") {
                        if (activePageID === "viewChatroom") {
                            window.getConversation(true, true);
                        } else {
                            window.getConversation(false, true);
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
                $.mobile.changePage('#viewChatroom');
            }
        }

        function syncOfflineMessage(data) {
            console.log("----syncOfflineMessage");
            console.log(data);
        }

        function loginStateChanged(data) {
            console.log("----loginStateChanged");
            console.log(data);
        }

        function syncRoamingMessage(data) {
            console.log("----syncRoamingMessage");
            console.log(data);

            window.getConversations();
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

            //--------------------chatroom Div--------------------
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

            //-----------------------------------------------------
            var actionMsgFullScreen = $($("template#tplActionMsgFullScreen").html());
            $("body").append(actionMsgFullScreen);
        });

        $("#viewIndex").on("pagebeforeshow", function(event, ui) {
            if (JM.data.sendPushToken !== undefined) {
                getQFriend();
            }

            recoverySearchUI();
        });

        $("#viewIndex").on("pageshow", function(event, ui) {

            //Set Active Tab
            if (prevPageID === "viewAddFriend") {
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
                        console.log(chatroomID);
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

        //Friend List Switch btn
        $(document).on({
            click: function() {

                $(".friend-content .list-down").toggleClass("hide");
                $(".friend-content .list-up").toggleClass("hide");

                if ($(".friend-content .list-down").hasClass("hide")) {
                    //open
                    $(".friend-content .data-list").not(".hide").fadeIn(300);
                    $(".friend-content .friend-list-content").slideDown(350);
                } else {
                    //close
                    $(".friend-content .data-list").not(".hide").fadeOut(300);
                    $(".friend-content .friend-list-content").slideUp(350);
                }

                $(".friend-content .data-list.hide").css("display", "");

            }
        }, ".friend-content .list-switch");

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

    }
});
