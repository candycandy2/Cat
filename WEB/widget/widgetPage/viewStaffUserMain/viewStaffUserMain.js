$("#viewStaffUserMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserMain/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserMain").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserMain');
            $('#viewStaffUserMain .ui-content').css('height', mainHeight + 'px');

            $('.tea-user-photo').attr('src', serverURL + imgURL + 'default_photo.png');
            $('.tea-user-name').text(loginData['loginid']);
            $('.tea-user-today').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));

            $('.need-cup').attr('src', serverURL + imgURL + 'radio_true.png');
            $('.need-water').attr('src', serverURL + imgURL + 'radio_false.png');

            $('.subtract').attr('src', serverURL + imgURL + 'subtraction_gray.png');
            $('.add').attr('src', serverURL + imgURL + 'addition_blue.png');
            $('.room-refresh').attr('src', serverURL + imgURL + 'loading.png');
        });

        $("#viewStaffUserMain").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});