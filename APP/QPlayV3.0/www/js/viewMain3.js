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

            //4. load template
            if (widgetItem == 'weatherWidget') {
                $.get("http://qplaydev.benq.com/widgetDemo/" + widgetList[index].name + "/" + widgetList[index].name + ".html", function (data) {
                    contentItem.append(data);
                    //$("#" + pageID).page().enhanceWithin();

                }, "html");
            }

            //4. localStorage
            sessionStorage.setItem('viewClass', widgetItem);

            //5. load css
            // var $cssItem = $('<link rel="stylesheet" type="text/css" href="http://qplaydev.benq.com/widgetDemo/' + widgetList[index].name + '/' + widgetList[index].name + '.css">');
            // $cssItem.appendTo('head');

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
                //load js
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

        $("#calendarTest").on("click", function () {
            $.mobile.changePage('#viewMyCalendar');
        });

        $("#newsTest").on("click", function () {
            $.mobile.changePage('#viewMessageList');
        });

    }
});