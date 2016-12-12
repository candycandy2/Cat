$(document).one('pagecreate', '#viewSettingList', function() {

    var roomSettingdata = {};
    var htmlContent = '';
    var clickDeleteID = '';

    $('#viewSettingList').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function querySettingList() {

                $('div[id^=set-]').remove();

                roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                var originItem = ['settingList', '[index]', '[title]', '[siteName]', '[people]', '[time]', '[floor]', 'disable'];
                htmlContent = '';

                if (roomSettingdata != null) {
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strPeople = (item.people == 'none') ? '不限' : (item.people == '2') ? '2~8人' : '8人以上';
                        var strTime = (item.time == 'none') ? "現在起一小時" : item.time;
                        var strFloor = (item.floor == 'none') ? '不限' : item.floor;
                        var replaceItem = ['set-' + item.id, item.id, item.title, item.siteName, strPeople, strTime, strFloor, ''];
                        htmlContent += replaceStr($('#settingList').get(0).outerHTML, originItem, replaceItem);
                    }
                }

                $('#defaultSettingList').after(htmlContent);
            }

            /********************************** page event *************************************/
            $('#viewSettingList').on('pagebeforeshow', function(event, ui) {
                querySettingList();
            });

            /********************************** dom event *************************************/
            $('body').on('click', '#settingDelete', function() {

                clickDeleteID = $(this).attr('value');
                popupMsg('settingListPopupMsg', 'deleteMsg', '是否確定刪除', '取消', false, '確定', '#', '#');

            });

            // $('div[for=deleteMsg] #confirm').on('click', function() {
            $('body').on('click', 'div[for=deleteMsg] #confirm', function() {

                var roomSettingdata = JSON.parse(localStorage.getItem('roomSettingData'));
                roomSettingdata.content = roomSettingdata.content.filter(function(item) {
                    return item.id != clickDeleteID;
                });
                localStorage.setItem('roomSettingData', JSON.stringify(roomSettingdata));

                $('#set-' + clickDeleteID).hide('slow');
                $('#set-' + clickDeleteID).remove();

                $('div[for=deleteMsg]').popup('close');
            });

        }
    });

});
