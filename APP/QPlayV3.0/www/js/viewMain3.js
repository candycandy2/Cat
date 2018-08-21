$("#viewMain3").pagecontainer({
    create: function(event, ui) {

        var widgetArr = null;

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

        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function(event, ui) {
            //1. localstorage
            widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
            //2. load widget
            widget.init($('#widgetList'));
            //3. get message
            if (!callGetMessageList && loginData["msgDateFrom"] === null) {
                msgDateFromType = 'month';
                var clientTimestamp = getTimestamp();
                loginData["msgDateFrom"] = parseInt(clientTimestamp - 60 * 60 * 24 * 30, 10);
                var messageList = new QueryMessageList();
            }

        });

        $("#viewMain3").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewMain3").one("pageshow", function(event, ui) {
            //1. app list
            var applist = new GetAppList();

            //2. widget enabled count
            var enabledLength = 0;
            for (var i in widgetArr) {
                if (widgetArr[i].enabled) {
                    enabledLength++;
                }
            }

            //3. check element count
            var checkWidgetFinish = setInterval(function() {
                var childrenLength = $('#widgetList').children('div').length;
                if (enabledLength == childrenLength) {
                    clearInterval(checkWidgetFinish);

                    setTimeout(function() {
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


        $("#viewMain3").on("pageshow", function(event, ui) {
            orderWidget();
        });

        $("#viewMain3").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转到行事历
        $('#widgetList').on('click', '.personal-res', function() {
            checkAppPage('viewMyCalendar');
        });

        //最爱列表打开APP
        $('#widgetList').on('click', '.applist-item', function() {
            var schemeURL = $(this).attr('data-name') + createAPPSchemeURL();
            openAPP(schemeURL);
        });

        //点击添加按钮跳转到APPList
        $('#widgetList').on('click', '.add-favorite-list', function() {
            addAppToList = true;
            checkAppPage('viewAppList');
        });

        //点击Link跳转到APPList
        $('.applist-link').on('click', function() {
            addAppToList = false;
            checkAppPage('viewAppList');
        });

        //点击widget内message，跳转到message详情页
        $('#widgetList').on('click', '.widget-msg-list', function() {
            messageFrom = 'viewMain3';
            messageRowId = $(this).attr('data-rowid');
            $.mobile.changePage('#viewWebNews2-3-1');
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

        //qpay test
        // $('#widgetList').on('click','.weather-widget', function () {
        //     checkAppPage('viewPay');
        // });


    }

});