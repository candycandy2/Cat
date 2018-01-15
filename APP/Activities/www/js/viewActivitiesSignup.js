
$("#viewActivitiesSignup").pagecontainer({
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

            $.each($("#viewActivitiesSignup .page-main > div"), function(index, item) {
                if($(item).attr("id") == viewID) {
                    $(item).removeClass("view-hide").addClass("view-show");
                } else {
                    $(item).removeClass("view-show").addClass("view-hide");
                }
            });
        }

        /********************************** page event *************************************/
        $("#viewActivitiesSignup").on("pagebeforeshow", function(event, ui) {
            showViewByModel();
        });

        $("#viewActivitiesSignup").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesSignup").keypress(function(event) {

        });

        //從報名頁返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function() {
            changePageByPanel("viewActivitiesDetail", false);
        });

    }
});
