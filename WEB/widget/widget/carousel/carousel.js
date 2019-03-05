//widget naming rule widget.js/list()[].name + "Widget"

var carouselWidget = {

    init: function(contentItem) {

        var carouselLength = 5;

        function createContent(contentItem) {

            $.get(serverURL + "/widget/widget/carousel/carousel.html", function(data) {
                contentItem.html('').append(data);

                var allowUpdate = window.sessionStorage.getItem('allowUpdateAPP');
                if (allowUpdate == 'Y') {
                    $('.bulletin-close img').attr('src', serverURL + '/widget/widget/carousel/img/close.png');
                    $('.bulletin-icon img').attr('src', serverURL + '/widget/widget/carousel/img/announce.png');
                    $('.bulletin-link div').text(langStr['wgt_072']);
                    $('.top-bulletin').show();
                } else {
                    $('.top-bulletin').hide();
                }

                $.getJSON(serverURL + '/widget/widget/carousel/link.json', function(data) {

                    for (var j = 0; j < carouselLength; j++) {

                        var name = "portal_" + (j + 1);
                        if (data[j].definition != "") {

                            contentItem.on('click', '.' + name, function(obj) {

                                var carouselLinkJSON = JSON.parse(window.localStorage.getItem('carouselLink'));
                                //alert(obj.currentTarget.parentElement.id);
                                var index = obj.currentTarget.parentElement.id;
                                if (carouselLinkJSON !== null && carouselLinkJSON.content[index].comment !== "") {
                                    if (carouselLinkJSON.content[index].comment != "") {
                                        window.sessionStorage.setItem(carouselLinkJSON.content[index].comment, 'Y');
                                    }
                                    checkWidgetPage(carouselLinkJSON.content[index].definition, pageVisitedList);
                                }
                            });
                        }

                        if(data[j].reference != "") {
                            contentItem.on('click', '.' + name, function(obj) {
                                var carouselLinkJSON = JSON.parse(window.localStorage.getItem('carouselLink'));
                                var index = obj.currentTarget.parentElement.id;
                                if(carouselLinkJSON !== null && carouselLinkJSON.content[index].reference !== "") {
                                    //cordova.InAppBrowser.open(carouselLinkJSON.content[index].reference, '_system');
                                    window.open(carouselLinkJSON.content[index].reference, '_system');
                                }
                            });
                        }
                    }


                    var jsonData = {};
                    var date = new Date();
                    jsonData = {
                        lastUpdateTime: date.setDate(date.getDate() - 1),
                        content: data
                    };
                    window.localStorage.setItem('carouselLink', JSON.stringify(jsonData));
                });

                var content = '';

                for (var i = 0; i < carouselLength; i++) {
                    content += '<li id= "' + i + '" class="sw-slide"><img class="portal_' + (i + 1) + '" src="' + serverURL + '/widget/widget/carousel/img/portal_' + (i + 1) + '.jpg"/></li>';
                }

                $('.carousel-widget ul').append(content);

                setTimeout(function() {
                    $('.carousel-widget').swipeslider({
                        prevNextButtons: false,
                        autoPlayTimeout: 3000
                    });
                }, 1500);

            }, "html");

            //关闭顶部公告
            contentItem.on('click', '.bulletin-close', function() {
                $('.top-bulletin').hide();

                var bulletinHeight = $('.top-bulletin').height();
                window.sessionStorage.setItem('updateHomePageHeight', bulletinHeight);
            });

            //去版本记录页下载最新版
            contentItem.on('click', '.bulletin-link div', function() {
                window.sessionStorage.setItem('checkAPPKey', qplayAppKey);
                checkWidgetPage('viewVersionRecord', pageVisitedList);
            });
        }

        $.fn.carousel = function(options) {
            options = options || {};

            return this.each(function() {
                var state = $.data(this, 'carousel');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'carousel', {
                        options: $.extend({}, $.fn.carousel.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.carousel.defaults = {}

        $('.carouselWidget').carousel();
    }

};