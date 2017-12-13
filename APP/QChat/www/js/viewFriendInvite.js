
$("#viewFriendInvite").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        function friendInviteListView() {

            $("#userListContentFriendInvite .user-list").remove();
            $("#userListContentFriendInvite .ui-hr-list").remove();

            if (JM.data.chatroom_invite.length > 0) {

                //check download time
                var nowDateTime = new Date();
                var nowTimestamp = nowDateTime.TimeStamp();

                var userListHTML = $("template#tplUserList").html();
                var userList = $(userListHTML);

                for (var i=0; i<JM.data.chatroom_invite.length; i++) {
                    userList.attr("name", "inviteList" + i);
                    userList.find(".checkbox-content").remove();

                    //name
                    userList.find(".user-name").html(JM.data.chatroom_invite[i]);
                    userList.find(".personal-popup").data("userID", JM.data.chatroom_invite[i]);
                    userList.find(".button-content").data("userID", JM.data.chatroom_invite[i]);
                    userList.find(".button-content .invite").removeClass("hide");

                    if (JM.data.chatroom_user[JM.data.chatroom_invite[i]].memo != null && 
                        JM.data.chatroom_user[JM.data.chatroom_invite[i]].memo.length > 0) {

                        userList.find(".personal-name").removeClass("user-name-only");
                        userList.find(".user-content .invite-status").removeClass("hide");
                        userList.find(".user-content .invite-status").html(JM.data.chatroom_user[JM.data.chatroom_invite[i]].memo);

                    }

                    $("#userListContentFriendInvite").append(userList);

                    window.downloadOriginalUserAvatar("inviteListView", nowTimestamp, JM.data.chatroom_invite[i], i);
                }
            } else {
                $("#noFriendInvite").show();
                $("#viewFriendInviteContent .text-title").hide();
            }

        }

        function acceptQInvitation(userID, listViewName) {
            (function(userID, listViewName) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    source_emp_no: JM.data.chatroom_user[userID].emp_no
                };

                var queryDataParameter = createXMLDataString(queryDataObj);
                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        var index = JM.data.chatroom_invite.indexOf(userID);
                        JM.data.chatroom_invite.splice(index, 1);
                        JM.updateLocalStorage();

                        $("#actionMsg4 .user-name").html(userID);
                        $("#actionMsg4").show();

                        actionButton("show");

                        $("#viewFriendInviteContent hr[name=" + listViewName + "]").remove();
                        $("#viewFriendInviteContent div[name=" + listViewName + "]").css({
                            position: "absolute"
                        }).animate({
                            left: "-70vw",
                            opacity: 0
                        }, 300, function() {
                            $(this).remove();

                            friendInviteListView();
                        });
                    }
                };

                var failCallback = function() {};

                CustomAPI("POST", true, "acceptQInvitation", successCallback, failCallback, queryData, "");

            }(userID, listViewName));
        }

        /********************************** page event *************************************/
        $("#viewFriendInvite").on("pagebeforeshow", function(event, ui) {
            //no data
            var noData = $($("template#tplNoData").html());
            noData.prop("id", "noFriendInvite");
            noData.html("沒有新的好友請求");
            $("#viewFriendInviteContent").append(noData);

            friendInviteListView();
        });

        $("#viewFriendInvite").on("pageshow", function(event, ui) {
            prevPageID = "viewFriendInvite";
        });

        /********************************** dom event *************************************/
        $(document).on({
            click: function() {
                var name = $(this).parents(".user-list").attr("name");
                acceptQInvitation($(this).data("userID"), name);
            }
        }, "#userListContentFriendInvite .button-content");

        //Back Button
        $(document).on({
            click: function() {
                $.mobile.changePage('#viewIndex');
            }
        }, "#backFriendInvite");

    }
});
