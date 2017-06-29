
$("#viewIndex").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.getJmessagePassword = function() {
            
            var self = this;

            this.successCallback = function(data, status, xhr) {

                var resultcode = data['ResultCode'];

                if (resultcode === 1) {
                    jmessagePWD = data['Content'];
                    console.log(jmessagePWD);

                    JM.login();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                $.ajax({
                    url: "http://qplaydev.benq.com/qmessage/public/v101/qmessage/pwd",
                    dataType: "json",
                    type: "POST",
                    async: false,
                    contentType: "application/json",
                    data: JSON.stringify({ "username": loginData["loginid"] }),
                    success: self.successCallback,
                    error: self.failCallback
                });
            }();
        };

        /********************************** page event *************************************/
        $("#viewIndex").one("pagebeforeshow", function(event, ui) {
            //Friend remove popup
            var friendRemovePopupData = {
                id: "friendRemovePopup",
                content: $("template#tplFriendRemovePopup").html()
            };

            tplJS.Popup("viewIndex", "viewIndexContent", "append", friendRemovePopupData);

            //Friend invite popup
            var friendInvitePopupData = {
                id: "friendInvitePopup",
                content: $("template#tplFriendInvitePopup").html()
            };

            tplJS.Popup(null, null, "append", friendInvitePopupData);

            //Friend accept invite popup
            var acceptFriendInvitePopupData = {
                id: "acceptFriendInvitePopup",
                content: $("template#tplAcceptFriendInvitePopup").html()
            };

            tplJS.Popup(null, null, "append", acceptFriendInvitePopupData);

            //Friend decline invite popup
            var declineFriendInvitePopupData = {
                id: "declineFriendInvitePopup",
                content: $("template#tplDeclineFriendInvitePopup").html()
            };

            tplJS.Popup(null, null, "append", declineFriendInvitePopupData);

            //Click chatroom popup
            var clickChatroomPopupData = {
                id: "clickChatroomPopup",
                content: $("template#tplClickChatroomPopup").html()
            };

            tplJS.Popup(null, null, "append", clickChatroomPopupData);
        });

        $("#viewIndex").on("pageshow", function(event, ui) {
            //$("#friendPopup").popup("open");
        });

        /********************************** dom event *************************************/
        $(document).on({
            click: function(event) {

                event.preventDefault();

                var hrefData = $(event.target).prop("href").split("#");
                JM.friendID = hrefData[1];

                $("#friendRemovePopup .username").html(JM.friendID);
                $("#friendRemovePopup").popup("open");

            }
        }, "#friendListView");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                var hrefData = $(event.target).prop("href").split("#");
                JM.chatroomID = hrefData[1];

                $("#clickChatroomPopup").popup("open");

            }
        }, "#chatroomListView");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("cancel")) {
                    $("#friendRemovePopup").popup("close");
                } else if ($(event.target).hasClass("confirm")) {
                    JM.Friend.removeFromFriendList();
                    $("#friendRemovePopup").popup("close");
                }

            }
        }, "#friendRemovePopup");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("cancel")) {
                    JM.Friend.declineInvitation();
                    $("#friendInvitePopup").popup("close");
                } else if ($(event.target).hasClass("confirm")) {
                    JM.Friend.acceptInvitation();
                    $("#friendInvitePopup").popup("close");
                }

            }
        }, "#friendInvitePopup");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("confirm")) {    
                    $("#acceptFriendInvitePopup").popup("close");

                    //For Test
                    JM.Friend.getFriendList();
                }

            }
        }, "#acceptFriendInvitePopup");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("confirm")) {    
                    $("#declineFriendInvitePopup").popup("close");
                }

            }
        }, "#declineFriendInvitePopup");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("cancel")) {
                    $.mobile.changePage('#viewChatroom');
                    $("#clickChatroomPopup").popup("close");
                } else if ($(event.target).hasClass("confirm")) {
                    JM.Chatroom.exitGroup();
                    $("#clickChatroomPopup").popup("close");
                }

            }
        }, "#clickChatroomPopup");

        $(document).on({
            click: function(event) {
                JM.Chatroom.createGroupIniOS();
                $("#testChatroom").hide();
            }
        }, "#testChatroom");

        $(document).on({
            click: function(event) {

                JM.friendID = $("#friendIDText").val();
                JM.Friend.sendInvitationRequest();

            }
        }, "#testFriend");

    }
});
