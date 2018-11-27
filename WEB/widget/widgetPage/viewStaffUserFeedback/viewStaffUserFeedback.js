$("#viewStaffUserFeedback").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserFeedback/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserFeedback").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserFeedback").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserFeedback');
            $('#viewStaffUserFeedback .ui-content').css('height', mainHeight + 'px');
        });

        $("#viewStaffUserFeedback").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserFeedback").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});