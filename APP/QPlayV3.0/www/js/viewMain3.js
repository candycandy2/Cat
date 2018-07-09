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

            //4. localStorage
            sessionStorage.setItem('widgetItem', widgetItem);

            //5. load js
            $.getScript("http://qplaydev.benq.com/widgetDemo/" + widgetList[index].name + "/" + widgetList[index].name + ".js")
                .done(function (script, textStatus) {
                    loadAndRunScript(index + 1, widgetList[index + 1] != undefined ? widgetList[index + 1].enabled : false);
                })
                .fail(function (jqxhr, settings, exception) {
                    console.log("Triggered ajaxError handler.");
                });
        };


        /********************************** page event ***********************************/
        $("#viewMain3").on("pagebeforeshow", function (event, ui) {
            if (viewMainInitial) {
                //1. load widget
                loadAndRunScript(0, widgetList[0].enabled);

                //2. get message
                if(!callGetMessageList && loginData["msgDateFrom"] === null) {
                    msgDateFromType = 'month';
                    var clientTimestamp = getTimestamp();
                    loginData["msgDateFrom"] = parseInt(clientTimestamp - 60 * 60 * 24 * 30, 10);
                    var messageList = new QueryMessageList();
                }

                viewMainInitial = false;
            }
        });

        $("#viewMain3").on("pageshow", function (event, ui) {
            
        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('#widgetList').on('click', '.personal-res', function () {
            $.mobile.changePage('#viewMyCalendar');
        });

        $('#widgetList').on('click', '.applist-main-add', function () {
            $.mobile.changePage('#viewAppList');
        });

        $('.applist-link').on('click', function () {
            $.mobile.changePage('#viewAppList');
        });

        $('#widgetList').on('click', '.messageWidget', function () {
            $.mobile.changePage('#viewMessageList');
        });

        $('.message-link').on('click', function () {
            $.mobile.changePage('#viewMessageList');
        });

        $('.faq-link').on('click', function () {
            $.mobile.changePage('#viewFAQ');
        });

        $('.scroll-test-link').on('click', function () {
            $.mobile.changePage('#viewScrollTest');
        });

        $('#widgetList').on('click', '.applist-item', function () {
            var schemeURL = $(this).attr('data-name') + createAPPSchemeURL();
            openAPP(schemeURL);
        });


    }
});