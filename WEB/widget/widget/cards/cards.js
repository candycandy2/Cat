var cardsWidget = {
    init: function(contentItem) {
        var self = this;

        function createContent(key) {
            $.get(serverURL + "/widget/widget/cards/cards.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var cardsImg = $('<img>').attr('src', serverURL + '/widget/widget/cards/img/icon_widget_crads.png');
                $('.cards-icon').html('').append(cardsImg);
                var qstoreImg = $('<img>').attr('src', serverURL + '/widget/widget/cards/img/qstore_widget.png');
                $('.qstore-widget-img').html('').append(qstoreImg);
                var medicalImg = $('<img>').attr('src', serverURL + '/widget/widget/cards/img/medical_equip_widget.png');
                $('.medical-widget-img').html('').append(medicalImg);
                var qualityImg = $('<img>').attr('src', serverURL + '/widget/widget/cards/img/qisda_quality_widget.png');
                $('.quality-widget-img').html('').append(qualityImg);
                var safetyImg = $('<img>').attr('src', serverURL + '/widget/widget/cards/img/enviro_safety_widget.png');
                $('.safety-widget-img').html('').append(safetyImg);

                //計算有幾個小卡
                var cardsQuantity = $('.cards-main-img').children().length;
                //小卡寬*小卡數量+邊界
                var contentWidth = (31.2+4) * cardsQuantity + 5.92;
                $('.cards-main-img').css('width', contentWidth + 'vw');

            }, "html");

            //點擊小卡，跳轉viewCardsMain
            /*contentItem.on('click', '.qstore-widget-img', function() {
                checkWidgetPage('viewCardsMain', pageVisitedList);
            });*/
        }

        $.fn.cards = function(options) {
            options = options || {};

            return this.each(function() {
                var state = $.data(this, 'cards');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'cards', {
                        options: $.extend({}, $.fn.cards.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.cards.methods = {
            options: function(jq) {
                return $.data(jq[0], 'cards').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.cards.defaults = {};

        $('.cardsWidget').cards();
    }
}