
$("#viewMyFamilyDatum").pagecontainer({
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
        $("#viewMyFamilyDatum").on("pagebeforeshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewMyFamilyDatum").keypress(function(event) {

        });
    }
});
