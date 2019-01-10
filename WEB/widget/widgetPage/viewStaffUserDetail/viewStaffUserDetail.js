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
                    $('.notice-msg-content').html('').append(detailObj['post_content']);
                    //还需判断是否有图档，通过DOM节点判断
                    let imgLength = $('.notice-msg-content img').length;
                    if(imgLength == 0) {
                        //表示没有图档，可直接显示
                        $('.notice-msg-content').show();
                    } else {
                        //如果有图档，需要获取sas_token拼接到url后面才能正常显示图档
                        let target = $('.notice-msg-content img').data('target');
                        let url = $('.notice-msg-content img').attr('src');
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
                    $('.notice-msg-content img').attr('src', url + '?' + sas_token);
                    $('.notice-msg-content').show();
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
                    $('.notice-msg-content img').attr('src', url + '?' + sasToken['sasToken']);
                    $('.notice-msg-content').show();
                }
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