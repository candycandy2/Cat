var categoryList = ["所有類別", "食", "衣", "住", "行", "育", "樂", "其他"];
//var categoryList = ["所有類別", "食"];
var cityList = ["所有縣市", "基隆市", "台北市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
var selectCategory = "";
var selectCity = "";
var allQStoreList = [];
var allQStoreAddress = [];
var allQStoreLatLng = [];
var allQStoreDistance = [];
var filterQStoreListByCategory = [];
var filterQStoreListByCity = [];
var activePageListID;
var scrollClassName;
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

        var qstoreListReturnArr = {};
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

        function formatUpdateDate() {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        function QueryStoreList(hasUpdateDateVal, storelistQueryData) {
            loadingMask("show");
            var self = this;
            var successCallback = function(data) {
                if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) != null) {
                    allQStoreList = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
                }
                if (data['ResultCode'] === "1") {
                    //第一次Call StoreList API，將七種類別的StoreList依序存入localStorage
                    qstoreListReturnArr = data['Content'];
                    for(var i=0;i<qstoreListReturnArr.length;i++){
                        allQStoreList.push(qstoreListReturnArr[i]);
                    }

                    localStorage.setItem(qstoreWidget.QStoreLocalStorageKey, JSON.stringify(allQStoreList));
                    var today = formatUpdateDate();
                    localStorage.setItem(qstoreWidget.QStoreUpdateDateLocalStorageKey, JSON.stringify(today));

                } else if (data['ResultCode'] === "044901") {
                    // 查無資料
                }

                showQStoreList(allQStoreList);
            };

            var failCallback = function(data) {
                loadingMask("hide");
            };

            CustomAPI("POST", true, "StoreList", successCallback, failCallback, storelistQueryData, "");
        };

        function showQStoreList(qstoreListArr) {
            qstoreListArr = qstoreListArr.sort(function(a, b) {
                return a.Distance < b.Distance ? 1 : -1;
            });
            var qStoreList = "";
            for (var i in qstoreListArr) {
                qStoreList += '<div class="qstore-list font-style10" data-rowid="' +
                    qstoreListArr[i]["MIndex"] +
                    '">';
                switch (qstoreListArr[i]["Category"]) {
                    case '食':
                        qStoreList += '<div><img src="img/eat.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '衣':
                        qStoreList += '<div><img src="img/cloth.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '住':
                        qStoreList += '<div><img src="img/live.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '行':
                        qStoreList += '<div><img src="img/moving.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '育':
                        qStoreList += '<div><img src="img/education.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '樂':
                        qStoreList += '<div><img src="img/recreation.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    case '其他':
                        qStoreList += '<div><img src="img/others.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                        break;
                    default:
                        qStoreList += '<div><img src="img/others.png" class="store-type-img"></div><div class="qstore-list-detail read-font-normal"><div>';
                }

                if (qstoreListArr[i]["Distance"] == undefined) {
                    var distanceVal = "";
                } else {
                    var distanceVal = qstoreListArr[i]["Distance"];
                }

                qStoreList += $.trim(qstoreListArr[i]["Subject"]) +
                    '</div><div>' +
                    qstoreListArr[i]["Address"] +
                    '</div><div>電話：' +
                    qstoreListArr[i]["Phone"] +
                    '</div></div><div><div>' +
                    distanceVal +
                    '</div></div></div>' +
                    '<div class="qstore-more" ><img src="img/btn_more.png" class="store-more-img" data-rowid="' +
                    qstoreListArr[i]["MIndex"] +
                    '"></div><div class="activity-line"></div>';
            }
            $("#viewQstoreList").empty().append(qStoreList).children("div:last-child").remove();
            $("#viewQstoreNone").hide();
            $("#viewQstoreList").show();
            loadingMask("hide");
        }

        /********************************** page event ***********************************/

        $("#viewQStoreSearchList").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewQStoreSearchList');
            $('#viewQStoreSearchList .page-main').css('height', mainHeight + 'px');
            getAllCityList();
            getAllCategoryList();
            if (localStorage.getItem(qstoreWidget.QStoreUpdateDateLocalStorageKey) !== null) {
                //第二次之後進入
                var updateDate = formatUpdateDate();
                var storelistQueryData = '<LayoutHeader><Category></Category><UpdateDate>' + updateDate + '</UpdateDate></LayoutHeader>';
                QueryStoreList(true, storelistQueryData);
            } else {
                //第一次進入
                //將QStoreList按七種類別，存入localStorage
                for (var i = 1; i < categoryList.length; i++) {
                    var storelistQueryData = '<LayoutHeader><Category>' + categoryList[i] + '</Category><UpdateDate></UpdateDate></LayoutHeader>';
                    QueryStoreList(false, storelistQueryData);
                }
            }
        });

        $("#viewQStoreSearchList").on("pageshow", function(event, ui) {

        });

        $("#viewQStoreSearchList").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/

        //選擇城市——select change
        $(document).on("change", "#city-popup", function() {
            loadingMask("show");
            selectCity = $.trim($(this).text());
            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) !== null) {
                var qstoreListArr = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
                filterQStoreListByCity = [];
                //是否選擇所有縣市
                if (selectCity == "所有縣市") {
                    //先檢查類別是否有被選取
                    if (selectCategory == "所有類別" || selectCategory == "") {
                        filterQStoreListByCity = qstoreListArr;
                    } else {
                        filterQStoreListByCity = qstoreListArr.filter(function(item, index, array) {
                            if (item.Category === selectCategory) {
                                return item;
                            }
                        });
                    }
                } else {
                    if (selectCategory == "所有類別" || selectCategory == "") {
                        filterQStoreListByCity = qstoreListArr.filter(function(item, index, array) {
                            if (item.County === selectCity) {
                                return item;
                            }
                        });
                    } else {
                        filterQStoreListByCity = qstoreListArr.filter(function(item, index, array) {
                            if (item.County === selectCity) {
                                if (item.Category === selectCategory) {
                                    return item;
                                }
                            }
                        });
                    }
                }

                if (filterQStoreListByCity.length == 0) {
                    $("#viewQstoreList").hide();
                    $("#viewQstoreNone").show();
                    loadingMask("hide");
                } else {
                    showQStoreList(filterQStoreListByCity, filterQStoreListByCity.length);
                }
            }
        });

        //選擇類別——select change
        $(document).on("change", "#category-popup", function() {
            loadingMask("show");
            selectCategory = $.trim($(this).text());
            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) !== null) {
                var qstoreListArr = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
                filterQStoreListByCategory = [];
                if (selectCategory == "所有類別") {
                    if (selectCity == "所有縣市" || selectCity == "") {
                        filterQStoreListByCategory = qstoreListArr;
                    } else {
                        filterQStoreListByCategory = qstoreListArr.filter(function(item, index, array) {
                            if (item.County === selectCity) {
                                return item;
                            }
                        });
                    }
                } else {
                    if (selectCity == "所有縣市" || selectCity == "") {
                        filterQStoreListByCategory = qstoreListArr.filter(function(item, index, array) {
                            if (item.Category === selectCategory) {
                                return item;
                            }
                        });
                    } else {
                        filterQStoreListByCategory = qstoreListArr.filter(function(item, index, array) {
                            if (item.County === selectCity) {
                                if (item.Category === selectCategory) {
                                    return item;
                                }
                            }
                        });
                    }
                }

                if (filterQStoreListByCategory.length == 0) {
                    $("#viewQstoreList").hide();
                    $("#viewQstoreNone").show();
                    loadingMask("hide");
                } else {
                    showQStoreList(filterQStoreListByCategory, filterQStoreListByCategory.length);
                }
            }
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