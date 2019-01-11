var QForumPlugin = {

    appKey: "appqforum",
    appSecretKey: "c40a5073000796596c2ba5e70579b1e6",
    env: appEnvironment,
    getSignature: function(action, signatureTime) {
        if (action === "getTime") {
            return Math.round(new Date().getTime() / 1000);
        } else {
            var hash = CryptoJS.HmacSHA256(signatureTime.toString(), QForumPlugin.appSecretKey);
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

        var signatureTime = QForumPlugin.getSignature("getTime");
        var signatureInBase64 = QForumPlugin.getSignature("getInBase64", signatureTime);

        $.ajax({
            type: requestType,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': QForumPlugin.appKey + QForumPlugin.env,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: serverURL + "/qplayApi/public/v101/custom/" + QForumPlugin.appKey + QForumPlugin.env + "/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr,
            dataType: "json",
            data: queryData,
            async: asyncType,
            cache: false,
            timeout: 30000,
            success: requestSuccess,
            error: requestError
        });

    },
    createXMLDataString: function(data) {
        var XMLDataString = "";

        $.each(data, function(key, value) {
            XMLDataString += "<" + key + ">" + htmlspecialchars(value) + "</" + key + ">";
        });

        return XMLDataString;
    }

};