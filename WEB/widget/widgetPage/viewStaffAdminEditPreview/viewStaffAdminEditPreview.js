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
            $('.edit-preview-content').append(postData['content']);
        }

        //上传图档
        function uploadFile(src) {
            var self = this;

            let imgFile = QStoragePlugin.dataURLtoFile(src);
            let queryData = new FormData();
            queryData.append('files', imgFile);
            let resource = announceBoardID + '/' + postData['id'];

            this.successCallback = function (data) {
                //console.log(data);

                if (data['ResultCode'] == '1') {
                    let postURL = data['Content']['thumbnail_1024_url'];
                    let target = data['Content']['target'];
                    editThisPost(postURL, target);
                }
            };

            this.failCallback = function (data) {};

            var __construct = function () {
                QStoragePlugin.QStorageAPI("POST", false, 'appqforum', 'picture/upload', self.successCallback, self.failCallback, queryData, '', resource);
            }();
        }

        //确认修改该post
        function editThisPost(url, tar) {
            url = url || null;
            tar = tar || null;

            let xmlData = {
                emp_no: loginData["emp_no"],
                source: staffKey + appEnvironment,
                post_id: postData['id'],
                post_title: postData['title']
            };

            //是否为新图档
            let fileList = '';
            if(url != null) {
                xmlData['content'] = '<div class="postImg"><img src="' + url + '" data-target="' + tar + '">' +
                    '</div><div class="postContent">' +
                    $('.edit-preview-content .postContent').clone().html() +
                    '</div>';
                //如果是新图，需要新增file_list
                fileList = '<file_list><file>' + url + '</file></file_list>';
            } else {
                xmlData['content'] = $('.edit-preview-content').clone().html();
                //判断是旧图还是无图，旧图也需要file_list替换原图档，无图不需要file_list
                let imgLength = $('.edit-preview-content img').length;
                if(imgLength > 0) {
                    let src = $('.edit-preview-content img').attr('src');
                    fileList = '<file_list><file>' + src + '</file></file_list>';
                }
            }

            let queryData = "<LayoutHeader>" + QForumPlugin.createXMLDataString(xmlData) + fileList + "</LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    //成功后回退到公告页
                    for(var i = 0; i < 2; i++) {
                        pageVisitedList.pop();
                    }
                    onBackKeyDown();
                } else if(data['ResultCode'] == '047906') {
                    //无权修改
                    $("#noAllowFix").fadeIn(100).delay(2000).fadeOut(100);
                }

                loadingMask('hide');
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
            $('.edit-preview-content').html('');
        });


        /********************************** dom event *************************************/
        //送出修改
        $('.editNoticeSendBtn').on('click', function() {
            loadingMask('show');
            //1.判断是否有图档，没有图档可以直接修改
            let imgLength = $('.edit-preview-content img').length;
            if(imgLength == 0) {
                editThisPost();
            } else {
                //2.有图档再判断是否是原图，如果不是原图，需要先上传
                let imgOriginal = $('.edit-preview-content .usable').length;
                if(imgOriginal == 0) {
                    let src = $('.edit-preview-content img').attr('src');
                    uploadFile(src);
                } else {
                    editThisPost();
                }
            }
        });


    }
});