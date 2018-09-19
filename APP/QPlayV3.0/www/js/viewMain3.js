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

        //设置高度
        function setHomepageHeight() {
            setTimeout(function() {
                var headHeight = $('#viewMain3 .page-header').height();
                var widgetHeight = $('#widgetList').height();
                var linkHeight = $('.other-link').height();

                var totalHeight;
                if (device.platform === "iOS") {
                    totalHeight = (headHeight + widgetHeight + linkHeight + iOSFixedTopPX()).toString();
                } else {
                    totalHeight = (headHeight + widgetHeight + linkHeight).toString();
                }

                $('.main-scroll > div').css('height', totalHeight + 'px');
            }, 750); 
        }

        var pullControl = null;
        $(".main-scroll").on('scroll', function() {
            //不同设备不同处理
            if (device.platform === "iOS") {
                if ($('#widgetList').offset().top > 50) {
                    if (pullControl == null) {

                        pullControl = PullToRefresh.init({
                            mainElement: '#widgetList',
                            onRefresh: function() {
                                //do something for refresh
                                widget.clear();
                                widget.show();
                                //数据量可能有变化，需重新计算高度
                                setTimeout(function() {
                                    setHomepageHeight();
                                }, 1000);
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
                if (offsetTop == $('#widgetList').offset().top) {
                    if (pullControl == null) {

                        pullControl = PullToRefresh.init({
                            mainElement: '#widgetList',
                            onRefresh: function() {
                                //do something for refresh
                                widget.clear();
                                widget.show();
                                //数据量可能有变化，需重新计算高度
                                setTimeout(function() {
                                    setHomepageHeight();
                                }, 1000);
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
            //1. check FunctionList show or hide
            var functionArr = JSON.parse(window.localStorage.getItem('widgetList'));
            for (var i in functionArr) {
                if (!functionArr[i].enabled) {
                    $('.' + functionArr[i].name + 'Widget').hide();
                }
            }

            //2. check element count
            var checkWidgetFinish = setInterval(function() {
                var childrenLength = $('#widgetList').children('div').length;
                //var enabledLength = parseInt(window.sessionStorage.getItem('widgetLength'));
                var enabledLength = widget.list().length;

                if (enabledLength == childrenLength) {
                    clearInterval(checkWidgetFinish);
                    setHomepageHeight();
                }
            }, 750);

            //3. pull refresh：save initial value
            offsetTop = $('#widgetList').offset().top;

        });


        $("#viewMain3").on("pageshow", function(event, ui) {
            orderWidget();
            widget.show();
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