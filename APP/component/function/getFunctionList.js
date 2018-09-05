
//获取Function使用权限列表
function getFunctionList() {
    var self = this;
    var queryStr = "&device_type=" + device.platform;

    this.successCallback = function (data) {
        console.log(data);

        if (data['result_code'] == "1") {
            //window.localStorage.removeItem('FunctionList');
            var jsonData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: data['content']
            };
            window.localStorage.setItem('FunctionList', JSON.stringify(jsonData));

            //FunctionList分组
            var widgetArr = [];
            var functionArr = [];
            var appArr = [];
            var resultArr = data['content']['function_list'];
            for (var i = 0; i < resultArr.length; i++) {
                if(resultArr[i].function_variable.indexOf('widget_') != -1) {
                    widgetArr.push(resultArr[i]);
                } else {
                    if(resultArr[i].function_content.type == 'FUN') {
                        functionArr.push(resultArr[i]);
                    } else if(resultArr[i].function_content.type == 'APP') {
                        appArr.push(resultArr[i]);
                    }
                }
            }
            var functionObj = {};
            functionObj['widget_list'] = widgetArr;
            functionObj['function_list'] = functionArr;
            functionObj['app_list'] = appArr;
            window.localStorage.setItem('FunctionData', JSON.stringify(functionObj));

        }
    };

    this.failCallback = function (data) { };

    var __construct = function () {
        var functionData = JSON.parse(window.localStorage.getItem('FunctionList'));

        if (functionData === null || checkDataExpired(functionData['lastUpdateTime'], 1, 'hh')) {
            QPlayAPIEx("GET", "getFunctionList", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
        }

    }();
}