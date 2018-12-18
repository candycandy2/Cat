var QStoragePlugin = {

    appqplay: 'swexuc453refebraXecujeruBraqAc4e',
    appqforum: 'c40a5073000796596c2ba5e70579b1e6',
    env: appEnvironment,
    getSignature: function(action, signatureTime, secret) {
        if (action === "getTime") {
            return Math.round(new Date().getTime() / 1000);
        } else {
            var hash = CryptoJS.HmacSHA256(signatureTime.toString(), secret);
            return CryptoJS.enc.Base64.stringify(hash);
        }
    },
    QStorageAPI: function(requestType, asyncType, key, requestAction, successCallback, failCallback, queryData, queryStr, resource) {

        let secretKey = QStoragePlugin[key];
        failCallback = failCallback || null;
        queryData = queryData || null;
        queryStr = queryStr || "";
        resource = resource || "";

        function requestSuccess(data) {
            checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);

            var dataArr = [
                "Call API",
                requestAction,
                data['ResultCode']
            ];
            LogFile.createAndWriteFile(dataArr);
        }

        function requestError(data) {
            errorHandler(data, requestAction);
            if (failCallback) {
                failCallback();
            }
        }

        var signatureTime = QStoragePlugin.getSignature("getTime");
        var signatureInBase64 = QStoragePlugin.getSignature("getInBase64", signatureTime, secretKey);

        $.ajax({
            type: requestType,
            headers: {
                'App-Key': key + QStoragePlugin.env,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'Account': loginData['emp_no'],
                'Resource-ID': resource
            },
            url: serverURL + "/qstorage/public/v101/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData['uuid'] + queryStr,
            data: queryData,
            async: asyncType,
            processData: false,
            contentType: false,
            success: requestSuccess,
            error: requestError
        });
    },
    dataURLtoFile: function(url, file) {
        file = file || 'text.jpg';

        var arr = url.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], file, { type: mime });
    }
    
};