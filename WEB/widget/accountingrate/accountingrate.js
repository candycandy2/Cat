//widget naming rule widget.js/list()[].name + "Widget"
var accountingrateWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/accountingrate/accountingrate.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var rateImg = $('<img>').attr('src', serverURL + '/widget/accountingrate/img/widget_accountingrate.png');
                $('.rate-widget-icon').html('').append(rateImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/accountingrate/img/more_green.png');
                $('.rate-more-icon').html('').append(moreImg);
                //3.list
                getFavoriteRate();

            }, "html");

            contentItem.on('click', '.rate-more-icon', function() {
                checkWidgetPage('viewAccountingRate', pageVisitedList);
            });
        }

        function getFavoriteRate() {
            var favorateRateList = JSON.parse(window.localStorage.getItem('FavoriteRateList'));
            if(favorateRateList == null || favorateRateList.length == 0) {
                $('.rate-no-favorite').show();
                $('.rate-favorite-ul').hide();
            } else {
                $('.rate-no-favorite').hide();
                //update date
                var rateUpdateDate = window.localStorage.getItem('latestUpdateDatetime').substr(0, 10);
                $('.rate-date').text(rateUpdateDate);
                //rate list
                var content = '';
                for(var i in favorateRateList) {
                    if(i < 3) {
                        content += '<li class="rate-list-li"><div><img src="' + serverURL + '/widget/widgetPage/viewAccountingRate/img/tmp/' +
                            favorateRateList[i]['fromStatus'] + '.png"></div><div>1' + favorateRateList[i]['fromStatus'] +
                            '</div><div>=</div><div><img src="https://qplaydev.benq.com/widget/widgetPage/viewAccountingRate/img/favorite.png">'+
                            '</div><div><img src="https://qplaydev.benq.com/widget/widgetPage/viewAccountingRate/img/tmp/' + favorateRateList[i]['toStatus'] +
                            '.png"></div><div>' + favorateRateList[i]['rate'] + favorateRateList[i]['toStatus'] + '</div></li>';
                    }
                }
                $('.rate-favorite-ul').append(content).show();
            }
            
        }


        $.fn.accountingrate = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.accountingrate.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'accountingrate');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'accountingrate', {
                        options: $.extend({}, $.fn.accountingrate.defaults, options)
                    });
                }

                createContent();

            });
        }

        $.fn.accountingrate.methods = {
            options: function(jq) {
                return $.data(jq[0], 'accountingrate').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.applist.defaults = {}

        $('.accountingrateWidget').accountingrate();
    }
}