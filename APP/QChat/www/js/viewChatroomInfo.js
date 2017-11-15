

$("#viewChatroomInfo").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        function processChatroomData() {

            //Chatroom name
            $(".chatroom-info-name").html(cutString(63, JM.data.chatroom[JM.chatroomID].name, 4.18, "number", JM.data.chatroom[JM.chatroomID].member.length));

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

        }

        window.chatroomMemberListViewAvatar = function(listViewIndex, avatarPath) {
            $("#chatroomMemberList" + listViewIndex).find(".img-content svg").hide();
            $("#chatroomMemberList" + listViewIndex).find(".img-content img").prop("src", avatarPath);
            $("#chatroomMemberList" + listViewIndex).find(".img-content img").show();
        };

        window.setQChatroom = function(name, desc) {
            (function(name, desc) {

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

                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "setQChatroom", successCallback, failCallback, queryData, "");

            }(name, desc));
        };

        /********************************** page event *************************************/
        $("#viewChatroomInfo").on("pagebeforeshow", function(event, ui) {
            processChatroomData();
        });

        /********************************** dom event *************************************/

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

                var desc = "";
                var need_history;
                var group_message;

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

                desc = "need_history=" + need_history + ";group_message=" + group_message;
                window.setQChatroom(JM.data.chatroom[JM.chatroomID].name, desc);
            }
        }, "#autoHistorySwitch");

    }
});
