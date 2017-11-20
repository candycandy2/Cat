

$("#viewChatroomInfo").pagecontainer({
    create: function(event, ui) {

        var removeMemberName;

        /********************************** function *************************************/
        window.processChatroomInfo = function() {

            $(".member-list-content .data-list").remove();
            $(".member-list-content .ui-hr").remove();

            //Chatroom name
            $("#viewChatroomInfoContent .chatroom-info-name").html(cutString(63, JM.data.chatroom[JM.chatroomID].name, 4.18, "number", JM.data.chatroom[JM.chatroomID].member.length));

            //check download time
            var nowDateTime = new Date();
            var nowTimestamp = nowDateTime.TimeStamp();

            //Member list
            $("#memberCount").html(JM.data.chatroom[JM.chatroomID].member.length);

            var memberName = [];
            for (var i=0; i<JM.data.chatroom[JM.chatroomID].member.length; i++) {
                memberName.push(JM.data.chatroom[JM.chatroomID].member[i].username);
            }

            memberName.sort();

            var memberDataHTML = $("template#tplMemberDataList").html();
            for (var i=0; i<memberName.length; i++) {
                //check if chatroom owner
                if (memberName[i] != JM.data.chatroom[JM.chatroomID].owner) {
                    var memberData = $(memberDataHTML);
                    memberData.prop("id", "chatroomMemberList" + (i+1));
                    memberData.find(".personal-name").html(memberName[i]);

                    //Only owner can remove member
                    if (loginData["loginid"] === JM.data.chatroom[JM.chatroomID].owner) {
                        memberData.find(".data-delete").removeClass("hide");
                        $(".auto-history-content").show();
                        $(".chatroom-leave").hide();
                    } else {
                        $(".auto-history-content").hide();
                        $(".chatroom-leave").show();
                    }

                    $(".member-list-content").append(memberData);

                    window.downloadOriginalUserAvatar("chatroomMemberListView", nowTimestamp, memberName[i], (i+1));
                }
            }

            var memberData = $(memberDataHTML);
            memberData.prop("id", "chatroomMemberList0");
            memberData.find(".personal-name").html(JM.data.chatroom[JM.chatroomID].owner);
            memberData.find(".admin-text").removeClass("hide");

            $(".member-list-content").prepend(memberData);
            window.downloadOriginalUserAvatar("chatroomMemberListView", nowTimestamp, JM.data.chatroom[JM.chatroomID].owner, 0);

        };

        window.chatroomMemberListViewAvatar = function(listViewIndex, avatarPath) {
            $("#chatroomMemberList" + listViewIndex).find(".img-content svg").hide();
            $("#chatroomMemberList" + listViewIndex).find(".img-content img").prop("src", avatarPath);
            $("#chatroomMemberList" + listViewIndex).find(".img-content img").show();
        };

        window.setQChatroom = function(action, name) {
            (function(action, name) {

                //define desc
                var desc = "";
                var need_history;
                var group_message;
                var name_changed = "N";

                if (JM.data.chatroom[JM.chatroomID].need_history) {
                    need_history = "Y";
                } else {
                    need_history = "N";
                }

                if (JM.data.chatroom[JM.chatroomID].is_group) {
                    group_message = "Y";
                } else {
                    group_message = "N";
                }

                if (action === "name") {
                    name_changed = "Y";
                }

                desc = "need_history=" + need_history + ";group_message=" + group_message + ";name_changed=" + name_changed;

                //Max length of name is 32
                var chatroomName = name.substr(0, 31);

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    group_id: JM.chatroomID,
                    chatroom_name: chatroomName,
                    chatroom_desc: desc
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        if (action === "name") {
                            window.getConversation(false);
                            $.mobile.changePage('#viewChatroomInfo');
                        }
                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "setQChatroom", successCallback, failCallback, queryData, "");

            }(action, name));
        };

        function removeQMember() {
            (function() {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    group_id: JM.chatroomID
                };

                var queryDataParameter = createXMLDataString(queryDataObj);

                var tempDataObj = {
                    destination_emp_no: JM.data.chatroom_user[removeMemberName].emp_no
                };
                var memberList = createXMLDataString(tempDataObj);
                var memberListParameter = "<member_list>" + memberList + "</member_list>";

                var queryData = "<LayoutHeader>" + queryDataParameter + memberListParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        setTimeout(function(){

                            window.sendTextMessage(loginData["loginid"] + "將" + removeMemberName + "從聊天室踢除", true, "memberEvent");
                            window.getGroupMembers(JM.chatroomID, JM.data.chatroom[JM.chatroomID].is_group, "chatroomInfo");

                        }, 1000);
                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "removeQMember", successCallback, failCallback, queryData, "");

            }());
        }

        /********************************** page event *************************************/
        $("#viewChatroomInfo").one("pagebeforeshow", function(event, ui) {

            //UI Popup : Remove member Confirm
            var removeMemberConfirmData = {
                id: "removeMemberConfirm",
                content: $("template#tplRemoveMemberConfirm").html()
            };

            tplJS.Popup("viewChatroomInfo", "viewChatroomInfoContent", "append", removeMemberConfirmData);

        });

        $("#viewChatroomInfo").on("pagebeforeshow", function(event, ui) {
            $(".data-list-content .user-list").remove();
            $(".data-list-content .ui-hr-list").remove();

            prevPageID = "viewChatroomInfo";
            window.processChatroomInfo();
        });

        /********************************** dom event *************************************/

        //Switch Auto History
        $(document).on({
            click: function() {
                $("#autoHistoryOpen").toggleClass("hide");
                $("#autoHistoryClose").toggleClass("hide");

                if ($("#autoHistoryOpen").hasClass("hide")) {
                    JM.data.chatroom[JM.chatroomID].need_history = false;
                } else {
                    JM.data.chatroom[JM.chatroomID].need_history = true;
                }

                JM.updateLocalStorage();

                window.setQChatroom("auto_history", JM.data.chatroom[JM.chatroomID].name);
            }
        }, "#autoHistorySwitch");

        //Edit Chatroom
        $(document).on({
            click: function() {
                $.mobile.changePage('#viewChatroomEdit');
            }
        }, "#editChatroomInfo");

        //Add Member
        $(document).on({
            click: function() {
                $.mobile.changePage('#viewAddMember');
            }
        }, ".member-add-btn");

        //Remove Member
        $(document).on({
            click: function() {
                removeMemberName = $(this).parents(".data-list").find(".personal-name").html();

                $("#removeMemberConfirm #removeMemberName").html(removeMemberName);
                $("#removeMemberConfirm").popup("open");
            }
        }, ".data-delete");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("cancel") || $(event.target).parent().hasClass("cancel")) {
                    $("#removeMemberConfirm").popup("close");
                } else if ($(event.target).hasClass("confirm") || $(event.target).parent().hasClass("confirm")) {
                    $("#removeMemberConfirm").popup("close");

                    removeQMember();
                }

                footerFixed();

            }
        }, "#removeMemberConfirm");

    }
});
