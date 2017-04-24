var bReserveCancelConfirm = false;
var month, date;

$("#viewReserve").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.QueryReserveDetail = function() {
            
            var self = this;

            this.successCallback = function(data) {
                
                QueryReserveDetailCallBackData = data["Content"];
                queryReserveDetailConvertData();


                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, QueryReserveDetailQuerydata, "");
            }();
        };

        // window.ReserveRelieve = function() {
            
        //     var self = this;

        //     this.successCallback = function(data) {
        //         loadingMask("hide");
        //         var resultcode = data['ResultCode'];

        //     };

        //     this.failCallback = function(data) {};

        //     var __construct = function() {
        //         CustomAPI("POST", true, "ReserveRelieve", self.successCallback, self.failCallback, ReserveRelieveQuerydata, "");
        //     }();
        // };

        // time init
        function timeInit() {
            $('.timeRemind').each(function() {
                var oriTime = $(this).parent('div').find('>div:nth-of-type(1)').text();
               $(this).html('~' + addThirtyMins(oriTime)); 
            });
        }

        function queryReserveDetailConvertData() {

        }

        /********************************** page event *************************************/
        $("#viewReserve").on("pagebeforeshow", function(event, ui) {
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            timeInit();
        });

        $("#viewReserve").on("pageshow", function(event, ui) {
            $("#scrollDate #" + currentMonth + currentDate).trigger('click');
        });

        /********************************** dom event *************************************/
        $('#reserveTab').change(function() {
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
            } else if (tabValue == 'tab2'){
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
            }
            else{
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
            }
        });

        // date pick
        $('body').on('click', '#scrollDate .ui-link', function() {
            $('#scrollDate').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            month = cutStringToArray($(this).context.id, ["2", "2"])[1];
            date = cutStringToArray($(this).context.id, ["2", "2"])[2];
            queryDate = currentYear.toString() + month + date;
            QueryReserveDetailQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate></LayoutHeader>";
            QueryReserveDetail();
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
                    headerContent = tempEname + ' 已預約 ' + roomName,
                    msgContent = strDate + '&nbsp;&nbsp;' + timeName;
                popupMsgInit('.hasReservePopup');
                $('.hasReservePopup').find('.header-text').html(headerContent);
                $('.hasReservePopup').find('.main-paragraph').html(msgContent);
            }
            // other reserve
            else{
                var tempEname = $(this).attr('ename'),
                    arrMsgValue = $(this).attr('msg').split(','),
                    arrCutString = cutStringToArray(arrMsgValue[0], ['4', '2', '2']),
                    strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3],
                    tempMailContent = $(this).attr('email') + '?subject=會議室協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2],
                    headerContent = tempEname + ' 已預約 ' + arrMsgValue[1],
                    msgContent = strDate + '&nbsp;&nbsp' + arrMsgValue[2];
                popupMsgInit('.otherReservePopup');
                $('.otherReservePopup').find('.header-text').html(headerContent);
                $('.otherReservePopup').find('.main-paragraph').html(msgContent);
                $('.btn-mail').attr('href', 'mailto:' + tempMailContent);
                $('.btn-tel').attr('href', 'tel:' + $(this).attr('ext'));
            }
        });

        // reserve btn click
        $('body').on('click', '#reserveBtn', function() {
            if ($(this).hasClass('btn-disable')) {
                popupMsg('noSelectTimeMsg', '', '您尚未選擇時間', '', false, '確定', '');
            } else {
                var roomName = 'T01', strDate = '2017/09/08', timeName = '10:00~10:30',
                    headerContent = roomName + ' 會議室預約成功';
                    msgContent = strDate + '&nbsp;&nbsp' + timeName;
                popupMsgInit('.reserveSuccessPopup');
                $('.reserveSuccessPopup').find('.header-text').html(headerContent);
                $('.reserveSuccessPopup').find('.main-paragraph').html(msgContent);
                $('#reserveDateSelect').find('.hover').find('.timeShow').removeClass('timeShow');
                $('#reserveDateSelect').find('.hover').find('.circleIcon').remove();
                $('<div>Ariel.H.Yih</div>').insertAfter($('#reserveDateSelect').find('.hover').find('.ui-bar>div:nth-of-type(1)'));
                $('#reserveDateSelect').find('.hover').removeClass('hover').removeClass('ui-color-noreserve').addClass('ui-color-myreserve');
            }
        });

        // cancel my reserve
        $('body').on('click', 'div[for=myReserveMsg] .btn-confirm', function() {
            // cancel sure
            if (bReserveCancelConfirm == true) {
                if ($('#pageOne').css('display') === 'block'){
                    $('.trace').find('.ui-bar>div:nth-of-type(2)').remove();
                    $('<div class="circleIcon iconSelect"</div>').insertAfter($('.trace').find('.ui-bar>div:nth-of-type(1)'));
                    $('.trace').removeClass('ui-color-myreserve').addClass('ui-color-noreserve').removeClass('trace');
                    $('.hasReservePopup').popup('close');
                }
                else{
                    $('.myReserveCancel').parents('.reserveInfo').remove();
                    $('.myReservePopupMsg').popup('close');
                    popupMsgInit('.myReserveCancelSuccessPopupMsg');
                }
                bReserveCancelConfirm = false;
            } 
            // cancel cancel
            else {
                $('.hasReservePopup').find('.header-icon img').attr('src', 'img/warn_icon.png');
                $('.hasReservePopup').find('.header-text').html('確定取消預約？');
                $('.hasReservePopup').find('.btn-cancel').html('不取消');
                $('.hasReservePopup').find('.btn-confirm').html('取消');
                bReserveCancelConfirm = true;
            }
        });

        // close canel popup
        $('body').on('click', 'div[for=myReserveMsg] .btn-cancel', function() {
            bReserveCancelConfirm = false;
            if ($('#pageTwo').css('display') === 'block'){
                $('.myReserveCancel').removeClass('myReserveCancel');
            }
        });

        // my reserve cancel btn click
        $('body').on('click', '.reserveInfo .btn-area', function() {
            var tmpParent = $(this).parents('.reserveInfo'), 
                tmpCompany = tmpParent.find('.reserveInfo-company').html(), 
                msgContent = tmpParent.find('.reserveInfo-time').html(), 
                headerContent = '確定取消預約 ' + tmpCompany;
            if ($(this).parents('#today-reserve-area').length > 0){
                msgContent = '今日&nbsp;&nbsp' + msgContent;
            }
            popupMsgInit('.myReservePopupMsg');
            $('.myReservePopupMsg').find('.header-text').html(headerContent);
            $('.myReservePopupMsg').find('.main-paragraph').html(msgContent);
            $(this).addClass('myReserveCancel');
            bReserveCancelConfirm = true;
        });

        // close popup msg
        $('body').on('click', 'div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm', function() {
            $('#viewPopupMsg').popup('close');
        });
    }
});
