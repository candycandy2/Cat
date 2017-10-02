//$(document).one('pagecreate', '#viewReserve', function() {

    var SiteData = {};
    var roomData = {};
    var floorData = {};
    var defaultSiteClick = '';
    var clickSiteId = '';
    var siteCategoryID = '';
    var clickDateId = '';
    var clickRomeId = '';
    var clickTraceID = '';
    var quickReserveClickDateID = '';
    var quickRserveCallBackData = {};
    var timeClick = [];
    var timeNameClick = [];
    var selectMyReserveTime = '';
    var reserveDetailLocalData = [];
    var bReserveCancelConfirm = false;

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

                if (roomSettingdata != null) {
                    sortDataByKey(roomSettingdata.content, 'id', 'asc');
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strValue = item.site + '&' + item.floor + '&' + item.people + '&' + item.timeID;
                        htmlContent += '<option id=setList-' + item.id + ' value=' + strValue + ' floorName=' + item.floorName + ' time=' + item.time + '>' + item.title + '</option>';
                    }
                }

                $('#reserveSetting').append(htmlContent);
                $("#reserveSetting option:first").attr("selected", "selected");

                setSettingArea();
                quickReserveBtnDefaultStatus();
            }

            function setDateList(type) {
                if (type == 'reserve') {
                    $('#scrollDate a[id^=one]').remove();
                } else if (type == 'quick') {
                    $('#quickReserveScrollDate a[id^=two]').remove();
                }

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

                if (type == 'reserve') {
                    $('#reserveDefault').before(htmlContentPageOne);
                    clickDateId = $('#scrollDate a:first-child').attr('id').replaceAll('one', '');
                    $('#scrollDate a:first-child').addClass('hover');
                    $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
                } else if (type == 'quick') {
                    $('#quickReserveDefault').before(htmlContentPageTwo);
                    quickReserveClickDateID = $('#quickReserveScrollDate a:first-child').attr('id').replaceAll('one', '');
                    $('#quickReserveScrollDate a:first-child').addClass('hover');
                    $('#quickReserveScrollDate a:first-child').parent().data("lastClicked", $('#quickReserveScrollDate a:first-child').attr('id'));
                }
            }

            function getMettingStatus() {
                htmlContent = '';
                $('#defaultTimeSelectId').nextAll().remove();
                var arrClass = ['a', 'b', 'c', 'd'];
                var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', 'circle-icon', '[msg]', '[ext]', '[email]', '[traceID]'];
                var j = 0;

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
                    $(this).find('.timeRemind').removeClass('timeShow');
                    $(this).find('div:nth-child(2)').addClass('iconSelect');
                }
                timeClick = [];
                timeNameClick = [];
                bReserveCancelConfirm = false;
            }

            function setSettingArea() {
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

            function checkReserveSameTime(date, type) {
                var dictResult = {};
                var isExistInArray = false;

                var isReserveMulti = '';
                var selectedSite = '';
                var isSuperRole = '';
                var inLimitSite = '';
                var arrTemp = [];

                isSuperRole = searchTree(roleData, dictRole['super'], '');

                if (type == 'reserve') {
                    isReserveMulti = $('#' + clickRomeId).attr('IsReserveMulti');
                    selectedSite = $('#reserveSite').find(":selected").val();
                    inLimitSite = searchTree(isSuperRole, selectedSite, '');
                    arrTemp = timeNameClick;

                } else if (type == 'quick') {
                    var findRoomIdNode = searchTree(meetingRoomData, quickRserveCallBackData[0].MeetingRoomID, 'MeetingRoomID');
                    isReserveMulti = findRoomIdNode.data.IsReserveMulti;
                    var quickReserveSelectedValue = $('#reserveSetting').find(":selected").val();
                    var arrSelectedValue = quickReserveSelectedValue.split('&');
                    selectedSite = arrSelectedValue[0];
                    inLimitSite = searchTree(isSuperRole, selectedSite, '');
                    var dictTemp = getQuickReserveSelectedTime();
                    var arrTemp = getSTimeToETime(dictTemp['sTime'], dictTemp['eTime']);
                }

                if ((isSuperRole != null && inLimitSite != null) || isReserveMulti === 'N') {
                    dictResult['result'] = true;
                } else {
                    var myReserveFilterData = myReserveLocalData.filter(function(item) {
                        return item.date == date && item.site == selectedSite;
                    });

                    if (myReserveFilterData.length === 0) {
                        dictResult['result'] = true;
                    } else {
                        $.each(myReserveFilterData, function(index, value) {
                            if (arrTemp.indexOf(value.time) != -1) {
                                isExistInArray = true;
                                dictResult['room'] = value.room;
                            }
                        });
                        dictResult['result'] = !isExistInArray;
                    }
                }

                return dictResult;
            }

            function setAlertLimitRoom(site, floor) {
                $("#alertLimitRoomMsg").addClass('disable');
                $("#alertLimitRoomMsg").html('');
                if (site == '1') { //QTY
                    $("#alertLimitRoomMsg").removeClass('disable');
                    if (floor == '3F') {
                        $("#alertLimitRoomMsg").html('*A30、E31會議室請使用PC預約');
                    } else if (floor == '7F') {
                        $("#alertLimitRoomMsg").html('*A70、B71會議室請使用PC預約');
                    }
                } else if (site == '2' && floor == '1F') { //BQT/QTT
                    $("#alertLimitRoomMsg").removeClass('disable');
                    $("#alertLimitRoomMsg").html('*T00、T13會議室請使用PC預約');
                }
            }

            function setRole(site) {
                var isSystemRole = searchTree(roleData, dictRole['system'], '');
                var isSecretaryRole = searchTree(roleData, dictRole['secretary'], '');
                var inLimitSite = searchTree(isSecretaryRole, site, '');

                //BQT/QTT、QTY = 120 Days、QTH = 90 Days、雙星 = 56 Days
                if (isSystemRole != null) {
                    reserveDays = 120;
                } else if (isSecretaryRole != null && inLimitSite != null) {
                    switch (inLimitSite.data) {
                        case '100': //QTH
                            reserveDays = 90;
                            break;
                        case '43': //雙星
                            reserveDays = 56;
                            break;
                        default:
                            reserveDays = 120;
                            break;
                    }
                } else {
                    reserveDays = 14;
                }
            }

            function getQuickReserveSelectedTime() {
                var quickReserveSelectedTime = $('#reserveSetting').find(":selected").attr('time');
                var sTime = '';
                var eTime = '';
                var dictResult = {};

                if (quickReserveSelectedTime == 'none') {
                    var dictOneHourTime = getOneHour();
                    sTime = dictOneHourTime['sTime'];
                    eTime = dictOneHourTime['eTime'];
                } else {
                    var arrQuickReserveSelectedTime = quickReserveSelectedTime.split('~');
                    sTime = arrQuickReserveSelectedTime[0];
                    eTime = arrQuickReserveSelectedTime[1];
                }

                dictResult['sTime'] = sTime;
                dictResult['eTime'] = eTime;

                return dictResult;
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
                        CustomAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, queryData, "");
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
                        var arrCutString = cutStringToArray(date, ['4', '2', '2']);
                        var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                        var roomName = '';
                        var timeName = '';
                        var findRoomIdNode = {};

                        if (page == 'pageOne') {
                            roomName = $('#reserveRoom').find('.hover').text();
                            //reserve continuous time block, display one time block  
                            var arrTempTime = [];
                            for (var item in timeClick) {
                                var sTime = $('div[id=' + timeClick[item] + '] > div > div:first').text();
                                var eTime = addThirtyMins(sTime);
                                arrTempTime.push(sTime);
                                arrTempTime.push(eTime);
                            }

                            //ex:[08:00, 08:30, 08:30, 09:00] convert to [08:00, 09:00]
                            var arrUniqueTime = [];
                            for (var item in arrTempTime) {
                                var index = arrUniqueTime.indexOf(arrTempTime[item]);
                                if (index === -1) {
                                    arrUniqueTime.push(arrTempTime[item]);
                                } else {
                                    arrUniqueTime.splice(index, 1);
                                }
                            }

                            arrUniqueTime.sort();

                            for (var i = 0; i < arrUniqueTime.length; i = i + 2) {
                                timeName += arrUniqueTime[i] + '-' + arrUniqueTime[i + 1] + '<br />';
                            }
                        } else {
                            findRoomIdNode = searchTree(meetingRoomData, quickRserveCallBackData[0].MeetingRoomID, 'MeetingRoomID');
                            // roomName = $('#quickReserveMsgArea div:nth-child(2)').html().replaceAll('會議室可使用', '');
                            // roomName = roomName.substring(0, roomName.indexOf('('));
                            roomName = findRoomIdNode.data.MeetingRoomName;
                            timeName = $('#quickReserveMsgArea div:nth-child(3)').html().replaceAll('預約時段為', '');
                        }

                        var msgContent = '<div>' + strDate + '&nbsp;&nbsp;' + timeName + '</div>';
                        popupMsg('reserveSuccessMsg', roomName + ' 會議室預約成功', msgContent, '', false, '確定', 'select.png');

                        var isReserveMulti = '';
                        var selectedSite = '';
                        var arrTemp = [];

                        if (page == 'pageOne') {
                            isReserveMulti = $('#' + roomId).attr('IsReserveMulti');
                            selectedSite = $('#reserveSite').find(":selected").val();
                            arrTemp = timeNameClick;
                            reserveBtnDefaultStatus();
                        } else if (page == 'pageTwo') {
                            isReserveMulti = findRoomIdNode.data.IsReserveMulti;
                            var quickReserveSelectedValue = $('#reserveSetting').find(":selected").val();
                            var arrSelectedValue = quickReserveSelectedValue.split('&');
                            selectedSite = arrSelectedValue[0];
                            var dictTemp = getQuickReserveSelectedTime();
                            var arrTemp = getSTimeToETime(dictTemp['sTime'], dictTemp['eTime']);
                            quickReserveBtnDefaultStatus();
                        }

                        var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, date, false);

                        if (isReserveMulti != 'N') {
                            var jsonData = [];
                            $.each(arrTemp, function(index, value) {
                                jsonData = {
                                    room: roomName,
                                    site: selectedSite,
                                    date: date,
                                    time: value
                                };
                                myReserveLocalData.push(jsonData);
                            });
                        }

                    } else if (data['ResultCode'] === "002903") {
                        //Reservation Failed, Someone Made a Reservation
                        reserveBtnDefaultStatus();
                        var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, date, false);
                        popupMsg('reserveFailMsg', '已被預約', '哇！慢了一步～已被預約', '', false, '確定', 'warn_icon.png');

                    } else if (data['ResultCode'] === "002904") {
                        //Reservation Failed, Repeated a Reservation
                        popupMsg('reserveFailMsg', '', '預約失敗，重複預約', '', false, '確定', '');
                    }

                    loadingMask('hide');
                };

                var __construct = function() {
                    CustomAPI("POST", true, "ReserveMeetingRoom", self.successCallback, self.failCallback, queryData, "");
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
                            if (myReserveLocalData.length != 0 && myReserveLocalData[i].time == selectMyReserveTime && myReserveLocalData[i].date == date && myReserveLocalData[i].site == selectedSite) {
                                myReserveLocalData.splice(i, 1);
                                i = i - 1;
                                i = i < 0 ? 0 : i;
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
                    CustomAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData, "");
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
                    CustomAPI("POST", true, "QuickReserve", self.successCallback, self.failCallback, queryData, "");
                }();
            }

            function checkLocalDataExpired() {
                var meetingRoomLocalData = JSON.parse(localStorage.getItem('meetingRoomLocalData'));
                if (meetingRoomLocalData === null || checkDataExpired(meetingRoomLocalData['lastUpdateTime'], 7, 'dd')) {
                    var doAPIListAllMeetingRoom = new getAPIListAllMeetingRoom();
                    var doAPIListAllTime = new getAPIListAllTime();
                } else {
                    ConverToMeetingTree(JSON.parse(localStorage.getItem('meetingRoomLocalData'))['content']);
                    arrTimeBlockBySite = JSON.parse(localStorage.getItem('allTimeLocalData'))['content'];
                }

                var doAPIListAllManager = new getAPIListAllManager();

                // var listAllManager = JSON.parse(localStorage.getItem('listAllManager'));
                // if (listAllManager === null || checkDataExpired(listAllManager['lastUpdateTime'], 3, 'ss')) {
                //     var doAPIListAllManager = new getAPIListAllManager();
                // } else {
                //     var tempContent = JSON.parse(localStorage.getItem('listAllManager'))['content'];
                //     if (tempContent != 'normal') {
                //         ConverToRoleTree(JSON.parse(localStorage.getItem('listAllManager'))['content']);
                //     }
                // }

                meetingRoomData = meetingRoomTreeData._root;
                roleData = roleTreeData._root;

                defaultSiteClick = localStorage.getItem('defaultSiteClick');
                if (defaultSiteClick === null) {
                    defaultSiteClick = meetingRoomData.children[0].data; //default site = 2(BQT/QTT)
                }
            }

            function getInitialData() {
                getSiteData();
                $("#reserveSite option[value=" + defaultSiteClick + "]").attr("selected", "selected");
                clickSiteId = $("#reserveSite option:selected").index();
                siteCategoryID = dictSiteCategory[defaultSiteClick];
                getFloorData(clickSiteId);
            }

            function setInitialData() {
                setRole(defaultSiteClick);
                setDateList('reserve');
                //setDateList('quick');
                var selectedFllor = $('#reserveFloor').find(":selected").val();
                setAlertLimitRoom(defaultSiteClick, selectedFllor);
                setReserveDetailLocalDate();
                setDefaultSettingData();
            }

            /********************************** page event *************************************/

            $('#viewReserve').one('pagebeforeshow', function(event, ui) {
                //just first loading
                //get last update time check date expired
                checkLocalDataExpired();
                var doAPIQueryMyReserveTime = new getAPIQueryMyReserveTime();
                getInitialData();
                setInitialData();

                $('#pageOne').show();
                $('#pageTwo').hide();
            });

            $('#viewReserve').on('pagebeforeshow', function(event, ui) {
                settingList();
                var quickReserveSelectedValue = $('#reserveSetting').find(":selected").val();
                var arrSelectedValue = quickReserveSelectedValue.split('&');
                var quickReserveSelectedSite = arrSelectedValue[0];
                setRole(quickReserveSelectedSite);
                setDateList('quick');
                reserveBtnDefaultStatus();
                if (isReloadPage == true) {
                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
                    isReloadPage = false;
                } else {
                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                }
            });

            $('#viewReserve').on('pageshow', function(event, ui) {
                calSelectWidth($('#reserveSite'));
                calSelectWidth($('#reserveFloor'));
                calSelectWidth($('#reserveSetting'));
                jqMobileOverwriteStyle();
                // add 10px between header and main when device is iOS
                if (device.platform === "iOS"){
                    $('.ui-page').find('div.page-main').css({'padding-top': '0.5vw'});
                }
            });

            /********************************** dom event *************************************/

            $('#reserveTab').change(function() {
                if ($("#reserveTab :radio:checked").val() == 'tab1') {
                    $('#pageOne').show();
                    $('#pageTwo').hide();
                    reserveBtnDefaultStatus();
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
                getFloorData(clickSiteId);
                var selectedSite = $('#reserveSite').find(":selected").val();
                var selectedFllor = $("#reserveFloor option:first").val();
                setRole(selectedSite);
                setAlertLimitRoom(selectedSite, selectedFllor); //after getFloorData
                setDateList('reserve');
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                reserveBtnDefaultStatus();
            });

            $('#reserveFloor').change(function() {
                calSelectWidth($(this));
                getRoomData(clickSiteId, this.selectedIndex);
                var selectedSite = $('#reserveSite').find(":selected").val();
                var selectedFllor = $('#reserveFloor').find(":selected").val();
                setAlertLimitRoom(selectedSite, selectedFllor);
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                reserveBtnDefaultStatus();
            });

            $('body').on('click', '#scrollDate .ui-link', function() {
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
            });

            $('body').on('click', '#reserveRoom .ui-link', function() {
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
                    var msgContent = strDate + '&nbsp;&nbsp;' + arrMsgValue[2] + '</div>';

                    if (bMyReserve) {
                        traceID = $(this).attr('traceID');
                        selectMyReserveTime = $(this).find('div > div:nth-child(1)').text();
                        popupMsg('myReserveMsg', tempEname + ' 已預約 ' + arrMsgValue[1], msgContent, '關閉', true, '取消預約', 'select.png');
                    } else {
                        //ex: 會議室協調_12/01 T01 15:00-15:30
                        var tempMailContent = $(this).attr('email') + '?subject=會議室協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2];
                        popupSchemeMsg('reserveMsg', tempEname + ' 已預約 ' + arrMsgValue[1], msgContent, 'mailto:' + tempMailContent, 'tel:' + $(this).attr('ext'), 'select.png');
                    }

                } else if (bNoReserve && !bReserveSelect) {

                    var timeBlockId = $(this).attr('id');
                    timeClick.push(timeBlockId);
                    timeNameClick.push($(this).find('div > div:nth-child(1)').text());

                    $(this).addClass('hover');
                    $(this).find('div:nth-child(2)').removeClass('iconSelect');
                    $(this).find('div:nth-child(2)').addClass('iconSelected');
                    $(this).find('.timeRemind').addClass('timeShow');
                    $(this).find('.timeRemind').html('~' + addThirtyMins($(this).find('div > div:nth-child(1)').text()));

                } else if (bReserveSelect) {

                    var timeBlockId = $(this).attr('id');
                    var clickIndexOf = timeClick.indexOf(timeBlockId);
                    timeClick.splice(clickIndexOf, 1);
                    timeNameClick.splice(clickIndexOf, 1);

                    $(this).removeClass('hover');
                    $(this).find('div:nth-child(2)').removeClass('iconSelected');
                    $(this).find('.timeRemind').removeClass('timeShow');
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
                    var dictTemp = checkReserveSameTime(clickDateId, 'reserve');
                    if (dictTemp['result']) {
                        //replace end of comma
                        var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageOne', clickRomeId, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                    } else {
                        popupMsg('selectReserveSameTimeMsg', '重複預約', '該時段已預約' + dictTemp['room'], '', false, '確定', 'warn_icon.png');
                    }
                }
            });

            $('#reserveSetting').change(function() {
                calSelectWidth($(this));
                setSettingArea();
                var quickReserveSelectedValue = $('#reserveSetting').find(":selected").val();
                var arrSelectedValue = quickReserveSelectedValue.split('&');
                var quickReserveSelectedSite = arrSelectedValue[0];
                setRole(quickReserveSelectedSite);
                setDateList('quick');
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
                        var dictOneHourTime = getOneHour();
                        quickRserveTime = getTimeID(dictOneHourTime['sTime'], dictOneHourTime['eTime'], dictSiteCategory[arrSelectedValue[0]]);
                        quickReserveSelectedTime = dictOneHourTime['sTime'] + '~' + dictOneHourTime['eTime'];
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
                var quickClickDateId = quickReserveClickDateID.replaceAll('two', '');
                var dictTemp = checkReserveSameTime(quickClickDateId, 'quick');
                if (dictTemp['result']) {
                    var quickClickRomeId = quickRserveCallBackData[0].MeetingRoomID;
                    timeID = quickRserveCallBackData[0].ReserveTimeID;
                    var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageTwo', quickClickRomeId, quickClickDateId, timeID);

                    //delete local data for refresh
                    var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                    reserveDetailLocalData = reserveDetailLocalData.filter(function(item) {
                        return item.date != quickClickDateId;
                    });
                    localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));
                } else {
                    popupMsg('selectReserveSameTimeMsg', '重複預約', '該時段已預約' + dictTemp['room'], '', false, '確定', 'warn_icon.png');
                }
            });

            $("#quickReserveCancel").on('click', function() {
                quickReserveBtnDefaultStatus();
            });

            $('body').on('click', 'div[for=myReserveMsg] #confirm', function() {
                if (bReserveCancelConfirm == true) {
                    $('div[for=myReserveMsg]').popup('close');
                    var doAPIReserveCancel = new getAPIReserveCancel(clickDateId, traceID);
                } else {
                    $('div[for=myReserveMsg] span[id=titleText]').text('確定取消預約？');
                    $('div[for=myReserveMsg] button[id=confirm]').html('取消');
                    $('div[for=myReserveMsg] button[id=cancel]').html('不取消');
                    $('div[for=myReserveMsg] img[id=titleImg]').attr('src', 'img/warn_icon.png');
                    bReserveCancelConfirm = true;
                }
            });

            $('body').on('click', 'div[for=myReserveMsg] #cancel', function() {
                bReserveCancelConfirm = false;
            });

            $('body').on('click', 'div[for=cancelSuccessMsg] #confirm', function() {
                $('div[traceid=' + traceID + ']').removeClass('ui-color-myreserve');
                $('div[traceid=' + traceID + '] span').text('');
                $('div[for=cancelSuccessMsg]').popup('close');
            });

            $('body').on('click', 'div[for=reserveSuccessMsg] #confirm, div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm', function() {
                // var msgForId = $(this).parent().parent().attr('for');
                // $('div[for=' + msgForId + ']').popup('close');
                $('#viewPopupMsg').popup('close');
            });

            $('body').on('click', 'div[for=reserveFailMsg] #confirm', function() {
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
                $('div[for=reserveFailMsg]').popup('close');
            });

            /********************************** overwrite jQuery mobile css *************************************/
            function jqMobileOverwriteStyle(){
                $('#viewNewSetting').find('.ui-margin-public').find('span').css({'line-height': 1, 'margin': '0 0 1.16vw'});
                $('#viewNewSetting').find('.ui-margin-public').find('.ui-block-b.col-8').css({'line-height': 1});
                $('#newSettingSelect').css({'margin-bottom': '4.88vw'});
            }
        }
    });
//});
