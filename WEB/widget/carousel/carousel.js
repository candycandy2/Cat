var carouselWidget = {

    init: function(contentItem) {
        //var widgetItem = sessionStorage.getItem('widgetItem');

        function createContent() {
            var $container = $('<div></div>').addClass('carousel-widget');
            var $img = $('<img>').attr('src', serverURL + '/widget/carousel/carousel.jpg');
            $container.append($img);

            contentItem.html('').append($container);
        }

        $.fn.carousel = function(options) {
            options = options || {};

            return this.each(function() {
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

        $('.carouselWidget').carousel();
        //$('.carouselWidget' + widgetItem).carousel();
    }

};