
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

                    if (resultCode === "1" || resultCode === "025998") {

                        if (resultCode === "1") {
                            var userListCount = data['Content'].user_list.length;
                        } else if (resultCode === "025998") {
                            var userListCount = 0;
                        }

                        var dataCount = userListCount + friendCount;
                    } else {
                        var dataCount = 0;
                    }

                    if (dataCount > 0) {

                        //check download time
                        var nowDateTime = new Date();
                        var nowTimestamp = nowDateTime.TimeStamp();

                        //check if this user has been selected before.
                        var empNumberArray = [];
                        $("#viewNewChatroom .new-chatroom-footer .data-list").each(function(index, element) {
                            empNumberArray.push($(element).prop("id").substr(3));
                        });

                        //store data in local storage
                        var friendIndex = 0;

                        for (var i=0; i<dataCount; i++) {

                            if (userListCount > 0) {
                                var userData = data['Content'].user_list[i];
                            }

                            if ((i+1) > userListCount) {
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
                                        window.addFriendListView(dataCount, data['Content'].over_threshold, userData.name, i+1, nowTimestamp, userData.status, type);
                                    } else if (type === "1") {
                                        window.addFriendListView(dataCount, data['Content'].over_threshold, userData.name, i+1, nowTimestamp, userData.status, type);
                                    }
                                }
                            }

                        }

                        JM.updateLocalStorage();

                    } else if (dataCount == 0) {
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

            var avatar_path = "";
            var avatar_download_time = 0;

            if (JM.data.chatroom_user[userData.name] !== undefined) {
                avatar_path = JM.data.chatroom_user[userData.name].avatar_path;
                avatar_download_time = JM.data.chatroom_user[userData.name].avatar_download_time;
            } else {
                JM.data.chatroom_user[userData.name] = {};
            }

            var is_friend = false;
            if (userData.status === "1") {
                is_friend = true;
            }

            var send_invite = false;
            if (userData.status === "2") {
                send_invite = true;
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
                send_invite:            send_invite,
                avatar_path:            avatar_path,
                avatar_download_time:   avatar_download_time
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
                userList.find(".personal-popup").data("userID", userName);

                //info / radio button
                var hideRadioBtn = false;
                if (JM.data.chatroom_user[userName].is_register == false) {
                    hideRadioBtn = true;
                    userList.find(".not-register").show();
                    userList.find(".user-name").removeClass("user-name-only");
                } else if (JM.data.chatroom_user[userName].is_protect == true) {

                    if (JM.data.chatroom_user[userName].is_friend == false) {
                        hideRadioBtn = true;
                    }

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
            /*
            $("div#userList" + listViewIndex).find(".img-content svg").hide();
            $("div#userList" + listViewIndex).find(".img-content img").prop("src", avatarPath);
            $("div#userList" + listViewIndex).find(".img-content img").show();
            */
            window.checkImageExist(avatarPath, "div#userList" + listViewIndex, ".img-content");
        };

        window.checkQPrivateChat = function(empNumber, chatroomName, chatroomDesc, empNameArray) {
            (function(empNumber, chatroomName, chatroomDesc, empNameArray) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    destination_emp_no: empNumber
                };

                var queryData = "<LayoutHeader>" + createXMLDataString(queryDataObj) + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        console.log("==========checkQPrivateChat success");

                        $("#userInfoPopup").popup("close");

                        if (data['Content'].group_id === null) {
                            //Chatroom does not exist
                            JM.Chatroom.createGroup(chatroomName, chatroomDesc, empNameArray);

                            JM.newCreate = true;
                        } else {
                            //Chatroom has created
                            JM.chatroomID = data['Content'].group_id;

                            JM.newCreate = false;

                            //change page to chatroom
                            setTimeout(function(){
                                $.mobile.changePage('#viewChatroom');
                            }, 1000);
                        }
                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "checkQPrivateChat", successCallback, failCallback, queryData, "");

            }(empNumber, chatroomName, chatroomDesc, empNameArray));
        };

        window.newQChatroom = function(groupID, name, desc, empNameArray) {
            (function(groupID, name, desc, empNameArray) {

                /*
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

                        $("#userInfoPopup").popup("close");

                        JM.chatroomID = data['Content'].group_id;

                        //change page to chatroom
                        setTimeout(function(){
                            $.mobile.changePage('#viewChatroom');
                        }, 5000);
                    }
                };
                */

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    group_id: groupID,
                    chatroom_name: name,
                    chatroom_desc: desc
                };

                var queryDataParameter = createXMLDataString(queryDataObj);

                var memberList = "";
                for (var i=0; i<empNameArray.length; i++) {
                    var tempDataObj = {
                        destination_emp_no: JM.data.chatroom_user[empNameArray[i]].emp_no
                    };
                    memberList = memberList + createXMLDataString(tempDataObj);
                }
                var memberListParameter = "<member_list>" + memberList + "</member_list>";

                var queryData = "<LayoutHeader>" + queryDataParameter + memberListParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        console.log("==========new chatroom success");

                        //$("#userInfoPopup").popup("close");

                        JM.chatroomID = groupID;

                        //Add groupID into window.groupsArray
                        window.groupsArray.push(JM.chatroomID);

                        //change page to chatroom
                        setTimeout(function(){
                            $.mobile.changePage('#viewChatroom');
                        }, 5000);
                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "newQChatroom", successCallback, failCallback, queryData, "");

            }(groupID, name, desc, empNameArray));
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

                        $("#actionMsg1 .user-name").html(userID);
                        $("#actionMsg1").show();

                        actionButton("show");

                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "setQFriend", successCallback, failCallback, queryData, "");

            }(userID));
        };

        window.sendQInvitation = function(action, userID, listViewID) {
            listViewID = listViewID || null;

            (function(action, userID, listViewID) {

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

                        if (action === "listview") {
                            $("#" + listViewID).find(".button-icon-content").hide();
                            $("#" + listViewID).find(".action-info").show();

                            $("#actionMsg2").show();

                            actionButton("show");
                        } else if (action === "popup") {
                            $("#userInfoPopup .status-a").hide();
                            $("#userInfoPopup .status-b").show();
                            $("#userInfoPopup .button-add").addClass("personal-popup-button-disable");
                        }

                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "sendQInvitation", successCallback, failCallback, queryData, "");

            }(action, userID, listViewID));
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

                        $("#actionMsg3 .user-name").html(userID);
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
                window.sendQInvitation("listview", userID, listViewID);
            } else {
                $(".action-success-full-screen").show();

                setTimeout(function() {
                    $(".action-success-full-screen").hide();
                    $(".action-success-full-screen .action-msg").hide();
                }, 3000);
            }

        };

        /********************************** page event *************************************/
        $("#viewNewChatroom").one("pagebeforeshow", function(event, ui) {

            //---------------------iOS UI---------------------
            if (device.platform === "iOS") {
                $("#viewNewChatroom .page-main .search-user-content").css({
                    "padding-top": iOSFixedTopPX() + "px"
                });

                $("#viewNewChatroom .page-main .search-user-button").css({
                    "top": parseInt(document.documentElement.clientWidth * 2.468 / 100 + iOSFixedTopPX(), 10) + "px"
                });

                $("#viewNewChatroom .page-main .search-user-clear-content").css({
                    "top": iOSFixedTopPX() + "px"
                });
            }

        });

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
                    checkSelectedUser();
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
                    var empNameArray = [];

                    $("#viewNewChatroom .new-chatroom-footer .data-list").each(function(index, element) {
                        var userName = $(element).find(".user-name").data("userName");
                        name = name + userName + ", ";

                        empNameArray.push(userName);
                    });

                    if (empNameArray.length == 1) {
                        var chatroomName = name.substr(0, name.length - 2);
                        desc = desc + "group_message=N;";
                    } else if (empNameArray.length > 1) {
                        var chatroomName = name.substr(0, name.length - 2);
                        desc = desc + "group_message=Y;";
                    }

                    //Chatroom name changed
                    desc = desc + "name_changed=N";

                    //Create chatroom
                    loadingMask("show");

                    if (empNameArray.length == 1) {
                        window.checkQPrivateChat(JM.data.chatroom_user[empNameArray[0]].emp_no, chatroomName, desc, empNameArray);
                    } else if (empNameArray.length > 1) {
                        JM.Chatroom.createGroup(chatroomName, desc, empNameArray);

                        JM.newCreate = true;
                    }

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
