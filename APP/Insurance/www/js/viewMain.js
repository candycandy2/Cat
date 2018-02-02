var files = ["InsuranceRights.pdf"];
var url = "";
var mimeType = "application/pdf";
var options = {};
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

        function buildAssetsUrl(fileName)
        {
            var baseUrl = location.href.replace("index.html#"+ $.mobile.activePage.attr('id'), "")
            return baseUrl + fileName;
        }

        function onMissingApp(appId, installer)
        {
            if(confirm("Do you want to install the free PDF Viewer App "+ appId + " for Android?"))
            {
                installer();
            }
        } 

        function onError(error){
          window.console.log(error);
          alert("Sorry! Cannot view document.");
        }

        /********************************** page event *************************************/
        $("#viewMain").on("pagebeforeshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $('#viewMain').keypress(function(event) {

        });

        $("#openPDF").on('click', function() {
            var fileName = files[0];
            url = buildAssetsUrl(fileName);
            // Methods in "" are onShow and onClose.
            cordova.plugins.SitewaertsDocumentViewer.viewDocument(url, mimeType, options, "", "", onMissingApp, onError);
        });
    }
});
