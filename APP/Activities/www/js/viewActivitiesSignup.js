
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

        /********************************** page event *************************************/
        $("#viewActivitiesSignup").on("pagebeforeshow", function(event, ui) {
            
        });

        /********************************** dom event *************************************/
        $("#viewActivitiesSignup").keypress(function(event) {

        });

        //點擊活動列表，跳轉到詳情頁
        $("#openList .activity-list").on("click", function() {
            var num = $(this).attr("data-no");
            changePageByPanel("viewActivitiesDetail", true);
            if(num == "1") {
                $(".detail-header-after").hide();
                $("#teamToManage").hide();
                $("#teamToSignup").show();
            } else if(num == "2") {
                $("#teamToSignup").hide();
                $(".detail-header-after").show();
                $("#teamToManage").show();
            }
        });

        //從編輯也返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function() {
            changePageByPanel("viewActivitiesDetail", false);
        });
    }
});
