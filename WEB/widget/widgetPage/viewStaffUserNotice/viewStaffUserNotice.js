$("#viewStaffUserNotice").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserNotice/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserNotice").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserNotice").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserNotice');
            $('#viewStaffUserNotice .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffUserNotice").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserNotice").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        $('.notice-top').on('click', function() {
            checkWidgetPage('viewStaffUserTop', pageVisitedList);
        });

        $('.notice-list').on('click', function() {
            checkWidgetPage('viewStaffUserMsg', pageVisitedList);
        });


    }
});