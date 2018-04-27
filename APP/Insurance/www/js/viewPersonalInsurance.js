
$("#viewPersonalInsurance").pagecontainer({
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
        $("#viewPersonalInsurance").on("pagebeforeshow", function(event, ui) {
            $('#pageInsurStatus-1').show();
            $('#pageInsurStatus-2').hide();
            $("label[for=fam-insur-tab-2]").removeClass('ui-btn-active');
            $("label[for=fam-insur-tab-1]").addClass('ui-btn-active');
        });

        $("#viewPersonalInsurance").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $('#viewPersonalInsurance').change(function() {
            timeQueue = {};
            var tabValue = $("#viewPersonalInsurance :radio:checked").val();
            if (tabValue == 'fam-insur-tab-1') {
                $('#pageInsurStatus-1').show();
                $('#pageInsurStatus-2').hide();            
            } else {
                $('#pageInsurStatus-2').show();
                $('#pageInsurStatus-1').hide();
            }
        });  

    }
});
