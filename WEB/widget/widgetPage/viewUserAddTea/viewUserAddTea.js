$("#viewUserAddTea").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewUserAddTea/img/';

        /********************************** page event ***********************************/
        $("#viewUserAddTea").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewUserAddTea").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewUserAddTea');
            $('#viewUserAddTea .ui-content').css('height', mainHeight + 'px');

            $('.tea-user-photo').attr('src', serverURL + imgURL + 'default_photo.png');
            $('.tea-user-name').text(loginData['loginid']);
            $('.tea-user-today').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));

            $('.need-cup').attr('src', serverURL + imgURL + 'radio_true.png');
            $('.need-water').attr('src', serverURL + imgURL + 'radio_false.png');

            $('.subtract').attr('src', serverURL + imgURL + 'subtraction_gray.png');
            $('.add').attr('src', serverURL + imgURL + 'addition_blue.png');
            $('.room-refresh').attr('src', serverURL + imgURL + 'loading.png');
        });

        $("#viewUserAddTea").on("pageshow", function(event, ui) {

        });

        $("#viewUserAddTea").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/


    }
});