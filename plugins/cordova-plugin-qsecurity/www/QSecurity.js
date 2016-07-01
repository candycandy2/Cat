cordova.define("cordova-plugin-qsecurity.QSecurity", function(require, exports, module) {

var exec = require('cordova/exec');
var qsecurity = function() {}

qsecurity.prototype.setWhiteList = function(options, callback, error_callback) {
    options || (options = {});
    var scope = options.scope || null;

    var config = {
        level: options.level || '3',
        Navigations: options.Navigations || {},
        Intents: options.Intents || {},
        Requests: options.Requests || {}
    };

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

    exec(_callback,_error_callback, "QSecurity", "setWhitelist", [config]);
}

qsecurity.prototype.changeLevel = function(options, callback, error_callback) {
    options || (options = {});
    var scope = options.scope || null;

    var config = {
        level: options.level || '3',
    };

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

    exec(_callback,_error_callback, "QSecurity", "changeLevel", [config]);
}

qsecurity.prototype.resumeCheckLevel = function(callback, error_callback) {

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

    exec(_callback,_error_callback, "QSecurity", "resumeCheckLevel", []);
}


module.exports = new qsecurity();
});
