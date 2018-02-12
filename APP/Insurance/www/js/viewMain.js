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

        function openInAppBrowser(href){
            event.preventDefault();
            cordova.InAppBrowser.open(href, '_system', 'location=yes');
        }

        /*function  onErrorCreateFile(error){
            console.log("文件创建失败！")
        }
 
        //FileSystem加载失败回调
        function  onErrorLoadFs(error){
          console.log("文件系统加载失败！")
        }

        function writeFile(fileEntry, dataObj) {
            fileEntry.createWriter(function (fileWriter) {
                fileWriter.onwriteend = function() {
                    console.log("Successful file read...");
                };
                fileWriter.onerror = function (e) {
                    console.log("Failed file read: " + e.toString());
                };
                fileWriter.write(dataObj);
            });
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

        //$("#openPDF").on('click', function() {
            /*var fileName = files[0];
            url = buildAssetsUrl(fileName);
            if (device.platform === "iOS") {
                //PluginName: cordova-plugin-document-viewer
                cordova.plugins.SitewaertsDocumentViewer.viewDocument(url, mimeType, options, "", "", onMissingApp, onError);
            }else {
                var downloadPath;
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                    console.log('file system open: ' + fs.name);
                    
                    fs.root.getFile("InsuranceRights.pdf", { create: true, exclusive: false }, function (fileEntry) {

                        console.log("fileEntry is file?" + fileEntry.isFile.toString());
                        console.log("fileEntry is :" +fileEntry);
                        writeFile(fileEntry, null);
                        console.log("fileEntry.toURL is :" +fileEntry.toURL());
                        console.log("fileEntry..fullPath is :" +fileEntry.fullPath);
                        downloadPath = fileEntry.toURL();

                    }, onErrorCreateFile);
                }, onErrorLoadFs);*/
               // window.open(encodeURI("http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf"), '_system');
            //}           
            //PluginName: cordova-plugin-file-opener2
            /*
            url = '/InsuranceRights.pdf';
            cordova.plugins.fileOpener2.open(
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
            );
            //PluginName: cordova-plugin-file-transfer to download file
            /*fileSrvc.download(encodeURI('http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf'), function(err, nativeURL){
            });
            */
            //fileDownload('http://qplaydev.benq.com/qplay/public/file/InsuranceRights.pdf');
            
        //});
    }
});
