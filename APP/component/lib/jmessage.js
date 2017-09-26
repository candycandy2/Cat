
var JM = {
    key: "",
    secret: "",
    base64AuthString: "",
    userPWD: "",
    friendID: "",
    chatroomID: "",
    bindEvent: function() {

        /*--------------------------------------------------------------------------*/
        /*--------------------------------- JPush ----------------------------------*/
        /*--------------------------------------------------------------------------*/
        document.addEventListener("jpush.openNotification", function (event) {
            console.log("----openNotification");
            console.log(event);
        }, false);

        document.addEventListener("jpush.receiveNotification", function (event) {
            console.log("----receiveNotification");
            console.log(event);
        }, false);

        document.addEventListener("jpush.receiveMessage", function (event) {
            console.log("----receiveMessage");
            console.log(event);
        }, false);

        /*--------------------------------------------------------------------------*/
        /*-------------------------------- JMessage --------------------------------*/
        /*--------------------------------------------------------------------------*/
        document.addEventListener('jmessage.onSyncOfflineMessage', function (data) {
            console.log("----onSyncOfflineMessage");
            console.log(data);
        }, false);

        document.addEventListener('jmessage.onConversationChanged', function (data) {
            console.log("----onConversationChanged");
            console.log(data);

            JM.Message.onConversationChanged();
        }, false);

        document.addEventListener('jmessage.onUnreadChanged', function (data) {
            console.log("----onUnreadChanged");
            console.log(data);
        }, false);

        document.addEventListener('jmessage.onGroupInfoChanged', function (data) {
            console.log("----onGroupInfoChanged");
            console.log(data);
        }, false);

        document.addEventListener('jmessage.onReceiveMessage', function (data) {
            console.log("----onReceiveMessage");
            console.log(data);

            if (data.contentType === "5") {
                if (data.content.msg_body.eventType === 8) {
                    //Create Group
                } else if (data.content.msg_body.eventType === 9) {
                    //Leave form Group (Other Group Member left)
                } else if (data.content.msg_body.eventType === 10) {
                    //Receive Add Member to Group by Others
                    JM.Chatroom.myGroupArray();
                } else if (data.content.msg_body.eventType === 11) {
                    //Receive Remove Member from Group by Others
                    JM.Chatroom.myGroupArray();
                } else if (data.content.msg_body.eventType === 12) {
                    //Update Group Info
                }
            } else {
                JM.Message.onReceiveMessage();    
            }

        }, false);

        document.addEventListener('jmessage.onSendMessage', function (data) {
            console.log("----onSendMessage");
            console.log(data);

            JM.Message.onSendMessage();
        }, false);

        document.addEventListener('jmessage.onReceiveImageData', function (data) {
            console.log("----onReceiveImageData");
            console.log(data);
        }, false);

        document.addEventListener('jmessage.onReceiveNotificationEvent', function (data) {
            console.log("----onReceiveNotificationEvent");
            console.log(data);

            console.log(data.eventType);

            if (data.eventType === "1") {
                // Login Kicked
            } else if (data.eventType === "6") {
                //Friend Removed by others
                JM.Friend.receiveRemoveFriend();
            } else if (data.eventType === "51") {
                //Receive Friend Invitation
                JM.Friend.receiveFriendInvitation(data);
            } else if (data.eventType === "52") {
                //Accepted Friend Invitation
                JM.Friend.receiveAcceptFriendInvitation(data);
            } else if (data.eventType === "53") {
                //Declined Friend Invitation
                JM.Friend.receiveDeclineFriendInvitation(data);
            }

        }, false);

    },
    initial: function() {
        //define the JMessage APP Key: QPlay or QChat
        if (typeof QChatJPushAppKey === "undefined") {
            if (typeof window.ENSJPushAppKey === "undefined") {
                JM.key = QMessageKey;
                JM.secret = QMessageSecretKey;
            } else {
                JM.key = window.ENSJPushAppKey;
                JM.secret = window.ENSJPushSecretKey;
            }
        } else {
            JM.key = QChatJPushAppKey;
            JM.secret = QChatJPushSecretKey;
        }

        //For Rest-API, HTTP Header Setting: Authorization
        var words = CryptoJS.enc.Utf8.parse(JM.key + ":" + JM.secret);
        JM.base64AuthString = CryptoJS.enc.Base64.stringify(words);

        JM.getPWD();
    },
    getPWD: function() {
        $.ajax({
            url: "http://qplaydev.benq.com/qmessage/public/v101/qmessage/pwd",
            dataType: "json",
            type: "POST",
            async: false,
            contentType: "application/json",
            data: JSON.stringify({ "username": loginData["loginid"] }),
            success: function(data) {
                var resultcode = data['ResultCode'];

                if (resultcode === 1) {
                    JM.userPWD = data['Content'];
                    JM.login();
                }
            },
            error: function() {

            }
        });
    },
    register: function() {

        window.JMessage.register(loginData["loginid"], JM.userPWD, function(data) {
            console.log("----register success");
            console.log(data);
        }, function(errorStr) {
            console.log("----register Error");
            console.log(errorStr);
            console.log(errorStr.errorDscription);
        });
    },
    login: function() {console.log("=========login==========");
        window.JMessage.login(loginData["loginid"], JM.userPWD, function(data) {
            console.log("----login success");
            console.log(data);

            //JM.initial();
            //JM.User.updateMyInfo();
            
            JM.User.getMyInfo();
            JM.User.getUserInfo(loginData["loginid"]);
            JM.Chatroom.getAllGroupConversation();
            JM.Friend.getFriendList();
            JM.Chatroom.myGroupArray();

            //JM.Friend.updateFriendNoteName("Darren.K.Ti", "DarrenTest123");

        }, function(errorStr) {
            console.log("----login Error");
            console.log(errorStr);

            JM.register();
        });
    },
    logout: function() {
        window.JMessage.logout(function(data) {
            console.log("----logout success");
            console.log(data);
        }, function(errorStr) {
            console.log("----logout Error");
            console.log(errorStr);
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
        getUserInfo: function(userID) {
            window.JMessage.getUserInfo(userID, JM.key, function(data) {
                console.log("---getUserInfo success");
                console.log(data);
                /*
                if (userID === loginData["loginid"]) {
                    var content = '<li><a href="#">Username: ' + data.username + '</a></li>';
                    content += '<li><a href="#">Signature: ' + data.signature + '</a></li>';

                    $("#myinfoListView").append(content);
                    $("#myinfoListView").listview("refresh");
                }
                */
            }, function(errorStr) {
                console.log("----getUserInfo Error");
                console.log(errorStr);
            });
        },
        updateMyInfo: function() {
            window.JMessage.updateMyInfo("nickname", loginData["loginid"], function(data) {
                console.log("---updateMyInfo success");
                console.log(data);
            }, function(errorStr) {
                console.log("----updateMyInfo Error");
                console.log(errorStr);
            });
        }
    },
    Friend: {
        getFriendList: function() {
            window.JMessage.getFriendList(function(data) {
                console.log("---getFriendList success");
                console.log(data);

                //No Friend
                /*
                if (data.length === 0) {
                    $("#friendListView").html("");
                } else {
                    var content = "";

                    for (var i=0; i<data.length; i++) {
                        content += '<li><a href="#' + data[i].username + '">' + data[i].username + '</a></li>';
                    }

                    $("#friendListView").append(content);
                    $("#friendListView").listview("refresh");
                }
                */

            }, function(errorStr) {
                console.log("----getFriendList Error");
                console.log(errorStr);
            });
        },
        sendInvitationRequest: function() {
            window.JMessage.sendInvitationRequest(JM.friendID, JM.key, "我想跟你成為朋友", function(data) {
                console.log("---sendInvitationRequest success");
                console.log(data);
            }, function(errorStr) {
                console.log("----sendInvitationRequest Error");
                console.log(errorStr);
            });
        },
        removeFromFriendList: function() {
            window.JMessage.removeFromFriendList(JM.friendID, JM.key, function(data) {
                console.log("---removeFromFriendList success");
                console.log(data);

                JM.Friend.getFriendList();
            }, function(errorStr) {
                console.log("----removeFromFriendList Error");
                console.log(errorStr);
            });
        },
        receiveFriendInvitation: function(data) {
            console.log("####----------@@@@----------receiveFriendInvitation");
            /*
            JM.friendID = data.username;
            $("#friendInvitePopup .username").html(JM.friendID);
            $("#friendInvitePopup").popup("open");
            */
        },
        acceptInvitation: function() {
            window.JMessage.acceptInvitation(JM.friendID, JM.key, function(data) {
                console.log("---acceptInvitation success");
                console.log(data);

                JM.Friend.getFriendList();
            }, function(errorStr) {
                console.log("----acceptInvitation Error");
                console.log(errorStr);
            });
        },
        receiveAcceptFriendInvitation: function(data) {
            console.log("####----------@@@@----------receiveAcceptFriendInvitation");
            console.log(data);
            /*
            JM.friendID = data.username;
            $("#acceptFriendInvitePopup .username").html(JM.friendID);
            $("#acceptFriendInvitePopup").popup("open");
            */
        },
        declineInvitation: function() {
            window.JMessage.declineInvitation(JM.friendID, JM.key, "不想跟你成為朋友", function(data) {
                console.log("---declineInvitation success");
                console.log(data);
            }, function(errorStr) {
                console.log("----declineInvitation Error");
                console.log(errorStr);
            });
        },
        receiveDeclineFriendInvitation: function(data) {
            console.log("####----------@@@@----------receiveDeclineFriendInvitation");
            console.log(data);
            /*
            JM.friendID = data.username;
            $("#declineFriendInvitePopup .username").html(JM.friendID);
            $("#declineFriendInvitePopup").popup("open");
            */
        },
        receiveRemoveFriend: function(data) {
            console.log("####----------@@@@----------receiveRemoveFriend");
            console.log(data);

            JM.Friend.getFriendList();
        },
        updateFriendNoteName: function(ID, tempName) {
            window.JMessage.updateFriendNoteName(ID, JM.key, tempName, function(data) {
                console.log("---updateFriendNoteName success");
                console.log(data);
            }, function(errorStr) {
                console.log("----updateFriendNoteName Error");
                console.log(errorStr);
            });
        }
    },
    Chatroom: {
        createGroupIniOS: function() {
            var memberArr = [];

            window.JMessage.createGroupIniOS("Qchat標題", "Qchat描述", memberArr, function(data) {
                console.log("---createGroupIniOS success");
                console.log(data);

                JM.Chatroom.myGroupArray();
            }, function(errorStr) {
                console.log("----createGroupIniOS Error");
                console.log(errorStr);
            });
        },
        exitGroup: function(ID) {
            window.JMessage.exitGroup(JM.chatroomID, function(data) {
                console.log("---exitGroup success");
                console.log(data);

                JM.Chatroom.myGroupArray();
            }, function(errorStr) {
                console.log("----exitGroup Error");
                console.log(errorStr);
            });
        },
        getGroupInfo: function(groupID, dataType) {
            //window.JMessage.getGroupInfo(groupID, function(data) {
            window.JMessage.getGroupInfo(JM.chatroomID, function(data) {
                console.log("---getGroupInfo success");
                console.log(data);
                
                //console.log(data.desc);
                //console.log(data.gid);
                //console.log(data.name);
                //console.log(data.owner);
                /*
                if (dataType === "list") {
                    var name = data.name.substr(0, 10);
                    var content = '<li><a href="#' + data.gid + '">[' + name + '] (主人:' + data.owner + ')</a></li>';

                    $("#chatroomListView").append(content);
                    $("#chatroomListView").listview("refresh");
                } else if (dataType === "content") {
                    $("#chatroomDataPopup .name").html(data.name);
                    $("#chatroomDataPopup .desc").html(data.desc);
                    $("#chatroomDataPopup .owner").html(data.owner);
                }
                */
                JM.Chatroom.memberArray(JM.chatroomID);
            }, function(errorStr) {
                console.log("----getGroupInfo Error");
                console.log(errorStr);
            });
        },
        updateGroupInfo: function() {
            window.JMessage.updateGroupInfo(JM.chatroomID, "QChat標題111", "QChat描述111", function(data) {
                console.log("---updateGroupInfo success");
                console.log(data);
            }, function(errorStr) {
                console.log("----updateGroupInfo Error");
                console.log(errorStr);
            });
        },
        myGroupArray: function() {
            window.JMessage.myGroupArray(function(data) {
                console.log("---myGroupArray success");
                console.log(data);
                /*
                $("#chatroomListView").html("");

                //No Conversation
                if (data.length === 0) {
                    $("#testChatroom").show();
                } else {
                    $("#testChatroom").hide();
                    $("#chatroomListView").html("");

                    var aaa = "";
                    for (var i=0; i<data.length; i++) {
                        JM.Chatroom.getGroupInfo(data[i], "list");
                        aaa += data[i] + ",";
                    }
                }
                console.log(aaa);
                */

            }, function(errorStr) {
                console.log("----myGroupArray Error");
                console.log(errorStr);
            });
        },
        memberArray: function(chatroomIDNum) {
            console.log("&&&&&&&&&&&memberArray");

            if (device.platform === "iOS") {
                window.JMessage.memberArray(chatroomIDNum.toString(), function(data) {
                    console.log("---memberArray success");
                    console.log(data);
                    /*
                    $("#chatroomMemberPopup .list").html("");

                    var content = "";
                    for (var i=0; i<data.length; i++) {
                        var friend = "";

                        if (data[i].isFriend === "1") {
                            friend = "[朋友]";
                        }

                        content += '<div>' + data[i].username + friend + '</div>';
                    }

                    $("#chatroomMemberPopup .list").append(content);
                    */
                }, function(errorStr) {
                    console.log("----memberArray Error");
                    console.log(errorStr);
                });
            }

            if (device.platform === "Android") {
                window.JMessage.getGroupMembers(chatroomIDNum, function(data) {
                    console.log("---getGroupMembers success");
                    console.log(data);
                }, function(errorStr) {
                    console.log("----getGroupMembers Error");
                    console.log(errorStr);
                });
            }
        },
        addMembers: function() {
            var memberArr = [JM.friendID];

            window.JMessage.addMembers(JM.chatroomID, memberArr, function(data) {
                console.log("---addMembers success");
                console.log(data);
            }, function(errorStr) {
                console.log("----addMembers Error");
                console.log(errorStr);
            });
        },
        removeMembers: function() {
            var memberArr = [JM.friendID];

            window.JMessage.removeMembers(JM.chatroomID, memberArr, function(data) {
                console.log("---removeMembers success");
                console.log(data);
            }, function(errorStr) {
                console.log("----removeMembers Error");
                console.log(errorStr);
            });
        },
        getAllGroupConversation: function() {
            window.JMessage.getAllGroupConversation(function(data) {
                console.log("---getAllGroupConversation success");
                console.log(data);

                if (device.platform === "iOS") {
                    //No Conversation
                    if (data.length === 0) {
                        //$("#chatroomListView").html("");
                        //$("#testChatroom").show();
                    } else {
                        //$("#testChatroom").hide();

                        var content = "";
                        for (var i=0; i<data.length; i++) {
                            //JM.Chatroom.getGroupInfo(data[i].gid);
                            content += data[i].gid + ",";
                        }
                        //console.log(content);
                    }
                }

                if (device.platform === "Android") {

                }

            }, function(errorStr) {
                console.log("----getAllGroupConversation Error");
                console.log(errorStr);
            });
        },
        clearGroupUnreadCount: function() {
            window.JMessage.clearGroupUnreadCount(JM.chatroomID, function(data) {
                console.log("---clearGroupUnreadCount success");
                console.log(data);
            }, function(errorStr) {
                console.log("----clearGroupUnreadCount Error");
                console.log(errorStr);
            });
        }
    },
    Message: {
        getGroupConversationHistoryMessage: function(callback, msgData) {
            callback = callback || null;
            msgData = msgData || null;

            if (appKeyOriginal === "appens") {

                //https://report.im.jpush.cn/v2/groups/23164459/messages
                //?count=500&begin_time=2017-07-14 10:10:10&end_time=2017-07-14 16:10:12
                console.log("============@@@@@@@@@@ RESTFul messages");

                //REST API messages, can only get 7 days of data
                var nowDateTime = new Date();
                //Add the minutes of time-range
                var newDateTime = new Date(nowDateTime.getTime() + 1*60000);

                var nowYYYYMMDD = newDateTime.yyyymmdd("-");
                var nowHHMM = newDateTime.hhmm(":");
                newDateTime.setDate(newDateTime.getDate() - 7);
                var sevenDaysAgoYYYYMMDD = newDateTime.yyyymmdd("-");

                var beginTime = sevenDaysAgoYYYYMMDD + " " + nowHHMM + ":00";
                var endTime = nowYYYYMMDD + " " + nowHHMM + ":00";

                $.ajax({
                    url: "https://report.im.jpush.cn/v2/groups/" + JM.chatroomID + "/messages?count=1000&begin_time=" + beginTime + "&end_time=" + endTime,
                    headers: {
                        'Content-Type': 'application/json;',
                        'Authorization': 'Basic ' + JM.base64AuthString
                    },
                    dataType: "json",
                    type: "GET",
                    success: function(data) {
                        console.log("---RESTFul messages success");
                        console.log(data);

                        if (typeof callback === "function") {
                            /*
                            if (msgData === null) {
                                callback("group", data);
                            } else {
                                callback("single", msgData);
                            }
                            */
                            callback("group", data);
                        }
                    },
                    error: function(data) {
                        console.log("---RESTFul messages error");
                        console.log(data);
                    }
                });

            }

            if (appKeyOriginal === "appqchat") {
                /*
                //For QChat
                var activePage = $.mobile.pageContainer.pagecontainer("getActivePage");
                var activePageID = activePage[0].id;

                if (activePageID !== "viewChatroom") {
                    return;
                }
                */

                if (device.platform === "iOS") {
                    var from = null;
                    var limit = null;

                    window.JMessage.getGroupConversationHistoryMessage(JM.chatroomID, from, limit, function(data) {
                        console.log(JM.chatroomID);
                        console.log(typeof JM.chatroomID);
                        console.log("---getGroupConversationHistoryMessage success");
                        console.log(data);

                        //data.contentType <= ??

                        //data.contentType: "5"
                        //data.content.msg_body.eventType
                        //  8:  Group been created
                        //  10: Add member
                        //  11: Remove member

                        //data.contentType: "1"
                        //data.content.msg_type: text

                        //data.contentType: "2"
                        //data.content.msg_type: image

                        if (typeof callback === "function") {
                            callback(data);
                        }
                        /*
                        //For QChat
                        var content = "";
                        $("#messageListView").html("");

                        for (var i=(data.length - 1); i>=0; i--) {
                            if (data[i].contentType === "5") {

                                if (data[i].content.msg_body.eventType === 8) {
                                    content += '<li><a href="#">' + data[i].content.from_id + ' 建立了聊天室.</a></li>';
                                } else if (data[i].content.msg_body.eventType === 10) {
                                    console.log(data[i].content.msg_body.eventDesc);
                                    content += '<li><a href="#">' + data[i].content.from_id + ' 新增了成員.</a></li>';
                                } else if (data[i].content.msg_body.eventType === 11) {
                                    console.log(data[i].content.msg_body.eventDesc);
                                    content += '<li><a href="#">' + data[i].content.from_id + ' 刪除了成員.</a></li>';
                                }

                            } else if (data[i].contentType === "1") {

                                if (data[i].content.msg_type === "text") {
                                    content += '<li><a href="#"><p>' + data[i].content.from_id + ': ' + data[i].content.msg_body.text + '</p>';
                                    content += '<p>(' + data[i].content.create_time + ')</p></a></li>';
                                }

                            } else if (data[i].contentType === "2") {

                                if (data[i].content.msg_type === "image") {
                                    //https://dl.im.jiguang.cn/
                                    //http://media.file.jpush.cn/
                                    content += '<li><a href="#"><p>' + data[i].content.from_id + ': <img src="http://media.file.jpush.cn/' + data[i].content.msg_body.media_id + '" width="100" height="100"></p>';
                                    content += '<p>(' + data[i].content.create_time + ')</p></a></li>';
                                }

                            }
                        }

                        $("#messageListView").append(content);
                        $("#messageListView").listview("refresh");
                        */

                    }, function(errorStr) {
                        console.log("----getGroupConversationHistoryMessage Error");
                        console.log(errorStr);
                    });
                }

                if (device.platform === "Android") {
                    window.JMessage.getAllMessages("group", JM.chatroomID, JM.key, function(data) {
                        console.log("---getAllMessages success");
                        console.log(data);
                    }, function(errorStr) {
                        console.log("----getAllMessages Error");
                        console.log(errorStr);
                    });

                    window.JMessage.getHistoryMessages("group", JM.chatroomID, JM.key, 0, 50, function(data) {
                        console.log("---getHistoryMessages success");
                        console.log(data);
                    }, function(errorStr) {
                        console.log("----getHistoryMessages Error");
                        console.log(errorStr);
                    });
                }
            }
        },
        sendGroupTextMessage: function(text, callback) {
            callback = callback || null;

            window.JMessage.sendGroupTextMessage(JM.chatroomID, text, function(data) {
                console.log("---sendGroupTextMessage success");
                console.log(data);

                if (device.platform === "iOS") {
                    //return data is object
                    console.log(data[0]);
                    var msgData = data[0];
                }

                if (device.platform === "Android") {
                    //return data is string
                    var msgData = data;
                }

                setTimeout(function() {
                    JM.Message.getGroupConversationHistoryMessage(callback, msgData);
                }, 6000);

            }, function(errorStr) {
                console.log("----sendGroupTextMessage Error");
                console.log(errorStr);
            });
        },
        sendGroupImageMessage: function(imgURL, callback) {
            callback = callback || null;
            console.log("----sendGroupImageMessage");
            console.log(imgURL);

            if (device.platform === "iOS") {
                var imageURL = imgURL.substr(7);
            }

            if (device.platform === "Android") {
                var imageURL = imgURL;
            }

            window.JMessage.sendGroupImageMessage(JM.chatroomID, imageURL, function(data) {
                console.log("---sendGroupImageMessage success");
                console.log(data);

                if (device.platform === "iOS") {
                    //return data is object
                    console.log(data[0]);
                    var msgData = data[0];
                }

                if (device.platform === "Android") {
                    //return data is string
                    var msgData = data;
                }

                //After sendGroupImageMessage succeed, if call API getGroupConversationHistoryMessage immediately,
                //JMessage cannot reutrn the URL of image, maybe JMessage need some time to process image.
                //So, call API getGroupConversationHistoryMessage after 6 seconds.
                setTimeout(function() {
                    JM.Message.getGroupConversationHistoryMessage(callback, msgData);
                }, 6000);

            }, function(errorStr) {
                console.log("----sendGroupImageMessage Error");
                console.log(errorStr);
            });
        },
        deleteGroupConversation: function() {
            window.JMessage.deleteGroupConversation(JM.chatroomID, function(data) {
                console.log("---deleteGroupConversation success");
                console.log(data);

                JM.Message.getGroupConversationHistoryMessage();
            }, function(errorStr) {
                console.log("----deleteGroupConversation Error");
                console.log(errorStr);
            });
        },
        onConversationChanged: function(data) {
            //JM.Message.getGroupConversationHistoryMessage();
        },
        onReceiveMessage: function(data) {
            //JM.Message.getGroupConversationHistoryMessage();
        },
        onSendMessage: function(data) {
            //JM.Message.getGroupConversationHistoryMessage();
        }
    }
};

JM.bindEvent();
