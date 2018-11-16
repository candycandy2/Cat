//widget naming rule widget.js/list()[].name + "Widget"
var qstoreWidget = {

    init: function(contentItem) {
        var _key = this.qstorePageKey;

        function createContent(key) {
            $.get(serverURL + "/widget/qstore/qstore.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var qstoreImg = $('<img>').attr('src', serverURL + '/widget/qstore/img/widget_store.png');
                $('.qstore-icon').html('').append(qstoreImg);

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