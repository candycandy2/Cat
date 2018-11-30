$("#viewStaffUserTop").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserTop/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserTop").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserTop").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserTop');
            $('#viewStaffUserTop .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffUserTop").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserTop").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});