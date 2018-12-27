var qstoreWidget = {

    categoryList: ["所有類別", "食", "衣", "住", "行", "育", "樂", "其他"],
    QStoreLocalStorageKey: "QStore_listdata",
    allQStoreList: [],
    init: function(contentItem) {
        var _key = this.qstorePageKey;
        var self = this;

        function createContent(key) {
            $.get(serverURL + "/widget/widget/qstore/qstore.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.lang
                self.lang();
                //3.img
                var qstoreImg = $('<img>').attr('src', serverURL + '/widget/widget/qstore/img/widget_store.png');
                $('.qstore-icon').html('').append(qstoreImg);
                var qstoreallImg = $('<img>').attr('src', serverURL + '/widget/widget/qstore/img/store_all.png');
                $('.store-all-img').html('').append(qstoreallImg);
                //var qstorenearImg = $('<img>').attr('src', serverURL + '/widget/widget/qstore/img/store_near.png');
                var qstorenearImg = $('<img>').attr('src', serverURL + '/widget/widget/qstore/img/icon_store_disable.png');
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

        $.fn.qstore = function(options) {
            options = options || {};

            return this.each(function() {
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
    },
    formatUpdateDate: function() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    },
    QueryStoreList: function(index) {

        var self = this;

        return new Promise(function(resolve, reject) {

            var async = false;
            var storelistQueryData = '<LayoutHeader><Category>' + qstoreWidget.categoryList[index] + '</Category><UpdateDate></UpdateDate></LayoutHeader>';
            if (index == 0) {
                async = true;
                var updateDate = qstoreWidget.formatUpdateDate();
                storelistQueryData = '<LayoutHeader><Category></Category><UpdateDate>' + updateDate + '</UpdateDate></LayoutHeader>';
            }
            var successCallback = function(data) {
                if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) != null) {
                    qstoreWidget.allQStoreList = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
                }

                var qstoreListReturnArr = {};
                if (data['ResultCode'] === "1") {
                    //第一次Call StoreList API，將七種類別的StoreList依序存入localStorage
                    qstoreListReturnArr = data['Content'];
                    for (var i = 0; i < qstoreListReturnArr.length; i++) {
                        var index = qstoreWidget.allQStoreList.map(function(item) { return item.MIndex; }).indexOf(qstoreListReturnArr[i].MIndex);
                        if (index >= 0) {
                            //移除找到的
                            qstoreWidget.allQStoreList.splice(index, 1);
                        }
                        //塞入新增的
                        qstoreWidget.allQStoreList.push(qstoreListReturnArr[i]);
                    }

                    //更新日期由近到遠
                    qstoreWidget.allQStoreList.sort(function(a, b) {
                        let aDate = new Date(a.UpdateDate);
                        let bDate = new Date(b.UpdateDate);
                        return aDate < bDate;
                    });
                    window.localStorage.setItem(qstoreWidget.QStoreLocalStorageKey, JSON.stringify(qstoreWidget.allQStoreList));

                } else if (data['ResultCode'] === "044901") {
                    // 查無資料
                }

                resolve(qstoreListReturnArr.length);
            };

            var failCallback = function(data) {
                reject();
            };

            CustomAPI("POST", async, "StoreList", successCallback, failCallback, storelistQueryData, "");
        });
    }
}