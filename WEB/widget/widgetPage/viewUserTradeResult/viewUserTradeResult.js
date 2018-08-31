$("#viewUserTradeResult").pagecontainer({
    create: function (event, ui) {

        function initialPage() {

        }

        /********************************** page event ***********************************/
        $("#viewUserTradeResult").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserTradeResult").on("pageshow", function (event, ui) {

        });

        $("#viewUserTradeResult").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //返回
        $('.user-trade-back').on('click', function () {
            //checkAppPage('viewMain3');
            //交易结果返回需要特殊处理，不会返回前一页，而是返回viewMain3
            //main -> pay -> select -> amount -> pwd -> result
            //所以从后往前找，找到viewMain3后记录index
            var index = 0;
            for (var i = pageVisitedList.length - 1; i > -1; i--) {
                if (pageVisitedList[i] == 'viewMain3') {
                    index = i;
                }
            }

            var arr = [];
            for (var i = 0; i < index + 2; i++) {
                arr.push(pageVisitedList[i]);
            }
            pageVisitedList = arr;

            //执行back逻辑
            onBackKeyDown();
        });

    }
});