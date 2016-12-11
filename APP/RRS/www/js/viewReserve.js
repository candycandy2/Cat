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
    var reserveDetailLocalData = {};

    $('#viewReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getFloorData(siteIndex) {
                htmlContent = '';
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                $('#reserveFloor').find('option').remove();
                var originItemForFloor = ['FloorId', 'defaultFloorList', 'FloorName'];

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

            function getReserveData(roomId, date, data) {
                arrReserve = [];
                if (data.length === 0) {
                    var newReserve = new reserveObj(roomId, date);
                    arrClickReserve.push(newReserve);
                } else {
                    for (var i = 0, item; item = data[i]; i++) {
                        var newReserve = new reserveObj(roomId, date);
                        newReserve.addDetail('traceID', item.ReserveTraceID);

                        //to do 
                        //api feild is empty

                        // newReserve.addDetail('eName', item.EMail.substring(0, item.EMail.indexOf('@')));
                        newReserve.addDetail('bTime', item.BTime);
                        // newReserve.addDetail('ext', item.Ext_No);
                        // newReserve.addDetail('email', item.EMail);

                        newReserve.addDetail('eName', 'Kevin.YW.Liu@BenQ.com.tw'.substring(0, 'Kevin.YW.Liu@BenQ.com.tw'.indexOf('@')));
                        newReserve.addDetail('ext', '8888');
                        newReserve.addDetail('email', 'Kevin.YW.Liu@BenQ.com.tw');

                        arrReserve.push(newReserve);
                        arrClickReserve.push(newReserve);
                    }
                }

                //save to local data
                reserveDetailLocalData.content = [];
                reserveDetailLocalData.content.push(arrClickReserve);
                localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));

                getMettingStatus();
            }

            function getMettingStatus() {
                htmlContent = '';
                $('#defaultTimeSelectId').nextAll().remove();
                var arrClass = ['a', 'b', 'c', 'd'];
                var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', '[msg]', '[ext]', '[email]', '[traceID]'];
                var j = 0;

                var filterTimeBlock = grepData(arrTimeBlock, 'category', siteCategoryID);
                filterTimeBlock.sort(function(a, b) {
                    return new Date(new Date().toDateString() + ' ' + a.time) - new Date(new Date().toDateString() + ' ' + b.time);
                });

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
                    var replaceItem = ['time-' + timeID, bTime, eName, 'ui-block-' + classId, '', reserveClass, msg, ext, email, traceID];

                    htmlContent
                        += replaceStr($('#defaultTimeSelectId').get(0).outerHTML, originItem, replaceItem);

                    msg = '';
                    j++;
                }

                $('#reserveDateSelect > div').append(htmlContent);
            }

            // function getReserveData(roomId, date) {
            //     var self = this;
            //     this.successCallback = $.getJSON('js/QueryReserve', function(data) {
            //         if (data['result_code'] == '1') {
            //             arrReserve = [];
            //             for (var i = 0, item; item = data['content'][i]; i++) {
            //                 var newReserve = new reserveObj(roomId, date);
            //                 newReserve.addDetail('traceID', item.ReserveTraceID);
            //                 newReserve.addDetail('eName', item.Name_EN);
            //                 newReserve.addDetail('bTime', item.BTime);
            //                 newReserve.addDetail('ext', item.Ext_No);
            //                 newReserve.addDetail('email', item.EMail);
            //                 arrReserve.push(newReserve);
            //             }

            //             getMettingStatus();
            //         }
            //     });
            // }

            function settingList() {
                htmlContent = '';
                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));

                if (roomSettingdata != null) {
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strValue = item.site + '&' + item.floor + '&' + item.people + '&' + item.timeID
                        htmlContent += '<option id=' + item.id + ' value=' + strValue + '>' + item.title + '</option>';
                    }
                }

                $('#defaultListItem').after(htmlContent);
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
                $('#scrollDate a:first-child').addClass('hover');
                $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
            }

            function getAPIQueryReserveDetail(roomId, date) {
                var dataExist = false;
                //local data exist
                reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));

                //to do ****
                //reserveDetailLocalData[0][i] 取不到值
                //clas = hover 不在call api , 防呆
                for (var i = 0, item; item = reserveDetailLocalData[i]; i++) {
                    if ((item.roomId === roomId && item.date === date) && checkDataExpired(item.lastUpdateTime, 60, 'ss')) {
                        getReserveData(roomId, date, item);
                        dataExist = true;
                    }
                }

                if (!dataExist) {
                    var self = this;
                    var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate></LayoutHeader>';

                    this.successCallback = function(data) {
                        if (data['ResultCode'] === "1") {
                            // if (data['Content'].length != 0) {
                            getReserveData(roomId, date, data['Content']);
                            // }
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
                        if (page == 'pageOne') {
                            for (var item in timeClick) {
                                $('#' + timeClick[item]).removeClass('reserveSelectIcon');
                                $('#' + timeClick[item]).removeClass('reserveSelect');
                                $('#' + timeClick[item]).addClass('ui-color-myreserve');
                            }
                        }
                        popupMsg('reservePopupMsg', '預約成功', '', true, '確定', '#', '#');

                    } else if (data['ResultCode'] === "002903") {
                        //Reservation Failed, Someone Made a Reservation
                        popupMsg('reservePopupMsg', '預約失敗，有人預約', '', true, '確定', '#', '#');

                    } else if (data['ResultCode'] === "002904") {
                        //Reservation Failed, Repeated a Reservation
                        popupMsg('reservePopupMsg', '預約失敗，重複預約', '', true, '確定', '#', '#');
                    }

                    if (page == 'pageTwo') {
                        $('#quickReserveDateSelect div').find('.ui-bar').removeClass('ui-btn-active');
                        $('#quickReserve').removeClass('btn-benq');
                        $('#quickReserve').addClass('btn-benq-disable');
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
                        popupMsg('reservePopupMsg', '取消預約成功', '', true, '確定', '#', '#');

                    } else if (data['ResultCode'] === "002906") {
                        //Cancel a Reservation Failed
                        popupMsg('reservePopupMsg', '取消預約失敗', '', true, '確定', '#', '#');
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
                        $('#quickReserveMsgArea h2').html(data['Content']['”MeetingRoomName”'] + '會議室可使用');
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

                $('#pageOne').show();
                $('#pageTwo').hide();
                siteCategoryID = dictSiteCategory[meetingRoomTreeData._root.children[0].data];
                getFloorData('0');
                dateList();
                settingList();
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId);
                // getReserveData(clickRomeId, clickDateId);

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
                //getReserveData(clickRomeId, clickDateId);
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId);

            });

            $('#reserveFloor').change(function() {
                getRoomData(clickSiteId, this.selectedIndex);
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));


                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId);
            });

            $('body').on('click', '#scrollDate .ui-link', function() {
                clickDateId = $(this).attr('id').replaceAll('one', '');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                //getReserveData(clickRomeId, clickDateId);
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId);
            });

            $('body').on('click', '#reserveRoom .ui-link', function() {
                clickRomeId = $(this).attr('id');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                //getReserveData(clickRomeId, clickDateId);
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId);
            });

            $('body').on('click', 'div[id^=time]', function() {
                if ($(this).hasClass('ui-color-myreserve')) {

                    traceID = $(this).attr('traceID');
                    popupMsg('reservePopupMsg', $(this).attr('msg'), '取消', false, '確定', '#', '#');

                } else if ($(this).hasClass('ui-color-reserve')) {

                    popupMsg('reservePopupMsg', $(this).attr('msg'), 'Mail To ' + $(this).attr('ename'), false, 'Call ' + $(this).attr('ename'), 'mailto:' + $(this).attr('email'), 'tel:' + $(this).attr('ext'));

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
            });

            $("#reservePopupMsg #confirm").on('click', function() {
                if ($(this).val() == 'myreserve') {
                    var doAPIReserveCancel = new getAPIReserveCancel(clickDateId, traceID);
                }
            });

            $("#reserveBtn").on('click', function() {
                var timeID = '';
                for (var item in timeClick) {
                    timeID += timeClick[item] + ',';
                }

                //replace end of comma
                var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageOne', clickRomeId, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
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

                if ($('#quickReserveDateSelect div').find('.ui-bar').hasClass('ui-btn-active')) {
                    $('#quickReserve').removeClass('btn-benq-disable');
                    $('#quickReserve').addClass('btn-benq');
                }
            });

            $('#quickReserve').on('click', function() {
                if (!$(this).hasClass('btn-benq-disable')) {
                    var arrSelectedValue = quickReserveSelectedValue.split('&');
                    var quickReserveDay = quickReserveClickDateID.replaceAll('two', '');
                    // getAPIQuickReserve(date, site, floor, people, time)
                    var doAPIQuickReserve = new getAPIQuickReserve(quickReserveDay, arrSelectedValue[0], arrSelectedValue[1].replaceAll('F', '').replace(/,\s*$/, ""), arrSelectedValue[2], arrSelectedValue[3]);
                }
            });

            $("#quickReserveConfirm").on('click', function() {
                clickRomeId = quickRserveCallBackData['“MeetingRoomID”'];
                clickDateId = quickReserveClickDateID.replaceAll('two', '');
                timeID = quickRserveCallBackData['”ReserveTimeID”'];
                var doAPIReserveMeetingRoom = new getAPIReserveMeetingRoom('pageTwo', clickRomeId, clickDateId, timeID);
            });
        }
    });
});
