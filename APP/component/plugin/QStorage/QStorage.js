
//Plugin - QStorage
//--need cordova-plugin-file-transfer
var QStorage = {
    appKey: "qstorage",
    getSignature: function(action, signatureTime) {
        if (action === "getTime") {
            return Math.round(new Date().getTime() / 1000);
        } else {
            var hash = CryptoJS.HmacSHA256(signatureTime.toString(), QStorage.appSecretKey);
            return CryptoJS.enc.Base64.stringify(hash);
        }
    },
    UploadAPI: function(fileURL, callback) {

        var success = function (responseData) {
            console.log("Code = " + responseData.responseCode);
            console.log("Response = " + responseData.response);
            console.log("Sent = " + responseData.bytesSent);
            console.log(responseData.response);
            console.log(JSON.parse(responseData.response));
            

            var resultData = JSON.parse(responseData.response);
            console.log(resultData["ResultCode"]);

            if (resultData["ResultCode"] === "1") {
                callback(resultData["Content"]);
            }
        }

        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }

        var options = new FileUploadOptions();
        options.fileKey = "files";
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        console.log(options.fileName);

        if (options.fileName.indexOf("?") != -1) {
            var tempArray = options.fileName.split("?");
            options.fileName = tempArray[0];
        }
        console.log(options.fileName);

        //default: "image/jpeg", it depends on setting in camera.js
        if (options.fileName.indexOf("png") != -1) {
            options.mimeType = "image/png";
        }

        //Header
        var headers = {
            "App-Key": "qforum", 
            "Signature-Time": "1514181776",
            "Signature": "WuXF9mc2A4Uqk+wlfCiql0o36nw7BW+Kt0depX+WmyY=",
            "Account": loginData["loginid"]
        };

        options.headers = headers;

        //POST parameter
        var params = {
            /*
            "value1": "test",
            "value2": "param"
            */
        };

        options.params = params;

        //Do Upload to QPlay Server
        var ft = new FileTransfer();
        ft.upload(fileURL, encodeURI(serverURL + "/qstorage/public/v101/picture/upload?lang=" + browserLanguage + "&uuid=" + loginData.uuid), 
        success, fail, options);

    },
    API: {
        upload: function() {

        }
    }
};
