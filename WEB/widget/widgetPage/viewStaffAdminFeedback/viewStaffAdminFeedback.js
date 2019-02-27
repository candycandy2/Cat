$("#viewStaffAdminFeedback").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminFeedback/img/';

        //获取所有反馈问题
        function getpostList() {
            //readlist
            let readList = JSON.parse(window.localStorage.getItem('AdminFeedbackList')) || {};
            //postlist
            let postList = JSON.parse(window.sessionStorage.getItem('AdminFeedBackArray')) || [];
            if(postList.length > 0) {
                $('.no-feedback-data').hide();
                let content = '';
                for(var i in postList) {
                    //1.确认已读未读状态
                    let readStatus = false;
                    if(typeof readList[postList[i]['post_id']] == 'undefined') {
                        readList[postList[i]['post_id']] = '';
                    } else {
                        readStatus = true;
                    }
                    //2.post_create_time存在时区问题
                    let now = new Date(postList[i]['post_create_time'].replace(/-/g, '/')).getTime() - new Date().getTimezoneOffset() * 60 * 1000;
                    //3.html
                    content += '<li class="admin-feedback-list" data-id="' +
                        postList[i]['post_id'] +
                        '"><div>' +
                        new Date(now).yyyymmdd('/') + ' ' + new Date(now).hhmm() +
                        '</div><div' +
                        (readStatus ? '' : ' class="unread"') +
                        '>' +
                        postList[i]['post_title'] +
                        '</div></li>';
                }
                $('.admin-feedback-ul').html('').append(content);
                //save to local
                window.localStorage.setItem('AdminFeedbackList', JSON.stringify(readList));
            } else {
                $('.no-feedback-data').show();
                $('.admin-feedback-ul').html('');
            }

            //隐藏badge
            $('#feedbackBadge').hide();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminFeedback").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminFeedback").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminFeedback .page-main').css('height', mainHeight);
        });

        $("#viewStaffAdminFeedback").on("pageshow", function(event, ui) {
            getpostList();
        });

        $("#viewStaffAdminFeedback").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/


    }
});