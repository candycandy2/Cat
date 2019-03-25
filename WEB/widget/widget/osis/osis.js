//widget naming rule widget.js/list()[].name + "Widget"
var osisWidget = {

    init: function (contentItem) {

        function createContent(contentItem) {

            $.get(serverURL + "/widget/widget/osis/osis.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var osisImg = $('<img>').attr('src', serverURL + '/widget/widget/osis/img/widget_osis_icon.png');
                $('.osis-icon').html('').append(osisImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/osis/img/widget_osis_img.png');
                $('.osis-widget-img').html('').append(moreImg);

                osisWidget.show();

            }, "html");

        }

        $.fn.osis = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'osis');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'osis', {
                        options: $.extend({}, $.fn.osis.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.osis.methods = {
            options: function(jq) {
                return $.data(jq[0], 'osis').options;
            }
        };

        $.fn.osis.defaults = {};

        $('.osisWidget').osis();
    },

    show: function() {
        
    }

};