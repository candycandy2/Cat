$(document).one('pagecreate', '#viewReserve', function() {

    var roomSiteData = {};
    var roomData = {};
    var floorData = {};
    var clickDateId = '';
    var clickRomeId = '';
    var dict = {
        '1': '(一)',
        '2': '(二)',
        '3': '(三)',
        '4': '(四)',
        '5': '(五)'
    };
    var userName = 'kevin';
    var timeClick = [];

    $('#viewReserve').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/

            // function queryReserve(value) {
            //     switch (value) {
            //         default:
            //             case 'tabOne':

            //             break;
            //         case 'tabTwo':

            //             break;
            //     }
            // }

            function getMettingStatus() {
                $('#defaultTimeSelectId').nextAll().remove();
                var arrClass = ['a', 'b', 'c', 'd'];
                var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', '[msg]', '[ext]', '[email]'];
                var htmlContent = '';
                var j = 0;
                for (var i = 0, item; item = timeBlockArr[i]; i++) {
                    var classId = arrClass[j % 4];
                    var reserveStr = 'ui-color-noreserve';
                    var msg = '',
                        eName = '',
                        ext = '',
                        email = '';
                    for (var k = 0, arr; arr = arrReserve[k]; k++) {
                        if (arr.detailInfo[4].value == item) {
                            if (arr.detailInfo[2].value == userName) {
                                reserveStr = 'ui-color-myreserve';
                            } else {
                                reserveStr = 'ui-color-reserve';
                            }
                            eName = arr.detailInfo[2].value;
                            ext = arr.detailInfo[5].value;
                            email = arr.detailInfo[6].value;
                            msg = arr.date + ',' + arr.detailInfo[3].value + ',' + arr.detailInfo[4].value + '-' + addThirtyMins(arr.detailInfo[4].value) + ',' + eName
                        }
                    }
                    var replaceItem = ['time-' + i, item, eName, 'ui-block-' + classId, '', reserveStr, msg, ext, email];

                    htmlContent
                        += replaceStr($('#defaultTimeSelectId').get(0).outerHTML, originItem, replaceItem);
                    j++;
                    msg = '';
                }

                $('#reserveDateSelect > div').append(htmlContent);
            }


            function getReserveData() {

                var self = this;

                this.successCallback = $.getJSON('js/QueryReserve', function(data) {

                    if (data['result_code'] == '1') {

                        for (var i = 0, item; item = data['content'][i]; i++) {

                            var newReserve = new reserveObj(item.roomId, item.reserveDate);
                            newReserve.addDetail('traceID', item.traceID);
                            newReserve.addDetail('eName', item.eName);
                            newReserve.addDetail('roomName', item.roomName);
                            newReserve.addDetail('bTime', item.bTime);
                            newReserve.addDetail('ext', item.ext);
                            newReserve.addDetail('email', item.email);
                            arrReserve.push(newReserve);

                        }

                        getMettingStatus();

                    } else {
                        //ResultCode = 001901, [no data]
                    }
                });
            }

            function queryAllFloor(location) {

                $('#reserveFloor').find('option').remove();

                var self = this;

                this.successCallback = $.getJSON('js/ListAllMeetingRoom', function(data) {

                    if (data['result_code'] == '1') {

                        //filter Site data
                        roomSiteData = $.grep(data.content, function(item, index) {
                            return item.MeetingRoomSite == location;
                        });

                        // distinct floor data
                        floorData = $.unique(roomSiteData.map(function(item) {
                            return item.MeetingRoomFloor;
                        }));

                        floorData.sort();

                        var htmlContent = '';
                        var originItemForFloor = ['FloorId', 'defaultFloorList', 'FloorName'];

                        for (var i = 0, item; item = floorData[i]; i++) {

                            var floorId = item + 'F';

                            htmlContent += '<option id=' + floorId + ' value=' + item + '>' + floorId + '</option>';
                        }

                        $('#reserveFloor').append(htmlContent);
                        //***
                        $('#reserveFloor-button').find('span').text(floorData[0] + 'F');

                        //***
                        queryAllRoom('1');
                        clickRomeId = $('#reserveRoom a:first-child').val();
                        $('#reserveRoom a:first-child').addClass('hover');
                        $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));

                    } else {
                        //ResultCode = 001901, [no data]
                    }
                });

                // this.failCallback = function(data) {};

                // var __construct = function() {
                //     QPlayAPI("POST", "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData);
                // }();

            }

            function queryAllRoom(floor) {

                $('#reserveRoom').find('a').remove();

                //filter Room data
                roomData = $.grep(roomSiteData, function(item, index) {
                    return item.MeetingRoomFloor == floor;
                });

                var htmlContent = '';
                for (var i = 0, item; item = roomData[i]; i++) {

                    var roomid = 'r' + item.MeetingRoomID;
                    htmlContent += '<a id=' + roomid + ' value=' + roomid + ' href="#" class="ui-link">' + item.MeetingRoomName + '</a>';

                }
                $('#reserveRoom').append(htmlContent);
            }

            function setListItem() {
                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                var htmlContent = '';
                if (roomSettingdata != null) {
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var id = item.id;
                        var title = item.title;
                        htmlContent += '<option id=' + id + ' value=' + id + '>' + title + '</option>';
                    }
                }
                $('#defaultListItem').after(htmlContent);
            }

            function dateListItem() {
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
                        objDate.id = addOneDate.mmdd('');
                        objDate.date = addOneDate.mmdd('/');
                        objDate.daysOfWeek = dict[addOneDate.getDay()];

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

                clickDateId = $('#scrollDate a:first-child').val();
                $('#scrollDate a:first-child').addClass('hover');
                $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
            }

            /********************************** page event *************************************/
            $('#viewReserve').on('pagebeforeshow', function(event, ui) {
                // loadingMask("show");
                // dateListItem();
                // queryAllFloor('1');
                // queryReserve('tabOne');
            });

            $('#viewReserve').one('pageshow', function(event, ui) {
                getTimeBlock();
                dateListItem();
                queryAllFloor('1');
                getReserveData();
                setListItem();
            });

            $('#viewReserve').on('pageshow', function(event, ui) {
                // queryReserve('tabOne');
            });

            /********************************** dom event *************************************/
            // $('div[data-role="navbar"] ul li a').on('click', function() {
            //     var id = $(this).attr('id');
            //     queryReserve(id);
            // });

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
                queryAllFloor($(this).val());
            });

            $('#reserveFloor').change(function() {
                queryAllRoom($(this).val());
                $('#reserveRoom a:first-child').addClass('hover');
                $('#reserveRoom a:first-child').parent().data("lastClicked", $('#reserveRoom a:first-child').attr('id'));
            });

            $('body').on('click', '#scrollDate .ui-link', function() {
                clickDateId = $(this).val();
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                getMettingStatus();

            });

            $('body').on('click', '#reserveRoom .ui-link', function() {
                clickRomeId = $(this).val();
                if ($(this).parent().data("lastClicked")) {
                    $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
                }
                $(this).parent().data("lastClicked", this.id);
                $(this).addClass('hover');

                getMettingStatus();

            });

            $('body').on('click', 'div[id^=time]', function() {
                if ($(this).hasClass('ui-color-myreserve')) {

                    $("#reserveCancelAlert #msgContent").html($(this).attr('msg'));
                    $("#reserveCancelAlert").popup(); //initialize the popup
                    $('#reserveCancelAlert').popup('open');

                } else if ($(this).hasClass('ui-color-reserve')) {

                    $("#reserveCoordinationAlert #msgContent").html($(this).attr('msg'));
                    $("#mailto").html('Mail To ' + $(this).attr('ename'));
                    $("#ext").html('Call ' + $(this).attr('ename'));
                    $("#mailto").attr('href', 'mailto:'+$(this).attr('email'));
                    $("#ext").attr('href', 'tel:'+$(this).attr('ext'));
                    $("#reserveCoordinationAlert").popup(); //initialize the popup
                    $('#reserveCoordinationAlert').popup('open');

                } else if ($(this).hasClass('ui-color-noreserve') && !$(this).hasClass('reserveSelect')) {
                    var timeBlockId = $(this).attr('id');
                    seqClick.push(timeBlockId);
                    $(this).addClass('reserveSelect');
                    $(this).addClass('reserveSelectIcon');
                } else if ($(this).hasClass('reserveSelect')) {
                    var timeBlockId = $(this).attr('id');
                    seqClick.splice(seqClick.indexOf(timeBlockId), 1);
                    $(this).removeClass('reserveSelect');
                    $(this).removeClass('reserveSelectIcon');
                }
            });

            $("#reserveCancelAlert #confirm").on('click', function() {
                //do something
            });


            function replaceStr(content, originItem, replaceItem) {
                $.each(originItem, function(index, value) {
                    content = content.replaceAll(value.toString(), replaceItem[index].toString())
                });
                return content;
            }
        }
    });

});
