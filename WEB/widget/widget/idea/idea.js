//widget naming rule widget.js/list()[].name + "Widget"
var ideaWidget = {

    init: function (contentItem) {

        function createContent(contentItem) {

            $.get(serverURL + "/widget/widget/idea/idea.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var ideaImg = $('<img>').attr('src', serverURL + '/widget/widget/idea/img/widget_idea.png');
                $('.idea-icon').html('').append(ideaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/idea/img/more_green.png');
                $('.idea-more').html('').append(moreImg);

            }, "html");

            //点击更多，跳转消息列表
            contentItem.on('click', '.idea-more', function() {
                window.sessionStorage.setItem('openIdeaPortal', 'Y');
                checkWidgetPage('viewMessageList', pageVisitedList);
            });

            //点击idea，跳转消息内容
            contentItem.on('click', '.idea-main', function() {
                messageFrom = 'ideaWidget';
                portalURL = $(this).find('input[type="hidden"]').val();
                checkWidgetPage('viewWebNews2-3-1', pageVisitedList);
            });
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
    },

    show: function() {
        var firstIdeaPortal = JSON.parse(window.localStorage.getItem('<LayoutHeader><PortalCategory>IDEA</PortalCategory></LayoutHeader>'));
        if(firstIdeaPortal == null) {
            $('.idea-none').show();
            $('.idea-main').hide();
        } else {
            $('.idea-none').hide();
            $('.idea-widget-img').css({
                'background': 'url(' + firstIdeaPortal['content'][0].PortalImageURL + ')',
                'background-size': 'cover'
            });
            $('.idea-widget-title').text(firstIdeaPortal['content'][0].PortalSubject);
            $('.idea-widget-source').text(firstIdeaPortal['content'][0].PortalSource);
            $('.idea-widget-date').text(new Date(firstIdeaPortal['content'][0].PortalDate).yyyymmdd('/'));
            $('.idea-main input[type="hidden"]').val(firstIdeaPortal['content'][0].PortalURL);
            $('.idea-main').show();
        }
    }

};