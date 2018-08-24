//widget naming rule widget.js/list()[].name + "Widget"
var messageWidget = {

    init: function(contentItem) {

        function createMessage() {
            var msgArr = JSON.parse(window.localStorage.getItem('messagecontent')).message_list;
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
                content = '<div class="widget-none-msg">' + langStr['wgt_008'] + '<div>';
            }

            var $container = $('<div></div>').addClass('message-widget').append(content);

            contentItem.html('').append($container);

            //点击widget内message，跳转到message详情页
            contentItem.on('click', '.widget-msg-list', function() {
                messageFrom = 'messageWidget';
                messageRowId = $(this).attr('data-rowid');
                checkAppPage('viewWebNews2-3-1');
            });
        }

        $.fn.message = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.message.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'message');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'message', {
                        options: $.extend({}, $.fn.message.defaults, options)
                    });
                }

                createMessage();

            });
        }

        $.fn.message.methods = {
            options: function(jq) {
                return $.data(jq[0], 'message').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createMessage();
                });
            }
        }

        $.fn.message.defaults = {}

        $('.messageWidget').message();
    }

};