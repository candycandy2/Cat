$("#viewStaffAdminDetail").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminDetail/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminDetail").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffAdminDetail');
            $('#viewStaffAdminDetail .page-main').css('height', mainHeight + 'px');
        });

        $("#viewStaffAdminDetail").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminDetail").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});