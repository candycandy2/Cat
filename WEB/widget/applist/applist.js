(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');
    console.log(widgetItem);
    var favoriteApp = null;

    loadWidgetCSS();

    function loadWidgetCSS() {
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: "http://qplaydev.benq.com/widgetDemo/applist/applist.css"
            })
            .appendTo("head");
    }

    function appendWidgetHTML() {
        $.ajaxSettings.async = false;
        $.get('http://qplaydev.benq.com/widgetDemo/applist/applist.html', function (data) {
            $('.' + widgetItem).append(data);

        }, 'html');
        $.ajaxSettings.async = true;

        getFavoriteApp();
    }

    function getFavoriteApp() {
        favoriteApp = JSON.parse(window.localStorage.getItem('favoriteList'));
        var content = '';
        if (favoriteApp != null && favoriteApp.length > 0) {
            for (var i in favoriteApp) {
                content += '<div class="applist-item"><a value="" id="" href="#"><img src="' +
                    favoriteApp[i].icon_url +
                    '" style="width:15vw;"></a><p class="app-list-name">' +
                    favoriteApp[i].app_name +
                    '</p></div>';
            }

            $('.applist-main-icon').html('').append(content);
        }
    }

    function destroyApplist(target) {
        $(target).children('div.applist-widget').remove();
    }

    $.fn.applist = function (options) {
        if (typeof options == 'string') {
            return $.fn.applist.methods[options](this);
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'applist');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'applist', {
                    options: $.extend({}, $.fn.applist.defaults, options)
                });
            }

            appendWidgetHTML();

        });
    }

    $.fn.applist.methods = {
        destroy: function (jq) {
            return jq.each(function () {
                destroyApplist(this);
            });
        },
    }

    $.fn.applist.defaults = {}

    $('.' + widgetItem).applist();

})(jQuery);