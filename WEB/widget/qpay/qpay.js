//widget naming rule widget.js/list()[].name + "Widget"
var qpayWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/qpay/qpay.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var ideaImg = $('<img>').attr('src', serverURL + '/widget/qpay/img/widget_pay.png');
                $('.qpay-icon').html('').append(ideaImg);

            }, "html");
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