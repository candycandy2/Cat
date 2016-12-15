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
    var quickReserveSelectedValue = '';
    var quickRserveCallBackData = {};
    var timeClick = [];
    var reserveDetailLocalData = [];

    $('#viewReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getFloorData(siteIndex) {
                htmlContent = '';
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                var originItemForFloor = ['FloorId', 'defaultFloorList', 'FloorName'];
                $('#reserveFloor').find('option').remove();

                for (var i = 0, item; item = meetingRoomTreeData._root.children[siteIndex].children[i]; i++) {
                    htmlContent += '<option id=' + item.data + ' value=' + item.data + '>' + item.data + '</option>';
                }

                $('#reserveFloor').append(htmlContent);
                var firstNode = meetingRoomTreeData._root.children[siteIndex].children[0].data;
                $('#reserveFloor-button').find('span').text(firstNode);

                getRoomData(siteIndex, '0');
            }

            function getRoomData(siteIndex, floorIndex) {
                htmlContent = '';
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                floorIndex = floorIndex == '' ? '0' : floorIndex;
                $('#reserveRoom').find('a').remove();

                for (var i = 0, item; item = meetingRoomTreeData._root.children[siteIndex].children[floorIndex].children[i]; i++) {
                    htmlContent += '<a id=' + item.data.MeetingRoomID + ' value=' + item.data.MeetingRoomID + ' href="#" class="ui-link">' + item.data.MeetingRoomName + '</a>';
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
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strValue = item.site + '&' + item.floor + '&' + item.people + '&' + item.timeID
                        htmlContent += '<option id=setList-' + item.id + ' value=' + strValue + '>' + item.title + '</option>';
                    }
                }

                $('#defaultListItem').after(htmlContent);

                var strDefaultSite = meetingRoomTreeData._root.children[0].data;
                var strDefaultFloor = '';
                $.each(meetingRoomTreeData._root.children[0].children, function(index, value) {
                    strDefaultFloor += value.data + ',';
                });
                $('#defaultListItem').val(strDefaultSite + '&' + strDefaultFloor + '&0' + '&none');
            }

            function dateList() {
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

                for (var i = 0; i < 14; i++) {
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

                $('div[id^=two]:first-child > div').addClass('ui-btn-active');
                quickReserveClickDateID = $('div[id^=two]:first-child').attr('id');


                $('#scrollDate a:first-child').addClass('hover');
                $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
            }

            function getMettingStatus() {
                htmlContent = '';
                $('#defaultTimeSelectId').nextAll().remove();
                var arrClass = ['a', 'b', 'c', 'd'];
                var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', '[msg]', '[ext]', '[email]', '[traceID]'];
                var j = 0;

                var filterTimeBlock = grepData(arrTimeBlock, 'category', siteCategoryID);

                for (var item in filterTimeBlock) {
                    var classId = arrClass[j % 4];
                    var reserveClass = 'ui-color-noreserve';
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
                            eName = arr.detailInfo['eName'];
                            ext = arr.detailInfo['ext'];
                            email = arr.detailInfo['email'];
                            traceID = arr.detailInfo['traceID'];
                            msg = arr.date + ',' + roomName + ',' + arr.detailInfo['bTime'] + '-' + addThirtyMins(arr.detailInfo['bTime']) + ',' + eName
                        }
                    }
                    var replaceItem = ['time-' + timeID, bTime.trim(), eName, 'ui-block-' + classId, '', reserveClass, msg, ext, email, traceID];

                    htmlContent
                        += replaceStr($('#defaultTimeSelectId').get(0).outerHTML, originItem, replaceItem);

                    msg = '';
                    j++;
                }

                $('#reserveDateSelect > div').append(htmlContent);
            }

            function getReserveData(roomId, date, data, type) {

                arrReserve = [];
                for (var i = 0, item; item = data[i]; i++) {
                    var newReserve = new reserveObj(roomId, date);
                    newReserve.addDetail('traceID', item.ReserveTraceID);
                    newReserve.addDetail('eName', item.EMail.substring(0, item.EMail.indexOf('@')));
                    newReserve.addDetail('bTime', item.BTime);
                    newReserve.addDetail('ext', item.Ext_No);
                    newReserve.addDetail('email', item.EMail);
                    arrReserve.push(newReserve);
                }

                if (type === 'dataNotExist') {
                    if (arrClickReserve.length != 0) {
                        arrClickReserve = arrClickReserve.filter(function(item) {
                            if (item.roomId == roomId && item.date == date) {
                                return false;
                            } else {
                                return true;
                            }
                        });
                    }

                    //save to local data
                    var newReserveLocalDataObj = new reserveLocalDataObj(roomId, date, data);
                    arrClickReserve.push(newReserveLocalDataObj);
                    localStorage.setItem('reserveDetailLocalData', JSON.stringify(arrClickReserve));
                }

                getMettingStatus();

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
                    var self = this;
                    var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate></LayoutHeader>';

                    this.successCallback = function(data) {
                        if (data['ResultCode'] === "1") {
                            getReserveData(roomId, date, data['Content'], 'dataNotExist');
                        }
                    };

                    this.failCallback = function(data) {
                        console.log('apiFailCallback');
                    };

                    var __construct = function() {
                        QPlayAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, queryData);
                    }();
                }
            }

            function getAPIReserveMeetingRoom(page, roomId, date, timeID) {
                var self = this;
                var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTimeID>' + timeID + '</ReserveTimeID></LayoutHeader>';

                this.successCallback = function(data) {

                    if (data['ResultCode'] === "002902") {
                        //Reservation Successful
                        popupMsg('reservePopupMsg', 'reserveSuccessMsg', '預約成功', '', true, '確定', '#', '#');

                        if (page == 'pageOne') {
                            var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
                        }

                    } else if (data['ResultCode'] === "002903") {
                        //Reservation Failed, Someone Made a Reservation
                        popupMsg('reservePopupMsg', 'reserveFailMsg', '預約失敗，有人預約', '', true, '確定', '#', '#');

                    } else if (data['ResultCode'] === "002904") {
                        //Reservation Failed, Repeated a Reservation
                        popupMsg('reservePopupMsg', 'reserveRepeatMsg', '預約失敗，重複預約', '', true, '確定', '#', '#');
                    }

                    if (page == 'pageTwo') {
                        $('#quickReserve').removeClass('disable');
                        $('#quickReserveMsgArea h2').html('');
                        $('#quickReserveMsgArea').addClass('disable');
                        $('#quickReserveCancel').addClass('disable');
                        $('#quickReserveConfirm').addClass('disable');
                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "ReserveMeetingRoom", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIReserveCancel(date, traceID) {
                var self = this;
                var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID>' + traceID + '</ReserveTraceID><ReserveTraceAggID></ReserveTraceAggID></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "002905") {
                        //Cancel a Reservation Successful
                        popupMsg('reservePopupMsg', 'cancelSuccessMsg', '取消預約成功', '', true, '確定', '', '');

                    } else if (data['ResultCode'] === "002906") {
                        //Cancel a Reservation Failed
                        popupMsg('reservePopupMsg', 'cancelFailMsg', '取消預約失敗', '', true, '確定', '', '');
                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIQuickReserve(date, site, floor, people, time) {
                var self = this;
                var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><Site>' + site + '</Site><Floor>' + floor + '</Floor><People>' + people + '</People><ReserveTime>' + time + '</ReserveTime></LayoutHeader>';


                this.successCallback = function(data) {
                    if (data['ResultCode'] === "1") {
                        //Successful
                        quickRserveCallBackData = data['Content'];
                        $('#quickReserveMsgArea h2').html(quickRserveCallBackData[0].MeetingRoomName + '會議室可使用');
                        $('#quickReserveMsgArea').removeClass('disable');
                        $('#quickReserveCancel').removeClass('disable');
                        $('#quickReserveConfirm').removeClass('disable');
                        $('#quickReserve').addClass('disable');

                    } else if (data['ResultCode'] === "002907") {
                        //There are no meeting rooms
                        $('#quickReserveMsgArea h2').html('沒有符合偏好的會議室');
                        $('#quickReserveMsgArea').removeClass('disable');
                        $('#quickReserve').removeClass('btn-benq');
                        $('#quickReserve').addClass('btn-benq-disable');
                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", true, "QuickReserve", self.successCallback, self.failCallback, queryData);
                }();
            }

            /********************************** page event *************************************/

            $('#viewReserve').one('pagebeforeshow', function(event, ui) {
                //just first loading
                $('#pageOne').show();
                $('#pageTwo').hide();
                siteCategoryID = dictSiteCategory[meetingRoomTreeData._root.children[0].data];
                getFloorData('0');
                dateList();
            });

            $('#viewReserve').on('pagebeforeshow', function(event, ui) {
                settingList();
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
            });

            /********************************** dom event *************************************/

            $('#reserveTab').change(function() {
                if ($("#reserveTab :radio:checked").val() == 'tab1') {
                    $('#pageOne').show();
                    $('#pageTwo').hide();
                } else {
                    $('#pageOne').hide();
                    $('#pageTwo').show();
                }
            });

            $('#reserveSite').change(function() {
                siteCategoryID = dictSiteCategory[$(this).val()];
                clickSiteId = this.selectedIndex;
                getFloorData(clickSiteId);
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            });

            $('#reserveFloor').change(function() {
                getRoomData(clickSiteId, this.selectedIndex);
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));

                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            });

            $('body').on('click', '#scrollDate .ui-link', function() {
                if (!$(this).hasClass('hover')) {
                    clickDateId = $(this).attr('id').replaceAll('one', '');
                    if ($(this).parent().data("lastClicked")) {
                        $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                    }
                    $(this).parent().data("lastClicked", this.id);
                    $(this).addClass('hover');

                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                }
            });

            $('body').on('click', '#reserveRoom .ui-link', function() {
                if (!$(this).hasClass('hover')) {
                    clickRomeId = $(this).attr('id');
                    if ($(this).parent().data("lastClicked")) {
                        $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                    }
                    $(this).parent().data("lastClicked", this.id);
                    $(this).addClass('hover');

                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
                }
            });

            $('body').on('click', 'div[id^=time]', function() {
                if ($(this).hasClass('ui-color-myreserve')) {

                    traceID = $(this).attr('traceID');
                    popupMsg('reservePopupMsg', 'myReserveMsg', $(this).attr('msg'), '取消', false, '確定', '#', '#');

                } else if ($(this).hasClass('ui-color-reserve')) {

                    var tempEname = $(this).attr('ename').substring(0 ,$(this).attr('ename').indexOf('.'));
                    popupMsg('reservePopupMsg', 'reserveMsg', $(this).attr('msg'), 'Mail To ' + tempEname, false, 'Call ' + tempEname, 'mailto:' + $(this).attr('email'), 'tel:' + $(this).attr('ext'));
                    $('div[for=reserveMsg] a:first-child').attr('data-rel', '');

                } else if ($(this).hasClass('ui-color-noreserve') && !$(this).hasClass('reserveSelect')) {

                    var timeBlockId = $(this).attr('id');
                    timeClick.push(timeBlockId);
                    $(this).addClass('reserveSelect');
                    $(this).addClass('reserveSelectIcon');

                } else if ($(this).hasClass('reserveSelect')) {

                    var timeBlockId = $(this).attr('id');
                    timeClick.splice(timeClick.indexOf(timeBlockId), 1);
                    $(this).removeClass('reserveSelect');
                    $(this).removeClass('reserveSelectIcon');

                }

                var itemCount = 0;
                for (var item in timeClick) {
                    itemCount++;
                }
                if (itemCount === 0) {
                    $('#reserveBtn').addClass('btn-benq-disable');
                    $('#reserveBtn').removeClass('btn-benq');
                } else {
                    $('#reserveBtn').removeClass('btn-benq-disable');
                    $('#reserveBtn').addClass('btn-benq');
                }
            });

            $("#reserveBtn").on('click', function() {
                var timeID = '';
                for (var item in timeClick) {
                    timeID += timeClick[item] + ',';
                }

                if (timeID === '') {
                    popupMsg('reservePopupMsg', 'noSelectTimeMsg', '您尚未選擇時間', '', true, '確定', '#', '#');
                } else {
                    //replace end of comma
                    var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageOne', clickRomeId, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                    $('#reserveBtn').addClass('btn-benq-disable');
                    $('#reserveBtn').removeClass('btn-benq');
                }
                timeClick = [];
            });

            $('#reserveSetting').change(function() {
                quickReserveSelectedValue = $(this).val();
            });

            $('body').on('click', '#quickReserveDateSelect .ui-bar', function() {
                if (quickReserveClickDateID != '') {
                    $('#' + quickReserveClickDateID + ' div').removeClass('ui-btn-active');
                }
                $(this).addClass('ui-btn-active');
                quickReserveClickDateID = $(this).parent().attr('id');

                $('#quickReserveMsgArea').addClass('disable');
                $('#quickReserveCancel').addClass('disable');
                $('#quickReserveConfirm').addClass('disable');
                $('#quickReserve').removeClass('disable');
                $('#quickReserve').removeClass('btn-benq-disable');
                $('#quickReserve').addClass('btn-benq');
            });

            $('#quickReserve').on('click', function() {
                if (!$(this).hasClass('btn-benq-disable')) {
                    if (quickReserveSelectedValue === '') {
                        quickReserveSelectedValue = $('#defaultListItem').val();
                    }
                    var arrSelectedValue = quickReserveSelectedValue.split('&');
                    var quickReserveDay = quickReserveClickDateID.replaceAll('two', '');
                    var quickRserveTime = arrSelectedValue[3];
                    if (quickRserveTime === 'none') {
                        var nowTime = new Date();
                        var nowTimeHour = nowTime.getHours();
                        var nowTimeMins = nowTime.getMinutes();
                        if (nowTimeMins >= 30) {
                            nowTimeHour += 1;
                            nowTimeMins = 0;
                        } else {
                            nowTimeMins = 30;
                        }
                        nowTime.setHours(nowTimeHour);
                        nowTime.setMinutes(nowTimeMins);
                        var sTime = nowTime.hhmm();
                        var eTime = addThirtyMins(addThirtyMins(sTime));
                        quickRserveTime = getTimeID(sTime, eTime, dictSiteCategory[arrSelectedValue[0]]);
                    }

                    // getAPIQuickReserve(date, site, floor, people, time)
                    var doAPIQuickReserve = new getAPIQuickReserve(quickReserveDay, arrSelectedValue[0], arrSelectedValue[1].replace(/,\s*$/, ""), arrSelectedValue[2], quickRserveTime.replace(/,\s*$/, ""));
                }
            });

            $("#quickReserveConfirm").on('click', function() {
                clickRomeId = quickRserveCallBackData[0].MeetingRoomID;
                clickDateId = quickReserveClickDateID.replaceAll('two', '');
                timeID = quickRserveCallBackData[0].ReserveTimeID;
                var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageTwo', clickRomeId, clickDateId, timeID);
            });

            $("#quickReserveCancel").on('click', function() {
                $('#quickReserveMsgArea h2').html('');
                $('#quickReserveMsgArea').addClass('disable');
                $('#quickReserveCancel').addClass('disable');
                $('#quickReserveConfirm').addClass('disable');
                $('#quickReserve').removeClass('disable');
            });

            $('body').on('click', 'div[for=myReserveMsg] #confirm', function() {
                var doAPIReserveCancel = new getAPIReserveCancel(clickDateId, traceID);
            });

            $('body').on('click', 'div[for=cancelSuccessMsg] #confirm', function() {
                $('div[traceid=' + traceID + ']').removeClass('ui-color-myreserve');
                $('div[traceid=' + traceID + '] span').text('');
                $('div[for=cancelSuccessMsg]').popup('close');
            });

            $('body').on('click', 'div[for=reserveSuccessMsg] #confirm', function() {
                $('div[for=reserveSuccessMsg]').popup('close');
            });

            $('body').on('click', 'div[for=reserveFailMsg] #confirm', function() {
                $('div[for=reserveFailMsg]').popup('close');
            });

            $('body').on('click', 'div[for=reserveRepeatMsg] #confirm', function() {
                $('div[for=reserveRepeatMsg]').popup('close');
            });

            $('body').on('click', 'div[for=cancelFailMsg] #confirm', function() {
                $('div[for=cancelFailMsg]').popup('close');
            });

            $('body').on('click', 'div[for=noSelectTimeMsg] #confirm', function() {
                $('div[for=noSelectTimeMsg]').popup('close');
            });

        }
    });
});
