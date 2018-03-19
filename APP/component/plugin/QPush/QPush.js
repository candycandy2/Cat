
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

            QPush.pushCallback("open", QPush.getExtras(extra));

            console.log("openNotification");
            console.log(event);
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

            QPush.pushCallback("receive", QPush.getExtras(extra));

            console.log("receiveNotification");
            console.log(event);
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
            var JSONData = data["Parameter"];
        } else {
            var JSONData = JSON.parse(data["Parameter"]);
        }

        return JSONData;
    }
};
