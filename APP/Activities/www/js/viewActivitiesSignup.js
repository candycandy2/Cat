
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

        $("#openList .activity-list").on("click", function() {
            $("#viewActivitiesSignup .menu").hide();
            $("#allActivities").hide();
            $("#viewActivitiesSignup .back-list").show();
            $("#activityDetail").show();
            $("#viewActivitiesSignup .page-footer").show();
        });

        $("#viewActivitiesSignup .back-list").on("click", function() {
            $("#viewActivitiesSignup .back-list").hide();
            $("#activityDetail").hide();
            $("#viewActivitiesSignup .page-footer").hide();
            $("#viewActivitiesSignup .menu").show();
            $("#allActivities").show();
        });
    }
});
