
var qstoreWidget = {

    QStoreLocalStorageKey : "QStore_listdata",
    init: function(contentItem) {
        var _key = this.qstorePageKey;
        var self = this;

        function createContent(key) {
            $.get(serverURL + "/widget/qstore/qstore.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.lang
                self.lang();
                //3.img
                var qstoreImg = $('<img>').attr('src', serverURL + '/widget/qstore/img/widget_store.png');
                $('.qstore-icon').html('').append(qstoreImg);
                var qstoreallImg = $('<img>').attr('src', serverURL + '/widget/qstore/img/store_all.png');
                $('.store-all-img').html('').append(qstoreallImg);
                //var qstorenearImg = $('<img>').attr('src', serverURL + '/widget/qstore/img/store_near.png');
                var qstorenearImg = $('<img>').attr('src', serverURL + '/widget/qstore/img/icon_store_disable.png');
                $('.store-near-img').html('').append(qstorenearImg);

            }, "html");

            //點擊我附近商店，跳轉特約商店地圖頁面
            contentItem.on('click', '.store-near-img', function() {
                checkWidgetPage('viewQStoreMain', pageVisitedList);
            });

            //點擊我所有商店，跳轉所有商店分類頁面
            contentItem.on('click', '.store-all-img', function() {
                checkWidgetPage('viewQStoreSearchList', pageVisitedList);
            });
        }

        $.fn.qstore = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'qstore');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'qstore', {
                        options: $.extend({}, $.fn.qstore.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.qstore.methods = {
            options: function(jq) {
                return $.data(jq[0], 'qstore').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
                });
            }
        }

        $.fn.qstore.defaults = {};

        $('.qstoreWidget').qstore();
    },
    clear: function() {
        window.localStorage.removeItem(qstoreWidget.QStoreLocalStorageKey);
    },
    lang: function() {
        $(".qstoreWidget .langStr").each(function(index, element) {
            var id = $(element).data("id");
            if (typeof langStr[id] !== 'undefined') {
                $(this).html(langStr[id]);
            }
        });
    }
}