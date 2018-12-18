$("#viewStaffAdminAdd").pagecontainer({
    create: function(event, ui) {

        let noticeTitle = '',
            noticeContext = '',
            postURL = '',
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
            postURL = '';
        }

        function onSuccess(imageURI) {
            //1. API: get new post id
            //getNewPostID(formData);

            //2. DOM
            $('.add-notice-img').show();

            //3. url: get base64
            postURL = 'data:image/jpeg;base64,' + imageURI;
            $('.add-img-now').html('').append('<img src="' + postURL + '">');

            // //4. base64 to file
            // var file = QStoragePlugin.dataURLtoFile(url);

            // //5. formData
            // var formData = new FormData();
            // formData.append('files', file);

            // //6. API: upload file
            // let resource = announceBoardID + '/' + thisPostID;
            // uploadFile(formData, resource);
        }

        function onFail(message) {
            console.log('Failed because: ' + message);
        }

        /********************************** page event ***********************************/
        $("#viewStaffAdminAdd").on("pagebeforeshow", function(event, ui) {

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

        //upload img
        $('.add-upload-icon').on('click', function() {
            //有且只能上传一张图档
            var imgCount = $('.add-img-now').children().length;
            if(imgCount == 0) {
                navigator.camera.getPicture(onSuccess, onFail, {
                    quality: 100,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    destinationType: Camera.DestinationType.DATA_URL,
                    allowEdit: true,
                    targetWidth: 500,
                    targetHeight: 500
                });
            }
        });

        //remove img
        $('.remove-img-now').on('click', function() {
            $('.add-notice-img').hide();
            $('.add-img-now').html('');
        });

        //预览
        $('.addNoticePreviewBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                var noticeData = {
                    'postTitle': noticeTitle,
                    'postContent': noticeContext,
                    'postURL': postURL
                };
                checkWidgetPage('viewStaffAdminAddPreview', pageVisitedList, noticeData);
            }
        })


    }
});