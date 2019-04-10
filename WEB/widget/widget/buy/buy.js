//widget naming rule widget.js/list()[].name + "Widget"
var buyWidget = {

    init: function (contentItem) {

        function createContent(contentItem) {

            $.get(serverURL + "/widget/widget/buy/buy.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var buyImg = $('<img>').attr('src', serverURL + '/widget/widget/buy/img/widget_buy_icon.png');
                $('.buy-icon').html('').append(buyImg);
                // var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/buy/img/widget_buy_img.png');
                // $('.buy-widget-img').html('').append(moreImg);

            }, "html");

            //跳转到buy页面
            contentItem.on('click', '.buy-btn', function() {
                window.open('https://store.benq.com/tw_staff/?utm_source=qplay.com&utm_medium=banner&utm_term=store-tw-staff&utm_content=qplay-banner&utm_campaign=from-qplay-banner', '_system');
            });

        }

        $.fn.buy = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'buy');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'buy', {
                        options: $.extend({}, $.fn.buy.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.buy.methods = {
            options: function(jq) {
                return $.data(jq[0], 'buy').options;
            }
        };

        $.fn.buy.defaults = {};

        $('.buyWidget').buy();
    }

};