$("#viewStaffAdminEditPreview").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminEditPreview/img/',
            announceBoardID = '',
            staffKey = 'appempservice',
            postData = {};

        //获取预览内容
        function getPreviewData() {
            announceBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'].toString();
            postData = JSON.parse(window.sessionStorage.getItem('viewStaffAdminEditPreview_parmData'));
            $('.edit-preview-title').text(postData['title']);
            $('.edit-preview-time').text(new Date().yyyymmdd('/'));
            $('.edit-preview-content').text(postData['content']);

            //是否有图档
            if(postData['url'] != '') {
                $('.edit-preview-img').html('').append('<img src="' + postData['url'] + '">').show();
            } else {
                $('.edit-preview-img').hide();
            }
        }

        //确认修改该post
        function editThisPost() {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><post_id>" +
                postData['id'] +
                "</post_id><post_title>" +
                postData['title'] +
                "</post_title><content>" +
                postData['content'] +
                "</content></LayoutHeader>";

            var successCallback = function(data) {
                console.log(data);

                if(data['ResultCode'] == '1') {
                    //成功后回退到公告页
                    for(var i = 0; i < 2; i++) {
                        pageVisitedList.pop();
                    }
                    onBackKeyDown();
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "modifyPost", successCallback, failCallback, queryData, "");
            }();
        }

        /********************************** page event ***********************************/
        $("#viewStaffAdminEditPreview").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminEditPreview").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminEditPreview .page-main').css('height', mainHeight);
            $('.editNoticeSendBtn').show();
        });

        $("#viewStaffAdminEditPreview").on("pageshow", function(event, ui) {
            getPreviewData();
        });

        $("#viewStaffAdminEditPreview").on("pagehide", function(event, ui) {
            $('.edit-preview-title').text('');
            $('.edit-preview-time').text('');
            $('.edit-preview-content').text('');
        });


        /********************************** dom event *************************************/
        //送出修改
        $('.editNoticeSendBtn').on('click', function() {
            editThisPost();
        });


    }
});