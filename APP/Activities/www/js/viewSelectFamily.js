
$("#viewSelectFamily").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var familyFieldArr = [];

        /********************************** function *************************************/
        window.ActivitiesSignupFamilyQuery = function (arr) {

            this.successCallback = function (data) {
                //console.log(data);
                familyFieldArr = arr;
                console.log(familyFieldArr);

                if(data["ResultCode"] == "1") {
                    



                }


                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Family", self.successCallback, self.failCallback, activitiesSignupFamilyQueryData, "");
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
        $("#viewSelectFamily").on("pagebeforeshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewSelectFamily").keypress(function (event) {

        });

        $("#viewSelectFamily .back-select").on("click", function() {
            changePageByPanel("viewActivitiesSignup", false);
        });
    }
});
