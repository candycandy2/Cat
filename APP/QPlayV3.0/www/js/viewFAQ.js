$("#viewFAQ").pagecontainer({
    create: function (event, ui) {

        


        /********************************** page event ***********************************/
        $("#viewFAQ").on("pagebeforeshow", function (event, ui) {
            
        });

        $("#viewFAQ").scroll(function () {

        });

        $("#viewFAQ").on("pageshow", function (event, ui) {

        });

        $("#viewFAQ").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $(".answer-btn").on("click", function () {
            var self = this;

            var src = $(self).children("img").attr("data-src");
            if(src == "list_down") {
                $(self).children("img").attr("src", "img/list_up.png");
                $(self).children("img").attr("data-src", "list_up");
                $(self).parent().next().slideDown(500);

            } else {
                $(self).children("img").attr("src", "img/list_down.png");
                $(self).children("img").attr("data-src", "list_down");
                $(self).parent().next().slideUp(500);

            }

        });

    }
});