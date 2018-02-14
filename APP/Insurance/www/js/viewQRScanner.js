$("#viewQRScanner").pagecontainer({
    create: function(event, ui) {
        /********************************** function *************************************/
        function displayContents(err, text){
            if(err){
                // an error occurred, or the scan was canceled (error code `6`) 
                //window.console.log(error);
            } else {
                // The scan completed, display the contents of the QR code: 
                alert(text);
            }
        }

        /********************************** page event *************************************/
        $("#viewQRScanner").on("pagebeforeshow", function(event, ui) {
            QRScanner.scan(displayContents);
            QRScanner.show(function(status){
              console.log(status);
              alert(status);
            });
        });

        /********************************** dom event *************************************/
        $('#viewQRScanner').keypress(function(event) {

        });
    }
});
