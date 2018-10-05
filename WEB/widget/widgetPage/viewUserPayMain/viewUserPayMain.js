$("#viewUserPayMain").pagecontainer({
    create: function (event, ui) {


        //获取用户信息
        function getQPayInfoEmp() {
            var self = this;

            this.successCallback = function (data) {
                console.log(data);

                if(data['result_code'] == '1') {
                    //1. 消费券余额
                    var point_now = data['content'].point_now;
                    $('.remain-money').text(point_now);
                    window.sessionStorage.setItem('user_point', point_now);
                    window.sessionStorage.setItem('user_point_dirty', 'N');

                    //2. shop_list
                    var shop_list = data['content'].shop_list;
                    window.sessionStorage.setItem('shop_list', JSON.stringify(shop_list));
                }
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getQPayInfoEmp", self.successCallback, self.failCallback, null, null, "low", 30000, true);
            }();
        }

        //获取到期日
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
                window.sessionStorage.setItem('user_point_dirty', 'N');
            }
        });

        $("#viewUserPayMain").one("pageshow", function (event, ui) {
            var dueDay = getDueDay();
            $('.due-day').text(dueDay);
            $('.user-main-name').text(loginData['loginid']);
            $('.user-main-no').text(loginData['emp_no']);
            //API
            getQPayInfoEmp();
        });

        $("#viewUserPayMain").on("pageshow", function (event, ui) {
            var changePwd = window.sessionStorage.getItem('userChangePwdSuccess');
            if(changePwd == 'Y') {
                $("#userChangeSuccess").fadeIn(100).delay(2000).fadeOut(100);
                window.sessionStorage.removeItem('userChangePwdSuccess');
            }
        });

        $("#viewUserPayMain").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //前往结账，跳转选择店家
        $('.user-main-pay').on('click', function () {
            checkWidgetPage('viewUserSelectShop', pageVisitedList);
        });

        //跳转交易记录
        $('.record-link').on('click', function () {
            //暂时不要查询条件，show全年所有记录
            //checkWidgetPage('viewUserQueryRecord', pageVisitedList);
            checkWidgetPage('viewUserRecordList', pageVisitedList);
        });

        //跳转更改密码
        $('.password-link').on('click', function () {
            checkWidgetPage('viewUserChangePwd', pageVisitedList);
        });


    }
});