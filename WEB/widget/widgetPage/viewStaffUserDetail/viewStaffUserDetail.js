$("#viewStaffUserDetail").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffUserDetail/img/',
            staffKey = 'appempservice';

        //根据post_id获取该帖文的详细内容
        function getPostDetail() {
            let boardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffAnnounce']['board_id'];
            let postID = JSON.parse(window.sessionStorage.getItem('viewStaffUserDetail_parmData'))['id'];

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
                    let detailObj = data['Content'];
                    $('.notice-msg-title').text(detailObj['post_title']);
                    let now = new Date(detailObj['post_create_time'].replace(/-/g, '/')).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
                    $('.notice-msg-time').text(new Date(now).yyyymmdd('/') + ' ' + new Date(now).hhmm());
                    $('.notice-msg-content').text(detailObj['post_content']);
                    //还需判断是否有图档
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostDetails", successCallback, failCallback, queryData, "");
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserDetail").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserDetail .page-main').css('height', mainHeight);
        });

        $("#viewStaffUserDetail").on("pageshow", function(event, ui) {
            getPostDetail();
        });

        $("#viewStaffUserDetail").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});