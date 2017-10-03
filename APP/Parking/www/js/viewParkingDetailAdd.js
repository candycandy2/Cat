
$("#viewParkingDetailAdd").pagecontainer({
    create: function(event, ui) {
        /********************************** page event *************************************/
        $('#viewParkingDetailAdd').one('pagebeforeshow', function(event, ui) {

        });

        $('#viewParkingDetailAdd').on('pageshow', function(event, ui) {
  			loadingMask("hide");
  			footerFixed();
        });
    }
});
