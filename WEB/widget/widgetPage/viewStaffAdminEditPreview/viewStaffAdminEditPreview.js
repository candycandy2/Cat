$("#viewStaffAdminEditPreview").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminEditPreview/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminEditPreview").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminEditPreview").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminEditPreview .page-main').css('height', mainHeight);
            $('.editNoticeSendBtn').show();
        });

        $("#viewStaffAdminEditPreview").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminEditPreview").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});