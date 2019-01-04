$("#viewStaffAdminEdit").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminEdit/img/',
            postDetail = {};

        //获取原post内容
        function getOriginalPost() {
            postDetail = JSON.parse(window.sessionStorage.getItem('viewStaffAdminEdit_parmData'));
            $('.old-notice-title').val(postDetail['title']);
            $('.old-notice-context').val(postDetail['content']);
        }

        //检查是否可以送出预览
        function checkTitleAndContent() {
            let post_title = $.trim($('.old-notice-title').val());
            let post_content = $.trim($('.old-notice-context').val());
            if(post_title != '' && post_content != '') {
                $('.editNoticePreviewBtn').addClass('active-btn-green');
            } else {
                $('.editNoticePreviewBtn').removeClass('active-btn-green');
            }
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminEdit").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminEdit").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminEdit .page-main').css('height', mainHeight);
            $('.editNoticePreviewBtn').show();
        });

        $("#viewStaffAdminEdit").on("pageshow", function(event, ui) {
            let init = window.sessionStorage.getItem('InitAdminEditPage');
            if(init == null) {
                getOriginalPost();
            } else {
                window.sessionStorage.removeItem('InitAdminEditPage');
            }
        });

        $("#viewStaffAdminEdit").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //獲取textarea
        $('.old-notice-title').on('input', function() {
            checkTitleAndContent();
        });
        $('.old-notice-context').on('input', function() {
            checkTitleAndContent();
        });

        //enter preview page after edit
        $('.editNoticePreviewBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                let obj = {
                    id: postDetail['id'],
                    title: $('.old-notice-title').val(),
                    content: $('.old-notice-context').val(),
                    url: ''
                }
                checkWidgetPage('viewStaffAdminEditPreview', pageVisitedList, obj);
                window.sessionStorage.setItem('InitAdminEditPage', 'N');
            }
        });


    }
});