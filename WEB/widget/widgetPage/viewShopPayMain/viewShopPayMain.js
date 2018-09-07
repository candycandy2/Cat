$("#viewShopPayMain").pagecontainer({
    create: function (event, ui) {

        function getShopQPayInfo() {
            var self = this;
            var queryStr = "&emp_type=shop";

            this.successCallback = function () {
                if (data['result_code'] == '1') {
                    //1. 消费券类型列表
                    var jsonData = {};
                    jsonData = {
                        lastUpdateTime: new Date(),
                        content: data['content'].point_type_list
                    };
                    window.localStorage.setItem('point_type_list', JSON.stringify(jsonData));

                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                var typeData = JSON.parse(window.localStorage.getItem('point_type_list'));

                if (typeData === null || checkDataExpired(typeData['lastUpdateTime'], 7, 'dd')) {
                    QPlayAPIEx("POST", "getQPayInfo", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
                }
                
            }();
        }

        /********************************** page event ***********************************/
        $("#viewShopPayMain").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopPayMain").one("pageshow", function (event, ui) {
            //Call API
            //getShopQPayInfo();
        });

        $("#viewShopPayMain").on("pageshow", function (event, ui) {

        });

        $("#viewShopPayMain").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //店家结帐
        $('.shop-pay').on('click', function () {
            checkWidgetPage('viewShopSelectUser');
        });

        //店家记录
        $('.shop-record').on('click', function () {
            checkWidgetPage('viewShopQueryRecord');
        });




    }
});