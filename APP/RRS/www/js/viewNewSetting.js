$(document).one('pagecreate', '#viewNewSetting', function() {

    var seqClick = [];
    var bTime = '';
    var htmlContent = '';

    $('#viewNewSetting').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function queryNewSetting(location) {

                var self = this;

                this.successCallback = $.getJSON('js/ListAllMeetingRoom', function(data) {

                    if (data['result_code'] === '1') {

                        //filter RoomSite data
                        var roomData = $.grep(data.content, function(item, index) {
                            return item.MeetingRoomSite == location;
                        });

                        // distinct floor data
                        var floorData = $.unique(roomData.map(function(item) {
                            return item.MeetingRoomFloor;
                        }));

                        floorData.sort();

                        var arrClass = ['b', 'c', 'a'];
                        var originItem = ['不限', 'floorDefault', 'ui-block-a'];
                        htmlContent = '';

                        for (var i = 0, item; item = floorData[i]; i++) {
                            var j = i % 3;
                            var replaceItem = [item + 'F', item, 'ui-block-' + arrClass[j]];
                            htmlContent
                                += replaceStr($('#floorDefault').get(0).outerHTML, originItem, replaceItem);

                        }

                        $('#floorDefault').after(htmlContent);
                        $('#floorDefault div').addClass('ui-btn-active');

                    } else {
                        //ResultCode = 001901, [no data]
                    }
                });

                // this.failCallback = function(data) {};

                // var __construct = function() {
                //     QPlayAPI("POST", "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData);
                // }();

            }

            /********************************** page event *************************************/
            $('#viewNewSetting').one('pagebeforeshow', function(event, ui) {
                // loadingMask("show");
                queryNewSetting('1');
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
                queryNewSetting($(this).val());
            });

            $('#setTime2').on('click', function() {
                $('#timeflip').datebox('open');
            });

            $('#timeflip').bind('datebox', function(e, passed) {
                if (passed.method == 'set') {
                    bTime = passed.value;
                    var eTime = addThirtyMins(bTime);
                    $('label[for^=setTime2]').text(bTime + '-' + eTime);
                }
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

                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));

                var obj = new Object();
                obj.id = (roomSettingdata == null) ? '1' : roomSettingdata['content'].length + 1;
                obj.title = $('#newSettingTitle').val();
                obj.site = $('#newSettingSite').val();
                obj.people = $("#newSettingPeople :radio:checked").val();
                obj.time = bTime;

                var floor = '';
                $.each(seqClick, function(index, value) {
                    floor += value + ';';
                });
                obj.floor = (floor == '') ? 'none' : floor;

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
            });
        }
    });

});
