$("#viewStaffUserAppointment").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserAppointment/img/';

        /********************************** page event ***********************************/
        $("#viewStaffUserAppointment").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserAppointment").one("pageshow", function(event, ui) {
            $('.checkbox-hour').attr('src', serverURL + imgURL + 'checkbox_false.png');
            $('.subtract').attr('src', serverURL + imgURL + 'subtraction_gray.png');
            $('.add').attr('src', serverURL + imgURL + 'addition_blue.png');
        });

        $("#viewStaffUserAppointment").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserAppointment").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        $('.hour-list').on('click', function() {
            var rest = $(this).hasClass('rest-staff');
            var checked = $(this).hasClass('checked-staff');
            var hasSrc = $(this).find('.checkbox-hour').data('src');

            if(!rest && !checked) {
                if(hasSrc == 'checkbox_false') {
                    //1.
                    $(this).addClass('active-staff');
    
                    $(this).find('.checkbox-hour').data('src', 'checkbox_true');
                    $(this).find('.checkbox-hour').attr('src', serverURL + imgURL + 'checkbox_true.png');
                } else {
                    //1.
                    $(this).removeClass('active-staff');
    
                    $(this).find('.checkbox-hour').data('src', 'checkbox_false');
                    $(this).find('.checkbox-hour').attr('src', serverURL + imgURL + 'checkbox_false.png');
                }
            }
            
        })


    }
});