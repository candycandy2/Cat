
$("#viewNewChatroom").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        window.getQList = function(type, string) {
            string = string || "";

            (function(type, string) {

                //type: [1:name] [3:only same department]
                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    search_type: type,
                    search_string: string,
                    friend_only: "N"
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {

                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        //check download time
                        var nowDateTime = new Date();
                        var nowTimestamp = nowDateTime.TimeStamp();

                        //check if this user has been selected before.
                        var empNumberArray = [];
                        $(".new-chatroom-footer .data-list").each(function(index, element) {
                            empNumberArray.push($(element).prop("id").substr(3));
                        });

                        //store data in local storage
                        for (var i=0; i<data['Content'].user_list.length; i++) {

                            var userData = data['Content'].user_list[i];

                            function callback() {
                                userListView(data['Content'].user_list.length, data['Content'].over_threshold, userData.name, i+1, nowTimestamp, empNumberArray);
                            }

                            window.processUserData(userData, callback);

                        }

                        JM.updateLocalStorage();

                    } else if (resultCode === "025998") {
                        //no data
                        userListView(0);
                    }

                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "getQList", successCallback, failCallback, queryData, "");

            }(type, string));
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

        };

        function userListView(dataCount, overMaxLength, userName, dataIndex, nowTimestamp, empNumberArray) {
            overMaxLength = overMaxLength || null;
            userName = userName || null;
            dataIndex = dataIndex || null;
            nowTimestamp = nowTimestamp || null;
            empNumberArray = empNumberArray || null;

            if (dataCount === 0 || dataIndex === 1) {
                $("#msgWelcome").hide();
                $("#msgUserOverflow").hide();
                $("#userListContent .user-list").remove();
                $("#userListContent .ui-hr-list").remove();
            }

            if (dataCount === 0) {
                $("#msgNoFound").show();
                $("#titleFriend").hide();
            } else {
                $("#msgNoFound").hide();
                $("#titleFriend").show();

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
                } else if (JM.data.chatroom_user[userName].is_friend == false) {
                    userList.find(".not-friend").show();
                }

                $("#userListContent").append(userList);

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
            $("#userList" + listViewIndex).find(".img-content svg").hide();
            $("#userList" + listViewIndex).find(".img-content img").prop("src", avatarPath);
            $("#userList" + listViewIndex).find(".img-content img").show();
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
            var selectCount = $('#userListContent :checkbox:checked').length;
            var dataCount = $(".new-chatroom-footer .data-list").length;

            if (selectCount == 0 && dataCount == 0) {
                setCreateChatroomButton("disable");
                $(".new-chatroom-footer").css("opacity", 0);
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

        function sendQInvitation(listViewID, userID) {
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
        }

        function sendQInstall(listViewID, userID) {
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
        }

        function actionButton(listViewID, action) {
            //action: not-friend / not-register / protect / show

            //change button / info
            $("#" + listViewID).find(".button-content ." + action).hide();
            var userID = $("#" + listViewID).find(".user-name").html();

            //action-success-full-screen message
            if (action === "not-friend") {
                window.setQFriend(userID);
            } else if (action === "not-register") {
                sendQInstall(listViewID, userID);
            } else if (action === "protect") {
                sendQInvitation(listViewID, userID);
            } else {
                $(".action-success-full-screen").show();

                setTimeout(function() {
                    $(".action-success-full-screen").hide();
                    $(".action-success-full-screen span").hide();
                }, 3000);
            }

        }

        /********************************** page event *************************************/
        $("#viewIndex").on("pagebeforeshow", function(event, ui) {

            //Recovery Search User Input UI
            $("#searchUserInput").css("width", "92.5vw");
            $("#searchUserInput").val("");
            $("#searchUserButton").hide();
            $("#searchUserClearContent").hide();

            $("#msgWelcome").show();
            $("#titleFriend").hide();
            $("#msgUserOverflow").hide();
            $("#userListContent .user-list").remove();
            $("#userListContent .ui-hr-list").remove();

            //Clear User Selected UI
            $(".new-chatroom-footer .data-list").remove();
            $(".new-chatroom-footer").css("opacity", 0);
        });

        $("#viewIndex").on("pageshow", function(event, ui) {

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
                    $("#searchUserClearContent").show();
                    getQList("1", text);
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
                $(".new-chatroom-footer").css("opacity", 1);

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

                    if ($(".new-chatroom-footer .data-list").length == 0) {
                        var bottomOffset = $(".new-chatroom-footer").offset();
                        var bottomDataWidth = 0;
                    } else {
                        var bottomOffset = $(".new-chatroom-footer .data-list:last-child").offset();
                        var bottomDataWidth = $(".new-chatroom-footer .data-list:last-child").width();
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

                        $(".new-chatroom-footer .data-list:last-child").removeClass("last");
                        $(".new-chatroom-footer").append(userDataSelected);
                        $(".new-chatroom-footer .data-list:last-child").addClass("last");

                        checkSelectedUser();
                    });
                } else {
                    var dataCount = $(".new-chatroom-footer .data-list").length;
                    var leftWidth = parseInt(18.84 * dataCount, 10);

                    if ($("#emp" + userEmpID).length > 0) {
                        $("#emp" + userEmpID).css({
                            position: "relative"
                        }).animate({
                            left: "-" + leftWidth + "vw",
                            opacity: 0
                        }, 500, function() {
                            $(".new-chatroom-footer #emp" + userEmpID).remove();

                            checkSelectedUser();
                        });
                    }
                }

            }
        }, "#userListContent input:checkbox");

        //Delete selected user
        $(document).on({
            click: function() {

                //uncheck checkbox
                var empID = $(this).prop("id").substr(3);

                $("#userListContent input:checkbox").each(function(index, data) {
                    if ($(data).val() == empID) {
                        $(data).prop("checked", false);
                    }
                });

                //remove user data
                var dataCount = $(".new-chatroom-footer .data-list").length;
                var leftWidth = parseInt(18.84 * dataCount, 10);

                $(this).css({
                    position: "relative"
                }).animate({
                    left: "-" + leftWidth + "vw",
                    opacity: 0
                }, 500, function() {
                    $(".new-chatroom-footer #emp" + empID).remove();

                    checkSelectedUser();
                });

            }
        }, ".new-chatroom-footer .data-list");

        //Create chatroom
        $(document).on({
            click: function() {
                if (!$(this).hasClass("none-work")) {

                    var name = "";
                    var desc = "need_history=Y;";
                    var empNumberArray = [];

                    $(".new-chatroom-footer .data-list").each(function(index, element) {
                        name = name + $(element).find(".user-name").data("userName") + ", ";
                        empNumberArray.push($(element).prop("id").substr(3));
                    });

                    if (empNumberArray.length == 1) {
                        var chatroomName = name.substr(0, name.length - 2);
                        desc = desc + "group_message=N";
                    } else if (empNumberArray.length > 1) {
                        var chatroomName = loginData["loginid"] + ", " + name.substr(0, name.length - 2);
                        desc = desc + "group_message=Y";
                    }

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
