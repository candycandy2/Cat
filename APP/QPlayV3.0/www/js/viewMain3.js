$("#viewMain3").pagecontainer({
    create: function (event, ui) {
        var widgetList = [
            { 'id': 1, 'name': 'Weather', 'enabled': true },
            { 'id': 2, 'name': 'Calendar', 'enabled': true },
            { 'id': 3, 'name': 'APPList', 'enabled': true }
        ];

        /********************************** page event *************************************/
        $("#viewMain3").one("pagebeforeshow", function (event, ui) {
            // var script = document.createElement("script");
            // script.type = "text/javascript";
            // script.src = "plugin/applist/js/applist.js";
            // document.head.appendChild(script);

            // var link = document.createElement("link");
            // link.rel = "stylesheet";
            // link.type = "text/css";
            // link.href = "plugin/applist/css/applist.css";
            // document.head.appendChild(link);

            // if (localStorage.getItem("widgetList") == null) {
            //     var widgetObj = {
            //         data: widgetArray,
            //         time: widgetUpdate
            //     }
            //     localStorage.setItem("widgetList", JSON.stringify(widgetObj));
            // } else {
            //     var time = JSON.parse(localStorage.getItem("widgetList")).time;
            //     if(time != widgetUpdate) {
            //         var widgetObj = {
            //             data: widgetArray,
            //             time: widgetUpdate
            //         }
            //         localStorage.setItem("widgetList", JSON.stringify(widgetObj));
            //     }
            // }
            // widgetList =  JSON.parse(localStorage.getItem("widgetList")).data;

            for (var i in widgetList) {
                if (widgetList[i].enabled == true) {
                    //1. widget
                    var widgetName = widgetList[i].name + "Widget";

                    //2. html
                    var content = '<div id="' + widgetName + '"></div>';
                    $('#viewMain3 .page-main').append(content);

                    //3. parameter
                    var parmData = {
                        container: widgetName,
                        appKey: appKey,
                        token: loginData.token,
                        pushToken: loginData.pushToken,
                        serverURL: serverURL,
                        appApiPath: appApiPath,
                        browserLanguage: browserLanguage,
                        uuid: loginData.uuid
                    };

                    //4. new Object
                    eval('var obj = new ' + widgetName + '(' + JSON.stringify(parmData) + ');obj.show();');
                }
            }

        });

        $("#viewMain3").scroll(function () {

        });

        $("#viewMain3").on("pageshow", function (event, ui) {

        });

        $("#viewMain3").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/


    }
});