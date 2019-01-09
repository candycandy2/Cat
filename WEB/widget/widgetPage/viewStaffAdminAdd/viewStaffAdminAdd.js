$("#viewStaffAdminAdd").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminAdd/img/',
            postURL = '';
            
        //是否取消新增的提示
        function openConfirmPopup() {
            let postTitle = $.trim($('.new-notice-title').val());
            let postContent = $.trim($('.new-notice-context').val());
            //當未輸入任何信息時，直接返回上一頁；否則提示用戶
            if(postTitle == '' && postContent == '') {
                onBackKeyDown();
            } else {
                popupMsgInit('.cancelAddNotice');
            }
        }

        //检查标题和内容是否为空，为空不能预览
        function checkTextarea() {
            let postTitle = $.trim($('.new-notice-title').val());
            let postContent = $.trim($('.new-notice-context').val());
            if(postTitle != '' && postContent != '') {
                $('.addNoticePreviewBtn').addClass('active-btn-green');
            } else {
                $('.addNoticePreviewBtn').removeClass('active-btn-green');
            }
        }

        //初始化该页面
        function initThisPage() {
            $('.remove-img-now').trigger('click');
            $('.new-notice-title').val('');
            $('.new-notice-context').val('');
            $('.addNoticePreviewBtn').removeClass('active-btn-green');
            postURL = '';
        }

        //拍照或图库成功
        function onSuccess(imageURI) {
            $('.add-notice-img').show();
            postURL = 'data:image/jpeg;base64,' + imageURI;
            $('.add-img-now').html('').append('<img src="' + postURL + '">');
        }

        function onFail(message) {}


        /********************************** page event ***********************************/
        $("#viewStaffAdminAdd").on("pagebeforeshow", function(event, ui) {
            let init = window.sessionStorage.getItem('InitAdminAddPage');
            if(init != null) {
                initThisPage();
                window.sessionStorage.removeItem('InitAdminAddPage');
            }
        });

        $("#viewStaffAdminAdd").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminAdd .page-main').css('height', mainHeight);
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
        });


        /********************************** dom event *************************************/
        //如果已输入内容，返回上一页，需要popup提示
        $('#viewStaffAdminAdd').on('click', '.page-back', function() {
            openConfirmPopup();
            return false;
        });

        //確定取消新增，返回上一頁
        $('.confirmCancelAddNotice').on('click', function() {
            setTimeout(function() {
                initThisPage();
                onBackKeyDown();
            }, 500);
        });

        //獲取textarea
        $('.new-notice-title').on('input', function() {
            checkTextarea();
        });
        $('.new-notice-context').on('input', function() {
            checkTextarea();
        });

        //upload img
        $('.add-upload-icon').on('click', function() {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                targetWidth: 1000,
                targetHeight: 1000
            });
        });

        //remove img
        $('.remove-img-now').on('click', function() {
            $('.add-notice-img').hide();
            $('.add-img-now').html('');
            postURL = '';
        });

        //预览
        $('.addNoticePreviewBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                let postData = {
                    'postTitle': $.trim($('.new-notice-title').val()),
                    'postContent': $.trim($('.new-notice-context').val()),
                    'postURL': postURL
                };
                checkWidgetPage('viewStaffAdminAddPreview', pageVisitedList, postData);
            }
        });


    }
});