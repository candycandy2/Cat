$("#viewStaffUserDetail").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserDetail/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserDetail").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserDetail');
            $('#viewStaffUserDetail .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffUserDetail").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserDetail").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});