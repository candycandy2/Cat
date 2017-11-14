

$("#viewChatroomInfo").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/

        /********************************** page event *************************************/

        /********************************** dom event *************************************/

        $(document).on({
            click: function() {
                $("#autoHistoryOpen").toggleClass("hide");
                $("#autoHistoryClose").toggleClass("hide");
            }
        }, "#autoHistorySwitch");

    }
});
