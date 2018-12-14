$("#viewScrollTest").pagecontainer({
    create: function(event, ui) {

        /********************************** page event ***********************************/
        $("#viewScrollTest").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewScrollTest").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewScrollTest .page-main').css('height', mainHeight);
        });

        $("#viewScrollTest").on("pageshow", function(event, ui) {

        });

        $("#viewScrollTest").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});