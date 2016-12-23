$(document).one('pagecreate', '#viewNewSetting', function() {

    var seqClick = [];
    var siteIDforSetting = '';
    var siteCategoryIDforSetting = '';
    var selectTime = {};

    $('#viewNewSetting').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function getFloorData(siteIndex) {
                siteIndex = siteIndex == '' ? '0' : siteIndex;
                var arrClass = ['b', 'c', 'a'];
                var originItem = ['不限', 'floorDefault', 'ui-block-a'];
                htmlContent = '';

                for (var i = 0, item; item = meetingRoomTreeData._root.children[siteIndex].children[i]; i++) {
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
                $("#newSettingSite").selectmenu("refresh");

                $('#newSettingPeople input[id^=num-]').removeAttr("checked");
                $('#newSettingPeople input[value=' + editPeople + ']').prop("checked", "checked");
                $('#newSettingPeople input[id^=num-]').checkboxradio("refresh");

                $('#newSettingTime input[id^=setTime]').removeAttr("checked");
                if (editTime == 'none') {
                    $('#newSettingTime input[id=setTime1]').prop("checked", "checked");
                } else {
                    $('#newSettingTime input[id=setTime2]').prop("checked", "checked");
                    $('#newSettingTime label[for=setTime2]').text(editTime);

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
                $('#newSettingPeople input[value=0]').prop("checked", "checked");
                $('#newSettingPeople input[id^=num-]').checkboxradio("refresh");
                $('#newSettingTime input[id=setTime1]').prop("checked", "checked");
                $('#newSettingTime input[id^=setTime]').checkboxradio("refresh");
                $('label[for^=setTime2]').text('指定時段');
                $('#floorDefault div').addClass('ui-btn-active');
                $.each(seqClick, function(index, value) {
                    $('#newSettingFloor div[id=' + value + '] > div').removeClass('ui-btn-active');
                });
                seqClick = [];
                $('#newSettingFloor div[id^=cntIcon]').remove();
            }

            /********************************** page event *************************************/
            $('#viewNewSetting').one('pagebeforeshow', function(event, ui) {
                siteIDforSetting = meetingRoomTreeData._root.children[0].data;
                siteCategoryIDforSetting = dictSiteCategory[meetingRoomTreeData._root.children[0].data];
                getFloorData('0');
                setDefaultStatus();
            });

            $('#viewNewSetting').on('pagebeforeshow', function(event, ui) {
                seqClick = [];
                if (clickEditSettingID != '') {
                    changeEditStatus();
                }
            });

            /********************************** dom event *************************************/
            $('#newSettingSite').change(function() {
                seqClick = [];
                $('#floorDefault div').removeClass('ui-btn-active');
                $('#floorDefault').nextAll().remove();
                siteIDforSetting = $(this).val();
                siteCategoryIDforSetting = dictSiteCategory[$(this).val()];
                getFloorData(this.selectedIndex);
            });

            $('#setTime2').on('click', function() {
                //$('#timeflip1').datebox('open');
                
                // $('#newSettingTimePickerPopup').popup(); 
                // $('#newSettingTimePickerPopup').popup('open');
            });

            // $('#timeflip1').bind('datebox', function(e, passed) {
            //     if (passed.method == 'set') {
            //         bTime = passed.value;
            //         var eTime = addThirtyMins(bTime);
            //         $('label[for^=setTime2]').text(bTime + '-' + eTime);
            //         selectTime['bTime'] = bTime;
            //         selectTime['eTime'] = eTime;
            //     }
            //     // else if (passed.method == 'close') {
            //     //     $("input[id=setTime1]").trigger('click');
            //     //     $("label[for=setTime1]").addClass('ui-btn-active');
            //     //     $("label[for=setTime2]").removeClass('ui-btn-active');
            //     // }
            // });

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
                    obj.siteName = $('#newSettingSite-button span').text();
                    obj.people = $("#newSettingPeople :radio:checked").val();

                    if ($("#newSettingTime :radio:checked").val() === 'setTime') {
                        obj.time = selectTime['bTime'] + '~' + selectTime['eTime'];
                        obj.timeID = getTimeID(selectTime['bTime'], selectTime['eTime'], siteCategoryIDforSetting);
                    } else {
                        obj.time = 'none'
                        obj.timeID = 'none';
                    }

                    var strFloor = '';
                    $.each(seqClick, function(index, value) {
                        strFloor += value + ',';
                    });
                    obj.floorName = strFloor;
                    if (strFloor == '') {
                        var index = findIndex(meetingRoomTreeData._root.children, siteIDforSetting);
                        $.each(meetingRoomTreeData._root.children[index].children, function(index, value) {
                            strFloor += value.data + ',';
                        });
                        obj.floorName = 'none';
                    }
                    obj.floor = strFloor.replaceAll('F', '');

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
                    popupMsg('newSettingPopupMsg', 'validationMsg', '', validationResult[1], '', false, '確定', false);
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

            // $('#newSettingTimePickerPopup #cancel').on('click', function() {
            //    callscroll()
            // });

        }
    });
});
