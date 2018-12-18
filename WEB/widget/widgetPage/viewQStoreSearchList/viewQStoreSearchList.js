var categoryList = ["所有類別", "食", "衣", "住", "行", "育", "樂", "其他"];
var cityList = ["所有縣市", "基隆市", "台北市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
var selectCategory = qstoreWidget.categoryList[0];
var selectCity = cityList[0];

var qstoreNo;

$("#viewQStoreSearchList").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/
        var cityData = {
            id: "city-popup",
            option: [],
            title: '',
            defaultText: langStr["wgt_108"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };
        var categoryData = {
            id: "category-popup",
            option: [],
            title: '',
            defaultText: langStr["wgt_109"],
            changeDefaultText: true,
            attr: {
                class: "tpl-dropdown-list-icon-arrow"
            }
        };

        var callbackTime = 0;

        function getAllCityList() {
            cityData["option"] = [];
            $("#cityValue").empty();
            $("#city-popup-option-popup").remove();
            var firstStringNum = 110;

            //生成所有縣市列表
            for (var i in cityList) {
                var cityVal = i.toString();
                cityData["option"][i] = {};
                cityData["option"][i]["value"] = cityVal;
                cityData["option"][i]["text"] = cityList[i];
            }

            $("#cityValue").empty();
            tplJS.DropdownList("viewQStoreSearchList", "cityValue", "prepend", "typeB", cityData);
        }

        function getAllCategoryList() {
            categoryData["option"] = [];
            $("#categoryValue").empty();
            $("#category-popup-option-popup").remove();

            //生成所有種類列表
            for (var i in categoryList) {
                var categoryVal = i.toString();
                categoryData["option"][i] = {};
                categoryData["option"][i]["value"] = categoryVal;
                categoryData["option"][i]["text"] = categoryList[i];
            }

            $("#categoryValue").empty();
            tplJS.DropdownList("viewQStoreSearchList", "categoryValue", "prepend", "typeB", categoryData);
        }

        function showQStoreList(qstoreListArr) {
            // qstoreListArr = qstoreListArr.sort(function(a, b) {
            //     return a.Distance < b.Distance ? 1 : -1;
            // });
            var qStoreList = "";
            var imgURL = "/widget/widgetPage/viewQStoreSearchList/img/";
            for (var i in qstoreListArr) {
                qStoreList += '<div class="qstore-list font-style10" data-rowid="' +
                    qstoreListArr[i]["MIndex"] +
                    '">';
                switch (qstoreListArr[i]["Category"]) {
                    case '食':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'eat.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '衣':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'cloth.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '住':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'live.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '行':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'moving.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '育':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'education.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '樂':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'recreation.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '其他':
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'others.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    default:
                        qStoreList += '<div><img src="' + serverURL + imgURL + 'others.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                }

                // if (qstoreListArr[i]["Distance"] == undefined) {
                //     var distanceVal = "";
                // } else {
                //     var distanceVal = qstoreListArr[i]["Distance"];
                // }
                var distanceVal = "";

                qStoreList += $.trim(qstoreListArr[i]["Subject"]) +
                    '</div><div>' +
                    qstoreListArr[i]["Address"] +
                    '</div><div>電話：' +
                    qstoreListArr[i]["Phone"] +
                    '</div></div><div><div>' +
                    distanceVal +
                    '</div></div></div>' +
                    '<div class="qstore-more" ><img src="' + serverURL + imgURL + 'btn_more.png" class="store-more-img" data-rowid="' +
                    qstoreListArr[i]["MIndex"] +
                    '"></div><div class="activity-line"></div>';
            }
            $("#viewQstoreList").empty().append(qStoreList).children("div:last-child").remove();
            $("#viewQstoreNone").hide();
            $("#viewQstoreList").show();
            loadingMask("hide");
        }

        /********************************** page event ***********************************/
        function fetchQStore() {

            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) != null) {
                qstoreWidget.allQStoreList = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
            }
            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) !== null) {
                //第二次之後進入
                showQStoreList(qstoreWidget.allQStoreList);
                qstoreWidget.QueryStoreList(0)
                    .then(function(val) {
                        if (val > 0)
                            showQStoreList(qstoreWidget.allQStoreList);
                    });
            } else {
                //第一次進入
                loadingMask("show");
                qstoreWidget.QueryStoreList(1)
                    .then(qstoreWidget.QueryStoreList(2))
                    .then(qstoreWidget.QueryStoreList(3))
                    .then(qstoreWidget.QueryStoreList(4))
                    .then(qstoreWidget.QueryStoreList(5))
                    .then(qstoreWidget.QueryStoreList(6))
                    .then(qstoreWidget.QueryStoreList(7))
                    .then(showQStoreList(qstoreWidget.allQStoreList));
            }
        }

        $("#viewQStoreSearchList").one("pageshow", function(event, ui) {
            $('#viewQStoreSearchList .page-main').css('height', window.sessionStorage.getItem('pageMainHeight'));
            getAllCityList();
            getAllCategoryList();
            fetchQStore();
            filterQStore(selectCity, selectCategory);
        });

        $("#viewQStoreSearchList").on("pageshow", function(event, ui) {
            fetchQStore();
            filterQStore(selectCity, selectCategory);
        });

        $("#viewQStoreSearchList").on("pagehide", function(event, ui) {});


        /********************************** dom event *************************************/

        function filterQStore(selectCity_, selectCategory_) {
            loadingMask("show");
            var filterQStoreList = [];

            filterQStoreList = qstoreWidget.allQStoreList.filter(function(item) {
                if (selectCategory_ === categoryList[0] && selectCity_ === cityList[0]) {
                    return item;
                } else if (selectCategory_ === categoryList[0] && item.County === selectCity_) {
                    return item;
                } else if (selectCity_ === cityList[0] && item.Category === selectCategory_) {
                    return item;
                } else if (item.Category === selectCategory_ && item.County === selectCity_) {
                    return item;
                }
            });

            if (filterQStoreList.length == 0) {
                $("#viewQstoreList").hide();
                $("#viewQstoreNone").show();
                loadingMask("hide");
            } else {
                showQStoreList(filterQStoreList);
            }
        }

        //選擇城市——select change
        $(document).on("change", "#city-popup", function() {
            selectCity = $.trim($(this).text());
            filterQStore(selectCity, selectCategory);
        });

        //選擇類別——select change
        $(document).on("change", "#category-popup", function() {
            selectCategory = $.trim($(this).text());
            filterQStore(selectCity, selectCategory);
        });

        //查看詳細特約商店資訊
        $("#viewQstoreList").on("click", ".qstore-more", function() {
            //1.傳值
            var self = $(this).children().attr("data-rowid");
            qstoreNo = self;
            checkWidgetPage('viewQStoreDetail', pageVisitedList);
        });

    }
});