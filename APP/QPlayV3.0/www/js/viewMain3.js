$("#viewMain3").pagecontainer({
    create: function (event, ui) {

        var widgetArr = JSON.parse(localStorage.getItem('widgetList'));

        var loadAndRunScript = function (index) {
            //1. 条件判断
            if (index == widgetArr.length) {
                return;
            } else {
                if (!widgetArr[index].enabled) {
                    loadAndRunScript(index + 1);
                }
            }

            //2. widget
            var widgetItem = widgetArr[index].name + "Widget";

            //3. container
            var contentItem = $('<div class="' + widgetItem + '"></div>');
            $('#widgetList').append(contentItem);

            //4. sessionStorage
            sessionStorage.setItem('widgetItem', widgetItem);

            //5. load js
            $.getScript(serverURL + "/widget/" + widgetArr[index].name + "/" + widgetArr[index].name + ".js")
                .done(function (script, textStatus) {
                    loadAndRunScript(index + 1);
                })
                .fail(function (jqxhr, settings, exception) {
                    console.log("Triggered ajaxError handler.");
                });
        };

        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function (event, ui) {
            //1. load widget
            loadAndRunScript(0);

            //2. get message
            if (!callGetMessageList && loginData["msgDateFrom"] === null) {
                msgDateFromType = 'month';
                var clientTimestamp = getTimestamp();
                loginData["msgDateFrom"] = parseInt(clientTimestamp - 60 * 60 * 24 * 30, 10);
                var messageList = new QueryMessageList();
            }
            
        });

        $("#viewMain3").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewMain3").one("pageshow", function (event, ui) {
            var applist = new GetAppList();

            var checkHomepageHeight = setInterval(function () {
                if (carouselFinish && weatherFinish && reserveFinish && messageFinish && applistFinish) {
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

                    //clear
                    clearInterval(checkHomepageHeight);
                }
            }, 1000);

        });

        $("#viewMain3").on("pageshow", function (event, ui) {

        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转到行事历
        $('#widgetList').on('click', '.personal-res', function () {
            checkAppPage('viewMyCalendar');
        });

        //最爱列表打开APP
        $('#widgetList').on('click', '.applist-item', function () {
            var schemeURL = $(this).attr('data-name') + createAPPSchemeURL();
            openAPP(schemeURL);
        });

        //点击添加按钮跳转到APPList
        $('#widgetList').on('click', '.add-favorite-list', function () {
            addAppToList = true;
            checkAppPage('viewAppList');
        });

        //点击Link跳转到APPList
        $('.applist-link').on('click', function () {
            addAppToList = false;
            checkAppPage('viewAppList');
        });

        //点击widget内message，跳转到message详情页
        $('#widgetList').on('click', '.widget-msg-list', function () {
            messageFrom = 'viewMain3';
            messageRowId = $(this).attr('data-rowid');
            $.mobile.changePage('#viewWebNews2-3-1');
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