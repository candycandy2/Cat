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

        function fileSrvc() {
            return {
                download: download
            };
            var download = function(url, callback) {
                /* Get file extantion from URL*/
                var ext = url.split('.').pop();
                /* Generate file name */
                var fileInternal = new Date().getTime() + '.' + ext;
                /* Detect device */
                var iosDevice = navigator.userAgent.match(/(iPhone|iPod|iPad)/i);
                CordovaSrvc.ready.then(function() {
                    requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                        var fileTransfer = new FileTransfer();
                        var downloadPath;
                        /* Download path for iOS and android are different */
                        if (iosDevice !== null) {
                            downloadPath = fileSystem.root.toURL() + fileInternal;
                        } else {
                            downloadPath = cordova.file.externalDataDirectory + fileInternal;
                        }

                        fileTransfer.download(
                            url,
                            downloadPath,
                            function(file) {
                                callback(null, file.nativeURL);
                            },
                            function(error) {
                                callback(error);
                            },
                            true
                        );
                    }, function(error) {
                        callback(error);
                    });
                });
            };
        }

        /********************************** page event *************************************/
        $("#viewMain").on("pagebeforeshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $('#viewMain').keypress(function(event) {

        });

        $("#openPDF").on('click', function() {
            /*var fileName = files[0];
            url = buildAssetsUrl(fileName);
            //PluginName: cordova-plugin-document-viewer
            cordova.plugins.SitewaertsDocumentViewer.viewDocument(url, mimeType, options, "", "", onMissingApp, onError);
            */
            //PluginName: cordova-plugin-file-opener2
            /*cordova.plugins.fileOpener2.open(
                url, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
                mimeType, 
                { 
                    error : function(e) { 
                        console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                    },
                    success : function () {
                        console.log('file opened successfully');                
                    }
                }
            );*/
            fileSrvc.download(encodeURI('https://www.ib.gov.tw/websitedowndoc?file=chib/201412250001.pdf&filedisplay=201412250001.pdf'), function(err, nativeURL){
             /* open file here.. we get nativeURL to open*/
            });
        });
    }
});
