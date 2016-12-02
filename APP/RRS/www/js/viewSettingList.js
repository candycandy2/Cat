$(document).one('pagecreate', '#viewSettingList', function() {

        var roomSettingdata = {};
        var htmlContent = '';

        $('#viewSettingList').pagecontainer({
            create: function(event, ui) {

                /********************************** function *************************************/

                function querySettingList() {

                    roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));

                    htmlContent = '';

                    if (roomSettingdata != null) {
                        // if (roomSettingdata.length != 0) {
                        for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                            htmlContent += replaceStr($('#settingList').get(0).outerHTML, item);
                        }
                    }

                    $('#settingList').remove();
                    $('#defaultSettingList').after(htmlContent);
                }

                /********************************** page event *************************************/
                $('#viewSettingList').on('pagebeforeshow', function(event, ui) {
                    // loadingMask("show");
                    querySettingList();
                });

                /********************************** dom event *************************************/
                $('body').on('click', '#settingDelete', function() {
                    // $('#settingDelete a').on('click', function() {
                    var id = $(this).attr('value');
                    var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                    roomSettingdata.content =
                        roomSettingdata.content.filter(function(item) {
                            return item.id != id;
                        });
                    localStorage.setItem('roomSettingData', JSON.stringify(roomSettingdata));
                    // querySettingList();
                    $('#set-' + id).remove();

                });


                function replaceStr(content, item) {

                    var peopleStr = (item.people == 'none') ? '不限' : item.people + '人';
                    var timeStr = '';
                    if (item.time == 'none') {
                        timeStr = '現在起一小時';
                    } else {
                        var sTimeStr = new Date(new Date().toDateString() + ' ' + item.time)
                        sTimeStr.setMinutes(sTimeStr.getMinutes() + 30);
                        var eTimeStr = sTimeStr.hhmm();
                        timeStr = item.time + ' - ' + eTimeStr;
                    }
                    var floorStr = (item.floor == 'none') ? '不限' : item.floor;

                    return content
                        .replace('settingList', 'set-'+item.id)
                        .replace('index', item.id)
                        .replace('title', item.title)
                        .replace('people', peopleStr)
                        .replace('time', timeStr)
                        .replace('floor', floorStr);
                }

            }
        });

    });