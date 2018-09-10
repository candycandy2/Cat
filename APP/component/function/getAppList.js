
//CallAPI get applist
function getAppList() {
    var self = this;

    this.successCallback = function (data) {

        //console.log(data);

        if (data['result_code'] == '1') {

            window.localStorage.removeItem('QueryAppListData');
            var jsonData = {};
            jsonData = {
                lastUpdateTime: new Date(),
                content: data['content']
            };
            window.localStorage.setItem('QueryAppListData', JSON.stringify(jsonData));

            //review br alan
            //for OO
            //var responsecontent = data['content'];
            //appGroupByDownload(responsecontent);
        }

    };

    this.failCallback = function (data) { };

    var __construct = function () {

        var limitSeconds = 1 * 60 * 60 * 24;
        var QueryAppListData = JSON.parse(window.localStorage.getItem('QueryAppListData'));

        if (loginData["versionName"].indexOf("Staging") !== -1) {
            limitSeconds = 1;
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            limitSeconds = 1;
        }

        if (QueryAppListData === null || checkDataExpired(QueryAppListData['lastUpdateTime'], limitSeconds, 'ss')) {
            QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
        } else {
            //review by alan
            //for OO
            //var responsecontent = JSON.parse(window.localStorage.getItem('QueryAppListData'))['content'];
            //appGroupByDownload(responsecontent);
        }
    }();
}