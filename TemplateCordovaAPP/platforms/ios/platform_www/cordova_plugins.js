cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "pluginId": "cordova-plugin-splashscreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-connectivity-monitor/www/connectivity.js",
        "id": "cordova-connectivity-monitor.connectivity",
        "pluginId": "cordova-connectivity-monitor",
        "clobbers": [
            "window.connectivity"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-splashscreen": "3.2.2",
    "cordova-connectivity-monitor": "1.2.2"
}
// BOTTOM OF METADATA
});