//widget naming rule widget.js/list()[].name + "Widget"
var applistWidget = {

    init: function(contentItem) {

        var favoriteApp = null;

        function createContent() {
            $.get(serverURL + '/widget/applist/applist.html', function(data) {
                contentItem.html('').append(data);
                getFavoriteApp();
            }, 'html');

            //最爱列表打开APP
            contentItem.on('click', '.applist-item', function() {

                var protocol = '';
                var pathArray = [];

                if ($(this).attr('data-url') !== undefined) {
                    pathArray = $(this).attr('data-url').split('/');
                    protocol = pathArray[0];
                }

                if (protocol == "widgetPage:") {
                    //widgePage://viewAccountingRate
                    var target = pathArray[2];
                    checkWidgetPage(target, pageVisitedList);
                } else {
                    var schemeURL = $(this).attr('data-name') + createAPPSchemeURL();
                    openAPP(schemeURL);
                }
            });

            //点击添加按钮跳转到APPList
            contentItem.on('click', '.add-favorite-list', function() {
                checkWidgetPage('viewAppListEx', pageVisitedList); //from app/component/function/
            });
        }

        function getFavoriteApp() {
            $('.applist-title').text(langStr['wgt_007']);
            favoriteApp = JSON.parse(window.localStorage.getItem('favoriteList'));
            var content = '';
            if (favoriteApp != null && favoriteApp.length > 0) {
                for (var i in favoriteApp) {
                    if (favoriteApp[i].url == undefined) {

                        content += '<div class="applist-item" data-name="' +
                            favoriteApp[i].package_name +
                            '"><a value="" id="" href="#"><img src="' +
                            favoriteApp[i].icon_url +
                            '" width="100%"></a><p class="app-list-name">' +
                            favoriteApp[i].app_name +
                            '</p></div>';
                    } else {

                        content += '<div class="applist-item" data-name="' +
                            favoriteApp[i].package_name +
                            '" data-url="' +
                            favoriteApp[i].url +
                            '"><a value="" id="" href="#"><img src="' +
                            favoriteApp[i].icon_url +
                            '" width="100%"></a><p class="app-list-name">' +
                            favoriteApp[i].app_name +
                            '</p></div>';
                    }
                }
            }

            var iconWidget = 18; //unit:vw
            var iconMargin = 3.5; //unit:vw
            var contentWidth = (((favoriteApp == null ? 0 : favoriteApp.length) + 1) * (iconWidget + iconMargin)).toString();

            content += '<div class="applist-item add-favorite-list">' +
                '<a href="#"><img src="' + serverURL + '/widget/applist/addfavorite.png" style="width:18vw;">' +
                '</a><p class="app-list-name" style="opacity:0;">Add</p></div>';

            $('.applist-main-icon').css('width', contentWidth + 'vw').html('').append(content);
        }

        function destroyApplist(target) {
            $(target).children('div.applist-widget').remove();
        }

        $.fn.applist = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.applist.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
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
            options: function(jq) {
                return $.data(jq[0], 'applist').options;
            },
            destroy: function(jq) {
                return jq.each(function() {
                    destroyApplist(this);
                });
            },
            refresh: function(jq) {
                return jq.each(function() {
                    getFavoriteApp();
                });
            }
        }

        $.fn.applist.defaults = {}

        $('.reserveWidget').applist();
    },
    refresh: function() {
    },
    show: function() {
        var applist = new getAppList();
    },
    clear: function() {

        var content_ = JSON.parse(window.localStorage.getItem('QueryAppListData'));
        if (content_ !== null) {
            var jsonData = {};
            var date = new Date();
            jsonData = {
                lastUpdateTime: date.setDate(date.getDate() - 1),
                content: content_.content
            };
            window.localStorage.setItem('QueryAppListData', JSON.stringify(jsonData));
        }
    }
};