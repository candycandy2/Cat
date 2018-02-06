
$("#viewSelectFamily").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var checkboxImgSrcN = "img/checkbox_n.png";
        var checkboxImgSrcY = "img/checkbox_s.png";
        var expandImgSrcN = "img/list_down.png";
        var expandImgSrcY = "img/list_up.png";

        /********************************** function *************************************/
        window.APIRequest = function () {

            var self = this;

            this.successCallback = function (data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };


        /********************************** page event *************************************/
        $("#viewSelectFamily").on("pagebeforeshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewSelectFamily").keypress(function (event) {

        });

        //返回眷屬報名或報名管理
        $("#viewSelectFamily .back-select").on("click", function() {
            changePageByPanel("viewActivitiesSignup", false);
        });

        //展開眷屬資料-img
        $(".select-family-tbody").on("click", ".family-expand-img", function() {
            var self = $(this);
            var src = $(this).attr("src");
            var parentNode = $(this).parent().parent();

            if(src == "img/list_down.png") {
                self.attr("src", "img/list_up.png");
                parentNode.next().show();
            } else {
                self.attr("src", "img/list_down.png");
                parentNode.next().hide();
            }
        });

        //選擇眷屬-checkbox
        $(".select-family-tbody").on("click", ".family-checkbox-img", function() {
            var self = $(this);
            var src = $(this).attr("src");

            if(src == "img/checkbox_n.png") {
                self.attr("src", "img/checkbox_s.png");
            } else {
                self.attr("src", "img/checkbox_n.png");
            }
        });
    }
});
