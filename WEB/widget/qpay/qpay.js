//widget naming rule widget.js/list()[].name + "Widget"
var qpayWidget = {

    init: function(contentItem) {

        function createContent() {
            var content = '<div class="qpay-link"><div><img src="img/icon_qpay.png" class="icon-img"></div><div>QPay测试</div></div>';

            contentItem.html('').append(content);

            contentItem.on('click', function() {

                checkWidgetPage('viewUserPayMain');
            });
        }

        $.fn.qpay = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.qpay.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'qpay');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'qpay', {
                        options: $.extend({}, $.fn.qpay.defaults, options)
                    });
                }

                createContent();

            });
        }

        $.fn.qpay.methods = {
            options: function(jq) {
                return $.data(jq[0], 'qpay').options;
            }
        }

        $.fn.qpay.defaults = {}

        $('.qpayWidget').qpay();
    }
}