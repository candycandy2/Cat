
var exec = require('cordova/exec');
var qlogin = function() {}

qlogin.prototype.openCertificationPage = function(callback, error_callback) {
    Cordova.exec(callback,error_callback, "QLoginPlugin", "openCertificationPage", []);
}

module.exports = new qlogin();


