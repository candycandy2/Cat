$("#viewStaffAdminNotice").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminNotice/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminNotice").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminNotice").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffAdminNotice');
            $('#viewStaffAdminNotice .page-main').css('height', mainHeight + 'px');

            $('.add-notice img').attr('src', serverURL + imgURL + 'add.png');
        });

        $("#viewStaffAdminNotice").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminNotice").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转置顶公告（用户版和总机版通用）
        $('.notice-top').on('click', function() {
            checkWidgetPage('viewStaffUserTop', pageVisitedList);
        });

        //编辑已有公告
        $('.notice-list').on('click', function() {
            checkWidgetPage('viewStaffAdminDetail', pageVisitedList);
        });

        //新增公告
        $('.add-notice').on('click', function() {
            checkWidgetPage('viewStaffAdminAdd', pageVisitedList);
        });


    }
});