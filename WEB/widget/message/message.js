(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');

    loadWidgetCSS();

    function loadWidgetCSS() {
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: serverURL + "/widget/message/message.css"
            })
            .appendTo("head");
    }

    function createMessage() {
        var msgArr = loginData['messagecontent']['message_list'];
        var content = '';
        var count = 0;

        for (var i in msgArr) {
            if (msgArr[i].read != 'D' && count < 3) {
                content += '<div class="widget-msg-list" data-rowid="' +
                    msgArr[i].message_send_row_id +
                    '"><div class="widget-msg-time">' +
                    msgArr[i].create_time.split(' ')[0] +
                    '</div><div class="widget-msg-title">' +
                    msgArr[i].message_title +
                    '</div></div>';
                count++;
            }
        }

        if (content == '') {
            content = '<div class="widget-none-msg">暂无消息<div>';
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