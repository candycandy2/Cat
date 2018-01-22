
$("#viewActivitiesManage").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        //報名管理
        window.ActivitiesSignupManageQuery = function (mode) {

            this.successCallback = function (data) {
                console.log(data);

                if (data["ResultCode"] == "1") {
                    if (model == "1") {

                    } else if (model == "3") {

                    } else if (model == "4") {

                    } else if (model == "5") {

                    }
                }


                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Manage", self.successCallback, self.failCallback, activitiesSignupManageQueryData, "");
            }();

        };

        //取消報名
        window.ActivitiesSignupCancelQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data["ResultCode"] == "045913") {

                    
                    ActivitiesRecordQuery();
                } else if (data["ResultCode"] == "045914") {
                    //報名取消失敗

                }



                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Cancel", self.successCallback, self.failCallback, activitiesSignupCancelQueryData, "");
            }();

        };



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
        $("#viewActivitiesManage").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewActivitiesManage").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesManage").keypress(function (event) {

        });

        //從管理頁返回詳情頁
        $("#viewActivitiesManage .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });

        //展開隊伍
        $(".list-img").on("click", function () {
            var imgSrc = $(this).attr("src").split("/")[1];
            if (imgSrc == "list_down.png") {
                $(this).attr("src", "img/list_up.png");
                $(this).parent().parent().css("border-bottom", "0");
                $(this).parent().parent().next().css("border-bottom", "1px solid #f6f6f6");
                $(this).parent().parent().next().show();
            } else {
                $(this).attr("src", "img/list_down.png");
                $(this).parent().parent().css("border-bottom", "1px solid #f6f6f6");
                $(this).parent().parent().next().css("border-bottom", "0");
                $(this).parent().parent().next().hide();
            }
        });
    }
});
