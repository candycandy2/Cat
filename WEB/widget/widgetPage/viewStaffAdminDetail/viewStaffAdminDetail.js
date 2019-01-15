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
                    $('.notice-detail-content').html('').append(detailObj['post_content']);
                    $('.editNoticeBtn').addClass('active-btn-green');
                    //还需判断是否有图档，通过DOM节点判断
                    let imgLength = $('.notice-detail-content .postImg').children().length;
                    if(imgLength == 0) {
                        //表示没有图档，可直接显示
                        $('.notice-detail-content').show();
                    } else {
                        //如果有图档，需要获取sas_token拼接到url后面才能正常显示图档
                        let target = $('.notice-detail-content img').data('target');
                        let url = $('.notice-detail-content img').attr('src');
                        getSastokenByTarget(target, url);
                    }
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostDetails", successCallback, failCallback, queryData, "");
            }();
        }

        //获取sastoken
        function getSastokenByTarget(tar, url) {
            let self = this;

            let queryStr = '&start=' +
                new Date().toISOString().replace(/\.[0-9]*/, '') +
                '&expiry=' +
                new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().replace(/\.[0-9]*/, '') +//时效设为1年
                '&sp=r';//只读权限

            this.successCallback = function (data) {
                //console.log(data);

                if (data['ResultCode'] == '1') {
                    //1.show
                    let sas_token = data['Content']['sas_token'];
                    $('.notice-detail-content img').attr('src', url + '?' + sas_token);
                    $('.notice-detail-content').show();
                    //2.save to local
                    let obj = {
                        lastUpdateTime: new Date(),
                        sasToken: sas_token
                    };
                    window.localStorage.setItem(tar, JSON.stringify(obj));
                }
            };

            this.failCallback = function (data) {};

            var __construct = function () {
                let sasToken = JSON.parse(window.localStorage.getItem(tar));
                if(sasToken == null || checkDataExpired(sasToken['lastUpdateTime'], 1, 'yy')) {
                    QStoragePlugin.QStorageTokenAPI("GET", true, 'appqforum', 'sastoken/container', self.successCallback, self.failCallback, null, queryStr, tar);
                } else {
                    $('.notice-detail-content img').attr('src', url + '?' + sasToken['sasToken']);
                    $('.notice-detail-content').show();
                }
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
                } else if(data['ResultCode'] == '047906') {
                    //无权删除
                    $("#noAllowDelete").fadeIn(100).delay(2000).fadeOut(100);
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
            let mainHeight = window.sessionStorage.getItem('pageMainHeight');
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
            $('.notice-detail-content').text('').hide();
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
                    content: $('.notice-detail-content').html().toString()
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