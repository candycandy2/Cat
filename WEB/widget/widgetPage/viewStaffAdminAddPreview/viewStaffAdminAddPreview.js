$("#viewStaffAdminAddPreview").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffAdminAddPreview/img/';


        /********************************** page event ***********************************/
        $("#viewStaffAdminAddPreview").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffAdminAddPreview").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffAdminAddPreview .page-main').css('height', mainHeight);
            $('.addNoticeSendBtn').show();
        });

        $("#viewStaffAdminAddPreview").on("pageshow", function(event, ui) {

        });

        $("#viewStaffAdminAddPreview").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/



    }
});