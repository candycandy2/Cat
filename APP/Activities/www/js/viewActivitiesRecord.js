

$("#viewActivitiesRecord").pagecontainer({
    create: function(event, ui) {
        //page init
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
        $("#viewActivitiesRecord").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewActivitiesRecord").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesRecord").keypress(function(event) {

        });

        $(".delete-png").on("click", function() {
            var selfParent = $(this).parent().parent();
            if(selfParent.next().attr("class") == "record-line") {
                selfParent.next().remove();
            }
            selfParent.remove();
        });
    }
});
