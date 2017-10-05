
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

        $('#viewParkingDetailAdd').on('pageshow', function(event, ui) {
  			loadingMask("hide");
  			footerFixed();
        });

        /********************************** dom event *************************************/
        $('#newSettingBack').on('click', function() {
            //setDefaultStatus();
            clickEditSettingID = '';
            $.mobile.changePage('#viewMain');
        });
    }
});
