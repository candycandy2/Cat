$("#viewStaffAdminFeedback").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminFeedback/img/';

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


        /********************************** page event ***********************************/
        $("#viewStaffAdminFeedback").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminFeedback").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminFeedback .page-main').css('height', mainHeight);
        });

        $("#viewStaffAdminFeedback").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminFeedback").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});