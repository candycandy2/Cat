(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');

    function createContent() {
        var $container = $('<div>QPay</div>').addClass('qpay-widget').css('color', 'red');
        $('.' + widgetItem).html('').append($container);

    }

    createContent();

})(jQuery);