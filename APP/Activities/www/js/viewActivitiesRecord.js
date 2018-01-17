

$("#viewActivitiesRecord").pagecontainer({
    create: function(event, ui) {
        //page init
        window.APIddd = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "Activities_List", self.successCallback, self.failCallback, activitiesListQueryData, "");
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

        $(".record-delete").on("click", function() {
            var selfParent = $(this).parent().parent();
            if(selfParent.next().attr("class") == "record-line") {
                selfParent.next().remove();
            }
            selfParent.remove();
        });
    }
});
