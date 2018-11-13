//widget naming rule widget.js/list()[].name + "Widget"
var qstoreWidget = {

    init: function(contentItem) {
        var _key = this.qstorePageKey;

        function createContent(key) {
            $.get(serverURL + "/widget/qstore/qstore.html", function(data) {
                //1.html
                /*contentItem.html('').append(data);*/
                //2.img
                /*var rateImg = $('<img>').attr('src', serverURL + '/widget/yellowpage/img/widget_yellowpage.png');
                $('.yellowpage-widget-icon').html('').append(rateImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/yellowpage/img/more_green.png');
                $('.phone-book-more').html('').append(moreImg);*/

            }, "html");

        }

        $.fn.qstore = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'qstore');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'qstore', {
                        options: $.extend({}, $.fn.qstore.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.qstore.methods = {
            options: function(jq) {
                return $.data(jq[0], 'qstore').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.qstore.defaults = {};

        $('.qstoreWidget').qstore();
    }
}