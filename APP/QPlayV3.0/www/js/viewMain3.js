$("#viewMain3").pagecontainer({
    create: function(event, ui) {

        var offsetTop;

        //widget排序
        function orderWidget() {
            var widgetListDirty = window.sessionStorage.getItem('widgetListDirty');

            if (widgetListDirty == 'Y' || widgetListDirty == null) {

                var arr = JSON.parse(window.localStorage.getItem('widgetList'));

                var widgetOrder = setInterval(function() {
                    if (arr != null) {
                        clearInterval(widgetOrder);

                        for (var i = 0; i < arr.length - 1; i++) {
                            $('.' + arr[i].name + 'Widget').after($('.' + arr[i + 1].name + 'Widget'));
                        }
                        window.sessionStorage.setItem('widgetListDirty', 'N');
                    }
                }, 500);
            }
        }

        var pullControl = null;
        $("#widgetListContent").on('scroll', function() {
            //不同设备不同处理
            if (device.platform === "iOS") {
                if ($('.main-scroll').offset().top > 50) {
                    if (pullControl == null) {

                        pullControl = PullToRefresh.init({
                            mainElement: '#widgetList',
                            onRefresh: function() {
                                //do something for refresh
                                widget.clear();
                                widget.show();
                                component.clear();
                                component.refresh();
                                //calendar update
                                window.sessionStorage.setItem('CalendarDirty', 'Y');
                            }
                        });
                    }
                } else {

                    if (pullControl != null) {
                        pullControl.destroy();
                        $('#viewMain3 .ptr--ptr').remove();
                        pullControl = null;
                    }
                }
            } else {
                //如果滑动到顶部，初始化pullrefresh
                if (offsetTop == $('.main-scroll').offset().top) {
                    if (pullControl == null) {

                        pullControl = PullToRefresh.init({
                            mainElement: '#widgetList',
                            onRefresh: function() {
                                //do something for refresh
                                widget.clear();
                                widget.show();
                                component.clear();
                                component.refresh();
                                //calendar update
                                window.sessionStorage.setItem('CalendarDirty', 'Y');
                            }
                        });
                    }
                } else {
                    //滑动到其他
                    if (pullControl != null) {
                        pullControl.destroy();
                        $('#viewMain3 .ptr--ptr').remove();
                        pullControl = null;
                    }

                }

            }
        });


        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function(event, ui) {
            //1. load widget
            widget.init($('#widgetList'));
        });

        $("#viewMain3").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewMain3").one("pageshow", function(event, ui) {
            //main height and offsetTop
            offsetTop = $('#viewMain3 .page-header').height();

            var mainHeight = getPageMainHeight('viewMain3');
            $('#viewMain3 .ui-content').css('height', mainHeight + 'px');
        });

        $("#viewMain3").on("pageshow", function(event, ui) {
            orderWidget();
            widget.show();
            //是否需要refresh widget
            var needRefresh = window.sessionStorage.getItem('needRefreshWidget');
            if(needRefresh != null) {
                eval(needRefresh);
                window.sessionStorage.removeItem('needRefreshWidget');
            }
        });

        $("#viewMain3").on("pagehide", function(event, ui) {
            if(pullControl != null) {
                pullControl.destroy();
                $('#viewMain3 .ptr--ptr').remove();
                pullControl = null;
            }
        });


        /********************************** dom event *************************************/
        //点击Link跳转到APPList
        $('.applist-link').on('click', function() {
            checkWidgetPage('viewAppList', pageVisitedList);
        });

        //跳转到MessageList
        $('.message-link').on('click', function() {
            checkWidgetPage('viewMessageList', pageVisitedList);
        });

        //跳转到FAQ
        $('.faq-link').on('click', function() {
            checkWidgetPage('viewFAQ', pageVisitedList);
        });

        //跳转到设定
        $('#setting').on('click', function() {
            checkWidgetPage('viewAppSetting', pageVisitedList);
        });


    }
});