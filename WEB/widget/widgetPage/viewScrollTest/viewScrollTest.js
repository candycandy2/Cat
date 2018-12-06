$("#viewScrollTest").pagecontainer({
    create: function(event, ui) {

        /********************************** page event ***********************************/
        $("#viewScrollTest").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewScrollTest").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewScrollTest');
            $('#viewScrollTest .page-main').css('height', mainHeight + 'px');
        });

        $("#viewScrollTest").on("pageshow", function(event, ui) {

        });

        $("#viewScrollTest").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});