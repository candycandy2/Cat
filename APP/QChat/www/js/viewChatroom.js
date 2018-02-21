
$("#viewChatroom").pagecontainer({
    create: function(event, ui) {

        var nowChatroomID = "";
        var newCreate;
        var lastRenderJMMsgID = 0;
        var lastRenderQPlayMsgID = 0;
        var msgDateText = "";
        var photoLocalPath = "";
        var sendMessage = false;
        var sendImgSuccess = false;
        var receiveMsg = false;

        /********************************** function *************************************/
        window.sendTextMessage = function(chatroomID, text, event, action) {
            event = event || false;
            action = action || "";

            (function(chatroomID, text, event, action) {

                var callback = function(status, data) {

                    if (status === "success") {
                        sendMessage = true;

                        if (!event) {
                            window.getConversation(chatroomID, true);
                        } else {
                            if (action === "newChatroom") {
                                window.getConversation(chatroomID, true);
                            } else if (action === "memberEvent") {
                                window.getConversation(chatroomID, false);
                            }
                        }
                    }

                };

                JM.Message.sendTextMessage(chatroomID, text, callback, event, action);

            }(chatroomID, text, event, action));
        };

        function sendImageMessage(chatroomID) {
            (function(chatroomID) {

                sendImgSuccess = false;
                imageDefaultMessage();

                var callback = function(status, data) {

                    if (status === "success") {
                        sendMessage = true;
                        window.getConversation(chatroomID, true);
                    } else {
                        //error case
                    }

                };

                JM.Message.sendImageMessage(chatroomID, photoLocalPath, callback);

            }(chatroomID));
        }

        function imageDefaultMessage() {
            var msgDivHeight = parseInt(document.documentElement.clientWidth * 53.558 / 100, 10);
            var lodingImgHeight = 54;
            var paddingTop = (msgDivHeight - 54) / 2;

            var msgImgRightHTML = $("template#tplMsgImgRight").html();
            var msgImg = $(msgImgRightHTML);

            msgImg.prop("id", "uploadImgLoading");
            msgImg.find(".time").html("");
            msgImg.find(".img").append('<img src="' + photoLocalPath + '" class="img img-horizontal img-vertical">');
            msgImg.find(".img").append('<div class="img-loading"><img src="img/component/ajax-loader.gif" style="padding-top:' + paddingTop + 'px;"></div>');
            $("#viewChatroomContent").append(msgImg);

            $('html, body').animate({
                scrollTop: $(document).height()
            }, 500);
        }

        function tempImage(imageUploadURL, action) {
            action = action || "upload";
            photoLocalPath = imageUploadURL;

            //To get original width / height of the image
            if ($("#myTempImage").length > 0) {
                $("#myTempImage").remove();
            }

            $("<img id='myTempImage' style='display:none;' src='" + photoLocalPath + "'>").load(function() {
                $(this).appendTo("#tempImage");

                var imageWidth = $("#myTempImage").width();
                var imageHeight = $("#myTempImage").height();
                var clientHeight = document.documentElement.clientHeight;
                var clientWidth = document.documentElement.clientWidth;
                var resizeWidthPercent = parseFloat(clientWidth / imageWidth).toFixed(2);
                var buttonHeight = parseFloat($(window).height() * 0.1306).toFixed(2);

                var resizePhotoWidth = parseInt(imageWidth * resizeWidthPercent, 10);
                var resizePhotoHeight = parseInt(imageHeight * resizeWidthPercent, 10);

                if (action === "upload") {
                    confirmPhoto(resizePhotoWidth, resizePhotoHeight);
                } else if (action === "download") {
                    fullScreenPhoto(resizePhotoWidth, resizePhotoHeight);
                }
            });
        }

        //Full-screen Photo to confirm > cancel or confirm
        function confirmPhoto(resizePhotoWidth, resizePhotoHeight) {
            var buttonHeight = parseFloat($(window).height() * 0.1306).toFixed(2);
            var imageContent = '<img src="' + photoLocalPath + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';

            var buttonContent = '<div class="button-content bottom font-style3"><span id="photoCancel">重新選擇</span><span id="photoConfirm">使用照片</span></div>';
            $('<div class="message-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            if (device.platform === "iOS") {
                $(".message-photo-full-screen img").css("padding-top", "20px");
            }

            $(".message-photo-full-screen").css("top", $(document).scrollTop());

            $('body').css({
                'overflow': 'hidden',
                'touch-action': 'none'
            });

            $('body').on('touchmove', function(e) {
                e.preventDefault();
            });

            //Photo Cancel - Button Event
            $("#photoCancel").on("click", function() {
                confirmPhotoClose();
                cameraButtonSet("close");
            });

            //Photo Confirm - Button Event
            $("#photoConfirm").on("click", function() {
                confirmPhotoClose();
                sendImageMessage(nowChatroomID);
            });
        }

        function confirmPhotoClose() {
            $(".message-photo-full-screen").remove();

            $('body').css({
                'overflow': 'auto',
                'touch-action': 'auto'
            });
            $('body').off('touchmove');
        }

        function fullScreenPhoto(resizePhotoWidth, resizePhotoHeight) {
            var imageContent = '<img id="fullScreenImg" src="' + photoLocalPath + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';
            var buttonContent = '<div class="button-content top"><div class="back-button"><span class="back"></span></div></div>';
            $('<div class="message-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            var buttonHeight = $(".message-photo-full-screen .button-content").height();

            if (device.platform === "iOS") {
                $(".message-photo-full-screen").css("margin-top", "20px");
            }

            $(".message-photo-full-screen #fullScreenImg").css("padding-top", buttonHeight + "px");
            $(".message-photo-full-screen").css("top", $(document).scrollTop());

            $('body').css({
                'overflow': 'hidden',
                'touch-action': 'none'
            });

            $('body').on('touchmove', function(e) {
                e.preventDefault();
            });

            //Back Button
            $(".button-content .back-button").on("click", function() {
                $(".message-photo-full-screen").remove();
                $(".chatroom-footer").removeClass("ui-fixed-hidden");

                $('body').css({
                    'overflow': 'auto',
                    'touch-action': 'auto'
                });
                $('body').off('touchmove');
            });
        }

        window.getConversation = function(chatroomID, getHistory, receiveMessage) {
            receiveMessage = receiveMessage || false;

            receiveMsg = receiveMessage;

            (function(chatroomID, getHistory, receiveMessage) {

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("----getConversation--success");
                        console.log(data);

                        if (newCreate) {
                            window.getGroupIds("getConversation", data);
                        } else {
                            window.processChatroomData(data, "getConversation", getHistory, receiveMessage);
                        }
                    }

                };

                JM.Chatroom.getConversation(chatroomID, callback);

            }(chatroomID, getHistory, receiveMessage));
        };

        window.processChatroomData = function(data, action, getHistory, receiveMessage) {
            receiveMessage = receiveMessage || false;

            (function(data, action, getHistory, receiveMessage) {

                //For sync event, any processChatroomData should after getGroupIds,
                //if not, call it first.
                if (!window.callGetGroupIds) {
                    window.getGroupIds("syncEvent", data);
                    return;
                }

                //For receive event, check if User is still in this chatroom,
                //if not, ignore the chatroom data, and don't show it.
                if (window.groupsArray.indexOf(data.target.id.toString()) == -1) {
                    return;
                }

                var avatarPath;
                var avatarDownloadTime;
                var loadHistory;
                var memberData;
                var lastViewMsgID = 0;

                //Check if Chatroom data was exist
                if (JM.data.chatroom[data.target.id] !== undefined) {
                    avatarPath = JM.data.chatroom[data.target.id].avatar_path;
                    avatarDownloadTime = JM.data.chatroom[data.target.id].avatar_download_time;
                    loadHistory = JM.data.chatroom[data.target.id].load_history;
                    memberData = JM.data.chatroom[data.target.id].member;
                    lastViewMsgID  = JM.data.chatroom[data.target.id].last_view_msg_id;
                } else {
                    avatarPath = "";
                    avatarDownloadTime = 0;
                    loadHistory = false;
                    memberData = [];
                }

                //For JMessage Bug, if getConversation does not return [owner],
                //need to call getGroupInfo to get [owner];
                if (data.target.owner === undefined) {
                    var callback = function(callbackData) {
                        data.target.desc = callbackData.desc;
                        data.target.name = callbackData.name;
                        data.target.owner = callbackData.owner;

                        window.processChatroomData(data, action, getHistory, receiveMessage);
                    };

                    window.getGroupInfo("viewChatroom", data.target.id, callback);

                    return;
                }

                //Chatroom can not work without [desc]
                //[desc] should be : [need_history=Y;group_message=Y;name_changed=N]
                if (data.target.desc.length < 40) {
                    return;
                }

                if (data.target.desc.indexOf("=") != -1) {

                    var descArray = data.target.desc.split(";");

                    //Check if Chatroom need auto read history
                    var needHistory;
                    var needHistoryArray = descArray[0].split("=");
                    if (needHistoryArray[1] === "Y") {
                        needHistory = true;
                    } else {
                        needHistory = false;
                    }

                    //Check if Chatroom is [1 to 1] or group
                    var groupMessage;
                    var groupMessageArray = descArray[1].split("=");
                    if (groupMessageArray[1] === "Y") {
                        groupMessage = true;
                    } else {
                        groupMessage = false;
                    }

                    //Check if Chatroom name changed by user
                    var nameChanged;
                    var nameChangedArray = descArray[2].split("=");
                    if (nameChangedArray[1] === "Y") {
                        nameChanged = true;
                    } else {
                        nameChanged = false;
                    }

                    //message: text or image
                    var messageContent = "";

console.log(data);
console.log(data.latestMessage);
                    if (data.latestMessage.type === "text") {
                        messageContent = data.latestMessage.text;
                    } else if (data.latestMessage.type === "image") {
                        messageContent = data.latestMessage.from.username + " 上傳了一張圖片";
                    }

                    //For iOS, sometimes API-getConversation won't return [unreadCount]
                    var unreadCount = 0;

                    if (typeof data.unreadCount !== "undefined") {
                        unreadCount = data.unreadCount;
                    }

                    var tempData = {
                        is_group: groupMessage,
                        name: data.target.name,
                        name_changed: nameChanged,
                        owner: data.target.owner,
                        unread_count: unreadCount,
                        member: memberData,
                        last_message: {
                            create_time: data.latestMessage.createTime,
                            id: data.latestMessage.id,
                            from: data.latestMessage.from.username,
                            type: data.latestMessage.type,
                            text: messageContent
                        },
                        avatar_path: avatarPath,
                        avatar_download_time: avatarDownloadTime,
                        need_history: needHistory,
                        load_history: loadHistory,
                        last_view_msg_id: lastViewMsgID
                    };

                    JM.data.chatroom[data.target.id] = tempData;

                    JM.updateLocalStorage();

                    if (!receiveMessage) {
                        if (action === "getConversation") {
                            //If send message, no need to refresh group member
                            if (!sendMessage) {
                                //If edit chatroom info, no need to refresh group member
                                if (prevPageID != "viewChatroomInfo") {
                                    window.getGroupMembers(data.target.id, groupMessage, "getConversation");
                                }
                            }

                            if (newCreate) {
                                window.getGroupMembers(data.target.id, groupMessage, "getConversation");
                            } else {
                                window.chatroomTitle();
                            }
                        }

                        if (getHistory) {
                            getHistoryMessages();
                        }
                    } else {
                        if (!getHistory) {
                            window.getGroupMembers(data.target.id, groupMessage, "chatroomListView");
                        } else {
                            //viewChatroom
                            getHistoryMessages();

                            if (newCreate) {
                                window.getGroupMembers(data.target.id, groupMessage, "getConversation");
                            }
                        }
                    }
                } else {
                    var callback = function(name, desc) {
                        data.target.name = name;
                        data.target.desc = desc;

                        window.processChatroomData(data, action, getHistory, receiveMessage);
                    };

                    window.getQUserChatroom("conversation", data.target.id, callback);
                }

            }(data, action, getHistory, receiveMessage));

        };

        window.chatroomTitle = function() {
            var chatroomName = JM.data.chatroom[nowChatroomID].name;
            var memberLength = JM.data.chatroom[nowChatroomID].member.length;

            $("#chatroomTitle").html(cutString(58.5, chatroomName, 4.39, "number", memberLength));
        };

        function getQGroupHistoryMessage(callback) {
            (function(callback) {

                //get history between 30 days
                var nowDateTime = new Date();
                var endTime = nowDateTime.getTime();
                var beginTime = nowDateTime.setDate(nowDateTime.getDate() - 30);

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    group_id: nowChatroomID,
                    begin_time: beginTime,
                    end_time: endTime
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        if (JM.data.chatroom_message_history[nowChatroomID] === undefined) {
                            JM.data.chatroom_message_history[nowChatroomID] = [];
                        }

                        if (data["Content"].messages.length > 0) {

                            for (var i=0; i<data["Content"].messages.length; i++) {

                                if (data["Content"].messages[i].msg_type === "text") {
                                    var tempData = {
                                        id: (i + 1),
                                        time: data["Content"].messages[i].msg_ctime,
                                        from: data["Content"].messages[i].from_id,
                                        type: "text",
                                        source: "QPlay",
                                        text: data["Content"].messages[i].msg_body.text,
                                        extras: {
                                            event: data["Content"].messages[i].msg_body.extras.event,
                                            action: data["Content"].messages[i].msg_body.extras.action
                                        }
                                    };

                                    JM.data.chatroom_message_history[nowChatroomID].push(tempData);
                                } else if (data["Content"].messages[i].msg_type === "image") {
                                    var tempData = {
                                        id: (i + 1),
                                        time: data["Content"].messages[i].msg_ctime,
                                        from: data["Content"].messages[i].from_id,
                                        type: "image",
                                        source: "QPlay",
                                        thumbPath: data["Content"].messages[i].msg_body.qplay_thumb_path,
                                        originalPath: data["Content"].messages[i].msg_body.qplay_media_path,
                                        get_download: true,
                                        download_time: null,
                                        extras: {
                                            event: data["Content"].messages[i].msg_body.extras.event,
                                            action: data["Content"].messages[i].msg_body.extras.action
                                        }
                                    };

                                    JM.data.chatroom_message_history[nowChatroomID].push(tempData);
                                }

                            }

                            JM.data.chatroom[nowChatroomID].load_history = true;
                            JM.updateLocalStorage();

                            callback();
                        } else {
                            callback();
                        }

                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "getQGroupHistoryMessage", successCallback, failCallback, queryData, "");

            }(callback));
        }

        function getHistoryMessages() {
            (function() {

                if (JM.data.chatroom[nowChatroomID] === undefined) {
                    //new create chatroom
                    var from = 0;
                    var limit = -1;
                } else {

                    var getHistory = false;

                    if (JM.data.chatroom_message_history[nowChatroomID] === undefined) {
                        //For User who was new added to the chatroom
                        if (JM.data.chatroom[nowChatroomID].need_history == true && JM.data.chatroom[nowChatroomID].load_history == false) {
                            if (!newCreate) {
                                getQGroupHistoryMessage(getHistoryMessages);
                                return;
                            } else {
                                getHistory = true;
                            }
                        } else {
                            getHistory = true;
                        }
                    } else {
                        getHistory = true;
                    }

                    if (getHistory) {
                        //According to the retrun data from JMessage API-getConversations,
                        //decide the [from] & [limit]
                        //var from = JM.data.chatroom[nowChatroomID].last_message.id;

                        //JMessage change the sequence of return data, the index of latest data is 0;
                        var from = 0;

                        if (sendMessage) {
                            var limit = 1;
                        } else {
                            var limit = JM.data.chatroom[nowChatroomID].unread_count;
                        }
                    }

                }

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("----getHistoryMessages--success");
                        console.log(data);

                        //Update unread_count in local storage
                        var oldUnreadCount = JM.data.chatroom[nowChatroomID].unread_count;
                        var newUnreadCount = oldUnreadCount - limit;

                        if (newUnreadCount < 0) {
                            newUnreadCount = 0;
                        }

                        JM.data.chatroom[nowChatroomID].unread_count = newUnreadCount;

                        //the message id won't return by serial number, ex: [1,2,3,4,5],
                        //may return this type [1,2,3,5,4]; so, sort the data by id
                        var tempData = {};
                        for (var i=data.length - 1; i>=0; i--) {
                            tempData[data[i].id] = data[i];
                        }

                        var msgIDArray = [];
                        window.msgTimeArray = [];

                        if (JM.data.chatroom_message_history[nowChatroomID] === undefined) {
                            JM.data.chatroom_message_history[nowChatroomID] = [];
                        } else {
                            for (var i=0; i<JM.data.chatroom_message_history[nowChatroomID].length; i++) {

                                if (JM.data.chatroom_message_history[nowChatroomID][i].source === "JM") {
                                    var msgID = "msgJM" + JM.data.chatroom_message_history[nowChatroomID][i].id;
                                } else if (JM.data.chatroom_message_history[nowChatroomID][i].source === "QPlay") {
                                    var msgID = "msgQPlay" + JM.data.chatroom_message_history[nowChatroomID][i].id;
                                }

                                msgIDArray.push(msgID);
                                msgTimeArray[JM.data.chatroom_message_history[nowChatroomID][i].time] = i;
                            }
                        }

                        var lastMessageID = "msgJM" + JM.data.chatroom[nowChatroomID].last_message.id;

                        $.each(tempData, function(index, data) {

                            var pushData = false;

                            if (newCreate) {
                                if ("msgJM" + data.id === lastMessageID) {
                                    pushData = true;
                                }
                            } else {
                                if (msgIDArray.indexOf("msgJM" + data.id) == -1) {

                                    //Check if the msg with same timestamp has exist in QPlay, remove it.
                                    if (msgTimeArray[data.createTime] != undefined) {
                                        JM.data.chatroom_message_history[nowChatroomID].splice(msgTimeArray.indexOf(data.createTime), 1);
                                    }

                                    pushData = true;
                                }
                            }

                            if (pushData) {

                                if (data.type === "text") {
                                    var tempData = {
                                        id: data.id,
                                        time: data.createTime,
                                        from: data.from.username,
                                        type: "text",
                                        source: "JM",
                                        text: data.text,
                                        extras: {
                                            event: data.extras.event,
                                            action: data.extras.action
                                        }
                                    };

                                    JM.data.chatroom_message_history[nowChatroomID].push(tempData);
                                } else if (data.type === "image") {
                                    var tempData = {
                                        id: data.id,
                                        time: data.createTime,
                                        from: data.from.username,
                                        type: "image",
                                        source: "JM",
                                        thumbPath: data.thumbPath,
                                        originalPath: "",
                                        get_download: false,
                                        download_time: null,
                                        extras: {
                                            event: data.extras.event,
                                            action: data.extras.action
                                        }
                                    };

                                    JM.data.chatroom_message_history[nowChatroomID].push(tempData);
                                }

                            }
                        });

                        resetUnreadMessageCount();
                        JM.updateLocalStorage();
                        newCreate = false;
                        loadingMask("hide");

                        messageListView();
                    }

                };

                JM.Message.getHistoryMessages(nowChatroomID, from, limit, callback);

            }());
        }

        function resetUnreadMessageCount() {
            JM.Chatroom.resetUnreadMessageCount(nowChatroomID);
        }

        function messageListView() {

            var msgDateHTML = $("template#tplMsgDate").html();
            var msgEventTimeHTML = $("template#tplMsgEventTime").html();
            var msgTextRightHTML = $("template#tplMsgTextRight").html();
            var msgTextLeftHTML = $("template#tplMsgTextLeft").html();
            var msgImgRightHTML = $("template#tplMsgImgRight").html();
            var msgImgLeftHTML = $("template#tplMsgImgLeft").html();

            var owner = JM.data.chatroom[nowChatroomID].owner;
            var lastSender = "";
            var lastMsg = "";
            var lastMsgType = "";

            $.each(JM.data.chatroom_message_history[nowChatroomID], function(index, message) {

                //Set last_view_msg_id
                if (JM.data.chatroom[nowChatroomID].last_view_msg_id == 0) {
                    if (message.type === "text") {

                        if (message.source === "JM") {
                            var lastViewID = "JM" + message.id;
                        } else if (message.source === "QPlay") {
                            var lastViewID = "QPlay" + message.id;
                        }

                        JM.data.chatroom[nowChatroomID].last_view_msg_id = lastViewID;
                    }
                }

                //If msg has been render before, no need to render again
                if (message.source === "JM") {
                    if (message.id <= lastRenderJMMsgID) {
                        return;
                    } else {
                        lastRenderJMMsgID = message.id;
                    }
                } else if (message.source === "QPlay") {
                    if (message.id <= lastRenderQPlayMsgID) {
                        return;
                    } else {
                        lastRenderQPlayMsgID = message.id;
                    }
                }

                //Msg in right or left
                if (loginData["loginid"] === message.from) {
                    var sender = true;
                } else {
                    var sender = false;
                }

                var msgDatetime = new Date(message.time);

                //Date month/day, if in the some day, only display once
                if (msgDatetime.mmdd("/") != msgDateText) {
                    var msgDate = $(msgDateHTML);
                    msgDateText = msgDatetime.mmdd("/");
                    msgDate.html(msgDateText);
                    $("#viewChatroomContent").append(msgDate);
                }

                //Text
                if (message.type === "text") {
                    //check if this is a event message
                    if (message.extras.event === "true") {

                        lastMsgType = "event";

                        if (message.extras.action === "newChatroom") {

                        }

                        var msgEventTime = $(msgEventTimeHTML);

                        if (message.source === "JM") {
                            msgEventTime.prop("id", "msgJM" + message.id);
                        } else if (message.source === "QPlay") {
                            msgEventTime.prop("id", "msgQPlay" + message.id);
                        }

                        msgEventTime.find(".msg-time").html(msgDatetime.hhmm());
                        msgEventTime.find(".text-event").html(message.text);
                        $("#viewChatroomContent").append(msgEventTime);

                    } else {

                        //normal text message
                        lastMsgType = "text";

                        if (sender) {
                            var msgText = $(msgTextRightHTML);
                        } else {
                            var msgText = $(msgTextLeftHTML);
                            msgText.find(".name").html(message.from);
                            msgText.find(".personal-popup").data("userID", message.from);
                        }

                        lastSender = message.from;
                        lastMsg = message.text;

                        if (message.source === "JM") {
                            msgText.prop("id", "msgJM" + message.id);
                        } else if (message.source === "QPlay") {
                            msgText.prop("id", "msgQPlay" + message.id);
                        }

                        //check if text has HTTP Link
                        var messageText = "";
                        if (message.text.toLowerCase().indexOf("http") != -1) {
                            var textArray = message.text.split(" ");

                            for (var i=0; i<textArray.length; i++) {

                                if (textArray[i].toLowerCase().indexOf("http") != -1) {
                                    messageText = messageText + " " + "<a href='#' onclick=\"window.open('" + textArray[i] + "', '_system');\">" + textArray[i] + "</a>";
                                } else {
                                    messageText = messageText + " " + textArray[i];
                                }
                            }
                        } else {
                            messageText = message.text;
                        }

                        msgText.find(".time").html(msgDatetime.hhmm());
                        msgText.find(".text").html(messageText);
                        $("#viewChatroomContent").append(msgText);

                    }
                }

                //Image
                if (message.type === "image") {

                    lastMsgType = "image";

                    if (sender) {
                        var msgImg = $(msgImgRightHTML);
                    } else {
                        var msgImg = $(msgImgLeftHTML);
                        msgImg.find(".name").html(message.from);
                        msgImg.find(".personal-popup").data("userID", message.from);
                    }

                    lastSender = message.from;
                    lastMsg = "上傳了一張圖片";

                    if (message.source === "JM") {
                        var tagID = nowChatroomID + "-JM" + message.id;
                        var imagePath = message.thumbPath;

                        msgImg.prop("id", "msgJM" + message.id);
                    } else if (message.source === "QPlay") {
                        var tagID = nowChatroomID + "-QPlay" + message.id;
                        var imagePath = message.thumbPath;

                        msgImg.prop("id", "msgQPlay" + message.id);
                    }

                    msgImg.find(".time").html(msgDatetime.hhmm());
                    msgImg.find(".img").append('<img id="' + tagID + '" class="img">');
                    $("#viewChatroomContent").append(msgImg);

                    //Resize image & check if image is horizontal or vertical
                    $("#" + tagID).prop("src", imagePath).one("load", function() {
                        resizeImage($(this).prop("id"), $(this).width(), $(this).height());
                    });
                }
            });

            //remove upload image loading temp view
            $("#uploadImgLoading").remove();
            cameraButtonSet("close");

            if (receiveMsg || sendMessage) {

                // [xxx create chatroom] don't show preview
                if (lastMsgType === "event") {
                    $(".message-preview").hide();
                } else {
                    if (lastSender.length > 0) {
                        //addReceiveMessageListener event || sendTextMessage
                        $(".message-preview").html(cutString(85, lastSender + " : " + lastMsg, 3.349));
                        $(".message-preview").show();

                        receiveMsg = false;
                        sendMessage = false;
                        lastSender = "";
                    }
                }

                //Re-Sort Chatroom sequence in viewIndex
                window.chatroomListView(nowChatroomID, "sort");
            } else {
                $(".message-preview").hide();
            }

            //scroll to specific message id
            var last_view_msg_id = JM.data.chatroom[nowChatroomID].last_view_msg_id;

            if ($("#msg" + last_view_msg_id).length != 0) {
                var headerHeight = $("#viewChatroom .page-header").height();
                var footerHeight = $("#viewChatroom .ui-header").height();
                var msgHeight = $("#msg" + last_view_msg_id).height();
                var scrollPageTop = $("#msg" + last_view_msg_id).offset().top - ($(window).height() - headerHeight - footerHeight);

                if (device.platform === "iOS") {
                    scrollPageTop -= 20;
                }

                $('html, body').animate({
                    scrollTop: scrollPageTop
                }, 0, function() {
                    window.addEventListener("scroll", msgListViewScroll);
                });

            }

        }

        function resizeImage(imgID, width, height) {

            var adjustHeight;

            if (width >= height) {
                //horizontal
                $("#" + imgID).parent().removeClass("img img-vertical");
                var maxWidth = parseInt(document.documentElement.clientWidth * 53.558 / 100, 10);

                if (width > maxWidth) {
                    var newWidth = maxWidth;
                    var newHeight = height * (maxWidth / width);

                    $("#" + imgID).css({
                        width: newWidth + "px",
                        height: newHeight + "px"
                    });

                    adjustHeight = newHeight;
                } else {
                    adjustHeight = height;
                }
            } else if (width < height) {
                //vertical
                $("#" + imgID).parent().removeClass("img img-horizontal");
                var maxHeight = parseInt(document.documentElement.clientWidth * 53.558 / 100, 10);

                if (height > maxHeight) {
                    var newHeight = maxHeight;
                    var newWidth = width * (maxHeight / height);

                    $("#" + imgID).css({
                        width: newWidth + "px",
                        height: newHeight + "px"
                    });

                    adjustHeight = newHeight;
                } else {
                    adjustHeight = height;
                }
            }

            $("#" + imgID).parent().css("height", adjustHeight + "px");
            $("#" + imgID).parent().parent().css("height", adjustHeight + "px");
        }

        function checkImageDownload(msgID) {
            for (var i=0; i<JM.data.chatroom_message_history[nowChatroomID].length; i++) {

                var checkID = "msg" + JM.data.chatroom_message_history[nowChatroomID][i].source + JM.data.chatroom_message_history[nowChatroomID][i].id;

                if (msgID == checkID) {
                    if (!JM.data.chatroom_message_history[nowChatroomID][i].get_download) {
                        downloadOriginalImage(msgID);
                    } else {

                        //Check the image exist in JM or QPlay
                        if (JM.data.chatroom_message_history[nowChatroomID][i].source === "JM") {
                            var imagePath = JM.data.chatroom_message_history[nowChatroomID][i].thumbPath;
                        } else if (JM.data.chatroom_message_history[nowChatroomID][i].source === "QPlay") {
                            var imagePath = JM.data.chatroom_message_history[nowChatroomID][i].originalPath;
                        }

                        tempImage(imagePath, "download");
                    }
                    break;
                }
            }
        }

        function downloadOriginalImage(msgID) {
            (function(msgID) {

                var JMessageID = msgID.substr(5);

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("==========downloadOriginalImage success");
                        console.log(data);

                        //if the image msg in messageListView doesn't show up correctly,
                        //update the src of img
                        if ($("#" + nowChatroomID + "-JM" + JMessageID).prop("src").length == 0) {
                            $("#" + nowChatroomID + "-JM" + JMessageID).prop("src", data.filePath);
                        }

                        for (var i=0; i<JM.data.chatroom_message_history[nowChatroomID].length; i++) {

                            var checkID = "msg" + JM.data.chatroom_message_history[nowChatroomID][i].source + JM.data.chatroom_message_history[nowChatroomID][i].id;

                            if (msgID == checkID) {
                                var downloadTime = new Date();
                                var downloadTimeStamp = downloadTime.TimeStamp();

                                JM.data.chatroom_message_history[nowChatroomID][i].thumbPath = data.filePath;
                                JM.data.chatroom_message_history[nowChatroomID][i].download_time = downloadTimeStamp;
                                JM.data.chatroom_message_history[nowChatroomID][i].get_download = true;
                                JM.updateLocalStorage();

                                tempImage(JM.data.chatroom_message_history[nowChatroomID][i].thumbPath, "download");
                                break;
                            }
                        }
                    }

                };

                JM.Message.downloadOriginalImage(nowChatroomID, JMessageID, callback);

            }(msgID));
        }

        function exitGroup() {
            JM.Chatroom.exitGroup(function(status, data) {
                delete JM.data.chatroom[nowChatroomID];
                JM.updateLocalStorage();
            });
        }

        function cameraButtonSet(action) {

            if (action === "open") {
                $(".chatroom-footer .center").animate({
                    width: "54vw"
                }, 300);

                $(".chatroom-footer .camera-open").animate({
                    left: "27.556vw",
                    opacity: 0
                }, 150, function() {
                    $(this).hide();
                });

                $(".chatroom-footer .camera-button-content").animate({
                    left: 0,
                    opacity: 1
                }, 300, function() {
                    $(".chatroom-footer .camera-button-content").css("position", "relative");
                });
            } else if (action === "close") {
                $(".chatroom-footer .center").css("width", "66vw");

                $(".chatroom-footer .camera-button-content").css({
                    position: "absolute",
                    left: "-27.556vw",
                    opacity: 0
                });

                $(".chatroom-footer .camera-open").css({
                    left: 0,
                    opacity: 1,
                    display: "block"
                });

                $(".chatroom-action").slideUp(10);
            }

        }

        /********************************** page event *************************************/
        $("#viewChatroom").on("pagebeforeshow", function(event, ui) {
            cameraButtonSet("close");
            $(".message-preview").hide();
        });

        $("#viewChatroom").on("pageshow", function(event, ui) {

            prevPageID = "viewChatroom";

            nowChatroomID = JM.chatroomID;
            newCreate = false;
            lastRenderJMMsgID = 0;
            lastRenderQPlayMsgID = 0;
            msgDateText = "";

            $("#viewChatroomContent .msg").remove();

            //Chatroom Title
            //if new create chatroom, the JM.data.chatroom[JM.chatroomID] is empty
            if (JM.data.chatroom[nowChatroomID] === undefined) {
                newCreate = true;

                //Send default first message
                window.sendTextMessage(nowChatroomID, loginData["loginid"] + "  建立聊天室", true, "newChatroom");
            } else {
                window.chatroomTitle();

                //JMessage - getHistoryMessages
                getHistoryMessages();
            }

            //JMessage - enter conversation
            JM.Chatroom.enterConversation(nowChatroomID);
        });

        /********************************** dom event *************************************/

        //Chatroom Action
        $(document).on({
            click: function() {
                window.removeEventListener("scroll", msgListViewScroll);
                $.mobile.changePage('#viewIndex');
            }
        }, "#backIndexChatroom");

        $(document).on({
            click: function() {
                $(".chatroom-action").slideToggle(150);
            }
        }, "#chatroomAction");

        $(document).on({
            click: function() {
                if (JM.data.chatroom[nowChatroomID].is_group) {
                    JM.chatroomID = nowChatroomID;
                    $.mobile.changePage('#viewChatroomInfo');
                } else {
                    var otherMember = "";

                    for (var i=0; i<JM.data.chatroom[nowChatroomID].member.length; i++) {
                        if (JM.data.chatroom[nowChatroomID].member[i].username != loginData["loginid"]) {
                            otherMember = JM.data.chatroom[nowChatroomID].member[i].username;
                        }
                    }

                    window.personalPopup(otherMember);
                }
            }
        }, ".chatroom-info");

        //Send Text
        $(document).on({
            click: function() {

                if ($("#msgText").val().length > 0) {
                    window.sendTextMessage(nowChatroomID, $("#msgText").val());
                    $("#msgText").val("");
                }

            }
        }, "#msgButton");

        //Send Image
        $(document).on({
            click: function() {
                cameraButtonSet("open");
            }
        }, "#cameraButton");

        $(document).on({
            click: function() {
                CameraPlugin.openFilePicker("CAMERA", tempImage);
            }
        }, "#photoCamera");

        $(document).on({
            click: function() {
                CameraPlugin.openFilePicker("PHOTOLIBRARY", tempImage);
            }
        }, "#photoLibrary");

        //Click img, download original image
        $(document).on({
            click: function() {
                var msgID = $(this).parents(".msg").prop("id");
                checkImageDownload(msgID);
            }
        }, ".img");

        //Hide message-preview when scrolling page
        $(window).scroll(function() {

            if($(window).scrollTop() + $(window).height() + $("#viewChatroom .ui-footer").height() >= $(document).height()) {
                $(".message-preview").html("");
                $(".message-preview").hide();
            }

            footerFixed();
        });

        //Remember which message id has been viewed
        window.msgListViewScroll = function() {
 
            $("#viewChatroomContent .msg").each(function(index, el) {
                if ($(el).prop("id").length !== 0) {

                    var last_view_msg_id = getMsgNumber(JM.data.chatroom[nowChatroomID].last_view_msg_id);
                    var ID = $(el).prop("id").substr(3);
                    var IDNumber = getMsgNumber(ID);

                    if (parseInt(IDNumber, 10) <= parseInt(last_view_msg_id, 10)) {
                        return;
                    }

                    var footerHeight = $("#viewChatroom .ui-header").height();
                    var rect = el.getBoundingClientRect();
                    if (
                        (rect.top + footerHeight) >= 0 &&
                        rect.left >= 0 &&
                        (rect.bottom + footerHeight) <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    ) {
                        JM.data.chatroom[nowChatroomID].last_view_msg_id = ID;
                        return false;
                    }

                }
            });

        };

        function getMsgNumber(ID) {
            if (ID.indexOf("JM") != -1) {
                return ID.substr(2);
            } else if (ID.indexOf("QPlay") != -1) {
                return ID.substr(5);
            }
        }
    }
});
