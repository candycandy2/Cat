//widget naming rule widget.js/list()[].name + "Widget"
var movie = {

    init: function(contentItem) {

        function createContent() {
            var url = serverURL + "/webeditor/userdata/" + loginData['loginid'].toLowerCase() + "/widget/movie/movie.";

            var link = document.createElement("link"); 
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url + "css";
            document.getElementsByTagName("head")[0].appendChild(link);

            $.get(url + "html", function(data) {
                contentItem.append(data);

            }, "html");
        }

        $.fn.movie = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.movie.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'movie');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'movie', {
                        options: $.extend({}, $.fn.movie.defaults, options)
                    });
                }

                createContent();

            });
        }

        $.fn.movie.methods = {
            options: function(jq) {
                return $.data(jq[0], 'movie').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.movie.defaults = {};

        contentItem.movie();
    }
}