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
            var contentItem = $('<div></div>');
            contentItem.prop('class', widgetItem);
            contentItem.appendTo('#widgetList');
            var blankItem = $('<div class="widget-blank"></div>');
            blankItem.appendTo('#widgetList');

            //4. localStorage
            sessionStorage.setItem('viewClass', widgetItem);

            //5. load css
            var cssItem = $('<link>');
            cssItem.prop('rel', 'stylesheet');
            cssItem.prop('type', 'text/css');
            cssItem.prop('href', 'http://qplaydev.benq.com/widgetDemo/' + widgetList[index].name + '/' + widgetList[index].name + '.css');
            cssItem.appendTo('head');

            //6. load js
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
                loadAndRunScript(0, widgetList[0].enabled);
                viewMainInitial = false;
            }
        });

        $("#viewMain3").scroll(function () {

        });

        $("#viewMain3").on("pageshow", function (event, ui) {

        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('#widgetList').on('click', '.applist-main-add', function () {
            $.mobile.changePage('#viewAppList');
        });

        $("#faqTest").on("click", function () {
            $.mobile.changePage('#viewFAQ');
        });

    }
});