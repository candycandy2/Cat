
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

        $("#viewMyFamilyDatum").on("pageshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewMyFamilyDatum").keypress(function(event) {

        });

        $("#saveFamily").on("click", function(e) {
            e.preventDefault();
        });

        $(".family-delete").on("click", function() {
            var selfParent = $(this).parent().parent();
            if(selfParent.next().attr("class") == "activity-line") {
                selfParent.next().remove();
            }
            selfParent.remove();
        });

        $(".family-add-img").on("click", function() {
            $("#viewMyFamilyDatum .menu").hide();
            $("#viewFamilyList").hide();
            $(".family-add-img").hide();
            $("#viewMyFamilyDatum .back-family").show();
            $("#viewFamilyEdit").show();
        });

        $(".family-edit").on("click", function() {
            $("#viewMyFamilyDatum .menu").hide();
            $("#viewFamilyList").hide();
            $(".family-add-img").hide();
            $("#viewMyFamilyDatum .back-family").show();
            $("#viewFamilyEdit").show();
        });

        $("#viewMyFamilyDatum .back-family").on("click", function() {
            $("#viewMyFamilyDatum .back-family").hide();
            $("#viewFamilyEdit").hide();
            $("#viewMyFamilyDatum .menu").show();
            $("#viewFamilyList").show();
            $(".family-add-img").show();
        });
    }
});
