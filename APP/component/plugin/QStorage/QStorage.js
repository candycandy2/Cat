
//Plugin - QStorage
//--need cordova-plugin-file-transfer
var QStorage = {
    appKey: "",
    appSecretKey: "",
    uploadImgDatas: [],
    initial: function() {

        /*
        //According to the Parent versionName, decide APPKey > [dev] / [test] / []
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            QStorage.appKey = "appqstoragetest";
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            QStorage.appKey = "appqstoragedev";
        } else {
            QStorage.appKey = "appqstorage";
        }

        QStorage.clearUploadDatas();
        */

        if (typeof QForum !== "undefined") {
            QStorage.appKey = QForum.appKey;
            QStorage.appSecretKey = QForum.appSecretKey;
        } else {
            QStorage.appKey = appKey;
            QStorage.appSecretKey = appSecretKey;
        }

    },
    clearUploadDatas: function() {
        QStorage.uploadImgDatas = [];
    },
    getUploadDatas: function() {
        return QStorage.uploadImgDatas;
    },
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
                QStorage.uploadImgDatas.push(resultData["Content"].thumbnail_1024_url);
            } else if (resultData["ResultCode"] === "997908") {
                //Data size over 10MB
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

        var signatureTime = QStorage.getSignature("getTime");
        var signatureInBase64 = QStorage.getSignature("getInBase64", signatureTime);

        //Header
        var headers = {
            "App-Key": QStorage.appKey,
            "Signature-Time": signatureTime,
            "Signature": signatureInBase64,
            "Account": loginData["emp_no"],
            "Resource-ID": QForum.boardID + "/" + QForum.postID
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
