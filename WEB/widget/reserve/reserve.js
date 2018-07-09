(function ($) {
    var widgetItem = sessionStorage.getItem('widgetItem');
    window.reserveAppList = [
        { key: "apprrs", secretKey: "2e936812e205445490efb447da16ca13" },
        { key: "apprelieve", secretKey: "00a87a05c855809a0600388425c55f0b" },
        { key: "appparking", secretKey: "eaf786afb27f567a9b04803e4127cef3" },
        { key: "appmassage", secretKey: "7f341dd51f8492ca49278142343558d0" }
    ];
    console.log(widgetItem);

    loadWidgetCSS();

    function loadWidgetCSS() {
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: "http://qplaydev.benq.com/widgetDemo/reserve/reserve.css"
            })
            .appendTo("head");
    }

    function appendWidgetHTML(target) {
        $.ajaxSettings.async = false;
        $.get("http://qplaydev.benq.com/widgetDemo/reserve/reserve.html", function (data) {
            $('.' + widgetItem).append(data);

        }, "html");

        getCurrentDate();
        $.ajaxSettings.async = true;
    }

    function getCurrentDate() {
        var cur = new Date();
        var month = cur.getMonth() + 1;
        var date = cur.getDate();
        var day = cur.getDay();

        var str = month.toString() + "月" + date.toString() + "日 星期" + day.toString();
        $('.current-date').text(str);
        var name = window.localStorage.getItem('loginid');
        $('#widgetList .emp-name').text(name);

        getReserve();
    }

    function getReserve() {
        for (var i in reserveAppList) {
            getMyReserve(reserveAppList[i].key, reserveAppList[i].secretKey);
        }
        createTodayReserve();
    }

    function createTodayReserve() {
        var now = new Date();
        var year = now.getFullYear().toString();
        var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1).toString() : (now.getMonth() + 1).toString();
        var day = now.getDate() < 10 ? '0' + now.getDate().toString() : now.getDate().toString();
        var today = year + '-' + month + '-' + day;

        if (reserveList[today] != undefined) {
            var content = '';
            for (var i in reserveList[today]) {
                if (i < 3) {
                    content += '<li class="reserve-today"><div><div>' +
                        reserveList[today][i].ReserveBeginTime +
                        '</div><div>' +
                        reserveList[today][i].ReserveEndTime +
                        '</div></div><div>' +
                        reserveList[today][i].item +
                        '</div></li>';
                }
            }
            $('.widget-reserve-list').html('').append(content);
            $('.widget-reserve-null').hide();
        } else {
            $('.widget-reserve-null').show();
        }
    }

    $.fn.reserve = function (options) {
        options = options || {};

        return this.each(function () {
            var state = $.data(this, 'reserve');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, 'reserve', {
                    options: $.extend({}, $.fn.reserve.defaults, options)
                });
            }

            appendWidgetHTML(this);
            
        });
    }

    $.fn.reserve.defaults = {}

    $('.' + widgetItem).reserve();

})(jQuery);