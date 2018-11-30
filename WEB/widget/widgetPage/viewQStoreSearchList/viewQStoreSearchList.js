var categoryList = [ "所有類別", "食",  "衣", "住", "行", "育", "樂", "其他"];
var cityList = [ "所有縣市", "基隆市",  "台北市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市" ,"嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
var selectCategory = ""; //选择的类别，可能为“所有类别”
var updateDate = "";
var storelistQueryData = "";
var allQStoreList = [];
var allQStoreAddress = [];
var allQStoreLatLng = [];
var allQStoreDistance = [];
var fristCallStoreList = true;
var hasUpdateDateVal = false;

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
                    loadingMask("hide");
                } else if (data['ResultCode'] === "044901") {
                    qstoreListReturnArr = data['Content'];
                    loadingMask("hide");
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
                getDistanceFromCurrentPosition()
            };   

            var failCallback = function(data) {};

            CustomAPI("POST", true, "StoreList", successCallback, failCallback, storelistQueryData, "");
        };

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
                        var numToRunDistanceMatrix = qstoreListFromLocalStorage.length/100;
                        //可否被100整除
                        if (Math.round(numToRunDistanceMatrix) === numToRunDistanceMatrix) {
                            numToRunDistanceMatrix = numToRunDistanceMatrix;
                        } else {
                            numToRunDistanceMatrix = parseInt(numToRunDistanceMatrix)+1;
                        }


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
                                travelMode: 'DRIVING',
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
                                        var distance = response.rows[i].elements[j].distance.text.replace(" 公里", "km");
                                        allQStoreDistance.push(distance);
                                    }
                                }
                                console.log(status);
                            }
                        }
                     
                    };

                    window.locationError = function(error) {
                        //return black distance value
                        //console.log("------error");
                        console.log(error);
                        alert("------error");
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
                loadingMask("show");
                allQStoreList = [];
                for (var i = 1; i < categoryList.length; i++) {
                    storelistQueryData = '<LayoutHeader><Category>'+ categoryList[i] +'</Category><UpdateDate>'+ updateDate +'</UpdateDate></LayoutHeader>'; 
                    //將QStoreList按七種類別，存入localStorage
                    QueryStoreList(hasUpdateDateVal);    
                }
            }
        });

        $("#viewQStoreSearchList").on("pageshow", function (event, ui) {

        });

        $("#viewQStoreSearchList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/

        //選擇類別——select change
        $(document).on("change", "#categroy-popup", function() {
            //selectCategory = $.trim($(this).text()); 
            selectCategory = $(this).val();
            //filter localStorage: QStoreList
            //if no data: 
            //$("#viewQstoreList").hide();
            //$("#viewQstoreNone").show();
        });

    }
});