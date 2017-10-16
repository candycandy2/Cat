
$("#viewParkingDetailAdd").pagecontainer({
    create: function(event, ui) {

    	/********************************** function *************************************/
        function changeEditStatus() {
            var parkingSettingEditdata = JSON.parse(localStorage.getItem('parkingSettingData'));
            parkingSettingEditdata = parkingSettingEditdata.content.filter(function(item) {
                return item.id == clickEditSettingID;
            });
        }

        function setDefaultStatus() {
            $('#newSettingTitle').val('');
            $('#newSettingType input[value=setGuest]').prop("checked", "checked");
            $('#newSettingCar').val('');
            $('#newSettingNotice').val('');
        }

        function saveBtnDefaultStatus() {
            if ( !($('#newSettingTitle').val().length == 0) && !($('#newSettingCar').val().length == 0) &&  !($('#newSettingNotice').val().length == 0))
            {
                $('#newSettingSave').removeClass('save-disable');
            }else {
                if (!$(this).hasClass('save-disable')){
                    $('#newSettingSave').addClass('save-disable');
                }
            }
        }


        /********************************** page event *************************************/
        $('#viewParkingDetailAdd').one('pagebeforeshow', function(event, ui) {

        });

        $('#viewParkingDetailAdd').on('pagebeforeshow', function(event, ui) {
            
            if (clickEditSettingID != '') {
                //changeEditStatus();
            }else{
                setDefaultStatus();
                saveBtnDefaultStatus();
            }
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


        $(document).keyup(function(e) {
            saveBtnDefaultStatus();
        });

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
