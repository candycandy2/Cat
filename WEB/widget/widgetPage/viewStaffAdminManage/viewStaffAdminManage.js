$("#viewStaffAdminManage").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminManage/img/',
            limitMeetingRoom = ['T00', 'T13'];

        function getMeetingRoom() {
            var self = this;
            var queryData = {};

            this.successCallback = function(data) {
                console.log(data);

                if(data['ResultCode'] == '1') {
                    let meetingRoomArr = data['Content'];
                    let meetingRoomObj = {
                        'content': meetingRoomArr,
                        'lastUpdateTime': new Date()
                    };
                    window.localStorage.setItem('AllMeetingRoomData', JSON.stringify(meetingRoomObj));

                    var bqtMeetingRoom = getMeetingRoomBySite(meetingRoomArr, limitMeetingRoom, '2');
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                let meetingRoomData = JSON.parse(window.localStorage.getItem('AllMeetingRoomData'));
                if(meetingRoomData == null || checkDataExpired(meetingRoomData['lastUpdateTime'], 7, 'dd')) {
                    CustomAPI("POST", true, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData, "");
                } else {
                    var bqtMeetingRoom = getMeetingRoomBySite(meetingRoomData['content'], limitMeetingRoom, '2');
                }
            }();
        }

        //MeetingRoomSite: 1:QTY、2:BQT/QTT、43:双星、100:QTH
        function getMeetingRoomBySite(arr, limit, site) {
            var siteObj = {};
            for(var i in arr) {
                //找site
                if(site == arr[i]['MeetingRoomSite']) {
                    var status = false;
                    for(var j in limit) {
                        //找limit
                        if(arr[i]['MeetingRoomName'] == limit[j]) {
                            status = true;
                            break;
                        }
                    }
                    if(!status) {
                        //找floor
                        if(typeof siteObj[arr[i]['MeetingRoomFloor']] == 'undefined') {
                            siteObj[arr[i]['MeetingRoomFloor']] = [];
                            siteObj[arr[i]['MeetingRoomFloor']].push(arr[i]);
                        } else {
                            siteObj[arr[i]['MeetingRoomFloor']].push(arr[i]);
                        }
                    }
                }
            }

            return siteObj;
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminManage").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminManage").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminManage .page-main').css('height', mainHeight);
            $('.editNoticePreviewBtn').show();

            $('.select-room-icon').attr('src', serverURL + imgURL + 'switch_close.png');
            $('.selected-room-icon').attr('src', serverURL + imgURL + 'switch_open.png');

            getMeetingRoom();
        });

        $("#viewStaffAdminManage").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminManage").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //切換所有和擁有
        $('.admin-manage-navbar > div').on('click', function() {
            let has = $(this).hasClass('active-navbar');

            if(!has) {
                let type = $(this).data('type');
                $(this).addClass('active-navbar');
                if(type == 'all') {
                    $('div[data-type="my"]').removeClass('active-navbar');
                    $('.admin-manage-my').hide();
                } else {
                    $('div[data-type="all"]').removeClass('active-navbar');
                    $('.admin-manage-all').hide();
                }
                $('.admin-manage-' + type).show();
            }
        });

        //單選按鈕
        $('.select-room-icon, .selected-room-icon').on('click', function() {
            let dataSrc = $(this).attr('data-src');
            let reverseSrc = dataSrc == 'close' ? 'open' : 'close';
            $(this).attr('src', serverURL + imgURL + 'switch_' + reverseSrc + '.png');
            $(this).attr('data-src', reverseSrc);
        });


    }
});