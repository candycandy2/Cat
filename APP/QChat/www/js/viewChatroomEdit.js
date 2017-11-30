
$("#viewChatroomEdit").pagecontainer({
    create: function(event, ui) {

        var nowChatroomID;

        /********************************** function *************************************/
        function processChatroomEdit() {
            $("#viewChatroomEditContent #chatroomEditName").val(JM.data.chatroom[nowChatroomID].name);
        }

        function editChatroom() {
            var chatroomEditName = $("#chatroomEditName").val();
            window.setQChatroom(nowChatroomID, "name", chatroomEditName);
        }

        /********************************** page event *************************************/
        $("#viewChatroomEdit").on("pagebeforeshow", function(event, ui) {
            nowChatroomID = JM.chatroomID;
            processChatroomEdit();
        });

        /********************************** dom event *************************************/
        $(document).on({
            click: function() {
                editChatroom();
            }
        }, "#saveChatroomInfo");

    }
});
