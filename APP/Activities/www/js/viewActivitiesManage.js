
$("#viewActivitiesManage").pagecontainer({
    create: function (event, ui) {
        //page init
        /********************************** function *************************************/
        //取消報名
        window.ActivitiesSignupCancelQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data["ResultCode"] == "045913") {

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

        //根據不同活動類型，顯示不同頁面
        function showViewByModel() {
            var viewModel;
            if (actModel == 1) {
                viewModel = "Person";
            } else if (actModel == 3) {
                viewModel = "Family";
            } else if (actModel == 4) {
                viewModel = "Team";
            } else if (actModel == 5) {
                viewModel = "Time";
            }

            var viewHtml;
            if (isSignup) {
                viewHtml = "Manage";
            } else {
                viewHtml = "Signup"
            }

            var viewID = "view" + viewModel + viewHtml;

            $.each($("#viewActivitiesManage .page-main > div"), function (index, item) {
                if ($(item).attr("id") == viewID) {
                    $(item).removeClass("view-hide").addClass("view-show");
                } else {
                    $(item).removeClass("view-show").addClass("view-hide");
                }
            });
        }

        /********************************** page event *************************************/
        $("#viewActivitiesManage").on("pagebeforeshow", function (event, ui) {
            showViewByModel();
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
