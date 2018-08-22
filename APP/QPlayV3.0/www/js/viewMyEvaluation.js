$("#viewMyEvaluation").pagecontainer({
    create: function (event, ui) {

        var focusHeight,
            blurHeight,
            dValue;

        function addAppEvaluation() {
            var self = this;
            var queryStr = "&app_key=" + qplayAppKey + "&device_type=" + loginData.deviceType.toLocaleLowerCase();
            var commentContent = $.trim($('.comment-text textarea').val());
            var evaluationData = JSON.stringify({
                'score': '0',
                'comment': commentContent
            });

            this.successCallback = function (data) {
                console.log(data);

                if (data['result_code'] == '1') {
                    //changepage
                    $.mobile.changePage('#viewAppSetting');
                    $("#feedback").fadeIn(100).delay(2000).fadeOut(100);

                    //clear
                    $('.comment-text textarea').val('');
                    $('.send-comment').removeClass('enabled-btn');
                }

            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPI("POST", "addAppEvaluation", self.successCallback, self.failCallback, evaluationData, queryStr);
            }();
        }

        /********************************** page event ***********************************/
        $("#viewMyEvaluation").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewMyEvaluation").one("pageshow", function (event, ui) {
            blurHeight = document.body.clientHeight;
        });

        $("#viewMyEvaluation").on("pageshow", function (event, ui) {

        });

        $("#viewMyEvaluation").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $('.comment-text textarea').on('keyup', function () {
            var val = $.trim($(this).val());
            var has = $('.send-comment').hasClass('enabled-btn');

            if (val != '' && !has) {
                $('.send-comment').addClass('enabled-btn');
            } else if (val == '' && has) {
                $('.send-comment').removeClass('enabled-btn');
            }
        });

        $('.comment-text textarea').on('change', function () {
            var val = $.trim($(this).val());
            var has = $('.send-comment').hasClass('enabled-btn');

            if (val != '' && !has) {
                $('.send-comment').addClass('enabled-btn');
            } else if (val == '' && has) {
                $('.send-comment').removeClass('enabled-btn');
            }
        });

        //送出评论
        $('.send-comment').on('click', function () {
            var has = $(this).hasClass('enabled-btn');
            $('.comment-text textarea').blur();

            if (has) {
                addAppEvaluation();
            }
        });

        //ios input 页面滚动
        $('.comment-text textarea').on('focus', function () {
            if (device.platform === "iOS") {
                var mainHeight = $('.comment-main').height();
                $('.comment-main').css('height', (mainHeight - dValue).toString() + 'px');

                var textareaHeight = $('.comment-text').height();
                $('.comment-text').css('height', (textareaHeight - dValue).toString() + 'px');
            }

        });

        $('.comment-text textarea').on('blur', function () {
            if (device.platform === "iOS") {
                var mainHeight = $('.comment-main').height();
                $('.comment-main').css('height', (mainHeight + dValue).toString() + 'px');

                var textareaHeight = $('.comment-text').height();
                $('.comment-text').css('height', (textareaHeight + dValue).toString() + 'px');
            }
        });

        $(window).resize(function () {
            var current = document.body.clientHeight;

            if (current < blurHeight) {
                focusHeight = current;
                dValue = blurHeight - focusHeight;
            }

        });

    }
});