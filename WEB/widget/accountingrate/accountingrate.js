//widget naming rule widget.js/list()[].name + "Widget"
var accountingrateWidget = {

    init: function(contentItem) {

        function createContent() {
            var content = '<div class="qpay-link"><div><img src="img/icon_qpay.png" class="icon-img"></div><div>Corp Rate</div></div>';

            contentItem.html('').append(content);

            contentItem.on('click', function() {
                checkWidgetPage('viewAccountingRate', pageVisitedList);
            });
        }

        $.fn.accountingrate = function(options, param) {
            createContent();
        }

        $('.accountingrateWidget').accountingrate();
    }
}