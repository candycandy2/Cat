$("#viewStaffAdminManage").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminManage/img/',
            limitMeetingRoom = ['T00', 'T13'],
            siteMeetingRoom;

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

                    //1.获取BQT所有会议室
                    siteMeetingRoom = getMeetingRoomBySite(meetingRoomArr, limitMeetingRoom, '2');
                    //2.根据楼层生成dropdownlist
                    createFloorSelect(siteMeetingRoom);
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                let meetingRoomData = JSON.parse(window.localStorage.getItem('AllMeetingRoomData'));
                if(meetingRoomData == null || checkDataExpired(meetingRoomData['lastUpdateTime'], 7, 'dd')) {
                    CustomAPI("POST", true, "ListAllMeetingRoom", self.successCallback, self.failCallback, queryData, "");
                } else {
                    //1.获取BQT所有会议室
                    siteMeetingRoom = getMeetingRoomBySite(meetingRoomData['content'], limitMeetingRoom, '2');
                    //2.根据楼层生成dropdownlist
                    createFloorSelect(siteMeetingRoom);
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
                        }
                        siteObj[arr[i]['MeetingRoomFloor']].push(arr[i]);
                    }
                }
            }

            return siteObj;
        }

        //遍历BQT所有会议室所在楼层
        function createFloorSelect(arr) {
            let floorData = {
                id: "bqtFloor",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }

            let j = 0;
            for(var i in arr) {
                floorData["option"][j] = {};
                floorData["option"][j]["value"] = i;
                floorData["option"][j]["text"] = i + 'F';
                j++;
            }

            tplJS.DropdownList("viewStaffAdminManage", "meetingRoomFloor", "prepend", "typeB", floorData);

            $('#bqtFloor-option-list li:eq(0)').trigger('click');
        }

        //选择楼层显示不同的会议室
        function getMeetingRoomByFloor(arr, floor) {
            let content = '';
            for(var i in arr[floor]) {
                content += '<li class="meeting-room-list"><div>' +
                    arr[floor][i]['MeetingRoomName'] +
                    '</div><div><img class="select-room-icon" data-src="close" src="' +
                    serverURL + imgURL +
                    'switch_close.png"></div></li>';
            }

            $('.meeting-room-ul').html('').append(content);
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminManage").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminManage").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminManage .page-main').css('height', mainHeight);
            $('.editNoticePreviewBtn').show();

            // $('.select-room-icon').attr('src', serverURL + imgURL + 'switch_close.png');
            // $('.selected-room-icon').attr('src', serverURL + imgURL + 'switch_open.png');

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
        $('.meeting-room-ul').on('click', '.select-room-icon, .selected-room-icon', function() {
            let dataSrc = $(this).attr('data-src');
            let reverseSrc = dataSrc == 'close' ? 'open' : 'close';
            $(this).attr('src', serverURL + imgURL + 'switch_' + reverseSrc + '.png');
            $(this).attr('data-src', reverseSrc);
        });

        //筛选楼层
        $('#meetingRoomFloor').on('change', 'select', function() {
            let floor = $(this).val();
            getMeetingRoomByFloor(siteMeetingRoom, floor);
        });


    }
});