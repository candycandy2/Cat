cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-qlogin.QLoginPlugin",
        "file": "plugins/cordova-plugin-qlogin/www/QLogin.js",
        "pluginId": "cordova-plugin-qlogin",
        "clobbers": [
            "window.plugins.qlogin"
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
        "id": "cordova-plugin-qsecurity.QSecurityPlugin",
        "file": "plugins/cordova-plugin-qsecurity/www/QSecurity.js",
        "pluginId": "cordova-plugin-qsecurity",
        "clobbers": [
            "window.plugins.qsecurity"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-qlogin": "1.0.0",
    "cordova-plugin-device": "1.1.2",
    "cordova-plugin-qsecurity": "1.0.0"
};
// BOTTOM OF METADATA
});