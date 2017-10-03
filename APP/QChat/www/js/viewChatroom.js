

$("#viewChatroom").pagecontainer({
    create: function(event, ui) {
        
        var newCreate;
        var lastRenderMsgID = 0;
        var msgDateText = "";
        var photoLocalPath = "";
        var sendMessage = false;
        var sendImgSuccess = false;
        var receiveMsg = false;

        /********************************** function *************************************/
        window.sendTextMessage = function(text, event, action) {
            event = event || false;
            action = action || "";

            (function(text, event, action) {

                var callback = function(status, data) {

                    if (status === "success") {
                        if (!event) {
                            sendMessage = true;
                            getConversation(true);
                        }
                    }

                };

                JM.Message.sendTextMessage(text, callback, event, action);

            }(text, event, action));
        };

        function sendImageMessage() {
            (function() {

                sendImgSuccess = false;
                imageDefaultMessage();

                var callback = function(status, data) {

                    if (status === "success") {
                        sendMessage = true;
                        getConversation(true);
                    } else {
                        //error case
                    }

                };

                JM.Message.sendImageMessage(photoLocalPath, callback);

            }());
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
                sendImageMessage();
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

        window.getConversation = function(getHistory, receiveMessage) {
            receiveMessage = receiveMessage || false;

            receiveMsg = receiveMessage;

            (function(getHistory, receiveMessage) {

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("----getConversation--success");
                        console.log(data);

                        window.processChatroomData(data, "getConversation", getHistory, receiveMessage);
                    }

                };

                JM.Chatroom.getConversation(callback);

            }(getHistory, receiveMessage));
        };

        window.processChatroomData = function(data, action, getHistory, receiveMessage) {

            console.log(data.conversationType);
            console.log(data.target);
            console.log(data.latestMessage);

            //Check if Chatroom data was exist
            var avatarPath;
            var avatarDownloadTime;
            var memberData;
            var lastViewMsgID = 0;

            if (JM.data.chatroom[data.target.id] !== undefined) {
                avatarPath = JM.data.chatroom[data.target.id].avatar_path;
                avatarDownloadTime = JM.data.chatroom[data.target.id].avatar_download_time;
                memberData = JM.data.chatroom[data.target.id].member;
                lastViewMsgID  = JM.data.chatroom[data.target.id].last_view_msg_id;
            } else {
                avatarPath = "";
                avatarDownloadTime = 0;
                memberData = [];               
            }

            if (data.target.desc.indexOf("=") != -1) {
                //Check if Chatroom is [1 to 1] or group
                var descArray = data.target.desc.split(";");

                var needHistory;
                var needHistoryArray = descArray[0].split("=");
                if (needHistoryArray[1] === "Y") {
                    needHistory = true;
                } else {
                    needHistory = false;
                }

                var groupMessage;
                var groupMessageArray = descArray[1].split("=");
                if (groupMessageArray[1] === "Y") {
                    groupMessage = true;
                } else {
                    groupMessage = false;
                }

                //message: text or image
                var messageContent = "";

                if (data.latestMessage.type === "text") {
                    messageContent = data.latestMessage.text;
                } else if (data.latestMessage.type === "image") {
                    messageContent = data.latestMessage.from.username + " 上傳了一張圖片";
                }

                var tempData = {
                    is_group: groupMessage,
                    name: data.target.name,
                    owner: data.target.owner,
                    unread_count: data.unreadCount,
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
                    last_view_msg_id: lastViewMsgID
                };

                JM.data.chatroom[data.target.id] = tempData;

                JM.updateLocalStorage();

                if (!receiveMessage) {
                    if (action === "getConversation") {
                        //If send message, no need to refresh group member
                        if (!sendMessage) {
                            window.getGroupMembers(data.target.id, groupMessage, "getConversation");
                        }
                    }

                    if (getHistory) {
                        getHistoryMessages();
                    }
                } else {
                    if (!getHistory) {
                        //viewIndex
                        chatroomSingleView(data.target.id);
                    } else {
                        //viewChatroom
                        getHistoryMessages();
                    }
                }
            }

        };

        window.chatroomTitle = function() {
            var chatroomName = JM.data.chatroom[JM.chatroomID].name;
            var memberLength = JM.data.chatroom[JM.chatroomID].member.length;

            $("#chatroomTitle").html(cutString(58.5, chatroomName, 4.39, "number", memberLength));
        };

        function getHistoryMessages() {
            (function() {

                if (JM.data.chatroom[JM.chatroomID] === undefined) {
                    //new create chatroom
                    var from = 1;
                    var limit = 0;
                } else {
                    //According to the retrun data from JMessage API-getConversations,
                    //decide the [from] & [limit]
                    var from = JM.data.chatroom[JM.chatroomID].last_message.id;
                    var limit = JM.data.chatroom[JM.chatroomID].unread_count;
                }

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("----getHistoryMessages--success");
                        console.log(data);

                        var msgIDArray = [];

                        if (JM.data.chatroom_message_history[JM.chatroomID] === undefined) {
                            JM.data.chatroom_message_history[JM.chatroomID] = [];
                        } else {
                            for (var i=0; i<JM.data.chatroom_message_history[JM.chatroomID].length; i++) {
                                msgIDArray.push(JM.data.chatroom_message_history[JM.chatroomID][i].id);
                            }
                        }

                        var lastMessageID = JM.data.chatroom[JM.chatroomID].last_message.id;

                        for (var i=data.length - 1; i>=0; i--) {

                            var pushData = false;

                            if (newCreate) {
                                if (data[i].id === lastMessageID) {
                                    pushData = true;
                                }
                            } else {
                                if (sendMessage) {
                                    if (data[i].id >= lastMessageID) {
                                        pushData = true;
                                    }
                                } else {
                                    if (msgIDArray.indexOf(data[i].id) == -1) {
                                        pushData = true;
                                    }
                                }
                            }

                            if (pushData) {

                                if (data[i].type === "text") {
                                    var tempData = {
                                        id: data[i].id,
                                        time: data[i].createTime,
                                        from: data[i].from.username,
                                        type: "text",
                                        text: data[i].text,
                                        extras: {
                                            event: data[i].extras.event,
                                            action: data[i].extras.action
                                        }
                                    };

                                    JM.data.chatroom_message_history[JM.chatroomID].push(tempData);
                                } else if (data[i].type === "image") {
                                    var tempData = {
                                        id: data[i].id,
                                        time: data[i].createTime,
                                        from: data[i].from.username,
                                        type: "image",
                                        thumbPath: data[i].thumbPath,
                                        get_download: false,
                                        download_time: null,
                                        extras: {
                                            event: data[i].extras.event,
                                            action: data[i].extras.action
                                        }
                                    };

                                    JM.data.chatroom_message_history[JM.chatroomID].push(tempData);
                                }

                            }
                        }

                        resetUnreadMessageCount();
                        JM.updateLocalStorage();
                        newCreate = false;
                        messageListView();
                        loadingMask("hide");
                    }

                };

                JM.Message.getHistoryMessages(from, limit, callback);

            }());
        }

        function resetUnreadMessageCount() {
            JM.Chatroom.resetUnreadMessageCount();
        }

        function messageListView() {

            var msgDateHTML = $("template#tplMsgDate").html();
            var msgEventTimeHTML = $("template#tplMsgEventTime").html();
            var msgTextRightHTML = $("template#tplMsgTextRight").html();
            var msgTextLeftHTML = $("template#tplMsgTextLeft").html();
            var msgImgRightHTML = $("template#tplMsgImgRight").html();
            var msgImgLeftHTML = $("template#tplMsgImgLeft").html();

            var owner = JM.data.chatroom[JM.chatroomID].owner;
            var lastSender = "";
            var lastMsg = "";

            $.each(JM.data.chatroom_message_history[JM.chatroomID], function(index, message) {

                //Set last_view_msg_id
                if (JM.data.chatroom[JM.chatroomID].last_view_msg_id == 0) {
                    if (message.type === "text") {
                        JM.data.chatroom[JM.chatroomID].last_view_msg_id = message.id;
                    }
                }

                //If msg has been render before, no need to render again
                if (message.id <= lastRenderMsgID) {
                    return;
                } else {
                    lastRenderMsgID = message.id;
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

                        if (message.extras.action === "newChatroom") {

                        }

                        var msgEventTime = $(msgEventTimeHTML);
                        msgEventTime.prop("id", "msg" + message.id);
                        msgEventTime.find(".msg-time").html(msgDatetime.hhmm());
                        msgEventTime.find(".text-event").html(message.text);
                        $("#viewChatroomContent").append(msgEventTime);

                    } else {

                        //normal text message
                        if (sender) {
                            var msgText = $(msgTextRightHTML);
                        } else {
                            var msgText = $(msgTextLeftHTML);
                            msgText.find(".name").html(message.from);
                        }

                        lastSender = message.from;
                        lastMsg = message.text;

                        msgText.prop("id", "msg" + message.id);
                        msgText.find(".time").html(msgDatetime.hhmm());
                        msgText.find(".text").html(message.text);
                        $("#viewChatroomContent").append(msgText);

                    }
                }

                //Image
                if (message.type === "image") {
                    var tagID = JM.chatroomID + "-" + message.id;

                    if (sender) {
                        var msgImg = $(msgImgRightHTML);
                    } else {
                        var msgImg = $(msgImgLeftHTML);
                        msgImg.find(".name").html(message.from);
                    }

                    lastSender = message.from;
                    lastMsg = "上傳了一張圖片";

                    msgImg.prop("id", "msg" + message.id);
                    msgImg.find(".time").html(msgDatetime.hhmm());
                    msgImg.find(".img").append('<img id="' + tagID + '" class="img">');
                    $("#viewChatroomContent").append(msgImg);

                    //Resize image & check if image is horizontal or vertical
                    $("#" + tagID).prop("src", message.thumbPath).one("load", function() {
                        resizeImage($(this).prop("id"), $(this).width(), $(this).height());
                    });
                }
            });

            //remove upload image loading temp view
            $("#uploadImgLoading").remove();
            cameraButtonSet("close");

            if (receiveMsg || sendMessage) {
                // [xxx create chatroom] don't show preview
                if (lastSender.length > 0) {
                    //addReceiveMessageListener event || sendTextMessage
                    $(".message-preview").html(cutString(85, lastSender + " : " + lastMsg, 3.349));
                    $(".message-preview").show();

                    receiveMsg = false;
                    sendMessage = false;
                }
            } else {
                $(".message-preview").hide();
            }

            //scroll to specific message id
            var last_view_msg_id = JM.data.chatroom[JM.chatroomID].last_view_msg_id;

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
            for (var i=0; i<JM.data.chatroom_message_history[JM.chatroomID].length; i++) {
                if (msgID == JM.data.chatroom_message_history[JM.chatroomID][i].id) {
                    if (!JM.data.chatroom_message_history[JM.chatroomID][i].get_download) {
                        downloadOriginalImage(msgID);
                    } else {
                        tempImage(JM.data.chatroom_message_history[JM.chatroomID][i].thumbPath, "download");
                    }
                    break;
                }
            }
        }

        function downloadOriginalImage(msgID) {
            (function(msgID) {

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("==========downloadOriginalImage success");
                        console.log(data);

                        for (var i=0; i<JM.data.chatroom_message_history[JM.chatroomID].length; i++) {
                            if (msgID == JM.data.chatroom_message_history[JM.chatroomID][i].id) {
                                var downloadTime = new Date();
                                var downloadTimeStamp = downloadTime.TimeStamp();

                                JM.data.chatroom_message_history[JM.chatroomID][i].thumbPath = data.filePath;
                                JM.data.chatroom_message_history[JM.chatroomID][i].download_time = downloadTimeStamp;
                                JM.data.chatroom_message_history[JM.chatroomID][i].get_download = true;

                                tempImage(JM.data.chatroom_message_history[JM.chatroomID][i].thumbPath, "download");
                                break;
                            }
                        }
                    }

                };

                JM.Message.downloadOriginalImage(msgID, callback);

            }(msgID));
        }

        function exitGroup() {
            JM.Chatroom.exitGroup(function(status, data) {
                delete JM.data.chatroom[JM.chatroomID];
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
            }

        }

        /********************************** page event *************************************/
        $("#viewChatroom").on("pagebeforeshow", function(event, ui) {
            cameraButtonSet("close");
        });

        $("#viewChatroom").on("pageshow", function(event, ui) {

            newCreate = false;
            lastRenderMsgID = 0;
            msgDateText = "";
            $("#viewChatroomContent .msg").remove();

            //Chatroom Title
            //if new create chatroom, the JM.data.chatroom[JM.chatroomID] is empty
            if (JM.data.chatroom[JM.chatroomID] === undefined) {
                newCreate = true;
                getConversation(false);
            } else {
                window.chatroomTitle();
            }

            //JMessage - enter conversation
            JM.Chatroom.enterConversation();

            //JMessage - getHistoryMessages
            getHistoryMessages();

        });

        /********************************** dom event *************************************/

        $(document).on({
            click: function() {
                window.removeEventListener("scroll", msgListViewScroll);
                $.mobile.changePage('#viewIndex');
            }
        }, "#backIndex");

        $(document).on({
            click: function() {
                exitGroup();
            }
        }, "#leaveChatroom");

        //Send Text
        $(document).on({
            click: function() {

                if ($("#msgText").val().length > 0) {
                    sendTextMessage($("#msgText").val());
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
                var msgID = $(this).parents(".msg").prop("id").substr(3);
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

                    var last_view_msg_id = JM.data.chatroom[JM.chatroomID].last_view_msg_id;
                    var ID = $(el).prop("id").substr(3);

                    if (parseInt(ID, 10) <= parseInt(last_view_msg_id, 10)) {
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
                        JM.data.chatroom[JM.chatroomID].last_view_msg_id = ID;
                        return false;
                    }

                }
            });

        };
    }
});
