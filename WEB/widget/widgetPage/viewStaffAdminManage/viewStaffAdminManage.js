$("#viewStaffAdminManage").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminManage/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminManage").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminManage").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminManage .page-main').css('height', mainHeight);
            $('.editNoticePreviewBtn').show();

            $('.select-room-icon').attr('src', serverURL + imgURL + 'switch_close.png');
            $('.selected-room-icon').attr('src', serverURL + imgURL + 'switch_open.png');
        });

        $("#viewStaffAdminManage").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminManage").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切換所有和擁有
        $('.admin-manage-navbar > div').on('click', function() {
            let has = $(this).hasClass('active-navbar');

            if(!has) {
                let type = $(this).data('type');
                $(this).addClass('active-navbar');
                if(type == 'all') {
                    $('div[data-type="my"]').removeClass('active-navbar');
                    $('.admin-manage-my').hide();
                } else {
                    $('div[data-type="all"]').removeClass('active-navbar');
                    $('.admin-manage-all').hide();
                }
                $('.admin-manage-' + type).show();
            }
        });

        //單選按鈕
        $('.select-room-icon, .selected-room-icon').on('click', function() {
            let dataSrc = $(this).attr('data-src');
            let reverseSrc = dataSrc == 'close' ? 'open' : 'close';
            $(this).attr('src', serverURL + imgURL + 'switch_' + reverseSrc + '.png');
            $(this).attr('data-src', reverseSrc);
        });


    }
});