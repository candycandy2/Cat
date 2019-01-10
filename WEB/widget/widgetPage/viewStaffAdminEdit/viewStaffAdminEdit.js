$("#viewStaffAdminEdit").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminEdit/img/',
            postDetail = {};

        //获取原post内容
        function getOriginalPost() {
            postDetail = JSON.parse(window.sessionStorage.getItem('viewStaffAdminEdit_parmData'));
            $('.old-notice-title').val(postDetail['title']);
            //提取html中的content和img
            $('.edit-data-hidden').html('').append(postDetail['content']);
            let content = $('.edit-data-hidden .postContent').text();
            $('.old-notice-context').val(content);
            let imgLength = $('.edit-data-hidden .postImg').children().length;
            if(imgLength > 0) {
                let src = $('.edit-data-hidden img').attr('src');
                $('.edit-img-old').html('').append('<img src="' + src + '" class="usable">');//通过详情获得的图档可直接使用(包含在html中)
                $('.remove-img-old').show();
            } else {
                $('.edit-img-old').html('');
                $('.remove-img-old').hide();
            }
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

        //拍照或图库成功
        function onSuccess(imageURI) {
            $('.remove-img-old').show();
            postURL = 'data:image/jpeg;base64,' + imageURI;
            $('.edit-img-old').html('').append('<img src="' + postURL + '">');//从本地获得的图档不可直接使用，需要先上传
        }

        function onFail(message) {}


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

        //upload img
        $('.edit-upload-icon').on('click', function() {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                targetWidth: 1000,
                targetHeight: 1000
            });
        });

        //删除图档
        $('.remove-img-old').on('click', function() {
            $('.edit-img-old').html('');
            $('.remove-img-old').hide();
        });

        //enter preview page after edit
        $('.editNoticePreviewBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                let imgLength = $('.edit-img-old').children().length;
                let hasClass = $('.edit-img-old img').hasClass('usable');
                let src = $('.edit-img-old img').attr('src');
                let content = '<div class="postImg">' +
                    (imgLength == 0 ? '' : '<img src="' + src + '"' + (hasClass ? ' class="usable"' : '') + '>') +
                    '</div><div class="postContent">' +
                    $.trim($('.old-notice-context').val()) +
                    '</div>';
                let obj = {
                    id: postDetail['id'],
                    title: $.trim($('.old-notice-title').val()),
                    content: content
                }
                checkWidgetPage('viewStaffAdminEditPreview', pageVisitedList, obj);
                window.sessionStorage.setItem('InitAdminEditPage', 'N');
            }
        });


    }
});