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

            /********************************** page event *************************************/
            $('#viewNewSetting').one('pagebeforeshow', function(event, ui) {
                siteCategoryIDforSetting = dictSiteCategory[meetingRoomTreeData._root.children[0].data];
                getFloorData('0');
            });

            $('#viewNewSetting').on('pagebeforeshow', function(event, ui) {
                seqClick = [];
                $('#newSettingTitle').val('');
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
                $('#timeflip1').datebox('open');
            });

            $('#timeflip1').bind('datebox', function(e, passed) {
                if (passed.method == 'set') {
                    bTime = passed.value;
                    var eTime = addThirtyMins(bTime);
                    $('label[for^=setTime2]').text(bTime + '-' + eTime);
                    selectTime['bTime'] = bTime;
                    selectTime['eTime'] = eTime;
                }
                // else if (passed.method == 'close') {
                //     $("input[id=setTime1]").trigger('click');
                //     $("label[for=setTime1]").addClass('ui-btn-active');
                //     $("label[for=setTime2]").removeClass('ui-btn-active');
                // }
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
                        $(this).append('<div id=cntIcon' + id + ' class="btn-benq cntIcon"></div>');
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

                    var obj = new Object();
                    obj.id = (roomSettingdata == null) ? '1' : roomSettingdata['content'].length + 1;
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

                    $.mobile.changePage('#viewSettingList');

                } else {
                    popupMsg('newSettingPpupMsg', 'validationMsg', validationResult[1], '', true, '確定', '#', '#');
                }

            });

            $('body').on('click', 'div[for=validationMsg] #confirm', function() {

                $('div[for=validationMsg]').popup('close');

            });
        }
    });
});
