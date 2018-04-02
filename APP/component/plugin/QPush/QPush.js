
//Plugin - QPush
//
//--need:
//-- 1. cordova-plugin-jpush
//
var QPush = {
    initial: function(config) {
        //JPush Initial
        window.JPush.init();

        //Get JPush Token
        if (window.localStorage.getItem("pushToken") === null) {
            window.plugins.jPushPlugin.getRegistrationID(function(data) {
                console.log(data);

                loginData.pushToken = data;
                QPush.sendPushToken(data);
            });
        }

        document.addEventListener("jpush.openNotification", function (event) {
            var extra;

            if (device.platform == "Android") {
                //alertContent = event.alert
                extra = event.extras["cn.jpush.android.EXTRA"];
            } else {
                //alertContent = event.aps.alert
                extra = event.extras;
            }

            console.log("openNotification");
            console.log(event);

            QPush.pushCallback("open", QPush.getExtras(extra));

        }, false);

        document.addEventListener("jpush.receiveNotification", function (event) {
            var extra;

            if (device.platform == "Android") {
                //alertContent = event.alert;
                extra = event.extras["cn.jpush.android.EXTRA"];
            } else {
                //alertContent = event.aps.alert;
                extra = event.extras;
            }

            console.log("receiveNotification");
            console.log(event);

            QPush.pushCallback("receive", QPush.getExtras(extra));

        }, false);

        //Set Config
        QPush.pushCallback = config["pushCallback"];
    },
    sendPushToken: function(token) {
        (function(token) {

            var queryStr = "&app_key=" + appKey + "&device_type=" + device.platform;

            var successCallback = function(data) {
                var resultCode = data['result_code'];

                if (resultCode === 1) {
                    window.localStorage.setItem("pushToken", loginData.pushToken);
                }
            };

            var failCallback = function(data) {};

            QPlayAPI("POST", "sendPushToken", successCallback, failCallback, null, queryStr);

        }(token));
    },
    getExtras: function(data) {
        console.log(data["Parameter"]);

        if (window.appKeyOriginal === "appqchat") {
            //In QChat (User JMessage + JPush), only iOS will trigger JPush Event,
            //and the data structure is different with [Only Use JPush]
            if (device.platform == "iOS") {

                if (data["Parameter"] === undefined) {
                    //Data from JMessage
                    var JSONData = data["custom"];
                } else {
                    //Data from QPlay Server
                    var JSONData = data["Parameter"];
                }
            } else {
                var JSONData = data["Parameter"];
            }
        } else {
            var JSONData = JSON.parse(data["Parameter"]);
        }

        return JSONData;
    }
};
