var categoryList = [ "所有類別", "食",  "衣", "住", "行", "育", "樂", "其他"];
var cityList = [ "所有縣市", "基隆市",  "台北市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市" ,"嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
var selectCategory = ""; //选择的类别，可能为“所有类别”
var updateDate = "";
var storelistQueryData = "";
var allQStoreList = [];
var fristCallStoreList = true;

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

        function QueryStoreList() {
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
                localStorage.setItem("allQstoreListData", JSON.stringify(allQStoreList[0]));
            };   

            var failCallback = function(data) {};

            CustomAPI("POST", true, "StoreList", successCallback, failCallback, storelistQueryData, "");
        };

        /********************************** page event ***********************************/

        $("#viewQStoreSearchList").one("pageshow", function (event, ui) {
            getAllCityList();
            getAllCategoryList();
            if (localStorage.getItem("reneweddate") !== null) {
                updateDate = formatDate();
                //第二次之後進入，UpdateDate更新到local端
                localStorage.setItem("reneweddate", JSON.stringify(updateDate));
            } else {
                updateDate = "";
                var today = formatDate();
                //第一次進入，UpdateDate存到local端
                //localStorage.setItem("reneweddate", JSON.stringify(today));
            }
            loadingMask("show");
            allQStoreList = [];
            for (var i = 1; i < categoryList.length; i++) {
                storelistQueryData = '<LayoutHeader><Category>'+ categoryList[i] +'</Category><UpdateDate>'+ updateDate +'</UpdateDate></LayoutHeader>'; 
                //將QStoreList按七種類別，存入localStorage
                QueryStoreList();    
            }
        });

        $("#viewQStoreSearchList").on("pagebeforeshow", function (event, ui) {

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
        });

    }
});