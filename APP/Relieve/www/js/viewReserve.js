var bReserveCancelConfirm = false;

$("#viewReserve").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.APIRequest = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };

        // time init
        function timeInit(){
            $('.timeRemind').each(function() {
                var oriTime = $(this).parent('div').find('>div:nth-of-type(1)').text();
               $(this).html('~' + addThirtyMins(oriTime)); 
            });
        }

        /********************************** page event *************************************/
        $("#viewReserve").on("pagebeforeshow", function(event, ui) {
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            timeInit();
        });

        /********************************** dom event *************************************/
        $('#reserveTab').change(function() {
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab1') {
                console.log('tab1');
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
            } else if (tabValue == 'tab2'){
                console.log('tab2');
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
            }
            else{
                console.log('tab3');
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
            }
        });

        // date pick
        $('body').on('click', '#scrollDate .ui-link', function(){
            $('#scrollDate').find('.hover').removeClass('hover');
            $(this).addClass('hover');
        });

        // time pick
        $('body').on('click', 'div[id^=time]', function() {
            // no reserve
            if ($(this).hasClass('ui-color-noreserve')){
                $(this).toggleClass('hover');
                $(this).find('div:nth-child(2)').toggleClass('iconSelect');
                $(this).find('div:nth-child(2)').toggleClass('iconSelected');
                $(this).find('.timeRemind').toggleClass('timeShow');
                var timeExit = false;
                if ($('#reserveDateSelect').find('.timeShow').length > 0){
                    timeExit = true;
                }
                if (!timeExit) {
                    $('#reserveBtn').removeClass('btn-benq');
                    $('#reserveBtn').addClass('btn-disable');
                } else {
                    $('#reserveBtn').removeClass('btn-disable');
                    $('#reserveBtn').addClass('btn-benq');
                }
            }
            // my reserve
            else if ($(this).hasClass('ui-color-myreserve')){
                $('.trace').removeClass('trace')
                $(this).addClass('trace');
                var tempEname = 'Ariel.H.Yih', roomName = 'T01', strDate = '2017/09/08', timeName = '10:00~10:30',
                    msgContent = '<table><tr><td>會議室</td><td>' + roomName + '</td></tr>' + '<tr><td>日期</td><td>' + strDate + '</td></tr>' + '<tr><td>時間</td><td>' + timeName + '</td></tr></table>'; 
                popupMsg('myReserveMsg', tempEname + '已預約', msgContent, '關閉', true, '取消預約', 'select.png');
            }
            // other reserve
            else{
                var tempEname = $(this).attr('ename');
                var arrMsgValue = $(this).attr('msg').split(',');
                var arrCutString = cutStringToArray(arrMsgValue[0], ['4', '2', '2']);
                var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                var tempMailContent = $(this).attr('email') + '?subject=會議室協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2];
                popupSchemeMsg('reserveMsg', tempEname + '已預約', msgContent, 'mailto:' + tempMailContent, 'tel:' + $(this).attr('ext'), 'select.png');
            }
        });

        // reserve btn click
        $('body').on('click', '#reserveBtn', function(){
            if ($(this).hasClass('btn-disable')) {
                popupMsg('noSelectTimeMsg', '', '您尚未選擇時間', '', false, '確定', '');
            } else {
                var roomName = 'T01', strDate = '2017/09/08', timeName = '10:00~10:30',
                    msgContent = '<table><tr><td>會議室</td><td>' + roomName + '</td></tr>' + '<tr><td>日期</td><td>' + strDate + '</td></tr>' + '<tr><td>時間</td><td>' + timeName + '</td></tr></table>';
                popupMsg('reserveSuccessMsg', '會議室預約成功', msgContent, '', false, '確定', 'select.png');
                $('#reserveDateSelect').find('.hover').find('.timeShow').removeClass('timeShow');
                $('#reserveDateSelect').find('.hover').find('.circleIcon').remove();
                $('<div>Ariel.H.Yih</div>').insertAfter($('#reserveDateSelect').find('.hover').find('.ui-bar>div:nth-of-type(1)'));
                $('#reserveDateSelect').find('.hover').removeClass('hover').removeClass('ui-color-noreserve').addClass('ui-color-myreserve');
            }
        });

        // cancel my reserve
        $('body').on('click', 'div[for=myReserveMsg] #confirm', function() {
            if (bReserveCancelConfirm == true) {
                $('div[for=myReserveMsg]').popup('close');
                $('.trace').find('.ui-bar>div:nth-of-type(2)').remove();
                $('<div class="circleIcon iconSelect"</div>').insertAfter($('.trace').find('.ui-bar>div:nth-of-type(1)'));
                $('.trace').removeClass('ui-color-myreserve').addClass('ui-color-noreserve').removeClass('trace');
            } else {
                $('div[for=myReserveMsg] span[id=titleText]').text('確定取消預約？');
                $('div[for=myReserveMsg] button[id=confirm]').html('取消');
                $('div[for=myReserveMsg] button[id=cancel]').html('不取消');
                bReserveCancelConfirm = true;
            }
        });

        $('body').on('click', 'div[for=myReserveMsg] #cancel', function() {
            bReserveCancelConfirm = false;
        });

        $('body').on('click', 'div[for=myReserveMsg] #cancel', function() {
            bReserveCancelConfirm = false;
        });

        $('body').on('click', 'div[for=cancelSuccessMsg] #confirm', function() {
            $('.trace span').text('');
            $('div[for=cancelSuccessMsg]').popup('close');
            $('.trace').removeClass('ui-color-myreserve').removeClass('trace');
        });

        // close popup msg
        $('body').on('click', 'div[for=reserveSuccessMsg] #confirm, div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm', function() {
            $('#viewPopupMsg').popup('close');
        });

       function test(){
            if (meetingRoomLocalData === null || checkDataExpired(meetingRoomLocalData['lastUpdateTime'], 7, 'dd')) {
                var doAPIListAllTime = new getAPIListAllTime();
            } else {
                arrTimeBlockBySite = JSON.parse(localStorage.getItem('allTimeLocalData'))['content'];
            }
        }
    }
});
