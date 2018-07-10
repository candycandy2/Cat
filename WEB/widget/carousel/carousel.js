(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');

    loadWidgetCSS();

    function appendWidgetHTML(target) {
        $.get("http://qplaydev.benq.com/widgetDemo/carousel/carousel.html", function (data) {
            $('.' + widgetItem).append(data);

        }, "html");
    }

    function loadWidgetCSS() {
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: "http://qplaydev.benq.com/widgetDemo/carousel/carousel.css"
            })
            .appendTo("head");
    }

    $.fn.carousel = function (options) {
        options = options || {};

        return this.each(function () {
            var state = $.data(this, 'carousel');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'carousel', {
                    options: $.extend({}, $.fn.carousel.defaults, options)
                });
            }

            appendWidgetHTML(this);

            // $("#carouselWidget").FtCarousel({
            //     time: 3000
            // });
        })
    };


    $.fn.carousel.defaults = {}


    $('.' + widgetItem).carousel();


})(jQuery);

