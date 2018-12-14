$("#viewStaffAdminMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminMain/img/',
            rrsKey = 'apprrs',
            rrsSecret = '2e936812e205445490efb447da16ca13',
            statusList = [
            {id: 1, item: '服務中'},
            {id: 2, item: '忙碌中'},
            {id: 3, item: '暫停服務'},
        ];

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

            tplJS.DropdownList("viewStaffAdminMain", "adminSettingHidden", "prepend", "typeB", settingData);

            //去除默認選擇
            //$('#adminSettingPopup-option-list .tpl-dropdown-list-selected').removeClass('tpl-dropdown-list-selected');
        }

        function getMeetingRoom() {
            var self = this;
            var queryData = {};

            this.successCallback = function(data) {
                console.log(data);
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPIByKey("POST", true, rrsKey, rrsSecret, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData, "", 60 * 60, "low");
                CustomAPI("POST", true, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData, "");
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminMain .page-main').css('height', mainHeight);
            initAdminSetting();
        });

        $("#viewStaffAdminMain").on("pageshow", function(event, ui) {
            getMeetingRoom();
        });

        $("#viewStaffAdminMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切換本日和明日
        $('.admin-main-navbar > div').on('click', function() {
            var has = $(this).hasClass('active-navbar');

            if(!has) {
                var type = $(this).data('type');
                $(this).addClass('active-navbar');
                if(type == 'today') {
                    $('div[data-type="tomorrow"]').removeClass('active-navbar');
                    $('.admin-main-tomorrow').hide();
                } else {
                    $('div[data-type="today"]').removeClass('active-navbar');
                    $('.admin-main-today').hide();
                }
                $('.admin-main-' + type).show();
            }
        });

        //左滑 打開handle
        $('.today-item').on('swipeleft', function() {
            $(this).animate({left: '-40vw'}, 200, 'linear');
        });

        //右滑 關閉handle
        $('.today-item').on('swiperight', function() {
            $(this).animate({left: '0'}, 200, 'linear');
        });

        //setting admin status
        $('#adminSettingBtn').on('click', function() {
            $('#adminSettingPopup').trigger('click');
        });

        //彈窗關閉，text控件失焦
        $(document).on("popupafterclose", "#adminSettingPopup-option-popup", function() {
            $('#adminSettingNotice').blur();
            //value
            var value = $('#adminSettingNotice').val();
            $('.title-text-now').text(value);
            //text
            var text = $.trim($('#adminSettingPopup').text());
            $('.title-text-status').text(text);
        });

        //改變狀態
        $(document).on('change', '#adminSettingPopup', function() {
            var statusValue = $(this).val();
            if(statusValue == 1) {
                $('.main-title-status').removeClass('active-status-false').addClass('active-status-true');
            } else if (statusValue == 2) {
                $('.main-title-status').removeClass('active-status-true').addClass('active-status-false');
            } else {
                $('.main-title-status').removeClass('active-status-true').removeClass('active-status-false');
            }
        });


    }
});