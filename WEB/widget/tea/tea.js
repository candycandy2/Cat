//widget naming rule widget.js/list()[].name + "Widget"
var teaWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/tea/tea.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var teaImg = $('<img>').attr('src', serverURL + '/widget/tea/img/widget_tea.png');
                $('.tea-icon').html('').append(teaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/tea/img/more_green.png');
                $('.tea-more').html('').append(moreImg);
                //3.update
                $('.tea-update-time').text(updateTime());

            }, "html");

            //点击更多，跳转user pay
            contentItem.on('click', '.tea-more', function() {
                //checkWidgetPage('', pageVisitedList);
            });

        }

        function updateTime() {
            var now = new Date();
            var date = now.yyyymmdd('/');
            var hour = now.getHours();
            var min = now.getMinutes();
            return date + ' ' + hour.toString() + ':' + min.toString();
        }

        $.fn.tea = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'tea');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'tea', {
                        options: $.extend({}, $.fn.tea.defaults, options)
                    });
                }

                createContent();

            })
        };

        $.fn.tea.methods = {
            options: function(jq) {
                return $.data(jq[0], 'tea').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.tea.defaults = {};

        $('.teaWidget').tea();
    }
}