var url = "file:///www/InsuranceRights.pdf";
var mimeType = "";
var options = {};
var linkHandlers = [
            {
                pattern: STRING, // string representation of a plain regexp (no flags)
                close: BOOLEAN, // shall the document be closed, after the link handler was executed?
                handler: function (link) {} // link handler to be executed when the user clicks on a link matching the pattern
            },
            {
                pattern: '^\/',
                close: false,
                handler: function (link) {
                    window.console.log('link clicked: ' + link);
                }
            }
];
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

        function onShow(){
          window.console.log('document shown');
        }

        function onClose(){
          window.console.log('document closed');
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
            cordova.plugins.SitewaertsDocumentViewer.viewDocument(url, mimeType, options, onShow, onClose, onMissingApp, onError, linkHandlers);
        });
    }
});
