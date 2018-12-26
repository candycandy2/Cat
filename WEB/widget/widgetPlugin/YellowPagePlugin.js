var YellowPagePlugin = {

    appKey: "appyellowpage",
    appSecretKey: "c103dd9568f8493187e02d4680e1bf2f",
    env: appEnvironment,
    getSignature: function(action, signatureTime) {
        if (action === "getTime") {
            return Math.round(new Date().getTime() / 1000);
        } else {
            var hash = CryptoJS.HmacSHA256(signatureTime.toString(), YellowPagePlugin.appSecretKey);
            return CryptoJS.enc.Base64.stringify(hash);
        }
    },
    CustomAPI: function(requestType, asyncType, requestAction, successCallback, failCallback, queryData, queryStr) {

        failCallback = failCallback || null;
        queryData = queryData || null;
        queryStr = queryStr || "";

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
            errorHandler(data);
            if (typeof failCallback === "function") {
                failCallback();
            }
        }

        var signatureTime = YellowPagePlugin.getSignature("getTime");
        var signatureInBase64 = YellowPagePlugin.getSignature("getInBase64", signatureTime);

        $.ajax({
            type: requestType,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': YellowPagePlugin.appKey + YellowPagePlugin.env,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: serverURL + "/qplayApi/public/v101/custom/" + YellowPagePlugin.appKey + YellowPagePlugin.env + "/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
            dataType: "json",
            data: queryData,
            async: asyncType,
            cache: false,
            timeout: 30000,
            success: requestSuccess,
            error: requestError
        });

    }

};