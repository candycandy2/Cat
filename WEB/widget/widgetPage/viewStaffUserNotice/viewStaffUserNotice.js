$("#viewStaffUserNotice").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffUserNotice/img/',
            staffKey = 'appempservice';

        //获取所有公告
        function getNoticePostList() {
            let boardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'].toString();

            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                boardID +
                "</board_id></LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    let postList = data['Content'];
                    let content = '';
                    for(var i in postList) {
                        let now = new Date(postList[i]['post_create_time']).getTime() - new Date().getTimezoneOffset() * 60 * 1000;

                        content += '<li class="notice-list" data-id="' +
                            postList[i]['post_id'] +
                            '"><div><div>' +
                            new Date(now).yyyymmdd('/') + ' ' + new Date(now).hhmm() +
                            '</div><div>' +
                            postList[i]['post_title'] +
                            '</div></div><div></div></li>';
                    }

                    $('.user-notice-ul').html('').append(content);
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostList", successCallback, failCallback, queryData, "");
            }();
        }

        /********************************** page event ***********************************/
        $("#viewStaffUserNotice").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserNotice").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserNotice .page-main').css('height', mainHeight);
        });

        $("#viewStaffUserNotice").on("pageshow", function(event, ui) {
            getNoticePostList();
        });

        $("#viewStaffUserNotice").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转置顶公告（用户版和总机版通用）
        $('.notice-top').on('click', function() {
            checkWidgetPage('viewStaffUserTop', pageVisitedList);
        });

        //跳转到消息详情
        $('.user-notice-ul').on('click', '.notice-list', function() {
            let postID = $(this).data('id');
            let obj = {
                id: postID
            }
            checkWidgetPage('viewStaffUserDetail', pageVisitedList, obj);
        });


    }
});