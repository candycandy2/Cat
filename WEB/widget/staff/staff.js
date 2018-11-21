//widget naming rule widget.js/list()[].name + "Widget"
var staffWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/staff/staff.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var teaImg = $('<img>').attr('src', serverURL + '/widget/staff/img/widget_tea.png');
                $('.staff-icon').html('').append(teaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/staff/img/more_green.png');
                $('.staff-more').html('').append(moreImg);
                //3.update
                $('.staff-update-time').text(updateTime());

            }, "html");

            //点击更多，跳转到快速叫茶
            contentItem.on('click', '.staff-more', function() {
                checkWidgetPage('viewUserAddTea', pageVisitedList);
            });

        }

        function updateTime() {
            var now = new Date();
            var date = now.yyyymmdd('/');
            var time = now.hhmm();
            return date + ' ' + time;
        }

        $.fn.staff = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'staff');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'staff', {
                        options: $.extend({}, $.fn.staff.defaults, options)
                    });
                }

                createContent();

            })
        };

        $.fn.staff.methods = {
            options: function(jq) {
                return $.data(jq[0], 'staff').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.staff.defaults = {};

        $('.staffWidget').staff();
    }
}