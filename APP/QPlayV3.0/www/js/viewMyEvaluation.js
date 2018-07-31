$("#viewMyEvaluation").pagecontainer({
    create: function (event, ui) {

        var commentContent = '';

        function addAppEvaluation() {
            var self = this;
            var queryStr = "&app_key=" + qplayAppKey + "&device_type=" + loginData.deviceType.toLocaleLowerCase();
            var evaluationData = {
                'score': '0',
                'comment': commentContent
            };

            this.successCallback = function (data) {
                console.log(data);

                if(data['result_code'] == '1') {
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
                QPlayAPI("POST", "addAppEvaluation", self.successCallback, self.failCallback, JSON.stringify(evaluationData), queryStr);
            }();
        }

        /********************************** page event ***********************************/
        $("#viewMyEvaluation").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewMyEvaluation").one("pageshow", function (event, ui) {
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
            commentContent = $.trim($(this).val());
            if(commentContent != '' && !$('.send-comment').hasClass('enabled-btn')) {
                $('.send-comment').addClass('enabled-btn');
            } else if(commentContent == '' && $('.send-comment').hasClass('enabled-btn')) {
                $('.send-comment').removeClass('enabled-btn');
            }
        });


        $('.send-comment').on('click', function () {
            $('.comment-text textarea').blur();
            commentContent = $.trim($('.comment-text textarea').val());
            if ($(this).hasClass('enabled-btn') && commentContent != '') {
                addAppEvaluation();
            }
        });

    }
});