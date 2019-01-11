$("#viewStaffAdminFeedback").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminFeedback/img/',
            staffKey = 'appempservice';
        
        //获取所有反馈问题
        function getFAQPostList() {
            let faqBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffFAQ']['board_id'].toString();

            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                faqBoardID +
                "</board_id></LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    //readlist
                    let readList = JSON.parse(window.localStorage.getItem('AdminFeedbackList'));
                    if(readList == null) {
                        readList = {};
                    }
                    //data
                    let faqPostList = data['Content'];
                    let content = '';
                    for(var i in faqPostList) {
                        //1.确认已读未读状态
                        let readStatus = false;
                        if(typeof readList[faqPostList[i]['post_id']] == 'undefined') {
                            readList[faqPostList[i]['post_id']] = '';
                        } else {
                            readStatus = true;
                        }
                        //2.post_create_time存在时区问题
                        let now = new Date(faqPostList[i]['post_create_time'].replace(/-/g, '/')).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
                        //3.html
                        content += '<li class="admin-feedback-list" data-id="' +
                            faqPostList[i]['post_id'] +
                            '"><div>' +
                            new Date(now).yyyymmdd('/') + ' ' + new Date(now).hhmm() +
                            '</div><div' +
                            (readStatus ? '' : ' class="unread"') +
                            '>' +
                            faqPostList[i]['post_title'] +
                            '</div></li>';
                    }
                    $('.admin-feedback-ul').html('').append(content);
                    //save to local
                    window.localStorage.setItem('AdminFeedbackList', JSON.stringify(readList));
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostList", successCallback, failCallback, queryData, "");
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminFeedback").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminFeedback").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminFeedback .page-main').css('height', mainHeight);
        });

        $("#viewStaffAdminFeedback").on("pageshow", function(event, ui) {
            getFAQPostList();
        });

        $("#viewStaffAdminFeedback").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/


    }
});