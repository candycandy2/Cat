var EmpServicePlugin = {

    appKey: 'appqplay',
    appSecretKey: 'swexuc453refebraXecujeruBraqAc4e',
    env: appEnvironment,
    getSignature: function(action, signatureTime, secret) {
        if (action === "getTime") {
            return Math.round(new Date().getTime() / 1000);
        } else {
            var hash = CryptoJS.HmacSHA256(signatureTime.toString(), secret);
            return CryptoJS.enc.Base64.stringify(hash);
        }
    },
    QPlayAPI: function(requestType, requestAction, successCallback, failCallback, queryData, queryStr) {
        failCallback = failCallback || null;
        queryData = queryData || null;
        queryStr = queryStr || "";

        function requestSuccess(data) {
            checkTokenValid(data['result_code'], data['token_valid'], successCallback, data);

            var dataArr = [
                "Call API",
                requestAction,
                data['result_code']
            ];
            LogFile.createAndWriteFile(dataArr);
        }

        // review
        function requestError(data) {
            errorHandler(data, requestAction);
            if (failCallback) {
                failCallback();
            }
        }

        var signatureTime = EmpServicePlugin.getSignature("getTime");
        var signatureInBase64 = EmpServicePlugin.getSignature("getInBase64", signatureTime, EmpServicePlugin.appSecretKey);

        $.ajax({
            type: requestType,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': EmpServicePlugin.appKey + EmpServicePlugin.env,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token,
                'push-token': loginData.pushToken
            },
            url: serverURL + "/" + appApiPath + "/public/v101/qplay/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
            dataType: "json",
            data: queryData,
            cache: false,
            timeout: 30000,
            success: requestSuccess,
            error: requestError
        });
    }
    
};