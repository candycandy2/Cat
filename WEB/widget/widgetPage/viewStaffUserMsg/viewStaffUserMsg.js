$("#viewStaffUserMsg").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserMsg/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserMsg").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserMsg").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserMsg');
            $('#viewStaffUserMsg .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffUserMsg").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserMsg").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});