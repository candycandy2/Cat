var exec = require('cordova/exec');

exports.checkAppUpdate = function(success, error, updateUrl) {
    updateUrl = updateUrl ? [updateUrl] : [];
    exec(success, error, "AppUpdate", "checkAppUpdate", updateUrl);
};

exports.AppUpdateNow = function(success, error, downloadUrl) {
    downloadUrl = downloadUrl ? [downloadUrl] : [];
    exec(success, error, "AppUpdate", "AppUpdateNow", downloadUrl);
};