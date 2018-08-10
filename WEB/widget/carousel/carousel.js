(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');

    function createContent() {
        var $container = $('<div></div>').attr('class', 'carousel-widget');
        var $img = $('<img>').attr('src', serverURL + '/widget/carousel/carousel.jpg');
        $container.append($img);

        $('.' + widgetItem).append($container);
        carouselFinish = true;
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

            createContent();

        })
    };

    $.fn.carousel.defaults = {}

    $('.' + widgetItem).carousel();

})(jQuery);

