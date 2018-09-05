//widget naming rule widget.js/list()[].name + "Widget"
var messageWidget = {

    contentItem: null,
    createMessage: function () {
        var messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontent'));

        if (messagecontent_ !== null && messagecontent_.lastUpdateTime === undefined) {
            //it's old data from QPlay2.0
            //convert to new format
            var jsonData = {};
            var date = new Date();
            jsonData = {
                lastUpdateTime: date.setDate(date.getDate() - 1),
                content: messagecontent_
            };
            window.localStorage.setItem('messagecontent', JSON.stringify(jsonData));

            messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontent'));
        }

        //alert(messagecontent);
        if (messagecontent_ === null) {
            content = '<div class="widget-none-msg">' + langStr['wgt_008'] + '<div>';
            var $container = $('<div></div>').addClass('message-widget').append(content);
            this.contentItem.html('').append($container);
        } else {
            var messagecontent = messagecontent_.content;
            var msgArr = messagecontent.message_list;
            var content = '';
            var count = 0;

            for (var i in msgArr) {
                if (msgArr[i].read != 'D' && count < 3) {
                    content += '<div class="widget-msg-list' +
                        (msgArr[i].read == 'Y' ? ' normal-font-weight' : '') +
                        '" data-rowid="' +
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
            this.contentItem.html('').append($container);
        }

        //点击widget内message，跳转到message详情页
        this.contentItem.on('click', '.widget-msg-list', function () {

            messageFrom = 'messageWidget';
            messageRowId = $(this).attr('data-rowid');
            if (window.avoidDoubleProcess != null) {
                clearTimeout(window.avoidDoubleProcess);
            }
            window.avoidDoubleProcess = setTimeout(function () {

                clearTimeout(window.avoidDoubleProcess);
                window.avoidDoubleProcess = null;

                checkAppPage('viewWebNews2-3-1');
            }, 500);
        });
    },
    init: function (contentItem) {

        messageWidgetTHIS = this;
        this.contentItem = contentItem;
        this.createMessage();

        $.fn.message = function (options, param) {
            if (typeof options == 'string') {
                return $.fn.message.methods[options](this, param);
            }

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
                messageWidgetTHIS.createMessage();
            });
        }

        $.fn.message.methods = {
            options: function (jq) {
                return $.data(jq[0], 'message').options;
            },
            refresh: function (jq) {
                return jq.each(function () {
                    messageWidgetTHIS.createMessage();
                });
            }
        }
        $.fn.message.defaults = {}
        $('.messageWidget').message();
    },
    refresh: function () {

        messageWidgetTHIS = this;
        //3.check data
        var checkmessagecontentData = setInterval(function () {
            var messagecontent = JSON.parse(window.localStorage.getItem('messagecontent'));
            var changeMessageContentDirty = sessionStorage.getItem('changeMessageContentDirty');

            if (messagecontent !== null && changeMessageContentDirty == 'Y') {
                clearInterval(checkmessagecontentData);
                messageWidgetTHIS.createMessage(messagecontent);
                sessionStorage.setItem('changeMessageContentDirty', 'N');
            }
        }, 1000);
    },
    show: function () {
        QueryMessageListEx();
        this.refresh();
    },
    clear: function () {

        var messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontent'));
        var jsonData = {};
        var date = new Date();
        jsonData = {
            lastUpdateTime: date.setDate(date.getDate() - 1),
            content: messagecontent_.content
        };
        window.localStorage.setItem('messagecontent', JSON.stringify(jsonData));
    }

};