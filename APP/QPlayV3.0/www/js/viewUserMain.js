$("#viewUserMain").pagecontainer({
    create: function (event, ui) {


        function getDueDay() {
            var year = new Date().getFullYear().toString();
            return new Date(year + '/12/31').toLocaleDateString(browserLanguage, { year: 'numeric', month: 'long', day: 'numeric' })
        }

        /********************************** page event ***********************************/
        $("#viewUserMain").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserMain").one("pageshow", function (event, ui) {
            var dueDay = getDueDay();
            $('.due-day').text(dueDay);
        });

        $("#viewUserMain").on("pageshow", function (event, ui) {

        });

        $("#viewUserMain").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        //前往结账，跳转选择店家
        $('.user-main-pay').on('click', function () {
            checkAppPage('viewUserSelect');
        });

        //跳转交易记录
        $('.record-link').on('click', function () {
            checkAppPage('viewUserRecord');
        });



    }
});