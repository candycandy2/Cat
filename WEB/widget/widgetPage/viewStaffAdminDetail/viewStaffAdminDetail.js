$("#viewStaffAdminDetail").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminDetail/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminDetail").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffAdminDetail');
            $('#viewStaffAdminDetail .page-main').css('height', mainHeight + 'px');

            $('.editNoticeBtn').show();
            $('.deleteNoticeBtn').show();
        });

        $("#viewStaffAdminDetail").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminDetail").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //enter edit page
        $('.editNoticeBtn').on('click', function() {
            checkWidgetPage('viewStaffAdminEdit', pageVisitedList);
        });

        //open delete confirm popup
        $('.deleteNoticeBtn').on('click', function() {
            popupMsgInit('.deleteNoticePopup');
        });


    }
});