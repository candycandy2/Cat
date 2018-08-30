$("#viewUserPayMain").pagecontainer({
    create: function (event, ui) {


        function getDueDay() {
            var year = new Date().getFullYear().toString();
            return new Date(year + '/12/31').toLocaleDateString(browserLanguage, { year: 'numeric', month: 'long', day: 'numeric' })
        }

        /********************************** page event ***********************************/
        $("#viewUserPayMain").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserPayMain").one("pageshow", function (event, ui) {
            var dueDay = getDueDay();
            $('.due-day').text(dueDay);
            $('.user-main-name').text(loginData['loginid']);
            $('.user-main-no').text(loginData['emp_no']);
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