//widget naming rule widget.js/list()[].name + "Widget"
var carouselWidget = {

    init: function (contentItem) {

        var carouselLength = 4;

        function createContent(contentItem) {

            $.get(serverURL + "/widget/carousel/carousel.html", function (data) {
                contentItem.html('').append(data);

                $('.cancel-bulletin').attr('src', serverURL + '/widget/carousel/img/cancel.png');

                var content = '';
                for (var i = 0; i < carouselLength; i++) {
                    content += '<li class="sw-slide"><img src="' + serverURL + '/widget/carousel/img/portal_' + (i + 1) + '.jpg"></li>';
                }
                $('.swipslider ul').append(content);

                setTimeout(function () {
                    $('.swipslider').swipeslider({
                        prevNextButtons: false,
                        autoPlayTimeout: 3000
                    });
                }, 1500);

            }, "html");

            //关闭顶部公告
            contentItem.on('click', '.cancel-bulletin', function () {
                $('.top-bulletin').hide();
            });
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

                createContent(contentItem);

            })
        };

        $.fn.carousel.defaults = {}

        $('.carouselWidget').carousel();
    }

};