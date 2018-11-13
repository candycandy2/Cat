//widget naming rule widget.js/list()[].name + "Widget"
var ideaWidget = {

    init: function (contentItem) {

        function createContent(contentItem) {

            $.get(serverURL + "/widget/idea/idea.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var ideaImg = $('<img>').attr('src', serverURL + '/widget/idea/img/widget_idea.png');
                $('.idea-icon').html('').append(ideaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/idea/img/more_green.png');
                $('.idea-more').html('').append(moreImg);

            }, "html");

        }

        $.fn.idea = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'idea');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'idea', {
                        options: $.extend({}, $.fn.idea.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.idea.methods = {
            options: function(jq) {
                return $.data(jq[0], 'idea').options;
            }
        };

        $.fn.idea.defaults = {};

        $('.ideaWidget').idea();
    }

};