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
                    checkAppPage('#viewAppSetting');
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
            
        });

        $("#viewMyEvaluation").on("pageshow", function (event, ui) {

        });

        $("#viewMyEvaluation").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        //监听textarea，按钮可不可用
        $('.comment-text textarea').on('input', function () {
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

        

    }
});