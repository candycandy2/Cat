
$("#viewActivitiesDetail").pagecontainer({
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
        $("#viewActivitiesDetail").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewActivitiesDetail").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesDetail").keypress(function(event) {

        });

        //從詳情頁返回列表
        $("#viewActivitiesDetail .back-list").on("click", function() {
            pageVisitedList.pop();
            changePageByPanel("viewActivitiesSignup", false);
        });

        //點擊 "開始報名" 跳轉到編輯頁
        $(".team-to-signup").on("click", function() {
            changePageByPanel("viewSignupManage", true);
            $("#viewTeamManage").hide();
            $("#viewTeamSignup").show();
        });

        //點擊 "報名管理" 跳轉到編輯頁
        $(".team-to-manage").on("click", function() {
            changePageByPanel("viewSignupManage", true);
            $("#viewTeamSignup").hide();
            $("#viewTeamManage").show();
        });





    }
});
