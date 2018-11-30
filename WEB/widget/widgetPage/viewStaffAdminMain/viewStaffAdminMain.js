$("#viewStaffAdminMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminMain/img/';

        /********************************** page event ***********************************/
        $("#viewStaffAdminMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminMain").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffAdminMain');
            $('#viewStaffAdminMain .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffAdminMain").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切換本日和明日
        $('.admin-main-date > div').on('click', function() {
            var has = $(this).hasClass('active-date');

            if(!has) {
                var type = $(this).data('type');
                $(this).addClass('active-date');
                if(type == 'today') {
                    $('div[data-type="tomorrow"]').removeClass('active-date');
                    $('.admin-main-tomorrow').hide();
                } else {
                    $('div[data-type="today"]').removeClass('active-date');
                    $('.admin-main-today').hide();
                }
                $('.admin-main-' + type).show();
            }
        });

        //
        $('.today-item').on('swipeleft', function() {
            $(this).animate({left: '-40vw'}, 200, 'linear');
            //$(this).siblings('.today-handle').animate({width: '3rem'}, 200, 'linear');
        });

        $('.today-item').on('swiperight', function() {
            $(this).animate({left: '0'}, 200, 'linear');
        });


    }
});