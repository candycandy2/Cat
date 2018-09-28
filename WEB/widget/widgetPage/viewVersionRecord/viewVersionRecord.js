$("#viewVersionRecord").pagecontainer({
    create: function(event, ui) {

        //获取版本记录
        function getVersionRecord(key) {

            key = key || null;
            var self = this;
            var queryStr = "&app_key=" + key + "&device_type=" + device.platform;

            this.successCallback = function(data) {
                //console.log(data);

                if (data['result_code'] == "1") {
                    var versionLogList = data['content'].version_list;
                    var contentFirst = '';
                    var contentMore = '';

                    for (var i in versionLogList) {
                        if(i == 0) {
                            contentFirst = '<div class="version-record-list"><div class="font-style12">' +
                                versionLogList[i].version_name +
                                '</div><div class="font-style11">' +
                                new Date(versionLogList[i].online_date * 1000).FormatReleaseDate() +
                                '</div><div class="font-style11">' +
                                versionLogList[i].version_log.replace(new RegExp('\r?\n', 'g'), '<br />') +
                                '</div><div class="latest-version-record"></div></div>';
                        } else {
                            contentMore += '<div class="version-record-list"><div class="font-style12">' +
                                versionLogList[i].version_name +
                                '</div><div class="font-style11">' +
                                new Date(versionLogList[i].online_date * 1000).FormatReleaseDate() +
                                '</div><div class="font-style11">' +
                                versionLogList[i].version_log.replace(new RegExp('\r?\n', 'g'), '<br />') +
                                '</div></div>';
                        }
                    }

                    $('.version-record-first').html('').append(contentFirst);
                    $('.version-record-more').html('').append(contentMore);

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                QPlayAPIEx("GET", "getVersionLog", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        //检查QPlay是否为最新版本
        function checkQPlayVersion() {
            var self = this;
            var queryStr = "&package_name=com.qplay." + appKey + "&device_type=" + device.platform + "&version_code=" + loginData["versionCode"];

            loadingMask("show");

            this.successCallback = function(data) {

                var resultcode = data['result_code'];

                if (resultcode == '1') {
                    download_url = data['content']['download_url'];

                    //check latest record
                    var latestVersion = setInterval(function() {
                        var btnLength = $('.latest-version-record').length;

                        if(btnLength != 0) {
                            clearInterval(latestVersion);
                            $('.latest-version-record').text(langStr['wgt_074']).addClass('active-update-btn');

                            loadingMask("hide");
                        }

                    },500);

                } else if (resultcode == '000913') {
                    //already latest version
                    var latestVersion = setInterval(function() {
                        var btnLength = $('.latest-version-record').length;

                        if(btnLength != 0) {
                            clearInterval(latestVersion);
                            $('.latest-version-record').text(langStr['wgt_075']).removeClass('active-update-btn');

                            loadingMask("hide");
                        }

                    },500);

                } else {
                    loadingMask("hide");
                }

            }

            this.failCallback = function(data) {};

            var __construct = function() {
                QPlayAPIEx("GET", "checkAppVersion", self.successCallback, self.failCallback, null, queryStr, "high", 30000);
            }();
        }

        //设置页面高度
        function setVersionRecordHeight(type) {
            var contentHeight = $('.version-record-first').height();
            var msgHeight = $('.version-record-msg').height();
            var moreHeight = $('.version-record-more').height();
            var headerHeight = $('#viewVersionRecord .page-header').height();
            var totalHeight;

            if (device.platform === "iOS") {
                totalHeight = (contentHeight + (type == 'first' ? msgHeight : moreHeight) + headerHeight + iOSFixedTopPX()).toString();
            } else {
                totalHeight = (contentHeight + (type == 'first' ? msgHeight : moreHeight) + headerHeight).toString();
            }
            
            $(".version-scroll > div").css('height', totalHeight + 'px');
        }


        /********************************** page event ***********************************/
        $("#viewVersionRecord").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewVersionRecord").one("pageshow", function(event, ui) {
            //title language
            $('#viewVersionRecord .ui-title div').text(langStr['str_081']);
            //set height
            setVersionRecordHeight('first');
        });

        $("#viewVersionRecord").on("pageshow", function(event, ui) {
            //version record
            var APPKey = window.sessionStorage.getItem('checkAPPKey');
            var versionData = new getVersionRecord(APPKey);
            //check version
            var qplayVersion = new checkQPlayVersion();
        });

        $("#viewVersionRecord").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //展开更多
        $('.version-record-msg').on('click', function () {
            $('.version-record-msg').hide();
            $('.version-record-more').show();
            setVersionRecordHeight('more');
        });

        //手动更新
        $('.version-record-first').on('click', '.latest-version-record', function() {
            var has = $(this).hasClass('active-update-btn');

            if(has) {
                if (device.platform === "iOS") {
                    window.open(download_url, '_system');
                } else { //android
                    var updateUrl = download_url;
                    updateAPP(updateUrl);
                }
            }
        });


    }
});