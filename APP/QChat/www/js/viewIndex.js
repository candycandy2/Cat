
$("#viewIndex").pagecontainer({
    create: function(event, ui) {

        window.getPWD = false;
        var timer;
        var groupsArray = [];

        /********************************** function *************************************/
        window.getJmessagePassword = function() {

            var self = this;

            this.successCallback = function(data, status, xhr) {

                var resultcode = data['ResultCode'];

                if (resultcode === 1) {
                    getPWD = true;
                    jmessagePWD = data['Content'];
                    console.log(jmessagePWD);

                    JM.init(QChatJPushAppKey, sendPushToken, receiveMessage, clickMessageNotification, syncOfflineMessage, loginStateChanged);
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

        window.getConversations = function() {

            (function() {
                var callback = function(status, data) {

                    if (status === "success") {
                        for (var i=0; i<data.length; i++) {

                            //Check if User is still in this chatroom,
                            //if not, ignore the chatroom data, and don't show it.
                            if (groupsArray.indexOf(data[i].target.id.toString()) != -1) {
                                window.processChatroomData(data[i], "getConversations", false);
                            }

                        }

                        loadingMask("hide");
                        chatroomListView();
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

                        desc = "need_history=" + need_history + ";" + "group_message=" + group_message;

                        //update chatroom name in:
                        //1. chatroom list
                        //2. local storage
                        //3. JMessage Server side
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

                        //local storage
                        JM.data.chatroom[chatroomID].name = oldDisplayName;

                        //JMessage Server side
                        window.updateGroupInfo(chatroomID, oldDisplayName, desc);

                        //for new create chatroom
                        if (action === "getConversation") {
                            window.chatroomTitle();
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

        window.downloadOriginalUserAvatar = function(action, userID, listViewIndex, nowTimestamp) {
            //User Avatar will update after 3 days
            (function(action, userID, listViewIndex, nowTimestamp) {

                var getAvator = false;

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
                            }
                        }
                    }
                };

                if (getAvator) {
                    JM.User.downloadOriginalUserAvatar(userID, callback);
                } else {
                    if (JM.data.chatroom_user[userID].avator_path.length > 0) {
                        //display old avator which had be download before
                        userListViewAvatar(listViewIndex, JM.data.chatroom_user[userID].avator_path);
                    }
                }

            }(action, userID, listViewIndex, nowTimestamp));
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

        function chatroomListView() {

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

        }

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
                        getConversation(true, true);
                    } else {
                        getConversation(false, true);
                    }
                } else if (data.type === "text" && data.extras.event === "true") {

                    if (data.extras.action === "newChatroom") {
                        if (activePageID === "viewIndex") {
                            window.getGroupIds();
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
                    id: "tabIndex"
                }
            };

            tplJS.Tab("viewIndex", "viewIndexContent", "prepend", tabData);

            //--------------------chatroom Div--------------------
            //search bar
            var searchBar = $($("template#tplSearchBar").html());
            searchBar.prop({
                "id": "searchChatroom",
                "placeholder": "搜尋聊天室"
            });
            $("#chatroomDiv").prepend(searchBar);

            //chatroomList Content
            $("#chatroomDiv").append('<div class="data-list-content" id="chatroomListContent"></div>');

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
        });

        $("#viewIndex").on("pageshow", function(event, ui) {

            //Set Active Tab
            $("#tabIndex a:eq(0)").addClass("ui-btn-active");
            $("#tabIndex").tabs({ active: 0 });

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
                            $("#chatroomHR" + chatroomID).hide();
                        }
                    });

                    if ($(".chatroom-list:visible").length == 0) {
                        $("#notFoundChatroom").show();
                    } else {
                        $("#notFoundChatroom").hide();
                    }

                }, 1000);

            }
        }, "#searchChatroom");

        //Click chatroom list
        $(document).on({
            click: function() {

                var id = $(this).prop("id");
                JM.chatroomID = id.substr(12, id.length);

                $.mobile.changePage('#viewChatroom');

            }
        }, ".chatroom-list");

    }
});
