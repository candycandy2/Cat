$("#viewStaffUserNotice").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserNotice/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserNotice").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserNotice").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserNotice .page-main').css('height', mainHeight);
        });

        $("#viewStaffUserNotice").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserNotice").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转置顶公告（用户版和总机版通用）
        $('.notice-top').on('click', function() {
            checkWidgetPage('viewStaffUserTop', pageVisitedList);
        });

        //跳转到消息详情
        $('.notice-list').on('click', function() {
            checkWidgetPage('viewStaffUserDetail', pageVisitedList);
        });


    }
});