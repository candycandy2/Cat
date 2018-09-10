$("#viewShopInputAmount").pagecontainer({
    create: function (event, ui) {

        var payNum = '';

        function initialPage() {
            payNum = '';
            $('.shop-input-number').text('0');
            $('.shop-input-next').removeClass('button-active');
        }

        /********************************** page event ***********************************/
        $("#viewShopInputAmount").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewShopInputAmount").one("pageshow", function (event, ui) {
            $('.shop-input-name').text(loginData['loginid']);
            $('.shop-input-no').text(loginData['emp_no']);
        });

        $("#viewShopInputAmount").on("pageshow", function (event, ui) {
            
        });

        $("#viewShopInputAmount").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        //模拟键盘按下的动画效果
        $('.num-keyboard').on('touchstart', function () {
            $(this).addClass('keydown-active');
        });

        $('.num-keyboard').on('touchend', function () {
            $(this).removeClass('keydown-active');
        });

        //输入金额
        $('.num-keyboard[data-value]').on('click', function () {
            var num = $(this).attr('data-value');
            //判断第一次输入是否为0
            if (num !== '0' || payNum !== '') {

                //判断输入金额是否小于剩余金额
                if (Number(payNum) < 10000) {
                    payNum += num;
                    $('.shop-input-number').text(payNum);

                } else {
                    //popup'您的余额不足喔'
                    popupMsgInit('.overBudgetMsg');
                }
            }

            //'下一步'按钮可用
            if(payNum.length > 0) {
                $('.shop-input-next').addClass('button-active');
            }

        })

        //回删输入金额
        $('.shop-input-clear-one').on('click', function () {
            if (payNum.length > 1) {
                payNum = payNum.substring(0, payNum.length - 1);
                $('.shop-input-number').text(payNum);
                
            } else {
                //初始化
                initialPage();
            }
        });

        //清空所输金额
        $('.shop-input-clear-all').on('click', function () {
            //初始化
            initialPage();
        });

        //取消结帐提示
        $('.amount-cancel-pay').on('click', function () {
            $('#logoutUserAmount').popup('open');
        });

        //确定继续结帐
        $('#viewShopInputAmount .btn-cancel').on('click', function () {
            $('#logoutUserAmount').popup('close');
        });

        //确定取消结帐
        $('#confirmLogoutUserAmount').on('click', function () {
            $('#logoutUserAmount').popup('close');
            //select -> amount -> pwd
            //所以从后往前找，找到select后记录index
            var index = 0;
            for (var i = pageVisitedList.length - 1; i > -1; i--) {
                if (pageVisitedList[i] == 'viewShopSelectUser') {
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

        //下一步
        $('.shop-input-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if(has) {
                //判断输入金额是否小于剩余金额
                if (Number(payNum) < 10000) {
                    checkWidgetPage('viewShopInputPwd');
                } else {
                    //popup'您的余额不足喔'
                    popupMsgInit('.overBudgetMsg');
                }
            }
        });



    }
});