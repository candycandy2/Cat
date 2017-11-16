
$("#viewChatroomEdit").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        function processChatroomEdit() {
            $("#viewChatroomEditContent #chatroomEditName").val(JM.data.chatroom[JM.chatroomID].name);
        }

        function editChatroom() {
            var chatroomEditName = $("#chatroomEditName").val();
            window.setQChatroom("name", chatroomEditName);
        }

        /********************************** page event *************************************/
        $("#viewChatroomEdit").on("pagebeforeshow", function(event, ui) {
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

