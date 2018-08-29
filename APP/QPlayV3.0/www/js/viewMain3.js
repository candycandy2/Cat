$("#viewMain3").pagecontainer({
    create: function(event, ui) {

        //widget排序
        function orderWidget() {
            var widgetListDirty = window.sessionStorage.getItem('widgetListDirty');

            if (widgetListDirty == 'Y' || widgetListDirty == null) {

                var arr = JSON.parse(window.localStorage.getItem('widgetList'));
                for (var i = 0; i < arr.length - 1; i++) {
                    $('.' + arr[i].name + 'Widget').after($('.' + arr[i + 1].name + 'Widget'));
                }
                window.sessionStorage.setItem('widgetListDirty', 'N');
            }
        }

        var pullControl = null;
        $(".main-scroll").on( 'scroll', function(){
            if ($('#widgetList').offset().top > 50) {
                if (pullControl == null) {

                    pullControl = PullToRefresh.init({
                        mainElement: '#widgetList',
                        onRefresh: function() {
                            //do something for refresh
                            widget.clear();
                            widget.show();
                        }
                    });
                } else {}
            } else {

                if (pullControl != null) {
                    pullControl.destroy();
                    pullControl = null;
                }
            }
        });

        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function(event, ui) {

            //2. load widget
            widget.init($('#widgetList'));
        });

        $("#viewMain3").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewMain3").one("pageshow", function(event, ui) {

            //3. check element count
            var checkWidgetFinish = setInterval(function() {
                var childrenLength = $('#widgetList').children('div').length;
                var enabledLength = parseInt(window.sessionStorage.getItem('widgetLength'));

                if (enabledLength == childrenLength) {
                    clearInterval(checkWidgetFinish);

                    setTimeout(function() {
                        var mainHeight = $('.main-scroll > div').height();
                        var headHeight = $('#viewMain3 .page-header').height();

                        var totalHeight;
                        if (device.platform === "iOS") {
                            totalHeight = (mainHeight + headHeight + iOSFixedTopPX()).toString();
                        } else {
                            totalHeight = (mainHeight + headHeight).toString();
                        }

                        $('.main-scroll > div').css('height', totalHeight + 'px');

                    }, 500);
                }
            }, 500);

        });


        $("#viewMain3").on("pageshow", function(event, ui) {
            orderWidget();
            widget.show();
        });

        $("#viewMain3").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/

        //点击Link跳转到APPList
        $('.applist-link').on('click', function() {
            checkAppPage('viewAppList');
        });

        //跳转到MessageList
        $('.message-link').on('click', function() {
            checkAppPage('viewMessageList');
        });

        //跳转到FAQ
        $('.faq-link').on('click', function() {
            checkAppPage('viewFAQ');
        });

        //跳转到设定
        $('#setting').on('click', function() {
            checkAppPage('viewAppSetting');
        });



    }

});