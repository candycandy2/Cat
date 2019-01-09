$("#viewStaffAdminDetail").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminDetail/img/',
            staffKey = 'appempservice',
            detailObj = {};

        //根据post_id获取该帖文的详细内容
        function getPostDetail() {
            let boardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'];
            let postID = JSON.parse(window.sessionStorage.getItem('viewStaffAdminDetail_parmData'))['id'];

            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                boardID +
                "</board_id><post_id>" +
                postID +
                "</post_id><reply_from_seq>1</reply_from_seq><reply_to_seq>2</reply_to_seq></LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    detailObj = data['Content'];
                    $('.notice-detail-title').text(detailObj['post_title']);
                    let now = new Date(detailObj['post_create_time'].replace(/-/g, '/')).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
                    $('.notice-detail-time').text(new Date(now).yyyymmdd('/') + ' ' + new Date(now).hhmm());
                    $('.notice-detail-content').text(detailObj['post_content']);
                    //$('.notice-detail-content').append(detailObj['post_content']);
                    $('.editNoticeBtn').addClass('active-btn-green');
                    //还需判断是否有图档
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostDetails", successCallback, failCallback, queryData, "");
            }();
        }

        //删除该帖文
        function deleteThisPost() {
            let postID = JSON.parse(window.sessionStorage.getItem('viewStaffAdminDetail_parmData'))['id'];

            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><post_id>" +
                postID +
                "</post_id></LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    //删除成功跳转会上一页
                    onBackKeyDown();
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "deletePost", successCallback, failCallback, queryData, "");
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminDetail").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminDetail .page-main').css('height', mainHeight);

            $('.editNoticeBtn').show();
            $('.deleteNoticeBtn').show();
        });

        $("#viewStaffAdminDetail").on("pageshow", function(event, ui) {
            getPostDetail();
        });

        $("#viewStaffAdminDetail").on("pagehide", function(event, ui) {
            $('.notice-detail-title').text('');
            $('.notice-detail-time').text('');
            $('.notice-detail-content').text('');
            $('.editNoticeBtn').removeClass('active-btn-green');
        });


        /********************************** dom event *************************************/
        //enter edit page
        $('.editNoticeBtn').on('click', function() {
            let has = $(this).hasClass('active-btn-green');
            if(has) {
                let obj = {
                    id: detailObj['post_id'],
                    title: detailObj['post_title'],
                    content: detailObj['post_content']
                }
                checkWidgetPage('viewStaffAdminEdit', pageVisitedList, obj);
            }
        });

        //open delete confirm popup
        $('.deleteNoticeBtn').on('click', function() {
            popupMsgInit('.deleteNoticePopup');
        });

        //确定删除该帖文
        $('.confirmDeleteNoticeBtn').on('click', function() {
            deleteThisPost();
        });


    }
});