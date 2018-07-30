$("#viewMain3").pagecontainer({
    create: function (event, ui) {

        var loadAndRunScript = function (index, enabled) {
            //1. 条件判断
            if (index >= widgetList.length) {
                return;
            } else if (!enabled) {
                loadAndRunScript(index + 1, widgetList[index + 1] != undefined ? widgetList[index + 1].enabled : false);
            }

            //2. widget
            var widgetItem = widgetList[index].name + "Widget";

            //3. container
            var contentItem = $('<div class="' + widgetItem + '"></div>');
            $('#widgetList').append(contentItem);

            //4. sessionStorage
            sessionStorage.setItem('widgetItem', widgetItem);

            //5. load js
            $.getScript(serverURL + "/widget/" + widgetList[index].name + "/" + widgetList[index].name + ".js")
                .done(function (script, textStatus) {
                    loadAndRunScript(index + 1, widgetList[index + 1] != undefined ? widgetList[index + 1].enabled : false);
                })
                .fail(function (jqxhr, settings, exception) {
                    console.log("Triggered ajaxError handler.");
                });
        };


        /********************************** page event ***********************************/
        $("#viewMain3").one("pagebeforeshow", function (event, ui) {
            //1. load widget
            loadAndRunScript(0, widgetList[0].enabled);

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

            //set height
            if (device.platform === "iOS") {
                $('.main-scroll > div').css('height', '1100px');
            } else {
                $('.main-scroll > div').css('height', '1155px');
            }

        });

        $("#viewMain3").on("pageshow", function (event, ui) {

        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //跳转到行事历
        $('#widgetList').on('click', '.personal-res', function () {
            //$.mobile.changePage('#viewMyCalendar');
            checkAppPage('viewMyCalendar');
        });

        //最爱列表打开APP
        $('#widgetList').on('click', '.applist-item', function () {
            var schemeURL = $(this).attr('data-name') + createAPPSchemeURL();
            openAPP(schemeURL);
        });

        //点击添加按钮跳转到APPList
        $('#widgetList').on('click', '.add-favorite-list', function () {
            //$.mobile.changePage('#viewAppList');
            checkAppPage('viewAppList');
        });

        //点击Link跳转到APPList
        $('.applist-link').on('click', function () {
            //$.mobile.changePage('#viewAppList');
            checkAppPage('viewAppList');
        });

        //点击widget内message，跳转到message详情页
        $('#widgetList').on('click', '.widget-msg-list', function () {
            massageFrom = 'viewMain3';
            messageRowId = $(this).attr('data-rowid');
            $.mobile.changePage('#viewWebNews2-3-1');
        });

        //跳转到MessageList
        $('.message-link').on('click', function () {
            //$.mobile.changePage('#viewMessageList');
            checkAppPage('viewMessageList');
        });

        //跳转到FAQ
        $('.faq-link').on('click', function () {
            //$.mobile.changePage('#viewFAQ');
            checkAppPage('viewFAQ');
        });

        //跳转到设定
        $('#setting').on('click', function () {
            //$.mobile.changePage('#viewFAQ');
            checkAppPage('viewAppSetting');
        });



    }

});