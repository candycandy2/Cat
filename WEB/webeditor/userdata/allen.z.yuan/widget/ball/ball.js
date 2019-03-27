//widget naming rule widget.js/list()[].name + "Widget"
var ball = {

    init: function(contentItem) {

        function createContent() {
            var url = serverURL + "/webeditor/userdata/" + loginData['loginid'].toLowerCase() + "/widget/ball/ball.";

            var link = document.createElement("link"); 
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url + "css";
            document.getElementsByTagName("head")[0].appendChild(link);

            $.get(url + "html", function(data) {
                contentItem.append(data);

            }, "html");
        }

        $.fn.ball = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.ball.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'ball');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'ball', {
                        options: $.extend({}, $.fn.ball.defaults, options)
                    });
                }

                createContent();

            });
        }

        $.fn.ball.methods = {
            options: function(jq) {
                return $.data(jq[0], 'ball').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.ball.defaults = {};

        contentItem.ball();
    }
}