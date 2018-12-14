$("#viewStaffAdminEdit").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminEdit/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminEdit").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminEdit").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminEdit .page-main').css('height', mainHeight);
            $('.editNoticePreviewBtn').show();
        });

        $("#viewStaffAdminEdit").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminEdit").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //enter preview page after edit
        $('.editNoticePreviewBtn').on('click', function() {
            checkWidgetPage('viewStaffAdminEditPreview', pageVisitedList);
        });


    }
});