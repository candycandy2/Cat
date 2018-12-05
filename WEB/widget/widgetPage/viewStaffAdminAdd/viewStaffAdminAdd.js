$("#viewStaffAdminAdd").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffAdminAdd/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminAdd").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminAdd").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffAdminAdd');
            $('#viewStaffAdminAdd .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffAdminAdd").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminAdd").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});