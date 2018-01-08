
$("#viewAddFriend").pagecontainer({
    create: function(event, ui) {

        var userDataCount = 0;

        /********************************** function *************************************/
        window.addFriendListView = function(dataCount, overMaxLength, userName, dataIndex, nowTimestamp, status, type) {
            overMaxLength = overMaxLength || null;
            userName = userName || null;
            if (dataIndex !== 0) {
                dataIndex = dataIndex || null;
            }
            nowTimestamp = nowTimestamp || null;
            status = status || null;
            type = type || null;

            var showView = false;

            //Check if User from getQList has exist in chatroom_friend
            if (JM.data.chatroom_friend.indexOf(userName) == -1) {
                userDataCount++;
                showView = true;
            }

            if (dataCount === 0 || dataIndex === 1) {
                $("#msgWelcomeAddFriend").hide();
                $("#msgUserOverflowAddFriend").hide();
                $("#userListContentAddFriend .user-list").remove();
                $("#userListContentAddFriend .ui-hr-list").remove();
            }

            if (dataCount === 0 || userDataCount === 0) {
                $("#msgNoFoundAddFriend").show();
                $("#titleFriendAddFriend").hide();

                showView = false;
            } else {
                //over 10 datas || filter in chatroom_friend
                if (dataCount == dataIndex) {
                    if (userDataCount == dataCount) {
                        //No filter in chatroom_friend
                        $("#msgNoFoundAddFriend").hide();
                        $("#titleFriendAddFriend").show();

                        if (overMaxLength === "Y") {
                            $("#msgUserOverflowAddFriend").show();
                        }
                    } else if (userDataCount == 0) {
                        //All data in chatroom_friend
                    } else {
                        //filter in chatroom_friend
                        $("#msgNoFoundAddFriend").hide();
                        $("#titleFriendAddFriend").show();
                    }
                }

                $("#titleFriendAddFriend .add-friend-title").hide();
                $("#titleFriendAddFriend #AddFriendTitle" + type).show();
            }

            if (showView) {
                var userListHTML = $("template#tplUserList").html();
                var userList = $(userListHTML);

                userList.prop("id", "userList" + dataIndex);
                userList.find(".checkbox-content").remove();
                userList.find(".user-content").addClass("user-content-addFriend");

                //name
                userList.find(".user-name").html(userName);
                userList.find(".personal-popup").data("userID", userName);

                //info
                if (JM.data.chatroom_user[userName].is_register == false) {
                    userList.find(".not-register").show();
                    userList.find(".user-name").removeClass("user-name-only");
                } else if (JM.data.chatroom_user[userName].is_protect == true) {
                    userList.find(".protect").show();
                    userList.find(".user-name").removeClass("user-name-only");

                    //Had send invitation
                    if (status === "2") {
                        userList.find(".button-content .protect").hide();
                        userList.find(".button-icon-content").hide();
                        userList.find(".action-info").show();
                    }
                } else if (JM.data.chatroom_user[userName].is_friend == false) {
                    userList.find(".not-friend").show();
                }

                $("#userListContentAddFriend").append(userList);

                if (type != "1") {
                    userList.find(".checkbox-content").css("opacity", "0");
                }

                window.downloadOriginalUserAvatar("userListView", nowTimestamp, userName, dataIndex);
            }
        };

        /********************************** page event *************************************/
        $("#viewAddFriend").on("pagebeforeshow", function(event, ui) {

            //Search Recommend User
            getQList("3", "viewAddFriend");

            //Recovery Search User Input UI
            $(".data-list-content .user-list").remove();
            $(".data-list-content .ui-hr-list").remove();
            $("#searchUserInputAddFriend").css("width", "92.5vw");
            $("#searchUserInputAddFriend").val("");
            $("#searchUserButtonAddFriend").hide();
            $("#searchUserClearContentAddFriend").hide();
        });

        $("#viewAddFriend").on("pageshow", function(event, ui) {
            prevPageID = "viewAddFriend";
        });

        /********************************** dom event *************************************/

        //Search User
        $(document).on({
            focus: function() {

                $("#searchUserClearContentAddFriend").hide();

                $(this).animate({
                    width: "81vw"
                }, 250, function() {
                    $("#searchUserButtonAddFriend").show();
                });

            }
        }, "#searchUserInputAddFriend");

        $(document).on({
            click: function() {

                var text = $("#searchUserInputAddFriend").val();

                $("#searchUserInputAddFriend").css("width", "92.5vw");
                $(this).hide();

                if (text.length > 0) {
                    userDataCount = 0;
                    $("#searchUserClearContentAddFriend").show();
                    getQList("1", "viewAddFriend", text);
                }

            }
        }, "#searchUserButtonAddFriend");

        $(document).on({
            click: function() {
                $("#searchUserInputAddFriend").val("");
                $(this).hide();
            }
        }, "#searchUserClearContentAddFriend");

        //Back Button
        $(document).on({
            click: function() {
                $.mobile.changePage('#viewIndex');
            }
        }, "#backAddFriend");

    }
});
