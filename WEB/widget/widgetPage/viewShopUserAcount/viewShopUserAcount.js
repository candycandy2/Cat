$("#viewShopUserAcount").pagecontainer({
    create: function (event, ui) {


        function getDueDay() {
            var year = new Date().getFullYear().toString();
            return new Date(year + '/12/31').toLocaleDateString(browserLanguage, { year: 'numeric', month: 'long', day: 'numeric' })
        }

        /********************************** page event ***********************************/
        $("#viewShopUserAcount").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopUserAcount").one("pageshow", function (event, ui) {
            var dueDay = getDueDay();
            $('.acount-due-day').text(dueDay);
            $('.user-acount-name').text(loginData['loginid']);
            $('.user-acount-no').text(loginData['emp_no']);
        });

        $("#viewShopUserAcount").on("pageshow", function (event, ui) {

        });

        $("#viewShopUserAcount").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        //前往结账
        $('.user-acount-pay').on('click', function () {
            checkWidgetPage('viewShopInputAmount');
        });

        //取消结帐popup提示
        $('.shop-cancel-pay').on('click', function () {
            $('#logoutUserAcount').popup('open');
        });

        //确定继续结帐
        $('#viewShopUserAcount .btn-cancel').on('click', function () {
            $('#logoutUserAcount').popup('close');
        });

        //确定取消结帐
        $('#confirmLogoutUserAcount').on('click', function () {
            $('#logoutUserAcount').popup('close');
            onBackKeyDown();
        });

    }
});