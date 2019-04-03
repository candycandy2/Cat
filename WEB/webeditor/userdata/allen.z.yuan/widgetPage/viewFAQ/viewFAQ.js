$("#viewFAQ").pagecontainer({
    create: function(event, ui) {

        /********************************** page event ***********************************/
        $("#viewFAQ").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewFAQ").scroll(function() {

        });

        $("#viewFAQ").on("pageshow", function(event, ui) {

        });

        $("#viewFAQ").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //展开/关闭
        $(".question-content").on("click", function() {
            var self = this;
            var src = $(self).children('.answer-btn').children('img').attr("data-src");
   
            if (src == "list_down") {
                $(self).children('.answer-btn').children("img").attr("src", "img/list_up.png");
                $(self).children('.answer-btn').children("img").attr("data-src", "list_up");
                $(self).next().slideDown(500);

            } else {
                $(self).children('.answer-btn').children("img").attr("src", "img/list_down.png");
                $(self).children('.answer-btn').children("img").attr("data-src", "list_down");
                $(self).next().slideUp(500);

            }

        });

    }
});