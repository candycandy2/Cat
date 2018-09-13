function addDownloadHit(appname_) {
    var self = this;

    this.successCallback = function(data) {
        var resultcode = data['result_code'];
        if (resultcode == 1) {} else {}
    };

    this.failCallback = function(data) {
        var resultcode = data['result_code'];
        if (resultcode == 1) {} else {}
    };

    var __construct = function() {
        var queryStr = "&login_id=" + loginData.loginid + "&package_name=" + appname_;
        QPlayAPI("GET", "addDownloadHit", self.successCallback, self.failCallback, null, queryStr);
    }();
}