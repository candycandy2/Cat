$("#viewStaffAdminAddPreview").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminAddPreview/img/',
            staffKey = 'appempservice',
            announceBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'].toString();

        //获取预览内容
        function getPreviewData() {
            let parmData = JSON.parse(window.sessionStorage.getItem('viewStaffAdminAddPreview_parmData'));
            $('.add-preview-title').text(parmData['postTitle']);
            $('.add-preview-text').text(parmData['postContent']);
            $('.add-preview-time').text(new Date().yyyymmdd('/'));
            if(parmData['postURL'] != '') {
                $('.add-preview-img').html('').show().append('<img src="' + parmData['postURL'] + '">');
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
                    let postID = data['Content'];
                    
                    sendNewPost(postID, noticeTitle, noticeContext);
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostId", successCallback, failCallback, queryData, "");
            }();
        }

        function uploadFile(queryData, resource) {
            var self = this;

            this.successCallback = function (data) {
                console.log(data);
                if (data['ResultCode'] == '1') {

                }

            };

            this.failCallback = function (data) {};

            var __construct = function () {
                QStoragePlugin.QStorageAPI("POST", true, 'appqforum', 'picture/upload', self.successCallback, self.failCallback, queryData, '', resource);
            }();
        }

        //发送公告
        function sendNewPost(postID, postTitle, postContent) {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                announceBoardID +
                "</board_id><post_id>" +
                postID +
                "</post_id><post_title>" +
                postTitle +
                "</post_title><content>" +
                postContent +
                "</content></LayoutHeader>";

            var successCallback = function(data) {
                console.log(data);
                if(data['ResultCode'] == '1') {
                    //success
                    console.log('success');
                }
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

        });


        /********************************** dom event *************************************/


    }
});