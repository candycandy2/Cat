
$("#viewQTYParkingDetail").pagecontainer({
    create: function(event, ui) {

    	/********************************** function *************************************/
        function setDefaultStatus() {
            $('#newSettingTitle').val('');
            $('#newSettingType input[value=setGuest]').prop("checked", "checked");
            $('#newSettingCar').val('');
            $('#newSettingNotice').val('');
        }

        function queryQTYReserveDetail() {
            parkingQTYData = JSON.parse(localStorage.getItem('parkingQTYData'));
            var originItem = ['[space]', '[date]', '[time]'];
            htmlContent = '';
            if (parkingQTYData != null) {
                var item = parkingQTYData['content'][0];
                var replaceItem = [item.spaceName, item.reserveDate, item.timeName];
                htmlContent += replaceStr($('#QTYReserveDetail').get(0).outerHTML, originItem, replaceItem);               
            }
            $('#QTYReserveDetail').after(htmlContent);
        }

        /********************************** page event *************************************/
        $('#viewQTYParkingDetail').one('pagebeforeshow', function(event, ui) {
            queryQTYReserveDetail();
        });

        $('#viewQTYParkingDetail').on('pagebeforeshow', function(event, ui) {          
            queryQTYReserveDetail();
        });

        $('#viewQTYParkingDetail').on('pageshow', function(event, ui) {

        });

        /********************************** dom event *************************************/
        $('#QTYSettingBack').on('click', function() {
            setDefaultStatus();
            $.mobile.changePage('#viewMain');
        });

        // click save button
        $('#newSettingSave').on('click', function() {


        });

    }
});
