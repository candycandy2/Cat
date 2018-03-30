
//JMessage-phonegap-plugin
var JM = {
    key: "",
    friendID: "",
    chatroomID: "",
    newCreate: false,
    data: {},
    init: function(JMAppKey, sendPushToken) {

        window.JMessage.setDebugMode({ enable: true });

        //Update JMessaage APP Key
        JM.key = JMAppKey;

        //Process local storage
        if (window.localStorage.getItem("JMData") !== null) {
            var tempDate = window.localStorage.getItem("JMData");
            JM.data = JSON.parse(tempDate);
        }

        if (JM.data.chatroom === undefined) {
            JM.data.chatroom = {};
        }

        if (JM.data.chatroom_sequence === undefined) {
            JM.data.chatroom_sequence = [];
        }

        if (JM.data.chatroom_message_history === undefined) {
            JM.data.chatroom_message_history = {};
        }

        if (JM.data.chatroom_user === undefined) {
            JM.data.chatroom_user = {};
        }

        if (JM.data.chatroom_friend === undefined) {
            JM.data.chatroom_friend = [];
        }

        if (JM.data.chatroom_invite === undefined) {
            JM.data.chatroom_invite = [];
        }

        window.MessageSendingOptions = {
          /**
           * 接收方是否针对此次消息发送展示通知栏通知。
           * @type {boolean}
           * @defaultvalue
           */
          isShowNotification: true,
          /**
           * 是否让后台在对方不在线时保存这条离线消息，等到对方上线后再推送给对方。
           * @type {boolean}
           * @defaultvalue
           */
          isRetainOffline: true,
          /**
           * 是否开启了自定义接收方通知栏功能。
           * @type {?boolean}
           */
          isCustomNotificationEnabled: false,
          /**
           * 设置此条消息在接收方通知栏所展示通知的标题。
           * @type {?string}
           */
          notificationTitle: "DarrenTitle",
          /**
           * 设置此条消息在接收方通知栏所展示通知的内容。
           * @type {?string}
           */
          notificationText: "Darren content"
        };

        console.log("----initial");

        var params = {
            'isOpenMessageRoaming': true
        };

        window.JMessage.init(params);

        setTimeout(function(){
            JM.login(sendPushToken);
            //JM.logout();
        }, 2000);

    },
    bindEvent: function(receiveMessage, clickMessageNotification, syncOfflineMessage, loginStateChanged, syncRoamingMessage) {
        window.JMessage.addReceiveMessageListener(function (data) {
            console.log("----addReceiveMessageListener");
            receiveMessage(data);
        });

        window.JMessage.addClickMessageNotificationListener(function (data) {
            console.log("----addClickMessageNotificationListener");
            clickMessageNotification(data);
        });

        window.JMessage.addSyncOfflineMessageListener(function (data) {
            console.log("----addSyncOfflineMessageListener");
            syncOfflineMessage(data);
        });

        window.JMessage.addLoginStateChangedListener(function (data) {
            console.log("----addLoginStateChangedListener");
            loginStateChanged(data);
        });

        window.JMessage.addSyncRoamingMessageListener(function (data) {
            console.log("----addSyncRoamingMessageListener");
            syncRoamingMessage(data);
        });
    },
    updateLocalStorage: function() {
        window.localStorage.setItem("JMData", JSON.stringify(JM.data));
    },
    register: function(id, pwd, callback) {

        var params = {
            'username': id,
            'password': pwd
        };

        window.JMessage.register(params, function(data) {
            console.log("----register success");
            console.log(data);
            callback(data);
        }, function(errorStr) {
            console.log("----register Error");
            console.log(errorStr);
        });
    },
    login: function(callback) {

        var params = {
            'username': loginData["loginid"],
            'password': jmessagePWD
        };

        window.JMessage.login(params, function(data) {
            console.log("----login success");
            console.log(data);
            callback();

        }, function(errorStr) {
            console.log("----login Error");
            console.log(errorStr);
        });

    },
    logout: function() {
        window.JMessage.logout();
    },
    getRegistrationID: function() {
        window.plugins.jPushPlugin.getRegistrationID(function(data) {
            console.log(data);
        });
    },
    User: {
        getMyInfo: function() {

            window.JMessage.getMyInfo(function(data) {
                console.log("---getMyInfo success");
                console.log(data);
            }, function(errorStr) {
                console.log("----getMyInfo Error");
                console.log(errorStr);
            });

        },
        getUserInfo: function(userID, callback) {

            var params = {
                'username': userID,
                'appKey': JM.key
            };

            window.JMessage.getUserInfo(params, function(data) {
                console.log("---getUserInfo success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getUserInfo Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        updateMyAvatar: function(imgPath, callback) {

            var params = {
                'imgPath': imgPath
            };

            window.JMessage.updateMyAvatar(params, function(data) {
                console.log("---updateMyAvatar success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----updateMyAvatar Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        downloadOriginalUserAvatar: function(userID, callback) {

            var params = {
                'username': userID,
                'appKey': JM.key
            };

            window.JMessage.downloadOriginalUserAvatar(params, function(data) {
                console.log("---downloadOriginalUserAvatar success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----downloadOriginalUserAvatar Error");
                console.log(errorStr);

                //For iOS, this API occur 860021 error when first call it, even though the init/login all success.
                //So, do it again, only this way can get correct data.
                if (device.platform === "iOS") {
                    if (errorStr.code == 860021) {
                        JM.User.downloadOriginalUserAvatar(userID, callback);
                    }
                } else {
                    callback("error", errorStr);
                }

            });

        }
    },
    Chatroom: {
        createGroup: function(name, desc, nameArray) {
            //After success, then call API addGroupMembers.
            //The 2 Steps success, then call QPlay API NewQChatroom.

            (function(name, desc, nameArray) {

                //Max length of name is 32 in JMessage DB
                var params = {
                    'name': name.substr(0, 31),
                    'desc': desc
                };

                window.JMessage.createGroup(params, function(groupId){
                    console.log("---createGroup success");
                    console.log(groupId);
                    var group_id = groupId;

                    var callback = function(status) {
                        if (status === "success") {
                            window.newQChatroom(group_id, name, desc, nameArray);
                        }
                    };

                    JM.Chatroom.addGroupMembers(groupId, nameArray, callback);
                }, function(errorStr) {
                    console.log("----createGroup Error");
                });

            }(name, desc, nameArray));

        },
        getGroupIds: function(callback) {

            window.JMessage.getGroupIds(function(data) {
                console.log("---getGroupIds success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getGroupIds Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        getGroupInfo: function(groupID, callback) {

            var params = {
                'id': groupID.toString()
            };

            window.JMessage.getGroupInfo(params, function(data) {
                console.log("---getGroupInfo success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getGroupInfo Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        getGroupMembers: function(groupID, callback) {

            var params = {
                'id': groupID.toString()
            };

            window.JMessage.getGroupMembers(params, function(data) {
                console.log("---getGroupMembers success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getGroupMembers Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        exitGroup: function(groupID, callback) {

            var params = {
                'id': groupID.toString()
            };

            window.JMessage.exitGroup(params, function(data) {
                console.log("---exitGroup success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----exitGroup Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        enterConversation: function(chatroomID) {
            console.log("---enterConversation");

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'username': loginData["loginid"],
                'appKey': "f1007b6d14755a1e17e74195"
            };

            window.JMessage.enterConversation(params, function(data) {
                //success won't return anything
                console.log("----enterConversation Success");
                console.log(data);
            }, function(errorStr) {
                console.log("----enterConversation Error");
                console.log(errorStr);
            });

        },
        exitConversation: function(chatroomID) {
            console.log("---exitConversation");

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'appKey': JM.key
            };

            window.JMessage.exitConversation(params, function(data) {
                console.log("---exitConversation success");
                console.log(data);
            }, function(errorStr) {
                console.log("----exitConversation Error");
                console.log(errorStr);
            });

        },
        getConversation: function(chatroomID, callback) {
            console.log("@@@@@@getConversation-single");

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'username': loginData["loginid"],
                'appKey': JM.key
            };

            window.JMessage.getConversation(params, function(data) {
                console.log("---getConversation success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getConversation Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        getConversations: function(callback) {
            console.log("@@@@@@getConversations");

            window.JMessage.getConversations(function(data) {
                console.log("---getConversations success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getConversations Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        resetUnreadMessageCount: function(chatroomID) {

            var params = {
                'type': "group",
                'groupId': chatroomID.toString()
            };

            window.JMessage.resetUnreadMessageCount(params, function(data) {
                console.log("---resetUnreadMessageCount success");
                console.log(data);
            }, function(errorStr) {
                console.log("----resetUnreadMessageCount Error");
                console.log(errorStr);
            });

        },
        addGroupMembers: function(groupID, memberArray, callback) {

            var params = {
                'id': groupID.toString(),
                'usernameArray': memberArray,
                'appKey': JM.key
            };

            window.JMessage.addGroupMembers(params, function(data) {
                console.log("---addGroupMembers success");
                console.log(data);
                callback("success", callback);
            }, function(errorStr) {
                console.log("----addGroupMembers Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        removeGroupMembers: function(groupID, memberArray, callback) {

            var params = {
                'id': groupID.toString(),
                'usernameArray': memberArray,
                'appKey': JM.key
            };

            window.JMessage.removeGroupMembers(params, function(data) {
                console.log("---removeGroupMembers success");
                console.log(data);
                callback("success");
            }, function(errorStr) {
                console.log("----removeGroupMembers Error");
                console.log(errorStr);
            });

        },
        updateGroupInfo: function(groupID, newName, newDesc, callback) {

            var params = {
                'id': groupID.toString(),
                'newName': newName,
                'newDesc': newDesc
            };

            window.JMessage.updateGroupInfo(params, function(data) {
                console.log("---updateGroupInfo success");
                console.log(data);
                callback("success");
            }, function(errorStr) {
                console.log("----updateGroupInfo Error");
                console.log(errorStr);
                callback("error");
            });

        }
    },
    Message: {
        getHistoryMessages: function(chatroomID, from, limit, callback) {
            console.log("@@@@@@@getHistoryMessages");

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'from': from,
                'limit': limit
            };

            window.JMessage.getHistoryMessages(params, function(data) {
                console.log("---getHistoryMessages success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----getHistoryMessages Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        sendTextMessage: function(chatroomID, text, callback, event, action) {
            event = event || false;
            action = action || "";

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'text': text,
                'extras': {
                    chatroom_id: chatroomID.toString(),
                    event: event.toString(),
                    action: action
                },
                'messageSendingOptions': MessageSendingOptions
            };

            window.JMessage.sendTextMessage(params, function(data) {
                console.log("---sendTextMessage success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----sendTextMessage Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        sendImageMessage: function(chatroomID, imgPath, callback, event, action) {
            event = event || false;
            action = action || "";

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'path': imgPath,
                'extras': {
                    chatroom_id: chatroomID.toString(),
                    event: event.toString(),
                    action: action
                },
                'messageSendingOptions': MessageSendingOptions
            };

            window.JMessage.sendImageMessage(params, function(data) {
                console.log("---sendImageMessage success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----sendImageMessage Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        },
        downloadOriginalImage: function(chatroomID, msgID, callback) {

            var params = {
                'type': "group",
                'groupId': chatroomID.toString(),
                'username': loginData["loginid"],
                'appKey': JM.key,
                'messageId': msgID
            };

            window.JMessage.downloadOriginalImage(params, function(data) {
                console.log("---downloadOriginalImage success");
                console.log(data);
                callback("success", data);
            }, function(errorStr) {
                console.log("----downloadOriginalImage Error");
                console.log(errorStr);
                callback("error", errorStr);
            });

        }
    }
};
