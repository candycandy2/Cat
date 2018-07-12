//CustomExByKey API
//priority == "high" "low" "", default == "high"
//expiredTimeSeconds == integer, default == 3600

function CustomAPIByKey(requestType, asyncType, key, secret, requestAction, successCallback, failCallback, queryData, queryStr, expiredTimeSeconds, priority) {
    //queryStr: start with [&], ex: &account=test&pwd=123

    failCallback = failCallback || null;
    queryData = queryData || null;
    queryStr = queryStr || "";
    expiredTimeSeconds = expiredTimeSeconds || 60 * 60;
    priority = priority || "high";

    if (loginData["versionName"].indexOf("Staging") !== -1) {
        key += "test";
    } else if (loginData["versionName"].indexOf("Development") !== -1) {
        key += "dev";
    } else {
        key += "";
    }

    var urlStr = serverURL + "/" + appApiPath + "/public/v101/custom/" + key + "/" + requestAction + "?lang=" + browserLanguage + "&uuid=" + loginData.uuid + queryStr;

    function requestSuccess(data) {
        var checkTokenValidResult = checkTokenValid(data['ResultCode'], data['token_valid'], successCallback, data);

        var dataArr = [
            "Call API",
            requestAction,
            data['ResultCode']
        ];
        LogFile.createAndWriteFile(dataArr);

        //Cache
        if (checkTokenValidResult === true) {
            // save data into localstorage
            var contentInfo = [];
            var nowTime = new Date();
            contentInfo.push({
                'result': data,
                'time': nowTime
            });
            localStorage.setItem(key, JSON.stringify(contentInfo));
        }
        //Cache...
    }

    // review by alan
    function requestError(data) {
        if (priority != "low") {
            errorHandler(data, requestAction);
            if (failCallback != null) {
                failCallback();
            }
        }
    }

    if (localStorage.getItem(key) === null) { } else {
        var storageData = JSON.parse(localStorage.getItem(key));
        if (checkDataExpired(storageData[0].time, expiredTimeSeconds, 'ss')) {
            localStorage.removeItem(key);
        }
    }

    if (localStorage.getItem(key) === null) {

        var signatureTime = getSignatureByKey("getTime");
        var signatureInBase64 = getSignatureByKey("getInBase64", signatureTime, secret);

        $.ajax({
            type: requestType,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': key,
                'Signature-Time': signatureTime,
                'Signature': signatureInBase64,
                'token': loginData.token
            },
            url: urlStr,
            dataType: "json",
            data: queryData,
            async: asyncType,
            cache: false,
            timeout: 30000,
            success: requestSuccess,
            error: requestError
        });
    } else {
        var storageData = JSON.parse(localStorage.getItem(key));
        successCallback(storageData[0].result);
    }

}