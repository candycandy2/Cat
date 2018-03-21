var files = ["InsuranceRights.pdf"];
var url = "";
var mimeType = "application/pdf";
var options = {};
var encryptConfig = {
    clientId: "myAppName",
    username: "currentUser",
    password: "currentUserPassword"
};
var x;

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

        });

        /********************************** dom event *************************************/

        $("#openPDF").on('click', function() {
            window.open(encodeURI("http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf"), '_system');          
        });       

    }
});
