$(document).one('pagecreate', '#viewSettingList', function() {

    var roomSettingdata = {};
    var htmlContent = '';

    $('#viewSettingList').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/

            function querySettingList() {

                $('div[id^=set-]').remove();

                roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                var originItem = ['settingList', 'index', 'title', 'people', 'time', 'floor', 'disable'];
                htmlContent = '';

                if (roomSettingdata != null) {
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strPeople = (item.people == 'none') ? '不限' : item.people + '人';
                        var strTime = (item.time == 'none') ? "現在起一小時" : item.time + '-' + addThirtyMins(item.time);
                        var strFloor = (item.floor == 'none') ? '不限' : item.floor;
                        var replaceItem = ['set-' + item.id, item.id, item.title, strPeople, strTime, strFloor, ''];
                        htmlContent += replaceStr($('#settingList').get(0).outerHTML, originItem, replaceItem);
                    }
                }

                $('#defaultSettingList').after(htmlContent);
            }

            /********************************** page event *************************************/
            $('#viewSettingList').on('pagebeforeshow', function(event, ui) {
                // loadingMask("show");
                querySettingList();
            });

            /********************************** dom event *************************************/
            $('body').on('click', '#settingDelete', function() {

                var id = $(this).attr('value');
                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                roomSettingdata.content =
                    roomSettingdata.content.filter(function(item) {
                        return item.id != id;
                    });
                localStorage.setItem('roomSettingData', JSON.stringify(roomSettingdata));

                $('#set-' + id).hide('slow');
                $('#set-' + id).remove();
            });
        }
    });

});
