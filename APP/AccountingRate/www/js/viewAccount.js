
$("#viewAccount").pagecontainer({
    create: function(event, ui) {
        
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
        $("#viewAccount").on("pagebeforeshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $('#viewAccount').keypress(function(event) {

        });

    }
});
