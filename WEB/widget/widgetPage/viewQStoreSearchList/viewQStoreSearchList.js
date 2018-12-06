var categoryList = [ "所有類別", "食",  "衣", "住", "行", "育", "樂", "其他"];
var cityList = [ "所有縣市", "基隆市",  "台北市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市" ,"嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
var selectCategory= ""; 
var selectCity = ""; 
var updateDate = "";
var storelistQueryData = "";
var allQStoreList = [];
var allQStoreAddress = [];
var allQStoreLatLng = [];
var allQStoreDistance = [];
var filterQStoreListByCategory = [];
var filterQStoreListByCity = [];
var fristCallStoreList = true;
var hasUpdateDateVal = false;
var activePageListID;
var scrollClassName;

$("#viewQStoreSearchList").pagecontainer({
    create: function (event, ui) {

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

        function formatDate() {
            var d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        function QueryStoreList(hasUpdateDateVal) {
            loadingMask("show");
            var self = this;
            var successCallback = function(data) { 
                if (data['ResultCode'] === "1") {
                    //第一次Call StoreList API，將七種類別的StoreList依序存入localStorage
                    qstoreListReturnArr = data['Content'];
                    if (fristCallStoreList) {
                        allQStoreList.push(qstoreListReturnArr);
                        fristCallStoreList = false;
                    } else {
                        for (var i in qstoreListReturnArr) {
                            allQStoreList[0].push(qstoreListReturnArr[i]);
                        }
                    }
                    //loadingMask("hide");
                } else if (data['ResultCode'] === "044901") {
                    qstoreListReturnArr = data['Content'];
                    //loadingMask("hide");
                } 
                if (!hasUpdateDateVal) {
                    localStorage.setItem("allQstoreListData", JSON.stringify(allQStoreList[0]));
                } else {
                    var qstoreListFromLocalStorage =  JSON.parse(localStorage.getItem("allQstoreListData"));

                    for (var i in qstoreListReturnArr) {
                        //find object in list
                        var findNewAddQStoreIndex = $.map(qstoreListFromLocalStorage, function(item, index) {
                            return item.MIndex;
                        }).indexOf(qstoreListReturnArr[i]["MIndex"]);

                        if (findNewAddQStoreIndex !== -1 ) {
                            //QStoreList From localStorage 和 UpdatedData From API 比對
                            //若有對應的MIndex，代表是修改資料，splice 該 array list from allQstoreListData &  push NEW array list into allQstoreListData
                            qstoreListFromLocalStorage.splice(findNewAddQStoreIndex, 1, qstoreListReturnArr[i]);
                            localStorage.setItem("allQstoreListData", JSON.stringify(qstoreListFromLocalStorage));  
                        } else {
                            //若沒有對應的MIndex，代表資料新增，push 該 array list into allQstoreListData
                            qstoreListFromLocalStorage.push(qstoreListReturnArr[i]);
                            localStorage.setItem("allQstoreListData", JSON.stringify(qstoreListFromLocalStorage));
                        }
                    }
                }
                //getDistanceFromCurrentPosition();
                showQStoreList(JSON.parse(localStorage.getItem("allQstoreListData")), JSON.parse(localStorage.getItem("allQstoreListData")).length);
            };   

            var failCallback = function(data) {};

            CustomAPI("POST", true, "StoreList", successCallback, failCallback, storelistQueryData, "");
        };

        function showQStoreList(qstoreListArr, qstoreListLength) {
            qstoreListArr = qstoreListArr.sort(function (a, b) {
                return a.Distance < b.Distance ? 1 : -1;
            });
            var qStoreList = ""; 
            for (var i in qstoreListArr) {
                qStoreList += '<div class="qstore-list font-style10" data-rowid="'
                                + qstoreListArr[i]["MIndex"]
                                + '">';
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

                qStoreList +=  $.trim(qstoreListArr[i]["Subject"])
                                + '</div><div>'
                                + qstoreListArr[i]["Address"]
                                + '</div><div>電話：'
                                + qstoreListArr[i]["Phone"]
                                + '</div></div><div><div>'
                                + distanceVal
                                + '</div></div></div>'
                                + '<div class="qstore-more"><img src="img/btn_more.png" class="store-more-img"></div><div class="activity-line"></div>';
            }
            $("#viewQstoreList").empty().append(qStoreList).children("div:last-child").remove(); 
            $("#viewQstoreNone").hide();
            $("#viewQstoreList").show();
            //2018/12/04
            scrollHeightOnePage(activePageListID, scrollClassName, qstoreListLength);
            /*$("#" + activePageListID + ">.page-header").css({
                'position': 'fixed'
            });*/
            loadingMask("hide");
        }

        function scrollHeightOnePage(viewName, className, listLength) {
            var headHeight = $('#'+ viewName +' .page-header').height();
            var fixHeight = $('.choose-by-dll').height();
            var contentHeight = $(".qstore-list").height() + $(".qstore-more").height() + $(".activity-line").height();
            var totalHeight;
            if (device.platform === "iOS") {
                //totalHeight = (headHeight + fixHeight + contentHeight + iOSFixedTopPX()).toString();
                totalHeight = ( headHeight + fixHeight + contentHeight * listLength + iOSFixedTopPX()).toString();
            } else {
                //totalHeight = (headHeight + fixHeight + contentHeight).toString();
                totalHeight = ( headHeight + fixHeight + contentHeight * listLength).toString();
            }
            $('.'+ className +' > div').css('height', totalHeight + 'px'); 
        }

        function getDistanceFromCurrentPosition() {
                if (navigator.geolocation) {
                    console.log("---------1");

                    window.locationSuccess = function(position) {
                       
                       console.log("--------success");
                        var pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        };

                        var myLatLng = new google.maps.LatLng(pos.lat, pos.lng);

                        console.log(myLatLng);

                        //Crate New destinations array from QStoreList in localStorage
                        var qstoreListFromLocalStorage =  JSON.parse(localStorage.getItem("allQstoreListData"));
                        
                        //Google API: Server-side requests using mode=transit or using the optional parameter departure_time when mode=driving are limited to 100 elements per request.
                        //Check the length
                        /*var numToRunDistanceMatrix = qstoreListFromLocalStorage.length/100;
                        //可否被100整除
                        if (Math.round(numToRunDistanceMatrix) === numToRunDistanceMatrix) {
                            numToRunDistanceMatrix = numToRunDistanceMatrix;
                        } else {
                            numToRunDistanceMatrix = parseInt(numToRunDistanceMatrix)+1;
                        }*/

                        var i = 0;
                        for (var j=1; j < 5; j++) {  
                            allQStoreLatLng = [];
                            //var destinationB = new google.maps.LatLng(50.087, 14.421);
                            //Google Maximum of 25 origins and 25 destinations per server-side request
                            for (i; i < 25*j; i++) {
                                if (qstoreListFromLocalStorage[i] !== undefined) {
                                    qstoreListFromLocalStorage[i].Position;
                                    //latlngRemoveParenth
                                    var latlng = qstoreListFromLocalStorage[i].Position.replace("(", "").replace(")", "").split(",");
                                    var latVal = parseFloat(latlng[0]);
                                    var lngVal = parseFloat(latlng[1]);
                                    var destination = new google.maps.LatLng(latVal, lngVal);
                                    allQStoreLatLng.push(destination);
                                } 
                            }

                            var service = new google.maps.DistanceMatrixService();

                            service.getDistanceMatrix({
                                origins: [myLatLng],
                                destinations: allQStoreLatLng,
                                travelMode: 'WALKING',
                                unitSystem: google.maps.UnitSystem.METRIC,
                                avoidHighways: false,
                                avoidTolls: false
                            }, callback);

                            function callback(response, status) {
                                console.log(response);
                                for (var i=0; i<response.rows.length; i++) {
                                    for (var j=0; j<response.rows[i].elements.length; j++) {
                                        //console.log("從 '" + response.originAddresses[i] + "' 往 '" + response.destinationAddresses[j] + "'");
                                        //console.log("--距離: " + response.rows[i].elements[j].distance.text);
                                        if (response.rows[i].elements[j].distance == undefined) {
                                            var distance = "";
                                        } else {
                                            var distance = response.rows[i].elements[j].distance.text.replace(" 公里", "km");
                                        }
                                        allQStoreDistance.push(distance);
                                        callbackTime++;
                                    }
                                }
                                console.log(status);
                                if (callbackTime == 100) {
                                    for (var k=0; k<100; k++) {
                                        qstoreListFromLocalStorage[k].Distance = allQStoreDistance[k];
                                    }
                                    localStorage.setItem("allQstoreListData", JSON.stringify(qstoreListFromLocalStorage));
                                    showQStoreList(JSON.parse(localStorage.getItem("allQstoreListData")), JSON.parse(localStorage.getItem("allQstoreListData")).length);
                                    callbackTime = 0;
                                }
                            }
                        }

                    };

                    window.locationError = function(error) {
                        //return black distance value
                        //console.log("------error");
                        console.log(error);
                        var qstoreListFromLocalStorage =  JSON.parse(localStorage.getItem("allQstoreListData"));
                        for (var i in qstoreListFromLocalStorage) {
                            qstoreListFromLocalStorage[i].Distance = ""; 
                        }
                        localStorage.setItem("allQstoreListData", JSON.stringify(qstoreListFromLocalStorage));
                        showQStoreList(JSON.parse(localStorage.getItem("allQstoreListData")), JSON.parse(localStorage.getItem("allQstoreListData")).length);
                    };

                    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {       
                        enableHighAccuracy: true
                    });
                } else {
                    console.log("---------2");
                }
        }

        /********************************** page event ***********************************/

        $("#viewQStoreSearchList").one("pageshow", function (event, ui) {
            getAllCityList();
            getAllCategoryList();
            if (localStorage.getItem("reneweddate") !== null) {
                hasUpdateDateVal = true;
                updateDate = formatDate();
                //第二次之後進入，UpdateDate更新到local端
                localStorage.setItem("reneweddate", JSON.stringify(updateDate));
                storelistQueryData = '<LayoutHeader><Category></Category><UpdateDate>'+ updateDate +'</UpdateDate></LayoutHeader>';
                QueryStoreList(hasUpdateDateVal);
                fristCallStoreList = true;
            } else {
                hasUpdateDateVal = false;
                updateDate = "";
                var today = formatDate();
                //第一次進入，UpdateDate存到local端
                localStorage.setItem("reneweddate", JSON.stringify(today));
                allQStoreList = [];
                for (var i = 1; i < categoryList.length; i++) {
                    storelistQueryData = '<LayoutHeader><Category>'+ categoryList[i] +'</Category><UpdateDate>'+ updateDate +'</UpdateDate></LayoutHeader>'; 
                    //將QStoreList按七種類別，存入localStorage
                    QueryStoreList(hasUpdateDateVal);    
                }
            }
            activePageListID = 'viewQStoreSearchList';   
            scrollClassName = 'qstore-list-scroll';
        });

        $("#viewQStoreSearchList").on("pageshow", function (event, ui) {

        });

        $("#viewQStoreSearchList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/

        //選擇城市——select change
        $(document).on("change", "#city-popup", function() {
            loadingMask("show");
            selectCity = $.trim($(this).text()); 
            var qstoreListArr = JSON.parse(localStorage.getItem("allQstoreListData"));
            filterQStoreListByCity = [];
            //是否選擇所有縣市
            if (selectCity == "所有縣市") {
                //先檢查類別是否有被選取
                if (selectCategory == "所有類別" || selectCategory == "") {
                    filterQStoreListByCity = qstoreListArr;
                } else {
                    filterQStoreListByCity = qstoreListArr.filter(function(item, index, array){
                        if (item.Category === selectCategory) {
                            return item;
                        }
                    });
                }
            } else {
                if (selectCategory == "所有類別" || selectCategory == "") {
                    filterQStoreListByCity = qstoreListArr.filter(function(item, index, array){
                        if (item.County === selectCity) {
                            return item;
                        }
                    });
                } else {
                    filterQStoreListByCity = qstoreListArr.filter(function(item, index, array){
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

        });

        //選擇類別——select change
        $(document).on("change", "#category-popup", function() {
            loadingMask("show");
            selectCategory = $.trim($(this).text()); 
            var qstoreListArr = JSON.parse(localStorage.getItem("allQstoreListData"));
            filterQStoreListByCategory = [];
            if (selectCategory == "所有類別") {
                if (selectCity == "所有縣市" || selectCity == "") {
                    filterQStoreListByCategory = qstoreListArr;
                } else {
                    filterQStoreListByCategory = qstoreListArr.filter(function(item, index, array){
                        if (item.County === selectCity) {
                            return item;
                        }
                    });
                }
            } else {
                if (selectCity == "所有縣市" || selectCity == "") {
                    filterQStoreListByCategory = qstoreListArr.filter(function(item, index, array){
                        if (item.Category === selectCategory) {
                            return item;
                        }
                    });
                } else {
                    filterQStoreListByCategory = qstoreListArr.filter(function(item, index, array){
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
        });

    }
});