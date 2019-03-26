$("#viewQPayShopInputPrice").pagecontainer({
    create: function (event, ui) {

        var payNum = '',
            current_point,
            backToPage = 'viewQPayShopSearchUser';

        function initialPage() {
            payNum = '';
            $('.shop-input-number').text('0');
            $('.shop-input-next').removeClass('button-active');
        }

        //获取登录员工信息
        function getCurrentLoginEmp() {
            var login_id = window.sessionStorage.getItem('current_loginid');
            $('.shop-input-name').text(login_id);

            var emp_no = window.sessionStorage.getItem('current_emp');
            $('.shop-input-no').text(emp_no);

            current_point = window.sessionStorage.getItem('current_point');
            $('.shop-input-total').text(current_point);
        }

        //back key
        function onBackKeyDownSpecial() {
            $('#logoutUserAmount').popup('open');
        }


        /********************************** page event ***********************************/
        $("#viewQPayShopInputPrice").on("pagebeforeshow", function (event, ui) {
            getCurrentLoginEmp();
        });

        $("#viewQPayShopInputPrice").one("pageshow", function (event, ui) {
            var shop_name = JSON.parse(window.sessionStorage.getItem('shop_info'))['shop_name'];
            $('.shop-input-shop').text(shop_name);
            //getCurrentLoginEmp();
        });

        $("#viewQPayShopInputPrice").on("pageshow", function (event, ui) {
            //解除原本的事件监听
            document.removeEventListener("backbutton", onBackKeyDown, false);
            //监听本页自己的backkey logic
            document.addEventListener("backbutton", onBackKeyDownSpecial, false);
        });

        $("#viewQPayShopInputPrice").on("pagehide", function (event, ui) {
            initialPage();
            document.removeEventListener("backbutton", onBackKeyDownSpecial, false);
            document.addEventListener("backbutton", onBackKeyDown, false);
        });


        /********************************** dom event *************************************/
        //模拟键盘按下的动画效果
        $('.num-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');

        }).on('touchend', function () {
            $(this).removeClass('keydown-active');

        });

        //输入金额
        $('.num-keyboard[data-value]').on('touchstart', function () {
            var num = $(this).data('value');
            //判断第一次输入是否为0
            if (num !== 0 || payNum !== '') {

                if(payNum.length < current_point.length) {
                    payNum += num;
                    $('.shop-input-number').text(payNum);
                }
            }

            //'下一步'按钮可用
            if(payNum.length > 0) {
                $('.shop-input-next').addClass('button-active');
            }
        });

        //回删输入金额
        $('.shop-input-clear-one').on('touchstart', function () {
            if (payNum.length > 1) {
                payNum = payNum.substring(0, payNum.length - 1);
                $('.shop-input-number').text(payNum);

            } else {
                //初始化
                initialPage();
            }
        });

        //清空所输金额
        $('.shop-input-clear-all').on('touchstart', function () {
            //初始化
            initialPage();
        });

        //取消结帐提示
        $('.amount-cancel-pay').on('click', function () {
            $('#logoutUserAmount').popup('open');
        });

        //确定继续结帐
        $('#viewQPayShopInputPrice .btn-cancel').on('click', function () {
            $('#logoutUserAmount').popup('close');
        });

        //确定取消结帐
        $('#confirmLogoutUserAmount').on('click', function () {
            $('#logoutUserAmount').popup('close');
            var backPage = window.sessionStorage.getItem('viewQPayShopInputPrice_backTo');
            if(backPage == null) {
                window.sessionStorage.setItem('viewQPayShopInputPrice_backTo', backToPage);
            }
            onBackKeyDown();
        });

        //返回
        $('#viewQPayShopInputPrice .page-back-trigger').on('click', function () {
            $('#logoutUserAmount').popup('open');
        });

        //下一步
        $('.shop-input-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if(has) {
                //判断输入金额是否小于剩余金额
                if (Number(payNum) <= Number(current_point)) {
                    window.sessionStorage.setItem('trade_price', payNum);
                    checkWidgetPage('viewQPayShopInputPassword', pageVisitedList);
                } else {
                    //popup'您的余额不足喔'
                    popupMsgInit('.overBudgetMsg');
                }
            }
        });


    }
});