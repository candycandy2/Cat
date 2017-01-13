$(document).one('pagecreate', '#viewReserve', function() {

    var SiteData = {};
    var roomData = {};
    var floorData = {};
    var clickSiteId = '';
    var siteCategoryID = '';
    var clickDateId = '';
    var clickRomeId = '';
    var clickTraceID = '';
    var quickReserveClickDateID = '';
    var quickRserveCallBackData = {};
    var timeClick = [];
    var timeNameClick = [];
    var tempTimeNameClick = '';
    var reserveDetailLocalData = [];

    $('#viewReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getFloorData(siteIndex) {
                htmlContent = '';
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                var originItemForFloor = ['FloorId', 'defaultFloorList', 'FloorName'];
                $('#reserveFloor').find('option').remove();

                for (var i = 0, item; item = meetingRoomData.children[siteIndex].children[i]; i++) {
                    htmlContent += '<option id=' + item.data + ' value=' + item.data + '>' + item.data + '</option>';
                }

                $('#reserveFloor').append(htmlContent);
                //var firstNode = meetingRoomData.children[siteIndex].children[0].data;
                //$('#reserveFloor-button').find('span').text(firstNode);

                $("#reserveFloor option:first").attr("selected", "selected");
                getRoomData(siteIndex, '0');
            }

            function getRoomData(siteIndex, floorIndex) {
                htmlContent = '';
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                floorIndex = floorIndex == '' ? '0' : floorIndex;
                $('#reserveRoom').find('a').remove();

                for (var i = 0, item; item = meetingRoomData.children[siteIndex].children[floorIndex].children[i]; i++) {
                    if (arrLimitRoom.indexOf(item.data.MeetingRoomName) == -1) {
                        htmlContent += '<a id=' + item.data.MeetingRoomID + ' value=' + item.data.MeetingRoomID + ' href="#" class="ui-link" IsReserveMulti=' + item.data.IsReserveMulti + '>' + item.data.MeetingRoomName + '</a>';
                    }
                }

                $('#reserveRoom').append(htmlContent);
                clickRomeId = $('#reserveRoom a:first-child').attr('id');
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));
            }

            function settingList() {
                htmlContent = '';
                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                $('option[id^=setList-]').remove();

                //var firstTitle = '';
                if (roomSettingdata != null) {
                    sortDataByKey(roomSettingdata.content, 'id', 'asc');
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strValue = item.site + '&' + item.floor + '&' + item.people + '&' + item.timeID;
                        htmlContent += '<option id=setList-' + item.id + ' value=' + strValue + ' floorName=' + item.floorName + ' time=' + item.time + '>' + item.title + '</option>';
                        // if (i == 0) {
                        //     firstTitle = item.title;
                        // }
                    }
                }

                $('#reserveSetting').append(htmlContent);
                //$('#reserveSetting-button').find('span').text(firstTitle);

                $("#reserveSetting option:first").attr("selected", "selected");

                //to do aaa
                setSettingArea();
                quickReserveBtnDefaultStatus();
            }

            function setDateList() {
                $('#scrollDate a[id^=one]').remove();
                $('#quickReserveScrollDate a[id^=two]').remove();

                var addOneDate = new Date();
                var htmlContentPageOne = '';
                var htmlContentPageTwo = '';
                var arrClass = ['a', 'b', 'c', 'd', 'e'];

                var objDate = new Object()
                objDate.date = '';
                objDate.daysOfWeek = '';

                var j = 0;
                var originItemForPageOne = ['reserveDefault', 'ReserveDay', 'ReserveDict', 'disable'];
                var originItemForPageTwo = ['quickReserveDefault', 'quickReserveDay', 'quickReserveDict', 'ui-block-a', 'disable'];

                for (var i = 0; i < reserveDays; i++) {
                    if (i != 0) {
                        addOneDate.addDays(1);
                    }
                    if (addOneDate.getDay() > 0 && addOneDate.getDay() < 6) {

                        var classId = arrClass[j % 5];
                        objDate.id = addOneDate.yyyymmdd('');
                        objDate.date = addOneDate.mmdd('/');
                        objDate.daysOfWeek = dictDayOfWeek[addOneDate.getDay()];

                        var replaceItemForPageOne = ['one' + objDate.id, objDate.date, objDate.daysOfWeek, ''];
                        var replaceItemForPageTwo = ['two' + objDate.id, objDate.date, objDate.daysOfWeek, 'ui-block-' + classId, ''];

                        htmlContentPageOne
                            += replaceStr($('#reserveDefault').get(0).outerHTML, originItemForPageOne, replaceItemForPageOne);
                        htmlContentPageTwo
                            += replaceStr($('#quickReserveDefault').get(0).outerHTML, originItemForPageTwo, replaceItemForPageTwo);
                        j++;
                    }
                }

                $('#reserveDefault').before(htmlContentPageOne);
                $('#quickReserveDefault').before(htmlContentPageTwo);
                clickDateId = $('#scrollDate a:first-child').attr('id').replaceAll('one', '');
                quickReserveClickDateID = $('#quickReserveScrollDate a:first-child').attr('id').replaceAll('one', '');

                $('#scrollDate a:first-child').addClass('hover');
                $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
                $('#quickReserveScrollDate a:first-child').addClass('hover');
                $('#quickReserveScrollDate a:first-child').parent().data("lastClicked", $('#quickReserveScrollDate a:first-child').attr('id'));
            }

            function getMettingStatus() {
                htmlContent = '';
                $('#defaultTimeSelectId').nextAll().remove();
                var arrClass = ['a', 'b', 'c', 'd'];
                var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', 'circle-icon', '[msg]', '[ext]', '[email]', '[traceID]'];
                var j = 0;

                //var filterTimeBlock = grepData(arrTimeBlock, 'category', siteCategoryID);
                var filterTimeBlock = grepData(arrTimeBlockBySite, 'siteCategoryID', siteCategoryID)[0].data;

                for (var item in filterTimeBlock) {
                    var classId = arrClass[j % 4];
                    var reserveClass = 'ui-color-noreserve';
                    var reserveIconClass = 'circleIcon iconSelect';
                    var msg = '',
                        eName = '',
                        ext = '',
                        email = '',
                        traceID = '';
                    var bTime = filterTimeBlock[item].time;
                    var timeID = filterTimeBlock[item].timeID;
                    var roomName = $('#reserveRoom .hover').text();

                    for (var i = 0, arr; arr = arrReserve[i]; i++) {
                        if (arr.detailInfo['bTime'] == bTime) {
                            if (arr.detailInfo['eName'] == loginData['loginid']) {
                                reserveClass = 'ui-color-myreserve';
                            } else {
                                reserveClass = 'ui-color-reserve';
                            }
                            reserveIconClass = '';
                            eName = arr.detailInfo['eName'];
                            ext = arr.detailInfo['ext'];
                            email = arr.detailInfo['email'];
                            traceID = arr.detailInfo['traceID'];
                            msg = arr.date + ',' + roomName + ',' + arr.detailInfo['bTime'] + '-' + addThirtyMins(arr.detailInfo['bTime']) + ',' + eName

                            //to do 
                            //array pop data
                            //arrReserve.pop(arr);
                        }
                    }
                    var replaceItem = ['time-' + timeID, bTime.trim(), eName, 'ui-block-' + classId, '', reserveClass, reserveIconClass, msg, ext, email, traceID];

                    htmlContent
                        += replaceStr($('#defaultTimeSelectId').get(0).outerHTML, originItem, replaceItem);

                    msg = '';
                    j++;
                }

                $('#reserveDateSelect > div').append(htmlContent);
            }

            function getReserveData(roomId, date, data, type) {
                loadingMask("show");
                arrReserve = [];
                for (var i = 0, item; item = data[i]; i++) {
                    var newReserve = new reserveObj(roomId, date);
                    newReserve.addDetail('traceID', item.ReserveTraceID);
                    newReserve.addDetail('eName', item.EMail.substring(0, item.EMail.indexOf('@')));
                    newReserve.addDetail('bTime', item.BTime);
                    newReserve.addDetail('ext', item.Ext_No.replace('-', ''));
                    newReserve.addDetail('email', item.EMail);
                    arrReserve.push(newReserve);
                }

                if (type === 'dataNotExist') {
                    //save to local data
                    var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                    var newReserveLocalDataObj = new reserveLocalDataObj(roomId, date, data);
                    reserveDetailLocalData.push(newReserveLocalDataObj);
                    localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));
                }

                getMettingStatus();
                loadingMask("hide");
            }

            function reserveBtnDefaultStatus() {
                $('#reserveBtn').removeClass('btn-benq');
                $('#reserveBtn').addClass('btn-disable');
                if ($('div[id^=time]').hasClass('hover')) {
                    $('div[id^=time]').removeClass('hover');
                    $(this).find('div:nth-child(2)').removeClass('iconSelected');
                    $(this).find('div:nth-child(2)').addClass('iconSelect');
                }
                timeClick = [];
                timeNameClick = [];
            }

            function setSettingArea() {
                //to do aaa
                var strValue = $('#reserveSetting').find(":selected").val();
                var arrValue = strValue.split('&');
                var strSite = dictSite[arrValue[0]];
                var strPeople = (arrValue[2] == '0') ? '不限' : (arrValue[2] == '1') ? '2~8人' : '8人以上';
                var strTime = $('#reserveSetting').find(":selected").attr('time');
                strTime = (strTime == 'none') ? "現在起一小時" : strTime;
                var strFloorName = $('#reserveSetting').find(":selected").attr('floorName');
                strFloorName = (strFloorName == 'none') ? '不限' : strFloorName;

                $('#settingAreaSite').text('地點: ' + strSite);
                $('#settingAreaPeople').text('人數: ' + strPeople);
                $('#settingAreaTime').text('時段: ' + strTime);
                $('#settingAreaFloor').text('樓層: ' + strFloorName.replaceAll(',', ', '));
            }

            function quickReserveBtnDefaultStatus() {
                $('#quickReserveMsgArea div:nth-child(2)').html('');
                $('#quickReserveMsgArea div:nth-child(3)').html('');
                $('#quickReserveMsgArea').addClass('disable');
                $('#quickReserveCancel').addClass('disable');
                $('#quickReserveConfirm').addClass('disable');
                $('#quickReserve').removeClass('disable');
                $('#quickReserve').removeClass('btn-disable');
                $('#quickReserve').addClass('btn-benq');
            }

            function quickReserveBtnActiveStatus() {
                $('#quickReserveMsgArea').removeClass('disable');
                $('#quickReserveCancel').removeClass('disable');
                $('#quickReserveConfirm').removeClass('disable');
                $('#quickReserve').removeClass('btn-benq');
                $('#quickReserve').addClass('btn-disable');
                $('#quickReserve').addClass('disable');
            }

            function checkReserveSameTime(date) {
                var isReserveMulti = $('#' + clickRomeId).attr('IsReserveMulti');
                var bResult = false;
                var isExistInArray = false;
                var selectedSite = $('#reserveSite').find(":selected").val();
                var isSuperRole = searchTree(roleData, dictRole['super'], '');
                var inLimitSite = searchTree(isSuperRole, selectedSite, '');

                if ((isSuperRole != null && inLimitSite != null) || isReserveMulti === 'N') {
                    bResult = true;
                } else {
                    var myReserveFilterData = myReserveLocalData.filter(function(item) {
                        return item.date == date;
                    });

                    if (myReserveFilterData.length === 0) {
                        bResult = true;
                    } else {
                        $.each(myReserveFilterData, function(index, value) {
                            if (timeNameClick.indexOf(value.time) != -1) {
                                isExistInArray = true;
                            }
                        });
                        bResult = !isExistInArray;
                    }
                }

                return bResult;
            }

            function setAlertLimitRoom(site, floor) {
                $("#alertLimitRoomMsg").addClass('disable');
                $("#alertLimitRoomMsg").html('');
                if (site == getKeyByValue(dictSite, 'QTY')) {
                    $("#alertLimitRoomMsg").removeClass('disable');
                    if (floor == '3F') {
                        $("#alertLimitRoomMsg").html('A30、E31會議室請使用PC預約');
                    } else if (floor == '7F') {
                        $("#alertLimitRoomMsg").html('A70、B71會議室請使用PC預約');
                    }
                } else if (site == getKeyByValue(dictSite, 'BQT/QTT') && floor == '1F') {
                    $("#alertLimitRoomMsg").removeClass('disable');
                    $("#alertLimitRoomMsg").html('T00、T13會議室請使用PC預約');
                }
            }

            function setRoleAndDateList(site) {
                var isSystemRole = searchTree(roleData, dictRole['system'], '');
                var isSecretaryRole = searchTree(roleData, dictRole['secretary'], '');
                var inLimitSite = searchTree(isSecretaryRole, site, '');

                if (isSystemRole != null || (isSecretaryRole != null && inLimitSite != null)) {
                    reserveDays = 120;
                } else {
                    reserveDays = 14;
                }
                setDateList();
            }

            function calSelectWidth(obj) {
                $("#tmp_option_width").html($('#' + obj.attr('id') + ' option:selected').text());
                if (obj.attr('id') == 'reserveFloor') {
                    obj.css('width', $('#tmp_option_width').outerWidth() + 28);
                } else if (obj.attr('id') == 'reserveSite') {
                    obj.css('width', $('#tmp_option_width').outerWidth() + 35);
                } else {
                    obj.css('width', $('#tmp_option_width').outerWidth() + 42);
                }
            }

            function getAPIQueryReserveDetail(roomId, date, checkDataExist) {
                //local data exist
                var dataExist = false;
                if (checkDataExist) {
                    reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                    for (var item in reserveDetailLocalData) {
                        var obj = reserveDetailLocalData[item];
                        if ((obj.roomId === roomId && obj.date === date) && !checkDataExpired(obj.lastUpdateTime, 1, 'mm')) {
                            getReserveData(roomId, date, obj.data, 'dataExist');
                            dataExist = true;
                        }
                    }
                }

                if (!dataExist) {
                    loadingMask('show');
                    var self = this;
                    var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate></LayoutHeader>';

                    this.successCallback = function(data) {
                        if (data['ResultCode'] === "1") {
                            getReserveData(roomId, date, data['Content'], 'dataNotExist');
                        }
                        loadingMask('hide');
                    };

                    var __construct = function() {
                        QPlayAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, queryData);
                    }();
                }
            }

            function getAPIReserveMeetingRoom(page, roomId, date, timeID) {
                loadingMask('show');
                var self = this;
                var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTimeID>' + timeID + '</ReserveTimeID></LayoutHeader>';

                this.successCallback = function(data) {

                    if (data['ResultCode'] === "002902") {
                        //Reservation Successful
                        popupMsg('reserveSuccessMsg', '', '會議室預約成功', '', false, '確定', '');
                        if (page == 'pageOne') {
                            var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);

                            var jsonData = [];
                            var selectedSite = $('#reserveSite').find(":selected").val();
                            $.each(timeNameClick, function(index, value) {
                                jsonData = {
                                    site: selectedSite,
                                    date: clickDateId,
                                    time: value
                                };
                                myReserveLocalData.push(jsonData);
                            });

                            reserveBtnDefaultStatus();
                        }

                    } else if (data['ResultCode'] === "002903") {
                        //Reservation Failed, Someone Made a Reservation
                        popupMsg('reserveFailMsg', '已被預約', '哇！慢了一步～已被預約', '', false, '確定', 'warn_icon.png');

                    } else if (data['ResultCode'] === "002904") {
                        //Reservation Failed, Repeated a Reservation
                        popupMsg('reserveFailMsg', '', '預約失敗，重複預約', '', false, '確定', '');
                    }

                    if (page == 'pageTwo') {
                        quickReserveBtnDefaultStatus();
                    }

                    loadingMask('hide');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "ReserveMeetingRoom", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIReserveCancel(date, traceID) {
                loadingMask('show');
                var self = this;
                var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID>' + traceID + '</ReserveTraceID><ReserveTraceAggID></ReserveTraceAggID></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "002905") {
                        //Cancel a Reservation Successful
                        popupMsg('cancelSuccessMsg', '', '取消預約成功', '', false, '確定', '');

                        var selectedSite = $('#reserveSite').find(":selected").val();
                        for (var i = 0; i < myReserveLocalData.length; i++) {
                            if (myReserveLocalData[i].time == tempTimeNameClick && myReserveLocalData[i].date == date && myReserveLocalData[i].site == selectedSite) {
                                myReserveLocalData.splice(i, 1);
                                i--;
                            }
                        };

                        var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
                        reserveBtnDefaultStatus();

                    } else if (data['ResultCode'] === "002906") {
                        //Cancel a Reservation Failed
                        popupMsg('cancelFailMsg', '', '取消預約失敗', '', false, '確定', '');
                    }

                    loadingMask('hide');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIQuickReserve(date, site, floor, people, timeID, timeName) {
                loadingMask('show');
                var self = this;
                var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><Site>' + site + '</Site><Floor>' + floor + '</Floor><People>' + people + '</People><ReserveTime>' + timeID + '</ReserveTime></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "1") {
                        //Successful
                        quickRserveCallBackData = data['Content'];
                        $('#quickReserveMsgArea div:nth-child(2)').html(quickRserveCallBackData[0].MeetingRoomName + '會議室可使用');
                        $('#quickReserveMsgArea div:nth-child(3)').html('預約時段為' + timeName);
                        $('#quickReserveMsgArea div:nth-child(1)').removeClass('quick-reserve-warn-icon');
                        $('#quickReserveMsgArea div:nth-child(1)').addClass('quick-reserve-msg-icon');
                        quickReserveBtnActiveStatus();

                    } else if (data['ResultCode'] === "002907") {
                        //There are no meeting rooms
                        var arrCutString = cutStringToArray(date, ['4', '2', '2']);
                        var strDate = arrCutString[2] + '/' + arrCutString[3];
                        $('#quickReserveMsgArea div:nth-child(2)').html(strDate + '沒有符合偏好的會議室');
                        $('#quickReserveMsgArea div:nth-child(3)').html('預約時段為' + timeName);
                        $('#quickReserveMsgArea div:nth-child(1)').removeClass('quick-reserve-msg-icon');
                        $('#quickReserveMsgArea div:nth-child(1)').addClass('quick-reserve-warn-icon');
                        $('#quickReserveMsgArea').removeClass('disable');
                        $('#quickReserve').removeClass('btn-benq');
                        $('#quickReserve').addClass('btn-disable');
                    }

                    loadingMask('hide');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "QuickReserve", self.successCallback, self.failCallback, queryData);
                }();
            }

            /********************************** page event *************************************/

            $('#viewReserve').one('pagebeforeshow', function(event, ui) {
                //just first loading
                //get meetingroom last update time
                var meetingRoomLocalData = JSON.parse(localStorage.getItem('meetingRoomLocalData'));
                if (meetingRoomLocalData === null || checkDataExpired(meetingRoomLocalData['lastUpdateTime'], 7, 'dd')) {
                    var doAPIListAllMeetingRoom = new getAPIListAllMeetingRoom();
                    var doAPIListAllTime = new getAPIListAllTime();
                } else {
                    ConverToMeetingTree(JSON.parse(localStorage.getItem('meetingRoomLocalData'))['content']);
                    arrTimeBlockBySite = JSON.parse(localStorage.getItem('allTimeLocalData'))['content'];
                }

                var listAllManager = JSON.parse(localStorage.getItem('listAllManager'));
                if (listAllManager === null || checkDataExpired(listAllManager['lastUpdateTime'], 3, 'ss')) {
                    var doAPIListAllManager = new getAPIListAllManager();
                } else {
                    var tempContent = JSON.parse(localStorage.getItem('listAllManager'))['content'];
                    if (tempContent != 'normal') {
                        ConverToRoleTree(JSON.parse(localStorage.getItem('listAllManager'))['content']);
                    }
                }

                meetingRoomData = meetingRoomTreeData._root;
                roleData = roleTreeData._root;

                var doAPIQueryMyReserveTime = new getAPIQueryMyReserveTime();
                getSiteData();

                var defaultSiteClick = localStorage.getItem('defaultSiteClick');
                if (defaultSiteClick === null) {
                    defaultSiteClick = meetingRoomData.children[0].data; //default site = 2(BQT/QTT)
                }
                $("#reserveSite option[value=" + defaultSiteClick + "]").attr("selected", "selected");
                clickSiteId = $("#reserveSite option:selected").index();
                siteCategoryID = dictSiteCategory[defaultSiteClick];

                getFloorData(clickSiteId);  
                setRoleAndDateList(defaultSiteClick);
                var selectedFllor = $('#reserveFloor').find(":selected").val();
                setAlertLimitRoom(defaultSiteClick, selectedFllor);
                setReserveDetailLocalDate();
                setDefaultSettingData();

                $('#pageOne').show();
                $('#pageTwo').hide();
            });

            $('#viewReserve').on('pagebeforeshow', function(event, ui) {
                settingList();
                reserveBtnDefaultStatus();
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            });

            $('#viewReserve').on('pageshow', function(event, ui) {
                calSelectWidth($('#reserveSite'));
                calSelectWidth($('#reserveFloor'));
                calSelectWidth($('#reserveSetting'));
            });

            /********************************** dom event *************************************/

            $('#reserveTab').change(function() {
                if ($("#reserveTab :radio:checked").val() == 'tab1') {
                    $('#pageOne').show();
                    $('#pageTwo').hide();
                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                } else {
                    $('#pageOne').hide();
                    $('#pageTwo').show();
                }
            });

            $('#reserveSite').change(function() {
                calSelectWidth($(this));
                localStorage.setItem('defaultSiteClick', $(this).val());
                siteCategoryID = dictSiteCategory[$(this).val()];
                clickSiteId = this.selectedIndex;
                var selectedSite = $('#reserveSite').find(":selected").val();
                $("#reserveFloor option:first").attr("selected", "selected");
                var selectedFllor = $('#reserveFloor').find(":selected").val();
                setAlertLimitRoom(selectedSite, selectedFllor);
                setRoleAndDateList(selectedSite);
                getFloorData(clickSiteId);
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                reserveBtnDefaultStatus();
            });

            $('#reserveFloor').change(function() {
                calSelectWidth($(this));
                var selectedSite = $('#reserveSite').find(":selected").val();
                var selectedFllor = $('#reserveFloor').find(":selected").val();
                setAlertLimitRoom(selectedSite, selectedFllor);
                getRoomData(clickSiteId, this.selectedIndex);
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                reserveBtnDefaultStatus();
            });

            $('body').on('click', '#scrollDate .ui-link', function() {
                //if (!$(this).hasClass('hover')) {
                clickDateId = $(this).attr('id').replaceAll('one', '');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                } else {
                    $('#scrollDate .ui-link').removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                reserveBtnDefaultStatus();
                //}
            });

            $('body').on('click', '#reserveRoom .ui-link', function() {
                //if (!$(this).hasClass('hover')) {
                clickRomeId = $(this).attr('id');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                } else {
                    $('#reserveRoom .ui-link').removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                reserveBtnDefaultStatus();
                //}
            });

            $('body').on('click', 'div[id^=time]', function() {
                var bMyReserve = $(this).hasClass('ui-color-myreserve');
                var bReserve = $(this).hasClass('ui-color-reserve');
                var bNoReserve = $(this).hasClass('ui-color-noreserve');
                var bReserveSelect = $(this).find('div:nth-child(2)').hasClass('iconSelected');

                if (bMyReserve || bReserve) {

                    //var tempEname = $(this).attr('ename').substring(0, $(this).attr('ename').indexOf('.'));
                    var tempEname = $(this).attr('ename');
                    var arrMsgValue = $(this).attr('msg').split(',');
                    var arrCutString = cutStringToArray(arrMsgValue[0], ['4', '2', '2']);
                    var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                    var msgContent = '<table><tr><td>會議室</td><td>' + arrMsgValue[1] + '</td></tr>' + '<tr><td>日期</td><td>' + strDate + '</td></tr>' + '<tr><td>時間</td><td>' + arrMsgValue[2] + '</td></tr></table>';

                    if (bMyReserve) {
                        traceID = $(this).attr('traceID');
                        tempTimeNameClick = $(this).find('div > div:nth-child(1)').text();
                        popupMsg('myReserveMsg', tempEname + '已預約', msgContent, '關閉', true, '取消預約', 'select.png');
                    } else {
                        //ex: 會議室協調_12/01 T01 15:00-15:30
                        var tempMailContent = $(this).attr('email') + '?subject=會議室協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2];
                        popupSchemeMsg('reserveMsg', tempEname + '已預約', msgContent, 'mailto:' + tempMailContent, 'tel:' + $(this).attr('ext'), 'select.png');
                    }

                } else if (bNoReserve && !bReserveSelect) {

                    var timeBlockId = $(this).attr('id');
                    timeClick.push(timeBlockId);
                    timeNameClick.push($(this).find('div > div:nth-child(1)').text());

                    $(this).addClass('hover');
                    $(this).find('div:nth-child(2)').removeClass('iconSelect');
                    $(this).find('div:nth-child(2)').addClass('iconSelected');

                } else if (bReserveSelect) {

                    var timeBlockId = $(this).attr('id');
                    var clickIndexOf = timeClick.indexOf(timeBlockId);
                    timeClick.splice(clickIndexOf, 1);
                    timeNameClick.splice(clickIndexOf, 1);

                    $(this).removeClass('hover');
                    $(this).find('div:nth-child(2)').removeClass('iconSelected');
                    $(this).find('div:nth-child(2)').addClass('iconSelect');

                }

                var itemCount = 0;
                for (var item in timeClick) {
                    itemCount++;
                }
                if (itemCount === 0) {
                    $('#reserveBtn').removeClass('btn-benq');
                    $('#reserveBtn').addClass('btn-disable');
                } else {
                    $('#reserveBtn').removeClass('btn-disable');
                    $('#reserveBtn').addClass('btn-benq');
                }
            });

            $("#reserveBtn").on('click', function() {
                if ($(this).hasClass('btn-disable')) {
                    popupMsg('noSelectTimeMsg', '', '您尚未選擇時間', '', false, '確定', '');
                } else {
                    var timeID = '';
                    for (var item in timeClick) {
                        timeID += timeClick[item] + ',';
                    }
                    if (checkReserveSameTime(clickDateId)) {
                        //replace end of comma
                        var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageOne', clickRomeId, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                    } else {
                        popupMsg('selectReserveSameTimeMsg', '重複預約', '您已重複預約此時段', '', false, '確定', 'warn_icon.png');
                    }
                }
            });

            $('#reserveSetting').change(function() {
                calSelectWidth($(this));

                //to do aaa
                setSettingArea();
                quickReserveBtnDefaultStatus();
            });

            $('body').on('click', '#quickReserveScrollDate .ui-link', function() {
                quickReserveClickDateID = $(this).attr('id').replaceAll('two', '');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');
                quickReserveBtnDefaultStatus();
            });

            $('#quickReserve').on('click', function() {
                if (!$(this).hasClass('btn-disable')) {
                    var quickReserveSelectedValue = $('#reserveSetting').find(":selected").val();
                    var quickReserveSelectedTime = $('#reserveSetting').find(":selected").attr('time');
                    var arrSelectedValue = quickReserveSelectedValue.split('&');
                    var quickReserveDay = quickReserveClickDateID.replaceAll('two', '');
                    var quickRserveTime = arrSelectedValue[3];
                    if (quickRserveTime === 'none') {
                        var nowTime = new Date();
                        var nowTimeHour = nowTime.getHours();
                        var nowTimeMins = nowTime.getMinutes();
                        if (nowTimeMins < 15) {
                            nowTimeMins = 0;
                        } else if (nowTimeMins >= 15 && nowTimeMins < 45) {
                            nowTimeMins = 30;
                        } else if (nowTimeMins >= 45) {
                            nowTimeHour += 1;
                            nowTimeMins = 0;
                        }

                        nowTime.setHours(nowTimeHour);
                        nowTime.setMinutes(nowTimeMins);
                        var sTime = nowTime.hhmm();
                        var eTime = addThirtyMins(addThirtyMins(sTime));
                        quickRserveTime = getTimeID(sTime, eTime, dictSiteCategory[arrSelectedValue[0]]);
                        quickReserveSelectedTime = sTime + '~' + eTime;
                    }

                    if (quickRserveTime === '') {
                        popupMsg('noTimeIdMsg', '', '沒有符合條件的時段', '', false, '確定', '');
                    } else {
                        // getAPIQuickReserve(date, site, floor, people, time)
                        var doAPIQuickReserve = new getAPIQuickReserve(quickReserveDay, arrSelectedValue[0], arrSelectedValue[1].replace(/,\s*$/, ""), arrSelectedValue[2], quickRserveTime.replace(/,\s*$/, ""), quickReserveSelectedTime);
                    }
                }
            });

            $("#quickReserveConfirm").on('click', function() {
                var quickClickRomeId = quickRserveCallBackData[0].MeetingRoomID;
                var quickClickDateId = quickReserveClickDateID.replaceAll('two', '');
                timeID = quickRserveCallBackData[0].ReserveTimeID;
                var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageTwo', quickClickRomeId, quickClickDateId, timeID);

                //delete local data for refresh
                var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                reserveDetailLocalData = reserveDetailLocalData.filter(function(item) {
                    return item.date != quickClickDateId;
                });
                localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));
            });

            $("#quickReserveCancel").on('click', function() {
                quickReserveBtnDefaultStatus();
            });

            $('body').on('click', 'div[for=myReserveMsg] #confirm', function() {
                $('div[for=myReserveMsg]').popup('close');
                var doAPIReserveCancel = new getAPIReserveCancel(clickDateId, traceID);
            });

            $('body').on('click', 'div[for=cancelSuccessMsg] #confirm', function() {
                $('div[traceid=' + traceID + ']').removeClass('ui-color-myreserve');
                $('div[traceid=' + traceID + '] span').text('');
                $('div[for=cancelSuccessMsg]').popup('close');
            });

            $('body').on('click', 'div[for=reserveSuccessMsg] #confirm, div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm', function() {
                var msgForId = $(this).parent().parent().attr('for');
                $('div[for=' + msgForId + ']').popup('close');
            });

            $('body').on('click', 'div[for=reserveFailMsg] #confirm', function() {
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
                $('div[for=reserveFailMsg]').popup('close');
            });
        }
    });
});
