cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-connectivity-monitor.connectivity",
        "file": "plugins/cordova-connectivity-monitor/www/connectivity.js",
        "pluginId": "cordova-connectivity-monitor",
        "clobbers": [
            "window.connectivity"
        ]
    },
    {
        "id": "cordova-plugin-device.device",
        "file": "plugins/cordova-plugin-device/www/device.js",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "cordova-plugin-qlogin.QLoginPlugin",
        "file": "plugins/cordova-plugin-qlogin/www/QLogin.js",
        "pluginId": "cordova-plugin-qlogin",
        "clobbers": [
            "window.plugins.qlogin"
        ]
    },
    {
        "id": "cordova-plugin-qsecurity.QSecurityPlugin",
        "file": "plugins/cordova-plugin-qsecurity/www/QSecurity.js",
        "pluginId": "cordova-plugin-qsecurity",
        "clobbers": [
            "window.plugins.qsecurity"
        ]
    },
    {
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.0",
    "cordova-connectivity-monitor": "1.2.2",
    "cordova-plugin-device": "1.1.3",
    "cordova-plugin-qlogin": "1.0.0",
    "cordova-plugin-qsecurity": "1.0.0",
    "cordova-plugin-splashscreen": "4.0.0"
};
// BOTTOM OF METADATA
});