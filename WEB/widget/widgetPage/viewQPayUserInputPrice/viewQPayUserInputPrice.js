$("#viewQPayUserInputPrice").pagecontainer({
    create: function (event, ui) {

        var payNum = '',
            point_now;

        function initialAmountPage() {
            payNum = '';
            $('.user-pay-number').text('0');
            $('.user-pay-next').removeClass('button-active');
        }

        //获取选择的店家和余额
        function setShopAndPoint() {
            var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
            $('.user-pay-shop').text(shop_name);

            point_now = window.sessionStorage.getItem('user_point');
            $('.user-pay-total').text(point_now);
        }


        /********************************** page event ***********************************/
        $("#viewQPayUserInputPrice").on("pagebeforeshow", function (event, ui) {
            setShopAndPoint();
            var initialPage = window.sessionStorage.getItem('initialAmountPage');
            if(initialPage == 'Y') {
                initialAmountPage();
                window.sessionStorage.removeItem('initialAmountPage');
            }
        });

        $("#viewQPayUserInputPrice").one("pageshow", function (event, ui) {
            $('.user-pay-name').text(loginData['loginid']);
            $('.user-pay-no').text(loginData['emp_no']);
            setShopAndPoint();
        });

        $("#viewQPayUserInputPrice").on("pageshow", function (event, ui) {

        });

        $("#viewQPayUserInputPrice").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //模拟键盘
        $('.num-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');

        }).on('touchend', function () {
            $(this).removeClass('keydown-active');

        });

        //输入金额
        $('.num-keyboard[data-value]').on('tap', function (event) {
            event.preventDefault();

            var num = $(this).data('value');
            //判断第一次输入是否为0
            if (num !== 0 || payNum !== '') {

                if(payNum.length < point_now.length) {
                    payNum += num;
                    $('.user-pay-number').text(payNum);
                }
            }

            //'下一步'按钮可用
            if(payNum.length > 0) {
                $('.user-pay-next').addClass('button-active');
            }
        });

        //回删输入金额
        $('.user-pay-clear-one').on('tap', function (event) {
            event.preventDefault();

            if (payNum.length > 1) {
                payNum = payNum.substring(0, payNum.length - 1);
                $('.user-pay-number').text(payNum);
            } else {
                //初始化
                initialAmountPage();
            }
        });

        //清空所输金额
        $('.user-pay-clear-all').on('tap', function () {
            //初始化
            initialAmountPage();
        });

        //下一步
        $('.user-pay-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if(has) {
                //判断输入金额是否小于剩余金额
                if (Number(payNum) <= Number(point_now)) {
                    window.sessionStorage.setItem('trade_price', payNum);
                    checkWidgetPage('viewQPayUserInputPassword', pageVisitedList);
                } else {
                    //popup'您的余额不足喔'
                    popupMsgInit('.overBudgetMsg');
                }
            }
        });


    }
});