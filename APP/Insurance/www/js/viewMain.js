var files = ["InsuranceRights.pdf"];
var url = "";
var mimeType = "application/pdf";
var options = {};
var tab1ScrollHeight = false, tab2ScrollHeight = false, tab3ScrollHeight = false;
var encryptConfig = {
    clientId: "myAppName",
    username: "currentUser",
    password: "currentUserPassword"
};

$("#viewMain").pagecontainer({
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
        $("#viewMain").on("pagebeforeshow", function(event, ui) {
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            $("label[for=tab3]").removeClass('ui-btn-active');
            $("label[for=tab2]").removeClass('ui-btn-active');
            $("label[for=tab1]").addClass('ui-btn-active');
        });

        $("#viewMain").on("pageshow", function(event, ui) {  
            activePageListID = visitedPageList[visitedPageList.length - 1];   
            scrollClassName = 'insur-main-scroll';       
            if (!tab1ScrollHeight) {         
                scrollHeightByTab(activePageListID, scrollClassName, '2');
                $("#" + activePageListID + ">.page-header").css({
                    'position': 'fixed'
                });       
                tab1ScrollHeight = true;
            }
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $('#mainTab').change(function() {
            var tabValue = $("#mainTab :radio:checked").val();
            if (tabValue == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
            } else if (tabValue == 'tab2') {
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
                if (!tab2ScrollHeight) {  
                    scrollHeightByTab(activePageListID, scrollClassName, '3');
                    tab2ScrollHeight = true;
                }
            } else {
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
                if (!tab3ScrollHeight) {  
                    scrollHeightByTab(activePageListID, scrollClassName, '4');
                    tab3ScrollHeight = true;
                }
            }
        });

        $("#groupIndurancePDF").on('click', function() {
            var insurPDFUrl = serverURL + "/Insurance/GroupInsurance.pdf";
            window.open(encodeURI(insurPDFUrl), '_system');          
        });       

    }
});
