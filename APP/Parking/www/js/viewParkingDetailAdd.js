
$("#viewParkingDetailAdd").pagecontainer({
    create: function(event, ui) {

    	/********************************** function *************************************/
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

        /********************************** page event *************************************/
        $('#viewParkingDetailAdd').one('pagebeforeshow', function(event, ui) {

        });

        $('#viewParkingDetailAdd').on('pagebeforeshow', function(event, ui) {
            saveBtnDefaultStatus();
        });

        $('#viewParkingDetailAdd').on('pageshow', function(event, ui) {
  			loadingMask("hide");
  			footerFixed();
        });

        /********************************** dom event *************************************/
        $('#newSettingBack').on('click', function() {
            setDefaultStatus();
            clickEditSettingID = '';
            $.mobile.changePage('#viewMain');
        });

        function saveBtnDefaultStatus() {
            //en or tw both one length
            if ( !($('#newSettingTitle').val().length == 0) && !($('#newSettingCar').val().length == 0) &&  !($('#newSettingNotice').val().length == 0))
            {
                $('#newSettingSave').removeClass('save-disable');
            }else {
                if (!$(this).hasClass('save-disable')){
                    $('#newSettingSave').addClass('save-disable');
                }
            }
        }

        $(document).keyup(function(e) {
            saveBtnDefaultStatus();
        });

        function setDefaultStatus() {
            $('#newSettingTitle').val('');
            $('#newSettingType input[value=setGuest]').prop("checked", "checked");
            $('#newSettingCar').val('');
            $('#newSettingNotice').val('');
        }

        // click save button
        $('#newSettingSave').on('click', function() {

            if ($(this).hasClass('save-disable')) {
                popupMsg('noSelectTimeMsg', '', '您尚未輸入文字', '', false, '確定', '');
            } else {
                var parkingSettingdata = JSON.parse(localStorage.getItem('parkingSettingData'));

                if (clickEditSettingID != '') {
                    //Edit Status, Update Local Data
                    parkingSettingdata.content = parkingSettingdata.content.filter(function(item) {
                        return item.id != clickEditSettingID;
                    });
                }

                var obj = new Object();
                if (parkingSettingdata == null) {
                    obj.id = '1';
                } else if (clickEditSettingID != '') {
                    obj.id = clickEditSettingID;

                } else {
                    obj.id = parkingSettingdata['content'].length + 1;
                }
                obj.title = $('#newSettingTitle').val();
                obj.type = $("#newSettingType :radio:checked").val();
                obj.car = $('#newSettingCar').val();
                obj.notice = $('#newSettingNotice').val();

                var jsonData = {};
                if (parkingSettingdata == null) {
                    jsonData = {
                        content: [obj]
                    };
                } else {
                    parkingSettingdata.content.push(obj);
                    jsonData = parkingSettingdata;
                }

                localStorage.setItem('parkingSettingData', JSON.stringify(jsonData));

                setDefaultStatus();
                saveBtnDefaultStatus();
                clickEditSettingID = '';
                $.mobile.changePage('#viewMain');
            }

        });

    }
});
