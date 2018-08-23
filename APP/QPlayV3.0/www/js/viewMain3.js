$("#viewMain3").pagecontainer({
    create: function (event, ui) {

        var enabledLength = 0;

        //widget排序
        function orderWidget() {
            var widgetListDirty = window.sessionStorage.getItem('widgetListDirty');

            if (widgetListDirty == 'Y' || widgetListDirty == null) {

                var arr = JSON.parse(window.localStorage.getItem('widgetList'));
                enabledLength = arr.length;
                for (var i = 0; i < arr.length - 1; i++) {
                    $('.' + arr[i].name + 'Widget').after($('.' + arr[i + 1].name + 'Widget'));
                }
                window.sessionStorage.setItem('widgetListDirty', 'N');
            }
        }

        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function (event, ui) {
            //2. load widget
            widget.init($('#widgetList'));
            // //3. get message
            // if (!callGetMessageList && loginData["msgDateFrom"] === null) {
            //     msgDateFromType = 'month';
            //     var clientTimestamp = getTimestamp();
            //     loginData["msgDateFrom"] = parseInt(clientTimestamp - 60 * 60 * 24 * 30, 10);
            //     var messageList = new QueryMessageList();
            // }

        });

        $("#viewMain3").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewMain3").one("pageshow", function (event, ui) {

            //3. check element count
            var checkWidgetFinish = setInterval(function () {
                var childrenLength = $('#widgetList').children('div').length;
                if (enabledLength == childrenLength) {
                    clearInterval(checkWidgetFinish);

                    setTimeout(function () {
                        var mainHeight = $('.main-scroll > div').height();
                        var headHeight = $('#viewMain3 .page-header').height();
                        var totalHeight;

                        if (device.platform === "iOS") {
                            totalHeight = (mainHeight + headHeight + iOSFixedTopPX()).toString();
                            $('.main-scroll > div').css('height', totalHeight + 'px');
                        } else {
                            totalHeight = (mainHeight + headHeight + 2).toString();
                            $('.main-scroll > div').css('height', totalHeight + 'px');
                        }

                    }, 2000);
                }
            }, 2000);

        });


        $("#viewMain3").on("pageshow", function (event, ui) {
            orderWidget();
        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/

        //点击Link跳转到APPList
        $('.applist-link').on('click', function () {
            checkAppPage('viewAppList');
        });

        //跳转到MessageList
        $('.message-link').on('click', function () {
            checkAppPage('viewMessageList');
        });

        //跳转到FAQ
        $('.faq-link').on('click', function () {
            checkAppPage('viewFAQ');
        });

        //跳转到设定
        $('#setting').on('click', function () {
            checkAppPage('viewAppSetting');
        });

    }

});