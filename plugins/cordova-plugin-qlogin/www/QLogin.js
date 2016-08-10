
var exec = require('cordova/exec');
var qlogin = function() {}

qlogin.prototype.openCertificationPage = function(callback, error_callback) {
    Cordova.exec(callback,error_callback, "QLoginPlugin", "openCertificationPage", []);
}

qlogin.prototype.getLoginData = function(callback, error_callback) {
    var scope = null;

    var _callback = function() {
        if(typeof callback == 'function') {
            callback.apply(scope,arguments);
        }
    };

    var _error_callback = function() {
        if(typeof error_callback == 'function') {
            error_callback.apply(scope,arguments);
        }
    };

    Cordova.exec(callback,error_callback, "QLoginPlugin", "getLoginData", []);
}

module.exports = new qlogin();


