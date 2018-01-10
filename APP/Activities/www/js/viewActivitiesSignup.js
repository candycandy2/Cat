
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
            changePageByPanel("viewActivitiesDetail", true);
        });

        //從編輯也返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function() {
            pageVisitedList.pop();
            changePageByPanel("viewActivitiesDetail", false);
        });
    }
});
