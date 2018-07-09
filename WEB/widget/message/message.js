(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');
    console.log(widgetItem);

    loadWidgetCSS();

    function loadWidgetCSS() {
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: "http://qplaydev.benq.com/widgetDemo/message/message.css"
            })
            .appendTo("head");
    }

    function createMessage() {
        var msgArr = loginData['messagecontent']['message_list'];
        var content = '';
        for (var i in msgArr) {
            if (i < 3) {
                content += '<div class="widget-msg-list"><div class="widget-msg-time">' +
                    msgArr[i].create_time.split(' ')[0] +
                    '</div><div class="widget-msg-title">' +
                    msgArr[i].message_title +
                    '</div></div>';
            }
        }

        $('.' + widgetItem).append(content);
    }

    $.fn.message = function (options) {
        options = options || {};

        return this.each(function () {
            var state = $.data(this, 'message');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'message', {
                    options: $.extend({}, $.fn.message.defaults, options)
                });
            }

            createMessage(this);

        });
    }

    $.fn.message.defaults = {}

    $('.' + widgetItem).message();

})(jQuery);