$("#viewStaffAdminFeedback").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminFeedback/img/';
        let staffKey = 'appempservice';
        let faqBoardID = JSON.parse(window.localStorage.getItem('staffBoardType'))['staffFAQ']['board_id'].toString();

        //初始化總機狀態dropdownlist
        function initAdminSetting() {
            var settingData = {
                id: "adminSettingPopup",
                option: [],
                title: '<input type="text" id="adminSettingNotice" maxlength="15" placeholder="總機公告(限15字)" />',
                defaultText: '暫停服務',
                defaultValue: '0',
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            for(var i in statusList) {
                settingData['option'][i] = {};
                settingData['option'][i]['value'] = statusList[i].id;
                settingData['option'][i]['text'] = statusList[i].item;
            }

            tplJS.DropdownList("viewStaffAdminFeedback", "adminSettingHidden", "prepend", "typeB", settingData);

            //去除默認選擇
            //$('#adminSettingPopup-option-list .tpl-dropdown-list-selected').removeClass('tpl-dropdown-list-selected');
        }

        //获取所有反馈问题
        function getFAQPostList() {
            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source><board_id>" +
                faqBoardID +
                "</board_id></LayoutHeader>";

            var successCallback = function(data) {
                console.log(data);

                if(data['ResultCode'] == '1') {
                    let faqPostList = data['Content'];
                    let content = '';
                    for(var i in faqPostList) {
                        content += '<li class="admin-feedback-list"><div>' +
                            faqPostList[i]['post_create_time'] +
                            '</div><div class="unread">' +
                            faqPostList[i]['post_title'] +
                            '</div></li>';
                    }
                    $('.admin-feedback-ul').append(content);
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