$("#viewShopUserAccount").pagecontainer({
    create: function (event, ui) {


        //获取登录员工信息
        function getCurrentLoginEmp() {
            var login_id = window.sessionStorage.getItem('current_loginid');
            $('.user-acount-name').text(login_id);

            var emp_no = window.sessionStorage.getItem('current_emp');
            $('.user-acount-no').text(emp_no);

            var current_point = window.sessionStorage.getItem('current_point');
            $('.remain-money').text(current_point);
        }

        //获取到期日
        function getDueDay() {
            var year = new Date().getFullYear().toString();
            return new Date(year + '/12/31').toLocaleDateString(browserLanguage, { year: 'numeric', month: 'long', day: 'numeric' })
        }

        //back key
        function onBackKeyDownSpecial() {
            $('#logoutUserAcount').popup('open');
        }


        /********************************** page event ***********************************/
        $("#viewShopUserAccount").on("pagebeforeshow", function (event, ui) {
            getCurrentLoginEmp();
        });

        $("#viewShopUserAccount").one("pageshow", function (event, ui) {
            var dueDay = getDueDay();
            $('.acount-due-day').text(dueDay);
            getCurrentLoginEmp();
        });

        $("#viewShopUserAccount").on("pageshow", function (event, ui) {
            //解除原本的事件监听
            document.removeEventListener("backbutton", onBackKeyDown, false);
            //监听本页自己的backkey logic
            document.addEventListener("backbutton", onBackKeyDownSpecial, false);
        });

        $("#viewShopUserAccount").on("pagehide", function (event, ui) {
            document.removeEventListener("backbutton", onBackKeyDownSpecial, false);
            document.addEventListener("backbutton", onBackKeyDown, false);
        });


        /********************************** dom event *************************************/
        //前往结账
        $('.user-acount-pay').on('click', function () {
            checkWidgetPage('viewShopInputAmount', pageVisitedList);
        });

        //取消结帐popup提示
        $('.shop-cancel-pay').on('click', function () {
            $('#logoutUserAcount').popup('open');
        });

        //确定继续结帐
        $('#viewShopUserAccount .btn-cancel').on('click', function () {
            $('#logoutUserAcount').popup('close');
        });

        //确定取消结帐
        $('#confirmLogoutUserAcount').on('click', function () {
            $('#logoutUserAcount').popup('close');
            onBackKeyDown();
        });

        //返回
        $('#viewShopUserAccount .page-back-trigger').on('click', function () {
            $('#logoutUserAcount').popup('open');
        });


    }
});