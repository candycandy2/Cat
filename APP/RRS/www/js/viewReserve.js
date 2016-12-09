$(document).one('pagecreate', '#viewReserve', function() {

    var htmlContent = '';
    var SiteData = {};
    var roomData = {};
    var floorData = {};
    var clickSiteId = '';
    var siteCategoryID = '';
    var clickDateId = '';
    var clickRomeId = '';
    var clickTraceID = '';
    var timeClick = [];

    $('#viewReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getSiteData() {
                htmlContent = '';
                $('#reserveSite').find('option').remove();

                for (var i = 0, item; item = meetingRoomTreeData._root.children[i]; i++) {
                    htmlContent += '<option value=' + item.data + '>' + dictSite[item.data] + '</option>';
                }

                $('#reserveSite').append(htmlContent);
                var firstNode = meetingRoomTreeData._root.children[0].data;
                siteCategoryID = dictSiteCategory[firstNode];
                $('#reserveSite-button').find('span').text(dictSite[firstNode]);
                getFloorData('0');
            }

            function getFloorData(siteIndex) {
                htmlContent = '';
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
                $('#reserveRoom').find('a').remove();

                for (var i = 0, item; item = meetingRoomTreeData._root.children[siteIndex].children[floorIndex].children[i]; i++) {
                    htmlContent += '<a id=' + item.data.MeetingRoomID + ' value=' + item.data.MeetingRoomID + ' href="#" class="ui-link">' + item.data.MeetingRoomName + '</a>';
                }

                $('#reserveRoom').append(htmlContent);
                clickRomeId = $('#reserveRoom a:first-child').attr('id');
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));
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

            function getReserveData(roomId, date) {
                //REVIEW by Alan 
                //if MeetingData exist && (LastReserveDataUpdateTime not expire) PS: [60] seconds
                    //
                //else
                    //get data by API
                    //keep LastReserveDataUpdateTime from API

                var self = this;
                this.successCallback = $.getJSON('js/QueryReserve', function(data) {
                    if (data['result_code'] == '1') {
                        arrReserve = [];
                        for (var i = 0, item; item = data['content'][i]; i++) {
                            var newReserve = new reserveObj(roomId, date);
                            newReserve.addDetail('traceID', item.ReserveTraceID);
                            newReserve.addDetail('eName', item.Name_EN);
                            newReserve.addDetail('bTime', item.BTime);
                            newReserve.addDetail('ext', item.Ext_No);
                            newReserve.addDetail('email', item.EMail);
                            arrReserve.push(newReserve);
                        }

                        getMettingStatus();
                    }
                });
            }

            function settingList() {
                htmlContent = '';
                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));

                if (roomSettingdata != null) {
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        htmlContent += '<option id=' + item.id + ' value=' + item.id + '>' + item.title + '</option>';
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

                var self = this;
                var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] == "1") {
                        for (var i = 0, item; item = data['content'][i]; i++) {
                            var newReserve = new reserveObj(roomId, date);
                            newReserve.addDetail('traceID', item.ReserveTraceID);
                            newReserve.addDetail('eName', item.EMail.substring(0, item.EMail.indexOf('@')));
                            newReserve.addDetail('bTime', item.BTime);
                            newReserve.addDetail('ext', item.Ext_No);
                            newReserve.addDetail('email', item.EMail);
                            arrReserve.push(newReserve);
                        }

                        getMettingStatus();
                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", "QueryReserveDetail", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIReserveMeetingRoom(roomId, date, timeID) {
                var self = this;
                var queryData = '<LayoutHeader><MeetingRoomID>' + roomId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTimeID>' + timeID + '</ReserveTimeID></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] == "002902") {
                        //Reservation Successful

                    } else if (data['ResultCode'] == "002903") {
                        //Reservation Failed, Someone Made a Reservation

                    } else if (data['ResultCode'] == "002904") {
                        //Reservation Failed, Repeated a Reservation

                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", "ReserveMeetingRoom", self.successCallback, self.failCallback, queryData);
                }();
            }

            function getAPIReserveCancel(date, traceID) {
                var self = this;
                var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID>' + traceID + '</ReserveTraceID><ReserveTraceAggID></ReserveTraceAggID></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] == "002905") {
                        //Cancel a Reservation Successful


                    } else if (data['ResultCode'] == "002906") {
                        //Cancel a Reservation Failed

                    }
                };

                this.failCallback = function(data) {
                    console.log('apiFailCallback');
                };

                var __construct = function() {
                    QPlayAPI("POST", "ReserveCancel", self.successCallback, self.failCallback, queryData);
                }();
            }

            function popupMsg(value, content, btn1, btnIsDisable, btn2, href1, href2) {
                $("#PopupMsg").val(value);
                $("#PopupMsg #msgContent").html(content);
                $("#PopupMsg #cancel").html(btn1);
                if (btnIsDisable == true) {
                    $("#PopupMsg #cancel").addClass('disable')
                }
                $("#PopupMsg #confirm").html(btn2);
                $("#PopupMsg #cancel").attr('href', href1);
                $("#PopupMsg #confirm").attr('href', href2);
                $("#PopupMsg").popup(); //initialize the popup
                $('#PopupMsg').popup('open');
            }

            /********************************** page event *************************************/

            $('#viewReserve').one('pageshow', function(event, ui) {
                dateList();
                settingList();

                getSiteData();
                // getAPIQueryReserveDetail(clickRomeId, clickDateId);
                getReserveData(clickRomeId, clickDateId);
            });

            /********************************** dom event *************************************/

            var clickid = '';
            $('body').on('click', '#quickReserveDateSelect .ui-bar', function() {
                if (clickid != '') {
                    $('#' + clickid + ' div').removeClass('ui-btn-active');
                }
                $(this).addClass('ui-btn-active');
                clickid = $(this).parent().attr('id');

                if ($('#quickReserveDateSelect div').find('.ui-bar').hasClass('ui-btn-active')) {
                    $('#quickReserve').removeClass('btn-benq-disable');
                    $('#quickReserve').addClass('btn-benq');
                }
            });

            $('#quickReserve').on('click', function() {
                $('#quickReserveCancel').removeClass('disable');
                $('#msgArea').removeClass('disable');
            });

            $('#reserveSite').change(function() {
                siteCategoryID = dictSiteCategory[$(this).val()];
                clickSiteId = this.selectedIndex;
                getFloorData(clickSiteId);
                getReserveData(clickRomeId, clickDateId);
            });

            $('#reserveFloor').change(function() {
                getRoomData(clickSiteId, this.selectedIndex);
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));
            });

            $('body').on('click', '#scrollDate .ui-link', function() {
                clickDateId = $(this).attr('id').replaceAll('one', '');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                getReserveData(clickRomeId, clickDateId);
            });

            $('body').on('click', '#reserveRoom .ui-link', function() {
                clickRomeId = $(this).attr('id');
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                getReserveData(clickRomeId, clickDateId);
            });

            $('body').on('click', 'div[id^=time]', function() {
                if ($(this).hasClass('ui-color-myreserve')) {

                    traceID = $(this).attr('traceID');
                    popupMsg('myreserve', $(this).attr('msg'), '取消', false, '確定', '#', '#');
                    // $("#PopupMsg").val('myreserve');
                    // $("#PopupMsg #msgContent").html($(this).attr('msg'));
                    // $("#cancel").html('取消');
                    // $("#confirm").html('確定');
                    // $("#cancel").attr('href', '＃');
                    // $("#confirm").attr('href', '＃');
                    // $("#PopupMsg").popup(); //initialize the popup
                    // $('#PopupMsg').popup('open');

                } else if ($(this).hasClass('ui-color-reserve')) {

                    popupMsg('reserve', $(this).attr('msg'), 'Mail To ' + $(this).attr('ename'), false, 'Call ' + $(this).attr('ename'), 'mailto:' + $(this).attr('email'), 'tel:' + $(this).attr('ext'));

                    // $("#PopupMsg").val('reserve');
                    // $("#PopupMsg #msgContent").html($(this).attr('msg'));
                    // $("#cancel").html('Mail To ' + $(this).attr('ename'));
                    // $("#confirm").html('Call ' + $(this).attr('ename'));
                    // $("#cancel").attr('href', 'mailto:' + $(this).attr('email'));
                    // $("#confirm").attr('href', 'tel:' + $(this).attr('ext'));
                    // $("#PopupMsg").popup(); //initialize the popup
                    // $('#PopupMsg').popup('open');

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

            $("#PopupMsg #confirm").on('click', function() {
                if ($(this).val() == 'reserve') {
                    getAPIReserveCancel(clickDateId, traceID);
                }
            });

            $("#reserveBtn").on('click', function() {
                var timeID = '';
                for (var item in timeClick) {
                    timeID += timeClick[item] + ',';
                }

                //replace end of comma
                getAPIReserveMeetingRoom(clickRomeId, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
            });
        }
    });
});
