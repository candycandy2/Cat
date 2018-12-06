$("#viewStaffAdminAdd").pagecontainer({
    create: function(event, ui) {

        let noticeTitle = '',
            noticeContext = '',
            imgURL = '/widget/widgetPage/viewStaffAdminAdd/img/';

        function openConfirmPopup() {
            //當未輸入任何信息時，直接返回上一頁；否則提示用戶
            if(noticeTitle == '' && noticeContext == '') {
                onBackKeyDown();
            } else {
                popupMsgInit('.cancelAddNotice');
            }
        }

        function checkTextarea() {
            if(noticeTitle != '' && noticeContext != '') {
                $('.addNoticePreviewBtn').addClass('active-btn-green');
            } else {
                $('.addNoticePreviewBtn').removeClass('active-btn-green');
            }
        }

        function initThisPage() {
            $('.new-notice-title').val('');
            $('.new-notice-context').val('');
            noticeTitle = '';
            noticeContext = '';
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminAdd").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminAdd").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffAdminAdd');
            $('#viewStaffAdminAdd .page-main').css('height', mainHeight + 'px');
            $('.addNoticePreviewBtn').show();
        });

        $("#viewStaffAdminAdd").on("pageshow", function(event, ui) {
            //解除原本的事件监听
            document.removeEventListener("backbutton", onBackKeyDown, false);
            //监听本页自己的backkey logic
            document.addEventListener("backbutton", openConfirmPopup, false);
        });

        $("#viewStaffAdminAdd").on("pagehide", function(event, ui) {
            document.removeEventListener("backbutton", openConfirmPopup, false);
            document.addEventListener("backbutton", onBackKeyDown, false);
            //initThisPage();
        });


        /********************************** dom event *************************************/
        //確定取消新增，返回上一頁
        $('.confirmCancelAddNotice').on('click', function() {
            setTimeout(function() {
                initThisPage();
                onBackKeyDown();
            }, 500);
        });

        //獲取textarea
        $('.new-notice-title').on('input', function() {
            noticeTitle = $.trim($(this).val());
            checkTextarea();
        });
        $('.new-notice-context').on('input', function() {
            noticeContext = $.trim($(this).val());
            checkTextarea();
        });

        //预览
        $('.addNoticePreviewBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                checkWidgetPage('viewStaffAdminAddPreview', pageVisitedList)
            }
        })


    }
});