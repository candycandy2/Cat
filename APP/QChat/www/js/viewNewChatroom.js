
$("#viewNewChatroom").pagecontainer({
    create: function(event, ui) {

        var userDataCount = 0;

        /********************************** function *************************************/
        window.getQList = function(type, view, string) {
            string = string || "";

            (function(type, view, string) {

                //type: [1:name] [3:only same department]
                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    search_type: type,
                    search_string: string,
                    mode: "2"
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {

                    var resultCode = data['ResultCode'];

                    //Check if user in friend list
                    var friendCount = 0;
                    var friendArray = [];
                    for (var i=0; i<JM.data.chatroom_friend.length; i++) {
                        if (JM.data.chatroom_friend[i].toLowerCase().indexOf(string.toLowerCase()) != -1) {
                            friendArray.push(JM.data.chatroom_friend[i]);
                            friendCount++;
                        }
                    }

                    if (resultCode === "1") {

                        //check download time
                        var nowDateTime = new Date();
                        var nowTimestamp = nowDateTime.TimeStamp();

                        //check if this user has been selected before.
                        var empNumberArray = [];
                        $("#viewNewChatroom .new-chatroom-footer .data-list").each(function(index, element) {
                            empNumberArray.push($(element).prop("id").substr(3));
                        });

                        //store data in local storage
                        var dataCount = data['Content'].user_list.length + friendCount;
                        var friendIndex = 0;

                        for (var i=0; i<dataCount; i++) {

                            var userData = data['Content'].user_list[i];

                            if ((i+1) > data['Content'].user_list.length) {
                                if (friendArray[friendIndex] != null) {
                                    var userData = {};
                                    userData.name = friendArray[friendIndex];
                                    userData.status = "1";
                                    friendIndex++;

                                    callback();
                                }
                            } else {
                                var userData = data['Content'].user_list[i];
                                window.processUserData(userData, callback);
                            }

                            function callback() {
                                if (view === "viewNewChatroom") {
                                    userListView(dataCount, data['Content'].over_threshold, userData.name, i+1, nowTimestamp, userData.status, empNumberArray);
                                } else if (view === "viewAddFriend") {
                                    if (type === "3") {
                                        window.addFriendListView(data['Content'].user_list.length, data['Content'].over_threshold, userData.name, i+1, nowTimestamp, userData.status, type);
                                    } else if (type === "1") {
                                        window.addFriendListView(data['Content'].user_list.length, data['Content'].over_threshold, userData.name, i+1, nowTimestamp, userData.status, type);
                                    }
                                }
                            }

                        }

                        JM.updateLocalStorage();

                    } else if (resultCode === "025998") {
                        //no data
                        if (view === "viewNewChatroom") {
                            userListView(0);
                        } else if (view === "viewAddFriend") {
                            window.addFriendListView(0);
                        }
                    }

                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "getQList", successCallback, failCallback, queryData, "");

            }(type, view, string));
        };

        window.processUserData = function(userData, callback) {
            callback = callback || null;

            var avator_path = "";
            var avator_download_time = 0;

            if (JM.data.chatroom_user[userData.name] !== undefined) {
                avator_path = JM.data.chatroom_user[userData.name].avator_path;
                avator_download_time = JM.data.chatroom_user[userData.name].avator_download_time;
            } else {
                JM.data.chatroom_user[userData.name] = {};
            }

            var is_friend = false;
            if (userData.status === "1") {
                is_friend = true;
            }

            var is_register = false;
            if (userData.registered === "Y") {
                is_register = true;
            }

            var is_protect = false;
            if (userData.protected === "Y") {
                is_protect = true;
            }

            var tempData = {
                domain:                 userData.domain,
                emp_no:                 userData.emp_no,
                email:                  userData.email,
                ext_no:                 userData.ext_no,
                site_code:              userData.site_code,
                memo:                   userData.memo,
                is_friend:              is_friend,
                is_register:            is_register,
                is_protect:             is_protect,
                avator_path:            avator_path,
                avator_download_time:   avator_download_time
            };

            JM.data.chatroom_user[userData.name] = tempData;

            if (typeof callback === "function") {
                callback();
            }

            //Process Friend Data
            if (is_friend) {
                if (loginData["loginid"] != userData.name) {
                    if (JM.data.chatroom_friend.indexOf(userData.name) == -1) {
                        JM.data.chatroom_friend.push(userData.name);
                    }
                }
            } else if (!is_friend) {
                if (JM.data.chatroom_friend.indexOf(userData.name) != -1) {
                    var index = JM.data.chatroom_friend.indexOf(userData.name);
                    JM.data.chatroom_friend.splice(index, 1);
                }
            }

        };

        function userListView(dataCount, overMaxLength, userName, dataIndex, nowTimestamp, status, empNumberArray) {
            overMaxLength = overMaxLength || null;
            userName = userName || null;
            dataIndex = dataIndex || null;
            nowTimestamp = nowTimestamp || null;
            status = status || null;
            empNumberArray = empNumberArray || null;

            var showInOther = false;
            var showInFriend = false;

            //Check if User from getQList has exist in chatroom_friend
            if (JM.data.chatroom_friend.indexOf(userName) == -1) {
                showInOther = true;
            } else {
                showInFriend = true;
            }

            if (dataCount === 0 || dataIndex === 1) {
                $("#msgWelcome").hide();
                $("#msgUserOverflow").hide();
                $("#viewNewChatroom .data-list-content .user-list").remove();
                $("#viewNewChatroom .data-list-content .ui-hr-list").remove();
            }

            if (dataCount === 0) {
                $("#msgNoFound").show();
                $("#titleFriend").hide();
                $("#titleOtherUser").hide();
            } else {
                $("#msgNoFound").hide();

                var userListHTML = $("template#tplUserList").html();
                var userList = $(userListHTML);

                userList.prop("id", "userList" + dataIndex);
                userList.find("input").prop("id", "checkUser" + dataIndex).val(JM.data.chatroom_user[userName].emp_no);
                userList.find(".overlap-label-checkbox").prop("for", "checkUser" + dataIndex);

                //check if this user has been selected before.
                if (empNumberArray != null) {
                    if (empNumberArray.indexOf(JM.data.chatroom_user[userName].emp_no) != -1) {
                        userList.find("input").prop("checked", true);
                    }
                }

                //name
                userList.find(".user-name").html(userName);

                //info / radio button
                var hideRadioBtn = false;
                if (JM.data.chatroom_user[userName].is_register == false) {
                    hideRadioBtn = true;
                    userList.find(".not-register").show();
                    userList.find(".user-name").removeClass("user-name-only");
                } else if (JM.data.chatroom_user[userName].is_protect == true) {
                    hideRadioBtn = true;
                    userList.find(".protect").show();
                    userList.find(".user-name").removeClass("user-name-only");

                    //Had send invitation
                    if (status === "2") {
                        userList.find(".button-content .protect").hide();
                        userList.find(".button-icon-content").hide();
                        userList.find(".action-info").show();
                    } else if (status === "1") {
                        userList.find(".data-content .protect").hide();
                        userList.find(".user-name").addClass("user-name-only");
                    }
                } else if (JM.data.chatroom_user[userName].is_friend == false) {
                    userList.find(".not-friend").show();
                }

                if (showInFriend) {
                    $("#titleFriend").show();
                    $("#userFriendListContent").append(userList);
                }

                if (showInOther) {
                    $("#titleOtherUser").show();
                    $("#userOtherListContent").append(userList);
                }

                if (hideRadioBtn) {
                    userList.find(".checkbox-content").css("opacity", "0");
                    $("#checkUser" + dataIndex).prop("disabled", true);
                }

                window.downloadOriginalUserAvatar("userListView", nowTimestamp, userName, dataIndex);

                //over 10 datas
                if (dataCount == dataIndex && overMaxLength === "Y") {
                    $("#msgUserOverflow").show();
                }
            }

        }

        window.userListViewAvatar = function(listViewIndex, avatarPath) {
            $("div#userList" + listViewIndex).find(".img-content svg").hide();
            $("div#userList" + listViewIndex).find(".img-content img").prop("src", avatarPath);
            $("div#userList" + listViewIndex).find(".img-content img").show();
        };

        window.newQChatroom = function(name, desc, empNumberArray) {
            (function(name, desc, empNumberArray) {

                //Max length of name is 32
                var chatroomName = name.substr(0, 31);

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    lang: "zh-tw",
                    need_push: "Y",
                    app_key: appKey,
                    chatroom_name: chatroomName,
                    chatroom_desc: desc
                };

                var queryDataParameter = createXMLDataString(queryDataObj);

                var memberList = "";
                for (var i=0; i<empNumberArray.length; i++) {
                    var tempDataObj = {
                        destination_emp_no: empNumberArray[i]
                    };
                    memberList = memberList + createXMLDataString(tempDataObj);
                }
                var memberListParameter = "<member_list>" + memberList + "</member_list>";

                var queryData = "<LayoutHeader>" + queryDataParameter + memberListParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        console.log("==========new chatroom success");
                        
                        JM.chatroomID = data['Content'].group_id;

                        //check is new create or not
                        var newCreate = true;

                        if (newCreate) {
                            //Send default first message, then API-getConversations can
                            //return latestMessage correctly.
                            setTimeout(function(){
                                window.sendTextMessage(loginData["loginid"] + "  建立聊天室", true, "newChatroom");
                            }, 2000);

                            //change page to chatroom
                            setTimeout(function(){
                                $.mobile.changePage('#viewChatroom');
                            }, 5000);
                        } else {
                            $.mobile.changePage('#viewChatroom');
                        }

                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "newQChatroom", successCallback, failCallback, queryData, "");

            }(name, desc, empNumberArray));
        };

        function setCreateChatroomButton(status) {

            //status: enable / disable
            if (status === "enable") {
                $("#createChatroom").removeClass("none-work");
            } else {
                $("#createChatroom").addClass("none-work");
            }

        }

        function checkSelectedUser() {
            //Set Create Camera Button, check count of User Selected UI
            var selectCount = $('#viewNewChatroom .data-list-content :checkbox:checked').length;
            var dataCount = $("#viewNewChatroom .new-chatroom-footer .data-list").length;

            if (selectCount == 0 && dataCount == 0) {
                setCreateChatroomButton("disable");
                $("#viewNewChatroom .new-chatroom-footer").css("opacity", 0);
            } else {
                setCreateChatroomButton("enable");
            }
        }

        window.setQFriend = function(userID) {
            (function(userID) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_emp_no: JM.data.chatroom_user[userID].emp_no,
                    reason: ""
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        $("#actionMsg1").html("已將 " + userID + " 加為好友");
                        $("#actionMsg1").show();

                        actionButton("show");

                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "setQFriend", successCallback, failCallback, queryData, "");

            }(userID));
        };

        window.sendQInvitation = function(listViewID, userID) {
            (function(listViewID, userID) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_emp_no: JM.data.chatroom_user[userID].emp_no,
                    reason: ""
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        $("#" + listViewID).find(".button-icon-content").hide();
                        $("#" + listViewID).find(".action-info").show();

                        $("#actionMsg2").show();

                        actionButton("show");

                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "sendQInvitation", successCallback, failCallback, queryData, "");

            }(listViewID, userID));
        };

        window.sendQInstall = function(listViewID, userID) {
            (function(listViewID, userID) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_emp_no: JM.data.chatroom_user[userID].emp_no,
                    reason: ""
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        $("#" + listViewID).find(".button-icon-content").hide();
                        $("#" + listViewID).find(".action-info").show();

                        $("#actionMsg3").html("已發送邀請給 " + userID);
                        $("#actionMsg3").show();

                        actionButton("show");

                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "sendQInstall", successCallback, failCallback, queryData, "");

            }(listViewID, userID));
        };

        window.actionButton = function(listViewID, action) {
            //action: not-friend / not-register / protect / show

            //change button / info
            $("#" + listViewID).find(".button-content ." + action).hide();
            var userID = $("#" + listViewID).find(".user-name").html();

            //action-success-full-screen message
            if (action === "not-friend") {
                window.setQFriend(userID);
            } else if (action === "not-register") {
                window.sendQInstall(listViewID, userID);
            } else if (action === "protect") {
                window.sendQInvitation(listViewID, userID);
            } else {
                $(".action-success-full-screen").show();

                setTimeout(function() {
                    $(".action-success-full-screen").hide();
                    $(".action-success-full-screen span").hide();
                }, 3000);
            }

        };

        /********************************** page event *************************************/
        $("#viewNewChatroom").on("pagebeforeshow", function(event, ui) {

            //Recovery Search User Input UI
            $("#searchUserInput").css("width", "92.5vw");
            $("#searchUserInput").val("");
            $("#searchUserButton").hide();
            $("#searchUserClearContent").hide();

            $("#msgWelcome").show();
            $("#titleFriend").hide();
            $("#titleOtherUser").hide();
            $("#msgUserOverflow").hide();
            $(".data-list-content .user-list").remove();
            $(".data-list-content .ui-hr-list").remove();

            //Clear User Selected UI
            $("#viewNewChatroom .new-chatroom-footer .data-list").remove();
            $("#viewNewChatroom .new-chatroom-footer").css("opacity", 0);
        });

        $("#viewNewChatroom").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/

        //Search User
        $(document).on({
            focus: function() {

                $("#searchUserClearContent").hide();

                $(this).animate({
                    width: "81vw"
                }, 250, function() {
                    $("#searchUserButton").show();
                });

            }
        }, "#searchUserInput");

        $(document).on({
            click: function() {

                var text = $("#searchUserInput").val();

                $("#searchUserInput").css("width", "92.5vw");
                $(this).hide();

                if (text.length > 0) {
                    userDataCount = 0;
                    $("#searchUserClearContent").show();

                    getQList("1", "viewNewChatroom", text);
                    setCreateChatroomButton("disable");
                }

            }
        }, "#searchUserButton");

        $(document).on({
            click: function() {
                $("#searchUserInput").val("");
                $(this).hide();
            }
        }, "#searchUserClearContent");

        //Select User
        $(document).on({
            change: function() {

                //Animate
                $("#viewNewChatroom .new-chatroom-footer").css("opacity", 1);

                var userEmpID = $(this).val();
                var isChecked = $(this).is(":checked");

                if (isChecked) {
                    var offset = $(this).parent().offset();
                    var dataList = $(this).parents(".user-list");
                    var imgContent = dataList.find(".img-content").html();
                    var userName = dataList.find(".user-name").html();

                    var userAnimateHTML = $("template#tplUserAnimate").html();
                    var userAnimate = $(userAnimateHTML);
                    userAnimate.find(".left").html(imgContent);
                    userAnimate.find(".user-name").html(userName);
                    userAnimate.css({
                        top: offset.top,
                        left: offset.left
                    });

                    $("#viewNewChatroom").append(userAnimate);

                    if ($("#viewNewChatroom .new-chatroom-footer .data-list").length == 0) {
                        var bottomOffset = $("#viewNewChatroom .new-chatroom-footer").offset();
                        var bottomDataWidth = 0;
                    } else {
                        var bottomOffset = $("#viewNewChatroom .new-chatroom-footer .data-list:last-child").offset();
                        var bottomDataWidth = $("#viewNewChatroom .new-chatroom-footer .data-list:last-child").width();
                    }

                    var footerPaddingTop = parseInt(document.documentElement.clientWidth * (1.945 + 1) / 100, 10);
                    var footerPaddingLeft = parseInt(document.documentElement.clientWidth * (3.71 + 5.4) / 100, 10);

                    userAnimate.animate({
                        top: parseInt(bottomOffset.top + footerPaddingTop, 10)
                    }, 250).animate({
                        left: parseInt(bottomOffset.left + bottomDataWidth + footerPaddingLeft, 10),
                        opacity: 0
                    }, 250, function() {
                        var userDataSelectedHTML = $("template#tplUserDataSelected").html();
                        var userDataSelected = $(userDataSelectedHTML);

                        userDataSelected.prop("id", "emp" + userEmpID);
                        userDataSelected.find(".left").prepend(imgContent);
                        userDataSelected.find(".user-name").html(cutString(15.5, userName, 3.14));
                        userDataSelected.find(".user-name").data("userName", userName);

                        userAnimate.remove();

                        $("#viewNewChatroom .new-chatroom-footer .data-list:last-child").removeClass("last");
                        $("#viewNewChatroom .new-chatroom-footer").append(userDataSelected);
                        $("#viewNewChatroom .new-chatroom-footer .data-list:last-child").addClass("last");

                        checkSelectedUser();
                    });
                } else {
                    var dataCount = $("#viewNewChatroom .new-chatroom-footer .data-list").length;
                    var leftWidth = parseInt(18.84 * dataCount, 10);

                    if ($("#emp" + userEmpID).length > 0) {
                        $("#emp" + userEmpID).css({
                            position: "relative"
                        }).animate({
                            left: "-" + leftWidth + "vw",
                            opacity: 0
                        }, 500, function() {
                            $("#viewNewChatroom .new-chatroom-footer #emp" + userEmpID).remove();

                            checkSelectedUser();
                        });
                    }
                }

            }
        }, "#viewNewChatroomContent .data-list-content input:checkbox");

        //Delete selected user
        $(document).on({
            click: function() {

                //uncheck checkbox
                var empID = $(this).prop("id").substr(3);

                $("#viewNewChatroomContent .data-list-content input:checkbox").each(function(index, data) {
                    if ($(data).val() == empID) {
                        $(data).prop("checked", false);
                    }
                });

                //remove user data
                var dataCount = $("#viewNewChatroom .new-chatroom-footer .data-list").length;
                var leftWidth = parseInt(18.84 * dataCount, 10);

                $(this).css({
                    position: "relative"
                }).animate({
                    left: "-" + leftWidth + "vw",
                    opacity: 0
                }, 500, function() {
                    $("#viewNewChatroom .new-chatroom-footer #emp" + empID).remove();

                    checkSelectedUser();
                });

            }
        }, "#viewNewChatroom .new-chatroom-footer .data-list");

        //Create chatroom
        $(document).on({
            click: function() {
                if (!$(this).hasClass("none-work")) {

                    var name = "";
                    var desc = "need_history=Y;";
                    var empNumberArray = [];

                    $("#viewNewChatroom .new-chatroom-footer .data-list").each(function(index, element) {
                        name = name + $(element).find(".user-name").data("userName") + ", ";
                        empNumberArray.push($(element).prop("id").substr(3));
                    });

                    if (empNumberArray.length == 1) {
                        var chatroomName = name.substr(0, name.length - 2);
                        desc = desc + "group_message=N;";
                    } else if (empNumberArray.length > 1) {
                        var chatroomName = loginData["loginid"] + ", " + name.substr(0, name.length - 2);
                        desc = desc + "group_message=Y;";
                    }

                    //Chatroom name changed
                    desc = desc + "name_changed=N";

                    //Create chatroom
                    loadingMask("show");
                    window.newQChatroom(chatroomName, desc, empNumberArray);

                }
            }
        }, "#createChatroom");

        //Invite Add Friend / Install QPlay
        $(document).on({
            click: function(event) {

                //find listView ID
                var listViewID = $(this).parents(".user-list").prop("id");

                //check action
                if ($(event.target).hasClass("not-friend")) {
                    actionButton(listViewID, "not-friend");
                } else if ($(event.target).hasClass("not-register")) {
                    actionButton(listViewID, "not-register");
                } else if ($(event.target).hasClass("protect")) {
                    actionButton(listViewID, "protect");
                } else if ($(event.target).hasClass("action-info")) {
                    
                }

            }
        }, ".user-list .button-content");

        //Back Button
        $(document).on({
            click: function() {
                onBackKeyDown();
            }
        }, "#eventAddBack");

    }
});
