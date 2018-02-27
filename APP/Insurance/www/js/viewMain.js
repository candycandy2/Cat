var files = ["InsuranceRights.pdf"];
var url = "";
var mimeType = "application/pdf";
var options = {};
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

        //cordova-plugin-android-fingerprint-auth
        /*function successCallback(result) {
            console.log("successCallback(): " + JSON.stringify(result));
            if (result.withFingerprint) {
                console.log("Successfully encrypted credentials.");
                console.log("Encrypted credentials: " + result.token);  
            } else if (result.withBackup) {
                console.log("Authenticated with backup password");
            }
        }

        function errorCallback(error) {
            if (error === FingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                console.log("FingerprintAuth Dialog Cancelled!");
            } else {
                console.log("FingerprintAuth Error: " + error);
            }
        }*/
        /*function successCallback(){
            alert("Authentication successfull");
        }

        function errorCallback(err){
            alert("Authentication invalid " + err);
        }*/

        /*
        function isAvailableSuccess(result) {
            alert("Fingerprint available");
            window.Fingerprint.show({
              clientId: "Fingerprint-Demo",
              clientSecret: "password"
            }, successCallback, errorCallback);        
        }
     
        function isAvailableError(message) {
          alert(message);
        }*/

        /*function buildAssetsUrl(fileName)
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
        }*/

        /*function fileDownload(url) {
            var ext = url.split('.').pop();
            var fileInternal = new Date().getTime() + '.' + ext;
            var fileTransfer = new FileTransfer();
            var downloadPath;
            var iosDevice = navigator.userAgent.match(/(iPhone|iPod|iPad)/i);

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
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("download error code" + error.code);
                    //callback(error);
                }
            );

        }*/

        /********************************** page event *************************************/
        $("#viewMain").on("pagebeforeshow", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $('#viewMain').keypress(function(event) {

        });

        $("#QRCamera").on('click', function() {    
            $.mobile.changePage('#viewQRScanner'); 
        });    
   
        $("#QRCode").on('click', function() {  
            $.mobile.changePage('#viewQRCodeCreate');  
        });

        $("#Fingerprint").on('click', function() {
            //$.mobile.changePage('#viewFingerprint');
            if (device.platform === "iOS") {
                window.plugins.touchid.isAvailable(
                    function() {
                        //alert('Available!')
                        window.plugins.touchid.verifyFingerprint(
                            'Please scan your fingerprint', // this will be shown in the native scanner popup
                            function(msg) {
                                alert('ok: ' + msg);
                            }, // success handler: fingerprint accepted
                            function(msg) {
                                alert('Something is wrong: ' + JSON.stringify(msg));
                            } // error handler with errorcode and localised reason
                        );
                    }, // success handler: TouchID available
                    function(msg) {
                        alert('TouchID is not available.')
                    } // error handler: no TouchID available
                );
            }else {
                /*//cordova-plugin-fingerprint-aio
                Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);*/
                /*//cordova-plugin-android-fingerprint-auth
                FingerprintAuth.encrypt(encryptConfig, successCallback, errorCallback);*/
                /*//cordova-keyguard-plugin
                navigator.keyguard = true; 
                window.addEventListener('keyguard', function (state) {                   
                    alert('State:'+ state);
                });*/
                /*
                //cordova-plugin-screen-locker
                window.screenLocker.unlock(successCallback, errorCallback, 0);
                */
            }
        });

        $("#openPDF").on('click', function() {
            window.open(encodeURI("http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf"), '_system');
            /*var fileName = files[0];
            url = buildAssetsUrl(fileName);
            if (device.platform === "iOS") {
                //PluginName: cordova-plugin-document-viewer
                cordova.plugins.SitewaertsDocumentViewer.viewDocument(url, mimeType, options, "", "", onMissingApp, onError);
            }else {
                window.open(encodeURI("http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf"), '_system');
            //}           
            //PluginName: cordova-plugin-file-transfer to download file
            /*fileSrvc.download(encodeURI('http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf'), function(err, nativeURL){
            });
            */
            //fileDownload('http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf');
            
        });
    }
});
