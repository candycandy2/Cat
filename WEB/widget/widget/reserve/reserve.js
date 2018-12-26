//widget naming rule widget.js/list()[].name + "Widget"
var reserveWidget = {

    reserveAppList: [
        { key: "apprrs", secretKey: "2e936812e205445490efb447da16ca13" },
        { key: "apprelieve", secretKey: "00a87a05c855809a0600388425c55f0b" },
        { key: "appparking", secretKey: "eaf786afb27f567a9b04803e4127cef3" },
        { key: "appmassage", secretKey: "7f341dd51f8492ca49278142343558d0" }
    ],
    getAllReserve: function(_reserveAppList) {

        for (var i in _reserveAppList) {
            //from component/function/
            getMyReserve(_reserveAppList[i].key, _reserveAppList[i].secretKey);
        }
    },
    createTodayReserve: function(arr) {

        var now = new Date();
        var year = now.getFullYear().toString();
        var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1).toString() : (now.getMonth() + 1).toString();
        var day = now.getDate() < 10 ? '0' + now.getDate().toString() : now.getDate().toString();
        var today = year + '-' + month + '-' + day;

        if (typeof arr[today] == 'undefined') {
            $('.widget-reserve-null').show();

        } else {
            var content = '';
            for (var i in arr[today]) {
                if (i < 3) {
                    content += '<li class="reserve-today"><div><div>' +
                        arr[today][i].ReserveBeginTime +
                        '</div><div>' +
                        arr[today][i].ReserveEndTime +
                        '</div></div><div>' +
                        arr[today][i].item +
                        '</div></li>';
                }
            }
            $('.widget-reserve-list').html('').append(content);
            $('.widget-reserve-null').hide();
        }
    },
    refresh: function() {

        THIS = this;
        //3.check data
        var checkReserveData = setInterval(function() {
            var reserveLocal = JSON.parse(sessionStorage.getItem('reserveList'));
            var changeReserveListDirty = sessionStorage.getItem('changeReserveListDirty');

            if (reserveLocal !== null && changeReserveListDirty == 'Y') {
                clearInterval(checkReserveData);
                THIS.createTodayReserve(reserveLocal);
                sessionStorage.setItem('changeReserveListDirty','N')
            }
        }, 1000);
    },
    init: function(contentItem) {

        function createContent(contentItem) {

            $.get(serverURL + "/widget/widget/reserve/reserve.html", function(data) {
                contentItem.html('').append(data);
                $img = $('<img>').attr('src', serverURL + '/widget/widget/reserve/default_photo.png');
                $('.reserve-default-photo').html('').append($img);
                //1.获取当天日期和用户名
                getCurrentDate();
                //2.获取用户头像
                checkPhotoUpload($('.reserve-default-photo img'));

            }, "html");

            //跳转到行事历
            contentItem.on('click', '.personal-res', function() {
                checkWidgetPage('viewMyCalendar', pageVisitedList);
            });

            //点击头像跳转到设定页
            contentItem.on('click', '.reserve-default-photo', function() {
                checkWidgetPage('viewAppSetting', pageVisitedList);
            });
        }

        function getCurrentDate() {

            var now = new Date();
            var str = now.toLocaleDateString(browserLanguage, { weekday: 'long', month: 'long', day: 'numeric' });
            $('.current-date').text(str);
            var name = window.localStorage.getItem('loginid');
            $('#widgetList .emp-name').text(name);
            $('.widget-reserve-null').text(langStr['wgt_006']);
        }

        //检查是否上传过头像
        function checkPhotoUpload($target) {
            //var url = 'https://bqgroupstoragedev.blob.core.windows.net/appqplaydev-portrait/1705055/1705055_1024.png';
            //from component/
            var env = '';
            if (loginData["versionName"].indexOf("Staging") !== -1) {
                env = 'test';
            } else if (loginData["versionName"].indexOf("Development") !== -1) {
                env = 'dev';
            }

            var dateTime = Date.now();
            var timeStamp = Math.floor(dateTime / 1000);

            var url = 'https://bqgroupstorage' + env + '.blob.core.windows.net/appqplay' + env +
                '-portrait/' + loginData.emp_no + '/' + loginData.emp_no + '_1024.png?v=' + timeStamp;

            $.get(url).success(function() {
                $target.attr('src', url);
            });
        }

        $.fn.reserve = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.reserve.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'reserve');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'reserve', {
                        options: $.extend({}, $.fn.reserve.defaults, options)
                    });
                }

                //1.创建DOM
                createContent(contentItem);

            });
        }

        $.fn.reserve.methods = {
            options: function(jq) {
                return $.data(jq[0], 'reserve').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    checkPhotoUpload($('.reserve-default-photo img'));
                });
            }
        }
        $.fn.reserve.defaults = {}
        $('.reserveWidget').reserve();
    },
    show: function() {
        this.getAllReserve(this.reserveAppList);
        this.refresh();
    },
    clear: function() {
        //from component/
        var env = '';
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            env = 'test';
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            env = 'dev';
        }

        window.localStorage.removeItem('apprrs' + env);
        window.localStorage.removeItem('appmassage' + env);
        window.localStorage.removeItem('appparking' + env);
        window.localStorage.removeItem('apprelieve' + env);
        sessionStorage.setItem('changeReserveListDirty', 'Y');
    }
};