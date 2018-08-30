$("#viewUserPay").pagecontainer({
    create: function (event, ui) {

        var payNum = '';

        function initialPage() {
            payNum = '';
            $('.user-pay-number').text('0');
            $('.user-pay-next').removeClass('button-active');
        }

        /********************************** page event ***********************************/
        $("#viewUserPay").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserPay").on("pageshow", function (event, ui) {

        });

        $("#viewUserPay").on("pagehide", function (event, ui) {

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
                    $('.user-pay-number').text(payNum);

                } else {
                    //popup'您的余额不足喔'
                    popupMsgInit('.overBudgetMsg');
                }
            }

            //'下一步'按钮可用
            if(payNum.length > 0) {
                $('.user-pay-next').addClass('button-active');
            }

        })

        //回删输入金额
        $('.user-pay-clear-one').on('click', function () {
            if (payNum.length > 1) {
                payNum = payNum.substring(0, payNum.length - 1);
                $('.user-pay-number').text(payNum);
                
            } else {
                //初始化
                initialPage();
            }
        });

        //清空所输金额
        $('.user-pay-clear-all').on('click', function () {
            //初始化
            initialPage();
        });

        //下一步
        $('.user-pay-next').on('click', function () {
            var has = $(this).hasClass('button-active');
            if(has) {
                //判断输入金额是否小于剩余金额
                if (Number(payNum) < 10000) {
                    checkWidgetPage('viewUserPassword');
                } else {
                    //popup'您的余额不足喔'
                    popupMsgInit('.overBudgetMsg');
                }
            }
        });



    }
});