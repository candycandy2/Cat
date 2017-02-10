//$(document).one('pagecreate', '#viewNewSetting', function() {

    var seqClick = [];
    var siteIDforSetting = '';
    var siteCategoryIDforSetting = '';
    var selectTime = {};
    var arrTimeMM = ['00', '30'];

    $('#viewNewSetting').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getFloorData(siteIndex) {
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                var arrClass = ['b', 'c', 'a'];
                var originItem = ['不限', 'floorDefault', 'ui-block-a'];
                htmlContent = '';

                for (var i = 0, item; item = meetingRoomData.children[siteIndex].children[i]; i++) {
                    var j = i % 3;
                    var replaceItem = [item.data, item.data, 'ui-block-' + arrClass[j]];
                    htmlContent
                        += replaceStr($('#floorDefault').get(0).outerHTML, originItem, replaceItem);
                }

                $('#floorDefault').after(htmlContent);
                $('#floorDefault div').addClass('ui-btn-active');
            }

            function changeEditStatus() {
                var roomSettingEditdata = JSON.parse(localStorage.getItem('roomSettingData'));
                roomSettingEditdata = roomSettingEditdata.content.filter(function(item) {
                    return item.id == clickEditSettingID;
                });

                var editTitle = roomSettingEditdata[0].title;
                var editSite = roomSettingEditdata[0].site;
                var editPeople = roomSettingEditdata[0].people;
                var editTime = roomSettingEditdata[0].time;
                var editFloorName = roomSettingEditdata[0].floorName;

                $('#newSettingTitle').val(editTitle);

                $("#newSettingSite").val(editSite).change();
                $('#newSettingSite option[value=' + editSite + ']').prop('selected', true);
                //$("#newSettingSite").selectmenu("refresh");

                $('#newSettingPeople input[id^=num-]').removeAttr("checked");
                $('#newSettingPeople input[value=' + editPeople + ']').prop("checked", "checked");
                $('#newSettingPeople input[id^=num-]').checkboxradio("refresh");

                $('#newSettingTime input[id^=setTime]').removeAttr("checked");
                if (editTime == 'none') {
                    $('#newSettingTime input[id=setTime1]').prop("checked", "checked");
                } else {
                    $('#newSettingTime input[id=setTime2]').prop("checked", "checked");
                    $('#newSettingTime label[for=setTime2]').text(editTime);

                    selectTime['bTime'] = editTime.split('~')[0];
                    selectTime['eTime'] = editTime.split('~')[1];
                }
                $('#newSettingTime input[id^=setTime]').checkboxradio("refresh");
                if (editFloorName != 'none') {
                    $('#floorDefault div').removeClass('ui-btn-active');
                    var arrEditFloor = editFloorName.split(',');

                    //for (var key in arrEditFloor) {
                    seqClick = [];
                    for (var i = 0, item; item = arrEditFloor[i]; i++) {
                        $('#newSettingFloor div[id=' + item + '] > div').addClass('ui-btn-active');
                        $('#newSettingFloor div[id=' + item + '] > div').append('<div id=cntIcon' + item + ' class="cntIcon"></div>');
                        $('#newSettingFloor').find('#cntIcon' + item).text(i + 1);
                        seqClick.push(item);
                    }

                } else {
                    $('#floorDefault div').addClass('ui-btn-active');
                }
            }

            function setDefaultStatus() {
                $('#newSettingTitle').val('');
                var defaultSite = $("#newSettingSite option:first").val();
                $("#newSettingSite").val(defaultSite).change();
                $("#newSettingSite option:first").attr("selected", "selected");
                $('#newSettingPeople input[value=0]').prop("checked", "checked");
                $('#newSettingPeople input[id^=num-]').checkboxradio("refresh");
                $('#newSettingTime input[id=setTime1]').prop("checked", "checked");
                $('#newSettingTime input[id^=setTime]').checkboxradio("refresh");
                selectTime = {};
                $('label[for^=setTime2]').text('指定時段');
                $('#floorDefault div').addClass('ui-btn-active');
                $.each(seqClick, function(index, value) {
                    $('#newSettingFloor div[id=' + value + '] > div').removeClass('ui-btn-active');
                });
                seqClick = [];
                $('#newSettingFloor div[id^=cntIcon]').remove();
            }

            function showPopupAlert(content) {
                $('.showMsg > span').html(content);
                $('.showMsg').css('display', '');
                $('.showMsg').delay(1000).fadeOut(400);
            }

            /********************************** page event *************************************/
            $('#viewNewSetting').one('pagebeforeshow', function(event, ui) {
                siteIDforSetting = meetingRoomData.children[0].data;
                siteCategoryIDforSetting = dictSiteCategory[meetingRoomData.children[0].data];
                getFloorData('0');
                //setDefaultStatus();
            });

            $('#viewNewSetting').on('pagebeforeshow', function(event, ui) {
                seqClick = [];
                if (clickEditSettingID != '') {
                    changeEditStatus();
                }else{
                    setDefaultStatus();
                }
            });

            $('#viewNewSetting').on('pageshow', function(event, ui) {
                calSelectWidth($('#newSettingSite'));
            });

            /********************************** dom event *************************************/
            $('#newSettingSite').change(function() {
                seqClick = [];
                $('#floorDefault div').removeClass('ui-btn-active');
                $('#floorDefault').nextAll().remove();
                siteIDforSetting = $(this).val();
                siteCategoryIDforSetting = dictSiteCategory[$(this).val()];
                getFloorData(this.selectedIndex);
                calSelectWidth($(this));
            });

            $('#setTime2').on('click', function() {
                var setTimeStr = $('label[for^=setTime2]').text();
                if (setTimeStr != '指定時段') {
                    var arrTimeStr = setTimeStr.split('~');
                    var arrSTimeHrMM = arrTimeStr[0].split(':');
                    var arrETimeHrMM = arrTimeStr[1].split(':');

                    $('div[tpye=s][for=hr]').html(arrSTimeHrMM[0].trim());
                    $('div[tpye=s][for=mm]').html(arrSTimeHrMM[1].trim());
                    $('div[tpye=e][for=hr]').html(arrETimeHrMM[0].trim());
                    $('div[tpye=e][for=mm]').html(arrETimeHrMM[1].trim());
                }

                $('#newSettingTimePickerPopup #cancel').html('取消');
                $('#newSettingTimePickerPopup #confirm').html('設定時間');
                $('#newSettingTimePickerPopup').removeClass();
                $('#newSettingTimePickerPopup button').removeClass();
                $('#newSettingTimePickerPopup').popup();
                $('#newSettingTimePickerPopup').popup('open');
            });

            // click floor button
            $('body').on('click', '#newSettingFloor .ui-bar', function() {

                var id = $(this).parent().attr('id');

                if (id == 'floorDefault') {
                    seqClick = [];
                    $('#floorDefault div').addClass('ui-btn-active');
                    $('#floorDefault').nextAll().find('.ui-bar').removeClass('ui-btn-active');
                    $('div[class*=cntIcon]').remove();

                } else {
                    if ($(this).hasClass('ui-btn-active')) {
                        seqClick.splice(seqClick.indexOf(id), 1);
                        $(this).removeClass('ui-btn-active');
                        $(this).find('.cntIcon').remove();

                    } else {
                        seqClick.push(id);
                        $('#floorDefault div').removeClass('ui-btn-active');
                        $(this).addClass('ui-btn-active');
                        $(this).append('<div id=cntIcon' + id + ' class="cntIcon"></div>');
                    }
                }

                if (seqClick.length == 0) {
                    $('#floorDefault div').addClass('ui-btn-active');
                } else {
                    $.each(seqClick, function(index, value) {
                        $('#newSettingFloor').find('#cntIcon' + value).text(index + 1);
                    });
                }
            });

            // click save button
            $('#newSettingSave').on('click', function() {
                var validationResult = inputValidation($('#newSettingTitle').val())
                if (validationResult[0]) {

                    var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));

                    if (clickEditSettingID != '') {
                        //Edit Status, Update Local Data
                        roomSettingdata.content = roomSettingdata.content.filter(function(item) {
                            return item.id != clickEditSettingID;
                        });
                    }

                    var obj = new Object();
                    if (roomSettingdata == null) {
                        obj.id = '1';
                    } else if (clickEditSettingID != '') {
                        obj.id = clickEditSettingID;

                    } else {
                        obj.id = roomSettingdata['content'].length + 1;
                    }
                    obj.title = $('#newSettingTitle').val();
                    obj.site = $('#newSettingSite').val();
                    obj.siteName = $('#newSettingSite').find(":selected").text();
                    obj.people = $("#newSettingPeople :radio:checked").val();

                    if ($("#newSettingTime :radio:checked").val() === 'setTime') {
                        obj.time = selectTime['bTime'] + '~' + selectTime['eTime'];
                        obj.timeID = getTimeID(selectTime['bTime'], selectTime['eTime'], siteCategoryIDforSetting).replace(/,\s*$/, "");
                    } else {
                        obj.time = 'none'
                        obj.timeID = 'none';
                    }

                    var strFloor = '';
                    $.each(seqClick, function(index, value) {
                        strFloor += value + ',';
                    });
                    //replace end of comma
                    obj.floorName = strFloor.replace(/,\s*$/, "");
                    if (strFloor == '') {
                        var index = findIndex(meetingRoomData.children, siteIDforSetting);
                        $.each(meetingRoomData.children[index].children, function(index, value) {
                            strFloor += value.data + ',';
                        });
                        obj.floorName = 'none';
                    }
                    obj.floor = strFloor.replaceAll('F', '').replace(/,\s*$/, "");

                    var jsonData = {};
                    if (roomSettingdata == null) {
                        jsonData = {
                            content: [obj]
                        };
                    } else {
                        roomSettingdata.content.push(obj);
                        jsonData = roomSettingdata;
                    }

                    localStorage.setItem('roomSettingData', JSON.stringify(jsonData));

                    setDefaultStatus();
                    clickEditSettingID = '';
                    $.mobile.changePage('#viewSettingList');

                } else {
                    popupMsg('validationMsg', '', validationResult[1], '', false, '確定', '');
                }

            });

            $('body').on('click', 'div[for=validationMsg] #confirm', function() {
                $('div[for=validationMsg]').popup('close');
            });

            $('#newSettingBack').on('click', function() {
                setDefaultStatus();
                clickEditSettingID = '';
                $.mobile.changePage('#viewSettingList');
            });

            $('#newSettingTimePickerPopup .timepicker-icon').on('click', function() {

                var clickValue = $(this).attr('value');
                var clickType = $(this).attr('type');
                var clickFormate = $(this).attr('formate');

                var tempHr = $('div[tpye=' + clickType + '][for=hr]').html();
                var tempMM = $('div[tpye=' + clickType + '][for=mm]').html();
                var tempStr = '';
                var timeIndex = 0;
                var checkTime = false;

                if (clickFormate == 'hr') {
                    if (clickValue == 'up') {
                        tempStr = padLeft((parseInt(tempHr) + 1).toString(), 2);
                    } else {
                        tempStr = padLeft((parseInt(tempHr) - 1).toString(), 2);
                    }
                    if (parseInt(tempStr) < 8 || parseInt(tempStr) > 17) {
                        checkTime = true;
                    }
                }

                if (clickFormate == 'mm') {
                    timeIndex = arrTimeMM.indexOf(tempMM);
                    timeIndex = timeIndex == 0 ? 1 : 0;
                    tempStr = arrTimeMM[timeIndex];
                }

                if (checkTime) {
                    showPopupAlert('可設定時間為08:00到17:30');
                } else {
                    $('div[tpye=' + clickType + '][for=' + clickFormate + ']').html(tempStr);
                }
            });

            $('body').on('click', '#newSettingTimePickerPopup #confirm', function() {
                var bTime = $('div[tpye=s][for=hr]').html() + ':' + $('div[tpye=s][for=mm]').html();
                var eTime = $('div[tpye=e][for=hr]').html() + ':' + $('div[tpye=e][for=mm]').html();
                var bTimeToDate = new Date(new Date().toDateString() + ' ' + bTime);
                var eTimeToDate = new Date(new Date().toDateString() + ' ' + eTime);
                if (eTimeToDate < bTimeToDate) {
                    showPopupAlert('結束時間不可小於開始時間');
                } else {
                    $('label[for^=setTime2]').text(bTime + '~' + eTime);
                    selectTime['bTime'] = bTime;
                    selectTime['eTime'] = eTime;
                    $('#newSettingTimePickerPopup').popup('close');
                }
            });

            $('body').on('click', '#newSettingTimePickerPopup #cancel', function() {
                $('div[tpye=s][for=hr]').html('08');
                $('div[tpye=s][for=mm]').html('00');
                $('div[tpye=e][for=hr]').html('08');
                $('div[tpye=e][for=mm]').html('30');
                $('#newSettingTime input[id^=setTime]').removeAttr("checked");
                $('#newSettingTime input[id=setTime1]').prop("checked", "checked");
                $('#newSettingTime input[id^=setTime]').checkboxradio("refresh");
                $('#newSettingTimePickerPopup').popup('close');
            });
        }
    });
//});
