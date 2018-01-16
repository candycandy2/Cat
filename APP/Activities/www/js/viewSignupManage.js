
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

        /********************************** page event *************************************/
        $("#viewSignupManage").on("pagebeforeshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewSignupManage").keypress(function(event) {

        });

        //從詳情頁返回列表
        $("#viewSignupManage .back-detail").on("click", function() {
            pageVisitedList.pop();
            changePageByPanel("viewActivitiesDetail", false);
        });

        // $("#departNo").on("focus", function() {
        //     $(".team-signup-footer").hide();
        // });

        // $("#departNo").on("blur", function() {
        //     $(".team-signup-footer").show();
        // });
    }
});
