$("#viewStaffUserFeedback").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffUserFeedback/img/';
        let staffKey = 'appempservice';
        let faqBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffFAQ']['board_id'].toString();
        let statusList = ['請選擇', '投影機故障', '缺訊號線', '文具損毀/遺失', '燈泡故障', '空調故障', '其他']

        function initFeedback() {
            //1. meeting room
            let roomData = {
                id: "feedbackRoom",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }

            let arr = JSON.parse(window.sessionStorage.getItem('meetingroomServiceTargetList'));
            for(var i in arr) {
                roomData["option"][i] = {};
                roomData["option"][i]["value"] = arr[i]['target_id_row_id'];
                roomData["option"][i]["text"] = arr[i]['target_id'];
            }

            tplJS.DropdownList("viewStaffUserFeedback", "staffMeetingRoom", "prepend", "typeB", roomData);

            //2. device status
            let statusData = {
                id: "feedbackType",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }

            for(var i = 0; i < statusList.length; i++) {
                statusData["option"][i] = {};
                statusData["option"][i]["value"] = i;
                statusData["option"][i]["text"] = statusList[i];
            }

            tplJS.DropdownList("viewStaffUserFeedback", "staffDeviceType", "prepend", "typeB", statusData);
        }

        function checkAllForm() {
            let meeting = $('#staffMeetingRoom select').val();
            let type = $('#staffDeviceType select').val();
            let otherTextarea = $.trim($('.feedback-textarea textarea').val());

            if(meeting != langStr['wgt_038'] && type != langStr['wgt_038'] && type != '0') {
                if(type == '6' && otherTextarea != '') {
                    $('.confirmSendFeedback').addClass('active-btn-green');
                } else if(type != '6') {
                    $('.confirmSendFeedback').addClass('active-btn-green');
                } else {
                    $('.confirmSendFeedback').removeClass('active-btn-green');
                }
            } else {
                $('.confirmSendFeedback').removeClass('active-btn-green');
            }
        }

        //获取post id
        function getNewPostID() {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source></LayoutHeader>";

            var successCallback = function(data) {

                if(data['ResultCode'] == '1') {
                    let postID = data['Content'];
                    let room = $('#feedbackRoom option:selected').text();
                    let type = $('#feedbackType').val();
                    let other = $.trim($('.feedback-textarea textarea').val());
                    let item = $('#feedbackType option:selected').text();
                    let postTitle = room + " " + (type == '6' ? other : item);
                    
                    sendNewPost(postID, postTitle);
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "getPostId", successCallback, failCallback, queryData, "");
            }();
        }

        //发送反馈问题
        function sendNewPost(postID, postTitle) {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                faqBoardID +
                "</board_id><post_id>" +
                postID +
                "</post_id><post_title>" +
                postTitle +
                "</post_title><content>" +
                postTitle +
                "</content></LayoutHeader>";

            var successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    //success
                    //状况类型设置为请选择
                    $('#feedbackType-option-popup li:eq(0)').trigger('click');
                    popupMsgInit('.thankFeedbackPopup');
                }
            };

            var failCallback = function(data) {};

            var __construct = function() {
                QForumPlugin.CustomAPI("POST", true, "newPost", successCallback, failCallback, queryData, "");
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserFeedback").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserFeedback").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserFeedback .page-main').css('height', mainHeight);

            initFeedback();
        });

        $("#viewStaffUserFeedback").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserFeedback").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //选择会议室
        $('#staffMeetingRoom').on('change', 'select', function() {
            checkAllForm();
        });

        //只有当选择其他项时才能填写内容
        $('#staffDeviceType').on('change', 'select', function() {
            var problemType = $(this).val();
            if(problemType == '6') {
                $('.feedback-textarea').show();
            } else {
                $('.feedback-textarea').hide();
            }
            checkAllForm();
        });

        //送出反馈
        $('.confirmSendFeedback').on('click', function() {
            let has = $(this).hasClass('active-btn-green');

            if(has) {
                getNewPostID();
            }
        });


    }
});