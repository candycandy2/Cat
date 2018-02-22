$("#viewQRScanner").pagecontainer({
    create: function(event, ui) {
        /********************************** function *************************************/
        function onDone(err, status){
          if (err) {
            if (err.code == 1) {
                $.mobile.changePage('#viewMain');
                if(confirm("Would you like to enable QR code scanning? You can allow camera access in your settings.")){
                  QRScanner.openSettings();
                }
            }
          } else if (status.authorized) {
            QRScanner.scan(displayContents);
            QRScanner.show(function(status){
                alert(status);
            });
          }
        }

        function displayContents(err, text){
            if(err){
                // an error occurred, or the scan was canceled (error code `6`) 
            } else {
                // The scan completed, display the contents of the QR code: 
                alert(text);
            }
        }

        /********************************** page event *************************************/
        $("#viewQRScanner").on("pagebeforeshow", function(event, ui) {
            QRScanner.prepare(onDone);
        });

        /********************************** dom event *************************************/
         $('#viewMainBack').on('click', function() {
            $.mobile.changePage('#viewMain');
        });
    }
});
