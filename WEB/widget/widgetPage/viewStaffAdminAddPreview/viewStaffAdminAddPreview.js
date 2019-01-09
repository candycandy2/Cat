$("#viewStaffAdminAddPreview").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminAddPreview/img/',
            staffKey = 'appempservice',
            postData = {},
            announceBoardID = '';

        //获取预览内容
        function getPreviewData() {
            announceBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'].toString();
            postData = JSON.parse(window.sessionStorage.getItem('viewStaffAdminAddPreview_parmData'));
            $('.add-preview-title').text(postData['postTitle']);
            $('.add-preview-content').text(postData['postContent']);
            $('.add-preview-time').text(new Date().yyyymmdd('/'));
            //是否有图档
            if(postData['postURL'] != '') {
                $('.add-preview-img').html('').append('<img src="' + postData['postURL'] + '">').show();
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
                //console.log(data);
                if(data['ResultCode'] == '1') {
                    let postID = data['Content'];
                    //如果有图档，先上传图档，否则可以直接送出
                    if(postData['postURL'] != '') {
                        uploadFile(postID);
                    } else {
                        sendNewPost(postID);
                    }
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", false, "getPostId", successCallback, failCallback, queryData, "");
            }();
        }

        function uploadFile(id) {
            var self = this;

            let imgFile = QStoragePlugin.dataURLtoFile(postData['postURL']);
            let queryData = new FormData();
            queryData.append('files', imgFile);
            let resource = announceBoardID + '/' + id;

            this.successCallback = function (data) {
                //console.log(data);
                if (data['ResultCode'] == '1') {
                    let postURL = data['Content']['thumbnail_1024_url'];
                    sendNewPost(id, postURL);
                }
            };

            this.failCallback = function (data) {};

            var __construct = function () {
                QStoragePlugin.QStorageAPI("POST", false, 'appqforum', 'picture/upload', self.successCallback, self.failCallback, queryData, '', resource);
            }();
        }

        //发送公告
        function sendNewPost(id, url) {
            url = url || null;

            let fileList = '';
            if(url != null) {
                fileList = '<file_list><file>' + url + '</file></file_list>';
            }

            //content文本转html
            let contentHtml = '<div class="postImg">' +
                (url == null ? '' : '<img src="' + url + '" style="width:92.58vw;">') +
                '</div><div class="postContent">' +
                postData['postContent'] +
                '</div>';

            let xmlData = {
                emp_no: loginData["emp_no"],
                source: staffKey + appEnvironment,
                board_id: announceBoardID,
                post_id: id,
                post_title: postData['postTitle'],
                //content: contentHtml
                content: postData['postContent']
            };

            let queryData = "<LayoutHeader>" + QForumPlugin.createXMLDataString(xmlData) + fileList + "</LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);
                if(data['ResultCode'] == '1') {
                    //成功后回退到公告页
                    pageVisitedList.pop();
                    onBackKeyDown();
                    //只有当新增成功时才需要初始化新增页(前一页)
                    window.sessionStorage.setItem('InitAdminAddPage', 'Y');
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
            getPreviewData();
        });

        $("#viewStaffAdminAddPreview").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminAddPreview .page-main').css('height', mainHeight);
            $('.addNoticeSendBtn').show();
            getPreviewData();
        });

        $("#viewStaffAdminAddPreview").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminAddPreview").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        $('.addNoticeSendBtn').on('click', function() {
            loadingMask('show');
            //API:get post id first then send new post
            getNewPostID();
        });


    }
});