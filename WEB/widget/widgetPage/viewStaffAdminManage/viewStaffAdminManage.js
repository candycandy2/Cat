$("#viewStaffAdminManage").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminManage/img/',
            siteMeetingRoom,//BQT所有会议室
            bqtSiteCode = '2',
            targetMeetingRoom = JSON.parse(window.sessionStorage.getItem('meetingroomServiceTargetList'));//已选择的会议室，通过API获得

        function getMeetingRoom() {
            var self = this;
            var queryData = {};

            this.successCallback = function(data) {
                //console.log(data);

                if(data['ResultCode'] == '1') {
                    let meetingRoomArr = data['Content'];
                    let meetingRoomObj = {
                        'content': meetingRoomArr,
                        'lastUpdateTime': new Date()
                    };
                    window.localStorage.setItem('AllMeetingRoomData', JSON.stringify(meetingRoomObj));

                    //1.获取BQT所有会议室，代号2
                    siteMeetingRoom = getMeetingRoomBySite(meetingRoomArr, bqtSiteCode);
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
                    //1.获取BQT所有会议室，代号2
                    siteMeetingRoom = getMeetingRoomBySite(meetingRoomData['content'], bqtSiteCode);
                    //2.根据楼层生成dropdownlist
                    createFloorSelect(siteMeetingRoom);
                }
            }();
        }

        //MeetingRoomSite: 1:QTY、2:BQT/QTT、43:双星、100:QTH
        function getMeetingRoomBySite(arr, site) {
            var siteObj = {};
            for(var i in arr) {
                //找site
                if(site == arr[i]['MeetingRoomSite']) {
                    //找floor
                    if(typeof siteObj[arr[i]['MeetingRoomFloor']] == 'undefined') {
                        siteObj[arr[i]['MeetingRoomFloor']] = [];
                    }
                    siteObj[arr[i]['MeetingRoomFloor']].push(arr[i]);
                    
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
            let content = '';
            for(var i in arr) {
                floorData["option"][j] = {};
                floorData["option"][j]["value"] = i;
                floorData["option"][j]["text"] = i + 'F';
                //动态生成对应楼层的ul
                content += '<ul class="meeting-room-ul floor-' + i + '"></ul>';
                j++;
            }

            tplJS.DropdownList("viewStaffAdminManage", "meetingRoomFloor", "prepend", "typeB", floorData);
            //减少间距
            let typeWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('bqtFloor', null, typeWidth);
            //动态生成楼层的ul
            $('.floor-meeting-room').append(content);
            //生成所有楼层的list
            for(var i in arr) {
                getMeetingRoomByFloor(arr, i);
            }
            //遍历我管理的会议室，将close改为open
            getMyTargetMeetingRoom();

            $('#bqtFloor-option-list li:eq(0)').trigger('click');
        }

        //选择楼层显示不同的会议室
        function getMeetingRoomByFloor(arr, floor) {
            let content = '';
            for(var i in arr[floor]) {
                content += '<li class="meeting-room-list" data-item="' +
                    arr[floor][i]['MeetingRoomName'] +
                    '"><div>' +
                    arr[floor][i]['MeetingRoomName'] +
                    '</div><div><img class="select-room-icon" data-src="close" src="' +
                    serverURL + imgURL +
                    'switch_close.png"></div></li>';
            }

            $('.floor-' + floor).append(content);
        }

        //第一次获取我管理的会议室
        function getMyTargetMeetingRoom() {
            let content = '';
            for(var i in targetMeetingRoom) {
                //1.获取会议室及target_id
                let meetingRoomCode = targetMeetingRoom[i]['target_id'];
                //2.改变已管理会议室状态为open
                $('.meeting-room-list[data-item="' + meetingRoomCode + '"]').find('.select-room-icon').attr('data-src', 'open');
                $('.meeting-room-list[data-item="' + meetingRoomCode + '"]').find('img').attr('src', serverURL + imgURL +'switch_open.png');
                //3.为我管理的会议室新增html
                content += '<li class="my-meeting-room-list" data-item="' +
                    meetingRoomCode +
                    '"><div>' +
                    meetingRoomCode +
                    '</div><div><img class="select-room-icon" data-src="open" src="' +
                    serverURL + imgURL +
                    'switch_open.png"></div></li>';
            }

            $('.selected-meeting-room-ul').append(content);
        }

        //设置target meetingroom
        function setMeetingRoomTarget(status, code) {
            var self = this;

            let queryData = {
                service_id: 'meetingroomService',
                login_id: loginData['loginid'],
                domain: loginData['domain'],
                emp_no: loginData['emp_no']
            };

            //根据status判断新增new还是删除delete
            let statusKey = (status == 'open' ? 'new' : 'delete');
            queryData[statusKey] = [{
                target_id: code,
                life_type: 0,
                reserve_limit: 1
            }];

            this.successCallback = function(data) {
                //console.log(code + statusKey + data['message']);
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                EmpServicePlugin.QPlayAPI("POST", "setEmpServiceTarget", self.successCallback, self.failCallback, JSON.stringify(queryData), '');
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffAdminManage").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminManage").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminManage .page-main').css('height', mainHeight);
            //获取所有会议室
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
        $('.floor-meeting-room').on('click', '.select-room-icon, .selected-room-icon', function() {
            let dataSrc = $(this).attr('data-src');
            let reverseSrc = (dataSrc == 'close' ? 'open' : 'close');
            $(this).attr('src', serverURL + imgURL + 'switch_' + reverseSrc + '.png');
            $(this).attr('data-src', reverseSrc);

            //更新到我管理的会议室UI，open为append，close为remove
            let meetingRoomCode = $(this).parent().parent().data('item');
            if(reverseSrc == 'open') {
                let content = '<li class="my-meeting-room-list" data-item="'+
                    meetingRoomCode +
                    '"><div>' +
                    meetingRoomCode +
                    '</div><div><img class="select-room-icon" data-src="open" src="' +
                    serverURL + imgURL +
                    'switch_open.png"></div></li>';

                $('.selected-meeting-room-ul').append(content);
            } else {
                $('.my-meeting-room-list[data-item="' + meetingRoomCode + '"]').remove();
            }

            //API:取消或管理会议室，open为new，close为delete
            setMeetingRoomTarget(reverseSrc, meetingRoomCode);
        });

        //我管理的会议室单选按钮
        $('.selected-meeting-room-ul').on('click', '.select-room-icon', function() {
            let meetingRoomCode = $(this).parent().parent().data('item');
            $('.meeting-room-list[data-item="' + meetingRoomCode + '"]').find('img').trigger('click');
        });

        //筛选楼层
        $('#meetingRoomFloor').on('change', 'select', function() {
            let floor = $(this).val();
            $('.meeting-room-ul').removeClass('active-floor');
            $('.floor-' + floor).addClass('active-floor');
            //减少间距
            let typeWidth = setDropdownlistWidth(3);
            tplJS.reSizeDropdownList('bqtFloor', null, typeWidth);
        });


    }
});