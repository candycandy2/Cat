$("#viewStaffUserReserve").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserReserve/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserReserve").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserReserve").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserReserve');
            $('#viewStaffUserReserve .page-main').css('height', mainHeight + 'px');
            //popupMsgInit('.reserveTeaDelete');
        });

        $("#viewStaffUserReserve").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserReserve").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});