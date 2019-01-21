$("#viewShopPayMain").pagecontainer({
    create: function (event, ui) {

        let imgURL = '/widget/widgetPage/viewShopPayMain/img/';

        function getQPayInfoShop() {
            var self = this;

            this.successCallback = function (data) {
                //console.log(data);

                if (data['result_code'] == '1') {
                    //1. 消费券类型列表
                    var type_list = data['content'].point_type_list;
                    window.sessionStorage.setItem('point_type_list', JSON.stringify(type_list));

                    //2. 记录店家信息
                    var shop_data = {
                        'shop_id': data['content'].shop_id,
                        'shop_name': data['content'].shop_name
                    }
                    window.sessionStorage.setItem('shop_info', JSON.stringify(shop_data));
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getQPayInfoShop", self.successCallback, self.failCallback, null, null, "low", 30000, true);
            }();
        }

        //检查是否上传过头像
        function checkPhotoUpload($target) {
            //var url = 'https://bqgroupstoragedev.blob.core.windows.net/appqplaydev-portrait/barista/barista_1024.png';
            var env = '';

            if (loginData["versionName"].indexOf("Staging") !== -1) {
                env = 'test';
            } else if (loginData["versionName"].indexOf("Development") !== -1) {
                env = 'dev';
            }

            var dateTime = Date.now();
            var timeStamp = Math.floor(dateTime / 1000);

            var url = 'https://bqgroupstorage' + env + '.blob.core.windows.net/appqplay' + env +
                '-portrait/' + loginData.emp_no + '/' + loginData.emp_no + '_1024.png?v=' + timeStamp;

            $.get(url).success(function () {
                $target.attr('src', url);
            });
        }


        /********************************** page event ***********************************/
        $("#viewShopPayMain").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopPayMain").one("pageshow", function (event, ui) {
            //头像和名称
            checkPhotoUpload($('#shopPhoto'));
            $('.name-shop').text(loginData['loginid']);
            //img
            $('.shop-pay div:eq(0)').append('<img src="' + serverURL + imgURL + 'icon_qpay.png" width="100%">');
            $('.shop-record div:eq(0)').append('<img src="' + serverURL + imgURL + 'icon_history.png" width="100%">');
            $('.shop-return div:eq(0)').append('<img src="' + serverURL + imgURL + 'icon_return.png" width="100%">');
            $('.shop-change div:eq(0)').append('<img src="' + serverURL + imgURL + 'icon_change.png" width="100%">');
            //API:获取店家信息
            getQPayInfoShop();
        });

        $("#viewShopPayMain").on("pageshow", function (event, ui) {

        });

        $("#viewShopPayMain").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //店家结帐
        $('.shop-pay').on('click', function () {
            checkWidgetPage('viewShopSelectUser', pageVisitedList);
        });

        //店家记录
        $('.shop-record').on('click', function () {
            checkWidgetPage('viewShopQueryRecord', pageVisitedList);
        });

        //退货申请
        $('.shop-return').on('click', function () {
            checkWidgetPage('viewPayShopReturnSearch', pageVisitedList);
        });

        //更改交易密码
        $('.shop-change').on('click', function () {
            //与User端共用同一个页面
            checkWidgetPage('viewUserChangePwd', pageVisitedList);
        });


    }
});