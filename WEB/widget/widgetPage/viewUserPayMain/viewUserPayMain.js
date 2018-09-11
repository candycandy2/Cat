$("#viewUserPayMain").pagecontainer({
    create: function (event, ui) {



        function getUserQPayInfo() {
            var self = this;
            var queryStr = "&emp_type=emp";

            this.successCallback = function () {
                if(data['result_code'] == '1') {
                    //1. 消费券余额
                    var point_now = data['content'].point_now;
                    $('.remain-money').text(pointNow);
                    window.sessionStorage.setItem('user_point', pointNow);
                    window.sessionStorage.setItem('user_point_dirty', 'N');

                    //2. shop_list
                    var shop_list = data['content'].shop_list;
                    window.sessionStorage.setItem('shop_list', JSON.stringify(shop_list));
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("POST", "getQPayInfo", self.successCallback, self.failCallback, null, queryStr, "low", 30000, true);
            }();
        }

        function getDueDay() {
            var year = new Date().getFullYear().toString();
            return new Date(year + '/12/31').toLocaleDateString(browserLanguage, { year: 'numeric', month: 'long', day: 'numeric' })
        }

        /********************************** page event ***********************************/
        $("#viewUserPayMain").on("pagebeforeshow", function (event, ui) {
            var dirty = window.sessionStorage.getItem('user_point_dirty');
            if(dirty == 'Y') {
                //update余额
                var point_now =  window.sessionStorage.getItem('user_point');
                $('.remain-money').text(point_now);
            }
        });

        $("#viewUserPayMain").one("pageshow", function (event, ui) {
            var dueDay = getDueDay();
            $('.due-day').text(dueDay);
            $('.user-main-name').text(loginData['loginid']);
            $('.user-main-no').text(loginData['emp_no']);
            //Call API
            //getUserQPayInfo();
        });

        $("#viewUserPayMain").on("pageshow", function (event, ui) {

        });

        $("#viewUserPayMain").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        //前往结账，跳转选择店家
        $('.user-main-pay').on('click', function () {
            checkWidgetPage('viewUserSelectShop');
        });

        //跳转交易记录
        $('.record-link').on('click', function () {
            checkWidgetPage('viewUserQueryRecord');
        });

        //跳转更改密码
        $('.password-link').on('click', function () {
            checkWidgetPage('viewUserChangePwd');
        });


    }
});