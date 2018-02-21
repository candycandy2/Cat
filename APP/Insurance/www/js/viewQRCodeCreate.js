$("#viewQRCodeCreate").pagecontainer({
    create: function(event, ui) {
        /********************************** function *************************************/
        var qrcode = new QRCode("qrcode");

        function makeCode () {      
            var elText = document.getElementById("text");
            
            if (!elText.value) {
                alert("Input a text");
                elText.focus();
                return;
            }           
            qrcode.makeCode(elText.value);
        }

        /********************************** page event *************************************/
        $("#viewQRCodeCreate").on("pagebeforeshow", function(event, ui) {
            makeCode();
        });

        /********************************** dom event *************************************/
        $("#text").on("blur", function () {
            makeCode();
        }).on("keydown", function (e) {
            if (e.keyCode == 13) {
                makeCode();
            }
        });

        $('#backMain').on('click', function() {
            $.mobile.changePage('#viewMain');
        });
    }
});
