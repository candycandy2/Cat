
$("#viewSignupManage").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        window.APIRequest = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };

        //根據不同活動類型，顯示不同頁面
        function showViewByModel() {
            var viewModel;
            if(actModel == 1) {
                viewModel = "Person";
            } else if(actModel == 3) {
                viewModel = "Family";
            } else if(actModel == 4) {
                viewModel = "Team";
            } else if(actModel == 5) {
                viewModel = "Time";
            }

            var viewHtml;
            if(isSignup) {
                viewHtml = "Manage";
            } else {
                viewHtml = "Signup"
            }

            var viewID = "view" + viewModel + viewHtml;

            $.each($("#viewSignupManage .page-main > div"), function(index, item) {
                if($(item).attr("id") == viewID) {
                    $(item).removeClass("view-hide").addClass("view-show");
                } else {
                    $(item).removeClass("view-show").addClass("view-hide");
                }
            });
        }

        /********************************** page event *************************************/
        $("#viewSignupManage").on("pagebeforeshow", function(event, ui) {
            showViewByModel();
        });

        $("#viewSignupManage").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewSignupManage").keypress(function(event) {

        });

        //從編輯頁返回詳情頁
        $("#viewSignupManage .back-detail").on("click", function() {
            changePageByPanel("viewActivitiesDetail", false);
        });

        // $("#departNo").on("focus", function() {
        //     $(".team-signup-footer").hide();
        // });

        // $("#departNo").on("blur", function() {
        //     $(".team-signup-footer").show();
        // });

        $(".list-img").on("click", function() {
            var imgSrc = $(this).attr("src").split("/")[1];
            if(imgSrc == "list_down.png") {
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
