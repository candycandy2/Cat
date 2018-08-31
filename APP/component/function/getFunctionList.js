
//获取Function使用权限列表
function getFunctionList() {
    var self = this;
    var queryStr = "&device_type=" + device.platform;

    this.successCallback = function(data) {
        //console.log(data);

        if (data['result_code'] == "1") {
            window.localStorage.removeItem('FunctionList');
            var jsonData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: data['content']
            };
            window.localStorage.setItem('FunctionList', JSON.stringify(jsonData));
        }
    };

    this.failCallback = function(data) {};

    var __construct = function() {
        var functionData = JSON.parse(window.localStorage.getItem('FunctionList'));

        if (functionData === null || checkDataExpired(functionData['lastUpdateTime'], 1, 'hh')){
            QPlayAPIEx("GET", "getFunctionList", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
        }

    }();
}