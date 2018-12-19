$("#viewStaffAdminAddPreview").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminAddPreview/img/',
            staffKey = 'appempservice',
            postData = {},
            postID = '',
            postURL = '',
            announceBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'].toString();

        //获取预览内容
        function getPreviewData() {
            postData = JSON.parse(window.sessionStorage.getItem('viewStaffAdminAddPreview_parmData'));
            $('.add-preview-title').text(postData['postTitle']);
            $('.add-preview-text').text(postData['postContent']);
            $('.add-preview-time').text(new Date().yyyymmdd('/'));
            //是否有图档
            if(postData['postURL'] != '') {
                $('.add-preview-img').html('').show().append('<img src="' + postData['postURL'] + '">');
            } else {
                $('.add-preview-img').hide();
            }
        }

        function getNewPostID() {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source></LayoutHeader>";

            var successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] == '1') {
                    postID = data['Content'];
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", false, "getPostId", successCallback, failCallback, queryData, "");
            }();
        }

        function uploadFile(queryData) {
            var self = this;

            let resource = announceBoardID + '/' + postID;

            this.successCallback = function (data) {
                console.log(data);
                if (data['ResultCode'] == '1') {
                    postURL = data['Content']['thumbnail_1024_url'];
                }
            };

            this.failCallback = function (data) {};

            var __construct = function () {
                QStoragePlugin.QStorageAPI("POST", false, 'appqforum', 'picture/upload', self.successCallback, self.failCallback, queryData, '', resource);
            }();
        }

        //发送公告
        function sendNewPost() {

            let fileList = '';
            let postContent = '';

            if(postData['postURL'] != '') {
                fileList = '<file_list><file>' + postURL + '</file></file_list>';
                //此模板是用户版的公告详情
                postContent = '<div class="notice-msg-text">' +
                    postData['postTitle'] +
                    '</div><div class="notice-msg-time">' +
                    new Date().yyyymmdd('/') +
                    '</div><div class="notice-msg-img"><img src="' +
                    postURL +
                    '"></div><div class="notice-msg-text">' +
                    postData['postContent'] +
                    '</div>';
            } else {
                //此模板是用户版的公告详情
                postContent = '<div class="notice-msg-text">' +
                    postData['postTitle'] +
                    '</div><div class="notice-msg-time">' +
                    new Date().yyyymmdd('/') +
                    '</div><div class="notice-msg-text">' +
                    postData['postContent'] +
                    '</div>';
            }

            let xmlData = {
                emp_no: loginData["emp_no"],
                source: staffKey + appEnvironment,
                board_id: announceBoardID,
                post_id: postID,
                post_title: postData['postTitle'],
                content: postContent
            };

            let queryData = "<LayoutHeader>" + QForumPlugin.createXMLDataString(xmlData) + fileList + "</LayoutHeader>";

            var successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] == '1') {
                    //success
                    console.log('success');
                }
                loadingMask('hide');
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "newPost", successCallback, failCallback, queryData, "");
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminAddPreview").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminAddPreview").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminAddPreview .page-main').css('height', mainHeight);
            $('.addNoticeSendBtn').show();
        });

        $("#viewStaffAdminAddPreview").on("pageshow", function(event, ui) {
            getPreviewData();
        });

        $("#viewStaffAdminAddPreview").on("pagehide", function(event, ui) {
            postID = '';
            postURL = '';
        });


        /********************************** dom event *************************************/
        $('.addNoticeSendBtn').on('click', function() {
            loadingMask('show');
            //1.API:get post id
            getNewPostID();
            //2.have img or not
            if(postData['postURL'] != '') {
                //3.url to file
                let file = QStoragePlugin.dataURLtoFile(postData['postURL']);
                let formData = new FormData();
                formData.append('files', file);
                //4.API:upload file to board_id/post_id
                uploadFile(formData);
            }
            //5.API:send new post
            sendNewPost();
        });


    }
});