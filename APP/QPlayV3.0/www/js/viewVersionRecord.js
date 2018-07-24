$("#viewVersionRecord").pagecontainer({
    create: function (event, ui) {

        //获取版本记录
        function getVersionRecord(key) {
            key = key || null;

            var self = this;

            if (key == null) {
                key = qplayAppKey;
            }

            var queryStr = "&app_key=" + key + "&device_type=" + device.platform;
            //var queryStr = "&app_key=appqplaydev&device_type=android";

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == "1") {
                    var versionLogList = data['content'].version_list;
                    var content = '';

                    for (var i in versionLogList) {
                        content += '<div class="version-record-list"><div class="font-style12">' +
                            versionLogList[i].version_name +
                            '</div><div class="font-style11">' +
                            new Date(versionLogList[i].online_date * 1000).FormatReleaseDate() +
                            '</div><div class="font-style11">' +
                            versionLogList[i].version_log.replace(new RegExp('\r?\n', 'g'), '<br />') +
                            '</div></div>';
                    }

                    $("#versionRecordList").html('').append(content);
                }
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                QPlayAPI("GET", "getVersionLog", self.successCallback, self.failCallback, null, queryStr);

            }();
        }


        /********************************** page event ***********************************/
        $("#viewVersionRecord").on("pagebeforeshow", function (event, ui) {
            
        });

        $("#viewVersionRecord").on("pageshow", function (event, ui) {
            var versionData = new getVersionRecord(checkAPPKey);
        });

        $("#viewVersionRecord").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/


    }
});