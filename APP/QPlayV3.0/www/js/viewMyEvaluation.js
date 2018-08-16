$("#viewMyEvaluation").pagecontainer({
    create: function (event, ui) {


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
            //language
            $('#viewMyEvaluation .ui-title div').text(langStr['str_086']).removeClass('opacity');
            $('.comment-title').text(langStr['str_087']);
            $('.send-comment').text(langStr['str_085']);
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
            //console.log('focus');
        });

        $('.comment-text textarea').on('blur', function () {
            //console.log('blur');
        });

    }
});