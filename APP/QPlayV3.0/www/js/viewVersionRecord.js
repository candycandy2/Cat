$("#viewVersionRecord").pagecontainer({
    create: function(event, ui) {

        //获取版本记录
        function getVersionRecord(key) {

            key = key || null;
            var self = this;
            var queryStr = "&app_key=" + key + "&device_type=" + device.platform;

            this.successCallback = function(data) {
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

                    $(".version-scroll > div").html('').append(content);

                    //set language
                    $('#viewVersionRecord .ui-title div').text(langStr['str_081']);

                    //set height
                    var contentHeight = $('.version-scroll > div').height();
                    var headerHeight = $('#viewVersionRecord .page-header').height();
                    var totalHeight;
                    if (device.platform === "iOS") {
                        totalHeight = (contentHeight + headerHeight + iOSFixedTopPX()).toString();
                    } else {
                        totalHeight = (contentHeight + headerHeight).toString();
                    }
                    $(".version-scroll > div").css('height', totalHeight + 'px');

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                QPlayAPIEx("GET", "getVersionLog", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        /********************************** page event ***********************************/
        $("#viewVersionRecord").on("pagebeforeshow", function(event, ui) {
            $("#versionRecordList").html('');
        });

        $("#viewVersionRecord").on("pageshow", function(event, ui) {

            var APPKey = window.sessionStorage.getItem('checkAPPKey');
            var versionData = new getVersionRecord(APPKey);
        });

        $("#viewVersionRecord").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //返回上一页
        $('#viewVersionRecord .q-btn-header').on('click', function() {
            if (versionFrom) {
                checkAppPage('viewAppSetting');
            } else {
                checkAppPage('viewAppDetail2-2');
            }
        });

    }
});