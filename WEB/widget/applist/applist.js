(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');
    var favoriteApp = null;

    function createContent() {
        $.get(serverURL + '/widget/applist/applist.html', function (data) {
            $('.' + widgetItem).html('').append(data);
            applistFinish = true;
            getFavoriteApp();

        }, 'html');
    }

    function getFavoriteApp() {
        $('.applist-title').text(langStr['str_068']);
        favoriteApp = JSON.parse(window.localStorage.getItem('favoriteList'));
        var content = '';
        if (favoriteApp != null && favoriteApp.length > 0) {
            for (var i in favoriteApp) {
                content += '<div class="applist-item" data-name="' +
                    favoriteApp[i].package_name +
                    '"><a value="" id="" href="#"><img src="' +
                    favoriteApp[i].icon_url +
                    '" width="100%"></a><p class="app-list-name">' +
                    favoriteApp[i].app_name +
                    '</p></div>';
            }
        }

        var iconWidget = 18;  //unit:vw
        var iconMargin = 3.5;   //unit:vw
        var contentWidth = (((favoriteApp == null ? 0 : favoriteApp.length) + 1) * (iconWidget + iconMargin)).toString();

        content += '<div class="applist-item add-favorite-list">' +
            '<a href="#"><img src="' + serverURL + '/widget/applist/addfavorite.png" style="width:18vw;">' +
            '</a><p class="app-list-name" style="opacity:0;">Add</p></div>';

        $('.applist-main-icon').css('width', contentWidth + 'vw').html('').append(content);
    }

    function destroyApplist(target) {
        $(target).children('div.applist-widget').remove();
    }

    $.fn.applist = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.applist.methods[options](this, param);
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

            createContent();

        });
    }

    $.fn.applist.methods = {
        options: function (jq) {
            return $.data(jq[0], 'applist').options;
        },
        destroy: function (jq) {
            return jq.each(function () {
                destroyApplist(this);
            });
        },
        refresh: function (jq) {
            return jq.each(function () {
                getFavoriteApp();
            });
        }
    }

    $.fn.applist.defaults = {}

    $('.' + widgetItem).applist();

})(jQuery);