//$(document).one('pagecreate', '#viewSettingList', function() {

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
                    sortDataByKey(roomSettingdata.content, 'id', 'asc');
                    for (var i = 0, item; item = roomSettingdata['content'][i]; i++) {
                        var strPeople = (item.people == '0') ? '不限' : (item.people == '1') ? '2~8人' : '8人以上';
                        var strTime = (item.time == 'none') ? "現在起一小時" : item.time;
                        var strFloor = (item.floorName == 'none') ? '不限' : item.floorName;
                        var replaceItem = ['set-' + item.id, item.id, item.title, item.siteName, strPeople, strTime, strFloor.replaceAll(',', ', '), ''];
                        htmlContent += replaceStr($('#settingList').get(0).outerHTML, originItem, replaceItem);
                    }
                }

                $('#settingList').after(htmlContent);
                $('div[value=0] a').addClass('disable');
            }

            /********************************** page event *************************************/
            $('#viewSettingList').on('pagebeforeshow', function(event, ui) {
                querySettingList();
            });

            /********************************** dom event *************************************/
            $('body').on('click', '#settingDelete', function() {
                $('#viewSettingList').addClass('min-height-100');
                clickDeleteID = $(this).attr('value');
                var strTitle = $(this).attr('title');
                popupMsg('deleteMsg', '', '確定刪除' + strTitle + '?', '取消', true, '確定','');
            });

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

            $('body').on('click', 'div[id^=set-]', function(e) {
                if (e.target.id != "settingDelete") {
                    clickEditSettingID = $(this).attr('value');
                    $.mobile.changePage('#viewNewSetting');
                }
            });
        }
    });

//});
